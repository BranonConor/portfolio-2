"use client";

import { Image, Text, Box } from "@chakra-ui/react";

interface IContentImageProps {
  image: string;
  caption?: string;
}

const ContentImage: React.FC<IContentImageProps> = ({ image, caption }) => {
  return (
    <Box px={[4, 5, 6]}>
      <Box
        width="100%"
        position="relative"
        borderRadius={16}
        mt={8}
        mb={caption ? 2 : 4}
        overflow="hidden"
        border="1px solid"
        borderColor="brand.border"
      >
        <Image src={image} objectFit="cover" minWidth="100%" alt={caption} />
      </Box>
      {caption && (
        <Text fontStyle="italic" mb={4} as="span" fontSize="12px" color="brand.textMuted">
          {caption}
        </Text>
      )}
    </Box>
  );
};
export default ContentImage;
