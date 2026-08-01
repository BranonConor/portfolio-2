"use client";

import { Box, Heading, Text, HeadingProps } from "@chakra-ui/react";
import { pixelFont } from "@/components/boot-intro/pixelFont";

interface PageHeadingProps extends Omit<HeadingProps, "children"> {
  title: string;
  subtitle?: string;
}

/**
 * The retro-styled title used at the top of every route — pixel-font
 * heading. The section's cartridge artwork is already shown just above,
 * in the persistent CartridgeNav row, so it isn't repeated here too.
 */
export const PageHeading: React.FC<PageHeadingProps> = ({
  title,
  subtitle,
  ...otherProps
}) => {
  return (
    <Box>
      <Heading
        as="h1"
        className={pixelFont.className}
        fontSize={["14px", "17px"]}
        fontWeight="400"
        letterSpacing="0.02em"
        lineHeight="1.4"
        mb={subtitle ? 2 : 0}
        {...otherProps}
      >
        {title}
      </Heading>
      {subtitle && (
        <Text fontSize="13px" color="brand.textMuted">
          {subtitle}
        </Text>
      )}
    </Box>
  );
};
