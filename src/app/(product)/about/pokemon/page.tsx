"use client";

import { Box, Text, Flex } from "@chakra-ui/react";
import { PageWrapper } from "@/components/PageWrapper";
import { PageHeading } from "@/components/PageHeading";
import { RetroCard } from "@/components/RetroCard";
import { PokemonCardGrid } from "@/components/pokemon/PokemonCardGrid";

export default function PokemonCollectionPage() {
  return (
    <PageWrapper>
      <Flex
        flexDirection="column"
        width="100%"
        alignItems="flex-start"
        justifyContent="flex-start"
      >
        <RetroCard>
          <Box p={5} pb={3} borderBottom="2px solid" borderBottomColor="brand.border">
            <PageHeading title="Pokémon Collection" />
          </Box>

          <Box padding={[4, 5, 6]}>
            <Text
              fontSize="13px"
              color="brand.textMuted"
              marginBottom={6}
              lineHeight="1.7"
            >
              A selection of my favorite Pokémon cards — each rendered with a
              holographic foil shader. Move your cursor over a card to see the
              rainbow shimmer, and click to get a closer look.
            </Text>

            <PokemonCardGrid />
          </Box>
        </RetroCard>
      </Flex>
    </PageWrapper>
  );
}
