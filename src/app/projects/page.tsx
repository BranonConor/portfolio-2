"use client";

import { Flex, Heading, useColorModeValue } from "@chakra-ui/react";
import { PageWrapper } from "@/components/PageWrapper";
import { FancyHeading } from "@/components/FancyHeading";

export default function Home() {
  const bg = useColorModeValue("white", "brand.grey");

  return (
    <PageWrapper bg={bg}>
      <Flex
        flexDirection="column"
        width="100%"
        alignItems="flex-start"
        justifyContent="flex-start"
      >
        <Heading as="h1" size="2xl" mb={4}>
          Projects 🛠️
        </Heading>
        <FancyHeading as="h2">Coming soon ;)</FancyHeading>
      </Flex>
    </PageWrapper>
  );
}
