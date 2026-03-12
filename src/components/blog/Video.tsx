"use client";

import { AspectRatio, Box } from "@chakra-ui/react";

interface IVideoProps {
  url: string;
}

const Video: React.FC<IVideoProps> = ({ url }) => {
  return (
    <Box
      width="100%"
      overflow="hidden"
      borderRadius={12}
      border="1px solid"
      borderColor="brand.border"
      my={8}
      mx={[4, 5, 6]}
      maxWidth={["calc(100% - 32px)", "calc(100% - 40px)", "calc(100% - 48px)"]}
    >
      <AspectRatio maxW="100%" ratio={2 / 1}>
        <iframe src={url} />
      </AspectRatio>
    </Box>
  );
};

export default Video;
