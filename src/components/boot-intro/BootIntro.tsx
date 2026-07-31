"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Box, Heading, Text } from "@chakra-ui/react";
import { BootLogoCanvas } from "./BootLogoCanvas";
import { PowerOnScene } from "./PowerOnScene";
import { CursorSparkles } from "./CursorSparkles";
import { useBootChime } from "./useBootChime";
import { pixelFont } from "./pixelFont";

const NAME = "BRANON EUSEBIO";
const ROLE = "DESIGN ENGINEER";
const ROLE_CHARS = Array.from(ROLE);

// The console screen's own background color (sampled from
// console-shell.svg) — used once the boot logo takes over so the cut from
// "zoomed into the screen" to "letters flying in on this background" is
// seamless instead of jumping to a plain black void.
const SCREEN_BG = "#1D2A0C";

// A warm, textured "paper" backdrop for the dormant power-on phase — a
// tileable fractal-noise grain layered under a soft radial vignette, so the
// console reads as sitting on a warm surface rather than floating in a flat
// black void.
const PAPER_NOISE_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='matrix' values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.07 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`;
const PAPER_NOISE_DATA_URI = `data:image/svg+xml,${encodeURIComponent(PAPER_NOISE_SVG)}`;
const PAPER_BG_SX = {
  backgroundColor: "#EEE6D3",
  backgroundImage: `radial-gradient(ellipse 120% 90% at 50% 28%, rgba(255,251,241,0.95), rgba(233,222,198,0.55) 55%, rgba(196,180,148,0.42) 100%), url("${PAPER_NOISE_DATA_URI}")`,
  backgroundBlendMode: "normal, overlay",
  backgroundSize: "cover, 180px 180px",
};

// A hand-authored 8-bit/pixel-art arrow cursor (chunky white-fill,
// black-outline pixels) used throughout the intro overlay in place of the
// system pointer, to keep the retro-console feel consistent even for mouse
// input. The hotspot (2, 2) lines up with the arrow's tip.
const PIXEL_CURSOR = "url('/boot-intro/cursor.svg') 1 1, auto";


// Each letter spirals in oversized (right -> up -> left -> down -> center)
// and settles to size, then immediately does a couple of in-place bounces —
// cascading independently per letter (only offset by a short stagger) so the
// whole sequence stays snappy. Once every letter has cascaded through, the
// rainbow shine sweeps across the settled logo.
const STAGGER_MS = 55;
const LETTER_DURATION_MS = 480;
const SWEEP_GAP_MS = 120;
const SWEEP_DURATION_MS = 650;

// The subtitle "waves" in one character at a time, choreographed to
// complete right alongside the rainbow sweep happening on the wordmark
// above it (SWEEP_DURATION_MS) rather than fading in all at once.
const roleContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: SWEEP_DURATION_MS / 1000 / ROLE_CHARS.length,
    },
  },
};
const roleCharVariants = {
  hidden: { opacity: 0, y: -7 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, ease: "easeOut" },
  },
};

type Phase = "power" | "booting" | "prompt" | "dismissed";

/**
 * Full-screen GBA-style boot intro. Plays on every visit to the home page.
 * It opens on a dormant, low-poly console in a WebGL void — flipping its
 * power switch (click/tap/Enter/Space) is the real user gesture that
 * unlocks audio, guaranteeing every sound plays in sync with what follows:
 * the console spins to face forward and the view zooms into its screen,
 * handing off to the boot logo (fly-in letters + rainbow sweep), then a
 * blinking "PRESS ANY KEY TO START" prompt waits for any key/click/tap to
 * dismiss and reveal the page underneath. Users with
 * `prefers-reduced-motion` skip straight to the (silent, static) prompt.
 */
export function BootIntro() {
  const [phase, setPhase] = useState<Phase>("power");
  const [flash, setFlash] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const { unlock, playLetterTwinkle, playSparkle } = useBootChime();

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    if (mql.matches) {
      setPhase("prompt");
    }
  }, []);

  const dismiss = useCallback(() => {
    setPhase((current) => (current === "dismissed" ? current : "dismissed"));
  }, []);

  // Escape is a universal, always-available way to bail out of the intro
  // from any phase — the visible "or skip the antics" link only appears on
  // the dormant power screen, but keyboard users shouldn't be stuck once
  // the boot sequence is underway.
  useEffect(() => {
    if (phase === "dismissed") return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase, dismiss]);

  // Only listen for dismissal input once the prompt is showing.
  useEffect(() => {
    if (phase !== "prompt") return;

    const handleDismiss = () => dismiss();
    window.addEventListener("keydown", handleDismiss);
    window.addEventListener("pointerdown", handleDismiss);
    window.addEventListener("touchstart", handleDismiss);

    return () => {
      window.removeEventListener("keydown", handleDismiss);
      window.removeEventListener("pointerdown", handleDismiss);
      window.removeEventListener("touchstart", handleDismiss);
    };
  }, [phase, dismiss]);

  // Flipping the power switch is a real, synchronous user gesture — the
  // one guaranteed moment we can resume the AudioContext so every sound
  // from here on plays exactly on cue.
  const handlePowerOn = useCallback(() => {
    unlock();
  }, [unlock]);

  const handlePowerOnComplete = useCallback(() => {
    setPhase((current) => (current === "power" ? "booting" : current));
  }, []);

  const handleLetterStart = useCallback(
    (index: number, total: number) => {
      playLetterTwinkle(index, total);
    },
    [playLetterTwinkle]
  );

  const handleLettersSettled = useCallback(() => {
    setFlash(true);
    window.setTimeout(() => setFlash(false), 160);
  }, []);

  const handleSweepStart = useCallback(() => {
    playSparkle();
    setShowSubtitle(true);
  }, [playSparkle]);

  const handleSweepComplete = useCallback(() => {
    setPhase((current) => (current === "booting" ? "prompt" : current));
  }, []);


  return (
    <AnimatePresence>
      {phase !== "dismissed" && (
        <Box
          as={motion.div}
          key="boot-intro"
          position="fixed"
          inset={0}
          zIndex={9999}
          bg={phase === "power" ? undefined : SCREEN_BG}
          sx={{ cursor: PIXEL_CURSOR, ...(phase === "power" ? PAPER_BG_SX : {}) }}
          display="flex"
          alignItems="center"
          justifyContent="center"
          overflow="hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
          role="dialog"
          aria-modal="true"
          aria-label="Site intro animation"
        >
          <CursorSparkles />

          {reducedMotion ? (
            <Box textAlign="center">
              <Heading
                as="h1"
                className={pixelFont.className}
                fontSize={["18px", "26px", "32px"]}
                letterSpacing="0.08em"
                lineHeight={1.6}
                color="white"
                textAlign="center"
              >
                {NAME}
              </Heading>
              <Text
                className={pixelFont.className}
                mt={2}
                fontSize={["9px", "11px"]}
                letterSpacing="0.15em"
                color="whiteAlpha.700"
              >
                {ROLE}
              </Text>
            </Box>
          ) : phase === "power" ? (
            <PowerOnScene
              onPowerOn={handlePowerOn}
              onPowerOnComplete={handlePowerOnComplete}
            />
          ) : (
            <Box position="relative" width="100%" height="100%">
              <BootLogoCanvas
                label={NAME}
                staggerMs={STAGGER_MS}
                letterDurationMs={LETTER_DURATION_MS}
                sweepGapMs={SWEEP_GAP_MS}
                sweepDurationMs={SWEEP_DURATION_MS}
                onLetterStart={handleLetterStart}
                onLettersSettled={handleLettersSettled}
                onSweepStart={handleSweepStart}
                onSweepComplete={handleSweepComplete}
              />
              {showSubtitle && (
                <Box
                  as={motion.div}
                  position="absolute"
                  top="58%"
                  left={0}
                  right={0}
                  textAlign="center"
                  pointerEvents="none"
                  initial="hidden"
                  animate="visible"
                  variants={roleContainerVariants}
                >
                  <Text
                    className={pixelFont.className}
                    display="inline-block"
                    fontSize={["9px", "11px", "12px"]}
                    letterSpacing="0.2em"
                    color="whiteAlpha.700"
                  >
                    {ROLE_CHARS.map((char, i) => (
                      <motion.span
                        key={i}
                        variants={roleCharVariants}
                        style={{ display: "inline-block" }}
                      >
                        {char === " " ? "\u00A0" : char}
                      </motion.span>
                    ))}
                  </Text>
                </Box>
              )}
            </Box>
          )}

          {!reducedMotion && phase !== "power" && (
            <Box
              position="absolute"
              inset={0}
              bg="white"
              pointerEvents="none"
              opacity={flash ? 0.5 : 0}
              transition="opacity 0.15s ease-out"
            />
          )}

          {phase === "prompt" && (
          <Box
            as={motion.div}
            position="absolute"
            bottom={["14%", "16%", "18%"]}
            left={0}
            right={0}
            textAlign="center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.3 } }}
          >
            <Text
              as={motion.span}
              className={pixelFont.className}
              display="inline-block"
              fontSize={["9px", "11px"]}
              fontWeight={400}
              letterSpacing="0.12em"
              color="whiteAlpha.900"
              animate={{
                opacity: [1, 1, 0, 0, 1],
                transition: {
                  duration: 1.4,
                  times: [0, 0.45, 0.5, 0.95, 1],
                  repeat: Infinity,
                  ease: "linear",
                },
              }}
            >
              PRESS ANY KEY TO START
            </Text>
          </Box>
          )}
        </Box>
      )}
    </AnimatePresence>
  );
}
