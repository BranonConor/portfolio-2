"use client";

import { Box, Flex, Heading, useColorModeValue, Text } from "@chakra-ui/react";
import { Nav } from "../components/Nav";
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
        <Flex
          width="100%"
          flexDirection="column"
          alignItems="flex-start"
          justifyContent="flex-start"
        >
          <Heading as="h1" size="2xl" mb={4}>
            Hi, I'm Branon! 👋
          </Heading>
          <Heading
            as="h2"
            size="xl"
            color="brand.pink"
            borderLeft="4px solid"
            borderLeftColor="brand.pink"
            pl={6}
            mb={8}
          >
            I'm a UX-focused software engineer.
          </Heading>
          <Text as="p">
            With a degree in behavioral neuroscience, a seasoned eye for
            best-in-class UX/UI, and a powerful command of modern technologies
            to build quality interfaces and experiences, my strengths lie at the
            intersection of technology and people. I strive to build intuitive,
            accessible, and scalable software that delights users and propels
            businesses forward.
          </Text>
        </Flex>
      </Box>
      <Wave />
    </Box>
  );
}
