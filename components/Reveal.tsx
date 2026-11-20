"use client";

// Comparsa allo scorrimento che non nasconde mai il testo in partenza.
//
// Con `initial={{ opacity: 0 }}` di motion l'HTML servito esce già invisibile e resta tale
// finché gli script non girano: senza JavaScript, o se uno script fallisce, la pagina è vuota.
// Qui l'HTML esce visibile. Solo dopo l'avvio, e solo per gli elementi ancora sotto lo schermo,
// l'elemento viene nascosto e poi fatto entrare quando arriva in vista. Chi è già in vista al
// caricamento resta fermo com'è.

import { useLayoutEffect, useRef, useState, type ComponentProps } from "react";
import { motion, useInView } from "motion/react";

type Margine = NonNullable<Parameters<typeof useInView>[1]>["margin"];

function useComparsa(viewport?: { once?: boolean; margin?: string }) {
  const ref = useRef<HTMLElement>(null);
  const [armato, setArmato] = useState(false);
  const inVista = useInView(ref, { once: viewport?.once ?? true, margin: viewport?.margin as Margine });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top > window.innerHeight) setArmato(true);
  }, []);
  return { ref, armato, nascosto: armato && !inVista };
}

const FERMO = { duration: 0 };

function crea<T extends "div" | "h2" | "p" | "a">(tag: T) {
  const Comp = motion[tag] as typeof motion.div;
  type Props = ComponentProps<(typeof motion)[T]>;
  function Comparsa({ initial, whileInView, viewport, transition, ...resto }: Props) {
    const { ref, armato, nascosto } = useComparsa(viewport as { once?: boolean; margin?: string } | undefined);
    return (
      <Comp
        ref={ref as React.Ref<HTMLDivElement>}
        initial={false}
        animate={(nascosto ? initial : whileInView) as ComponentProps<typeof motion.div>["animate"]}
        transition={armato && !nascosto ? transition : FERMO}
        {...(resto as ComponentProps<typeof motion.div>)}
      />
    );
  }
  Comparsa.displayName = `Reveal.${tag}`;
  return Comparsa as unknown as (typeof motion)[T];
}

export const Reveal = { div: crea("div"), h2: crea("h2"), p: crea("p"), a: crea("a") };
