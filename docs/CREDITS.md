# Credits & Asset Licenses — Walkable Portfolio World

The walkable "cozy town" experience is **inspired by** the vibe of cozy farming-sim
games. It uses **no** copyrighted game assets (no Stardew Valley sprites, tilesets,
music, fonts, characters, or names). Everything is either original work or
permissively-licensed (CC0-first) open assets.

## Current status (Phase 2)

All in-world visuals are **original pixel art authored in-repo** as character-grid sprite
data (`src/game/spriteData.js`) and rendered to canvas sprites at runtime
(`src/game/pixelArt.ts`). There are **no external / third-party art assets in the bundle** —
nothing is copied from any asset pack or game.

## Art direction (confirmed by Branon)

**Bespoke / original pixel art**, authored for Branon's brand — tied to his existing
paint-stroke / playful identity and color palette (blue `#60a5fa` → purple `#a78bfa`,
pink `#f472b6`, near-black `#09090b`). Original / CC0 preferred; CC-BY acceptable **only**
with correct attribution here.

Sequencing (so the build isn't blocked):
- **Phase 0–1:** clearly-labeled placeholder shapes to get the world walkable fast.
- **Phase 2:** original pixel art for the player, buildings, and decor tiles — authored
  in-repo (`src/game/spriteData.js`) as original pixel grids. **No third-party asset
  packs.** Rendered to sprites at runtime; nothing copied.

### Placeholder vs bespoke (Phase 2)
| Asset | Status | Notes for a future human pixel artist |
|---|---|---|
| Player character | Bespoke (original grid) | Add more walk frames + idle blink; refine shading. |
| Buildings (7) | Bespoke (original grids) | More per-section silhouette variety + interior peeks. |
| Ground / path / decor tiles | Bespoke (original grids) | Seasonal variants, animated water/foliage. |
| Hero / branding tiles | TODO | Best place for a human artist to inject brand polish. |

## Code dependencies

| Package | License | Use |
|---|---|---|
| [Kaplay](https://kaplayjs.com/) | MIT | 2D game engine (rendering, input, collision, camera). |

> Rule: everything shipping today is **original**. If any CC0/CC-BY external asset is ever
> added, it must be listed here (author, source URL, license) before it ships — CC0 first,
> CC-BY only with attribution.
