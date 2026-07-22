// Shared configuration + content mapping for the walkable portfolio world.
// Buildings map to existing portfolio sections/routes — content is reused, never
// duplicated. Panels read from these routes / existing consts + MDX.

export const TILE = 32; // logical tile size in pixels (pre-scale)
export const WORLD_SCALE = 2; // pixel-art upscale factor

export type BuildingId =
  | "workshop"
  | "library"
  | "townhall"
  | "gallery"
  | "farmhouse"
  | "recordshop"
  | "photowall";

export interface BuildingDef {
  id: BuildingId;
  label: string; // sign shown in-world / prompt
  section: string; // portfolio section name
  route: string; // existing route the panel links to / pulls from
  // Tile position of the building's top-left on the map grid (Phase 1 uses a
  // simple hand-authored layout; Phase 2 can migrate to a Tiled JSON export).
  tileX: number;
  tileY: number;
}

// Cozy-town layout. Coordinates are intentionally spaced so the player can walk
// between them. These get placed onto the tile grid by the world builder.
export const BUILDINGS: BuildingDef[] = [
  {
    id: "farmhouse",
    label: "Farmhouse — About",
    section: "About",
    route: "/about",
    tileX: 8,
    tileY: 6,
  },
  {
    id: "workshop",
    label: "Workshop — Projects",
    section: "Projects",
    route: "/projects",
    tileX: 16,
    tileY: 7,
  },
  {
    id: "library",
    label: "Library — Blog",
    section: "Blog",
    route: "/blog",
    tileX: 24,
    tileY: 6,
  },
  {
    id: "townhall",
    label: "Town Hall — Engagements",
    section: "Engagements",
    route: "/engagements",
    tileX: 30,
    tileY: 10,
  },
  {
    id: "gallery",
    label: "Gallery — In the Wild",
    section: "In the Wild",
    route: "/in-the-wild",
    tileX: 22,
    tileY: 14,
  },
  {
    id: "recordshop",
    label: "Record Shop — Music",
    section: "Music",
    route: "/#music",
    tileX: 12,
    tileY: 14,
  },
  {
    id: "photowall",
    label: "Gallery Wall — Photography",
    section: "Photography",
    route: "/#photography",
    tileX: 6,
    tileY: 12,
  },
];

export const MAP_TILES_WIDE = 40;
export const MAP_TILES_HIGH = 22;
