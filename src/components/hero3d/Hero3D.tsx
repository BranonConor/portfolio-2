"use client";

/**
 * <Hero3D> (P8 Tier B) — an OPTIONAL true-3D version of the hero graphic built with
 * react-three-fiber. Floating textured planes of Branon's paint strokes sit at
 * different z-depths, lit by soft directional + tinted point lights, and the whole
 * rig eases toward the pointer — a genuine-3D echo of the press.stripe books.
 *
 * ISOLATION: this is dependency-heavy (three / @react-three/fiber / @react-three/drei)
 * and is OFF by default. It is only mounted when `NEXT_PUBLIC_HERO_3D === "1"` and is
 * always loaded via a dynamic, client-only import (see Hero3DLazy). Tier A
 * (HeroParallax, zero-dep) remains the shipped default, so this is trivial to revert.
 *
 * Fully static under `prefers-reduced-motion` (no per-frame rotation/float).
 */

import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";

type Vec3 = [number, number, number];

interface Layer {
  src: string;
  pos: Vec3;
  rot: number;
  scale: number;
  depth: number;
}

const LAYERS: Layer[] = [
  { src: "/s1.png", pos: [-0.6, 0.2, -1], rot: 0.3, scale: 2.6, depth: 0.6 },
  { src: "/s4.png", pos: [0.7, -0.1, -0.4], rot: -0.4, scale: 2.2, depth: 1.0 },
  { src: "/s2.png", pos: [0.1, 0.4, 0.2], rot: 0.8, scale: 1.6, depth: 1.4 },
];

const StrokePlane: React.FC<Layer & { reduce: boolean }> = ({
  src,
  pos,
  rot,
  scale,
  depth,
  reduce,
}) => {
  const tex = useTexture(src);
  const ref = useRef<THREE.Mesh>(null);
  const seed = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state) => {
    if (reduce || !ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.z = pos[2] + Math.sin(t * 0.6 + seed) * 0.06 * depth;
    ref.current.position.y = pos[1] + Math.sin(t * 0.4 + seed) * 0.05 * depth;
  });

  return (
    <mesh ref={ref} position={pos} rotation={[0, 0, rot]} scale={scale}>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial
        map={tex}
        transparent
        alphaTest={0.05}
        roughness={0.9}
        metalness={0}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

const Rig: React.FC<{ reduce: boolean; children: React.ReactNode }> = ({
  reduce,
  children,
}) => {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (reduce || !group.current) return;
    const { x, y } = state.pointer;
    group.current.rotation.y +=
      (x * 0.4 - group.current.rotation.y) * 0.05;
    group.current.rotation.x +=
      (-y * 0.3 - group.current.rotation.x) * 0.05;
  });
  return <group ref={group}>{children}</group>;
};

export default function Hero3D() {
  const reduce = useReducedMotion() ?? false;

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 4, 5]} intensity={1.1} />
      <pointLight position={[-3, -2, 2]} intensity={0.6} color="#a78bfa" />
      <Suspense fallback={null}>
        <Rig reduce={reduce}>
          {LAYERS.map((l, i) => (
            <StrokePlane key={i} {...l} reduce={reduce} />
          ))}
        </Rig>
      </Suspense>
    </Canvas>
  );
}
