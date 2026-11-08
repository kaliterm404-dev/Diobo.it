"use client";

import { useState } from "react";

const SERVIZI = ["Sito web", "Assistenza IT", "Dominio ed email", "Grafica e logo", "Altro"];

export default function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [err, setErr] = useState("");
  const [t0] = useState(() => Date.now());

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setState("sending");
    try {
      const r = await fetch("/api/contatto", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...Object.fromEntries(f.entries()), t: t0 }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Errore");
      setState("ok");
    } catch (x) {
      setErr(x instanceof Error ? x.message : "Errore di rete.");
      setState("err");
    }
  }

  if (state === "ok") {
    return <p className="contact-ok">✓ Messaggio inviato. Ti rispondiamo da info@diobo.it.</p>;
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="contact-row">
        <label>Nome<input name="nome" required maxLength={80} autoComplete="name" /></label>
        <label>Email<input name="email" type="email" required maxLength={254} autoComplete="email" /></label>
      </div>
      <label>Di cosa hai bisogno
        <select name="servizio" defaultValue="">
          <option value="" disabled>Scegli…</option>
          {SERVIZI.map((s) => <option key={s}>{s}</option>)}
        </select>
      </label>
      <label>Messaggio<textarea name="messaggio" required minLength={10} maxLength={4000} rows={5} /></label>
      {/* campo esca per i bot: invisibile alle persone */}
      <input name="sito" tabIndex={-1} autoComplete="off" aria-hidden="true" className="contact-hp" />
      <button disabled={state === "sending"}>{state === "sending" ? "INVIO…" : "INVIA"}</button>
      {state === "err" && <p className="tool-err">{err}</p>}
      <p className="contact-note">Oppure scrivi a <a href="mailto:info@diobo.it">info@diobo.it</a>. I dati servono solo a risponderti: <a href="/privacy">privacy</a>.</p>
    </form>
  );
}
