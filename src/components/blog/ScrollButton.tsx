"use client";

import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";
import React from "react";

interface ScrollButtonProps {
  isEndOfPage: boolean;
  scrollDirection: "up" | "down";
  bottomPosition: number;
  scrollPosition: number;
  /** Post-page accent color, so this matches the ESC button's per-section
   * tinted border/background instead of a generic neutral circle. */
  accentColor: string;
}

const ScrollButton: React.FC<ScrollButtonProps> = ({
  scrollDirection = "up",
  bottomPosition,
  scrollPosition,
  isEndOfPage,
  accentColor,
}) => {
  const upIcon = <TriangleUpIcon boxSize="10px" />;
  const downIcon = <TriangleDownIcon boxSize="10px" />;

  const bothVisible = scrollPosition > 128 && !isEndOfPage;
  // Mirrors the ESC button's top=4 (16px) offset for whichever arrow is
  // occupying that top slot, with the other arrow sitting a fixed 12px
  // gap below it (30px tall + 12px gap = 42px) when both are visible.
  const yPosition = scrollDirection === "down" && bothVisible ? "58px" : "16px";

  return (
    <Flex
      as={motion.button}
      type="button"
      position="fixed"
      right={4}
      top={yPosition}
      zIndex={101}
      transition="0.25s ease top, 0.15s ease border-color, 0.15s ease background-color"
      borderRadius="10px"
      bg="brand.surface"
      border="2px solid"
      borderColor={`${accentColor}55`}
      color="brand.text"
      aria-label={scrollDirection === "up" ? "Scroll to top" : "Scroll to bottom"}
      width="30px"
      height="30px"
      alignItems="center"
      justifyContent="center"
      onClick={() => {
        if (typeof global?.window !== "undefined") {
          return scrollDirection === "up"
            ? global?.window.scrollTo({ top: 0 })
            : global?.window.scrollTo({ top: bottomPosition });
        }
      }}
      boxSizing="border-box"
      _hover={{ borderColor: accentColor, bg: "brand.surfaceHover" }}
      whileHover={{
        scale: 1.06,
        transition: { duration: 0.1 },
      }}
      whileTap={{
        scale: 0.95,
        transition: { duration: 0.1 },
      }}
      initial={{ scale: 1.4, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
        transition: { duration: 0.3, type: "spring" },
      }}
      exit={{
        scale: 1.4,
        opacity: 0,
        transition: { duration: 0.3, type: "spring" },
      }}
    >
      {scrollDirection === "up" ? upIcon : downIcon}
    </Flex>
  );
};

export default ScrollButton;
