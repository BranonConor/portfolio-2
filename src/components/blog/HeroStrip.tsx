import { Flex, Heading } from "@chakra-ui/react";
import React from "react";
import HeaderImage from "./HeaderImage";
import MetadataBar from "./MetadataBar";

interface HeroStripProps {
  image: string;
  title: string;
  subtitle: string;
  date: string;
  category: string;
}

const HeroStrip: React.FC<HeroStripProps> = ({
  image,
  title,
  subtitle,
  date,
  category,
}) => {
  return (
    <Flex
      width="100%"
      flexDirection="column"
      bg="brand.gradient"
      borderRadius={16}
      overflow="hidden"
    >
      <HeaderImage image={image} />
      <Heading as="h1" size="xl" mt={[1, 2, 3]} color="white" mx={4}>
        {title}
      </Heading>
      <Heading
        as="h2"
        size="md"
        pl={2}
        borderLeft="2px solid"
        mt={4}
        color="white"
        mx={4}
      >
        {subtitle}
      </Heading>
      <MetadataBar date={date} category={category} />
    </Flex>
  );
};

export default HeroStrip;
