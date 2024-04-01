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
      paddingY={4}
      px={4}
      bg={bg}
      borderRadius="10"
      boxShadow={shadow}
      fontStyle="italic"
      fontWeight={700}
      fontSize="sm"
      {...otherProps}
      my={4}
      sx={{
        "& > p": {
          margin: 0,
          borderLeft: "1px solid",
          paddingLeft: 2,
        },
      }}
    >
      {children}
    </Box>
  );
};
export default Note;
