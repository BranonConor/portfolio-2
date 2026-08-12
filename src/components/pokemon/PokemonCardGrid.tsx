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
  getCardEra,
  type CardEra,
  type PokemonCard as PokemonCardType,
} from "@/lib/pokemonCards";

type CardFilterId = "holo" | "reverse-holo" | "first-edition" | CardEra;

const CARD_FILTERS: Array<{
  id: CardFilterId;
  label: string;
  matches: (card: PokemonCardType) => boolean;
}> = [
  { id: "holo", label: "Holo", matches: (card) => card.rarity === "holo" },
  {
    id: "reverse-holo",
    label: "Reverse Holo",
    matches: (card) => card.rarity === "reverse-holo",
  },
  {
    id: "first-edition",
    label: "1st Ed.",
    matches: (card) => Boolean(card.firstEdition),
  },
  {
    id: "vintage",
    label: "Vintage",
    matches: (card) => getCardEra(card) === "vintage",
  },
  {
    id: "mid-era",
    label: "Mid-era",
    matches: (card) => getCardEra(card) === "mid-era",
  },
  {
    id: "modern",
    label: "Modern",
    matches: (card) => getCardEra(card) === "modern",
  },
];

/**
 * Responsive grid of holographic Pokémon cards with collection filtering.
 */
export const PokemonCardGrid: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<CardFilterId | null>(null);
  const [inspecting, setInspecting] = useState<PokemonCardType | null>(null);

  const filtered = useMemo(() => {
    const filter = CARD_FILTERS.find(({ id }) => id === activeFilter);
    return filter ? POKEMON_CARDS.filter(filter.matches) : POKEMON_CARDS;
  }, [activeFilter]);

  const handleInspect = useCallback((card: PokemonCardType) => {
    setInspecting(card);
  }, []);

  const handleClose = useCallback(() => {
    setInspecting(null);
  }, []);

  return (
    <>
      {/* Collection filter chips */}
      <Flex
        wrap="wrap"
        gap={1.5}
        marginBottom={5}
        justify="flex-start"
      >
        <RetroFilterPill
          label="All"
          active={activeFilter === null}
          onClick={() => setActiveFilter(null)}
          color="#f05032"
        />
        {CARD_FILTERS.map(({ id, label }) => (
          <RetroFilterPill
            key={id}
            label={label}
            active={activeFilter === id}
            onClick={() => setActiveFilter(id)}
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
          "repeat(2, minmax(0, 1fr))",
          "repeat(3, minmax(0, 1fr))",
          "repeat(3, minmax(0, 1fr))",
          "repeat(4, minmax(0, 1fr))",
        ]}
        gap={[3, 4, 5]}
        justifyItems="center"
        width="100%"
      >
        {filtered.map((card, i) => (
          <motion.div
            key={card.id}
            style={{ width: "100%", minWidth: 0, maxWidth: "240px" }}
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
