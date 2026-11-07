// alpha-2 -> [nome italiano, codice numerico ISO usato da world-atlas]
export const COUNTRIES: Record<string, [string, string]> = {
  IT: ["Italia", "380"], DE: ["Germania", "276"], FR: ["Francia", "250"], GB: ["Regno Unito", "826"],
  ES: ["Spagna", "724"], NL: ["Paesi Bassi", "528"], PL: ["Polonia", "616"], SE: ["Svezia", "752"],
  RO: ["Romania", "642"], TR: ["Turchia", "792"], US: ["Stati Uniti", "840"], CA: ["Canada", "124"],
  MX: ["Messico", "484"], BR: ["Brasile", "076"], AR: ["Argentina", "032"], CL: ["Cile", "152"],
  ZA: ["Sudafrica", "710"], NG: ["Nigeria", "566"], AE: ["Emirati Arabi", "784"], IN: ["India", "356"],
  SG: ["Singapore", "702"], JP: ["Giappone", "392"], KR: ["Corea del Sud", "410"], ID: ["Indonesia", "360"],
  AU: ["Australia", "036"], NZ: ["Nuova Zelanda", "554"],
};

export const flag = (cc: string) =>
  cc.toUpperCase().replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));

export const countryName = (cc: string) => COUNTRIES[cc]?.[0] ?? cc;
