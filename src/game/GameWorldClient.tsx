"use client";

import dynamic from "next/dynamic";
import { Box, Flex, Text } from "@chakra-ui/react";

function LoadingScreen() {
  return (
    <Flex
      position="fixed"
      inset={0}
      bg="brand.bg"
      align="center"
      justify="center"
      direction="column"
      gap={4}
      zIndex={40}
    >
      <Box
        as="span"
        w="42px"
        h="42px"
        border="3px solid"
        borderColor="brand.border"
        borderTopColor="brand.accent"
        borderRadius="full"
        sx={{
          animation: "worldspin 0.8s linear infinite",
          "@keyframes worldspin": {
            to: { transform: "rotate(360deg)" },
          },
        }}
      />
      <Text fontSize="13px" color="brand.textMuted">
        Waking up the town…
      </Text>
    </Flex>
  );
}

// Client-only: the game layer must never SSR (touches window/canvas). Lazy import
// keeps Kaplay + world code out of the initial route bundle.
export const GameWorldClient = dynamic(
  () => import("./GameWorld").then((m) => m.GameWorld),
  {
    ssr: false,
    loading: () => <LoadingScreen />,
  },
);
