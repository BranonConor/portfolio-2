"use client";

import { Image, Text, Box } from "@chakra-ui/react";
import NextImage from "next/image";

type IContentImageProps = {
  image: string;
  caption?: string;
  alt?: string;
} & (
  | { width: number; height: number }
  | { width?: never; height?: never }
);

const ContentImage: React.FC<IContentImageProps> = ({
  image,
  caption,
  alt,
  width,
  height,
}) => {
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
        {width !== undefined && height !== undefined ? (
          <NextImage
            src={image}
            alt={alt ?? caption ?? ""}
            width={width}
            height={height}
            sizes="(max-width: 950px) calc(100vw - 64px), 900px"
            style={{ display: "block", width: "100%", height: "auto" }}
          />
        ) : (
          <Image
            src={image}
            objectFit="cover"
            minWidth="100%"
            alt={alt ?? caption ?? ""}
          />
        )}
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
