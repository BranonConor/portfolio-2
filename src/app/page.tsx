"use client";

import { Box, useColorModeValue } from "@chakra-ui/react";
import { Nav } from "../components/Nav";

export default function Home() {
  const bg = useColorModeValue("white", "brand.grey");

  return (
    <Box
      as="main"
      bg={bg}
      minHeight="100vh"
      maxWidth="100%"
      width="100%"
      padding="0"
      display="flex"
      justifyContent="center"
      boxSizing="border-box"
    >
      <Box maxWidth="1440px" position="relative" overflowX="hidden">
        <Nav />
      </Box>
    </Box>
  );
}
