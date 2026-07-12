"use client";

import { useEffect, useRef, useCallback, useState } from "react";

const STYLES = [
  "original",       // Actual PNG image drawn on canvas
  "pointillism",    // Bold colored dots
  "glitch",         // RGB split + scanlines + displacement
  "thermal",        // Heat map colors
  "mosaic",         // Bold pixel blocks
  "wireframe",      // Grid + connections
  "neon",           // Glowing neon edges
  "chromatic",      // RGB channel separation
  "halftone",       // Newspaper dot pattern
  "shatter",        // Triangular displaced shards
  "strokes",        // Paint stroke clusters
  "spiral",         // Local spiral motion
  "constellation",  // Star points + lines
  "pop",            // Pop art bold colors
  "liquify",        // Wave distortion
  "electric",       // Electric arcs + sparks
] as const;

type StyleKey = (typeof STYLES)[number];

interface Particle {
  tx: number;
  ty: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  g: number;
  b: number;
  a: number;
  size: number;
  angle: number;
  speed: number;
  brightness: number;
  // Grid position for reference
  gx: number;
  gy: number;
}

interface PortraitCanvasProps {
  src: string;
  width: number;
  height: number;
}

export function PortraitCanvas({ src, width, height }: PortraitCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const [styleIndex, setStyleIndex] = useState(0);
  const currentStyleRef = useRef<StyleKey>("original");
  const [ready, setReady] = useState(false);
  const frameRef = useRef(0);
  const mouseRef = useRef({ x: -1, y: -1, inside: false });
  const sizeRef = useRef({ width, height });
  const strokeImgsRef = useRef<HTMLImageElement[]>([]);
  const portraitImgRef = useRef<HTMLImageElement | null>(null);
  const scaleRef = useRef({ scale: 1, ox: 0, oy: 0, sampleSize: 160 });

  useEffect(() => { sizeRef.current = { width, height }; }, [width, height]);

  // Preload paint stroke images
  useEffect(() => {
    const imgs: HTMLImageElement[] = [];
    for (let i = 1; i <= 6; i++) {
      const img = new window.Image();
      img.src = `/s${i}.png`;
      imgs.push(img);
    }
    strokeImgsRef.current = imgs;
  }, []);

  // Load and sample portrait
  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => {
      portraitImgRef.current = img;
      const sampleSize = 180;
      const offscreen = document.createElement("canvas");
      offscreen.width = sampleSize;
      offscreen.height = sampleSize;
      const octx = offscreen.getContext("2d");
      if (!octx) return;
      octx.drawImage(img, 0, 0, sampleSize, sampleSize);
      const imageData = octx.getImageData(0, 0, sampleSize, sampleSize);

      const { width: cw, height: ch } = sizeRef.current;
      const particles: Particle[] = [];
      const step = 2;
      const scale = Math.min(cw, ch) / sampleSize * 0.88;
      const ox = (cw - sampleSize * scale) / 2;
      const oy = (ch - sampleSize * scale) / 2;
      scaleRef.current = { scale, ox, oy, sampleSize };

      for (let py = 0; py < sampleSize; py += step) {
        for (let px = 0; px < sampleSize; px += step) {
          const i = (py * sampleSize + px) * 4;
          const r = imageData.data[i];
          const g = imageData.data[i + 1];
          const b = imageData.data[i + 2];
          const a = imageData.data[i + 3];
          if (a < 20) continue;

          const tx = px * scale + ox;
          const ty = py * scale + oy;
          const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;

          particles.push({
            tx, ty, x: tx, y: ty,
            vx: 0, vy: 0,
            r, g, b, a,
            size: Math.random() * 1.0 + 1.2,
            angle: Math.random() * Math.PI * 2,
            speed: Math.random() * 0.012 + 0.004,
            brightness,
            gx: px, gy: py,
          });
        }
      }

      particlesRef.current = particles;
      setReady(true);
    };
  }, [src]);

  const handleClick = useCallback(() => {
    const next = (styleIndex + 1) % STYLES.length;
    setStyleIndex(next);
    currentStyleRef.current = STYLES[next];
  }, [styleIndex]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, inside: true };
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { ...mouseRef.current, inside: false };
  }, []);

  // Main render loop
  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const loop = () => {
      const { width: cw, height: ch } = sizeRef.current;
      canvas.width = cw;
      canvas.height = ch;
      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      const style = currentStyleRef.current;
      const frame = ++frameRef.current;

      // --- UPDATE PARTICLES ---
      for (const p of particles) {
        let targetX = p.tx;
        let targetY = p.ty;

        // Per-style target offsets (all maintain shape)
        if (style === "glitch") {
          const band = Math.floor(p.ty / 20);
          const glitchOff = Math.sin(frame * 0.1 + band * 2) * 12;
          const burst = (frame % 90 < 3) ? (Math.random() - 0.5) * 30 : 0;
          targetX = p.tx + glitchOff + burst;
          targetY = p.ty + ((frame % 120 < 2) ? (Math.random() - 0.5) * 15 : 0);
        } else if (style === "wireframe") {
          const grid = 5;
          targetX = Math.round(p.tx / grid) * grid;
          targetY = Math.round(p.ty / grid) * grid;
        } else if (style === "mosaic") {
          const block = 8;
          targetX = Math.round(p.tx / block) * block + block / 2;
          targetY = Math.round(p.ty / block) * block + block / 2;
        } else if (style === "spiral") {
          const spiralAngle = p.angle + frame * p.speed * 2;
          const spiralR = 3 + Math.sin(frame * 0.01 + p.angle) * 2;
          targetX = p.tx + Math.cos(spiralAngle) * spiralR;
          targetY = p.ty + Math.sin(spiralAngle) * spiralR;
        } else if (style === "shatter") {
          const shardAngle = Math.floor(p.angle * 6) / 6 * Math.PI * 2;
          const shardDist = 3 + Math.sin(frame * 0.02 + p.angle * 4) * 4;
          targetX = p.tx + Math.cos(shardAngle) * shardDist;
          targetY = p.ty + Math.sin(shardAngle) * shardDist;
        } else if (style === "liquify") {
          const waveX = Math.sin(frame * 0.03 + p.ty * 0.04) * 8;
          const waveY = Math.cos(frame * 0.025 + p.tx * 0.04) * 5;
          targetX = p.tx + waveX;
          targetY = p.ty + waveY;
        } else if (style === "chromatic") {
          // Slight separation based on channel dominance
          const dominant = p.r > p.g && p.r > p.b ? -3 : p.b > p.g ? 3 : 0;
          targetX = p.tx + dominant;
          targetY = p.ty;
        } else if (style === "electric") {
          const jitter = (frame % 4 < 2) ? (Math.random() - 0.5) * 3 : 0;
          targetX = p.tx + jitter;
          targetY = p.ty + jitter * 0.5;
        }

        // Spring physics
        const dx = targetX - p.x;
        const dy = targetY - p.y;
        const ease = style === "original" ? 0.12 : 0.06;
        p.vx += dx * ease;
        p.vy += dy * ease;
        p.vx *= 0.84;
        p.vy *= 0.84;

        // Mouse repulsion
        if (mouse.inside && mouse.x > 0) {
          const mdx = p.x - mouse.x;
          const mdy = p.y - mouse.y;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
          const repelRadius = 55;
          if (mDist < repelRadius) {
            const force = ((repelRadius - mDist) / repelRadius) * 6;
            p.vx += (mdx / (mDist || 1)) * force;
            p.vy += (mdy / (mDist || 1)) * force;
          }
        }

        p.x += p.vx;
        p.y += p.vy;
      }

      // --- DRAW ---
      ctx.clearRect(0, 0, cw, ch);

      if (style === "original") {
        drawOriginal(ctx, cw, ch, portraitImgRef.current, particles, mouse);
      } else if (style === "pointillism") {
        drawPointillism(ctx, particles);
      } else if (style === "glitch") {
        drawGlitch(ctx, particles, frame, cw, ch);
      } else if (style === "thermal") {
        drawThermal(ctx, particles);
      } else if (style === "mosaic") {
        drawMosaic(ctx, particles);
      } else if (style === "wireframe") {
        drawWireframe(ctx, particles);
      } else if (style === "neon") {
        drawNeon(ctx, particles);
      } else if (style === "chromatic") {
        drawChromatic(ctx, particles);
      } else if (style === "halftone") {
        drawHalftone(ctx, particles);
      } else if (style === "shatter") {
        drawShatter(ctx, particles, frame);
      } else if (style === "strokes") {
        drawStrokes(ctx, particles, strokeImgsRef.current);
      } else if (style === "spiral") {
        drawSpiral(ctx, particles, frame);
      } else if (style === "constellation") {
        drawConstellation(ctx, particles, frame);
      } else if (style === "pop") {
        drawPop(ctx, particles);
      } else if (style === "liquify") {
        drawLiquify(ctx, particles);
      } else if (style === "electric") {
        drawElectric(ctx, particles, frame, cw, ch);
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [ready]);

  return (
    <canvas
      ref={canvasRef}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      width={width}
      height={height}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        transform: "rotate(-6deg)",
        cursor: "pointer",
        pointerEvents: "auto",
      }}
    />
  );
}

// ======== DRAWING STYLES ========

function drawOriginal(
  ctx: CanvasRenderingContext2D,
  cw: number,
  ch: number,
  img: HTMLImageElement | null,
  particles: Particle[],
  mouse: { x: number; y: number; inside: boolean },
) {
  // Draw the actual PNG image as default
  if (img && img.complete) {
    const scale = Math.min(cw, ch) * 0.88;
    const ox = (cw - scale) / 2;
    const oy = (ch - scale) / 2;
    ctx.drawImage(img, ox, oy, scale, scale);

    // If mouse is hovering, draw scattered particles over a faded image
    if (mouse.inside && mouse.x > 0) {
      // Fade the image slightly where particles have scattered
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      for (const p of particles) {
        const dx = p.x - p.tx;
        const dy = p.y - p.ty;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 2) {
          ctx.globalAlpha = Math.min(0.8, dist / 15);
          ctx.beginPath();
          ctx.arc(p.tx, p.ty, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();

      // Draw displaced particles
      ctx.save();
      for (const p of particles) {
        const dx = p.x - p.tx;
        const dy = p.y - p.ty;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 2) {
          ctx.globalAlpha = Math.min(1, (p.a / 255) * (dist / 10));
          ctx.fillStyle = `rgb(${p.r},${p.g},${p.b})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    }
  }
}

function drawPointillism(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  for (const p of particles) {
    ctx.globalAlpha = Math.min(1, (p.a / 255) * 1.1);
    ctx.fillStyle = `rgb(${p.r},${p.g},${p.b})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * 1.8, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawGlitch(ctx: CanvasRenderingContext2D, particles: Particle[], frame: number, cw: number, ch: number) {
  const scanY = (frame * 3) % (ch + 40) - 20;
  const scanY2 = ((frame * 2 + ch / 2) % (ch + 40)) - 20;

  for (const p of particles) {
    const nearScan = Math.abs(p.y - scanY) < 15 || Math.abs(p.y - scanY2) < 8;
    if (nearScan) {
      // Bold RGB split
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = `rgb(${Math.min(255, p.r + 60)},0,0)`;
      ctx.fillRect(Math.round(p.x) - 4, Math.round(p.y), 2.5, 2.5);
      ctx.fillStyle = `rgb(0,${Math.min(255, p.g + 40)},0)`;
      ctx.fillRect(Math.round(p.x), Math.round(p.y), 2.5, 2.5);
      ctx.fillStyle = `rgb(0,0,${Math.min(255, p.b + 60)})`;
      ctx.fillRect(Math.round(p.x) + 4, Math.round(p.y), 2.5, 2.5);
    } else {
      ctx.globalAlpha = (p.a / 255) * 0.9;
      ctx.fillStyle = `rgb(${p.r},${p.g},${p.b})`;
      ctx.fillRect(Math.round(p.x), Math.round(p.y), 2.2, 2.2);
    }
  }
  ctx.globalAlpha = 1;

  // Scanline bars
  ctx.save();
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, scanY - 1, cw, 2);
  ctx.globalAlpha = 0.06;
  ctx.fillRect(0, scanY2 - 1, cw, 1.5);
  ctx.restore();

  // Glitch blocks
  if (frame % 60 < 3) {
    for (let i = 0; i < 3; i++) {
      ctx.save();
      ctx.globalAlpha = 0.2;
      ctx.fillStyle = ["#6e56cf", "#e5484d", "#3e63dd", "#f5d90a"][Math.floor(Math.random() * 4)];
      ctx.fillRect(Math.random() * cw * 0.8, Math.random() * ch, Math.random() * 80 + 20, Math.random() * 3 + 1);
      ctx.restore();
    }
  }

  // CRT lines overlay
  ctx.save();
  ctx.globalAlpha = 0.03;
  for (let y = 0; y < ch; y += 3) {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, y, cw, 1);
  }
  ctx.restore();
}

function drawThermal(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  for (const p of particles) {
    const b = p.brightness;
    // Map brightness to thermal: dark=blue/purple, mid=red/orange, bright=yellow/white
    let tr: number, tg: number, tb: number;
    if (b < 0.25) {
      tr = 30; tg = 0; tb = 120 + b * 4 * 135;
    } else if (b < 0.5) {
      const t = (b - 0.25) * 4;
      tr = 30 + t * 225; tg = 0; tb = 255 * (1 - t);
    } else if (b < 0.75) {
      const t = (b - 0.5) * 4;
      tr = 255; tg = t * 200; tb = 0;
    } else {
      const t = (b - 0.75) * 4;
      tr = 255; tg = 200 + t * 55; tb = t * 180;
    }
    ctx.globalAlpha = Math.min(1, (p.a / 255) * 1.2);
    ctx.fillStyle = `rgb(${Math.round(tr)},${Math.round(tg)},${Math.round(tb)})`;
    ctx.fillRect(Math.round(p.x) - 1, Math.round(p.y) - 1, 2.5, 2.5);
  }
  ctx.globalAlpha = 1;
}

function drawMosaic(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  const blockSize = 8;
  const grid = new Map<string, { r: number; g: number; b: number; a: number; n: number }>();

  for (const p of particles) {
    const gx = Math.round(p.x / blockSize);
    const gy = Math.round(p.y / blockSize);
    const key = `${gx},${gy}`;
    const cell = grid.get(key);
    if (cell) {
      cell.r += p.r; cell.g += p.g; cell.b += p.b; cell.a += p.a; cell.n++;
    } else {
      grid.set(key, { r: p.r, g: p.g, b: p.b, a: p.a, n: 1 });
    }
  }

  for (const [key, cell] of grid) {
    const [gxs, gys] = key.split(",");
    const gx = parseInt(gxs) * blockSize;
    const gy = parseInt(gys) * blockSize;
    const n = cell.n;
    ctx.globalAlpha = Math.min(1, (cell.a / n / 255) * 1.3);
    ctx.fillStyle = `rgb(${Math.round(cell.r / n)},${Math.round(cell.g / n)},${Math.round(cell.b / n)})`;
    ctx.fillRect(gx - blockSize / 2 + 0.5, gy - blockSize / 2 + 0.5, blockSize - 1, blockSize - 1);
  }
  ctx.globalAlpha = 1;
}

function drawWireframe(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  ctx.save();
  // Bolder connections
  ctx.strokeStyle = "rgba(110, 86, 207, 0.2)";
  ctx.lineWidth = 0.6;

  const step = 4;
  for (let i = 0; i < particles.length; i += step) {
    const p = particles[i];
    for (let j = i + step; j < Math.min(particles.length, i + step * 8); j += step) {
      const q = particles[j];
      const dx = p.x - q.x;
      const dy = p.y - q.y;
      if (dx * dx + dy * dy < 200) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
      }
    }
  }

  // Bold dots at vertices
  for (const p of particles) {
    ctx.globalAlpha = (p.a / 255) * 0.8;
    ctx.fillStyle = p.brightness > 0.5 ? "#ededef" : "#6e56cf";
    ctx.beginPath();
    ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawNeon(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  // Edge-detect: brighter particles near dark ones glow
  for (const p of particles) {
    const isEdge = p.brightness > 0.3 && p.brightness < 0.8;
    ctx.save();
    if (isEdge) {
      ctx.globalAlpha = (p.a / 255) * 0.9;
      ctx.shadowBlur = 8;
      ctx.shadowColor = `rgb(${Math.min(255, p.r + 80)},${Math.min(255, p.g + 40)},${Math.min(255, p.b + 100)})`;
      ctx.fillStyle = `rgb(${Math.min(255, p.r + 60)},${Math.min(255, p.g + 30)},${Math.min(255, p.b + 80)})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.globalAlpha = (p.a / 255) * 0.3;
      ctx.fillStyle = `rgb(${p.r},${p.g},${p.b})`;
      ctx.fillRect(Math.round(p.x), Math.round(p.y), 1.5, 1.5);
    }
    ctx.restore();
  }
}

function drawChromatic(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  // Draw 3 passes with channel separation
  ctx.save();
  // Red channel offset left
  ctx.globalAlpha = 0.6;
  for (const p of particles) {
    ctx.fillStyle = `rgb(${p.r},0,0)`;
    ctx.fillRect(Math.round(p.x) - 3, Math.round(p.y), 2, 2);
  }
  // Green channel center
  ctx.globalAlpha = 0.7;
  for (const p of particles) {
    ctx.fillStyle = `rgb(0,${p.g},0)`;
    ctx.fillRect(Math.round(p.x), Math.round(p.y), 2, 2);
  }
  // Blue channel offset right
  ctx.globalAlpha = 0.6;
  for (const p of particles) {
    ctx.fillStyle = `rgb(0,0,${p.b})`;
    ctx.fillRect(Math.round(p.x) + 3, Math.round(p.y), 2, 2);
  }
  ctx.restore();
}

function drawHalftone(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  // Group into cells, draw circles whose size maps to brightness
  const cellSize = 6;
  const grid = new Map<string, { brightness: number; r: number; g: number; b: number; n: number }>();

  for (const p of particles) {
    const gx = Math.round(p.x / cellSize);
    const gy = Math.round(p.y / cellSize);
    const key = `${gx},${gy}`;
    const cell = grid.get(key);
    if (cell) {
      cell.brightness += p.brightness; cell.r += p.r; cell.g += p.g; cell.b += p.b; cell.n++;
    } else {
      grid.set(key, { brightness: p.brightness, r: p.r, g: p.g, b: p.b, n: 1 });
    }
  }

  for (const [key, cell] of grid) {
    const [gxs, gys] = key.split(",");
    const cx = parseInt(gxs) * cellSize;
    const cy = parseInt(gys) * cellSize;
    const n = cell.n;
    const avgBright = cell.brightness / n;
    const radius = (1 - avgBright) * (cellSize * 0.55) + 0.8;
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = `rgb(${Math.round(cell.r / n)},${Math.round(cell.g / n)},${Math.round(cell.b / n)})`;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawShatter(ctx: CanvasRenderingContext2D, particles: Particle[], frame: number) {
  // Draw triangular shards that shift slightly
  const triSize = 10;
  const grid = new Map<string, Particle[]>();

  for (const p of particles) {
    const gx = Math.floor(p.x / triSize);
    const gy = Math.floor(p.y / triSize);
    const key = `${gx},${gy}`;
    const arr = grid.get(key);
    if (arr) arr.push(p);
    else grid.set(key, [p]);
  }

  for (const [key, group] of grid) {
    if (group.length < 1) continue;
    const [gxs, gys] = key.split(",");
    const gx = parseInt(gxs) * triSize;
    const gy = parseInt(gys) * triSize;

    let ar = 0, ag = 0, ab = 0;
    for (const p of group) { ar += p.r; ag += p.g; ab += p.b; }
    const n = group.length;
    ar /= n; ag /= n; ab /= n;

    // Slight displacement per shard
    const shardPhase = Math.sin(frame * 0.015 + parseInt(gxs) * 0.7 + parseInt(gys) * 1.1);
    const offX = shardPhase * 2;
    const offY = Math.cos(frame * 0.012 + parseInt(gys) * 0.9) * 1.5;

    ctx.save();
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = `rgb(${Math.round(ar)},${Math.round(ag)},${Math.round(ab)})`;
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(gx + offX, gy + offY);
    ctx.lineTo(gx + triSize + offX, gy + offY);
    ctx.lineTo(gx + triSize / 2 + offX, gy + triSize + offY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}

function drawStrokes(ctx: CanvasRenderingContext2D, particles: Particle[], strokeImgs: HTMLImageElement[]) {
  const clusterSize = 6;
  for (let i = 0; i < particles.length; i += clusterSize) {
    const cluster = particles.slice(i, i + clusterSize);
    if (cluster.length < 2) continue;

    let ax = 0, ay = 0, ar = 0, ag = 0, ab = 0;
    for (const p of cluster) { ax += p.x; ay += p.y; ar += p.r; ag += p.g; ab += p.b; }
    const n = cluster.length;
    ax /= n; ay /= n; ar /= n; ag /= n; ab /= n;

    const img = strokeImgs[i % strokeImgs.length];
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.save();
      ctx.translate(ax, ay);
      ctx.rotate(Math.atan2(cluster[n - 1].y - cluster[0].y, cluster[n - 1].x - cluster[0].x));
      ctx.globalAlpha = 0.6;
      const sw = 28 + n * 2;
      const sh = 6;
      ctx.drawImage(img, -sw / 2, -sh / 2, sw, sh);
      ctx.globalCompositeOperation = "multiply";
      ctx.fillStyle = `rgb(${Math.round(ar)},${Math.round(ag)},${Math.round(ab)})`;
      ctx.fillRect(-sw / 2, -sh / 2, sw, sh);
      ctx.globalCompositeOperation = "source-over";
      ctx.restore();
    }

    for (const p of cluster) {
      ctx.globalAlpha = (p.a / 255) * 0.5;
      ctx.fillStyle = `rgb(${p.r},${p.g},${p.b})`;
      ctx.fillRect(Math.round(p.x), Math.round(p.y), 2, 2);
    }
  }
  ctx.globalAlpha = 1;
}

function drawSpiral(ctx: CanvasRenderingContext2D, particles: Particle[], frame: number) {
  for (const p of particles) {
    const trail = Math.sin(frame * 0.02 + p.angle * 3) * 0.4 + 0.6;
    ctx.globalAlpha = (p.a / 255) * 0.9 * trail;
    ctx.fillStyle = `rgb(${p.r},${p.g},${p.b})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * 1.5, 0, Math.PI * 2);
    ctx.fill();
    // Subtle trail
    const trailAngle = p.angle + frame * p.speed * 2 + Math.PI;
    const tx = p.x + Math.cos(trailAngle) * 3;
    const ty = p.y + Math.sin(trailAngle) * 3;
    ctx.globalAlpha = (p.a / 255) * 0.3;
    ctx.beginPath();
    ctx.arc(tx, ty, p.size * 0.8, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawConstellation(ctx: CanvasRenderingContext2D, particles: Particle[], frame: number) {
  ctx.save();
  // Bold connections
  ctx.strokeStyle = "rgba(237, 237, 239, 0.1)";
  ctx.lineWidth = 0.5;
  const step = 3;
  for (let i = 0; i < particles.length; i += step) {
    const p = particles[i];
    for (let j = i + step; j < Math.min(particles.length, i + step * 6); j += step) {
      const q = particles[j];
      const dx = p.x - q.x;
      const dy = p.y - q.y;
      if (dx * dx + dy * dy < 200) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
      }
    }
  }

  // Star points with twinkle
  for (const p of particles) {
    const twinkle = Math.sin(frame * 0.04 + p.angle * 5) * 0.3 + 0.7;
    ctx.globalAlpha = (p.a / 255) * 0.85 * twinkle;
    ctx.fillStyle = p.brightness > 0.5 ? "#ededef" : `rgb(${p.r},${p.g},${p.b})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * twinkle, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawPop(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  // Bold, high-contrast Warhol-style color mapping
  for (const p of particles) {
    const b = p.brightness;
    let pr: number, pg: number, pb: number;
    // Quantize to bold pop art palette
    if (b < 0.2) {
      pr = 20; pg = 10; pb = 40;
    } else if (b < 0.35) {
      pr = 180; pg = 30; pb = 90; // Hot pink
    } else if (b < 0.5) {
      pr = 230; pg = 60; pb = 20; // Orange
    } else if (b < 0.65) {
      pr = 250; pg = 220; pb = 0; // Yellow
    } else if (b < 0.8) {
      pr = 60; pg = 200; pb = 220; // Cyan
    } else {
      pr = 255; pg = 255; pb = 240; // Near white
    }
    ctx.globalAlpha = Math.min(1, (p.a / 255) * 1.2);
    ctx.fillStyle = `rgb(${pr},${pg},${pb})`;
    ctx.fillRect(Math.round(p.x) - 1, Math.round(p.y) - 1, 2.8, 2.8);
  }
  ctx.globalAlpha = 1;
}

function drawLiquify(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  for (const p of particles) {
    ctx.globalAlpha = (p.a / 255) * 0.9;
    ctx.fillStyle = `rgb(${p.r},${p.g},${p.b})`;
    ctx.beginPath();
    // Slightly elongated ellipses to suggest fluid motion
    ctx.ellipse(p.x, p.y, p.size * 1.8, p.size * 1.2, Math.atan2(p.vy, p.vx), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawElectric(ctx: CanvasRenderingContext2D, particles: Particle[], frame: number, cw: number, ch: number) {
  // Base particles
  for (const p of particles) {
    ctx.save();
    ctx.globalAlpha = (p.a / 255) * 0.85;
    ctx.fillStyle = `rgb(${p.r},${p.g},${p.b})`;
    ctx.fillRect(Math.round(p.x) - 1, Math.round(p.y) - 1, 2.2, 2.2);
    ctx.restore();
  }

  // Electric arcs between random bright particles
  ctx.save();
  ctx.lineWidth = 1.5;
  const arcCount = 4 + Math.floor(Math.sin(frame * 0.05) * 2);
  for (let a = 0; a < arcCount; a++) {
    const idx = Math.floor((Math.sin(frame * 0.1 + a * 1.7) * 0.5 + 0.5) * particles.length);
    const p = particles[idx % particles.length];
    const jdx = (idx + 20 + Math.floor(Math.random() * 40)) % particles.length;
    const q = particles[jdx];
    if (!p || !q) continue;

    ctx.globalAlpha = 0.6;
    ctx.strokeStyle = frame % 6 < 3 ? "#a78bfa" : "#60a5fa";
    ctx.shadowBlur = 6;
    ctx.shadowColor = ctx.strokeStyle;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    // Jagged lightning path
    const steps = 4;
    for (let s = 1; s <= steps; s++) {
      const t = s / (steps + 1);
      const mx = p.x + (q.x - p.x) * t + (Math.random() - 0.5) * 12;
      const my = p.y + (q.y - p.y) * t + (Math.random() - 0.5) * 12;
      ctx.lineTo(mx, my);
    }
    ctx.lineTo(q.x, q.y);
    ctx.stroke();
  }
  ctx.restore();
}
