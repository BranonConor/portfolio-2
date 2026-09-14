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

export type CardGrading = {
  company: "PSA";
  grade: number;
};

export type CardEra = "vintage" | "mid-era" | "modern";

export type PokemonCard = {
  id: string;
  name: string;
  set: string;
  number: string;
  rarity: CardRarity;
  era?: Exclude<CardEra, "vintage">;
  image: string;
  grading?: CardGrading;
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
    grading: { company: "PSA", grade: 8 },
    firstEdition: true,
  },
  {
    id: "dark-blastoise",
    name: "Dark Blastoise",
    set: "Team Rocket",
    number: "3/82",
    rarity: "holo",
    image: "https://images.pokemontcg.io/base5/3_hires.png",
    grading: { company: "PSA", grade: 8 },
    firstEdition: true,
  },
  {
    id: "gb-dragonite",
    name: "Dragonite",
    set: "Pokémon Card GB Promo",
    number: "Unnumbered",
    rarity: "promo",
    image: "https://product-images.tcgplayer.com/fit-in/400x558/617417.jpg",
    grading: { company: "PSA", grade: 8 },
    japanese: true,
  },
  {
    id: "birthday-pikachu",
    name: "_____'s Birthday Pikachu",
    set: "s8a-P Promo Card Pack 25th Anniversary",
    number: "007/025",
    rarity: "promo",
    era: "modern",
    image: "https://product-images.tcgplayer.com/fit-in/400x558/594628.jpg",
    grading: { company: "PSA", grade: 10 },
    japanese: true,
  },
  {
    id: "shining-magikarp",
    name: "Shining Magikarp",
    set: "s8a-P 25th Anniversary Promo",
    number: "010/025",
    rarity: "holo",
    era: "modern",
    image: "https://product-images.tcgplayer.com/fit-in/400x558/594622.jpg",
    grading: { company: "PSA", grade: 10 },
    japanese: true,
  },
  {
    id: "kadabra-lc",
    name: "Kadabra",
    set: "Legendary Collection",
    number: "49/110",
    rarity: "reverse-holo",
    image: "https://storage.googleapis.com/images.pricecharting.com/f91085c1502ea2ca2a60388aa04e548941f6ec6da65922002053847a39dbb112/1600.jpg",
  },
  {
    id: "butterfree-lc",
    name: "Butterfree",
    set: "Legendary Collection",
    number: "21/110",
    rarity: "reverse-holo",
    image: "https://storage.googleapis.com/images.pricecharting.com/866d706329f08f5b3a2de3944566ea335403712ae4b9514fdfbc7eed8015e753/1600.jpg",
  },
  {
    id: "butterfree-lc-2",
    name: "Butterfree",
    set: "Legendary Collection",
    number: "21/110",
    rarity: "reverse-holo",
    image: "https://storage.googleapis.com/images.pricecharting.com/866d706329f08f5b3a2de3944566ea335403712ae4b9514fdfbc7eed8015e753/1600.jpg",
  },
  {
    id: "mewtwo-ex",
    name: "Mewtwo EX",
    set: "EX Ruby & Sapphire",
    number: "101/109",
    rarity: "ex",
    era: "mid-era",
    image: "https://images.pokemontcg.io/ex1/101_hires.png",
  },
  {
    id: "dragonite-ex",
    name: "Dragonite EX",
    set: "EX Dragon",
    number: "90/97",
    rarity: "ex",
    era: "mid-era",
    image: "https://images.pokemontcg.io/ex3/90_hires.png",
  },
  {
    id: "rockets-zapdos-ex",
    name: "Rocket's Zapdos EX",
    set: "EX Team Rocket Returns",
    number: "106/109",
    rarity: "ex",
    era: "mid-era",
    image: "https://images.pokemontcg.io/ex7/106_hires.png",
  },
  {
    id: "moltres-ex-cracked-ice",
    name: "Moltres EX",
    set: "EX FireRed & LeafGreen (Cracked Ice)",
    number: "115/112",
    rarity: "ex",
    era: "mid-era",
    image: "https://images.pokemontcg.io/ex6/115_hires.png",
  },
  {
    id: "chansey-ex",
    name: "Chansey EX",
    set: "EX Ruby & Sapphire",
    number: "96/109",
    rarity: "ex",
    era: "mid-era",
    image: "https://images.pokemontcg.io/ex1/96_hires.png",
  },
  {
    id: "magmar-ex",
    name: "Magmar EX",
    set: "EX Ruby & Sapphire",
    number: "100/109",
    rarity: "ex",
    era: "mid-era",
    image: "https://images.pokemontcg.io/ex1/100_hires.png",
  },
  {
    id: "golem-ex",
    name: "Golem EX",
    set: "EX Dragon",
    number: "91/97",
    rarity: "ex",
    era: "mid-era",
    image: "https://images.pokemontcg.io/ex3/91_hires.png",
  },
  {
    id: "electrode-ex",
    name: "Electrode EX",
    set: "EX FireRed & LeafGreen",
    number: "107/112",
    rarity: "ex",
    era: "mid-era",
    image: "https://images.pokemontcg.io/ex6/107_hires.png",
  },
  {
    id: "mew-southern-islands-jp",
    name: "Mew",
    set: "Southern Islands (Japanese)",
    number: "No. 151",
    rarity: "reverse-holo",
    image: "https://storage.googleapis.com/images.pricecharting.com/cbccc7cba6fd102a7ca4fff4f5c21d7daa0eaace73d2f3db8f78437db787c2b8/1600.jpg",
    japanese: true,
  },
  {
    id: "slowking-southern-islands-jp",
    name: "Slowking",
    set: "Southern Islands (Japanese)",
    number: "No. 199",
    rarity: "reverse-holo",
    image: "https://storage.googleapis.com/images.pricecharting.com/719e7667bf964e2f4643949318333380edb4587edd5a58b4a3c4a29a98fa5191/1600.jpg",
    japanese: true,
  },
  {
    id: "dragonite-delta-species",
    name: "Dragonite δ",
    set: "EX Delta Species",
    number: "3/113",
    rarity: "holo",
    era: "mid-era",
    image: "https://images.pokemontcg.io/ex11/3_hires.png",
  },
  {
    id: "latios-delta-holon-phantoms",
    name: "Latios δ",
    set: "EX Holon Phantoms",
    number: "22/110",
    rarity: "reverse-holo",
    era: "mid-era",
    image: "https://storage.googleapis.com/images.pricecharting.com/01cb4f20d8d1951fb4a2379d5d2fb2776289181edaefa9c0d027134067ca5896/1600.jpg",
  },
  {
    id: "alakazam-expedition",
    name: "Alakazam",
    set: "Expedition",
    number: "1/165",
    rarity: "holo",
    image: "https://images.pokemontcg.io/ecard1/1_hires.png",
  },
  {
    id: "slowpoke-mcdonalds-jp",
    name: "Slowpoke",
    set: "McDonald's Pokémon-e Minimum Pack",
    number: "014/018",
    rarity: "holo",
    image: "https://archives.bulbagarden.net/media/upload/7/77/SlowpokeMcDonaldPack14.jpg",
    japanese: true,
  },
  {
    id: "pikachu-promo",
    name: "Pikachu",
    set: "Nintendo Promo",
    number: "12",
    rarity: "promo",
    image: "https://images.pokemontcg.io/np/12_hires.png",
  },
  {
    id: "charmander-dragon",
    name: "Charmander",
    set: "EX Dragon",
    number: "98/97",
    rarity: "secret",
    era: "mid-era",
    image: "https://images.pokemontcg.io/ex3/98_hires.png",
  },
  {
    id: "pichu-expedition",
    name: "Pichu",
    set: "Expedition",
    number: "22/165",
    rarity: "reverse-holo",
    image: "https://storage.googleapis.com/images.pricecharting.com/1950552f3cb8280c433214da40b458719ccdee8f5894e162f24d7a7471ba3137/1600.jpg",
  },
  {
    id: "magikarp-trr",
    name: "Magikarp",
    set: "EX Team Rocket Returns",
    number: "65/109",
    rarity: "reverse-holo",
    era: "mid-era",
    image: "https://storage.googleapis.com/images.pricecharting.com/86b0262847c2205472ad9123a5f47dbdd4da19eaf745a273f051e13d285fa5d1/1600.jpg",
  },
  {
    id: "dark-gyarados",
    name: "Dark Gyarados",
    set: "EX Team Rocket Returns",
    number: "36/109",
    rarity: "reverse-holo",
    era: "mid-era",
    image: "https://storage.googleapis.com/images.pricecharting.com/e6472cde27a777e70fca201af105e39bb5d67d213008678b380094d4ed804e34/1600.jpg",
  },
  {
    id: "dark-marowak",
    name: "Dark Marowak",
    set: "EX Team Rocket Returns",
    number: "7/109",
    rarity: "reverse-holo",
    era: "mid-era",
    image: "https://images.pokemontcg.io/ex7/7_hires.png",
  },
  {
    id: "milotic-hidden-legends",
    name: "Milotic",
    set: "EX Hidden Legends",
    number: "12/101",
    rarity: "holo",
    era: "mid-era",
    image: "https://storage.googleapis.com/images.pricecharting.com/c1c511506113459fb5b30b4006eb477b766854c17ece66632bc75f9568fe992f/1600.jpg",
  },
  {
    id: "rockets-moltres-jp",
    name: "Rocket's Moltres",
    set: "Leaders' Stadium (Japanese)",
    number: "No. 146",
    rarity: "holo",
    image: "https://storage.googleapis.com/images.pricecharting.com/yh4rwc57lkbsy3mn/1600.jpg",
    japanese: true,
  },
  {
    id: "dark-slowbro",
    name: "Dark Slowbro",
    set: "Team Rocket",
    number: "12/82",
    rarity: "holo",
    image: "https://storage.googleapis.com/images.pricecharting.com/05e6a379c1ea56b3fdf7b27f1836ace7fd0b5c5c80a4ca08800c4a27edc0341b/1600.jpg",
  },
  {
    id: "snorlax-jungle",
    name: "Snorlax",
    set: "Jungle",
    number: "11/64",
    rarity: "holo",
    image: "https://storage.googleapis.com/images.pricecharting.com/8bf0e33038356e8ce3561c506e043bcb63a7f26714f2624cadc6a4cfe2d6b618/1600.jpg",
  },
  {
    id: "blastoise-base",
    name: "Blastoise",
    set: "Base Set",
    number: "2/102",
    rarity: "holo",
    image: "https://product-images.tcgplayer.com/fit-in/400x558/42360.jpg",
  },
  {
    id: "blastoise-base-2",
    name: "Blastoise",
    set: "Base Set",
    number: "2/102",
    rarity: "holo",
    image: "https://product-images.tcgplayer.com/fit-in/400x558/42360.jpg",
  },
  {
    id: "venusaur-base",
    name: "Venusaur",
    set: "Base Set",
    number: "15/102",
    rarity: "holo",
    image: "https://product-images.tcgplayer.com/fit-in/400x558/42355.jpg",
  },
  {
    id: "mewtwo-base",
    name: "Mewtwo",
    set: "Base Set",
    number: "10/102",
    rarity: "holo",
    image: "https://storage.googleapis.com/images.pricecharting.com/0374cd52bb22be6591b9807241107c22c6f72b2f071869c6e6342a156be99e10/1600.jpg",
  },
];

export const getCardEra = (card: PokemonCard): CardEra => card.era ?? "vintage";

/** All unique sets for filtering. */
export const CARD_SETS = Array.from(new Set(POKEMON_CARDS.map((c) => c.set)));
