"use client";

import { useCallback, useEffect, useRef } from "react";
import { Box, Flex } from "@chakra-ui/react";

/**
 * On-screen touch controls for mobile: an 8-direction dpad (drag-friendly) and
 * an interact button. Bridges to the Kaplay world via window CustomEvents so the
 * game layer stays framework-agnostic.
 */
export function MobileControls({ hasInteract }: { hasInteract: boolean }) {
  const activeRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const emitMove = useCallback((x: number, y: number) => {
    activeRef.current = { x, y };
    window.dispatchEvent(
      new CustomEvent("world:move", { detail: { x, y } }),
    );
  }, []);

  const stop = useCallback(() => emitMove(0, 0), [emitMove]);

  // Ensure movement stops if a touch is cancelled/lost.
  useEffect(() => {
    const clear = () => emitMove(0, 0);
    window.addEventListener("touchcancel", clear);
    return () => window.removeEventListener("touchcancel", clear);
  }, [emitMove]);

  const dpadBtn = (
    label: string,
    x: number,
    y: number,
    gridArea: string,
  ) => (
    <Box
      gridArea={gridArea}
      as="button"
      aria-label={`Move ${label}`}
      onTouchStart={(e: React.TouchEvent) => {
        e.preventDefault();
        emitMove(x, y);
      }}
      onTouchEnd={(e: React.TouchEvent) => {
        e.preventDefault();
        stop();
      }}
      onMouseDown={() => emitMove(x, y)}
      onMouseUp={stop}
      onMouseLeave={() => activeRef.current.x === x && stop()}
      bg="rgba(20,20,22,0.85)"
      border="1px solid"
      borderColor="brand.border"
      borderRadius="10px"
      color="brand.text"
      fontSize="18px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      userSelect="none"
      sx={{ touchAction: "none" }}
    >
      {label}
    </Box>
  );

  return (
    <>
      {/* Dpad (bottom-left) */}
      <Box
        position="absolute"
        bottom={6}
        left={6}
        display="grid"
        gridTemplateColumns="48px 48px 48px"
        gridTemplateRows="48px 48px 48px"
        gridTemplateAreas={`". up ." "left . right" ". down ."`}
        gap={2}
        zIndex={25}
      >
        {dpadBtn("↑", 0, -1, "up")}
        {dpadBtn("←", -1, 0, "left")}
        {dpadBtn("→", 1, 0, "right")}
        {dpadBtn("↓", 0, 1, "down")}
      </Box>

      {/* Interact button (bottom-right) */}
      <Flex
        position="absolute"
        bottom={10}
        right={8}
        zIndex={25}
        as="button"
        aria-label="Interact"
        onTouchStart={(e: React.TouchEvent) => {
          e.preventDefault();
          window.dispatchEvent(new CustomEvent("world:interact"));
        }}
        onClick={() => window.dispatchEvent(new CustomEvent("world:interact"))}
        w="72px"
        h="72px"
        borderRadius="full"
        bg={hasInteract ? "brand.accent" : "rgba(20,20,22,0.85)"}
        border="1px solid"
        borderColor="brand.border"
        color="brand.bg"
        alignItems="center"
        justifyContent="center"
        fontSize="24px"
        fontWeight="700"
        sx={{ touchAction: "none" }}
        opacity={hasInteract ? 1 : 0.6}
      >
        ●
      </Flex>
    </>
  );
}
