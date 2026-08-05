"use client";

import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Box, Flex, Link as ChakraLink, Text } from "@chakra-ui/react";
import Link from "next/link";
import { pixelFont } from "@/components/boot-intro/pixelFont";

interface TopLevelListItemProps {
  title: string;
  href: string;
  accent: string;
  meta: string;
  external?: boolean;
  badges?: React.ReactNode;
}

export const TopLevelListItem = ({
  title,
  href,
  accent,
  meta,
  external = false,
  badges,
}: TopLevelListItemProps) => (
  <ChakraLink
    {...(external
      ? {
          href,
          isExternal: true,
          target: "_blank",
          rel: "noopener noreferrer",
        }
      : { as: Link, href })}
    role="group"
    display="flex"
    flexDirection="row"
    justifyContent="space-between"
    alignItems="flex-start"
    gap={2}
    position="relative"
    paddingY={3}
    paddingX={3}
    borderRadius="10px"
    border="2px solid transparent"
    _after={{
      content: '""',
      position: "absolute",
      top: 0,
      left: 2,
      right: 2,
      height: "2px",
      bg: "brand.border",
      transition: "0.15s ease all",
      transformOrigin: "center",
    }}
    _hover={{
      textDecoration: "none",
      bg: `${accent}14`,
      borderColor: `${accent}55`,
      transform: "translateX(3px)",
      zIndex: 1,
      _after: { transform: "scaleX(0)" },
    }}
    transition="0.14s ease all"
  >
    <Flex flex={1} minWidth={0} pr={4} gap={2}>
      <Text
        as="span"
        className={pixelFont.className}
        fontSize="11px"
        color="transparent"
        _groupHover={{ color: accent }}
        aria-hidden="true"
        flexShrink={0}
        mt="1px"
        transition="color 0.14s ease"
      >
        {"\u25B6"}
      </Text>
      <Box minWidth={0}>
        <Flex alignItems="center" gap={2} flexWrap="wrap">
          <Text textStyle="listTitle">{title}</Text>
          <Box display={["none", "none", "block"]}>{badges}</Box>
        </Flex>
        <Text textStyle="listMeta" mt={0.5} display={["block", "block", "none"]}>
          {meta}
        </Text>
      </Box>
    </Flex>
    <Flex flexShrink={0} alignItems="center" gap={2} alignSelf="stretch">
      <Text
        textStyle="listMeta"
        display={["none", "none", "block"]}
        whiteSpace="nowrap"
      >
        {meta}
      </Text>
      <Box
        boxSize={3}
        flexShrink={0}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {external && <ExternalLinkIcon boxSize={3} color="brand.textMuted" />}
      </Box>
    </Flex>
  </ChakraLink>
);
