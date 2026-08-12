/**
 * Pokémon card collection data — each entry represents a real card
 * from Branon's personal collection.
 */

export type CardRarity =
  | "common"
  | "uncommon"
  | "rare"
  | "holo"
  | "reverse-holo"
  | "ex"
  | "secret"
  | "promo";

export type PokemonCard = {
  id: string;
  name: string;
  set: string;
  number: string;
  rarity: CardRarity;
  image: string;
  description?: string;
  japanese?: boolean;
  firstEdition?: boolean;
};

export const POKEMON_CARDS: PokemonCard[] = [
  {
    id: "light-arcanine",
    name: "Light Arcanine",
    set: "Neo Destiny",
    number: "12/105",
    rarity: "holo",
    image: "https://images.pokemontcg.io/neo4/12_hires.png",
    firstEdition: true,
    description: "One of the most beautiful holos from the Neo era.",
  },
  {
    id: "gb-dragonite",
    name: "Dragonite",
    set: "Pokémon Card GB Promo",
    number: "Unnumbered",
    rarity: "promo",
    image: "https://images.pokemontcg.io/basep/5_hires.png",
    japanese: true,
    description: "The elusive Gameboy Color promo — Japan exclusive, art by Ken Sugimori.",
  },
  {
    id: "birthday-pikachu",
    name: "_____'s Birthday Pikachu",
    set: "25th Celebrations",
    number: "024/025",
    rarity: "promo",
    image: "https://images.pokemontcg.io/cel25/24_hires.png",
    japanese: true,
    description: "Fill in your name and celebrate — Japanese 25th Anniversary promo.",
  },
  {
    id: "dark-blastoise",
    name: "Dark Blastoise",
    set: "Team Rocket",
    number: "3/82",
    rarity: "holo",
    image: "https://images.pokemontcg.io/base5/3_hires.png",
    firstEdition: true,
    description: "Team Rocket's crown jewel. 1st Edition.",
  },
  {
    id: "ho-oh-neo",
    name: "Ho-Oh",
    set: "Neo Revelation",
    number: "7/64",
    rarity: "holo",
    image: "https://images.pokemontcg.io/neo3/7_hires.png",
    firstEdition: true,
    description: "The rainbow phoenix, 1st Edition Neo Revelation.",
  },
  {
    id: "nagaba-leafeon",
    name: "Yu Nagaba Leafeon",
    set: "Japanese Promo",
    number: "PROMO",
    rarity: "promo",
    image: "https://images.pokemontcg.io/swshp/SWSH089_hires.png",
    japanese: true,
    description: "Yu Nagaba's gorgeous line-art illustration — reverse holo.",
  },
  {
    id: "shining-magikarp",
    name: "Shining Magikarp",
    set: "25th Celebrations",
    number: "015/025",
    rarity: "holo",
    image: "https://images.pokemontcg.io/cel25/15_hires.png",
    japanese: true,
    description: "The golden fish shines bright — 25th Anniversary promo.",
  },
  {
    id: "raichu-expedition",
    name: "Raichu",
    set: "Expedition",
    number: "25/165",
    rarity: "holo",
    image: "https://images.pokemontcg.io/base6/25_hires.png",
    japanese: true,
    firstEdition: true,
    description: "Expedition's electric mouse — Japanese 1st Edition.",
  },
  {
    id: "reshiram-charizard",
    name: "Reshiram & Charizard GX",
    set: "Tag Team GX",
    number: "020/095",
    rarity: "holo",
    image: "https://images.pokemontcg.io/sm9/20_hires.png",
    japanese: true,
    description: "Two fire legends unite — Japanese Tag Team holo.",
  },
  {
    id: "dragonite-ex",
    name: "Dragonite EX",
    set: "EX Dragon",
    number: "90/97",
    rarity: "ex",
    image: "https://images.pokemontcg.io/ex3/90_hires.png",
    description: "The original Dragonite EX — a powerhouse from EX Dragon.",
  },
  {
    id: "rockets-zapdos-ex",
    name: "Rocket's Zapdos EX",
    set: "EX Team Rocket Returns",
    number: "106/109",
    rarity: "ex",
    image: "https://images.pokemontcg.io/ex7/106_hires.png",
    description: "Team Rocket's electrifying secret rare.",
  },
  {
    id: "electrode-ex",
    name: "Electrode EX",
    set: "EX FireRed & LeafGreen",
    number: "107/112",
    rarity: "ex",
    image: "https://images.pokemontcg.io/ex6/107_hires.png",
    description: "The explosive orb — full art EX from FireRed & LeafGreen.",
  },
  {
    id: "golem-ex",
    name: "Golem EX",
    set: "EX Dragon",
    number: "91/97",
    rarity: "ex",
    image: "https://images.pokemontcg.io/ex3/91_hires.png",
    description: "Rock-solid power from the EX Dragon set.",
  },
  {
    id: "dark-gyarados",
    name: "Dark Gyarados",
    set: "EX Team Rocket Returns",
    number: "36/109",
    rarity: "reverse-holo",
    image: "https://images.pokemontcg.io/ex7/36_hires.png",
    description: "Stamped reverse holo — the dark sea serpent.",
  },
  {
    id: "dark-dragonite",
    name: "Dark Dragonite",
    set: "EX Team Rocket Returns",
    number: "15/109",
    rarity: "holo",
    image: "https://images.pokemontcg.io/ex7/15_hires.png",
    description: "Dark Dragonite returns with a vengeance.",
  },
  {
    id: "dark-tyranitar",
    name: "Dark Tyranitar",
    set: "EX Team Rocket Returns",
    number: "20/109",
    rarity: "holo",
    image: "https://images.pokemontcg.io/ex7/20_hires.png",
    description: "The mountain-crushing dark titan.",
  },
  {
    id: "dark-marowak",
    name: "Dark Marowak",
    set: "EX Team Rocket Returns",
    number: "7/109",
    rarity: "reverse-holo",
    image: "https://images.pokemontcg.io/ex7/7_hires.png",
    description: "Stamped reverse holo — the bone keeper of Team Rocket.",
  },
  {
    id: "giovannis-gyarados",
    name: "Giovanni's Gyarados",
    set: "Gym Challenge",
    number: "5/132",
    rarity: "holo",
    image: "https://images.pokemontcg.io/gym2/5_hires.png",
    firstEdition: true,
    description: "The Gym Leader's prized sea dragon — 1st Edition.",
  },
];

/** All unique sets for filtering. */
export const CARD_SETS = Array.from(new Set(POKEMON_CARDS.map((c) => c.set)));

/** All unique rarities for filtering. */
export const CARD_RARITIES = Array.from(new Set(POKEMON_CARDS.map((c) => c.rarity)));
