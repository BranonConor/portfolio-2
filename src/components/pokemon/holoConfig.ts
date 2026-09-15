import type { PokemonCard } from "@/lib/pokemonCards";

export type HoloArtworkWindow = {
  left: string;
  top: string;
  width: string;
  height: string;
  borderRadius: string;
};

export const HOLO_FALLBACK_BACKGROUND =
  "radial-gradient(circle at 28% 34%, rgba(170, 205, 255, .2), transparent 25%), radial-gradient(circle at 72% 68%, rgba(255, 145, 220, .14), transparent 28%), linear-gradient(120deg, rgba(115, 220, 255, .08), rgba(255, 245, 170, .12), rgba(220, 130, 255, .08))";

const ARTWORK_WINDOWS = {
  classic: {
    left: "9.2%",
    top: "19.2%",
    width: "81.6%",
    height: "38.7%",
    borderRadius: "2.5%",
  },
  eCard: {
    left: "10.4%",
    top: "16.4%",
    width: "79.2%",
    height: "39.2%",
    borderRadius: "2%",
  },
  exEra: {
    left: "9.1%",
    top: "17.8%",
    width: "81.8%",
    height: "40.2%",
    borderRadius: "2.5%",
  },
  modern: {
    left: "9.2%",
    top: "18.2%",
    width: "81.6%",
    height: "39.7%",
    borderRadius: "2.5%",
  },
} satisfies Record<string, HoloArtworkWindow>;

const E_CARD_SETS = ["Expedition", "Pokémon-e"];

export const getHoloArtworkWindow = (
  card: PokemonCard,
): HoloArtworkWindow => {
  if (E_CARD_SETS.some((setName) => card.set.includes(setName))) {
    return ARTWORK_WINDOWS.eCard;
  }
  if (card.era === "mid-era") {
    return ARTWORK_WINDOWS.exEra;
  }
  if (card.era === "modern") {
    return ARTWORK_WINDOWS.modern;
  }
  return ARTWORK_WINDOWS.classic;
};

export const getHoloSeed = (cardId: string) => {
  let hash = 2166136261;
  for (let index = 0; index < cardId.length; index += 1) {
    hash ^= cardId.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) / 4294967295;
};
