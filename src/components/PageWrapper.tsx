import { Box, BoxProps } from "@chakra-ui/react";
import { Wave } from "./Wave";

export const PageWrapper: React.FC<BoxProps> = ({
  bg,
  children,
  ...otherProps
}) => {
  return (
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
      <Box
        maxWidth="1440px"
        position="relative"
        overflowX="hidden"
        paddingY={[10, 12, 16]}
        paddingX={[4, 4, 8]}
        width="100%"
        zIndex={1}
      >
        {children}
      </Box>
      <Wave />
    </Box>
  );
};
