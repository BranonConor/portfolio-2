import { Box } from "@chakra-ui/react";

/**
 * Visually hidden until focused. Lets keyboard and screen-reader users jump
 * past the floating nav directly to the page's main content region.
 */
export const SkipToContent = () => (
  <Box
    as="a"
    href="#main-content"
    position="absolute"
    top={2}
    left={2}
    zIndex={1000}
    px={4}
    py={2}
    borderRadius="8px"
    bg="brand.accent"
    color="brand.bg"
    fontWeight={600}
    fontSize="14px"
    textDecoration="none"
    transform="translateY(-200%)"
    transition="transform 0.15s ease"
    _focus={{
      transform: "translateY(0)",
      outline: "2px solid",
      outlineColor: "brand.accent",
      outlineOffset: "2px",
    }}
    _focusVisible={{
      transform: "translateY(0)",
    }}
  >
    Skip to main content
  </Box>
);
