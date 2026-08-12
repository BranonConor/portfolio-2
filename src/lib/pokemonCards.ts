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
    id: "ho-oh-neo",
    name: "Ho-Oh",
    set: "Neo Revelation",
    number: "7/64",
    rarity: "holo",
    image: "https://images.pokemontcg.io/neo3/7_hires.png",
    grading: { company: "PSA", grade: 1 },
    firstEdition: true,
  },
  {
    id: "nagaba-leafeon",
    name: "Yu Nagaba Leafeon",
    set: "SV-P Japanese Promo",
    number: "068/SV-P",
    rarity: "promo",
    era: "modern",
    image: "https://product-images.tcgplayer.com/fit-in/400x558/587826.jpg",
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
    id: "raichu-expedition",
    name: "Raichu",
    set: "Expedition (Japanese)",
    number: "113/128",
    rarity: "holo",
    image: "https://product-images.tcgplayer.com/fit-in/400x558/576049.jpg",
    grading: { company: "PSA", grade: 8 },
    japanese: true,
    firstEdition: true,
  },
  {
    id: "golem-ex",
    name: "Golem EX",
    set: "EX Dragon",
    number: "91/97",
    rarity: "ex",
    image: "https://images.pokemontcg.io/ex3/91_hires.png",
  },
  {
    id: "dragonite-ex",
    name: "Dragonite EX",
    set: "EX Dragon",
    number: "90/97",
    rarity: "ex",
    image: "https://images.pokemontcg.io/ex3/90_hires.png",
  },
  {
    id: "rockets-zapdos-ex",
    name: "Rocket's Zapdos EX",
    set: "EX Team Rocket Returns",
    number: "106/109",
    rarity: "ex",
    image: "https://images.pokemontcg.io/ex7/106_hires.png",
  },
  {
    id: "electrode-ex",
    name: "Electrode EX",
    set: "EX FireRed & LeafGreen",
    number: "107/112",
    rarity: "ex",
    image: "https://images.pokemontcg.io/ex6/107_hires.png",
  },
  {
    id: "reshiram-charizard",
    name: "Reshiram & Charizard GX",
    set: "Double Blaze (Japanese)",
    number: "007/095",
    rarity: "holo",
    era: "modern",
    image: "https://product-images.tcgplayer.com/fit-in/400x558/573605.jpg",
    grading: { company: "PSA", grade: 10 },
    japanese: true,
  },
  {
    id: "dark-gyarados",
    name: "Dark Gyarados",
    set: "EX Team Rocket Returns",
    number: "36/109",
    rarity: "reverse-holo",
    image: "https://storage.googleapis.com/images.pricecharting.com/e6472cde27a777e70fca201af105e39bb5d67d213008678b380094d4ed804e34/1600.jpg",
  },
  {
    id: "dark-dragonite",
    name: "Dark Dragonite",
    set: "EX Team Rocket Returns",
    number: "15/109",
    rarity: "holo",
    image: "https://product-images.tcgplayer.com/fit-in/400x558/97956.jpg",
  },
  {
    id: "dark-tyranitar",
    name: "Dark Tyranitar",
    set: "EX Team Rocket Returns",
    number: "20/109",
    rarity: "holo",
    image: "https://storage.googleapis.com/images.pricecharting.com/7fb16fe21a8ce108d73fe248edcd3f6a136a10b224b10ac8ef24965202943110/1600.jpg",
  },
  {
    id: "dark-marowak",
    name: "Dark Marowak",
    set: "EX Team Rocket Returns",
    number: "7/109",
    rarity: "reverse-holo",
    image: "https://images.pokemontcg.io/ex7/7_hires.png",
  },
  {
    id: "giovannis-gyarados",
    name: "Giovanni's Gyarados",
    set: "Gym Challenge",
    number: "5/132",
    rarity: "holo",
    image: "https://images.pokemontcg.io/gym2/5_hires.png",
    firstEdition: true,
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
    id: "venusaur-base",
    name: "Venusaur",
    set: "Base Set",
    number: "15/102",
    rarity: "holo",
    image: "https://product-images.tcgplayer.com/fit-in/400x558/42355.jpg",
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
    id: "togepi-trr",
    name: "Togepi",
    set: "EX Team Rocket Returns",
    number: "50/109",
    rarity: "reverse-holo",
    era: "mid-era",
    image: "https://storage.googleapis.com/images.pricecharting.com/27d72d454414ad0b32b9939f7c9de2d6ec8d2cab6ca91b14d436b6cb2730f32d/1600.jpg",
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
    id: "magikarp-trr",
    name: "Magikarp",
    set: "EX Team Rocket Returns",
    number: "65/109",
    rarity: "reverse-holo",
    era: "mid-era",
    image: "https://storage.googleapis.com/images.pricecharting.com/86b0262847c2205472ad9123a5f47dbdd4da19eaf745a273f051e13d285fa5d1/1600.jpg",
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
    id: "rockets-zapdos-gym",
    name: "Rocket's Zapdos",
    set: "Gym Challenge",
    number: "15/132",
    rarity: "holo",
    image: "https://product-images.tcgplayer.com/fit-in/400x558/88800.jpg",
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
    id: "eevee-promo",
    name: "Eevee",
    set: "WOTC Black Star Promo",
    number: "11",
    rarity: "promo",
    image: "https://images.pokemontcg.io/basep/11_hires.png",
  },
  {
    id: "mewtwo-base",
    name: "Mewtwo",
    set: "Base Set",
    number: "10/102",
    rarity: "holo",
    image: "https://storage.googleapis.com/images.pricecharting.com/0374cd52bb22be6591b9807241107c22c6f72b2f071869c6e6342a156be99e10/1600.jpg",
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
    id: "sableye-deoxys",
    name: "Sableye",
    set: "EX Deoxys",
    number: "23/107",
    rarity: "reverse-holo",
    image: "https://storage.googleapis.com/images.pricecharting.com/jagffw3lxs7jr64k/1600.jpg",
  },
  {
    id: "squirtle-frlg",
    name: "Squirtle",
    set: "EX FireRed & LeafGreen",
    number: "83/112",
    rarity: "reverse-holo",
    era: "mid-era",
    image: "https://storage.googleapis.com/images.pricecharting.com/d0b964d6cb9da8b5e1728b57826b1dfb66270d92fc0104f4e9d9f919142155d1/1600.jpg",
  },
];

export const getCardEra = (card: PokemonCard): CardEra => card.era ?? "vintage";

/** All unique sets for filtering. */
export const CARD_SETS = Array.from(new Set(POKEMON_CARDS.map((c) => c.set)));
