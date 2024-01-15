"use client";

import { Box, Flex, Heading, useColorModeValue } from "@chakra-ui/react";
import { Nav } from "@/components/Nav";
import { Wave } from "@/components/Wave";

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
      <Box
        maxWidth="1440px"
        position="relative"
        overflowX="hidden"
        paddingY={16}
        paddingX={8}
        width="100%"
      >
        <Nav />
        <Flex width="100%" alignItems="flex-start" justifyContent="flex-start">
          <Heading as="h1" size="2xl">
            About Me
          </Heading>
          <Heading as="h2"></Heading>
        </Flex>
      </Box>
      <Wave />
    </Box>
  );
}
