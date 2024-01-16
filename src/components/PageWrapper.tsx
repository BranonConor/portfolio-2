"use client";

import { Box, BoxProps } from "@chakra-ui/react";
import { Wave } from "./Wave";
import { AnimatePresence, motion } from "framer-motion";
import { Nav } from "./Nav";
import { MobileNav } from "./MobileNav";

export const PageWrapper: React.FC<BoxProps> = ({
  bg,
  children,
  ...otherProps
}) => {
  return (
    <AnimatePresence mode="wait">
      <Box
        as="main"
        bg={bg}
        minHeight="100vh"
        maxWidth="100%"
        width="100%"
        paddingY={0}
        pl={[0, 0, 16]}
        pr={0}
        display="flex"
        justifyContent="center"
        boxSizing="border-box"
        position="relative"
        zIndex={1}
        {...otherProps}
      >
        <Nav />
        <MobileNav />
        <Box
          as={motion.div}
          maxWidth="1440px"
          position="relative"
          overflowX="hidden"
          paddingY={[12, 14, 16]}
          paddingX={[4, 4, 8]}
          width="100%"
          zIndex={1}
          initial={{ opacity: 0, left: "-24px" }}
          animate={{
            left: 0,
            opacity: 1,
            transition: { duration: 0.4, type: "spring" },
          }}
          exit={{ opacity: 0, left: "-32px" }}
        >
          {children}
        </Box>
        <Wave />
      </Box>
    </AnimatePresence>
  );
};
