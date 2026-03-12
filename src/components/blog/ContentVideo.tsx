"use client";

import { Image, Text, Box, AspectRatio } from "@chakra-ui/react";

interface ContentVideoProps {
  url: string;
  caption?: string;
}

const ContentVideo: React.FC<ContentVideoProps> = ({ url, caption }) => {
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
        <AspectRatio maxW="100%" ratio={2 / 1}>
          <video
            src={url}
            loop
            autoPlay
            controlsList="nodownload"
            playsInline
            webkit-playsinline="true"
            width="100%"
          />
        </AspectRatio>
      </Box>
      {caption && (
        <Text fontStyle="italic" mb={4} as="span" fontSize="12px" color="brand.textMuted">
          {caption}
        </Text>
      )}
    </Box>
  );
};

export default ContentVideo;
