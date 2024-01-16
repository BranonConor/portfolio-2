import { PageWrapper } from "@/components/PageWrapper";
import { Flex, Heading } from "@chakra-ui/react";
import React from "react";

export default function MdxLayout({ children }: { children: React.ReactNode }) {
  // Create any shared layout or styles here
  return (
    <PageWrapper>
      <Flex
        flexDirection="column"
        width="100%"
        alignItems="flex-start"
        justifyContent="flex-start"
      >
        <Heading as="h1" size="2xl">
          Blog
        </Heading>
        {children}
      </Flex>
    </PageWrapper>
  );
}
