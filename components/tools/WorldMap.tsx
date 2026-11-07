"use client";

import { useMemo } from "react";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import world from "world-atlas/countries-110m.json";
import { COUNTRIES, countryName, flag } from "./countries";

export type MapPoint = { country: string; lat: number; lon: number; state: "ok" | "diff" | "bad" };

const W = 960, H = 470;
const COLOR = { ok: "#4ade80", diff: "#fbbf24", bad: "#f87171" };

export default function WorldMap({ points }: { points: MapPoint[] }) {
  const { paths, project } = useMemo(() => {
    const topo = world as unknown as Topology<{ countries: GeometryCollection }>;
    const fc = feature(topo, topo.objects.countries) as unknown as GeoJSON.FeatureCollection;
    const proj = geoNaturalEarth1().fitSize([W, H], fc);
    const gen = geoPath(proj);
    return {
      paths: fc.features.filter((f) => f.id !== "010").map((f) => ({ id: String(f.id), d: gen(f) || "" })),
      project: (lon: number, lat: number) => proj([lon, lat]) as [number, number],
    };
  }, []);

  const byNum = new Map<string, MapPoint>();
  points.forEach((p) => { const n = COUNTRIES[p.country]?.[1]; if (n) byNum.set(n, p); });

  return (
    <div className="tool-map">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Mappa dei risultati per paese">
        {paths.map((p) => {
          const hit = byNum.get(p.id);
          return (
            <path key={p.id} d={p.d}
              fill={hit ? COLOR[hit.state] : "rgba(99,102,241,0.12)"}
              fillOpacity={hit ? 0.55 : 1}
              stroke="rgba(165,180,252,0.25)" strokeWidth={0.5}>
              {hit && <title>{`${flag(hit.country)} ${countryName(hit.country)}`}</title>}
            </path>
          );
        })}
        {points.map((p, i) => {
          const [x, y] = project(p.lon, p.lat);
          return <circle key={i} cx={x} cy={y} r={4.5} fill={COLOR[p.state]} stroke="#05050f" strokeWidth={1.5} />;
        })}
      </svg>
      <div className="tool-legend">
        <span><i style={{ background: COLOR.ok }} /> risponde come la maggioranza</span>
        <span><i style={{ background: COLOR.diff }} /> risposta diversa</span>
        <span><i style={{ background: COLOR.bad }} /> non risolve / non raggiungibile</span>
      </div>
    </div>
  );
}
