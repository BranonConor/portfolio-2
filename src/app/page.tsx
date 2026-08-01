"use client";

import { BootIntro } from "@/components/boot-intro";

/**
 * The home route is just the GBA-style boot screen / cartridge picker —
 * every cartridge routes straight to a sub-route (BootIntro reads them
 * from src/lib/cartridges.ts), so there's no separate "home page" content
 * rendered underneath it anymore. The old hero/experience/education/
 * publications/showcase content that used to live here has been migrated
 * onto /about (Experience, Education, Honors, Publications) and /projects
 * (Showcase) instead, since neither was actually reachable once the
 * cartridge-first redesign meant landing here always leads to a sub-route.
 */
export default function Home() {
  return <BootIntro />;
}
