"use client";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Box, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { motion } from "framer-motion";

export const ColorModeButton = () => {
  const { toggleColorMode } = useColorMode();
  const icon = useColorModeValue(<MoonIcon color="brand.grey" />, <SunIcon />);
  const bg = useColorModeValue("brand.lightBg", "brand.darkBg");
  const shadow = useColorModeValue(
    "lg",
    "0px 4px 15px 0px rgba(226,175,255, 0.10)"
  );

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="fixed"
      top={4}
      right={4}
      zIndex={9}
      borderRadius="100%"
      bg={bg}
      boxShadow={shadow}
      as={motion.button}
      aria-label="color mode toggle"
      onClick={toggleColorMode}
      padding={4}
      whileHover={{
        scale: 1.1,
        transition: { duration: 0.1 },
        rotate: 10,
      }}
      whileTap={{
        scale: 1.2,
        transition: { duration: 0.1 },
        rotate: -10,
      }}
    >
      {icon}
    </Box>
  );
};
