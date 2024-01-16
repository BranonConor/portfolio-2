"use client";

import { Flex, Heading, useColorModeValue } from "@chakra-ui/react";
import { PageWrapper } from "@/components/PageWrapper";

export default function Home() {
  const bg = useColorModeValue("white", "brand.grey");

  return (
    <PageWrapper bg={bg}>
      <Flex width="100%" alignItems="flex-start" justifyContent="flex-start">
        <Heading as="h1" size="2xl">
          About Me
        </Heading>
        <Heading as="h2"></Heading>
      </Flex>
    </PageWrapper>
  );
}
