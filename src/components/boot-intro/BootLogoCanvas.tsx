"use client";

import { useEffect, useRef } from "react";
import { Box } from "@chakra-ui/react";
import { Renderer, Program, Mesh, Triangle, Texture } from "ogl";

const VERTEX = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D tMask;
  uniform float uTime;
  uniform float uCenterY;
  uniform vec2 uBoxSize;
  uniform float uSweep;
  uniform float uOpacity;

  void main() {
    vec2 texUv = (vUv - vec2(0.5, uCenterY)) / uBoxSize + 0.5;
    if (texUv.x < 0.0 || texUv.x > 1.0 || texUv.y < 0.0 || texUv.y > 1.0) {
      discard;
    }

    float mask = texture2D(tMask, texUv).a;
    if (mask < 0.02) {
      discard;
    }

    // Diagonal rainbow sweep band that travels once across the logo.
    float diag = texUv.x + texUv.y;
    float bandCenter = mix(-0.5, 2.5, uSweep);
    float band = smoothstep(0.55, 0.0, abs(diag - bandCenter));

    vec3 rainbow = 0.5 + 0.5 * cos(
      6.28318 * (diag * 1.4 + uTime * 0.12) + vec3(0.0, 2.094, 4.188)
    );

    vec3 base = vec3(0.96, 0.96, 0.98);
    vec3 color = mix(base, rainbow, band * 0.92);

    gl_FragColor = vec4(color, mask * uOpacity);
  }
`;

/** Ease-out-back style overshoot so the logo "drops and settles" like the GBA boot. */
function easeOutBack(t: number) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

interface BootLogoCanvasProps {
  label: string;
  dropDurationMs: number;
  sweepStartMs: number;
  sweepDurationMs: number;
  onImpact?: () => void;
}

/**
 * WebGL (via `ogl`) rendering of the boot logo: draws the given label to an
 * offscreen 2D canvas to build an alpha mask texture, then renders it as a
 * textured full-screen triangle with a fragment shader that (a) positions the
 * logo per-frame for the drop-in/overshoot animation and (b) sweeps an
 * animated rainbow band across it once it settles.
 */
export function BootLogoCanvas({
  label,
  dropDurationMs,
  sweepStartMs,
  sweepDurationMs,
  onImpact,
}: BootLogoCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onImpactRef = useRef(onImpact);
  onImpactRef.current = onImpact;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let destroyed = false;
    let rafId = 0;
    let impactFired = false;

    const renderer = new Renderer({ alpha: true, dpr: Math.min(window.devicePixelRatio || 1, 2) });
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

    // Build the text mask texture on an offscreen 2D canvas.
    const textCanvas = document.createElement("canvas");
    const textW = 1024;
    const textH = 256;
    textCanvas.width = textW;
    textCanvas.height = textH;
    const tctx = textCanvas.getContext("2d");

    const texture = new Texture(gl, { generateMipmaps: false });

    const drawText = () => {
      if (!tctx) return;
      tctx.clearRect(0, 0, textW, textH);
      tctx.fillStyle = "#ffffff";
      tctx.textAlign = "center";
      tctx.textBaseline = "middle";

      const fontFamily =
        '"Space Grotesk", "Arial Black", system-ui, sans-serif';
      const maxWidth = textW * 0.9;

      // Measure at a reference size, then scale the font down so the full
      // label always fits the mask canvas (avoids clipped letters).
      const referenceSize = 150;
      tctx.font = `900 ${referenceSize}px ${fontFamily}`;
      const measuredWidth = tctx.measureText(label).width || maxWidth;
      const fontSize = Math.min(
        referenceSize,
        Math.floor((referenceSize * maxWidth) / measuredWidth)
      );

      tctx.font = `900 ${fontSize}px ${fontFamily}`;
      tctx.fillText(label, textW / 2, textH / 2 + 8);
      texture.image = textCanvas;
      texture.needsUpdate = true;
    };

    // Draw immediately (fallback font), then redraw once the real webfont is
    // ready so the mask upgrades in place.
    drawText();
    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(() => {
        if (!destroyed) drawText();
      });
    }

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: VERTEX,
      fragment: FRAGMENT,
      transparent: true,
      depthTest: false,
      uniforms: {
        tMask: { value: texture },
        uTime: { value: 0 },
        uCenterY: { value: 1.4 },
        uBoxSize: { value: [0.72, 0.72 * (textH / textW)] },
        uSweep: { value: 0 },
        uOpacity: { value: 1 },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });

    const updateBoxSize = () => {
      const { clientWidth, clientHeight } = container;
      const w = clientWidth || 1;
      const h = clientHeight || 1;
      const desiredWidthPx = Math.min(w * 0.78, 760);
      const desiredHeightPx = desiredWidthPx * (textH / textW);
      program.uniforms.uBoxSize.value = [desiredWidthPx / w, desiredHeightPx / h];
    };
    updateBoxSize();

    const ro = new ResizeObserver(() => {
      resize();
      updateBoxSize();
    });
    ro.observe(container);

    const startTime = performance.now();

    const restY = 0.5;
    const startY = 1.35;
    const overshootHold = 120; // ms of bounce settle beyond drop duration

    const tick = () => {
      if (destroyed) return;
      const elapsed = performance.now() - startTime;

      // Drop-in with overshoot.
      const dropT = Math.min(elapsed / dropDurationMs, 1);
      const eased = easeOutBack(dropT);
      const centerY = startY + (restY - startY) * eased;
      program.uniforms.uCenterY.value = centerY;

      if (!impactFired && dropT >= 1) {
        impactFired = true;
        onImpactRef.current?.();
      }

      // Rainbow sweep.
      const sweepT = Math.min(
        Math.max((elapsed - sweepStartMs) / sweepDurationMs, 0),
        1
      );
      program.uniforms.uSweep.value = sweepT;
      program.uniforms.uTime.value = elapsed / 1000;

      renderer.render({ scene: mesh });
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      destroyed = true;
      cancelAnimationFrame(rafId);
      ro.disconnect();
      if (gl.canvas.parentElement === container) {
        container.removeChild(gl.canvas);
      }
      const ext = gl.getExtension("WEBGL_lose_context");
      ext?.loseContext();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [label, dropDurationMs, sweepStartMs, sweepDurationMs]);

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
