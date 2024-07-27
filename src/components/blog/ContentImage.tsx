"use client";

import { Image, Text, Box, useColorModeValue } from "@chakra-ui/react";

interface IContentImageProps {
  image: string;
  caption?: string;
}

const ContentImage: React.FC<IContentImageProps> = ({ image, caption }) => {
  const shadow = useColorModeValue(
    "lg",
    "0px 4px 15px 0px rgba(226,175,255, 0.2)"
  );
  return (
    <>
      <Box
        width="100%"
        position="relative"
        borderRadius={16}
        mt={8}
        mb={4}
        overflow="hidden"
        boxShadow={shadow}
      >
        <Image src={image} objectFit="cover" minWidth="100%" alt={caption} />
      </Box>
      {caption && (
        <Text fontStyle="italic" mb={8} as="span" fontSize="12px">
          {caption}
        </Text>
      )}
    </>
  );
};
export default ContentImage;
