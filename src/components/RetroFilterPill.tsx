"use client";

import { Box } from "@chakra-ui/react";
import { proseFont } from "./proseFont";

interface RetroFilterPillProps {
  label: string;
  active: boolean;
  color: string;
  onClick: () => void;
}

/**
 * A small filter chip — used for the category filter rows on the list
 * pages (projects/engagements/in-the-wild). Chunky 2px border + blocky
 * corners to match the rest of the retro/GBA restyle instead of a soft
 * rounded SaaS pill. Uses the site's IBM Plex Mono UI font (see
 * proseFont.ts) — pixel font read too cramped/illegible at chip sizes.
 */
export const RetroFilterPill: React.FC<RetroFilterPillProps> = ({
  label,
  active,
  color,
  onClick,
}) => (
  <Box
    as="button"
    type="button"
    onClick={onClick}
    className={proseFont.className}
    fontSize="12px"
    letterSpacing="0.02em"
    lineHeight="1.3"
    paddingX={2.5}
    paddingY={1}
    color={active ? "brand.text" : "brand.textMuted"}
    bg={active ? `${color}18` : "brand.surface"}
    border="2px solid"
    borderColor={active ? `${color}55` : "brand.border"}
    borderRadius="10px"
    cursor="pointer"
    transition="0.12s ease all"
    _hover={{
      borderColor: `${color}55`,
      color: "brand.text",
      bg: `${color}18`,
    }}
  >
    {label}
  </Box>
);
