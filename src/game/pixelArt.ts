// Runtime pixel-art renderer: turns the original sprite grids in spriteData.js
// into <canvas> images that Kaplay loads as sprites. Nothing is fetched over the
// network — all art is generated in-browser from our own data.
import type { KaboomCtx } from "kaplay";
import * as SData from "./spriteData.js";

// The sprite data is a plain-JS module of pixel grids; treat it loosely.
const S = SData as any;

type RGBA = [number, number, number, number];
type Grid = string[];
type Override = Record<string, number[]>;

const PALETTE: Record<string, number[]> = S.PALETTE;

function colorFor(ch: string, override: Override): RGBA | null {
  if (ch === ".") return null;
  let c = override[ch] || PALETTE[ch];
  if (!c) return null;
  if (c.length === 3) return [c[0], c[1], c[2], 255];
  return [c[0], c[1], c[2], c[3]];
}

/** Render a single char-grid to a fresh canvas (1px per cell; scaling is done
 *  by the game camera / sprite scale, keeping crisp pixels). */
export function gridToCanvas(grid: Grid, override: Override = {}): HTMLCanvasElement {
  const h = grid.length;
  const w = grid[0].length;
  const cv = document.createElement("canvas");
  cv.width = w;
  cv.height = h;
  const ctx = cv.getContext("2d")!;
  const img = ctx.createImageData(w, h);
  for (let y = 0; y < h; y++) {
    const row = grid[y];
    for (let x = 0; x < w; x++) {
      const col = colorFor(row[x], override);
      if (!col) continue;
      const i = (y * w + x) * 4;
      img.data[i] = col[0];
      img.data[i + 1] = col[1];
      img.data[i + 2] = col[2];
      img.data[i + 3] = col[3];
    }
  }
  ctx.putImageData(img, 0, 0);
  return cv;
}

/** Lay several equal-height frames left-to-right into one atlas canvas. */
function framesToAtlas(frames: Grid[]): HTMLCanvasElement {
  const fw = frames[0][0].length;
  const fh = frames[0].length;
  const cv = document.createElement("canvas");
  cv.width = fw * frames.length;
  cv.height = fh;
  const ctx = cv.getContext("2d")!;
  frames.forEach((f, i) => {
    ctx.drawImage(gridToCanvas(f), i * fw, 0);
  });
  return cv;
}

/** Draw an 8x8 emblem centered over a building's door area. */
function compositeBuilding(id: string): HTMLCanvasElement {
  const theme = S.BUILDING_THEME[id];
  const base: Grid = S.BASES[theme.base];
  const override: Override = { R: theme.R, r: theme.r, M: theme.M, A: theme.A };
  const cv = gridToCanvas(base, override);
  const ctx = cv.getContext("2d")!;
  const em: Grid | undefined = S.emblems[id];
  if (em) {
    // Emblem tinted to the trim color for contrast against the door.
    const emCv = gridToCanvas(em, { W: theme.M });
    const doorTop = theme.base === "cottage" ? 17 : 18;
    ctx.drawImage(emCv, Math.floor(cv.width / 2 - 4), doorTop);
  }
  return cv;
}

export const PLAYER_FRAME = { w: 14, h: 16 };

/**
 * Loads every world sprite into the Kaplay context from in-memory canvases.
 * Sprite names used by bootWorld:
 *  - tiles: "t_grass", "t_path", "t_water"
 *  - decor: "d_tree", "d_bush", "d_flower"
 *  - player atlas: "player" (6 frames) with anims walk-down/up/side
 *  - buildings: "bld_<id>"
 */
export function loadWorldSprites(k: KaboomCtx): void {
  k.loadSprite("t_grass", gridToCanvas(S.grass).toDataURL());
  k.loadSprite("t_path", gridToCanvas(S.path).toDataURL());
  k.loadSprite("t_water", gridToCanvas(S.water).toDataURL());
  k.loadSprite("d_tree", gridToCanvas(S.tree).toDataURL());
  k.loadSprite("d_bush", gridToCanvas(S.bush).toDataURL());
  k.loadSprite("d_flower", gridToCanvas(S.flower).toDataURL());

  const atlas = framesToAtlas([
    S.player_down_a,
    S.player_down_b,
    S.player_up_a,
    S.player_up_b,
    S.player_side_a,
    S.player_side_b,
  ]);
  k.loadSprite("player", atlas.toDataURL(), {
    sliceX: 6,
    sliceY: 1,
    anims: {
      "walk-down": { from: 0, to: 1, loop: true, speed: 6 },
      "idle-down": { from: 0, to: 0 },
      "walk-up": { from: 2, to: 3, loop: true, speed: 6 },
      "idle-up": { from: 2, to: 2 },
      "walk-side": { from: 4, to: 5, loop: true, speed: 6 },
      "idle-side": { from: 4, to: 4 },
    },
  });

  for (const id of Object.keys(S.BUILDING_THEME)) {
    k.loadSprite(`bld_${id}`, compositeBuilding(id).toDataURL());
  }
}
