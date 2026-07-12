"use client";

import { useEffect, useRef, useCallback, useState } from "react";

const STYLES = [
  { name: "original", key: "original" },
  { name: "pointillism", key: "pointillism" },
  { name: "strokes", key: "strokes" },
  { name: "glitch", key: "glitch" },
  { name: "wireframe", key: "wireframe" },
  { name: "cloud", key: "cloud" },
  { name: "mosaic", key: "mosaic" },
  { name: "constellation", key: "constellation" },
] as const;

type StyleKey = (typeof STYLES)[number]["key"];

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
  const transitionRef = useRef(1);
  const strokeImgsRef = useRef<HTMLImageElement[]>([]);

  // Keep size ref in sync
  useEffect(() => {
    sizeRef.current = { width, height };
  }, [width, height]);

  // Preload paint stroke images
  useEffect(() => {
    const srcs = ["/s1.png", "/s2.png", "/s3.png", "/s4.png", "/s5.png", "/s6.png"];
    const imgs: HTMLImageElement[] = [];
    for (const s of srcs) {
      const img = new window.Image();
      img.src = s;
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
      const sampleSize = 160;
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
      const scale = Math.min(cw, ch) / sampleSize * 0.85;
      const ox = (cw - sampleSize * scale) / 2;
      const oy = (ch - sampleSize * scale) / 2;

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
            tx, ty,
            x: tx + (Math.random() - 0.5) * 4,
            y: ty + (Math.random() - 0.5) * 4,
            vx: 0, vy: 0,
            r, g, b, a,
            size: Math.random() * 0.8 + 1.0,
            angle: Math.random() * Math.PI * 2,
            speed: Math.random() * 0.015 + 0.003,
            brightness,
          });
        }
      }

      particlesRef.current = particles;
      setReady(true);
    };
  }, [src]);

  // Cycle style on click
  const handleClick = useCallback(() => {
    const next = (styleIndex + 1) % STYLES.length;
    setStyleIndex(next);
    currentStyleRef.current = STYLES[next].key;
    transitionRef.current = 0;
  }, [styleIndex]);

  // Mouse tracking
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      inside: true,
    };
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { ...mouseRef.current, inside: false };
  }, []);

  // Render loop
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
      frameRef.current++;
      transitionRef.current = Math.min(1, transitionRef.current + 0.025);

      // --- UPDATE PARTICLES ---
      for (const p of particles) {
        let targetX = p.tx;
        let targetY = p.ty;

        if (style === "cloud") {
          const ca = p.angle + frameRef.current * p.speed;
          const cr = 60 + Math.sin(p.angle * 3) * 30;
          targetX = cw / 2 + Math.cos(ca) * cr;
          targetY = ch / 2 + Math.sin(ca) * cr * 0.7;
        } else if (style === "glitch") {
          const glitchOff = Math.sin(frameRef.current * 0.08 + p.ty * 0.03) * 15;
          const vShift = (frameRef.current % 80 < 3) ? (Math.random() - 0.5) * 20 : 0;
          targetX = p.tx + glitchOff;
          targetY = p.ty + vShift;
        } else if (style === "wireframe") {
          const grid = 6;
          targetX = Math.round(p.tx / grid) * grid;
          targetY = Math.round(p.ty / grid) * grid;
        } else if (style === "mosaic") {
          const block = 10;
          targetX = Math.round(p.tx / block) * block + block / 2;
          targetY = Math.round(p.ty / block) * block + block / 2;
        } else if (style === "constellation") {
          targetX = p.tx;
          targetY = p.ty;
        }

        // Spring toward target
        const dx = targetX - p.x;
        const dy = targetY - p.y;
        const ease = style === "original" || style === "reconstruct" ? 0.1 : 0.05;
        p.vx += dx * ease;
        p.vy += dy * ease;
        p.vx *= 0.85;
        p.vy *= 0.85;

        // Mouse repulsion (hover to scatter)
        if (mouse.inside && mouse.x > 0) {
          const mdx = p.x - mouse.x;
          const mdy = p.y - mouse.y;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
          const repelRadius = 50;
          if (mDist < repelRadius) {
            const force = ((repelRadius - mDist) / repelRadius) * 5;
            p.vx += (mdx / (mDist || 1)) * force;
            p.vy += (mdy / (mDist || 1)) * force;
          }
        }

        p.x += p.vx;
        p.y += p.vy;
      }

      // --- DRAW ---
      ctx.clearRect(0, 0, cw, ch);

      switch (style) {
        case "original":
          drawOriginal(ctx, particles);
          break;
        case "pointillism":
          drawPointillism(ctx, particles);
          break;
        case "strokes":
          drawStrokes(ctx, particles, strokeImgsRef.current);
          break;
        case "glitch":
          drawGlitch(ctx, particles, frameRef.current, cw, ch);
          break;
        case "wireframe":
          drawWireframe(ctx, particles);
          break;
        case "cloud":
          drawCloud(ctx, particles, frameRef.current);
          break;
        case "mosaic":
          drawMosaic(ctx, particles);
          break;
        case "constellation":
          drawConstellation(ctx, particles, frameRef.current);
          break;
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
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%) rotate(-6deg)",
        width: "100%",
        height: "100%",
        objectFit: "contain",
        zIndex: 1,
        cursor: "pointer",
        pointerEvents: "auto",
      }}
    />
  );
}

// ======== DRAWING STYLES ========

function drawOriginal(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  for (const p of particles) {
    ctx.globalAlpha = (p.a / 255) * 0.95;
    ctx.fillStyle = `rgb(${p.r},${p.g},${p.b})`;
    ctx.fillRect(Math.round(p.x) - 1, Math.round(p.y) - 1, 2.2, 2.2);
  }
  ctx.globalAlpha = 1;
}

function drawPointillism(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  for (const p of particles) {
    ctx.globalAlpha = (p.a / 255) * 0.8;
    ctx.fillStyle = `rgb(${p.r},${p.g},${p.b})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * 1.4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawStrokes(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  strokeImgs: HTMLImageElement[],
) {
  const clusterSize = 8;
  for (let i = 0; i < particles.length; i += clusterSize) {
    const cluster = particles.slice(i, i + clusterSize);
    if (cluster.length < 2) continue;

    let ax = 0, ay = 0, ar = 0, ag = 0, ab = 0, aa = 0;
    for (const p of cluster) {
      ax += p.x; ay += p.y;
      ar += p.r; ag += p.g; ab += p.b; aa += p.a;
    }
    const n = cluster.length;
    ax /= n; ay /= n; ar /= n; ag /= n; ab /= n; aa /= n;

    const img = strokeImgs[i % strokeImgs.length];
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.save();
      ctx.translate(ax, ay);
      const angle = Math.atan2(
        cluster[cluster.length - 1].y - cluster[0].y,
        cluster[cluster.length - 1].x - cluster[0].x
      );
      ctx.rotate(angle);
      ctx.globalAlpha = (aa / 255) * 0.45;
      const sw = 24 + n * 1.5;
      const sh = 5;
      ctx.drawImage(img, -sw / 2, -sh / 2, sw, sh);
      ctx.globalCompositeOperation = "multiply";
      ctx.fillStyle = `rgb(${Math.round(ar)},${Math.round(ag)},${Math.round(ab)})`;
      ctx.fillRect(-sw / 2, -sh / 2, sw, sh);
      ctx.globalCompositeOperation = "source-over";
      ctx.restore();
    }

    // Detail dots
    for (const p of cluster) {
      ctx.globalAlpha = (p.a / 255) * 0.3;
      ctx.fillStyle = `rgb(${p.r},${p.g},${p.b})`;
      ctx.fillRect(Math.round(p.x), Math.round(p.y), 1.5, 1.5);
    }
  }
  ctx.globalAlpha = 1;
}

function drawGlitch(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  frame: number,
  cw: number,
  ch: number,
) {
  const scanY = (frame * 2.5) % (ch + 30) - 15;

  for (const p of particles) {
    const nearScan = Math.abs(p.y - scanY) < 12;
    ctx.save();
    if (nearScan) {
      ctx.globalAlpha = 0.55;
      ctx.fillStyle = `rgb(${p.r},0,0)`;
      ctx.fillRect(Math.round(p.x) - 2, Math.round(p.y), 1.5, 1.5);
      ctx.fillStyle = `rgb(0,${p.g},0)`;
      ctx.fillRect(Math.round(p.x), Math.round(p.y), 1.5, 1.5);
      ctx.fillStyle = `rgb(0,0,${p.b})`;
      ctx.fillRect(Math.round(p.x) + 2, Math.round(p.y), 1.5, 1.5);
    } else {
      ctx.globalAlpha = (p.a / 255) * 0.75;
      ctx.fillStyle = `rgb(${p.r},${p.g},${p.b})`;
      ctx.fillRect(Math.round(p.x), Math.round(p.y), 1.8, 1.8);
    }
    ctx.restore();
  }

  // Subtle scanline bar
  ctx.save();
  ctx.globalAlpha = 0.06;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, scanY - 0.5, cw, 1.5);
  ctx.restore();

  // Rare glitch bar
  if (frame % 90 < 2) {
    ctx.save();
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = ["#6e56cf", "#e5484d", "#3e63dd"][Math.floor(Math.random() * 3)];
    ctx.fillRect(Math.random() * cw, Math.random() * ch, Math.random() * 60 + 10, 1.5);
    ctx.restore();
  }
}

function drawWireframe(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  ctx.save();
  ctx.strokeStyle = "rgba(110, 86, 207, 0.12)";
  ctx.lineWidth = 0.4;

  // Connections (sampled for perf)
  const step = 5;
  for (let i = 0; i < particles.length; i += step) {
    const p = particles[i];
    for (let j = i + step; j < particles.length; j += step) {
      const q = particles[j];
      const dx = p.x - q.x;
      const dy = p.y - q.y;
      if (dx * dx + dy * dy < 250) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
      }
    }
  }

  for (const p of particles) {
    ctx.globalAlpha = (p.a / 255) * 0.55;
    ctx.fillStyle = p.brightness > 0.5 ? "#ededef" : "#6e56cf";
    ctx.fillRect(Math.round(p.x), Math.round(p.y), 1, 1);
  }
  ctx.restore();
}

function drawCloud(ctx: CanvasRenderingContext2D, particles: Particle[], frame: number) {
  for (const p of particles) {
    const pulse = Math.sin(frame * 0.02 + p.angle) * 0.3 + 0.7;
    ctx.save();
    ctx.globalAlpha = (p.a / 255) * 0.5 * pulse;
    ctx.shadowBlur = 4;
    ctx.shadowColor = `rgb(${p.r},${p.g},${p.b})`;
    ctx.fillStyle = `rgb(${p.r},${p.g},${p.b})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * pulse * 1.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawMosaic(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  // Build a grid of average colors
  const blockSize = 10;
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
    ctx.globalAlpha = Math.min(1, (cell.a / n / 255) * 1.1);
    ctx.fillStyle = `rgb(${Math.round(cell.r / n)},${Math.round(cell.g / n)},${Math.round(cell.b / n)})`;
    ctx.fillRect(gx - blockSize / 2 + 0.5, gy - blockSize / 2 + 0.5, blockSize - 1, blockSize - 1);
  }
  ctx.globalAlpha = 1;
}

function drawConstellation(ctx: CanvasRenderingContext2D, particles: Particle[], frame: number) {
  ctx.save();

  // Draw connections first (dimmer)
  ctx.strokeStyle = "rgba(237, 237, 239, 0.06)";
  ctx.lineWidth = 0.3;
  const step = 4;
  for (let i = 0; i < particles.length; i += step) {
    const p = particles[i];
    for (let j = i + step; j < particles.length; j += step) {
      const q = particles[j];
      const dx = p.x - q.x;
      const dy = p.y - q.y;
      if (dx * dx + dy * dy < 300) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
      }
    }
  }

  // Draw star points
  for (const p of particles) {
    const twinkle = Math.sin(frame * 0.03 + p.angle * 5) * 0.3 + 0.7;
    ctx.globalAlpha = (p.a / 255) * 0.7 * twinkle;
    ctx.fillStyle = p.brightness > 0.6 ? "#ededef" : `rgb(${p.r},${p.g},${p.b})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * 0.7 * twinkle, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}
