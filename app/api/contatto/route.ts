import nodemailer from "nodemailer";
import { clientIp, json, limited } from "@/lib/net";

export const runtime = "nodejs";
export const maxDuration = 20;

const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]{1,64}@[a-z0-9.-]{1,253}\.[a-z]{2,63}$/i;
const clean = (v: unknown, max: number) => String(v ?? "").replace(/\r/g, "").trim().slice(0, max);

export async function POST(request: Request) {
  const ip = clientIp(request);
  if (limited("contatto:" + ip, 3, 10 * 60_000)) return json({ error: "Hai già inviato alcuni messaggi. Riprova tra qualche minuto o scrivi direttamente a info@diobo.it." }, 429);

  const b = await request.json().catch(() => ({}));
  // Anti-spam: campo esca invisibile e tempo minimo di compilazione
  if (b.sito || (typeof b.t === "number" && Date.now() - b.t < 3000)) return json({ ok: true });

  const nome = clean(b.nome, 80);
  const email = clean(b.email, 254);
  const messaggio = clean(b.messaggio, 4000);
  const servizio = clean(b.servizio, 60);
  if (!nome || !EMAIL_RE.test(email) || messaggio.length < 10) {
    return json({ error: "Controlla nome, email e messaggio (almeno 10 caratteri)." }, 400);
  }
  if (!process.env.BREVO_SMTP_KEY || !process.env.BREVO_SMTP_LOGIN) {
    return json({ error: "Il modulo non è ancora attivo: scrivi a info@diobo.it." }, 503);
  }

  const tx = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: { user: process.env.BREVO_SMTP_LOGIN, pass: process.env.BREVO_SMTP_KEY },
  });

  try {
    await tx.sendMail({
      from: '"Modulo diobo.it" <info@diobo.it>',
      to: "info@diobo.it",
      replyTo: { name: nome, address: email },
      subject: `Richiesta dal sito: ${servizio || "contatto"} — ${nome}`,
      text: `Nome: ${nome}\nEmail: ${email}\nServizio: ${servizio || "-"}\n\n${messaggio}\n\n—\nInviato dal modulo di www.diobo.it`,
    });
    return json({ ok: true });
  } catch {
    return json({ error: "Invio non riuscito. Scrivi direttamente a info@diobo.it." }, 502);
  }
}
