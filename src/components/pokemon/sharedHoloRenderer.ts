"use client";

import { Geometry, Mesh, Program, Renderer } from "ogl";
import { HOLO_FRAGMENT, HOLO_VERTEX } from "./holoShader";

const MIN_WIDTH = 50;
const MIN_HEIGHT = 35;
const MAX_DPR = 1.5;
const FADE_IN_SPEED = 5.5;
const FADE_OUT_SPEED = 12;

const getRendererDpr = () => {
  const lowPowerDevice =
    typeof navigator.hardwareConcurrency === "number" &&
    navigator.hardwareConcurrency <= 4;
  return Math.min(window.devicePixelRatio, lowPowerDevice ? 1 : MAX_DPR);
};

type AttachOptions = {
  reducedMotion: boolean;
  seed: number;
};

// One context is kept alive while its canvas moves between active card surfaces.
class SharedHoloRenderer {
  private readonly canvas: HTMLCanvasElement;
  private readonly renderer: Renderer;
  private readonly program: Program;
  private readonly mesh: Mesh;
  private readonly pointer: [number, number] = [0, 0];
  private readonly resizeObserver: ResizeObserver;
  private readonly intersectionObserver: IntersectionObserver;
  private activeTarget: HTMLElement | null = null;
  private animationFrame: number | null = null;
  private startTime = 0;
  private lastFrameTime = 0;
  private intensity = 0;
  private targetIntensity = 0;
  private reducedMotion = false;
  private isIntersecting = true;
  private contextLost = false;

  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.dataset.holoOverlay = "shared";
    this.canvas.setAttribute("aria-hidden", "true");
    Object.assign(this.canvas.style, {
      position: "absolute",
      top: "0",
      left: "0",
      display: "block",
      pointerEvents: "none",
      zIndex: "1",
      mixBlendMode: "screen",
      opacity: "0.82",
    });

    this.renderer = new Renderer({
      canvas: this.canvas,
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
      width: 1,
      height: 1,
      dpr: getRendererDpr(),
    });

    const gl = this.renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.disable(gl.DEPTH_TEST);

    const geometry = new Geometry(gl, {
      position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) },
      uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) },
    });

    this.program = new Program(gl, {
      vertex: HOLO_VERTEX,
      fragment: HOLO_FRAGMENT,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: this.pointer },
        uIntensity: { value: 0 },
        uMotion: { value: 1 },
        uAspect: { value: 1 },
        uSeed: { value: 0 },
      },
      transparent: false,
    });
    this.mesh = new Mesh(gl, { geometry, program: this.program });

    this.resizeObserver = new ResizeObserver((entries) => {
      const entry = entries.find(({ target }) => target === this.activeTarget);
      if (entry) {
        this.resize(entry.contentRect.width, entry.contentRect.height);
      }
    });
    this.intersectionObserver = new IntersectionObserver((entries) => {
      const entry = entries.find(({ target }) => target === this.activeTarget);
      if (!entry) return;
      this.isIntersecting = entry.isIntersecting;
      if (this.isIntersecting) {
        this.start();
      } else {
        this.stop();
      }
    });

    this.canvas.addEventListener("webglcontextlost", this.handleContextLost);
  }

  attach(target: HTMLElement, options: AttachOptions) {
    if (this.contextLost) return false;

    if (this.activeTarget !== target) {
      if (this.activeTarget) {
        this.resizeObserver.unobserve(this.activeTarget);
        this.intersectionObserver.unobserve(this.activeTarget);
      }
      this.activeTarget = target;
      this.resizeObserver.observe(target);
      this.intersectionObserver.observe(target);
      this.startTime = performance.now();
      this.lastFrameTime = this.startTime;
      this.intensity = 0;
      this.isIntersecting = true;
    }

    this.reducedMotion = options.reducedMotion;
    this.targetIntensity = options.reducedMotion ? 0.52 : 1;
    this.program.uniforms.uMotion.value = options.reducedMotion ? 0 : 1;
    this.program.uniforms.uSeed.value = options.seed;
    this.pointer[0] = 0;
    this.pointer[1] = 0;

    if (this.canvas.parentElement !== target) {
      target.appendChild(this.canvas);
    }

    const rect = target.getBoundingClientRect();
    this.resize(rect.width, rect.height);
    if (this.reducedMotion) {
      this.intensity = this.targetIntensity;
      this.renderFrame(performance.now());
    } else {
      this.start();
    }
    return true;
  }

  deactivate(target: HTMLElement) {
    if (this.activeTarget !== target) return;
    if (this.reducedMotion || !this.isIntersecting) {
      this.detach(target);
      return;
    }
    this.targetIntensity = 0;
    this.start();
  }

  detach(target: HTMLElement) {
    if (this.activeTarget !== target) return;

    this.resizeObserver.unobserve(target);
    this.intersectionObserver.unobserve(target);
    this.activeTarget = null;
    this.targetIntensity = 0;
    this.intensity = 0;
    this.stop();
    this.canvas.remove();
  }

  setPointer(x: number, y: number) {
    if (this.reducedMotion) return;
    this.pointer[0] = x;
    this.pointer[1] = y;
  }

  private resize(width: number, height: number) {
    this.renderer.setSize(
      Math.max(Math.round(width), MIN_WIDTH),
      Math.max(Math.round(height), MIN_HEIGHT),
    );
    this.program.uniforms.uAspect.value = width / Math.max(height, 1);
  }

  private start() {
    if (
      this.animationFrame !== null ||
      !this.activeTarget ||
      !this.isIntersecting ||
      this.contextLost ||
      this.reducedMotion
    ) {
      return;
    }
    this.lastFrameTime = performance.now();
    this.animationFrame = requestAnimationFrame(this.render);
  }

  private stop() {
    if (this.animationFrame === null) return;
    cancelAnimationFrame(this.animationFrame);
    this.animationFrame = null;
  }

  private renderFrame(now: number) {
    this.program.uniforms.uTime.value = (now - this.startTime) / 1000;
    this.program.uniforms.uIntensity.value = this.intensity;
    this.renderer.render({ scene: this.mesh });
  }

  private render = (now: number) => {
    this.animationFrame = null;
    const target = this.activeTarget;
    if (!target) {
      return;
    }
    if (!target.isConnected) {
      this.detach(target);
      return;
    }

    const deltaSeconds = Math.min((now - this.lastFrameTime) / 1000, 0.05);
    this.lastFrameTime = now;
    const speed = this.targetIntensity > this.intensity
      ? FADE_IN_SPEED
      : FADE_OUT_SPEED;
    const blend = 1 - Math.exp(-speed * deltaSeconds);
    this.intensity += (this.targetIntensity - this.intensity) * blend;
    this.renderFrame(now);

    if (this.targetIntensity === 0 && this.intensity < 0.01) {
      this.detach(target);
      return;
    }
    this.animationFrame = requestAnimationFrame(this.render);
  };

  private handleContextLost = (event: Event) => {
    event.preventDefault();
    this.contextLost = true;
    if (this.activeTarget) {
      this.detach(this.activeTarget);
    }
  };
}

let sharedRenderer: SharedHoloRenderer | null = null;
let rendererUnavailable = false;

export const getSharedHoloRenderer = () => {
  if (!sharedRenderer && !rendererUnavailable) {
    try {
      sharedRenderer = new SharedHoloRenderer();
    } catch (error) {
      rendererUnavailable = true;
      console.info(
        "Cosmo holo WebGL is unavailable; using the static artwork fallback.",
        error,
      );
    }
  }
  return sharedRenderer;
};
