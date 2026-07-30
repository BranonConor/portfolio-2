"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Box, Heading, Text } from "@chakra-ui/react";
import { BootLogoCanvas } from "./BootLogoCanvas";
import { useBootChime } from "./useBootChime";

const NAME = "BRANON EUSEBIO";

// Each letter pops in oversized and bounces down to size, staggered across
// the word (wave effect), then the rainbow shine sweeps across the settled
// logo once every letter has landed.
const STAGGER_MS = 70;
const LETTER_DURATION_MS = 550;
const SWEEP_GAP_MS = 180;
const SWEEP_DURATION_MS = 700;

type Phase = "booting" | "prompt" | "dismissed";

/**
 * Full-screen GBA-style boot intro. Plays on every visit to the home page:
 * logo drops in, a rainbow sweep flourishes across it, then a blinking
 * "PRESS ANY KEY TO START" prompt waits for any key/click/tap to dismiss and
 * reveal the page underneath.
 */
export function BootIntro() {
  const [phase, setPhase] = useState<Phase>("booting");
  const [flash, setFlash] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const { playChime } = useBootChime();
  const chimeArmedRef = useRef(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    if (mql.matches) {
      setPhase("prompt");
    }
  }, []);

  // Unlock + fire the chime on the very first user gesture, whenever it
  // happens (during the boot animation or later, once the prompt is up).
  // Audio can only start from a real gesture per browser autoplay policy.
  useEffect(() => {
    if (reducedMotion) return;

    const unlock = () => {
      if (chimeArmedRef.current) return;
      chimeArmedRef.current = true;
      playChime();
    };

    window.addEventListener("pointerdown", unlock, { capture: true });
    window.addEventListener("keydown", unlock, { capture: true });
    window.addEventListener("touchstart", unlock, { capture: true });

    return () => {
      window.removeEventListener("pointerdown", unlock, { capture: true });
      window.removeEventListener("keydown", unlock, { capture: true });
      window.removeEventListener("touchstart", unlock, { capture: true });
    };
  }, [playChime, reducedMotion]);

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

  const handleLettersSettled = useCallback(() => {
    setFlash(true);
    window.setTimeout(() => setFlash(false), 160);
  }, []);

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
              fontSize={["28px", "40px", "48px"]}
              letterSpacing="0.08em"
              color="white"
              textAlign="center"
            >
              {NAME}
            </Heading>
          ) : (
            <Box position="relative" width="100%" height="100%">
              <BootLogoCanvas
                label={NAME}
                staggerMs={STAGGER_MS}
                letterDurationMs={LETTER_DURATION_MS}
                sweepGapMs={SWEEP_GAP_MS}
                sweepDurationMs={SWEEP_DURATION_MS}
                onLettersSettled={handleLettersSettled}
                onSweepComplete={handleSweepComplete}
              />
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
              display="inline-block"
              fontSize={["13px", "15px"]}
              fontWeight={600}
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
