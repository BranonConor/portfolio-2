"use client";

import { useEffect, useState } from "react";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { GameWorldClient } from "@/game/GameWorldClient";

const STORAGE_KEY = "portfolio-view"; // "game" | "classic"

type View = "game" | "classic";

/**
 * Decides whether an interactive visitor sees the walkable game world or the
 * classic site. The classic markup (`classic` prop) is always rendered in the
 * DOM so content stays crawlable and accessible; the game is a client-only
 * overlay shown on top for capable, opted-in visitors.
 *
 * Accessibility rules:
 *  - Honors prefers-reduced-motion → defaults to classic.
 *  - Persists the visitor's explicit choice in localStorage.
 *  - A persistent, obvious toggle switches between the two at any time.
 */
export function HomeExperience({ classic }: { classic: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<View>("classic");

  useEffect(() => {
    setMounted(true);
    const stored = window.localStorage.getItem(STORAGE_KEY) as View | null;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (stored === "classic" || stored === "game") {
      setView(stored);
    } else if (reducedMotion) {
      setView("classic"); // never trap reduced-motion users in the game
    } else {
      setView("game");
    }
  }, []);

  const choose = (next: View) => {
    setView(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore storage failures */
    }
  };

  const showGame = mounted && view === "game";

  return (
    <>
      {/* Classic content: always in the DOM (SSR'd) for SEO + a11y. Visually
          hidden — but kept focusable/crawlable — while the game overlay shows. */}
      <Box
        aria-hidden={showGame ? true : undefined}
        display={showGame ? "none" : "block"}
      >
        {classic}
      </Box>

      {/* Enter-the-world affordance for classic viewers (only once mounted, so
          no-JS users just get the classic site). */}
      {mounted && view === "classic" && (
        <Button
          onClick={() => choose("game")}
          position="fixed"
          bottom={6}
          right={6}
          size="sm"
          bg="brand.text"
          color="brand.bg"
          _hover={{ opacity: 0.9 }}
          zIndex={30}
          boxShadow="0 4px 20px rgba(0,0,0,0.4)"
        >
          🌱 Enter the world
        </Button>
      )}

      {showGame && (
        <GameWorldClient onExitToClassic={() => choose("classic")} />
      )}
    </>
  );
}
