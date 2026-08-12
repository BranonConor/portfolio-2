"use client";

import { Geometry, Mesh, Program, Renderer } from "ogl";
import { HOLO_FRAGMENT, HOLO_VERTEX } from "./holoShader";

const MIN_WIDTH = 50;
const MIN_HEIGHT = 70;

// One context is kept alive while its canvas moves between active card surfaces.
class SharedHoloRenderer {
  private readonly canvas: HTMLCanvasElement;
  private readonly renderer: Renderer;
  private readonly program: Program;
  private readonly mesh: Mesh;
  private readonly pointer: [number, number] = [0, 0];
  private readonly resizeObserver: ResizeObserver;
  private activeTarget: HTMLElement | null = null;
  private animationFrame: number | null = null;
  private startTime = 0;

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
      opacity: "0.62",
    });

    this.renderer = new Renderer({
      canvas: this.canvas,
      alpha: true,
      premultipliedAlpha: false,
      antialias: true,
      width: 1,
      height: 1,
      dpr: Math.min(window.devicePixelRatio, 2),
    });

    const gl = this.renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.disable(gl.BLEND);

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
        uHover: { value: 1 },
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
  }

  attach(target: HTMLElement) {
    if (this.activeTarget !== target) {
      if (this.activeTarget) {
        this.resizeObserver.unobserve(this.activeTarget);
      }
      this.activeTarget = target;
      this.resizeObserver.observe(target);
      this.startTime = performance.now();
    }

    if (this.canvas.parentElement !== target) {
      target.appendChild(this.canvas);
    }

    const rect = target.getBoundingClientRect();
    this.resize(rect.width, rect.height);
    this.setPointer(0, 0);
    this.start();
  }

  detach(target: HTMLElement) {
    if (this.activeTarget !== target) return;

    this.resizeObserver.unobserve(target);
    this.activeTarget = null;
    this.stop();
    this.canvas.remove();
  }

  setPointer(x: number, y: number) {
    this.pointer[0] = x;
    this.pointer[1] = y;
  }

  private resize(width: number, height: number) {
    this.renderer.setSize(
      Math.max(Math.round(width), MIN_WIDTH),
      Math.max(Math.round(height), MIN_HEIGHT),
    );
  }

  private start() {
    if (this.animationFrame !== null) return;
    this.animationFrame = requestAnimationFrame(this.render);
  }

  private stop() {
    if (this.animationFrame === null) return;
    cancelAnimationFrame(this.animationFrame);
    this.animationFrame = null;
  }

  private render = (now: number) => {
    const target = this.activeTarget;
    if (!target) {
      this.animationFrame = null;
      return;
    }
    if (!target.isConnected) {
      this.detach(target);
      return;
    }

    this.program.uniforms.uTime.value = (now - this.startTime) / 1000;
    this.renderer.render({ scene: this.mesh });
    this.animationFrame = requestAnimationFrame(this.render);
  };
}

let sharedRenderer: SharedHoloRenderer | null = null;

export const getSharedHoloRenderer = () => {
  if (!sharedRenderer) {
    sharedRenderer = new SharedHoloRenderer();
  }
  return sharedRenderer;
};
