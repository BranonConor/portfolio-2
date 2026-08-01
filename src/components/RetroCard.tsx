"use client";

import { Box, BoxProps } from "@chakra-ui/react";

/**
 * The flat, chunky-bordered card used for every "inside the console" surface
 * (list pages, post pages) — replaces the old blurred-glass + paint-stroke
 * treatment with something simpler and more retro/cartridge-like, matching
 * the 2px chunky borders already used on buttons and nav.
 */
export const RetroCard: React.FC<BoxProps> = ({ children, ...props }) => (
  <Box
    border="2px solid"
    borderColor="brand.border"
    borderRadius="10px"
    bg="brand.surface"
    overflow="hidden"
    width="100%"
    {...props}
  >
    {children}
  </Box>
);
