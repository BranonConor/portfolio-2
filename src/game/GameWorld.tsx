"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { bootWorld, type WorldHandle } from "./bootWorld";
import type { BuildingId } from "./config";
import { PANEL_META, PanelContent } from "./panels/PanelContent";
import { MobileControls } from "./MobileControls";

interface GameWorldProps {
  onExitToClassic: () => void;
}

export function GameWorld({ onExitToClassic }: GameWorldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const worldRef = useRef<WorldHandle | null>(null);
  const [nearby, setNearby] = useState<BuildingId | null>(null);
  const [openBuilding, setOpenBuilding] = useState<BuildingId | null>(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(
      typeof window !== "undefined" &&
        window.matchMedia("(pointer: coarse)").matches,
    );
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handle = bootWorld(canvas, {
      onInteract: (id) => setOpenBuilding(id),
      onNearbyChange: (id) => setNearby(id),
      onReady: () => {
        /* world ready — loading screen handled by parent client wrapper */
      },
    });
    worldRef.current = handle;

    return () => {
      handle.destroy();
      worldRef.current = null;
    };
  }, []);

  // Pause the world's input/updates while a panel is open.
  useEffect(() => {
    worldRef.current?.setPaused(openBuilding !== null);
  }, [openBuilding]);

  // Pause the loop when the tab is hidden to save CPU/battery; resume only if
  // no panel is open.
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) {
        worldRef.current?.setPaused(true);
      } else {
        worldRef.current?.setPaused(openBuilding !== null);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () =>
      document.removeEventListener("visibilitychange", onVisibility);
  }, [openBuilding]);

  const closePanel = useCallback(() => setOpenBuilding(null), []);

  return (
    <Box
      position="fixed"
      inset={0}
      bg="brand.bg"
      overflow="hidden"
      role="application"
      aria-label="Interactive portfolio world. Use arrow keys or WASD to move, E to enter buildings."
    >
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block" }}
      />

      {/* Persistent, obvious classic-site toggle (SEO + a11y escape hatch). */}
      <Button
        onClick={onExitToClassic}
        position="absolute"
        top={4}
        right={4}
        size="sm"
        bg="rgba(20,20,22,0.8)"
        color="brand.text"
        border="1px solid"
        borderColor="brand.border"
        backdropFilter="blur(8px)"
        _hover={{ bg: "brand.surfaceHover" }}
        zIndex={20}
      >
        Switch to classic site
      </Button>

      {/* Controls hint */}
      <Box
        position="absolute"
        top={4}
        left={4}
        px={3}
        py={2}
        borderRadius="8px"
        bg="rgba(20,20,22,0.8)"
        border="1px solid"
        borderColor="brand.border"
        backdropFilter="blur(8px)"
        zIndex={20}
        display={["none", "block"]}
      >
        <Text fontSize="12px" color="brand.textMuted">
          Move: WASD / arrows &nbsp;·&nbsp; Interact: E
        </Text>
      </Box>

      {/* "Press E" prompt when near a building */}
      {nearby && !openBuilding && (
        <Flex
          position="absolute"
          bottom={isTouch ? "160px" : 8}
          left="50%"
          transform="translateX(-50%)"
          px={4}
          py={2}
          borderRadius="10px"
          bg="rgba(20,20,22,0.9)"
          border="1px solid"
          borderColor="brand.border"
          backdropFilter="blur(8px)"
          zIndex={20}
          alignItems="center"
          gap={2}
        >
          <Text fontSize="13px" color="brand.text" fontWeight="600">
            {PANEL_META[nearby].title}
          </Text>
          <Text fontSize="12px" color="brand.textMuted">
            — press <b>E</b> {isTouch ? "or tap ●" : ""}
          </Text>
        </Flex>
      )}

      {isTouch && <MobileControls hasInteract={!!nearby} />}

      <Modal
        isOpen={!!openBuilding}
        onClose={closePanel}
        isCentered
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent
          bg="rgba(20, 20, 22, 0.96)"
          border="1px solid"
          borderColor="brand.border"
          borderRadius="14px"
          mx={4}
          maxH="82vh"
        >
          <ModalCloseButton color="brand.textMuted" />
          <ModalBody p={6}>
            {openBuilding && <PanelContent buildingId={openBuilding} />}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
