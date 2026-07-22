"use client";

import { Image, Box } from "@chakra-ui/react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useRef } from "react";
import { dur, ease } from "@/lib/motion";

interface IHeaderImageProps {
  image: string;
}

const HeaderImage: React.FC<IHeaderImageProps> = ({ image }) => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // Gentle scroll parallax on the image (P9). Disabled under reduced-motion.
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  return (
    <Box
      ref={ref}
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
        transition: { duration: dur.base, ease: ease.out },
      }}
      exit={{ top: "-25%" }}
    >
      <motion.div
        style={
          reduce
            ? { position: "absolute", inset: 0, height: "100%" }
            : { position: "absolute", inset: 0, height: "120%", y: parallaxY }
        }
      >
        <Image
          src={image}
          alt=""
          objectFit="cover"
          objectPosition={["center", "center", "top center"]}
          width="100%"
          height="100%"
        />
      </motion.div>
    </Box>
  );
};
export default HeaderImage;
