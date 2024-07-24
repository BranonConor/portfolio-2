import {
  Flex,
  Heading,
  Text,
  Button,
  Image,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";

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
        img: {
          "&:first-of-type": {
            transform: "scale(1.1)",
            filter: "blur(12px)",
          },
          "&:last-of-type": {
            transform: "translateX(-70%) scale(3)",
          },
        },
        p: {
          bottom: "45%",
          opacity: 1,
        },
      }}
    >
      <Text
        as="p"
        zIndex={5}
        position="absolute"
        bottom="-25%"
        right="50%"
        transition="0.2s ease all"
        transform="scale(5)"
        opacity={0}
      >
        {hoverIcon}
      </Text>
      <Image
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
