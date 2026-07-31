"use client";

import { useEffect, useRef } from "react";
import { Box as ChakraBox, Text } from "@chakra-ui/react";
import { pixelFont } from "./pixelFont";

interface PowerOnSceneProps {
  /** Fired the instant the power switch is activated (real user gesture) — use this to unlock audio. */
  onPowerOn: () => void;
  /** Fired once the power-on zoom transition has fully played out. */
  onPowerOnComplete: () => void;
}

// The screen's bounding box within the shell illustration, measured as a
// fraction of the full image (via pixel analysis of console-shell.svg):
// x 7.5%-92.8%, y 4.5%-52%. The power-on zoom uses this as its transform
// origin so it visually "dives into the screen" rather than the shell's
// geometric center (which sits lower, near the body/buttons).
const SCREEN_ORIGIN_X = "50%";
const SCREEN_ORIGIN_Y = "28%";
// The START pill's center within the shell illustration, as a fraction of
// the full image — used to anchor the pulsing "press here" highlight ring.
const START_BUTTON_X = "57.2%";
const START_BUTTON_Y = "81.4%";
// Same hand-authored 8-bit arrow cursor used across the whole boot intro —
// kept in sync with the copy in BootIntro.tsx.
const PIXEL_CURSOR = "url('/boot-intro/cursor.svg') 1 1, auto";
// Resting tilt, in degrees — deliberately subtle. The shell is a flat
// illustration, so large rotateX/rotateY values just shear it into a
// slanted parallelogram instead of reading as "sitting on a table" in 3D.
// A small amount is enough to sell gentle parallax without warping the
// silhouette.
const BASE_ROT_X = 3;
const BASE_ROT_Y = -4;
const TRANSITION_MS = 650;

/**
 * A dormant console shell, tilted in CSS 3D space and gently reactive to
 * mouse movement for parallax. The shell art itself is a pre-built,
 * personalized vector illustration (`/public/boot-intro/console-shell.svg`)
 * rather than something hand-modeled in code — after several rounds of
 * hand-tuned WebGL/SVG geometry falling short of photo fidelity, a
 * purpose-made illustration is the reliable way to get an accurate result.
 * Activating the power control (click, tap, or Enter/Space on the
 * accessible button layered on top) is the real user gesture that unlocks
 * audio; the shell then eases flat and zooms in, handing off to the boot
 * logo sequence beneath.
 */
export function PowerOnScene({ onPowerOn, onPowerOnComplete }: PowerOnSceneProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const activateRef = useRef<() => void>(() => {});
  const callbacksRef = useRef({ onPowerOn, onPowerOnComplete });
  callbacksRef.current = { onPowerOn, onPowerOnComplete };

  useEffect(() => {
    let destroyed = false;
    let rafId = 0;
    const smoothedMouse = { x: 0, y: 0 };
    let poweringOn = false;
    let powerStart = 0;

    activateRef.current = () => {
      if (poweringOn || destroyed) return;
      poweringOn = true;
      powerStart = performance.now();
      callbacksRef.current.onPowerOn();
    };

    const tick = () => {
      if (destroyed) return;
      const now = performance.now();

      smoothedMouse.x += (mouseRef.current.x - smoothedMouse.x) * 0.06;
      smoothedMouse.y += (mouseRef.current.y - smoothedMouse.y) * 0.06;
      const idleWobble = Math.sin(now * 0.0007) * 0.6;
      const idleBob = Math.sin(now * 0.0011) * 6;

      let rotX = BASE_ROT_X - smoothedMouse.y * 3.5;
      let rotY = BASE_ROT_Y + smoothedMouse.x * 4.5 + idleWobble;
      let scale = 1;
      let translateY = idleBob;

      if (poweringOn) {
        const t = Math.min((now - powerStart) / TRANSITION_MS, 1);
        const eased = t * t * (3 - 2 * t);
        rotX = BASE_ROT_X * (1 - eased);
        rotY = BASE_ROT_Y * (1 - eased);
        scale = 1 + eased * 4.6;
        translateY = idleBob * (1 - eased);

        if (t >= 1) {
          poweringOn = false;
          callbacksRef.current.onPowerOnComplete();
          return;
        }
      }

      if (stageRef.current) {
        stageRef.current.style.transform = `perspective(1200px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(${translateY}px) scale(${scale})`;
      }

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      destroyed = true;
      cancelAnimationFrame(rafId);
    };
  }, []);

  const handlePointerMove = (event: React.PointerEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
  };

  return (
    <ChakraBox position="relative" width="100%" height="100%" overflow="hidden">
      <ChakraBox
        position="absolute"
        inset={0}
        display="flex"
        alignItems="center"
        justifyContent="center"
        style={{ perspective: "1200px" }}
      >
        {/*
          A static (non-rotated) blurred shadow sits behind the 3D-tilted
          stage. A CSS drop-shadow filter applied directly to a
          perspective/rotateX/Y-transformed element renders incorrectly in
          most browsers, so the shadow is a separate plain element instead.
        */}
        <ChakraBox
          position="absolute"
          width={["46vw", "30vw", "22vw"]}
          height={["10vw", "7vw", "5vw"]}
          bg="black"
          opacity={0.45}
          borderRadius="full"
          style={{ filter: "blur(24px)" }}
        />
        <ChakraBox
          ref={stageRef}
          position="relative"
          width={["min(62vw, 340px)", "min(38vw, 400px)", "min(26vw, 440px)"]}
          style={{
            transformStyle: "preserve-3d",
            willChange: "transform",
            transformOrigin: `${SCREEN_ORIGIN_X} ${SCREEN_ORIGIN_Y}`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- static SVG illustration, no optimization needed */}
          <img
            src="/boot-intro/console-shell.svg"
            alt=""
            width={959}
            height={1418}
            style={{ width: "100%", height: "auto", display: "block" }}
          />
          {/*
            A pulsing ring around the shell's own START pill — the real
            affordance is "press start", so the highlight lives right on
            the button being described rather than a separate invented
            switch graphic.
          */}
          <ChakraBox
            position="absolute"
            left={START_BUTTON_X}
            top={START_BUTTON_Y}
            width="11%"
            height="3.6%"
            borderRadius="full"
            pointerEvents="none"
            style={{
              transform: "translate(calc(-50% - 1px), -50%)",
              animation: "boot-start-pulse 1.3s ease-in-out infinite",
            }}
          />
        </ChakraBox>
      </ChakraBox>

      <style>{`
        @keyframes boot-start-pulse {
          0%, 100% {
            box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.35), 0 0 8px 2px rgba(255, 255, 255, 0.12);
          }
          50% {
            box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.95), 0 0 20px 6px rgba(255, 255, 255, 0.5);
          }
        }
      `}</style>

      {/*
        The shell itself is purely presentational — this full-cover button
        is the real interactive control, so activation works identically
        (and accessibly) via mouse click, touch tap, or keyboard
        (Enter/Space), regardless of pointer precision.
      */}
      <ChakraBox
        as="button"
        type="button"
        onClick={() => activateRef.current()}
        onPointerMove={handlePointerMove}
        position="absolute"
        inset={0}
        width="100%"
        height="100%"
        bg="transparent"
        border="none"
        cursor={PIXEL_CURSOR}
        aria-label="Press start to power on the console"
        _focusVisible={{
          outline: "2px solid",
          outlineColor: "brand.accent",
          outlineOffset: "-4px",
        }}
      />

      <ChakraBox
        position="absolute"
        left="50%"
        bottom={["1.5%", "2.5%", "3.5%"]}
        transform="translateX(-50%)"
        pointerEvents="none"
        textAlign="center"
      >
        <Text
          className={pixelFont.className}
          display="inline-block"
          fontSize={["10px", "12px"]}
          letterSpacing="0.15em"
          color="#4B5A2E"
          whiteSpace="nowrap"
        >
          PRESS START TO POWER ON
        </Text>
      </ChakraBox>
    </ChakraBox>
  );
}
