# Stardew-inspired Walkable Portfolio World — Build Plan

> Experiment branch: `branonconor-branonconor-stardew-world` (off `main`). The existing
> classic site stays fully intact, reachable, and revertible until Branon loves it.

## 1. Vision & Content Mapping

A cozy top-down (2D) pixel town/farm that the visitor walks around with WASD / arrow
keys (plus mobile touch controls). The **game IS the homepage experience** — it replaces
the `/` *experience*, not the accessible content. Walking up to a building and pressing
**E** (or tapping) opens the existing MDX/section content inside a themed in-world panel.

Content is **reused, never duplicated** — panels pull from the existing
`consts.ts` files, MDX posts, and section components already in the repo.

| In-world place | Portfolio section | Existing source |
|---|---|---|
| 🛠️ Workshop / Barn | Projects | `src/app/projects/consts.ts` + `posts/*` |
| 📚 Library / Cafe | Blog / Writing | `src/app/blog/posts/*` |
| 🎤 Town Hall / Stage | Community Engagements | `src/app/engagements/consts.ts` + `posts/*` |
| 🖼️ Gallery | In the Wild | `src/app/in-the-wild/consts.ts` + `posts/*` |
| 🏡 Farmhouse | About / Experience / Hero | `src/app/about/page.tsx`, hero + experience data in `page.tsx` |
| 🎵 Record Shop / Jukebox | Music | `src/components/sections/Music.tsx` (Spotify) |
| 📷 Gallery Wall | Photography | `src/components/sections/Photography.tsx` |
| 📄 Mailbox / Sign | Resume + contact | `public/resume.pdf`, existing links |

A "showcase" easter-egg spot can reuse the existing `PortraitCanvas` easter egg.

## 2. Tech Approach

Current stack: Next.js 15 (app router), React 19, Chakra UI, Emotion, Framer Motion,
MDX. The repo **already ships a hand-rolled `<canvas>` + `requestAnimationFrame`
animation loop** (`src/components/easter-egg/PortraitCanvas.tsx`), so client-only canvas
rendering is a proven pattern here.

### Recommended engine: **Kaplay** (the maintained successor to Kaboom.js)

Why Kaplay over the alternatives:

- **Kaplay** — tiny, batteries-included 2D game lib: sprites, animation, AABB
  collision, camera, scenes, input, tilemaps via `addLevel()`. Fast to build a cozy
  walkable world; MIT licensed; ~small footprint; renders to a single canvas we can
  mount in a client-only React component. **Best fit for scope + speed.**
- **Phaser 3** — very powerful, but heavier (~1MB+), more boilerplate, more than we need
  for a walk-and-interact experience.
- **Hand-rolled canvas** — max control + zero deps and matches the existing easter egg,
  but we'd rebuild tilemaps, collision, camera, and animation ourselves = slower to a
  polished result. Good fallback if we want zero new deps.

**Recommendation: Kaplay**, with hand-rolled canvas as the documented fallback if Branon
prefers zero new runtime dependencies.

### Integration architecture

- **Client-only mount**: `GameWorld` component loaded via
  `dynamic(() => import(...), { ssr: false })` with a loading screen. Keeps it out of
  SSR and out of the initial bundle.
- **Tile map**: authored in **Tiled** and exported as JSON (or a compact hand-authored
  JSON grid for Phase 1). Layers: ground, decor, collision, interaction-zones.
- **Sprites/animation**: sprite sheets with named frame animations (idle/walk N/S/E/W)
  for the player; static/animated props for buildings.
- **Collision**: AABB against the collision layer; buildings + world bounds block
  movement.
- **Camera**: follows the player with clamping to map bounds.
- **Interaction zones**: invisible trigger rects in front of each building; entering one
  shows a "Press E" prompt; pressing E / tapping emits an event.
- **In-world UI on top of canvas**: the game emits interaction events to React; a Chakra
  + Framer Motion **panel/modal overlay** (absolutely positioned over the canvas)
  renders the existing React/MDX content. The canvas is purely the world; all rich
  content stays in React/MDX so it remains real DOM (good for a11y inside the panel).

## 3. Critical Constraints

### 3.1 Licensing / Copyright — HARD RULE
- **No Stardew Valley assets whatsoever** — no sprites, tilesets, music, fonts, names, or
  characters. The vibe is *"inspired by cozy farming-sim games,"* never copied.
- Art comes **only** from: (a) original pixel art we create, or (b) **CC0 /
  permissively-licensed** packs — e.g. **Kenney.nl (CC0)**, **LPC (CC-BY-SA / GPL,
  attribution)**, itch.io **CC0** cozy/farm tilesets.
- Maintain `docs/CREDITS.md` (and an in-game credits sign) listing every asset, its
  author, source URL, and license. Prefer CC0 to avoid attribution-chain complexity;
  where CC-BY is used, attribute correctly.
- Any placeholder art in early phases will be clearly-labeled temporary CC0 or
  programmer-art shapes.

### 3.2 Accessibility & SEO — content stays reachable
- A canvas game is opaque to screen readers, SEO, and keyboard-only/low-motion users, so:
  - **Preserve every existing route** (`/projects`, `/blog`, `/engagements`,
    `/in-the-wild`, `/about`, all MDX posts). Content stays crawlable via existing pages.
  - Add a **persistent, obvious "Switch to classic site" toggle** and preserve the full
    classic homepage at a stable route (e.g. move current `page.tsx` to `/classic` and/or
    keep it behind a toggle). Persist the visitor's choice (localStorage) so returning /
    a11y users aren't forced back into the game.
  - **Honor `prefers-reduced-motion`**: auto-offer the classic/static experience (or a
    reduced, non-animated map) and never trap a reduced-motion user in the game.
  - In-world panels use real Chakra/MDX DOM with focus management, ESC-to-close, and
    keyboard operability.
  - `<noscript>` and no-WebGL/canvas fallback → classic site.

### 3.3 Performance
- Lazy-load the engine + assets (dynamic import, `ssr:false`); keep initial route bundle
  reasonable.
- Loading screen while assets stream in; target smooth **60fps** (fixed-timestep update,
  sprite atlases, cap draw calls).
- Pause the RAF loop when the tab is hidden or a panel is open; unload on route change.

## 4. Phased Build

**Phase 0 — Tech spike + asset sourcing**
- Add Kaplay behind a dynamic client-only component; render a single canvas + a moving
  placeholder square driven by WASD to validate loop, input, camera in Next 15 / React 19.
- Decide Tiled-vs-hand-authored map. Draft `docs/CREDITS.md` and shortlist CC0 asset
  packs (Kenney cozy/farm, an itch.io CC0 tileset). No copyrighted assets.

**Phase 1 — Walkable world + one real building**
- Placeholder tile map with ground + collision + world bounds, player sprite with 4-dir
  walk animation, camera follow.
- One building (Workshop → Projects) with an interaction zone that opens a themed panel
  rendering the real `projects/consts.ts` list, linking to existing MDX posts.
- "Switch to classic site" toggle wired; classic homepage preserved at a route.

**Phase 2 — All sections + polished art + panels**
- Map remaining places (Blog, Engagements, In-the-Wild, About, Music, Photography).
- Swap placeholders for cohesive CC0 / original art; decor, signage, ambient animation.
- Themed panel system reused across all buildings; music spot embeds existing Spotify;
  photography spot reuses existing gallery.

**Phase 3 — Mobile, reduced-motion/classic, perf pass**
- On-screen touch D-pad + interact button; tap-to-interact.
- `prefers-reduced-motion` handling + reduced/static mode; persist classic-vs-game choice.
- Perf: atlas packing, bundle check, RAF pause rules, loading screen polish, 60fps verify.

## 5. New Dependencies (to be flagged for approval)
- `kaplay` (MIT) — 2D game engine. *(Only new runtime dep; skipped entirely if we take
  the hand-rolled-canvas fallback.)*
- Dev-only (optional): Tiled (external editor, not an npm dep) for map authoring.

## 6. Art Asset Sources (candidates, all CC0 unless noted)
- **Kenney.nl** — CC0 top-down / roguelike / farm packs.
- **itch.io** — curated CC0 cozy farm/town tilesets + character bases.
- **LPC (OpenGameArt)** — large character/tile set (CC-BY-SA / GPL) — use only with
  correct attribution; prefer CC0 first.
- Original pixel art authored by us for hero/branding-specific tiles.
- All tracked in `docs/CREDITS.md`.

## 7. Top 3 Decisions Needed From Branon
1. **Engine**: Go with **Kaplay** (one new MIT dep, fastest to polish) — or insist on
   **zero new deps** (hand-rolled canvas, more build time)?
2. **Default landing experience**: Should first-time visitors land in the **game** (with a
   prominent "classic site" toggle), or land on the **classic site** with an
   opt-in "Enter the world" button? (Affects SEO/first impression.)
3. **Art direction**: Prioritize **speed** (cohesive CC0 pack like Kenney, minimal custom
   art) or **bespoke identity** (more original pixel art authored for Branon's brand,
   slower)? And is CC-BY (attribution) acceptable, or **CC0-only**?

## 8. Isolation Note
All work stays on this experiment branch. Another session is concurrently doing
Stripe-inspired polish on a different branch — we do not touch or depend on its work.
