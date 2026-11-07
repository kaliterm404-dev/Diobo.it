export type ToolMeta = { slug: string; name: string; short: string; title: string; description: string; keywords: string[]; faq: [string, string][] };

export const TOOLS: ToolMeta[] = [
  {
    slug: "mondo", name: "Propagazione DNS e ping dal mondo", short: "DNS, ping, HTTP e traceroute da 26 paesi, su mappa",
    title: "Propagazione DNS dal mondo, ping e traceroute globali",
    description: "Controlla da 26 paesi se il tuo dominio risolve e risponde: propagazione DNS, ping, HTTP e traceroute da sonde reali, con mappa del mondo. Gratis.",
    keywords: ["propagazione dns", "dns checker", "controllo propagazione dns", "ping dal mondo", "traceroute online", "check host"],
    faq: [
      ["Quanto ci mette un DNS a propagarsi?", "Dipende dal TTL dei record e dalla cache dei resolver: di solito da pochi minuti a qualche ora, al massimo 48 ore per un cambio di nameserver. Questo strumento mostra paese per paese chi vede già il valore nuovo."],
      ["Perché alcuni paesi mostrano un IP diverso?", "Quei resolver hanno ancora in cache il valore precedente, oppure il dominio usa una CDN che risponde con IP diversi per area geografica. Il colore giallo segnala le risposte diverse dalla maggioranza."],
      ["Da dove partono i test?", "Da sonde reali della rete aperta Globalping, ospitate in data center e reti domestiche di oltre 120 paesi."],
    ],
  },
  {
    slug: "ip", name: "Qual è il mio IP", short: "IP pubblico, IPv4/IPv6, reverse DNS, posizione",
    title: "Qual è il mio indirizzo IP pubblico",
    description: "Scopri il tuo indirizzo IP pubblico (IPv4 o IPv6), il reverse DNS, la posizione indicativa e lo user-agent del browser. Senza pubblicità.",
    keywords: ["qual è il mio ip", "mio indirizzo ip", "ip pubblico", "what is my ip", "il mio ip"],
    faq: [
      ["Il mio IP pubblico è lo stesso del PC?", "No: il PC ha un IP privato della rete locale (es. 192.168.x.x). Su Internet esci con l'IP pubblico del router o dell'operatore, ed è quello mostrato qui."],
      ["Perché vedo un IPv6?", "La tua connessione supporta IPv6 e il browser lo preferisce. È normale e anzi è un buon segno."],
    ],
  },
  {
    slug: "dns", name: "DNS lookup", short: "Tutti i record DNS e confronto tra resolver",
    title: "DNS lookup online: record A, AAAA, MX, TXT, NS, CAA",
    description: "Interroga tutti i record DNS di un dominio (A, AAAA, CNAME, MX, NS, TXT, CAA, SOA) e confronta le risposte di Cloudflare e Google. PTR per gli IP.",
    keywords: ["dns lookup", "nslookup online", "dig online", "record mx", "controllo dns", "reverse dns"],
    faq: [
      ["A cosa serve il confronto tra resolver?", "Se Cloudflare e Google rispondono in modo diverso, un cambio DNS si sta ancora propagando oppure uno dei due ha in cache un valore vecchio."],
      ["Come faccio un reverse DNS?", "Inserisci un indirizzo IP invece di un dominio: lo strumento restituisce il record PTR associato."],
    ],
  },
  {
    slug: "mail", name: "Controllo email: SPF, DKIM, DMARC", short: "MX, SPF con conteggio lookup, DKIM, DMARC spiegato",
    title: "Verifica SPF, DKIM e DMARC del tuo dominio",
    description: "Controlla se le email del tuo dominio sono protette: MX, SPF con conteggio dei lookup (limite 10), DKIM sui selettori comuni e DMARC spiegato in italiano.",
    keywords: ["verifica spf", "controllo dmarc", "dkim checker", "spf too many lookups", "email finisce in spam", "spoofing email"],
    faq: [
      ["Perché le mie email finiscono in spam?", "Spesso manca o è sbagliato uno tra SPF, DKIM e DMARC. Senza questi record i provider non possono verificare che la mail venga davvero dal tuo dominio."],
      ["Cos'è il limite di 10 lookup SPF?", "Lo standard SPF permette al massimo 10 interrogazioni DNS (include, a, mx…). Oltre, il record è considerato non valido e le mail possono essere rifiutate."],
      ["Che differenza c'è tra p=none, quarantine e reject?", "Con none le mail false vengono consegnate e solo segnalate, con quarantine finiscono in spam, con reject vengono respinte."],
    ],
  },
  {
    slug: "ssl", name: "Controllo certificato SSL", short: "Scadenza, emittente, nomi coperti, catena, TLS",
    title: "Verifica certificato SSL/TLS di un sito",
    description: "Controlla il certificato HTTPS di un sito: validità, giorni alla scadenza, emittente, nomi coperti (SAN), versione TLS e catena dei certificati.",
    keywords: ["verifica certificato ssl", "ssl checker", "scadenza certificato", "controllo https", "tls check"],
    faq: [
      ["Cosa succede se il certificato scade?", "Il browser mostra un avviso di sito non sicuro e la maggior parte dei visitatori se ne va. Con Let's Encrypt il rinnovo dovrebbe essere automatico: se la scadenza è vicina, qualcosa nel rinnovo non funziona."],
    ],
  },
  {
    slug: "subnet", name: "Calcolatore subnet", short: "CIDR, maschera, broadcast, range host, IPv6",
    title: "Calcolatore subnet IPv4 e IPv6 (CIDR)",
    description: "Calcola rete, maschera, wildcard, broadcast, primo e ultimo host e numero di indirizzi da notazione CIDR o maschera. Supporta IPv4 e IPv6.",
    keywords: ["calcolatore subnet", "subnet calculator", "cidr calculator", "subnet mask", "calcolo sottorete"],
    faq: [
      ["Quanti host ha una /24?", "254 host utilizzabili su 256 indirizzi: il primo è l'indirizzo di rete e l'ultimo il broadcast."],
      ["Posso scrivere la maschera invece del prefisso?", "Sì: scrivi per esempio 192.168.1.1 255.255.255.0 e il calcolatore la converte in /24."],
    ],
  },
];

export const toolBySlug = (s: string) => TOOLS.find((t) => t.slug === s)!;
