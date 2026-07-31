"use client";

import { useEffect, useRef } from "react";
import { Box } from "@chakra-ui/react";

// Minimum time between spawned pixels while the pointer is moving — keeps
// the trail readable as distinct chunky squares rather than a smear.
const SPAWN_INTERVAL_MS = 45;
const PARTICLE_LIFETIME_MS = 550;
const PIXEL_SIZE = 4; // px — chunky, matching the 8-bit cursor's block size

function randomPixelColor() {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 85%, 62%)`;
}

/**
 * A trail of small square "pixels" that spawn as the pointer moves and
 * quickly drift/fade away — an 8-bit flourish to accompany the pixel-art
 * cursor. Scoped to the boot intro overlay only (mounted/unmounted with
 * it). Particles are plain DOM nodes animated with CSS, not React state,
 * since the pointer can spawn many of these a second.
 */
export function CursorSparkles() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;

    let lastSpawn = 0;

    const handlePointerMove = (event: PointerEvent) => {
      const now = performance.now();
      if (now - lastSpawn < SPAWN_INTERVAL_MS) return;
      lastSpawn = now;

      const particle = document.createElement("div");
      const dx = (Math.random() - 0.5) * 26;
      const dy = -10 - Math.random() * 18;
      particle.style.position = "fixed";
      particle.style.left = `${event.clientX}px`;
      particle.style.top = `${event.clientY}px`;
      particle.style.width = `${PIXEL_SIZE}px`;
      particle.style.height = `${PIXEL_SIZE}px`;
      particle.style.background = randomPixelColor();
      particle.style.pointerEvents = "none";
      particle.style.setProperty("--dx", `${dx}px`);
      particle.style.setProperty("--dy", `${dy}px`);
      particle.style.animation = `boot-cursor-sparkle ${PARTICLE_LIFETIME_MS}ms steps(6, end) forwards`;

      const remove = () => particle.remove();
      particle.addEventListener("animationend", remove);
      // Safety net in case animationend never fires (e.g. tab backgrounded mid-flight).
      window.setTimeout(remove, PARTICLE_LIFETIME_MS + 200);

      layer.appendChild(particle);
    };

    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      layer.replaceChildren();
    };
  }, []);

  return (
    <>
      <Box ref={layerRef} position="fixed" inset={0} pointerEvents="none" zIndex={3} aria-hidden="true" />
      <style>{`
        @keyframes boot-cursor-sparkle {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.9;
          }
          100% {
            transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0.2);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}
