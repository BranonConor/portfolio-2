"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { Box, Text, Flex } from "@chakra-ui/react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { getSharedHoloRenderer } from "./sharedHoloRenderer";
import { POKEMON_CARD_FRAME_PROPS } from "./pokemonCardStyles";
import { PokemonGradeBadge } from "./PokemonGradeBadge";
import { pixelFont } from "@/components/boot-intro/pixelFont";
import type { PokemonCard as PokemonCardType } from "@/lib/pokemonCards";

// 3D tilt config
const TILT_MAX = 18;
const SPRING_CONFIG = { stiffness: 200, damping: 26, mass: 0.8 };

type Props = {
  card: PokemonCardType;
  onInspect?: (card: PokemonCardType) => void;
};

/**
 * A single Pokémon card with Balatro-style holographic WebGL overlay.
 *
 * The card uses a regular image element (no CORS issues). A shared transparent
 * OGL canvas moves onto the active card and renders only the holographic foil
 * effect that reacts to mouse position. Framer Motion handles the 3D tilt.
 */
export const PokemonCard: React.FC<Props> = ({ card, onInspect }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const holoRendererRef = useRef<ReturnType<typeof getSharedHoloRenderer> | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Framer Motion tilt values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [TILT_MAX, -TILT_MAX]), SPRING_CONFIG);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-TILT_MAX, TILT_MAX]), SPRING_CONFIG);

  useEffect(() => {
    const container = containerRef.current;
    return () => {
      if (container) {
        holoRendererRef.current?.detach(container);
      }
    };
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(x);
      mouseY.set(y);
      holoRendererRef.current?.setPointer(x * 2, -y * 2);
    },
    [mouseX, mouseY],
  );

  const handleMouseEnter = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const holoRenderer = getSharedHoloRenderer();
    holoRendererRef.current = holoRenderer;
    holoRenderer.attach(container);
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
    const container = containerRef.current;
    if (container) {
      holoRendererRef.current?.detach(container);
    }
  }, [mouseX, mouseY]);

  const handleClick = useCallback(() => {
    onInspect?.(card);
  }, [card, onInspect]);

  // Callback ref for the img element — handles both cached and fresh loads
  const imgCallbackRef = useCallback((node: HTMLImageElement | null) => {
    if (node && node.complete && node.naturalHeight > 0) {
      setImageLoaded(true);
    }
  }, []);

  const rarityLabel =
    card.rarity === "ex"
      ? "EX"
      : card.rarity === "reverse-holo"
        ? "REV HOLO"
        : card.rarity.toUpperCase();

  return (
    <Box
      width="100%"
      maxWidth="240px"
      cursor="pointer"
      onClick={handleClick}
    >
      {/* 3D tilt card container */}
      <Box
        as={motion.div}
        style={{
          perspective: "1000px",
        }}
      >
        <Box
          as={motion.div}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          {...POKEMON_CARD_FRAME_PROPS}
          position="relative"
          role="button"
          tabIndex={0}
          aria-label={`Inspect ${card.name}${card.grading ? `, ${card.grading.company} ${card.grading.grade}` : ""}`}
        >
          {/* Card image + transparent holo overlay */}
          <Box
            ref={containerRef}
            position="relative"
            width="100%"
            overflow="hidden"
            sx={{ aspectRatio: "5 / 7" }}
          >
            <img
              ref={imgCallbackRef}
              src={card.image}
              alt={card.name}
              referrerPolicy="no-referrer"
              onLoad={() => { setImageLoaded(true); setImageError(false); }}
              onError={() => { setImageLoaded(true); setImageError(true); }}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                opacity: imageLoaded && !imageError ? 1 : 0,
                transition: "opacity 0.4s ease",
              }}
            />
            {imageError && (
              <Flex
                position="absolute"
                inset={0}
                align="center"
                justify="center"
                className={pixelFont.className}
                fontSize="9px"
                color="brand.textMuted"
                letterSpacing="0.08em"
                textAlign="center"
                px={2}
              >
                {card.name}
              </Flex>
            )}
            {!imageLoaded && (
              <Flex
                position="absolute"
                inset={0}
                align="center"
                justify="center"
                className={pixelFont.className}
                fontSize="10px"
                color="brand.textMuted"
                letterSpacing="0.08em"
              >
                LOADING...
              </Flex>
            )}
          </Box>
        </Box>
      </Box>

      {/* Card info — outside the card border for true card shape */}
      <Box paddingX={1} paddingTop={2}>
        <Text
          className={pixelFont.className}
          fontSize="9px"
          letterSpacing="0.06em"
          color="brand.text"
          lineHeight="1.4"
          noOfLines={1}
        >
          {card.name}
        </Text>
        <Flex
          justify="space-between"
          align="center"
          marginTop={0.5}
        >
          <Text
            fontSize="9px"
            color="brand.textMuted"
            noOfLines={1}
          >
            {card.set} · {card.number}
          </Text>
          <Flex gap={1} align="center" flexShrink={0}>
            {card.grading && <PokemonGradeBadge grading={card.grading} />}
            {card.firstEdition && (
              <Text
                className={pixelFont.className}
                fontSize="7px"
                color="#d4a017"
                letterSpacing="0.06em"
              >
                1ST
              </Text>
            )}
            {card.japanese && (
              <Text
                className={pixelFont.className}
                fontSize="7px"
                color="#e05050"
                letterSpacing="0.06em"
              >
                JP
              </Text>
            )}
            <Text
              className={pixelFont.className}
              fontSize="7px"
              color="brand.textMuted"
              letterSpacing="0.06em"
            >
              {rarityLabel}
            </Text>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};
