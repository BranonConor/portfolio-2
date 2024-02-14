"use client";

import { AspectRatio, Box, useColorModeValue } from "@chakra-ui/react";

interface IVideoProps {
  url: string;
}

const Video: React.FC<IVideoProps> = ({ url }) => {
  const shadow = useColorModeValue(
    "lg",
    "0px 4px 15px 0px rgba(226,175,255, 0.2)"
  );
  return (
    <Box
      width="100%"
      overflow="hidden"
      borderRadius={12}
      boxShadow={shadow}
      my={8}
    >
      <AspectRatio maxW="100%" ratio={2 / 1}>
        <iframe src={url} />
      </AspectRatio>
    </Box>
  );
};

export default Video;
