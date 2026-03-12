"use client";
import { Box, BoxProps } from "@chakra-ui/react";
import React from "react";

const Note: React.FC<BoxProps> = ({ children, ...otherProps }) => {
  return (
    <Box
      paddingY={4}
      px={4}
      mx={[4, 5, 6]}
      bg="rgba(255, 255, 255, 0.03)"
      borderRadius="10"
      border="1px solid"
      borderColor="brand.border"
      fontStyle="italic"
      fontWeight={700}
      fontSize="sm"
      color="brand.textMuted"
      {...otherProps}
      my={4}
      sx={{
        "& > p": {
          margin: 0,
          paddingLeft: 2,
        },
      }}
    >
      {children}
    </Box>
  );
};
export default Note;
