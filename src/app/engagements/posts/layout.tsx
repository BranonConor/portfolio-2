"use client";

import { PageWrapper } from "@/components/PageWrapper";
import { Button, Flex, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import Link from "next/link";

export default function MdxLayout({ children }: { children: React.ReactNode }) {
  const bg = useColorModeValue("white", "brand.grey");

  return (
    <PageWrapper bg={bg} mt="-32px" pb={10}>
      <Flex justifyContent="center" width="100%">
        <Flex
          flexDirection="column"
          width="100%"
          maxWidth="950px"
          alignItems="flex-start"
          justifyContent="flex-start"
        >
          {children}
          <Flex>
            <Button mt={8} variant="primary" as={Link} href="/engagements">
              👈🏽 Back to Engagements
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </PageWrapper>
  );
}
