export interface WildItem {
  title: string;
  // Category drives the filter chips. Add new values freely — the listing
  // page derives its filters from whatever categories are present here.
  category: "Press" | "Shipped";
  // Where it appeared / what it shipped under, e.g. "The New York Times",
  // "GitHub". Shown as a muted source line on the card.
  source: string;
  // Honest, specific credit line — what I actually did. Keeps this a
  // "contributed to" list, not a "took credit for" list.
  role: string;
  // Internal post path (e.g. "/in-the-wild/posts/...") OR a full external
  // URL when `external` is true.
  link: string;
  // When true, the card links out (new tab) instead of to an internal post.
  external?: boolean;
  // "Month YYYY"
  date: string;
}

export const inTheWild: WildItem[] = [
  {
    title: "Secret scanning public monitoring for enterprises",
    category: "Shipped",
    source: "GitHub",
    role: "Design engineer shipping UI features & polish",
    link: "https://github.blog/changelog/2026-07-01-secret-scanning-public-monitoring-for-enterprises/",
    external: true,
    date: "July 2026",
  },
  {
    title: "NIH announces the world's largest integrated health database",
    category: "Press",
    source: "The New York Times",
    role: "Design engineering contributor",
    link: "/in-the-wild/posts/nih-health-database",
    date: "June 2026",
  },
  {
    title: "Smartsheet's redesign is a bold leap into AI, accessibility, and a user-centered experience",
    category: "Press",
    source: "DesignRush",
    role: "Design engineer on the design systems team behind the redesign",
    link: "/in-the-wild/posts/smartsheet-redesign",
    date: "October 2024",
  },
  {
    title: "Smartsheet's new app loading screen is now generally available",
    category: "Shipped",
    source: "Smartsheet",
    role: "Co-designed and fully implemented the new platform-wide loading experience",
    link: "/in-the-wild/posts/smartsheet-loading-screen",
    date: "August 2025",
  },
  {
    title: "Secret scanning improvements to extended metadata checks",
    category: "Shipped",
    source: "GitHub",
    role: "Design engineer - built the alert metadata table UI",
    link: "https://github.blog/changelog/2026-02-18-secret-scanning-improvements-to-extended-metadata-checks/",
    external: true,
    date: "February 2026",
  },
  {
    title: "DCTclock - TIME Best Inventions of 2021",
    category: "Press",
    source: "TIME",
    role: "UX engineer at Linus Health",
    link: "https://time.com/collections/best-inventions-2021/6113080/dctclock/",
    external: true,
    date: "November 2021",
  },

  // ── Add future credits here ──────────────────────────────────────────────
  // Example "Shipped" entry (uncomment + fill in when the GA lands):
  // {
  //   title: "Secret Scanning Public Monitoring — general availability",
  //   category: "Shipped",
  //   source: "GitHub",
  //   role: "Design engineering support",
  //   link: "https://github.blog/...",
  //   external: true,
  //   date: "July 2026",
  // },
];
