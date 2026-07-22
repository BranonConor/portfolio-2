import kaplay, { type GameObj } from "kaplay";
import {
  BUILDINGS,
  MAP_TILES_HIGH,
  MAP_TILES_WIDE,
  TILE,
  WORLD_SCALE,
  type BuildingId,
} from "./config";
import { loadWorldSprites } from "./pixelArt";

export interface WorldHandle {
  destroy: () => void;
  setPaused: (paused: boolean) => void;
}

export interface WorldCallbacks {
  onInteract: (buildingId: BuildingId) => void;
  onNearbyChange: (buildingId: BuildingId | null) => void;
  onReady: () => void;
}

const ART = 16; // px per source art tile
const TILE_SCALE = TILE / ART; // upscale art tiles to logical tile size
const BUILDING_SCALE = 3; // 32px building art -> ~3 tiles wide
const PLAYER_SCALE = 2;

// Buildings occupy a 3-wide footprint; collision only covers the lower body.
const BUILDING_W = 3;
const BUILDING_H = 3;

export function bootWorld(
  container: HTMLElement,
  cb: WorldCallbacks,
): WorldHandle {
  // Create a dedicated canvas per boot. React StrictMode (dev) mounts effects
  // twice; giving each boot its own fresh canvas + WebGL context avoids two
  // Kaplay instances fighting over one reused context (which renders blank).
  const canvas = document.createElement("canvas");
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.display = "block";
  container.appendChild(canvas);

  const k = kaplay({
    canvas,
    background: [38, 54, 40],
    scale: WORLD_SCALE,
    crisp: true,
    pixelDensity: Math.min(
      typeof window !== "undefined" ? window.devicePixelRatio : 1,
      2,
    ),
    global: false,
    debug: false,
  });

  k.setGravity(0);
  loadWorldSprites(k);

  const worldPxW = MAP_TILES_WIDE * TILE;
  const worldPxH = MAP_TILES_HIGH * TILE;

  // ---- Ground: grass everywhere, a path spine, a small pond ----
  const pondTiles = new Set<string>();
  for (let ty = 2; ty <= 4; ty++)
    for (let tx = 33; tx <= 37; tx++) pondTiles.add(`${tx},${ty}`);

  const pathCols = new Set([13, 14]); // vertical path
  const pathRows = new Set([10, 11]); // horizontal path

  for (let ty = 0; ty < MAP_TILES_HIGH; ty++) {
    for (let tx = 0; tx < MAP_TILES_WIDE; tx++) {
      const key = `${tx},${ty}`;
      let name = "t_grass";
      if (pondTiles.has(key)) name = "t_water";
      else if (pathCols.has(tx) || pathRows.has(ty)) name = "t_path";
      k.add([
        k.sprite(name),
        k.pos(tx * TILE, ty * TILE),
        k.scale(TILE_SCALE),
        k.z(0),
      ]);
    }
  }

  // Pond is impassable.
  k.add([
    k.rect(5 * TILE, 3 * TILE),
    k.pos(33 * TILE, 2 * TILE),
    k.area(),
    k.body({ isStatic: true }),
    k.opacity(0),
    "wall",
  ]);

  // ---- World bounds ----
  const wall = (x: number, y: number, w: number, h: number) =>
    k.add([
      k.rect(w, h),
      k.pos(x, y),
      k.area(),
      k.body({ isStatic: true }),
      k.opacity(0),
      "wall",
    ]);
  wall(-TILE, -TILE, worldPxW + 2 * TILE, TILE);
  wall(-TILE, worldPxH, worldPxW + 2 * TILE, TILE);
  wall(-TILE, 0, TILE, worldPxH);
  wall(worldPxW, 0, TILE, worldPxH);

  // ---- Decor (placed to avoid building footprints) ----
  const decor: Array<[string, number, number]> = [
    ["d_tree", 3, 3],
    ["d_tree", 5, 17],
    ["d_tree", 34, 16],
    ["d_tree", 27, 3],
    ["d_tree", 19, 18],
    ["d_bush", 11, 9],
    ["d_bush", 20, 11],
    ["d_bush", 28, 15],
    ["d_flower", 15, 5],
    ["d_flower", 10, 18],
    ["d_flower", 25, 12],
    ["d_flower", 33, 8],
  ];
  for (const [name, tx, ty] of decor) {
    k.add([
      k.sprite(name),
      k.pos(tx * TILE, ty * TILE),
      k.scale(TILE_SCALE),
      k.z(ty), // rough depth sort by row
    ]);
  }

  // ---- Buildings (sprite + footprint collision + interaction zone) ----
  for (const b of BUILDINGS) {
    const px = b.tileX * TILE;
    const py = b.tileY * TILE;
    const w = BUILDING_W * TILE;
    const h = BUILDING_H * TILE;

    k.add([
      k.sprite(`bld_${b.id}`),
      k.pos(px, py),
      k.scale(BUILDING_SCALE),
      k.z(py + h),
    ]);

    // Solid footprint: lower portion only, so the player can walk near the roof.
    k.add([
      k.rect(w * 0.86, h * 0.4),
      k.pos(px + w * 0.07, py + h * 0.52),
      k.area(),
      k.body({ isStatic: true }),
      k.opacity(0),
      "building",
    ]);

    // Interaction zone around the doorway.
    k.add([
      k.rect(w + TILE, h * 0.6 + TILE),
      k.pos(px - TILE * 0.5, py + h * 0.4),
      k.area(),
      k.opacity(0),
      k.z(1),
      "zone",
      { buildingId: b.id },
    ]);
  }

  // ---- Player (animated sprite) ----
  const startX = 13.5 * TILE;
  const startY = 12.5 * TILE;
  const player = k.add([
    k.sprite("player", { anim: "idle-down" }),
    k.pos(startX, startY),
    k.scale(PLAYER_SCALE),
    k.area({
      shape: new k.Rect(k.vec2(-14, 2), 28, 12),
    }),
    k.body(),
    k.anchor("center"),
    k.z(500),
    "player",
  ]);

  const SPEED = 150;
  let paused = false;
  let virtualDir = k.vec2(0, 0);
  let curAnim = "idle-down";
  let facing: "down" | "up" | "side" = "down";
  let flip = false;

  const setAnim = (name: string) => {
    if (name !== curAnim) {
      curAnim = name;
      player.play(name);
    }
    player.flipX = flip;
  };

  k.onUpdate(() => {
    if (paused) return;
    let dir = k.vec2(0, 0);
    if (k.isKeyDown("left") || k.isKeyDown("a")) dir.x -= 1;
    if (k.isKeyDown("right") || k.isKeyDown("d")) dir.x += 1;
    if (k.isKeyDown("up") || k.isKeyDown("w")) dir.y -= 1;
    if (k.isKeyDown("down") || k.isKeyDown("s")) dir.y += 1;
    dir = dir.add(virtualDir);

    const moving = dir.len() > 0;
    if (moving) {
      dir = dir.unit();
      player.move(dir.scale(SPEED));
      if (Math.abs(dir.x) > Math.abs(dir.y)) {
        facing = "side";
        flip = dir.x < 0;
      } else {
        facing = dir.y < 0 ? "up" : "down";
      }
      setAnim(`walk-${facing}`);
    } else {
      setAnim(`idle-${facing}`);
    }
    player.z = 500 + player.pos.y; // depth vs buildings

    const halfW = k.width() / 2;
    const halfH = k.height() / 2;
    const camX = Math.max(halfW, Math.min(worldPxW - halfW, player.pos.x));
    const camY = Math.max(halfH, Math.min(worldPxH - halfH, player.pos.y));
    k.camPos(camX, camY);
  });

  // ---- Nearby-zone detection ----
  let nearby: BuildingId | null = null;
  const zones = () => k.get("zone") as GameObj[];
  k.onUpdate(() => {
    if (paused) return;
    let found: BuildingId | null = null;
    for (const z of zones()) {
      if ((player as any).isColliding(z)) {
        found = (z as unknown as { buildingId: BuildingId }).buildingId;
        break;
      }
    }
    if (found !== nearby) {
      nearby = found;
      cb.onNearbyChange(nearby);
    }
  });

  // ---- Interact ----
  const interact = () => {
    if (paused) return;
    if (nearby) cb.onInteract(nearby);
  };
  k.onKeyPress("e", interact);
  k.onKeyPress("enter", interact);
  k.onKeyPress("space", interact);

  const onVirtualMove = (e: Event) => {
    const d = (e as CustomEvent).detail as { x: number; y: number };
    virtualDir = k.vec2(d.x, d.y);
  };
  const onVirtualInteract = () => interact();
  window.addEventListener("world:move", onVirtualMove as EventListener);
  window.addEventListener("world:interact", onVirtualInteract);

  k.wait(0, () => cb.onReady());

  return {
    destroy: () => {
      window.removeEventListener("world:move", onVirtualMove as EventListener);
      window.removeEventListener("world:interact", onVirtualInteract);
      try {
        k.quit();
      } catch {
        /* no-op */
      }
      canvas.remove();
    },
    setPaused: (p: boolean) => {
      paused = p;
    },
  };
}
