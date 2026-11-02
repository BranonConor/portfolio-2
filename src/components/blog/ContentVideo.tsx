"use client";

import { useEffect, useRef, useState } from "react";
import { Image, Text, Box, AspectRatio } from "@chakra-ui/react";

interface ContentVideoProps {
  url: string;
  caption?: string;
  description?: string;
  aspectRatio?: number;
}

const ContentVideo: React.FC<ContentVideoProps> = ({
  url,
  caption,
  description,
  aspectRatio = 2 / 1,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setShowControls(false);
    let active = true;
    video.play().catch(() => {
      if (active) setShowControls(true);
    });

    return () => {
      active = false;
    };
  }, [url]);

  return (
    <Box px={[4, 5, 6]}>
      <Box
        width="100%"
        position="relative"
        borderRadius="10px"
        mt={8}
        mb={caption ? 2 : 4}
        overflow="hidden"
        border="1px solid"
        borderColor="brand.border"
      >
        <AspectRatio maxW="100%" ratio={aspectRatio}>
          <video
            src={url}
            aria-label={description}
            loop
            autoPlay
            muted
            // Strip audio tracks entirely so there's no way for a user to
            // re-enable sound (e.g. via devtools toggling `muted`).
            ref={(el) => {
              videoRef.current = el;
              if (el) {
                el.muted = true;
                el.volume = 0;
                // @ts-expect-error - non-standard but supported on most engines
                if (typeof el.audioTracks !== "undefined") {
                  // @ts-expect-error
                  for (let i = 0; i < el.audioTracks.length; i++) {
                    // @ts-expect-error
                    el.audioTracks[i].enabled = false;
                  }
                }
              }
            }}
            controls={showControls}
            controlsList="nodownload nofullscreen noremoteplayback"
            disablePictureInPicture
            disableRemotePlayback
            playsInline
            webkit-playsinline="true"
            width="100%"
          />
        </AspectRatio>
      </Box>
      {caption && (
        <Text
          fontStyle="italic"
          mb={4}
          as="span"
          fontSize="12px"
          color="brand.textMuted"
        >
          {caption}
        </Text>
      )}
    </Box>
  );
};

export default ContentVideo;
