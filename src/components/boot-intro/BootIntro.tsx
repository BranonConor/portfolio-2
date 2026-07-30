"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Box, Heading, Text } from "@chakra-ui/react";
import { BootLogoCanvas } from "./BootLogoCanvas";
import { useBootChime } from "./useBootChime";
import { pixelFont } from "./pixelFont";

const NAME = "BRANON EUSEBIO";

// Each letter rockets in oversized and bounces down to size, staggered
// across the word (wave effect); once every letter has landed, the rainbow
// shine sweeps across the settled logo. Slower/bigger than a first pass to
// read more like the reference GBA boot sequence.
const STAGGER_MS = 100;
const LETTER_DURATION_MS = 850;
const SWEEP_GAP_MS = 220;
const SWEEP_DURATION_MS = 900;

type Phase = "ready" | "booting" | "prompt" | "dismissed";

/**
 * Full-screen GBA-style boot intro. Plays on every visit to the home page:
 * logo drops in, a rainbow sweep flourishes across it, then a blinking
 * "PRESS ANY KEY TO START" prompt waits for any key/click/tap to dismiss and
 * reveal the page underneath.
 *
 * Browsers block audio until a real user gesture, so the animated/audible
 * boot sequence itself is gated behind the very first key/click/tap — that
 * same gesture unlocks the Web Audio context and kicks off the timeline in
 * the same tick, keeping every sound in sync with what's on screen. Users
 * with `prefers-reduced-motion` skip straight to the (silent, static) prompt.
 */
export function BootIntro() {
  const [phase, setPhase] = useState<Phase>("ready");
  const [flash, setFlash] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const { unlock, playLetterTwinkle, playSparkle } = useBootChime();

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    if (mql.matches) {
      setPhase("prompt");
    }
  }, []);

  // Wait for the first user gesture to unlock audio and start the boot
  // timeline together, in the same handler — starting them separately (e.g.
  // playing sounds tied to an animation that's already running) means any
  // audio scheduled before the gesture silently never plays, since the
  // AudioContext stays suspended until a gesture resumes it.
  useEffect(() => {
    if (reducedMotion || phase !== "ready") return;

    const begin = () => {
      unlock();
      setPhase("booting");
    };

    window.addEventListener("pointerdown", begin, { capture: true });
    window.addEventListener("keydown", begin, { capture: true });
    window.addEventListener("touchstart", begin, { capture: true });

    return () => {
      window.removeEventListener("pointerdown", begin, { capture: true });
      window.removeEventListener("keydown", begin, { capture: true });
      window.removeEventListener("touchstart", begin, { capture: true });
    };
  }, [unlock, reducedMotion, phase]);

  const dismiss = useCallback(() => {
    setPhase((current) => (current === "dismissed" ? current : "dismissed"));
  }, []);

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
          bg="#000"
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
          <Box
            as="button"
            type="button"
            onClick={dismiss}
            position="absolute"
            top={[3, 4]}
            right={[3, 4]}
            zIndex={2}
            px={3}
            py={2}
            fontSize="13px"
            fontWeight={600}
            color="whiteAlpha.700"
            bg="whiteAlpha.100"
            borderRadius="8px"
            border="1px solid"
            borderColor="whiteAlpha.300"
            _hover={{ color: "white", bg: "whiteAlpha.200" }}
            _focusVisible={{
              outline: "2px solid",
              outlineColor: "brand.accent",
              outlineOffset: "2px",
            }}
          >
            Skip intro
          </Box>

          {reducedMotion ? (
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
          ) : phase !== "ready" ? (
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
            </Box>
          ) : null}

          {phase === "ready" && (
            <Box
              as={motion.div}
              position="absolute"
              bottom={["14%", "16%", "18%"]}
              left={0}
              right={0}
              textAlign="center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.4, delay: 0.4 } }}
            >
              <Text
                as={motion.span}
                className={pixelFont.className}
                display="inline-block"
                fontSize={["9px", "11px"]}
                fontWeight={400}
                letterSpacing="0.12em"
                color="whiteAlpha.700"
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
                PRESS START
              </Text>
            </Box>
          )}

          {!reducedMotion && (
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
