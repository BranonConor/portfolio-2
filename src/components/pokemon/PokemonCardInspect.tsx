"use client";

import { Box, Text, Flex } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { getSharedHoloRenderer } from "./sharedHoloRenderer";
import { POKEMON_CARD_FRAME_PROPS } from "./pokemonCardStyles";
import { PokemonGradeBadge } from "./PokemonGradeBadge";
import { pixelFont } from "@/components/boot-intro/pixelFont";
import type { PokemonCard as PokemonCardType } from "@/lib/pokemonCards";

/**
 * Full-screen inspect overlay — shows a larger, interactive holographic
 * render of a single card with its details. Uses the same shared transparent
 * canvas overlay as PokemonCard.
 */
export const PokemonCardInspect: React.FC<{
  card: PokemonCardType | null;
  onClose: () => void;
}> = ({ card, onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const holoRendererRef = useRef<ReturnType<typeof getSharedHoloRenderer> | null>(null);
  const activePointerRef = useRef<number | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  // Close on Escape
  useEffect(() => {
    if (!card) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, [card, onClose]);

  // Keep the collection page fixed behind the modal, including mobile Safari.
  useEffect(() => {
    if (!card) return;
    const { body } = document;
    const scrollY = window.scrollY;
    const previous = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
    };
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    return () => {
      body.style.overflow = previous.overflow;
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.width = previous.width;
      window.scrollTo(0, scrollY);
    };
  }, [card]);

  // Attach the shared WebGL overlay for the inspect view
  useEffect(() => {
    if (!card) return;
    const container = containerRef.current;
    if (!container) return;

    setImageLoaded(false);
    const holoRenderer = getSharedHoloRenderer();
    holoRendererRef.current = holoRenderer;
    holoRenderer.attach(container);

    return () => {
      holoRenderer.detach(container);
    };
  }, [card]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") return;
    activePointerRef.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (
      event.pointerType !== "mouse" &&
      activePointerRef.current !== event.pointerId
    ) {
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = -((event.clientY - rect.top) / rect.height - 0.5) * 2;
    holoRendererRef.current?.setPointer(x, y);
    setTilt({ rotateX: y * 15, rotateY: x * 15 });
  };

  const finishInteraction = (event: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerRef.current !== event.pointerId) return;
    activePointerRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    holoRendererRef.current?.setPointer(0, 0);
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  const handlePointerLeave = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    holoRendererRef.current?.setPointer(0, 0);
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  const rarityLabel =
    card?.rarity === "ex"
      ? "EX"
      : card?.rarity === "reverse-holo"
        ? "REV HOLO"
        : card?.rarity.toUpperCase() ?? "";

  return (
    <AnimatePresence>
      {card && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            position="fixed"
            inset={0}
            bg="rgba(20, 18, 12, 0.82)"
            backdropFilter="blur(12px)"
            sx={{ WebkitBackdropFilter: "blur(12px)" }}
            onClick={onClose}
            cursor="pointer"
          />
          <motion.div
            initial={{ scale: 0.85, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.85, y: 30 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            style={{ position: "relative", zIndex: 1 }}
          >
            <Box
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              display="flex"
              flexDirection={["column", "column", "row"]}
              alignItems="center"
              gap={[4, 6, 8]}
              maxWidth="800px"
              padding={[4, 6]}
              cursor="default"
            >
              {/* Large card with holo overlay */}
              <Box
                ref={containerRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={finishInteraction}
                onPointerCancel={finishInteraction}
                onPointerLeave={handlePointerLeave}
                position="relative"
                width={["260px", "320px", "360px"]}
                flexShrink={0}
                {...POKEMON_CARD_FRAME_PROPS}
                boxShadow="0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(100,100,255,0.08)"
                sx={{ aspectRatio: "5 / 7" }}
                cursor={["grab", "grab", "default"]}
                _active={{ cursor: ["grabbing", "grabbing", "default"] }}
                style={{
                  transform: `perspective(800px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
                  transition: "transform 0.1s ease-out",
                  touchAction: "none",
                }}
              >
                <img
                  src={card.image}
                  alt={card.name}
                  referrerPolicy="no-referrer"
                  onLoad={() => setImageLoaded(true)}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    opacity: imageLoaded ? 1 : 0,
                    transition: "opacity 0.4s ease",
                    userSelect: "none",
                  }}
                  draggable={false}
                />
              </Box>

              {/* Card details */}
              <Box
                maxWidth="320px"
                textAlign={["center", "center", "left"]}
              >
                {card.grading && (
                  <Flex
                    justify={["center", "center", "flex-start"]}
                    marginBottom={3}
                  >
                    <PokemonGradeBadge grading={card.grading} />
                  </Flex>
                )}
                <Text
                  className={pixelFont.className}
                  fontSize="14px"
                  letterSpacing="0.06em"
                  color="white"
                  lineHeight="1.4"
                >
                  {card.name}
                </Text>
                <Flex
                  gap={2}
                  marginTop={1.5}
                  justify={["center", "center", "flex-start"]}
                  wrap="wrap"
                >
                  <Text
                    className={pixelFont.className}
                    fontSize="9px"
                    color="rgba(255,255,255,0.5)"
                    letterSpacing="0.06em"
                  >
                    {card.set}
                  </Text>
                  <Text
                    className={pixelFont.className}
                    fontSize="9px"
                    color="rgba(255,255,255,0.5)"
                    letterSpacing="0.06em"
                  >
                    #{card.number}
                  </Text>
                  <Text
                    className={pixelFont.className}
                    fontSize="9px"
                    color="rgba(255,255,255,0.4)"
                    letterSpacing="0.06em"
                  >
                    {rarityLabel}
                  </Text>
                  {card.firstEdition && (
                    <Text
                      className={pixelFont.className}
                      fontSize="9px"
                      color="#d4a017"
                      letterSpacing="0.06em"
                    >
                      1ST EDITION
                    </Text>
                  )}
                  {card.japanese && (
                    <Text
                      className={pixelFont.className}
                      fontSize="9px"
                      color="#e05050"
                      letterSpacing="0.06em"
                    >
                      JAPANESE
                    </Text>
                  )}
                </Flex>
                <Text
                  className={pixelFont.className}
                  fontSize="8px"
                  color="rgba(255,255,255,0.25)"
                  marginTop={4}
                  letterSpacing="0.08em"
                >
                  CLICK ANYWHERE TO CLOSE ·{" "}
                  <Box as="span" display={["inline", "inline", "none"]}>
                    PRESS + DRAG FOR HOLO EFFECT
                  </Box>
                  <Box as="span" display={["none", "none", "inline"]}>
                    MOVE MOUSE FOR HOLO EFFECT
                  </Box>
                </Text>
              </Box>
            </Box>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
