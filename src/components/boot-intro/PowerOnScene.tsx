"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { Box as ChakraBox } from "@chakra-ui/react";

export interface PowerOnSceneHandle {
  /** Kicks off the zoom-into-screen transition (call once a cartridge is selected). */
  powerOn: () => void;
  /** Instantly snaps the shell to its fully-zoomed-in resting frame (no
   * animation) — used to pick up mid-"zoom" when arriving back from a
   * route, right before playing `powerOff()` to ease back out. */
  snapZoomedIn: () => void;
  /** Reverses the zoom — eases the shell from fully-zoomed-in back down to
   * its dormant idle size/tilt. */
  powerOff: () => void;
}

interface PowerOnSceneProps {
  /** Fired the instant `powerOn()` is triggered (real user gesture already happened upstream) — use this to unlock audio. */
  onPowerOn: () => void;
  /** Fired once the power-on zoom transition has fully played out. */
  onPowerOnComplete: () => void;
  /** Fired once the reverse `powerOff()` transition has fully played out. */
  onPowerOffComplete?: () => void;
}

// The screen's bounding box within the shell illustration, measured as a
// fraction of the full image (via pixel analysis of console-shell.svg):
// x 7.5%-92.8%, y 4.5%-52%. The power-on zoom uses this as its transform
// origin so it visually "dives into the screen" rather than the shell's
// geometric center (which sits lower, near the body/buttons).
const SCREEN_ORIGIN_X = "50%";
const SCREEN_ORIGIN_Y = "28%";
// Resting tilt, in degrees — deliberately subtle. The shell is a flat
// illustration, so large rotateX/rotateY values just shear it into a
// slanted parallelogram instead of reading as "sitting on a table" in 3D.
// A small amount is enough to sell gentle parallax without warping the
// silhouette.
const BASE_ROT_X = 3;
const BASE_ROT_Y = -4;
const TRANSITION_MS = 580;

/**
 * A dormant console shell, tilted in CSS 3D space and gently reactive to
 * mouse movement for parallax. The shell art itself is a pre-built,
 * personalized vector illustration (`/public/boot-intro/console-shell.svg`)
 * rather than something hand-modeled in code — after several rounds of
 * hand-tuned WebGL/SVG geometry falling short of photo fidelity, a
 * purpose-made illustration is the reliable way to get an accurate result.
 *
 * Purely decorative/ambient now — like a real GBA, the console just sits
 * there idling. The actual "load a cartridge, then power on" gesture lives
 * in the cartridge selector next to it (see BootIntro); selecting a
 * cartridge calls `powerOn()` via ref, which is the real user gesture used
 * to unlock audio, then eases the shell flat and zooms into its screen,
 * handing off to the boot logo sequence beneath.
 */
export const PowerOnScene = forwardRef<PowerOnSceneHandle, PowerOnSceneProps>(
  function PowerOnScene({ onPowerOn, onPowerOnComplete, onPowerOffComplete }, ref) {
    const stageRef = useRef<HTMLDivElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const activateRef = useRef<() => void>(() => {});
    const snapZoomedInRef = useRef<() => void>(() => {});
    const deactivateRef = useRef<() => void>(() => {});
    const callbacksRef = useRef({ onPowerOn, onPowerOnComplete, onPowerOffComplete });
    callbacksRef.current = { onPowerOn, onPowerOnComplete, onPowerOffComplete };

    useImperativeHandle(ref, () => ({
      powerOn: () => activateRef.current(),
      snapZoomedIn: () => snapZoomedInRef.current(),
      powerOff: () => deactivateRef.current(),
    }));

    useEffect(() => {
      let destroyed = false;
      let rafId = 0;
      const smoothedMouse = { x: 0, y: 0 };
      let poweringOn = false;
      let powerStart = 0;
      // Mirrors `poweringOn`, but for easing back OUT to the idle frame —
      // used when arriving back from a route via the reverse "power off"
      // (ESC) flow, so the console visibly zooms back out to where it
      // would otherwise idle rather than just popping into view.
      let poweringOut = false;
      let powerOutStart = 0;
      // True from `snapZoomedIn()` until `powerOff()` starts easing back
      // out — holds the shell at its fully-zoomed resting frame instead of
      // the normal idle tilt/scale.
      let zoomedIn = false;

      activateRef.current = () => {
        if (poweringOn || destroyed) return;
        poweringOn = true;
        powerStart = performance.now();
        callbacksRef.current.onPowerOn();
      };

      snapZoomedInRef.current = () => {
        if (destroyed) return;
        zoomedIn = true;
      };

      deactivateRef.current = () => {
        if (poweringOut || destroyed) return;
        zoomedIn = false;
        poweringOut = true;
        powerOutStart = performance.now();
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
          scale = 1 + eased * 4.9;
          translateY = idleBob * (1 - eased);

          if (t >= 1) {
            poweringOn = false;
            callbacksRef.current.onPowerOnComplete();
            return;
          }
        } else if (poweringOut) {
          const t = Math.min((now - powerOutStart) / TRANSITION_MS, 1);
          const eased = t * t * (3 - 2 * t);
          rotX = BASE_ROT_X * eased;
          rotY = BASE_ROT_Y * eased;
          scale = 1 + (1 - eased) * 4.9;
          translateY = idleBob * eased;

          if (t >= 1) {
            poweringOut = false;
            callbacksRef.current.onPowerOffComplete?.();
          }
        } else if (zoomedIn) {
          rotX = 0;
          rotY = 0;
          scale = 1 + 4.9;
          translateY = 0;
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
      <ChakraBox
        position="relative"
        width="100%"
        height="100%"
        overflow="visible"
        aria-hidden="true"
      >
        <ChakraBox
          position="absolute"
          inset={0}
          display="flex"
          alignItems="center"
          justifyContent="center"
          style={{ perspective: "1200px" }}
          onPointerMove={handlePointerMove}
        >
          {/*
            A static (non-rotated) blurred shadow sits behind the 3D-tilted
            stage. A CSS drop-shadow filter applied directly to a
            perspective/rotateX/Y-transformed element renders incorrectly in
            most browsers, so the shadow is a separate plain element instead.
          */}
          <ChakraBox
            position="absolute"
            width={["30vw", "20vw", "15vw"]}
            height={["6vw", "4.6vw", "3.4vw"]}
            bg="black"
            opacity={0.45}
            borderRadius="full"
            style={{ filter: "blur(24px)" }}
          />
          <ChakraBox
            ref={stageRef}
            position="relative"
            style={{
              // Sized well under the viewport (rather than filling its
              // container edge-to-edge) so the idle rotateX/rotateY tilt —
              // and the power-on scale-up — always has headroom and never
              // clips against the screen bounds.
              height: "min(64vh, 560px)",
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
              // This is the very first thing visitors see, so it shouldn't
              // compete with anything else for bandwidth/priority — fetch it
              // eagerly at the highest priority to close the gap between
              // "list renders" and "console art renders" as much as possible.
              fetchPriority="high"
              style={{ width: "auto", height: "100%", display: "block" }}
            />
          </ChakraBox>
        </ChakraBox>
      </ChakraBox>
    );
  }
);
