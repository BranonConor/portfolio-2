"use client";

import { PageWrapper } from "@/components/PageWrapper";
import { Flex, useColorModeValue } from "@chakra-ui/react";
import React from "react";

export default function MdxLayout({ children }: { children: React.ReactNode }) {
  const bg = useColorModeValue("white", "brand.grey");

  return (
    <PageWrapper bg={bg} mt="-32px">
      <Flex justifyContent="center" width="100%">
        <Flex
          flexDirection="column"
          width="100%"
          maxWidth="950px"
          alignItems="flex-start"
          justifyContent="flex-start"
        >
          {children}
        </Flex>
      </Flex>
    </PageWrapper>
  );
}
