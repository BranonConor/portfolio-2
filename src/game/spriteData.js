// Original pixel-art data for the walkable portfolio world.
// Authored from scratch for Branon's brand — NOT derived from any asset pack.
// Palette is tied to his identity: blue #60a5fa, purple #a78bfa, pink #f472b6,
// near-black #09090b, plus cozy naturals. Each sprite is a grid of characters
// mapping into a palette; '.' is transparent. Shared by the runtime renderer
// (src/game/pixelArt.ts) and the dev preview script (scripts/preview-sprites.mjs).

/** Base palette: char -> [r,g,b,a]. */
export const PALETTE = {
  ".": [0, 0, 0, 0], // transparent
  K: [26, 22, 34, 255], // outline / near-black
  k: [46, 40, 60, 255], // soft outline
  // brand
  B: [96, 165, 250, 255], // blue
  b: [59, 130, 246, 255], // blue shade
  P: [167, 139, 250, 255], // purple
  p: [124, 108, 200, 255], // purple shade
  N: [244, 114, 182, 255], // pink
  n: [214, 90, 156, 255], // pink shade
  // person
  S: [232, 190, 152, 255], // skin
  s: [206, 160, 120, 255], // skin shade
  H: [58, 42, 34, 255], // hair
  W: [250, 250, 250, 255], // white
  w: [212, 212, 216, 255], // light grey
  // wood / structure
  D: [150, 100, 62, 255], // wood
  d: [96, 62, 38, 255], // wood shade
  T: [154, 160, 168, 255], // stone
  t: [110, 116, 126, 255], // stone shade
  // nature
  g: [120, 180, 96, 255], // grass
  G: [98, 156, 78, 255], // grass shade
  L: [82, 130, 66, 255], // leaf dark
  l: [126, 190, 110, 255], // leaf light
  E: [70, 116, 58, 255], // deep green
  o: [200, 178, 128, 255], // path/sand
  O: [176, 152, 104, 255], // path shade
  U: [79, 143, 186, 255], // water
  u: [102, 168, 205, 255], // water hi
  Y: [247, 208, 96, 255], // yellow (flower/lamp)
  R: [232, 120, 96, 255], // warm roof default (overridable)
  r: [190, 92, 74, 255], // roof shade default
  M: [250, 250, 250, 255], // trim default (overridable)
  A: [96, 165, 250, 255], // accent/awning default (overridable)
  G_: [0, 0, 0, 0],
};

// ---------------- Tiles (16x16) ----------------

export const TILE_SIZE = 16;

export const grass = [
  "gggggggggggggggg",
  "gggggggGgggggggg",
  "gggggggggggggLgg",
  "gGgggggggggggggg",
  "ggggggglggggggGg",
  "ggggGggggggggggg",
  "gggggggggggglggg",
  "gLgggggggGgggggg",
  "gggggggggggggggg",
  "ggggglgggggGgggg",
  "gggGggggggggggLg",
  "gggggggggggggggg",
  "glggggGggggggggg",
  "ggggggggggglgggg",
  "ggGggggggggggggg",
  "gggggggggGgggggg",
];

export const path = [
  "oooooooooooooooo",
  "oOoooooooooOoooo",
  "oooooooOooooooOo",
  "ooooOooooooooooo",
  "oooooooooOoooooo",
  "oOooooooooooooOo",
  "ooooooOooooooooo",
  "oooOooooooooOooo",
  "oooooooooOoooooo",
  "oOoooooooooooooo",
  "oooooOoooooOoooo",
  "ooooooooOooooooo",
  "oOoooooooooooOoo",
  "ooooOooooooooooo",
  "ooooooooooOooooo",
  "oooOoooooooooooo",
];

export const water = [
  "UuUUUUUUUuUUUUUU",
  "UUUUUuUUUUUUUUuU",
  "uUUUUUUUUuUUUUUU",
  "UUUuUUUUUUUUuUUU",
  "UUUUUUUuUUUUUUUU",
  "UuUUUUUUUUUuUUUU",
  "UUUUUUuUUUUUUUUu",
  "UUuUUUUUUUuUUUUU",
  "UUUUUUUUUUUUUUuU",
  "uUUUUUuUUUUUUUUU",
  "UUUUUUUUUuUUUUUU",
  "UUUuUUUUUUUUUuUU",
  "UUUUUUUuUUUUUUUU",
  "UuUUUUUUUUUuUUUU",
  "UUUUUuUUUUUUUUUU",
  "UUUUUUUUUUuUUUUU",
];

// ---------------- Decor ----------------

// Tree (16x24) — sits on a 16-wide tile, overhangs upward.
export const tree = [
  "......LLLL......",
  "....LLllllLL....",
  "...LllllllllL...",
  "..LllllllllllL..",
  "..LllllLllllllL.",
  ".LlllllllllllllL",
  ".LllllLllllllllL",
  ".LlllllllllLlllL",
  ".LLlllllllllllL.",
  "..LLlllllllllL..",
  "...LLllllllLL...",
  "....LLLLLLLL....",
  ".......DD.......",
  ".......Dd.......",
  ".......Dd.......",
  ".......Dd.......",
];

export const bush = [
  "....LLLLLL....",
  "..LLllllllLL..",
  ".LlllllllllllL",
  "LllllllLlllllL",
  ".LlllllllllllL",
  "..LLllllllLL..",
  "....LLLLLL....",
];

export const flower = [
  "..N..",
  ".NYN.",
  "..N..",
  "..L..",
  "..L..",
];

// ---------------- Player (14x16), walk frames ----------------
// Design: a friendly design-engineer avatar — dark hair, brand-blue hoodie with
// a pink-accent detail. Down/up facing + a side profile (flipped for L/R). Two
// frames each for a simple 2-step walk cycle.

export const player_down_a = [
  "....KKKKKK....",
  "...KHHHHHHK...",
  "..KHHHHHHHHK..",
  "..KHSSSSSSHK..",
  "..KSSKSSKSSK..",
  "..KSSSSSSSSK..",
  "..KSsSSSSsSK..",
  "...KSSSSSSK...",
  "..KBBBBBBBBK..",
  ".KBBBNNBBBBBK.",
  ".KBBBBBBBBBBK.",
  ".KSBBBBBBBBSK.",
  ".KSKBBBBBBKSK.",
  "...KDD..DDK...",
  "...KDK..KDK...",
  "...KKK..KKK...",
];

export const player_down_b = [
  "....KKKKKK....",
  "...KHHHHHHK...",
  "..KHHHHHHHHK..",
  "..KHSSSSSSHK..",
  "..KSSKSSKSSK..",
  "..KSSSSSSSSK..",
  "..KSsSSSSsSK..",
  "...KSSSSSSK...",
  "..KBBBBBBBBK..",
  ".KBBBNNBBBBBK.",
  ".KBBBBBBBBBBK.",
  ".KSBBBBBBBBSK.",
  ".KSKBBBBBBKSK.",
  "...KDDDDDDK...",
  "..KDDK..KDDK..",
  "..KK......KK..",
];

export const player_up_a = [
  "....KKKKKK....",
  "...KHHHHHHK...",
  "..KHHHHHHHHK..",
  "..KHHHHHHHHK..",
  "..KHHHHHHHHK..",
  "..KHHHHHHHHK..",
  "..KHHHHHHHHK..",
  "...KHHHHHHK...",
  "..KBBBBBBBBK..",
  ".KBBBBBBBBBBK.",
  ".KBBBNNBBBBBK.",
  ".KSBBBBBBBBSK.",
  ".KSKBBBBBBKSK.",
  "...KDD..DDK...",
  "...KDK..KDK...",
  "...KKK..KKK...",
];

export const player_up_b = [
  "....KKKKKK....",
  "...KHHHHHHK...",
  "..KHHHHHHHHK..",
  "..KHHHHHHHHK..",
  "..KHHHHHHHHK..",
  "..KHHHHHHHHK..",
  "..KHHHHHHHHK..",
  "...KHHHHHHK...",
  "..KBBBBBBBBK..",
  ".KBBBBBBBBBBK.",
  ".KBBBNNBBBBBK.",
  ".KSBBBBBBBBSK.",
  ".KSKBBBBBBKSK.",
  "...KDDDDDDK...",
  "..KDDK..KDDK..",
  "..KK......KK..",
];

export const player_side_a = [
  "....KKKK......",
  "...KHHHHK.....",
  "..KHHHHHHK....",
  "..KHHSSSSK....",
  "..KHSSKSSK....",
  "..KHSSSSSK....",
  "...KSSSSK.....",
  "...KBBBBK.....",
  "..KBBBBBBK....",
  "..KBNBBBBK....",
  "..KBBBBBBK....",
  "..KSBBBBSK....",
  "...KBBBBK.....",
  "...KDDDK......",
  "...KDKDK......",
  "...KK.KK......",
];

export const player_side_b = [
  "....KKKK......",
  "...KHHHHK.....",
  "..KHHHHHHK....",
  "..KHHSSSSK....",
  "..KHSSKSSK....",
  "..KHSSSSSK....",
  "...KSSSSK.....",
  "...KBBBBK.....",
  "..KBBBBBBK....",
  "..KBNBBBBK....",
  "..KBBBBBBK....",
  "..KSBBBBSK....",
  "...KBBBBK.....",
  "...KDDDK......",
  "..KDK.KDK.....",
  ".KK...KK......",
];

// ---------------- Buildings ----------------
// Two original base silhouettes (a cottage and a wide shop), recolored per
// section via a per-building palette override (R/r roof, M trim, A awning) plus
// a themed 8x8 emblem hung above the door. Keeps a cohesive town while giving
// each section its own identity.

// Cottage — 32 wide x 30 tall.
export const bld_cottage = [
  "...............RR...............",
  "..............RrrR..............",
  ".............RrrrrR.............",
  "............RrrrrrrR............",
  "...........RrrrrrrrrR...........",
  "..........RrrrrrrrrrrR..........",
  ".........RrrrrrrrrrrrrR.........",
  "........RrrrrrrrrrrrrrrR........",
  ".......RRRRRRRRRRRRRRRRRR.......",
  "......RRRRRRRRRRRRRRRRRRRR......",
  ".....kMMMMMMMMMMMMMMMMMMMMk.....",
  ".....kMDDDDDDDDDDDDDDDDDDMk.....",
  ".....kMDwwwDDDDDDDDDDwwwDMk.....",
  ".....kMDwBBwDDDDDDDDwBBwDMk.....",
  ".....kMDwBBwDDDDDDDDwBBwDMk.....",
  ".....kMDwwwDDDDDDDDDDwwwDMk.....",
  ".....kMDDDDDDDDDDDDDDDDDDMk.....",
  ".....kMDDDDDDDAAAADDDDDDDMk.....",
  ".....kMDDDDDDAAAAAADDDDDDMk.....",
  ".....kMDDDDDDAdddAADDDDDDMk.....",
  ".....kMDDDDDDAdddAADDDDDDMk.....",
  ".....kMDDDDDDAdddAADDDDDDMk.....",
  ".....kMDDDDDDAdddAADDDDDDMk.....",
  ".....kMDDDDDDAdddAADDDDDDMk.....",
  ".....kMDDDDDDAdddAADDDDDDMk.....",
  ".....kKKKKKKKKKKKKKKKKKKKKk.....",
  ".....EEEEEEEEEEEEEEEEEEEEEE.....",
  "....EEEEEEEEEEEEEEEEEEEEEEEE....",
  "...EEEEEEEEEEEEEEEEEEEEEEEEEE...",
  "...EEEEEEEEEEEEEEEEEEEEEEEEEE...",
];

// Wide shop — 32 wide x 30 tall (flat awning + big window).
export const bld_shop = [
  "................................",
  "....RRRRRRRRRRRRRRRRRRRRRRRR....",
  "...RrrrrrrrrrrrrrrrrrrrrrrrrR...",
  "...RrrrrrrrrrrrrrrrrrrrrrrrrR...",
  "...RRRRRRRRRRRRRRRRRRRRRRRRRR...",
  "...kMMMMMMMMMMMMMMMMMMMMMMMMk...",
  "...kMAAAAAAAAAAAAAAAAAAAAAAMk...",
  "...kMAMAMAMAMAMAMAMAMAMAMAAMk...",
  "...kMAAAAAAAAAAAAAAAAAAAAAAMk...",
  "...kMDDDDDDDDDDDDDDDDDDDDDDMk...",
  "...kMDuuuuuuuuuuDDDDDDDDDDDMk...",
  "...kMDuUUUUUUUUuDDDwwwwwwDDMk...",
  "...kMDuUUUUUUUUuDDDwBBBBwDDMk...",
  "...kMDuUUUUUUUUuDDDwBBBBwDDMk...",
  "...kMDuUUUUUUUUuDDDwBBBBwDDMk...",
  "...kMDuUUUUUUUUuDDDwwwwwwDDMk...",
  "...kMDuuuuuuuuuuDDDDDDDDDDDMk...",
  "...kMDDDDDDDDDDDDDDDDDDDDDDMk...",
  "...kMDDDDDDDDDDDDDDAAAADDDDMk...",
  "...kMDDDDDDDDDDDDDAAAAAADDDMk...",
  "...kMDDDDDDDDDDDDDAddAAADDDMk...",
  "...kMDDDDDDDDDDDDDAddAAADDDMk...",
  "...kMDDDDDDDDDDDDDAddAAADDDMk...",
  "...kMDDDDDDDDDDDDDAddAAADDDMk...",
  "...kMDDDDDDDDDDDDDAddAAADDDMk...",
  "...kKKKKKKKKKKKKKKKKKKKKKKKKk...",
  "..EEEEEEEEEEEEEEEEEEEEEEEEEEEE..",
  "..EEEEEEEEEEEEEEEEEEEEEEEEEEEE..",
  ".EEEEEEEEEEEEEEEEEEEEEEEEEEEEEE.",
  ".EEEEEEEEEEEEEEEEEEEEEEEEEEEEEE.",
];

// 8x8 emblems (hung sign icons). Use 'W' fg on transparent.
export const emblems = {
  // wrench (Projects)
  workshop: [
    "..WW....",
    ".WWWW...",
    ".WWW....",
    "..WWW...",
    "...WWW..",
    "....WWW.",
    "...WWWW.",
    "....WW..",
  ],
  // book (Blog)
  library: [
    ".WWWWWW.",
    ".W....W.",
    ".W.WW.W.",
    ".W....W.",
    ".W.WW.W.",
    ".W....W.",
    ".WWWWWW.",
    "........",
  ],
  // microphone (Engagements)
  townhall: [
    "..WWW...",
    ".W...W..",
    ".W...W..",
    ".W...W..",
    "..WWW...",
    "...W....",
    "..WWW...",
    "........",
  ],
  // picture frame (In the Wild)
  gallery: [
    "WWWWWWWW",
    "W......W",
    "W.WW...W",
    "W.WWW..W",
    "W...WW.W",
    "W......W",
    "WWWWWWWW",
    "........",
  ],
  // home/heart (About)
  farmhouse: [
    "...WW...",
    "..WWWW..",
    ".WWWWWW.",
    "WWWWWWWW",
    ".WWWWWW.",
    "..WWWW..",
    "...WW...",
    "........",
  ],
  // music note (Music)
  recordshop: [
    "....WWW.",
    "....W.W.",
    "....W.W.",
    "....W.W.",
    ".WW.W...",
    "WWW.WW..",
    ".W...WW.",
    "........",
  ],
  // camera (Photography)
  photowall: [
    "........",
    "WWWWWWWW",
    "W..WW..W",
    "W.WWWW.W",
    "W.WWWW.W",
    "W..WW..W",
    "WWWWWWWW",
    "........",
  ],
};

// Per-building theming: which base + brand-accent recolor + emblem.
// R/r = roof, M = trim, A = awning/door accent.
export const BUILDING_THEME = {
  farmhouse: { base: "cottage", R: [232, 120, 96], r: [190, 92, 74], M: [250, 250, 250], A: [244, 114, 182] },
  workshop: { base: "shop", R: [124, 108, 200], r: [98, 84, 158], M: [230, 226, 240], A: [96, 165, 250] },
  library: { base: "cottage", R: [96, 165, 250], r: [59, 130, 246], M: [235, 240, 250], A: [167, 139, 250] },
  townhall: { base: "cottage", R: [247, 208, 96], r: [206, 168, 70], M: [250, 250, 250], A: [232, 120, 96] },
  gallery: { base: "shop", R: [120, 180, 150], r: [92, 150, 120], M: [245, 245, 245], A: [167, 139, 250] },
  recordshop: { base: "shop", R: [244, 114, 182], r: [214, 90, 156], M: [250, 245, 248], A: [96, 165, 250] },
  photowall: { base: "shop", R: [96, 165, 250], r: [59, 130, 246], M: [245, 248, 252], A: [244, 114, 182] },
};

export const BASES = { cottage: bld_cottage, shop: bld_shop };
