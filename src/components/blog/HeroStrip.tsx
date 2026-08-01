import { Box } from "@chakra-ui/react";
import React from "react";
import MetadataBar from "./MetadataBar";
import { PageHeading } from "../PageHeading";

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
    <Box
      width="100%"
      px={[4, 5, 6]}
      pt={[4, 5, 6]}
      pb={2}
      borderBottom="2px solid"
      borderBottomColor="brand.border"
    >
      <PageHeading title={title} subtitle={subtitle} />
      <MetadataBar date={date} category={category} />
    </Box>
  );
};

export default HeroStrip;
