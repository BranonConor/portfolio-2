"use client";

import {
  Flex,
  Heading,
  Text,
  Image,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion, useMotionTemplate } from "framer-motion";
import Link from "next/link";
import { GradientArt } from "../GradientArt";
import { useTilt } from "@/lib/useTilt";

interface IPostCardProps {
  title: string;
  image?: string;
  link: string;
  category: string;
  date: string;
  useSecondaryButton?: boolean;
  buttonText?: string;
  useExternalLink?: boolean;
  hoverIcon?: string;
  hasPassword?: boolean;
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
  hasPassword = false,
}) => {
  const textColor = useColorModeValue("brand.lightBg", "brand.lightBg");

  // Damped cursor-following tilt + light-following sheen (P3).
  const tilt = useTilt({ max: 7 });
  const sheenBg = useMotionTemplate`radial-gradient(260px circle at ${tilt.sheen.x}% ${tilt.sheen.y}%, rgba(255,255,255,0.16), transparent 60%)`;

  return (
    <Box
      as={motion.div}
      width="100%"
      height="100%"
      style={tilt.style}
      {...tilt.handlers}
    >
      <Flex
        as={useExternalLink ? "a" : Link}
        aria-label={`${buttonText} - ${title}`}
        href={link}
        target={useExternalLink ? "_blank" : ""}
        rel="noreferrer noopener"
        flexDirection="column"
        alignItems="flex-start"
        justifyContent="flex-end"
        borderRadius={16}
        padding={4}
        position="relative"
        overflow="hidden"
        minHeight="300px"
        width="100%"
        height="100%"
        role="group"
        sx={{
          "& .pc-media": { transition: "0.4s ease all" },
        }}
        _hover={{
          "& .pc-media": { transform: "scale(1.06)" },
          "& .pc-icon": { opacity: 1, transform: "translateY(0) scale(1)" },
        }}
      >
        {/* Background: image if provided, otherwise generative gradient art (P4) */}
        {image ? (
          <Image
            className="pc-media"
            src={image}
            alt=""
            position="absolute"
            top={0}
            left={0}
            width="100%"
            height="100%"
            objectFit="cover"
            zIndex={0}
          />
        ) : (
          <Box className="pc-media" position="absolute" inset={0} zIndex={0}>
            <GradientArt seed={title} animate />
          </Box>
        )}

        {/* Legibility gradient */}
        <Image
          draggable="false"
          src="/blog/gradient-dark.svg"
          alt=""
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          objectFit="cover"
          zIndex={0}
        />

        {/* Light-following sheen (P3) */}
        <Box
          as={motion.div}
          aria-hidden="true"
          position="absolute"
          inset={0}
          zIndex={0}
          pointerEvents="none"
          style={{ background: sheenBg, opacity: tilt.sheen.opacity }}
        />

        {/* Hover emoji — keeps the playful brand touch */}
        <Text
          className="pc-icon"
          as="span"
          position="absolute"
          top={4}
          right={4}
          fontSize="24px"
          zIndex={2}
          opacity={0}
          transform="translateY(-6px) scale(0.8)"
          transition="0.25s ease all"
          pointerEvents="none"
        >
          {hoverIcon}
        </Text>

        <Flex
          flexDirection="column"
          alignItems="flex-start"
          justifyContent="flex-end"
          position="relative"
          zIndex={1}
          color={textColor}
          width="100%"
        >
          <Flex mb={3}>
            <Text
              as="span"
              display="inline-flex"
              alignItems="center"
              fontSize="12px"
              paddingY={1}
              paddingX={2}
              bg="brand.blue"
              borderRadius={120}
              mr={2}
            >
              {category}
            </Text>
            {hasPassword ? (
              <Text
                as="span"
                fontSize="12px"
                paddingY={1}
                paddingX={2}
                bg="brand.pink"
                borderRadius={120}
                display="inline-flex"
                alignItems="center"
              >
                🔓 Password Required
              </Text>
            ) : null}
          </Flex>
          <Heading as="h3" size="md" mb={1}>
            {title}
          </Heading>
          <Text as="span" fontSize="12px">
            {date}
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
};
