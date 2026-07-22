import kaplay, { type GameObj } from "kaplay";
import {
  BUILDINGS,
  MAP_TILES_HIGH,
  MAP_TILES_WIDE,
  TILE,
  WORLD_SCALE,
  type BuildingId,
} from "./config";

export interface WorldHandle {
  destroy: () => void;
  setPaused: (paused: boolean) => void;
}

export interface WorldCallbacks {
  // Fired when the player presses interact (E / tap) inside a building zone.
  onInteract: (buildingId: BuildingId) => void;
  // Fired when the "nearby" building changes (null = none), to drive the
  // in-world "Press E" prompt rendered by React.
  onNearbyChange: (buildingId: BuildingId | null) => void;
  // Fired once assets/scene are ready so React can hide the loading screen.
  onReady: () => void;
}

// Cozy palette (all programmer-art for Phase 0/1 — real CC0/original pixel art
// lands in Phase 2, tracked in docs/CREDITS.md).
const COLORS = {
  grass: [124, 179, 66],
  grassAlt: [139, 195, 74],
  path: [200, 178, 128],
  water: [79, 143, 186],
};

const BUILDING_COLORS: Record<BuildingId, number[]> = {
  farmhouse: [198, 108, 92],
  workshop: [150, 123, 182],
  library: [96, 155, 173],
  townhall: [212, 170, 90],
  gallery: [124, 168, 133],
  recordshop: [176, 120, 150],
  photowall: [120, 150, 190],
};

const BUILDING_W = 3; // tiles
const BUILDING_H = 3; // tiles

/**
 * Boots the Kaplay walkable world onto the given canvas element.
 * Uses only procedurally-drawn shapes so it runs with zero external assets.
 */
export function bootWorld(
  canvas: HTMLCanvasElement,
  cb: WorldCallbacks,
): WorldHandle {
  const k = kaplay({
    canvas,
    background: [46, 62, 43],
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

  const worldPxW = MAP_TILES_WIDE * TILE;
  const worldPxH = MAP_TILES_HIGH * TILE;

  // ---- Ground layer (checkerboard grass) ----
  for (let ty = 0; ty < MAP_TILES_HIGH; ty++) {
    for (let tx = 0; tx < MAP_TILES_WIDE; tx++) {
      const c = (tx + ty) % 2 === 0 ? COLORS.grass : COLORS.grassAlt;
      k.add([
        k.rect(TILE, TILE),
        k.pos(tx * TILE, ty * TILE),
        k.color(c[0], c[1], c[2]),
        k.z(0),
      ]);
    }
  }

  // ---- World bounds (invisible solid walls) ----
  const wall = (x: number, y: number, w: number, h: number) =>
    k.add([
      k.rect(w, h),
      k.pos(x, y),
      k.area(),
      k.body({ isStatic: true }),
      k.opacity(0),
      "wall",
    ]);
  const T = TILE;
  wall(-T, -T, worldPxW + 2 * T, T); // top
  wall(-T, worldPxH, worldPxW + 2 * T, T); // bottom
  wall(-T, 0, T, worldPxH); // left
  wall(worldPxW, 0, T, worldPxH); // right

  // ---- Buildings + interaction zones ----
  for (const b of BUILDINGS) {
    const px = b.tileX * TILE;
    const py = b.tileY * TILE;
    const w = BUILDING_W * TILE;
    const h = BUILDING_H * TILE;
    const col = BUILDING_COLORS[b.id];

    // Solid building body.
    k.add([
      k.rect(w, h),
      k.pos(px, py),
      k.color(col[0], col[1], col[2]),
      k.outline(2, k.rgb(30, 30, 40)),
      k.area(),
      k.body({ isStatic: true }),
      k.z(2),
      "building",
    ]);

    // Little roof accent.
    k.add([
      k.rect(w, TILE * 0.6),
      k.pos(px, py - TILE * 0.3),
      k.color(col[0] * 0.75, col[1] * 0.75, col[2] * 0.75),
      k.z(3),
    ]);

    // Door marker.
    k.add([
      k.rect(TILE * 0.8, TILE * 0.9),
      k.pos(px + w / 2 - TILE * 0.4, py + h - TILE * 0.9),
      k.color(60, 45, 40),
      k.z(3),
    ]);

    // Interaction zone (in front of / around the building). Not solid.
    k.add([
      k.rect(w + TILE * 2, h + TILE * 2),
      k.pos(px - TILE, py - TILE),
      k.area(),
      k.opacity(0),
      k.z(1),
      "zone",
      { buildingId: b.id },
    ]);
  }

  // ---- Player ----
  const startX = worldPxW / 2;
  const startY = worldPxH / 2;
  const player = k.add([
    k.rect(TILE * 0.7, TILE * 0.9),
    k.pos(startX, startY),
    k.color(245, 233, 210),
    k.outline(2, k.rgb(40, 40, 50)),
    k.area(),
    k.body(),
    k.anchor("center"),
    k.z(5),
    "player",
  ]);

  // Simple facing indicator (a small nose that moves with direction).
  const nose = k.add([
    k.rect(TILE * 0.28, TILE * 0.28),
    k.pos(startX, startY + TILE * 0.4),
    k.color(70, 70, 90),
    k.anchor("center"),
    k.z(6),
  ]);

  const SPEED = 150;
  let facing = k.vec2(0, 1);
  let paused = false;
  // Virtual controls bridged from React (mobile dpad + interact button).
  let virtualDir = k.vec2(0, 0);

  k.onUpdate(() => {
    if (paused) return;
    let dir = k.vec2(0, 0);
    if (k.isKeyDown("left") || k.isKeyDown("a")) dir.x -= 1;
    if (k.isKeyDown("right") || k.isKeyDown("d")) dir.x += 1;
    if (k.isKeyDown("up") || k.isKeyDown("w")) dir.y -= 1;
    if (k.isKeyDown("down") || k.isKeyDown("s")) dir.y += 1;

    // Touch/virtual dpad direction (set via window event below).
    dir = dir.add(virtualDir);

    if (dir.len() > 0) {
      dir = dir.unit();
      facing = dir;
      player.move(dir.scale(SPEED));
    }
    nose.pos = player.pos.add(facing.scale(TILE * 0.45));

    // Camera follows player, clamped to map bounds.
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

  // Virtual controls bridged from React (mobile dpad + interact button).
  const onVirtualMove = (e: Event) => {
    const d = (e as CustomEvent).detail as { x: number; y: number };
    virtualDir = k.vec2(d.x, d.y);
  };
  const onVirtualInteract = () => interact();
  window.addEventListener("world:move", onVirtualMove as EventListener);
  window.addEventListener("world:interact", onVirtualInteract);

  // Signal readiness on next frame (scene fully built).
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
    },
    setPaused: (p: boolean) => {
      paused = p;
    },
  };
}
