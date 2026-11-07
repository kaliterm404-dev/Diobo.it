"use client";
import { useState } from "react";

export function useTool<T>(endpoint: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  async function run(body: unknown) {
    setLoading(true); setError(null); setData(null);
    try {
      const r = await fetch(endpoint, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Errore inatteso.");
      setData(j as T);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore di rete.");
    } finally {
      setLoading(false);
    }
  }
  return { data, error, loading, run };
}
