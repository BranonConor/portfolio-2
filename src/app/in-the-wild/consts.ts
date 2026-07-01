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
    title: "NIH announces the world's largest integrated health database",
    category: "Press",
    source: "The New York Times",
    role: "Design engineering contributor",
    link: "/in-the-wild/posts/nih-health-database",
    date: "June 2026",
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
