"use client";
import { useMemo, useState } from "react";

const ip4ToInt = (s: string) => {
  const p = s.split(".").map(Number);
  if (p.length !== 4 || p.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) return null;
  return ((p[0] << 24) >>> 0) + (p[1] << 16) + (p[2] << 8) + p[3];
};
const intToIp4 = (n: number) => [24, 16, 8, 0].map((b) => (n >>> b) & 255).join(".");
const maskToPrefix = (m: string) => {
  const n = ip4ToInt(m);
  if (n === null) return null;
  const bits = n.toString(2).padStart(32, "0");
  return /^1*0*$/.test(bits) ? bits.indexOf("0") === -1 ? 32 : bits.indexOf("0") : null;
};

function v4(input: string) {
  const [ipPart, rest] = input.trim().split(/[\/\s]+/);
  const ip = ip4ToInt(ipPart);
  if (ip === null) return null;
  let prefix = rest === undefined ? 24 : /^\d+$/.test(rest) ? Number(rest) : maskToPrefix(rest);
  if (prefix === null || prefix < 0 || prefix > 32) return null;
  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
  const net = (ip & mask) >>> 0;
  const bc = (net | (~mask >>> 0)) >>> 0;
  const total = 2 ** (32 - prefix);
  const hosts = prefix >= 31 ? total : total - 2;
  const first = prefix >= 31 ? net : net + 1;
  const last = prefix >= 31 ? bc : bc - 1;
  const a = ip >>> 24;
  const cls = a < 128 ? "A" : a < 192 ? "B" : a < 224 ? "C" : a < 240 ? "D (multicast)" : "E";
  const priv = a === 10 || (a === 172 && ((ip >>> 16) & 255) >= 16 && ((ip >>> 16) & 255) <= 31) || (a === 192 && ((ip >>> 16) & 255) === 168);
  return [
    ["Rete", `${intToIp4(net)}/${prefix}`],
    ["Maschera", intToIp4(mask)],
    ["Wildcard", intToIp4(~mask >>> 0)],
    ["Broadcast", prefix >= 31 ? "—" : intToIp4(bc)],
    ["Primo host", intToIp4(first)],
    ["Ultimo host", intToIp4(last)],
    ["Host utilizzabili", hosts.toLocaleString("it-IT")],
    ["Indirizzi totali", total.toLocaleString("it-IT")],
    ["Classe / tipo", `${cls}${priv ? " · privato (RFC 1918)" : ""}`],
    ["Binario maschera", mask.toString(2).padStart(32, "0").replace(/(.{8})(?!$)/g, "$1.")],
  ];
}

function expand6(s: string) {
  if (!/^[0-9a-f:]+$/i.test(s) || (s.match(/::/g) || []).length > 1) return null;
  const [h, t] = s.split("::");
  const head = h ? h.split(":") : [];
  const tail = t !== undefined ? (t ? t.split(":") : []) : [];
  const fill = t !== undefined ? 8 - head.length - tail.length : 0;
  const parts = [...head, ...Array(fill).fill("0"), ...tail];
  if (parts.length !== 8 || parts.some((p) => p.length > 4 || p === "")) return null;
  return parts.reduce((acc, p) => (acc << BigInt(16)) + BigInt(parseInt(p, 16)), BigInt(0));
}
const fmt6 = (n: bigint) => {
  const g = Array.from({ length: 8 }, (_, i) => ((n >> BigInt(112 - i * 16)) & BigInt(0xffff)).toString(16));
  return g.join(":").replace(/(^|:)0(:0)+(:|$)/, "::").replace(/:{3,}/, "::");
};

function v6(input: string) {
  const [ipPart, rest] = input.trim().split("/");
  const ip = expand6(ipPart);
  const prefix = rest === undefined ? 64 : Number(rest);
  if (ip === null || !Number.isInteger(prefix) || prefix < 0 || prefix > 128) return null;
  const all = (BigInt(1) << BigInt(128)) - BigInt(1);
  const mask = prefix === 0 ? BigInt(0) : (all << BigInt(128 - prefix)) & all;
  const net = ip & mask;
  const last = net | (~mask & all);
  const size = BigInt(1) << BigInt(128 - prefix);
  return [
    ["Rete", `${fmt6(net)}/${prefix}`],
    ["Primo indirizzo", fmt6(net)],
    ["Ultimo indirizzo", fmt6(last)],
    ["Indirizzi", size > BigInt(10) ** BigInt(15) ? `2^${128 - prefix}` : size.toLocaleString("it-IT")],
    ["Sottoreti /64 contenute", prefix <= 64 ? (BigInt(1) << BigInt(64 - prefix)).toLocaleString("it-IT") : "—"],
  ];
}

export default function SubnetTool() {
  const [q, setQ] = useState("192.168.1.10/24");
  const rows = useMemo(() => (q.includes(":") ? v6(q) : v4(q)), [q]);
  return (
    <>
      <form className="tool-form" onSubmit={(e) => e.preventDefault()}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="10.0.0.0/22 · 192.168.1.1 255.255.255.0 · 2001:db8::/48" aria-label="Indirizzo e prefisso" spellCheck={false} />
      </form>
      {rows ? (
        <div className="tool-card tool-scroll">
          <h2>Risultato</h2>
          <table className="tool-table"><tbody>{rows.map(([k, v]) => <tr key={k}><th style={{ width: 200 }}>{k}</th><td className="mono">{v}</td></tr>)}</tbody></table>
        </div>
      ) : <p className="tool-err">Formato non valido. Esempi: 10.0.0.0/22, 192.168.1.1 255.255.255.0, 2001:db8::/48</p>}
    </>
  );
}
