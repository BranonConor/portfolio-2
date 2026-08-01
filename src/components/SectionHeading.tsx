"use client";

import { Flex, Heading, Text, FlexProps } from "@chakra-ui/react";
import { pixelFont } from "@/components/boot-intro/pixelFont";

interface SectionHeadingProps extends Omit<FlexProps, "title"> {
  title: string;
  color?: string;
  href?: string;
}

/**
 * Small pixel-font section label used for the sub-sections stacked inside a
 * page (Experience, Education, Publications, Photography, Music, Showcase,
 * etc) — one step down from PageHeading's full route title, but the same
 * pixel typeface + a colored "▸" bullet (matching the one used in front of
 * each project list row) so every heading on the site reads as part of the
 * same system instead of mixing in the old 18px/600 sans-serif headings.
 */
export const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  color = "brand.textMuted",
  href,
  ...props
}) => (
  <Flex alignItems="center" justifyContent="space-between" mb={3} {...props}>
    <Flex alignItems="center" gap={2}>
      <Text
        as="span"
        className={pixelFont.className}
        fontSize="8px"
        color={color}
        aria-hidden="true"
      >
        {"\u25B8"}
      </Text>
      <Heading
        as="h2"
        className={pixelFont.className}
        fontSize={["10px", "11px"]}
        fontWeight="400"
        letterSpacing="0.06em"
        textTransform="uppercase"
        color="brand.text"
      >
        {title}
      </Heading>
    </Flex>
    {href && (
      <Text
        as="a"
        href={href}
        fontSize="12px"
        color="brand.textMuted"
        _hover={{ color: "brand.text" }}
        transition="0.12s ease all"
      >
        View all →
      </Text>
    )}
  </Flex>
);
