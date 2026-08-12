"use client";

import { useState, useCallback, useMemo } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { PokemonCard } from "./PokemonCard";
import { PokemonCardInspect } from "./PokemonCardInspect";
import { RetroFilterPill } from "@/components/RetroFilterPill";
import { pixelFont } from "@/components/boot-intro/pixelFont";
import {
  POKEMON_CARDS,
  CARD_RARITIES,
  type PokemonCard as PokemonCardType,
  type CardRarity,
} from "@/lib/pokemonCards";

const RARITY_LABELS: Record<CardRarity, string> = {
  common: "Common",
  uncommon: "Uncommon",
  rare: "Rare",
  holo: "Holo",
  "reverse-holo": "Rev Holo",
  ex: "EX",
  secret: "Secret",
  promo: "Promo",
};

/**
 * Responsive grid of holographic Pokémon cards with rarity filtering.
 */
export const PokemonCardGrid: React.FC = () => {
  const [activeRarity, setActiveRarity] = useState<CardRarity | null>(null);
  const [inspecting, setInspecting] = useState<PokemonCardType | null>(null);

  const filtered = useMemo(
    () =>
      activeRarity
        ? POKEMON_CARDS.filter((c) => c.rarity === activeRarity)
        : POKEMON_CARDS,
    [activeRarity],
  );

  const handleInspect = useCallback((card: PokemonCardType) => {
    setInspecting(card);
  }, []);

  const handleClose = useCallback(() => {
    setInspecting(null);
  }, []);

  return (
    <>
      {/* Rarity filter chips */}
      <Flex
        wrap="wrap"
        gap={1.5}
        marginBottom={5}
        justify="flex-start"
      >
        <RetroFilterPill
          label="All"
          active={activeRarity === null}
          onClick={() => setActiveRarity(null)}
          color="#f05032"
        />
        {CARD_RARITIES.map((rarity: CardRarity) => (
          <RetroFilterPill
            key={rarity}
            label={RARITY_LABELS[rarity]}
            active={activeRarity === rarity}
            onClick={() => setActiveRarity(rarity)}
            color="#f05032"
          />
        ))}
      </Flex>

      {/* Card count */}
      <Text
        className={pixelFont.className}
        fontSize="9px"
        color="brand.textMuted"
        letterSpacing="0.08em"
        marginBottom={4}
      >
        {filtered.length} CARD{filtered.length !== 1 ? "S" : ""} IN COLLECTION
      </Text>

      {/* Card grid */}
      <Box
        display="grid"
        gridTemplateColumns={[
          "repeat(2, 1fr)",
          "repeat(3, 1fr)",
          "repeat(3, 1fr)",
          "repeat(4, 1fr)",
        ]}
        gap={[3, 4, 5]}
        justifyItems="center"
      >
        {filtered.map((card, i) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.35,
              delay: i * 0.04,
              ease: "easeOut",
            }}
          >
            <PokemonCard card={card} onInspect={handleInspect} />
          </motion.div>
        ))}
      </Box>

      {/* Inspect overlay */}
      <PokemonCardInspect card={inspecting} onClose={handleClose} />
    </>
  );
};
