"use client";

import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { Flex, useColorModeValue, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import React from "react";

interface ScrollButtonProps {
  isEndOfPage: boolean;
  scrollDirection: "up" | "down";
  bottomPosition: number;
  scrollPosition: number;
}

const ScrollButton: React.FC<ScrollButtonProps> = ({
  scrollDirection = "up",
  bottomPosition,
  scrollPosition,
}) => {
  const bg = useColorModeValue("brand.lightBg", "brand.darkBg");
  const upIcon = useColorModeValue(
    <TriangleUpIcon color="brand.grey" />,
    <TriangleUpIcon />
  );
  const downIcon = useColorModeValue(
    <TriangleDownIcon color="brand.grey" />,
    <TriangleDownIcon />
  );
  const shadow = useColorModeValue(
    "lg",
    "0px 4px 15px 0px rgba(226,175,255, 0.10)"
  );

  const yPosition =
    scrollDirection === "down" ? (scrollPosition > 128 ? 36 : 20) : 20;

  return (
    <Flex
      as={motion.button}
      position="fixed"
      right={4}
      top={yPosition}
      transition="0.25s ease top"
      borderRadius="100%"
      bg={bg}
      boxShadow={shadow}
      aria-label="scroll to top"
      width={12}
      height={12}
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
      {scrollDirection === "up" ? upIcon : downIcon}
    </Flex>
  );
};

export default ScrollButton;
