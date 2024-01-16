"use client";

import { Flex, Text } from "@chakra-ui/react";

interface IMetadataBarProps {
  date: string;
  category: string;
}

const MetdataBar: React.FC<IMetadataBarProps> = ({ date, category }) => {
  return (
    <Flex
      alignItems={["flex-start", "flex-start", "center"]}
      justifyContent={["flex-start", "flex-start", "center"]}
      flexDirection={["column", "column", "row"]}
      bg="brand.gradient"
      borderRadius={10}
      padding={4}
      width="100%"
      mt={4}
      mb={10}
    >
      <Flex alignItems="center" mb={[4, 4, 0]}>
        <Text color="white" as="span" mr={2}>
          Published:
        </Text>
        <Text
          as="span"
          mr={4}
          py={1}
          px={2}
          bg="black"
          color="white"
          borderRadius={16}
          fontWeight={700}
        >
          {date}
        </Text>
      </Flex>
      <Flex alignItems="center">
        <Text color="white" as="span" mr={2}>
          Category:
        </Text>
        <Text
          as="span"
          py={1}
          px={2}
          bg="black"
          color="white"
          borderRadius={16}
          fontWeight={700}
        >
          {category}
        </Text>
      </Flex>
    </Flex>
  );
};
export default MetdataBar;
