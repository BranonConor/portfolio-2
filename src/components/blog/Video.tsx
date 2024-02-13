"use client";

import { AspectRatio } from "@chakra-ui/react";

interface IVideoProps {
  url: string;
}

const Video: React.FC<IVideoProps> = ({ url }) => {
  return (
    <AspectRatio maxW="560px" ratio={1}>
      <iframe title="SDSU Design Panel" src={url} allowFullScreen />
    </AspectRatio>
  );
};

export default Video;
