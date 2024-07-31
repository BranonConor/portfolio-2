"use client";

import { Box, useColorModeValue, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import React from "react";

interface ScrollButtonProps {
  isEndOfPage: boolean;
  scrollDirection: "up" | "down";
  bottomPosition: number;
  scrollPosition: number;
}

const ScrollButton: React.FC<ScrollButtonProps> = ({
  isEndOfPage,
  scrollDirection = "up",
  bottomPosition,
  scrollPosition,
}) => {
  const bg = useColorModeValue("brand.lightBg", "brand.darkBg");
  const shadow = useColorModeValue(
    "lg",
    "0px 4px 15px 0px rgba(226,175,255, 0.10)"
  );

  const yPosition =
    scrollDirection === "down" ? (scrollPosition > 128 ? 36 : 20) : 20;

  return (
    <Box
      as={motion.button}
      position="fixed"
      right={4}
      top={yPosition}
      transition="0.25s ease all"
      zIndex={9}
      borderRadius="100%"
      bg={bg}
      boxShadow={shadow}
      aria-label="scroll to top"
      padding={4}
      onClick={() =>
        scrollDirection === "up"
          ? window.scrollTo({ top: 0 })
          : window.scrollTo({ top: bottomPosition })
      }
      boxSizing="border-box"
      whileHover={{
        scale: 1.1,
        transition: { duration: 0.1 },
      }}
      whileTap={{
        scale: 1.2,
        transition: { duration: 0.1 },
      }}
      initial={{ scale: 2, zIndex: 10 }}
      animate={{
        scale: 1,
        zIndex: 9,
        transition: { duration: 0.4, type: "spring" },
      }}
      exit={{
        scale: 2,
        opacity: 0,
        zIndex: 10,
        transition: { duration: 1, type: "spring" },
      }}
    >
      <Text width={4} height={4} position="relative" top="-4px">
        {scrollDirection === "up" ? "👆🏽" : "👇🏽"}
      </Text>
    </Box>
  );
};

export default ScrollButton;
