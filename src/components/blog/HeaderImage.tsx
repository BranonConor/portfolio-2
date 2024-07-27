"use client";

import { Image, Box, useColorModeValue } from "@chakra-ui/react";

interface IHeaderImageProps {
  image: string;
}

const HeaderImage: React.FC<IHeaderImageProps> = ({ image }) => {
  const shadow = useColorModeValue(
    "lg",
    "0px 4px 15px 0px rgba(226,175,255, 0.2)"
  );
  return (
    <Box
      width="100%"
      position="relative"
      borderTopLeftRadius={16}
      borderTopRightRadius={16}
      mb={8}
      overflow="hidden"
      height={["170px", "200px", "250px", "300px"]}
      boxShadow={shadow}
    >
      <Image
        src={image}
        objectFit="cover"
        objectPosition={["center", "center", "top center"]}
        position="absolute"
        transform={[
          "translateY(0px)",
          "translateY(0px)",
          "translateY(0px)",
          "translateY(-200px)",
        ]}
      />
    </Box>
  );
};
export default HeaderImage;
