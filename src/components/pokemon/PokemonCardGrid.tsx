"use client";

import {
  Fragment,
  useState,
  useCallback,
  useMemo,
  useRef,
  type KeyboardEvent,
} from "react";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { motion, useReducedMotion } from "framer-motion";
import { PokemonCard } from "./PokemonCard";
import { PokemonCardInspect } from "./PokemonCardInspect";
import { RetroFilterPill } from "@/components/RetroFilterPill";
import { proseFont } from "@/components/proseFont";
import {
  ARCHIVED_POKEMON_CARDS,
  POKEMON_CARDS,
  getCardEra,
  type CardEra,
  type PokemonCard as PokemonCardType,
} from "@/lib/pokemonCards";

type CardFilterId = "holo" | "reverse-holo" | "first-edition" | CardEra;
type CollectionTabId = "current" | "archive";

const COLLECTION_TABS: Array<{
  id: CollectionTabId;
  label: string;
  count: number;
  panelId: string;
}> = [
  {
    id: "current",
    label: "Currently owned",
    count: POKEMON_CARDS.length,
    panelId: "pokemon-currently-owned-panel",
  },
  {
    id: "archive",
    label: "Previously owned",
    count: ARCHIVED_POKEMON_CARDS.length,
    panelId: "pokemon-previously-owned-panel",
  },
];

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
  const [activeCollection, setActiveCollection] =
    useState<CollectionTabId>("current");
  const [activeFilter, setActiveFilter] = useState<CardFilterId | null>(null);
  const [inspecting, setInspecting] = useState<PokemonCardType | null>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const reduceMotion = useReducedMotion() ?? false;

  const activeCards =
    activeCollection === "current" ? POKEMON_CARDS : ARCHIVED_POKEMON_CARDS;
  const activeTab =
    COLLECTION_TABS.find(({ id }) => id === activeCollection) ??
    COLLECTION_TABS[0];

  const filtered = useMemo(() => {
    const filter = CARD_FILTERS.find(({ id }) => id === activeFilter);
    return filter ? activeCards.filter(filter.matches) : activeCards;
  }, [activeCards, activeFilter]);

  const handleInspect = useCallback((card: PokemonCardType) => {
    setInspecting(card);
  }, []);

  const handleClose = useCallback(() => {
    setInspecting(null);
  }, []);

  const handleCollectionChange = useCallback(
    (collection: CollectionTabId) => {
      setActiveCollection(collection);
      setActiveFilter(null);
      setInspecting(null);
    },
    [],
  );

  const handleTabKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
      let nextIndex = index;

      if (event.key === "ArrowRight") {
        nextIndex = (index + 1) % COLLECTION_TABS.length;
      } else if (event.key === "ArrowLeft") {
        nextIndex =
          (index - 1 + COLLECTION_TABS.length) % COLLECTION_TABS.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = COLLECTION_TABS.length - 1;
      } else {
        return;
      }

      event.preventDefault();
      const nextTab = COLLECTION_TABS[nextIndex];
      handleCollectionChange(nextTab.id);
      tabRefs.current[nextIndex]?.focus();
    },
    [handleCollectionChange],
  );

  return (
    <>
      <Flex
        role="tablist"
        aria-label="Pokémon collection views"
        align="center"
        gap={[1.5, 2]}
        minWidth={0}
        marginBottom={5}
      >
        {COLLECTION_TABS.map((tab, index) => {
          const isActive = tab.id === activeCollection;

          return (
            <Fragment key={tab.id}>
              {index > 0 && (
                <Text
                  aria-hidden="true"
                  className={proseFont.className}
                  color="brand.borderDark"
                  fontSize={["11px", "13px"]}
                >
                  /
                </Text>
              )}
              <Button
                ref={(node: HTMLButtonElement | null) => {
                  tabRefs.current[index] = node;
                }}
                type="button"
                role="tab"
                id={`pokemon-${tab.id}-tab`}
                aria-controls={tab.panelId}
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
                onClick={() => handleCollectionChange(tab.id)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
                className={proseFont.className}
                minWidth={0}
                height="auto"
                padding={0}
                paddingBottom="3px"
                borderRadius={0}
                borderBottom="2px solid"
                borderBottomColor={isActive ? "#f05032" : "transparent"}
                bg="transparent"
                color={isActive ? "brand.text" : "brand.textMuted"}
                fontSize={["10px", "12px"]}
                fontWeight={isActive ? 600 : 400}
                lineHeight="1.3"
                whiteSpace="nowrap"
                cursor="pointer"
                transition="0.12s ease"
                _hover={{
                  color: "brand.text",
                  borderBottomColor: isActive ? "#f05032" : "#f0503255",
                  bg: "transparent",
                }}
                _focusVisible={{
                  outline: "2px solid",
                  outlineColor: "#f05032",
                  outlineOffset: "3px",
                }}
              >
                {tab.label} ({tab.count})
              </Button>
            </Fragment>
          );
        })}
      </Flex>

      {COLLECTION_TABS.filter(({ id }) => id !== activeCollection).map(
        (tab) => (
          <Box
            key={tab.id}
            role="tabpanel"
            id={tab.panelId}
            aria-labelledby={`pokemon-${tab.id}-tab`}
            hidden
          />
        ),
      )}

      <Box
        role="tabpanel"
        id={activeTab.panelId}
        aria-labelledby={`pokemon-${activeTab.id}-tab`}
      >
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
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.35,
                delay: reduceMotion ? 0 : i * 0.04,
                ease: "easeOut",
              }}
            >
              <PokemonCard card={card} onInspect={handleInspect} />
            </motion.div>
          ))}
        </Box>
      </Box>

      <PokemonCardInspect card={inspecting} onClose={handleClose} />
    </>
  );
};
