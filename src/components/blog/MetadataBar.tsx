"use client";

import { Flex, Text } from "@chakra-ui/react";

interface IMetadataBarProps {
  date: string;
  category: string;
}

const MetadataBar: React.FC<IMetadataBarProps> = ({ date, category }) => {
  return (
    <Flex
      alignItems={["flex-start", "flex-start", "center"]}
      justifyContent={"flex-start"}
      flexDirection={["column", "column", "row"]}
      py={4}
      width="100%"
      mt={4}
      mb={[2, 2, 4]}

      gap={2}
    >
      <Text
        as="span"
        fontSize="12px"
        py={1}
        px={3}
        bg="brand.bg"
        color="brand.textMuted"
        borderRadius="8px"
        border="1px solid"
        borderColor="brand.border"
      >
        {date}
      </Text>
      <Text
        as="span"
        fontSize="12px"
        py={1}
        px={3}
        bg="brand.bg"
        color="brand.textMuted"
        borderRadius="8px"
        border="1px solid"
        borderColor="brand.border"
      >
        {category}
      </Text>
    </Flex>
  );
};
export default MetadataBar;
