"use client";

import { Image, Box } from "@chakra-ui/react";
import { motion } from "framer-motion";

interface IHeaderImageProps {
  image: string;
}

const HeaderImage: React.FC<IHeaderImageProps> = ({ image }) => {
  return (
    <Box
      as={motion.div}
      width="100%"
      position="relative"
      borderTopLeftRadius={16}
      borderTopRightRadius={16}
      mb={8}
      overflow="hidden"
      height={["170px", "200px", "250px", "300px"]}
      border="1px solid"
      borderColor="brand.border"
      initial={{ top: "-25%", scale: 1.1 }}
      animate={{
        top: 0,
        scale: 1,
        transition: { duration: 0.2, type: "intertia" },
      }}
      exit={{ top: "-25%" }}
    >
      <Image
        as={motion.img}
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
        initial={{ top: "-15%" }}
        animate={{
          top: 0,
          transition: { duration: 0.35, type: "tween" },
        }}
        exit={{ top: "-15%" }}
      />
    </Box>
  );
};
export default HeaderImage;
