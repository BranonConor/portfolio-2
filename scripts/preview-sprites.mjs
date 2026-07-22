// Dev-only: renders the original pixel-art sprites to a PNG so we can eyeball
// them. Uses only Node built-ins (zlib) — no deps. Not shipped in the app.
import zlib from "node:zlib";
import fs from "node:fs";
import * as S from "../src/game/spriteData.js";

const PAL = S.PALETTE;

function validate(name, grid) {
  const w = grid[0].length;
  let ok = true;
  grid.forEach((row, i) => {
    if (row.length !== w) {
      ok = false;
      console.error(`  ! ${name} row ${i} width ${row.length} != ${w}: "${row}"`);
    }
  });
  return ok;
}

function makeCanvas(w, h, fill = [0, 0, 0, 0]) {
  const buf = new Uint8Array(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    buf[i * 4] = fill[0];
    buf[i * 4 + 1] = fill[1];
    buf[i * 4 + 2] = fill[2];
    buf[i * 4 + 3] = fill[3];
  }
  return { w, h, buf };
}

function put(cv, x, y, rgba) {
  if (x < 0 || y < 0 || x >= cv.w || y >= cv.h) return;
  const i = (y * cv.w + x) * 4;
  if (rgba[3] === 0) return;
  cv.buf[i] = rgba[0];
  cv.buf[i + 1] = rgba[1];
  cv.buf[i + 2] = rgba[2];
  cv.buf[i + 3] = rgba[3];
}

function blit(cv, grid, ox, oy, scale = 1, override = {}) {
  for (let y = 0; y < grid.length; y++) {
    const row = grid[y];
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      if (ch === ".") continue;
      let col = override[ch] || PAL[ch];
      if (!col) continue;
      if (col.length === 3) col = [...col, 255];
      for (let sy = 0; sy < scale; sy++)
        for (let sx = 0; sx < scale; sx++)
          put(cv, ox + x * scale + sx, oy + y * scale + sy, col);
    }
  }
}

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}
function encodePng(cv) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(cv.w, 0);
  ihdr.writeUInt32BE(cv.h, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const stride = 1 + cv.w * 4;
  const raw = Buffer.alloc(cv.h * stride);
  for (let y = 0; y < cv.h; y++) {
    raw[y * stride] = 0;
    for (let i = 0; i < cv.w * 4; i++) raw[y * stride + 1 + i] = cv.buf[y * cv.w * 4 + i];
  }
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([sig, chunk("IHDR", ihdr), chunk("IDAT", idat), chunk("IEND", Buffer.alloc(0))]);
}

const checks = {
  grass: S.grass, path: S.path, water: S.water, tree: S.tree, bush: S.bush,
  flower: S.flower,
  player_down_a: S.player_down_a, player_down_b: S.player_down_b,
  player_up_a: S.player_up_a, player_up_b: S.player_up_b, player_side_a: S.player_side_a,
  player_side_b: S.player_side_b,
  bld_cottage: S.bld_cottage, bld_shop: S.bld_shop,
};
let allOk = true;
console.log("Validating sprite widths:");
for (const [name, grid] of Object.entries(checks)) {
  const ok = validate(name, grid);
  console.log(`  ${ok ? "ok " : "BAD"} ${name} (${grid[0].length}x${grid.length})`);
  allOk = allOk && ok;
}
for (const [name, grid] of Object.entries(S.emblems)) {
  allOk = validate("emblem:" + name, grid) && allOk;
}

const cv = makeCanvas(1180, 760, [16, 18, 24, 255]);
for (let ty = 0; ty < 5; ty++)
  for (let tx = 0; tx < 25; tx++) blit(cv, S.grass, tx * 48, ty * 48, 3);

const frames = [S.player_down_a, S.player_down_b, S.player_up_a, S.player_side_a, S.player_side_b];
frames.forEach((f, i) => blit(cv, f, 20 + i * 110, 260, 6));

blit(cv, S.path, 20, 470, 6);
blit(cv, S.water, 140, 470, 6);
blit(cv, S.tree, 260, 420, 6);
blit(cv, S.bush, 380, 470, 6);
blit(cv, S.flower, 520, 470, 6);

let bx = 20;
for (const [id, theme] of Object.entries(S.BUILDING_THEME)) {
  const base = S.BASES[theme.base];
  const ov = { R: theme.R, r: theme.r, M: theme.M, A: theme.A };
  blit(cv, base, bx, 560, 4, ov);
  const em = S.emblems[id];
  if (em) blit(cv, em, bx + 48, 600, 4, { W: theme.M });
  bx += 165;
}

fs.writeFileSync(new URL("./sprite-preview.png", import.meta.url), encodePng(cv));
console.log(`\nWrote sprite-preview.png (${allOk ? "all widths OK" : "WIDTH ERRORS ABOVE"})`);
