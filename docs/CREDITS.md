# Credits & Asset Licenses — Walkable Portfolio World

The walkable "cozy town" experience is **inspired by** the vibe of cozy farming-sim
games. It uses **no** copyrighted game assets (no Stardew Valley sprites, tilesets,
music, fonts, characters, or names). Everything is either original work or
permissively-licensed (CC0-first) open assets.

## Current status (Phase 0 / Phase 1)

All in-world visuals are **procedurally drawn programmer-art** (colored rectangles
generated at runtime in `src/game/bootWorld.ts`). There are **no external art assets in
the bundle yet**.

## Code dependencies

| Package | License | Use |
|---|---|---|
| [Kaplay](https://kaplayjs.com/) | MIT | 2D game engine (rendering, input, collision, camera). |

## Planned art sources (Phase 2 — to be filled in as assets are added)

When real pixel art is introduced, every asset will be listed here with author, source
URL, and license. Candidate sources (CC0 preferred):

- **Kenney.nl** — CC0 top-down / farm / roguelike packs.
- **itch.io** — curated CC0 cozy farm/town tilesets & character bases.
- **OpenGameArt / LPC** — CC-BY-SA / GPL (used only with correct attribution).
- **Original pixel art** — authored for this project.

> Rule: CC0 first. Any CC-BY / CC-BY-SA asset must be attributed here before it ships.
