"use client";

import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Box, Flex, Link as ChakraLink, Text } from "@chakra-ui/react";
import Link from "next/link";
import { HoverArrow, HOVER_ARROW_SHIFT } from "@/components/HoverArrow";

interface TopLevelListItemProps {
  title: string;
  href: string;
  accent: string;
  meta?: string;
  description?: string;
  leading?: React.ReactNode;
  external?: boolean;
  badges?: React.ReactNode;
}

export const TopLevelListItem = ({
  title,
  href,
  accent,
  meta,
  description,
  leading,
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
      left: 0,
      right: 0,
      height: "2px",
      bg: "brand.border",
      transition: "0.15s ease all",
      transformOrigin: "center",
    }}
    _hover={{
      textDecoration: "none",
      bg: `${accent}14`,
      borderColor: `${accent}55`,
      transform: ["none", "none", "translateX(3px)"],
      zIndex: 1,
      _after: { transform: "scaleX(0)" },
    }}
    transition="0.14s ease all"
  >
    <Flex flex={1} minWidth={0} pr={4} gap={2} position="relative">
      {leading ? (
        <Flex
          width="44px"
          height="44px"
          flexShrink={0}
          alignItems="center"
          justifyContent="center"
          overflow="hidden"
          aria-hidden="true"
        >
          {leading}
        </Flex>
      ) : (
        <HoverArrow color={accent} />
      )}
      <Box
        minWidth={0}
        transition="transform 0.14s ease"
        _groupHover={
          leading
            ? undefined
            : { transform: ["none", "none", `translateX(${HOVER_ARROW_SHIFT})`] }
        }
      >
        <Flex alignItems="center" gap={2} flexWrap="wrap">
          <Text textStyle="listTitle">{title}</Text>
          <Box display={["none", "none", "block"]}>{badges}</Box>
        </Flex>
        {description && (
          <Text fontSize="12px" color="brand.textMuted" lineHeight="1.6" mt={1}>
            {description}
          </Text>
        )}
        {meta && (
          <Text textStyle="listMeta" mt={0.5} display={["block", "block", "none"]}>
            {meta}
          </Text>
        )}
      </Box>
    </Flex>
    {(meta || external) && (
      <Flex flexShrink={0} alignItems="center" gap={2} alignSelf="stretch">
        {meta && (
          <Text
            textStyle="listMeta"
            display={["none", "none", "block"]}
            whiteSpace="nowrap"
          >
            {meta}
          </Text>
        )}
        {external && (
          <Box
            boxSize={3}
            flexShrink={0}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <ExternalLinkIcon boxSize={3} color="brand.textMuted" />
          </Box>
        )}
      </Flex>
    )}
  </ChakraLink>
);
