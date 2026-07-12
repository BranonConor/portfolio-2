"use client";

import { useState, useRef, useCallback, useEffect, createContext, useContext } from "react";
import { Box, Text, Flex } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { DoodleJumpGame } from "./DoodleJumpGame";

type EasterEggState = "idle" | "holding" | "dropped" | "game";

interface EasterEggProviderProps {
  children: React.ReactNode;
  portraitSrc: string;
}

export function EasterEggProvider({
  children,
  portraitSrc,
}: EasterEggProviderProps) {
  const [state, setState] = useState<EasterEggState>("idle");
  const [isMobile, setIsMobile] = useState(true);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const portraitGhostRef = useRef<HTMLDivElement>(null);

  // Detect desktop
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handlePortraitMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isMobile || state !== "idle") return;
      e.preventDefault();

      holdTimerRef.current = setTimeout(() => {
        setState("holding");
        setIsDragging(true);
        setDragPosition({ x: e.clientX, y: e.clientY });
      }, 400); // 400ms hold to activate
    },
    [isMobile, state]
  );

  const handlePortraitMouseUp = useCallback(() => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  }, []);

  // Global mouse events for dragging
  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e: MouseEvent) => {
      setDragPosition({ x: e.clientX, y: e.clientY });
    };

    const handleUp = (e: MouseEvent) => {
      // Check if dropped in zone
      if (dropZoneRef.current) {
        const rect = dropZoneRef.current.getBoundingClientRect();
        if (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        ) {
          setState("dropped");
          setIsDragging(false);
          // Briefly show "dropped" state then launch game
          setTimeout(() => setState("game"), 600);
          return;
        }
      }
      // Dropped outside — cancel
      setState("idle");
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [isDragging]);

  const handleClose = useCallback(() => {
    setState("idle");
    setIsDragging(false);
  }, []);

  const isActive = state === "holding" || state === "dropped" || state === "game";

  return (
    <>
      {/* Wrap children, injecting the mousedown handler onto the portrait */}
      <EasterEggContext.Provider
        value={{
          onPortraitMouseDown: handlePortraitMouseDown,
          onPortraitMouseUp: handlePortraitMouseUp,
          isActive,
          isMobile,
          isGameRunning: state === "game" || state === "holding" || state === "dropped",
        }}
      >
        <Box position="relative">
          {/* Main page content with animation */}
          <Box>
            {/* Hero always visible */}
            {children}
          </Box>

          {/* Drop zone + game overlay (replaces sections below hero) */}
          <AnimatePresence>
            {isActive && !isMobile && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                style={{ marginTop: "16px" }}
              >
                {state === "game" ? (
                  <Box
                    border="1px solid"
                    borderColor="rgba(88, 166, 255, 0.15)"
                    borderRadius="12px"
                    overflow="hidden"
                    width="100%"
                    height="600px"
                    bg="#030810"
                  >
                    <DoodleJumpGame
                      onClose={handleClose}
                      portraitSrc={portraitSrc}
                    />
                  </Box>
                ) : (
                  <Box
                    ref={dropZoneRef}
                    border="2px dashed"
                    borderColor={
                      state === "dropped" ? "green.400" : "brand.accent"
                    }
                    borderRadius="12px"
                    bg={
                      state === "dropped"
                        ? "rgba(46, 160, 67, 0.08)"
                        : "rgba(88, 166, 255, 0.04)"
                    }
                    minHeight="400px"
                    width="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexDirection="column"
                    gap={3}
                    transition="all 0.2s ease"
                  >
                    {state === "dropped" ? (
                      <Flex align="center" gap={2}>
                        <Text fontSize="20px">🎮</Text>
                        <Text
                          fontSize="16px"
                          fontWeight="600"
                          color="green.400"
                        >
                          Loading game...
                        </Text>
                      </Flex>
                    ) : (
                      <>
                        <Text fontSize="32px">🎯</Text>
                        <Text
                          fontSize="16px"
                          fontWeight="600"
                          color="brand.text"
                        >
                          Drop me here!
                        </Text>
                        <Text
                          fontSize="13px"
                          color="brand.textMuted"
                          textAlign="center"
                        >
                          Release to start a secret game
                        </Text>
                      </>
                    )}
                  </Box>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </EasterEggContext.Provider>

      {/* Dragging ghost cursor */}
      {isDragging && (
        <Box
          ref={portraitGhostRef}
          position="fixed"
          left={`${dragPosition.x - 30}px`}
          top={`${dragPosition.y - 30}px`}
          width="60px"
          height="60px"
          pointerEvents="none"
          zIndex={9999}
          opacity={0.9}
          filter="drop-shadow(0 4px 12px rgba(88,166,255,0.4))"
          transition="none"
        >
          <img
            src={portraitSrc}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              transform: "rotate(-6deg)",
            }}
          />
        </Box>
      )}
    </>
  );
}

// Context for portrait to receive event handlers
interface EasterEggContextValue {
  onPortraitMouseDown: (e: React.MouseEvent) => void;
  onPortraitMouseUp: () => void;
  isActive: boolean;
  isMobile: boolean;
  isGameRunning: boolean;
}

const EasterEggContext = createContext<EasterEggContextValue>({
  onPortraitMouseDown: () => {},
  onPortraitMouseUp: () => {},
  isActive: false,
  isMobile: true,
  isGameRunning: false,
});

export function useEasterEgg() {
  return useContext(EasterEggContext);
}
