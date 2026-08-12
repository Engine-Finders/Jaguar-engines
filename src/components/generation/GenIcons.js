const paths = {
  chart: "M5 19V9m5 10V5m5 14v-7m5 7H3",
  tool: "m14.7 6.3 3-3a4 4 0 0 1 0 5.7l-1.4 1.4-2.7-2.7L7 14.3V17H4.3l6.6-6.6-2.7-2.7 1.4-1.4a4 4 0 0 1 5.1 0Z",
  book: "M4 6.5A2.5 2.5 0 0 1 6.5 4H11v16H6.5A2.5 2.5 0 0 0 4 22V6.5Zm16 0A2.5 2.5 0 0 0 17.5 4H13v16h4.5A2.5 2.5 0 0 1 20 22V6.5Z",
  trophy: "M8 4h8v4a4 4 0 0 1-8 0V4Zm0 2H4v2a3 3 0 0 0 4 2.8M16 6h4v2a3 3 0 0 1-4 2.8M12 12v5m-3 3h6m-7 0h8",
  shield: "M12 3 5 6v6c0 5 3.3 8.8 7 9 3.7-.2 7-4 7-9V6l-7-3Zm-2 9 1.6 1.6L15 10",
  wrench: "m14.7 6.3 3-3a4 4 0 0 1 0 5.7l-1.4 1.4-2.7-2.7L7 14.3V17H4.3l6.6-6.6-2.7-2.7 1.4-1.4a4 4 0 0 1 5.1 0Z",
  check: "m5 12 4 4L19 6",
  truck: "M5 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16M4 21h13M16 8h2l2 2v8a2 2 0 0 1-4 0v-5h4M8 7h5",
  badge: "M8 4h8v4a4 4 0 0 1-8 0V4Zm0 2H4v2a3 3 0 0 0 4 2.8M16 6h4v2a3 3 0 0 1-4 2.8M12 12v5m-3 3h6m-7 0h8",
  scale: "M12 3v18M7 7 4 13a3 3 0 0 0 6 0L7 7Zm10 0-3 6a3 3 0 0 0 6 0l-3-6ZM4 7h6m4 0h6M9 21h6",
  warning: "M12 9v4m0 4h.01M10 4.9 2.6 18a2 2 0 0 0 1.74 3h15.32A2 2 0 0 0 21.4 18L14 4.9a2 2 0 0 0-3.48 0Z",
  dollar: "M17 6.5A5 5 0 0 0 8 9v8m-3 0h10M6 13h7",
  diamond: "m12 3 7 7-7 11L5 10l7-7Z",
  crown: "m3 8 4 3 5-6 5 6 4-3-2 10H5L3 8Zm4 11h10",
  fire: "M12 3s1 2.5 1 4.5S11 11 11 11s.3-3-1.5-5.5C7.2 8 6 10 6 13a6 6 0 0 0 12 0c0-3.2-1.8-5.7-4.5-8.2.1 1.7-.2 3.1-1.5 4.7",
  car: "M5 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16M3 13l1.5-5A2 2 0 0 1 6.4 6.5h11.2a2 2 0 0 1 1.9 1.5L21 13v6a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H6v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6Zm3.5 1.5h.01M17.5 14.5h.01",
  engine: "M3 12h3m12 0h3M7 9h10v6H7V9Zm2-3h6m-3 0V3M5 15v3m14-3v3M9 18h6",
  arrow: "M5 12h14m-6-6 6 6-6 6",
  chevron: "m9 6 6 6-6 6",
  chevronDown: "m6 9 6 6 6-6",
  plus: "M12 5v14M5 12h14",
  info: "M12 8h.01M11 12h1v5h1M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z",
  gauge: "M12 3a9 9 0 0 0-9 9 8.9 8.9 0 0 0 2.1 5.8.8.8 0 0 0 1.2.1L12 12l7-3.6a.8.8 0 0 0 .3-1.2A9 9 0 0 0 12 3Z",
  clock: "M12 7v5l3.5 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  tag: "M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L3 13V3h10l7.59 7.59a2 2 0 0 1 0 2.82ZM7 7h.01",
  refresh: "M21 12a9 9 0 0 1-15.5 6.36M3 12a9 9 0 0 1 15.5-6.36M21 3v6h-6M3 21v-6h6",
  pin: "M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Zm0-8.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  target: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-4.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0-3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM21 3l-5.5 5.5",
  cart: "M3 4h2l2.4 12.2a2 2 0 0 0 2 1.8h7.6a2 2 0 0 0 2-1.6L21 8H6M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm9 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
};

export default function GenIcon({ name, className = "h-5 w-5" }) {
  if (name === "ear") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 13a4 4 0 1 1 8 0c0 2-1 3-2 4-.7.7-1 1.3-1 2.5a2.5 2.5 0 0 1-5 0" />
        <path d="M8 13c0-4.4 3.6-8 8-8" />
      </svg>
    );
  }

  if (name === "clipboardCheck") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="4" width="14" height="17" rx="1.5" />
        <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
        <path d="m9 13 2 2 4-4" />
      </svg>
    );
  }

  if (name === "cloud") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 18a4 4 0 0 1-1-7.9A5 5 0 0 1 15.5 8a4.5 4.5 0 0 1 1.5 8.7" />
        <path d="M7 18h9" />
      </svg>
    );
  }

  if (name === "fan") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="1.5" />
        <path d="M12 10.5c-1-2-.5-4.5 1-6 1.7-1.7 4-1.5 4.5 0s-.5 3-2.5 4c2.2-.2 4.3.8 5 2.5.7 1.7-.5 3.5-2 3-1.5-.5-2.5-2-3-4 .5 2 0 4.5-1.5 6-1.7 1.7-4 1.5-4.5 0s.5-3 2.5-4c-2.2.2-4.3-.8-5-2.5-.7-1.7.5-3.5 2-3 1.5.5 2.5 2 3 4Z" />
      </svg>
    );
  }

  if (name === "exhaust") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="9" width="10" height="6" rx="1.5" />
        <path d="M12 12h6" />
        <rect x="18" y="10" width="4" height="4" rx="1" />
        <path d="M5 9V7m3 2V7" />
      </svg>
    );
  }

  if (name === "oilDrop") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3s6 7 6 11.5a6 6 0 0 1-12 0C6 10 12 3 12 3Z" />
        <path d="M9.5 15a2.5 2.5 0 0 0 2.5 2.5" />
      </svg>
    );
  }

  if (name === "engineWarning") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12h3m9-3h2l2 2v6h-2M7 9h7v7H7z" />
        <path d="M9 9V6h3v3" />
        <circle cx="9" cy="16.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (name === "clipboardSearch") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="4" width="14" height="17" rx="1.5" />
        <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
        <circle cx="10.5" cy="13.5" r="2.5" />
        <path d="m14 17-2-2" />
      </svg>
    );
  }

  if (name === "drum") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="3" width="14" height="18" rx="1.5" />
        <path d="M5 9h14M5 15h14M8 3v18M16 3v18" />
      </svg>
    );
  }

  if (name === "users") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
        <path d="M16 4.2a3 3 0 0 1 0 5.6M20 20c0-2.7-1.8-5-4.3-5.7" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[name] || paths.info} />
    </svg>
  );
}
