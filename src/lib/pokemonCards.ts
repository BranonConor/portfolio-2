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
    image: "https://product-images.tcgplayer.com/fit-in/400x558/617417.jpg",
    japanese: true,
    description: "The elusive Gameboy Color promo — Japan exclusive, art by Ken Sugimori.",
  },
  {
    id: "birthday-pikachu",
    name: "_____'s Birthday Pikachu",
    set: "s8a-P Promo Card Pack 25th Anniversary",
    number: "007/025",
    rarity: "promo",
    image: "https://product-images.tcgplayer.com/fit-in/400x558/594628.jpg",
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
    set: "SV-P Japanese Promo",
    number: "068/SV-P",
    rarity: "promo",
    image: "https://product-images.tcgplayer.com/fit-in/400x558/587826.jpg",
    japanese: true,
    description: "Yu Nagaba's gorgeous line-art illustration — reverse holo.",
  },
  {
    id: "shining-magikarp",
    name: "Shining Magikarp",
    set: "s8a-P 25th Anniversary Promo",
    number: "010/025",
    rarity: "holo",
    image: "https://product-images.tcgplayer.com/fit-in/400x558/594622.jpg",
    japanese: true,
    description: "The golden fish shines bright — 25th Anniversary promo.",
  },
  {
    id: "raichu-expedition",
    name: "Raichu",
    set: "Expedition (Japanese)",
    number: "113/128",
    rarity: "holo",
    image: "https://product-images.tcgplayer.com/fit-in/400x558/576049.jpg",
    japanese: true,
    firstEdition: true,
    description: "Expedition's electric mouse — Japanese 1st Edition.",
  },
  {
    id: "reshiram-charizard",
    name: "Reshiram & Charizard GX",
    set: "Double Blaze (Japanese)",
    number: "007/095",
    rarity: "holo",
    image: "https://product-images.tcgplayer.com/fit-in/400x558/573605.jpg",
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
    description: "Dark Dragonite — holo from Team Rocket Returns.",
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
  {
    id: "blastoise-base",
    name: "Blastoise",
    set: "Base Set",
    number: "2/102",
    rarity: "holo",
    image: "https://images.pokemontcg.io/base1/2_hires.png",
    description: "The iconic Base Set Blastoise — a true classic.",
  },
  {
    id: "blastoise-base-2",
    name: "Blastoise",
    set: "Base Set",
    number: "2/102",
    rarity: "holo",
    image: "https://images.pokemontcg.io/base1/2_hires.png",
    description: "Second copy of the Base Set legend.",
  },
  {
    id: "venusaur-base",
    name: "Venusaur",
    set: "Base Set",
    number: "15/102",
    rarity: "holo",
    image: "https://images.pokemontcg.io/base1/15_hires.png",
    description: "The original grass titan — Base Set holo.",
  },
  {
    id: "charmander-dragon",
    name: "Charmander",
    set: "EX Dragon",
    number: "98/97",
    rarity: "secret",
    image: "https://images.pokemontcg.io/ex3/98_hires.png",
    description: "Secret Rare Charmander — numbered past the set total.",
  },
  {
    id: "togepi-trr",
    name: "Togepi",
    set: "EX Team Rocket Returns",
    number: "50/109",
    rarity: "reverse-holo",
    image: "https://images.pokemontcg.io/ex7/50_hires.png",
    description: "Reverse holo Togepi from Team Rocket Returns.",
  },
  {
    id: "butterfree-lc",
    name: "Butterfree",
    set: "Legendary Collection",
    number: "21/110",
    rarity: "reverse-holo",
    image: "https://images.pokemontcg.io/base6/21_hires.png",
    description: "Reverse holo from the beautiful Legendary Collection.",
  },
  {
    id: "magikarp-trr",
    name: "Magikarp",
    set: "EX Team Rocket Returns",
    number: "65/109",
    rarity: "reverse-holo",
    image: "https://images.pokemontcg.io/ex7/65_hires.png",
    description: "Reverse holo Magikarp — Team Rocket's overlooked fish.",
  },
  {
    id: "pikachu-promo",
    name: "Pikachu",
    set: "Nintendo Promo",
    number: "12",
    rarity: "promo",
    image: "https://images.pokemontcg.io/np/12_hires.png",
    description: "Holo Pikachu from the Nintendo Black Star Promos.",
  },
  {
    id: "rockets-zapdos-gym",
    name: "Rocket's Zapdos",
    set: "Gym Challenge",
    number: "15/132",
    rarity: "holo",
    image: "https://images.pokemontcg.io/gym2/15_hires.png",
    description: "Team Rocket's stolen thunder bird — Gym Challenge holo.",
  },
  {
    id: "pichu-expedition",
    name: "Pichu",
    set: "Expedition",
    number: "58/165",
    rarity: "reverse-holo",
    image: "https://images.pokemontcg.io/ecard1/58_hires.png",
    description: "Reverse holo Pichu from the Expedition set.",
  },
  {
    id: "eevee-promo",
    name: "Eevee",
    set: "WOTC Black Star Promo",
    number: "11",
    rarity: "promo",
    image: "https://images.pokemontcg.io/basep/11_hires.png",
    description: "The original Eevee promo — evolution potential unleashed.",
  },
];

/** All unique sets for filtering. */
export const CARD_SETS = Array.from(new Set(POKEMON_CARDS.map((c) => c.set)));

/** All unique rarities for filtering. */
export const CARD_RARITIES = Array.from(new Set(POKEMON_CARDS.map((c) => c.rarity)));
