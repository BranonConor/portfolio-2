"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { Box, Flex, Text, Button, Image } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "doodle-jump-high-score";

// Game constants
const PLAYER_RATIO = 0.07;
const PLATFORM_W_RATIO = 0.14;
const PLATFORM_H = 8;
const GRAVITY = 0.38;
const JUMP_FORCE = -11.8;
const BOOST_FORCE = -20;
const MOVE_SPEED = 5.5;
const PLATFORM_COUNT = 9;

// Max gap a normal jump can clear (derived from physics)
// Jump height = v^2 / (2*g) ≈ 11.8^2 / (2*0.38) ≈ 183px
// Safe max gap is ~75% of that to account for horizontal movement
const MAX_PLATFORM_GAP = 140;
const MIN_PLATFORM_GAP = 50;

// 8-bit color palette — paint stroke void theme
const COLORS = {
  bg1: "#0a0a0c",
  bg2: "#111114",
  bg3: "#1a1a1f",
  platformNormal: "#6e56cf",
  platformMoving: "#e5484d",
  platformFragile: "#464650",
  boost: "#f5d90a",
  boostGlow: "rgba(245, 217, 10, 0.5)",
  particle: "#a78bfa",
  stroke1: "#6e56cf",
  stroke2: "#e5484d",
  stroke3: "#3e63dd",
  text: "#ededef",
  textMuted: "#706f78",
};

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: "jump" | "trail" | "death" | "boost" | "stroke";
  pixel?: boolean;
}

interface Platform {
  x: number;
  y: number;
  width: number;
  type: "normal" | "moving" | "fragile";
  dx?: number;
  broken?: boolean;
  pulsePhase?: number;
}

interface Boost {
  x: number;
  y: number;
  size: number;
  collected: boolean;
  pulsePhase: number;
}

// Paint stroke decorations that float in the void
interface StrokeDecor {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  opacity: number;
  speed: number;
  rotation: number;
}

interface DoodleJumpGameProps {
  onClose: () => void;
  portraitSrc: string;
}

// Pixel-perfect rectangle drawing helper (8-bit feel)
function pixelRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

// Draw a pixelated paint stroke shape
function drawPaintStroke(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
  opacity: number,
  rotation: number
) {
  ctx.save();
  ctx.translate(x + width / 2, y + height / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.globalAlpha = opacity;
  ctx.fillStyle = color;

  // Pixelated brush stroke — several offset rectangles
  const step = Math.max(2, Math.floor(height / 3));
  for (let i = 0; i < 5; i++) {
    const offsetX = (i - 2) * step * 0.8;
    const offsetY = Math.sin(i * 1.2) * step * 0.4;
    const w = width * (0.7 + Math.sin(i * 0.9) * 0.3);
    const h = height * (0.5 + Math.cos(i * 1.1) * 0.3);
    pixelRect(ctx, -w / 2 + offsetX, -h / 2 + offsetY, w, h);
  }

  ctx.restore();
}

export function DoodleJumpGame({ onClose, portraitSrc }: DoodleJumpGameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number>(0);
  const keysRef = useRef<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const portraitImgRef = useRef<HTMLImageElement | null>(null);
  const canvasSizeRef = useRef({ width: 600, height: 700 });
  const shakeRef = useRef({ x: 0, y: 0, intensity: 0 });
  const frameCountRef = useRef(0);

  // Game state refs
  const playerRef = useRef({
    x: 0,
    y: 0,
    vy: JUMP_FORCE,
    vx: 0,
    facingLeft: false,
    squash: 1,
    isBoosting: false,
    boostTimer: 0,
    jumpsLeft: 2, // double jump
    canDoubleJump: true,
  });
  const platformsRef = useRef<Platform[]>([]);
  const boostsRef = useRef<Boost[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const strokeImgsRef = useRef<HTMLImageElement[]>([]);
  const strokesRef = useRef<StrokeDecor[]>([]);
  const scoreRef = useRef(0);
  const maxHeightRef = useRef(0);

  // Load high score
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setHighScore(parseInt(stored, 10));
  }, []);

  // Preload portrait image
  useEffect(() => {
    const img = new window.Image();
    img.src = portraitSrc;
    img.onload = () => {
      portraitImgRef.current = img;
    };
  }, [portraitSrc]);

  // Preload paint stroke images (the actual site PNGs)
  useEffect(() => {
    const srcs = ["/s1.png", "/s2.png", "/s3.png", "/s4.png", "/s5.png", "/s6.png"];
    const imgs: HTMLImageElement[] = [];
    for (const src of srcs) {
      const img = new window.Image();
      img.src = src;
      imgs.push(img);
    }
    strokeImgsRef.current = imgs;
  }, []);

  // Generate background paint stroke positions
  useEffect(() => {
    const strokes: StrokeDecor[] = [];
    const colors = [COLORS.stroke1, COLORS.stroke2, COLORS.stroke3];
    for (let i = 0; i < 10; i++) {
      strokes.push({
        x: Math.random(),
        y: Math.random(),
        width: Math.random() * 200 + 80,
        height: Math.random() * 30 + 10,
        color: colors[i % colors.length],
        opacity: Math.random() * 0.12 + 0.04,
        speed: Math.random() * 0.12 + 0.04,
        rotation: Math.random() * 50 - 25,
      });
    }
    strokesRef.current = strokes;
  }, []);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const width = Math.floor(rect.width);
        const height = Math.floor(rect.height);
        canvasRef.current.width = width;
        canvasRef.current.height = height;
        canvasSizeRef.current = { width, height };
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Spawn particles
  const spawnParticles = useCallback(
    (x: number, y: number, count: number, type: Particle["type"], baseColor: string) => {
      const particles = particlesRef.current;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
        const speed =
          type === "death"
            ? Math.random() * 5 + 2
            : type === "boost"
            ? Math.random() * 4 + 1
            : Math.random() * 3 + 1;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - (type === "jump" ? 2 : 0),
          life: 1,
          maxLife: type === "death" ? 50 : type === "boost" ? 35 : 20,
          size:
            type === "death"
              ? Math.random() * 4 + 2
              : Math.random() * 3 + 1.5,
          color: baseColor,
          type,
          pixel: true,
        });
      }
    },
    []
  );

  // Generate platforms with guaranteed reachability
  const generatePlatforms = useCallback(() => {
    const { width, height } = canvasSizeRef.current;
    const platWidth = width * PLATFORM_W_RATIO;
    const platforms: Platform[] = [];

    // Start platform directly under player
    let lastY = height - 60;
    platforms.push({
      x: width / 2 - platWidth / 2,
      y: lastY,
      width: platWidth,
      type: "normal",
      pulsePhase: Math.random() * Math.PI * 2,
    });

    // Generate upward with guaranteed reachable gaps
    for (let i = 1; i < PLATFORM_COUNT; i++) {
      const gap = MIN_PLATFORM_GAP + Math.random() * (MAX_PLATFORM_GAP - MIN_PLATFORM_GAP);
      lastY -= gap;
      const x = Math.random() * (width - platWidth);
      const rand = Math.random();
      let type: Platform["type"] = "normal";
      // Only allow moving/fragile after first few platforms, never two fragile in a row
      if (i > 2 && rand > 0.82) type = "moving";
      else if (i > 3 && rand > 0.68 && platforms[i - 1].type !== "fragile")
        type = "fragile";

      platforms.push({
        x,
        y: lastY,
        width: platWidth,
        type,
        dx: type === "moving" ? (Math.random() > 0.5 ? 1.8 : -1.8) : 0,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }
    return platforms;
  }, []);

  // Generate boosts (rockets/springs)
  const generateBoosts = useCallback(() => {
    const { width, height } = canvasSizeRef.current;
    const boosts: Boost[] = [];
    // One boost every ~3 screens worth initially
    if (Math.random() > 0.5) {
      boosts.push({
        x: Math.random() * (width - 30) + 15,
        y: height * 0.3 + Math.random() * height * 0.3,
        size: 18,
        collected: false,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }
    return boosts;
  }, []);

  const startGame = useCallback(() => {
    const { width, height } = canvasSizeRef.current;
    const playerSize = width * PLAYER_RATIO;
    playerRef.current = {
      x: width / 2 - playerSize / 2,
      y: height - 120,
      vy: JUMP_FORCE,
      vx: 0,
      facingLeft: false,
      squash: 1,
      isBoosting: false,
      boostTimer: 0,
      jumpsLeft: 2,
      canDoubleJump: true,
    };
    platformsRef.current = generatePlatforms();
    boostsRef.current = generateBoosts();
    particlesRef.current = [];
    scoreRef.current = 0;
    maxHeightRef.current = 0;
    shakeRef.current = { x: 0, y: 0, intensity: 0 };
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
  }, [generatePlatforms, generateBoosts]);

  // Key handlers
  const doubleJumpPressedRef = useRef(false);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      if (e.key === "Escape") onClose();
      // Double jump on space or up arrow (only triggers once per press)
      if (
        (e.key === " " || e.key === "ArrowUp" || e.key === "w") &&
        !doubleJumpPressedRef.current &&
        gameStarted &&
        !gameOver
      ) {
        doubleJumpPressedRef.current = true;
        const player = playerRef.current;
        if (player.jumpsLeft > 0 && player.vy > -8) {
          player.vy = JUMP_FORCE * 0.85;
          player.jumpsLeft--;
          player.squash = 0.7;
          const { width } = canvasSizeRef.current;
          const playerSize = width * PLAYER_RATIO;
          spawnParticles(
            player.x + playerSize / 2,
            player.y + playerSize,
            4,
            "jump",
            COLORS.particle
          );
        }
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key);
      if (e.key === " " || e.key === "ArrowUp" || e.key === "w") {
        doubleJumpPressedRef.current = false;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [onClose, gameStarted, gameOver, spawnParticles]);

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const loop = () => {
      const { width, height } = canvasSizeRef.current;
      const playerSize = width * PLAYER_RATIO;
      const platWidth = width * PLATFORM_W_RATIO;
      const player = playerRef.current;
      const platforms = platformsRef.current;
      const boosts = boostsRef.current;
      const particles = particlesRef.current;
      const keys = keysRef.current;
      frameCountRef.current++;

      // --- INPUT ---
      if (keys.has("ArrowLeft") || keys.has("a")) {
        player.vx = -MOVE_SPEED;
        player.facingLeft = true;
      } else if (keys.has("ArrowRight") || keys.has("d")) {
        player.vx = MOVE_SPEED;
        player.facingLeft = false;
      } else {
        player.vx *= 0.82;
      }

      // --- PHYSICS ---
      if (player.isBoosting) {
        player.boostTimer--;
        if (player.boostTimer <= 0) {
          player.isBoosting = false;
        }
        // Reduced gravity during boost
        player.vy += GRAVITY * 0.2;
      } else {
        player.vy += GRAVITY;
      }
      player.x += player.vx;
      player.y += player.vy;

      // Squash & stretch
      if (player.vy < -2) {
        player.squash = 0.82 + Math.min(Math.abs(player.vy) * 0.008, 0.15);
      } else if (player.vy > 2) {
        player.squash = 1.18 - Math.min(player.vy * 0.008, 0.15);
      } else {
        player.squash += (1 - player.squash) * 0.12;
      }

      // Boost trail
      if (player.isBoosting && frameCountRef.current % 2 === 0) {
        particles.push({
          x: player.x + playerSize / 2 + (Math.random() - 0.5) * 8,
          y: player.y + playerSize,
          vx: (Math.random() - 0.5) * 1.5,
          vy: Math.random() * 2 + 1,
          life: 1,
          maxLife: 20,
          size: Math.random() * 4 + 2,
          color: COLORS.boost,
          type: "boost",
          pixel: true,
        });
      }

      // Normal trail
      if (!player.isBoosting && Math.abs(player.vy) > 5 && frameCountRef.current % 4 === 0) {
        particles.push({
          x: player.x + playerSize / 2 + (Math.random() - 0.5) * 6,
          y: player.y + playerSize,
          vx: (Math.random() - 0.5) * 0.3,
          vy: 0.3,
          life: 1,
          maxLife: 12,
          size: Math.random() * 2 + 1,
          color: COLORS.particle,
          type: "trail",
          pixel: true,
        });
      }

      // Wrap around screen edges
      if (player.x > width) player.x = -playerSize;
      if (player.x + playerSize < 0) player.x = width;

      // --- PLATFORM COLLISION (only when falling) ---
      if (player.vy > 0 && !player.isBoosting) {
        for (const plat of platforms) {
          if (plat.broken) continue;
          if (
            player.x + playerSize > plat.x + 5 &&
            player.x < plat.x + plat.width - 5 &&
            player.y + playerSize >= plat.y &&
            player.y + playerSize <= plat.y + PLATFORM_H + player.vy + 2
          ) {
            if (plat.type === "fragile") {
              plat.broken = true;
              spawnParticles(plat.x + plat.width / 2, plat.y, 6, "death", COLORS.platformFragile);
              shakeRef.current.intensity = 3;
            } else {
              player.vy = JUMP_FORCE;
              player.y = plat.y - playerSize;
              player.squash = 0.65;
              player.jumpsLeft = 2; // Reset double jump on landing
              spawnParticles(
                player.x + playerSize / 2,
                plat.y,
                5,
                "jump",
                plat.type === "moving" ? COLORS.platformMoving : COLORS.platformNormal
              );
            }
          }
        }
      }

      // --- BOOST COLLISION ---
      for (const boost of boosts) {
        if (boost.collected) continue;
        const bx = boost.x;
        const by = boost.y;
        const bs = boost.size;
        if (
          player.x + playerSize > bx - bs &&
          player.x < bx + bs &&
          player.y + playerSize > by - bs &&
          player.y < by + bs
        ) {
          boost.collected = true;
          player.vy = BOOST_FORCE;
          player.isBoosting = true;
          player.boostTimer = 40;
          spawnParticles(bx, by, 10, "boost", COLORS.boost);
          shakeRef.current.intensity = 4;
        }
        boost.pulsePhase += 0.06;
      }

      // Move moving platforms
      for (const plat of platforms) {
        if (plat.type === "moving" && plat.dx) {
          plat.x += plat.dx;
          if (plat.x <= 0 || plat.x + plat.width >= width) {
            plat.dx *= -1;
          }
        }
        if (plat.pulsePhase !== undefined) plat.pulsePhase += 0.04;
      }

      // --- SCROLL WORLD ---
      const scrollThreshold = height * 0.35;
      if (player.y < scrollThreshold) {
        const offset = scrollThreshold - player.y;
        player.y = scrollThreshold;
        maxHeightRef.current += offset;
        scoreRef.current = Math.floor(maxHeightRef.current / 8);
        setScore(scoreRef.current);

        for (const plat of platforms) plat.y += offset;
        for (const boost of boosts) boost.y += offset;
        for (const p of particles) p.y += offset;

        // Recycle platforms with guaranteed reachability
        // Sort by y ascending to know what's highest
        let highestY = Math.min(...platforms.map((p) => p.y));

        for (let i = platforms.length - 1; i >= 0; i--) {
          if (platforms[i].y > height + 20) {
            // Place new platform reachable from the current highest
            const gap = MIN_PLATFORM_GAP + Math.random() * (MAX_PLATFORM_GAP - MIN_PLATFORM_GAP);
            const newY = highestY - gap;
            const newX = Math.random() * (width - platWidth);
            const rand = Math.random();
            let type: Platform["type"] = "normal";
            if (scoreRef.current > 60 && rand > 0.78) type = "moving";
            else if (
              scoreRef.current > 40 &&
              rand > 0.62 &&
              platforms.filter((p) => p.type === "fragile" && !p.broken).length < 2
            )
              type = "fragile";

            platforms[i] = {
              x: newX,
              y: newY,
              width: platWidth,
              type,
              dx: type === "moving" ? (Math.random() > 0.5 ? 2 : -2) : 0,
              broken: false,
              pulsePhase: Math.random() * Math.PI * 2,
            };
            highestY = newY;
          }
        }

        // Recycle boosts — spawn new ones occasionally
        for (let i = boosts.length - 1; i >= 0; i--) {
          if (boosts[i].y > height + 50) {
            boosts.splice(i, 1);
          }
        }
        // Chance to spawn a new boost above
        if (boosts.length < 2 && Math.random() < 0.008) {
          boosts.push({
            x: Math.random() * (width - 30) + 15,
            y: -30 - Math.random() * 100,
            size: 18,
            collected: false,
            pulsePhase: Math.random() * Math.PI * 2,
          });
        }
      }

      // --- SCREEN SHAKE ---
      if (shakeRef.current.intensity > 0) {
        shakeRef.current.x = (Math.random() - 0.5) * shakeRef.current.intensity * 2;
        shakeRef.current.y = (Math.random() - 0.5) * shakeRef.current.intensity * 2;
        shakeRef.current.intensity *= 0.82;
        if (shakeRef.current.intensity < 0.1) shakeRef.current.intensity = 0;
      }

      // --- UPDATE PARTICLES ---
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1 / p.maxLife;
        if (p.type === "jump" || p.type === "death") p.vy += 0.12;
        if (p.type === "boost") p.vy += 0.05;
        if (p.life <= 0) particles.splice(i, 1);
      }

      // --- GAME OVER ---
      if (player.y > height + 50) {
        spawnParticles(player.x + playerSize / 2, height - 80, 16, "death", COLORS.platformMoving);
        shakeRef.current.intensity = 8;
        const finalScore = scoreRef.current;
        const stored = localStorage.getItem(STORAGE_KEY);
        const currentHigh = stored ? parseInt(stored, 10) : 0;
        if (finalScore > currentHigh) {
          localStorage.setItem(STORAGE_KEY, String(finalScore));
          setHighScore(finalScore);
        }
        setGameOver(true);
        return;
      }

      // ========== DRAW ==========
      ctx.save();
      ctx.translate(shakeRef.current.x, shakeRef.current.y);

      // Background — void with subtle layered darkness
      ctx.fillStyle = COLORS.bg1;
      ctx.fillRect(-10, -10, width + 20, height + 20);

      // Drifting paint strokes in the void background (real PNGs)
      const strokes = strokesRef.current;
      const strokeImgs = strokeImgsRef.current;
      for (let si = 0; si < strokes.length; si++) {
        const s = strokes[si];
        const sy = ((s.y * height + frameCountRef.current * s.speed) % (height + 100)) - 50;
        const img = strokeImgs[si % strokeImgs.length];
        if (img && img.complete && img.naturalWidth > 0) {
          ctx.save();
          const sx = s.x * width;
          ctx.translate(sx + s.width / 2, sy + s.height / 2);
          ctx.rotate((s.rotation * Math.PI) / 180);
          ctx.globalAlpha = s.opacity;
          ctx.drawImage(img, -s.width / 2, -s.height / 2, s.width, s.height);
          ctx.restore();
        } else {
          // Fallback: draw pixelated stroke shape
          drawPaintStroke(ctx, s.x * width, sy, s.width, s.height, s.color, s.opacity, s.rotation);
        }
      }

      // Subtle vignette via dark corners
      const vignette = ctx.createRadialGradient(
        width / 2, height / 2, height * 0.3,
        width / 2, height / 2, height * 0.8
      );
      vignette.addColorStop(0, "transparent");
      vignette.addColorStop(1, "rgba(0, 0, 0, 0.4)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      // --- PLATFORMS (8-bit pixel style) ---
      for (const plat of platforms) {
        if (plat.broken) continue;

        const pulse = Math.sin(plat.pulsePhase || 0) * 0.2 + 0.8;
        let color = COLORS.platformNormal;
        if (plat.type === "moving") color = COLORS.platformMoving;
        else if (plat.type === "fragile") color = COLORS.platformFragile;

        // Platform glow (subtle)
        ctx.save();
        ctx.shadowBlur = 8 * pulse;
        ctx.shadowColor = color;
        ctx.fillStyle = color;

        // Pixelated platform (stacked rects for 8-bit look)
        const px = Math.round(plat.x);
        const py = Math.round(plat.y);
        const pw = Math.round(plat.width);
        // Main body
        pixelRect(ctx, px + 2, py, pw - 4, PLATFORM_H);
        // Top/bottom insets for pixel look
        pixelRect(ctx, px, py + 2, pw, PLATFORM_H - 4);

        // Highlight
        ctx.fillStyle = `rgba(255,255,255,${0.15 * pulse})`;
        pixelRect(ctx, px + 2, py, pw - 4, 2);

        ctx.restore();
      }

      // --- BOOSTS (pulsing pixel diamond) ---
      for (const boost of boosts) {
        if (boost.collected) continue;
        const pulse = Math.sin(boost.pulsePhase) * 0.3 + 0.7;
        const bx = Math.round(boost.x);
        const by = Math.round(boost.y);
        const bs = Math.round(boost.size * pulse);

        ctx.save();
        ctx.shadowBlur = 12;
        ctx.shadowColor = COLORS.boostGlow;
        ctx.fillStyle = COLORS.boost;

        // Diamond shape (pixel)
        const half = Math.round(bs / 2);
        ctx.beginPath();
        ctx.moveTo(bx, by - half);
        ctx.lineTo(bx + half, by);
        ctx.lineTo(bx, by + half);
        ctx.lineTo(bx - half, by);
        ctx.closePath();
        ctx.fill();

        // Inner highlight
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        const inner = Math.round(half * 0.4);
        ctx.beginPath();
        ctx.moveTo(bx, by - inner);
        ctx.lineTo(bx + inner, by);
        ctx.lineTo(bx, by + inner);
        ctx.lineTo(bx - inner, by);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }

      // --- PARTICLES (pixel squares) ---
      for (const p of particles) {
        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        if (p.pixel) {
          // 8-bit square particles
          const s = Math.round(p.size * p.life);
          pixelRect(ctx, Math.round(p.x) - s / 2, Math.round(p.y) - s / 2, s, s);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // --- PLAYER ---
      ctx.save();
      const ppx = player.x + playerSize / 2;
      const ppy = player.y + playerSize / 2;
      ctx.translate(ppx, ppy);
      ctx.scale(2 - player.squash, player.squash);

      // Player glow
      if (player.isBoosting) {
        ctx.shadowBlur = 20;
        ctx.shadowColor = COLORS.boostGlow;
      } else {
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(110, 86, 207, 0.4)";
      }

      if (portraitImgRef.current) {
        if (player.facingLeft) ctx.scale(-1, 1);
        // Pixelate slightly by disabling smoothing
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(
          portraitImgRef.current,
          -playerSize / 2,
          -playerSize / 2,
          playerSize,
          playerSize
        );
        ctx.imageSmoothingEnabled = true;
      } else {
        ctx.fillStyle = COLORS.platformNormal;
        pixelRect(ctx, -playerSize / 2, -playerSize / 2, playerSize, playerSize);
      }
      ctx.restore();

      // --- HUD on canvas (8-bit font style) ---
      ctx.save();
      ctx.font = "bold 12px monospace";
      ctx.fillStyle = COLORS.textMuted;
      ctx.fillText(`SCORE ${scoreRef.current}`, 12, 24);
      ctx.restore();

      ctx.restore(); // End shake transform

      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(gameLoopRef.current);
  }, [gameStarted, gameOver, spawnParticles]);

  return (
    <Box
      ref={containerRef}
      position="relative"
      width="100%"
      height="100%"
      minHeight="500px"
      overflow="hidden"
      borderRadius="12px"
      bg={COLORS.bg1}
    >
      {/* Full-bleed game canvas */}
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          position: "absolute",
          inset: 0,
          imageRendering: "pixelated",
        }}
      />

      {/* HUD overlay */}
      <Flex
        position="absolute"
        top={0}
        left={0}
        right={0}
        justify="space-between"
        align="center"
        px={4}
        py={3}
        zIndex={2}
        pointerEvents="none"
      >
        <Flex align="center" gap={3} pointerEvents="auto">
          <Text
            fontSize="12px"
            fontWeight="700"
            color={COLORS.text}
            fontFamily="monospace"
            opacity={0.8}
          >
            SCORE: {score}
          </Text>
          <Text fontSize="11px" color={COLORS.textMuted} fontFamily="monospace">
            BEST: {highScore}
          </Text>
        </Flex>
        <Button
          size="xs"
          variant="ghost"
          onClick={onClose}
          color={COLORS.textMuted}
          _hover={{ color: COLORS.text, bg: "whiteAlpha.100" }}
          fontSize="11px"
          fontFamily="monospace"
          pointerEvents="auto"
          borderRadius="4px"
        >
          [ESC]
        </Button>
      </Flex>

      {/* Legend — bottom */}
      {gameStarted && !gameOver && (
        <Flex
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          justify="center"
          gap={4}
          py={2}
          zIndex={2}
          pointerEvents="none"
          fontFamily="monospace"
        >
          <Flex align="center" gap={1} fontSize="9px" color={COLORS.textMuted}>
            <Box w="8px" h="4px" bg={COLORS.platformNormal} />
            PLAT
          </Flex>
          <Flex align="center" gap={1} fontSize="9px" color={COLORS.textMuted}>
            <Box w="8px" h="4px" bg={COLORS.platformMoving} />
            MOVE
          </Flex>
          <Flex align="center" gap={1} fontSize="9px" color={COLORS.textMuted}>
            <Box w="8px" h="4px" bg={COLORS.platformFragile} />
            FRAG
          </Flex>
          <Flex align="center" gap={1} fontSize="9px" color={COLORS.textMuted}>
            <Box
              w="6px"
              h="6px"
              bg={COLORS.boost}
              transform="rotate(45deg)"
            />
            BOOST
          </Flex>
        </Flex>
      )}

      {/* Start / Game Over overlay */}
      <AnimatePresence>
        {(!gameStarted || gameOver) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 3,
            }}
          >
            <Flex
              direction="column"
              align="center"
              justify="center"
              bg="rgba(10, 10, 12, 0.92)"
              backdropFilter="blur(8px)"
              borderRadius="12px"
              border={`1px solid ${COLORS.platformNormal}33`}
              p={8}
              gap={4}
              maxWidth="300px"
              fontFamily="monospace"
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Image
                  src={portraitSrc}
                  alt="Player character"
                  width="60px"
                  height="60px"
                  objectFit="contain"
                  filter={`drop-shadow(0 0 10px ${COLORS.platformNormal}66)`}
                  style={{ imageRendering: "pixelated" } as React.CSSProperties}
                />
              </motion.div>

              {gameOver ? (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring" }}
                  >
                    <Text
                      fontSize="20px"
                      fontWeight="800"
                      color={COLORS.text}
                      textTransform="uppercase"
                      letterSpacing="0.1em"
                    >
                      Game Over
                    </Text>
                  </motion.div>
                  <Text fontSize="13px" color={COLORS.textMuted}>
                    SCORE: {score}
                    {score >= highScore && score > 0 && " ★ NEW BEST"}
                  </Text>
                </>
              ) : (
                <Text
                  fontSize="16px"
                  fontWeight="700"
                  color={COLORS.text}
                  textTransform="uppercase"
                  letterSpacing="0.08em"
                >
                  Doodle Jump
                </Text>
              )}

              <Text
                fontSize="11px"
                color={COLORS.textMuted}
                textAlign="center"
                lineHeight="1.6"
              >
                [←][→] or [A][D] to move
                <br />
                [SPACE] to double jump
                <br />
                climb · collect boosts!
              </Text>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="sm"
                  bg={COLORS.platformNormal}
                  color="white"
                  fontWeight="700"
                  fontFamily="monospace"
                  textTransform="uppercase"
                  letterSpacing="0.05em"
                  _hover={{ opacity: 0.9 }}
                  onClick={startGame}
                  borderRadius="4px"
                  px={6}
                >
                  {gameOver ? "[RETRY]" : "[START]"}
                </Button>
              </motion.div>
            </Flex>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
