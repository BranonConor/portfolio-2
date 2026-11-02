"use client";

import { AspectRatio, Box } from "@chakra-ui/react";

interface IVideoProps {
  url: string;
  title: string;
  portrait?: boolean;
}

const Video: React.FC<IVideoProps> = ({ url, title, portrait = false }) => {
  return (
    <Box
      width="100%"
      overflow="hidden"
      borderRadius="10px"
      border="1px solid"
      borderColor="brand.border"
      my={8}
      mx={portrait ? "auto" : [4, 5, 6]}
      maxWidth={
        portrait
          ? "min(320px, calc(100% - 32px))"
          : ["calc(100% - 32px)", "calc(100% - 40px)", "calc(100% - 48px)"]
      }
    >
      <AspectRatio maxW="100%" ratio={portrait ? 9 / 16 : 2 / 1}>
        <iframe
          src={url}
          title={title}
          loading={portrait ? "lazy" : undefined}
          allow={
            portrait
              ? "accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              : "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          }
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </AspectRatio>
    </Box>
  );
};

export default Video;
