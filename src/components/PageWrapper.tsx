"use client";

import { Box, BoxProps } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { Nav } from "./Nav";
import { MobileNav } from "./MobileNav";
import { PaintStroke } from "./PaintStroke";

export const PageWrapper: React.FC<BoxProps> = ({
  children,
  ...otherProps
}) => {
  return (
    <AnimatePresence mode="wait">
      <Box
        as="main"
        bg="brand.bg"
        minHeight="100vh"
        maxWidth="100%"
        width="100%"
        paddingY={0}
        display="flex"
        justifyContent="center"
        boxSizing="border-box"
        position="relative"
        zIndex={1}
        {...otherProps}
      >
        {/* Ambient paint strokes — fixed to viewport edges */}
        <PaintStroke
          variant={5}
          top="-96px"
          left="-64px"
          width={["300px", "400px", "500px"]}
          opacity={1}
          position="fixed"
        />
        <PaintStroke
          variant={6}
          bottom="-32px"
          right="-80px"
          width={["280px", "360px", "460px"]}
          opacity={1}
          position="fixed"
        />

        <Nav />
        <MobileNav />
        <Box
          as={motion.div}
          maxWidth="960px"
          position="relative"
          pt={[4, 6, "86px"]}
          pb={["52px", "48px", 16]}
          paddingX={[4, 6, 8]}
          width="100%"
          zIndex={1}
          initial={{ opacity: 0, y: 8 }}
          animate={{
            y: 0,
            opacity: 1,
            transition: { duration: 0.4, ease: "easeOut" },
          }}
          exit={{ opacity: 0, y: 8 }}
        >
          {children}
        </Box>
      </Box>
    </AnimatePresence>
  );
};
