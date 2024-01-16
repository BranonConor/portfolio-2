"use client";
import { Box, BoxProps, useColorModeValue } from "@chakra-ui/react";
import React from "react";

const Note: React.FC<BoxProps> = ({ children, ...otherProps }) => {
  const bg = useColorModeValue("brand.lightBg", "brand.darkBg");
  const shadow = useColorModeValue(
    "lg",
    "0px 4px 15px 0px rgba(226,175,255, 0.2)"
  );
  return (
    <Box
      paddingY={2}
      px={4}
      bg={bg}
      borderRadius="10"
      boxShadow={shadow}
      fontStyle="italic"
      fontWeight={700}
      fontSize="sm"
      {...otherProps}
      mb={4}
    >
      {children}
    </Box>
  );
};
export default Note;
