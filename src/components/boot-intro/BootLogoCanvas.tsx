"use client";

import { useEffect, useRef } from "react";
import { Box } from "@chakra-ui/react";
import { Renderer, Program, Mesh, Texture, Geometry, Transform } from "ogl";
import { pixelFont } from "./pixelFont";

const VERTEX = /* glsl */ `
  attribute vec2 position;
  attribute vec2 uv;
  uniform vec2 uCenter;
  uniform vec2 uHalfSize;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec2 pos = uCenter + position * (uHalfSize * 2.0);
    gl_Position = vec4(pos, 0.0, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D tMask;
  uniform float uTime;
  uniform float uOpacity;
  uniform float uSweep;
  uniform float uGlobalU0;
  uniform float uGlobalU1;
  uniform vec3 uLetterColor;
  uniform float uColorMix;

  void main() {
    // Nearest-filtered texture already gives the chunky pixelated look;
    // just sample the glyph's alpha mask directly.
    float mask = texture2D(tMask, vUv).a;
    if (mask < 0.05) {
      discard;
    }

    // A continuous rainbow band that travels across the *whole* word, using
    // this letter's global (word-relative) horizontal position rather than
    // its own local UV, so the sweep doesn't reset per letter.
    float globalU = mix(uGlobalU0, uGlobalU1, vUv.x);
    float diag = globalU + vUv.y * 0.12;
    float bandCenter = mix(-0.5, 1.5, uSweep);
    float band = smoothstep(0.4, 0.0, abs(diag - bandCenter));

    vec3 rainbow = 0.5 + 0.5 * cos(
      6.28318 * (diag * 1.6 + uTime * 0.1) + vec3(0.0, 2.094, 4.188)
    );

    vec3 white = vec3(0.96, 0.96, 0.98);
    // Each letter flashes its own assigned color as it flies in, settling
    // back to white as it lands; the shared rainbow sweep washes over the
    // top of that afterwards.
    vec3 base = mix(white, uLetterColor, uColorMix);
    vec3 color = mix(base, rainbow, band * 0.92);

    gl_FragColor = vec4(color, mask * uOpacity);
  }
`;

/** Overshoot-then-settle easing used for each letter's scale/position bounce. */
function easeOutBack(t: number) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  const clamped = Math.min(Math.max(t, 0), 1);
  return 1 + c3 * Math.pow(clamped - 1, 3) + c1 * Math.pow(clamped - 1, 2);
}

interface LetterEntry {
  mesh: Mesh;
  program: Program;
  centerXFrac: number; // 0..1, this letter's center across the whole word
  halfWidthFrac: number; // 0..1, half this letter's width relative to the word
  globalU0: number;
  globalU1: number;
  startDelayMs: number;
  color: [number, number, number];
}

interface BootLogoCanvasProps {
  label: string;
  staggerMs: number;
  letterDurationMs: number;
  sweepGapMs: number;
  sweepDurationMs: number;
  /** Fired once per letter, the instant it begins its entrance. */
  onLetterStart?: (index: number, total: number) => void;
  /** Fired once, the moment the last letter finishes its landing bounce. */
  onLettersSettled?: () => void;
  /** Fired once the rainbow sweep begins. */
  onSweepStart?: () => void;
  /** Fired once the rainbow sweep has fully played out. */
  onSweepComplete?: () => void;
}

// Letters rocket in dramatically oversized, flash their own color, then
// bounce/settle down to resting scale — evoking the GBA boot wordmark. The
// scale-down is intentionally slow/lingering (see `scaleProgress` below) so
// letters stay big and overlapping while they travel, only reaching resting
// size right as they're about to slide into their final spot.
const START_SCALE = 8.5;
// Resting size once settled — bumped up from the original 1:1 baseline so
// the wordmark reads noticeably larger once landed, without touching the
// flight path/timing at all (only where the shrink-down tail of the
// entrance ends up).
const END_SCALE = 1.6;
// Scale reaches its resting value by this fraction of the entrance (right
// as the final left-slide leg begins), then holds steady through the slide.
const SCALE_WINDOW_T = 0.8;
// >1 biases the scale-down to happen later/faster rather than a linear
// shrink, so letters stay dramatically oversized (and overlapping their
// neighbors) for longer before quickly resolving to resting size.
const SCALE_BIAS = 1.6;

function scaleProgress(t: number) {
  const windowed = Math.min(Math.max(t / SCALE_WINDOW_T, 0), 1);
  return easeOutBack(Math.pow(windowed, SCALE_BIAS));
}

// Each letter follows a hand-tuned "J-hook" flight path into place (see
// design reference): it starts a bit right and below its resting spot,
// rockets up while bulging slightly further right at the peak, arcs back
// down past resting height to a point barely right of center, then slides
// the last bit leftward into its exact final position. Kept fairly subtle
// (small offsets) — the scale change carries most of the drama, this just
// adds a bit of directional flair. Defined as three keyframes (start ->
// peak -> dip) interpolated with smoothstep easing, all relative to the
// letter's own resting position (0, 0).
const PATH_START: [number, number] = [0.05, -0.2];
const PATH_PEAK: [number, number] = [0.07, 0.28];
const PATH_DIP: [number, number] = [0.025, 0.02];
const PATH_END: [number, number] = [0, 0];
// Fraction of the entrance spent in each leg of the path (must sum to 1).
const PATH_PEAK_T = 0.45;
const PATH_DIP_T = 0.8;

function smoothstep(t: number) {
  const clamped = Math.min(Math.max(t, 0), 1);
  return clamped * clamped * (3 - 2 * clamped);
}

function lerp(a: number, b: number, u: number) {
  return a + (b - a) * u;
}

/** Position offset (relative to resting spot) for the letter's flight path. */
function flightOffset(t: number): [number, number] {
  if (t <= PATH_PEAK_T) {
    const u = smoothstep(t / PATH_PEAK_T);
    return [lerp(PATH_START[0], PATH_PEAK[0], u), lerp(PATH_START[1], PATH_PEAK[1], u)];
  }
  if (t <= PATH_DIP_T) {
    const u = smoothstep((t - PATH_PEAK_T) / (PATH_DIP_T - PATH_PEAK_T));
    return [lerp(PATH_PEAK[0], PATH_DIP[0], u), lerp(PATH_PEAK[1], PATH_DIP[1], u)];
  }
  const u = smoothstep((t - PATH_DIP_T) / (1 - PATH_DIP_T));
  return [lerp(PATH_DIP[0], PATH_END[0], u), lerp(PATH_DIP[1], PATH_END[1], u)];
}

// Immediately after a letter lands, it does a couple of quick in-place
// bounces — this happens per-letter (not synchronized across the whole
// word), so each letter cascades through "fly in -> bounce -> settle"
// independently and the whole sequence stays snappy.
const BOUNCE_REPEATS = 2;
const BOUNCE_CYCLE_MS = 170;
const BOUNCE_AMPLITUDE = 0.16;
const BOUNCE_GAP_MS = 30; // brief pause after landing before its own bounce starts

/** Smooth 0→peak→0 pulse for the in-place post-landing bounce wave. */
function bounceScale(elapsedSinceStart: number) {
  const totalDuration = BOUNCE_CYCLE_MS * BOUNCE_REPEATS;
  if (elapsedSinceStart <= 0 || elapsedSinceStart >= totalDuration) return 1;
  const cyclePos = (elapsedSinceStart % BOUNCE_CYCLE_MS) / BOUNCE_CYCLE_MS;
  return 1 + BOUNCE_AMPLITUDE * Math.sin(cyclePos * Math.PI);
}

/** Converts an HSL color (degrees, 0..1, 0..1) to a linear RGB triple. */
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hp = (h % 360) / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r = 0;
  let g = 0;
  let b = 0;
  if (hp >= 0 && hp < 1) [r, g, b] = [c, x, 0];
  else if (hp < 2) [r, g, b] = [x, c, 0];
  else if (hp < 3) [r, g, b] = [0, c, x];
  else if (hp < 4) [r, g, b] = [0, x, c];
  else if (hp < 5) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const m = l - c / 2;
  return [r + m, g + m, b + m];
}

/**
 * WebGL (via `ogl`) rendering of the boot logo, GBA-style: each letter of the
 * (all-caps) label is drawn to a low-resolution offscreen canvas and sampled
 * with nearest-neighbor filtering for a chunky, pixelated look. Each letter
 * spirals in oversized (right -> up -> left -> down -> center) while
 * shrinking to its resting scale, then immediately does a couple of quick
 * in-place bounces — the whole "fly in -> bounce -> settle" sequence
 * cascades independently per letter (staggered only by start time) so it
 * stays snappy. Once the last letter finishes settling, a rainbow shine
 * sweeps across the whole logo.
 */
export function BootLogoCanvas({
  label,
  staggerMs,
  letterDurationMs,
  sweepGapMs,
  sweepDurationMs,
  onLetterStart,
  onLettersSettled,
  onSweepStart,
  onSweepComplete,
}: BootLogoCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const callbacksRef = useRef({
    onLetterStart,
    onLettersSettled,
    onSweepStart,
    onSweepComplete,
  });
  callbacksRef.current = {
    onLetterStart,
    onLettersSettled,
    onSweepStart,
    onSweepComplete,
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let destroyed = false;
    let rafId = 0;
    let disposeGl: (() => void) | null = null;

    const setup = async () => {
      const upperLabel = label.toUpperCase();
      const fontFamily = `${pixelFont.style.fontFamily}, monospace`;
      // Small atlas font size + nearest-neighbor sampling is what produces
      // the blocky/pixelated GBA-style edges when scaled up on screen.
      // Press Start 2P is already a chunky pixel font, so a modest size is
      // plenty — it also keeps each glyph from getting too wide.
      const atlasFontSize = 32;

      // Force the self-hosted pixel font to actually load before we measure
      // or draw with it — canvas text won't wait for @font-face on its own
      // the way DOM text does, since nothing else on the page uses it.
      if (typeof document !== "undefined" && "fonts" in document) {
        await Promise.race([
          document.fonts.load(`${atlasFontSize}px ${fontFamily}`),
          new Promise((resolve) => setTimeout(resolve, 400)),
        ]).catch(() => {});
      }
      if (destroyed || !container) return;

      const measureCanvas = document.createElement("canvas");
      const mctx = measureCanvas.getContext("2d");
      if (!mctx) return;
      mctx.font = `${atlasFontSize}px ${fontFamily}`;

      let cursor = 0;
      // Extra breathing room between glyphs (in the same units as font-atlas
      // pixels) — only affects each letter's final resting *position*, not
      // its size, speed, or path shape. Needed because the resting scale
      // (END_SCALE, above) makes each letter visually bigger than its
      // original tightly-kerned slot, which otherwise reads as overlapping
      // once landed.
      const LETTER_GAP = atlasFontSize * 0.58;
      const chars = Array.from(upperLabel);
      const rawMetrics = chars.map((char, i) => {
        const width = char === " " ? atlasFontSize * 0.55 : mctx.measureText(char).width;
        const entry = { char, x: cursor, width };
        cursor += width;
        if (i < chars.length - 1) cursor += LETTER_GAP;
        return entry;
      });
      const totalWidth = cursor;
      const atlasW = Math.ceil(totalWidth) + 8;
      const atlasH = Math.ceil(atlasFontSize * 1.5);

      const atlasCanvas = document.createElement("canvas");
      atlasCanvas.width = atlasW;
      atlasCanvas.height = atlasH;
      const actx = atlasCanvas.getContext("2d");
      if (!actx) return;
      actx.fillStyle = "#ffffff";
      actx.textAlign = "left";
      actx.textBaseline = "middle";
      actx.font = `${atlasFontSize}px ${fontFamily}`;
      rawMetrics.forEach(({ char, x }) => {
        if (char !== " ") actx.fillText(char, x + 4, atlasH / 2 + 2);
      });

      const renderer = new Renderer({
        alpha: true,
        dpr: Math.min(window.devicePixelRatio || 1, 2),
      });
      const gl = renderer.gl;
      gl.canvas.style.width = "100%";
      gl.canvas.style.height = "100%";
      gl.canvas.style.display = "block";
      container.appendChild(gl.canvas);

      const resize = () => {
        const { clientWidth, clientHeight } = container;
        renderer.setSize(clientWidth || 1, clientHeight || 1);
      };
      resize();

      const texture = new Texture(gl, {
        image: atlasCanvas,
        generateMipmaps: false,
        minFilter: gl.NEAREST,
        magFilter: gl.NEAREST,
      });

      const root = new Transform();

      // Overall on-screen box the whole word occupies; recomputed on resize.
      // Sized large and close to the reference GBA wordmark, which fills
      // most of the screen width. This is the *layout* box each letter's
      // slot is positioned within — the actual rendered size (bigger, per
      // END_SCALE above) is applied per-letter at draw time, so growing the
      // resting size doesn't fight this width/height fit-to-viewport logic.
      const box = { halfWidth: 0.3, halfHeight: 0.08 };
      const updateBox = () => {
        const { clientWidth, clientHeight } = container;
        const w = clientWidth || 1;
        const h = clientHeight || 1;
        let desiredWidthPx = Math.min(w * 0.9, 1400);
        let desiredHeightPx = desiredWidthPx * (atlasH / atlasW);
        // Guard against overflow on short/narrow viewports (e.g. mobile
        // portrait), where width-based sizing alone could make the wordmark
        // taller than the screen.
        const maxHeightPx = h * 0.5;
        if (desiredHeightPx > maxHeightPx) {
          desiredHeightPx = maxHeightPx;
          desiredWidthPx = desiredHeightPx * (atlasW / atlasH);
        }
        box.halfWidth = desiredWidthPx / w / 2;
        box.halfHeight = desiredHeightPx / h / 2;
      };
      updateBox();

      const ro = new ResizeObserver(() => {
        resize();
        updateBox();
      });
      ro.observe(container);

      const letters: LetterEntry[] = [];
      const visibleCount = rawMetrics.filter((m) => m.char !== " ").length;
      let visibleIndex = 0;
      rawMetrics.forEach(({ char, x, width }) => {
        if (char === " ") return;

        const u0 = x / atlasW;
        const u1 = (x + width) / atlasW;
        const centerXFrac = (x + width / 2) / totalWidth;
        const halfWidthFrac = width / totalWidth / 2;
        // Spread each letter's flash color evenly around the color wheel so
        // the entrance reads as a burst of varied color across the word.
        const hue = (visibleIndex / Math.max(visibleCount, 1)) * 320;
        const color = hslToRgb(hue, 0.85, 0.6);

        const geometry = new Geometry(gl, {
          position: {
            size: 2,
            data: new Float32Array([
              -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5,
            ]),
          },
          uv: {
            size: 2,
            data: new Float32Array([
              u0, 0, u1, 0, u0, 1, u1, 0, u1, 1, u0, 1,
            ]),
          },
        });

        const program = new Program(gl, {
          vertex: VERTEX,
          fragment: FRAGMENT,
          transparent: true,
          depthTest: false,
          uniforms: {
            tMask: { value: texture },
            uTime: { value: 0 },
            uOpacity: { value: 0 },
            uSweep: { value: 0 },
            uGlobalU0: { value: centerXFrac - halfWidthFrac },
            uGlobalU1: { value: centerXFrac + halfWidthFrac },
            uCenter: { value: [0, 0] },
            uHalfSize: { value: [0, 0] },
            uLetterColor: { value: color },
            uColorMix: { value: 0 },
          },
        });

        const mesh = new Mesh(gl, { geometry, program });
        mesh.setParent(root);

        letters.push({
          mesh,
          program,
          centerXFrac,
          halfWidthFrac,
          globalU0: centerXFrac - halfWidthFrac,
          globalU1: centerXFrac + halfWidthFrac,
          startDelayMs: visibleIndex * staggerMs,
          color,
        });
        visibleIndex += 1;
      });

      const lastLetterDelay =
        letters.length > 0 ? letters[letters.length - 1].startDelayMs : 0;
      const settleTimeMs = lastLetterDelay + letterDurationMs;
      // Each letter's own post-landing bounce starts right after *its own*
      // entrance finishes (not the whole word's) — this keeps every letter
      // cascading through "fly in -> bounce -> settle" independently instead
      // of everyone waiting for the last letter before bouncing.
      const bounceDurationMs = BOUNCE_CYCLE_MS * BOUNCE_REPEATS;
      const lastLetterBounceEnd =
        lastLetterDelay + letterDurationMs + BOUNCE_GAP_MS + bounceDurationMs;
      const sweepStartMs = lastLetterBounceEnd + sweepGapMs;
      let settledFired = false;
      let sweepStartFired = false;
      let sweepCompleteFired = false;
      const letterStartFired = new Array(letters.length).fill(false);

      const startTime = performance.now();

      const tick = () => {
        if (destroyed) return;
        const elapsed = performance.now() - startTime;

        letters.forEach(({ program, centerXFrac, halfWidthFrac, startDelayMs }, i) => {
          const rawT = (elapsed - startDelayMs) / letterDurationMs;
          const started = rawT > 0;
          const t = Math.min(Math.max(rawT, 0), 1);
          const scaleEased = scaleProgress(t);

          const entranceScale = END_SCALE + (START_SCALE - END_SCALE) * (1 - scaleEased);

          // Hand-tuned flight path (see PATH_* constants above), driven by
          // the raw (un-overshot) progress so it always resolves cleanly to
          // the letter's true resting position.
          const [flightX, flightY] = flightOffset(t);

          // Once this letter has landed, it immediately does its own couple
          // of in-place bounces — independent of any other letter.
          const letterBounceStart = startDelayMs + letterDurationMs + BOUNCE_GAP_MS;
          const bounce =
            t >= 1 ? bounceScale(elapsed - letterBounceStart) : 1;
          const scale = entranceScale * bounce;

          program.uniforms.uCenter.value = [
            (centerXFrac - 0.5) * box.halfWidth * 2 + flightX,
            flightY,
          ];
          program.uniforms.uHalfSize.value = [
            halfWidthFrac * box.halfWidth * 2 * scale,
            box.halfHeight * scale,
          ];
          program.uniforms.uOpacity.value = started ? 1 : 0;
          program.uniforms.uColorMix.value = 1 - scaleEased;
          program.uniforms.uTime.value = elapsed / 1000;

          if (started && !letterStartFired[i]) {
            letterStartFired[i] = true;
            callbacksRef.current.onLetterStart?.(i, letters.length);
          }
        });

        if (!settledFired && elapsed >= settleTimeMs) {
          settledFired = true;
          callbacksRef.current.onLettersSettled?.();
        }

        const sweepT = Math.min(
          Math.max((elapsed - sweepStartMs) / sweepDurationMs, 0),
          1
        );
        letters.forEach(({ program }) => {
          program.uniforms.uSweep.value = sweepT;
        });

        if (!sweepStartFired && elapsed >= sweepStartMs) {
          sweepStartFired = true;
          callbacksRef.current.onSweepStart?.();
        }

        if (!sweepCompleteFired && elapsed >= sweepStartMs + sweepDurationMs) {
          sweepCompleteFired = true;
          callbacksRef.current.onSweepComplete?.();
        }

        renderer.render({ scene: root });
        rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);

      disposeGl = () => {
        ro.disconnect();
        if (gl.canvas.parentElement === container) {
          container.removeChild(gl.canvas);
        }
        const ext = gl.getExtension("WEBGL_lose_context");
        ext?.loseContext();
      };
    };

    setup();

    return () => {
      destroyed = true;
      cancelAnimationFrame(rafId);
      disposeGl?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [label, staggerMs, letterDurationMs, sweepGapMs, sweepDurationMs]);

  return (
    <Box
      ref={containerRef}
      width="100%"
      height="100%"
      position="absolute"
      inset={0}
      aria-hidden="true"
    />
  );
}
