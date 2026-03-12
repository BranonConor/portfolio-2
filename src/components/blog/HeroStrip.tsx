import { Box, Flex, Heading } from "@chakra-ui/react";
import React from "react";
import MetadataBar from "./MetadataBar";
import { PaintStroke } from "../PaintStroke";

interface HeroStripProps {
  title: string;
  subtitle: string;
  date: string;
  category: string;
  image?: string; // kept for backwards compat, no longer rendered
}

const HeroStrip: React.FC<HeroStripProps> = ({
  title,
  subtitle,
  date,
  category,
}) => {
  return (
    <Flex
      width="100%"
      flexDirection="column"
      position="relative"
    >
      {/* Paint stroke header area */}
      <Box
        position="relative"
        width="100%"
        height={["100px", "120px", "140px"]}
        overflow="hidden"
        borderBottom="1px solid"
        borderBottomColor="brand.border"
      >
        <PaintStroke
          variant={2}
          top="-40px"
          left="-60px"
          width={["200px", "260px", "320px"]}
          opacity={0.35}
        />
        <PaintStroke
          variant={4}
          top="-20px"
          right="-40px"
          width={["180px", "220px", "280px"]}
          opacity={0.25}
        />
        <PaintStroke
          variant={1}
          bottom="-50px"
          left="30%"
          width={["160px", "200px", "240px"]}
          opacity={0.2}
          rotate={-15}
        />
      </Box>
      <Heading as="h1" size="xl" mt={[3, 4, 5]} color="brand.text" px={[4, 5, 6]}>
        {title}
      </Heading>
      <Heading
        as="h2"
        size="md"
        pl={2}
        borderLeft="2px solid"
        borderLeftColor="brand.border"
        mt={4}
        color="brand.textMuted"
        mx={[4, 5, 6]}
        fontWeight="400"
      >
        {subtitle}
      </Heading>
      <Box px={[4, 5, 6]}>
        <MetadataBar date={date} category={category} />
      </Box>
    </Flex>
  );
};

export default HeroStrip;
