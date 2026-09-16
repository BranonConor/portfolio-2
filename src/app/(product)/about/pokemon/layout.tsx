import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/pageMetadata";

// The collection page is a client component, so this server layout provides
// its dedicated title, description, and About cartridge link preview.
export const metadata: Metadata = buildPageMetadata({
  title: "Pokémon Collection",
  description:
    "I've been collecting pokemon cards since the very first set came out - I'm THAT old! Here's some of my favorites I own.",
  path: "/about/pokemon",
});

export default function PokemonCollectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
