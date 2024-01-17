import { Box, useColorModeValue } from "@chakra-ui/react";
import React from "react";
interface ISpotifyCardProps {
  trackId: string;
}
export const SpotifyCard: React.FC<ISpotifyCardProps> = ({ trackId }) => {
  const shadow = useColorModeValue(
    "lg",
    "0px 4px 15px 0px rgba(226,175,255, 0.10)"
  );
  const borderColor = useColorModeValue("brand.lightBg", "brand.darkBg");

  return (
    <Box
      width="100%"
      as="iframe"
      title="spotify"
      src={`https://open.spotify.com/embed/album/${trackId}`}
      height="600px"
      allowFullScreen
      allow="encrypted-media"
      borderRadius={16}
      boxShadow={shadow}
      borderColor={borderColor}
    />
  );
};
