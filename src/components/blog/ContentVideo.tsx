"use client";

import {
  Image,
  Text,
  Box,
  useColorModeValue,
  AspectRatio,
} from "@chakra-ui/react";

interface ContentVideoProps {
  url: string;
  caption?: string;
}

const ContentVideo: React.FC<ContentVideoProps> = ({ url, caption }) => {
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
        <AspectRatio maxW="100%" ratio={2 / 1}>
          <video src={url} loop autoPlay />
        </AspectRatio>
      </Box>
      {caption && (
        <Text fontStyle="italic" mb={8} as="span" fontSize="12px">
          {caption}
        </Text>
      )}
    </>
  );
};

export default ContentVideo;
