"use client";

import { Box, BoxProps } from "@chakra-ui/react";

/**
 * A thin per-page content wrapper. The persistent chrome this used to
 * render itself (the `<main>` tag, paper texture, cursor sparkles,
 * CartridgeNav, ESC/logo buttons, and the power-off zoom transition) now
 * lives in `src/app/(product)/layout.tsx`, a route-group layout shared by
 * every in-product route — that keeps it mounted across navigations
 * instead of remounting per page. This component just forwards `BoxProps`
 * (e.g. `pb`, `id`) onto a plain relatively-positioned `Box` around a
 * page's own content, the same call signature every page/post layout
 * already uses.
 */
export const PageWrapper: React.FC<BoxProps> = ({ children, ...otherProps }) => (
  <Box position="relative" {...otherProps}>
    {children}
  </Box>
);
