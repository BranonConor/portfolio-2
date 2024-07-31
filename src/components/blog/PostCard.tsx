import {
  Flex,
  Heading,
  Text,
  Image,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";

interface IPostCardProps {
  title: string;
  image: string;
  link: string;
  category: string;
  date: string;
  useSecondaryButton?: boolean;
  buttonText?: string;
  useExternalLink?: boolean;
  hoverIcon?: string;
}

export const PostCard: React.FC<IPostCardProps> = ({
  title,
  image,
  link,
  category,
  date,
  useExternalLink = false,
  buttonText = "Read more",
  hoverIcon = "👀",
}) => {
  const bg = useColorModeValue("brand.lightBg", "brand.grey");
  const textColor = useColorModeValue("brand.lightBg", "brand.lightBg");
  const [yRotationValue, setYRotationValue] = useState<number>(0);
  const [xRotationValue, setXRotationValue] = useState<number>(0);
  const boundingRef = useRef<DOMRect | null>(null);

  return (
    <Flex
      as={useExternalLink ? "a" : Link}
      aria-label={`${buttonText} - ${title}`}
      href={link}
      target={useExternalLink ? "_blank" : ""}
      rel="noreferrer noopenner"
      flexDirection="column"
      alignItems="flex-start"
      justifyContent="flex-start"
      bg={bg}
      borderRadius={16}
      padding={4}
      position="relative"
      overflow="hidden"
      boxShadow="lg"
      minHeight="300px"
      _hover={{
        "@media only screen and (min-width: 450px)": {
          img: {
            "&:first-of-type": {
              transform: `scale(1.2) translateX(${xRotationValue}px) translateY(${yRotationValue}px) rotateX(${
                xRotationValue * 1.5
              }deg) rotateY(${yRotationValue * 1.5}deg)`,
              transition: "0.4 ease all",
              filter: "blur(3px)",
            },
            "&:last-of-type": {
              transform: "translateX(-70%) scale(3)",
            },
          },
          p: {
            bottom: "42%",
            opacity: 1,
            transform: `scale(5) translateX(${xRotationValue}px) translateY(${yRotationValue}px) rotateX(${
              xRotationValue * 1.5
            }deg) rotateY(${yRotationValue * 1.5}deg)`,
            transition: "0.25 ease all",
          },
        },
      }}
      onMouseLeave={() => (boundingRef.current = null)}
      onMouseEnter={(ev: any) => {
        boundingRef.current = ev.currentTarget.getBoundingClientRect();
      }}
      onMouseMove={(ev: any) => {
        if (!boundingRef.current) return;
        const x = ev.clientX - boundingRef.current.left;
        const y = ev.clientY - boundingRef.current.top;
        const xPercentage = x / boundingRef.current.width;
        const yPercentage = y / boundingRef.current.height;
        const xRotation = (xPercentage - 0.5) * 20;
        const yRotation = (0.5 - yPercentage) * -20;

        setYRotationValue(yRotation);
        setXRotationValue(xRotation);
      }}
    >
      <Text
        as="p"
        zIndex={5}
        position="absolute"
        bottom="-25%"
        right="48%"
        transition="0.2s ease all"
        opacity={0}
      >
        {hoverIcon}
      </Text>
      <Image
        as={motion.img}
        src={image}
        position="absolute"
        top={0}
        left={0}
        width="100%"
        height="100%"
        objectFit="cover"
        zIndex={0}
        transition="0.15s ease all"
      />
      <Image
        draggable="false"
        src="/blog/gradient-dark.svg"
        position="absolute"
        top={0}
        left={0}
        width="100%"
        height="100%"
        objectFit="cover"
        zIndex={0}
        transition="0.45s ease all"
      />
      <Flex
        flexDirection="column"
        alignItems="flex-start"
        justifyContent="space-between"
        position="relative"
        zIndex={1}
        color={textColor}
        height="100%"
      >
        <Box>
          <Text
            as="span"
            fontSize="12px"
            paddingY={1}
            paddingX={2}
            bg="brand.blue"
            borderRadius={120}
          >
            {category}
          </Text>
          <Heading as="h3" size="md" mt={3} mb={1}>
            {title}
          </Heading>
          <Text as="span" fontSize="12px">
            {date}
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
};
