import {
  Box,
  Flex,
  Heading,
  Link,
  Text,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";
import { FancyHeading } from "./FancyHeading";
import { motion } from "framer-motion";

interface IShowcaseCardProps {
  title: string;
  role: string;
  description: string;
  link: string;
  codeLink?: string;
  icon?: string;
  tag?: string;
}

export const ShowcaseCard: React.FC<IShowcaseCardProps> = ({
  title,
  role,
  description,
  link,
  codeLink,
  icon,
  tag,
}) => {
  const bg = useColorModeValue("brand.lightBg", "brand.grey");
  const buttonGroupBg = useColorModeValue("brand.lightGrey", "brand.darkBg");
  const color = useColorModeValue("brand.darkBg", "brand.lightBg");
  const linkIcon = useColorModeValue(
    "/icons/link-dark.svg",
    "/icons/link-light.svg",
  );
  const codeIcon = useColorModeValue(
    "/icons/code-dark.svg",
    "/icons/code-light.svg",
  );

  return (
    <Flex
      padding={4}
      borderRadius={16}
      bg={bg}
      flexDirection="column"
      justifyContent="space-between"
      color={color}
      transition="0.15s ease all"
      _hover={{
        boxShadow: "lg",
        transform: "translateY(-4px)",
      }}
      position="relative"
      zIndex={1}
    >
      <Flex alignItems="center" gap={2} mb={2}>
        {icon && (
          <Box
            width="32px"
            height="32px"
            minWidth="32px"
            borderRadius="8px"
            border="1px solid"
            borderColor="brand.border"
            bg="rgba(255, 255, 255, 0.06)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            overflow="hidden"
          >
            <Image
              src={icon}
              alt={title}
              width="20px"
              height="20px"
              objectFit="contain"
              borderRadius="4px"
            />
          </Box>
        )}
        <Heading as="h4" size="md">
          {title}
        </Heading>
        {tag && (
          <Text
            as="span"
            fontSize="xs"
            fontWeight={700}
            bg="#22c55e"
            color="white"
            px={2}
            py={0.5}
            borderRadius="full"
            whiteSpace="nowrap"
            lineHeight="1.4"
          >
            {tag}
          </Text>
        )}
      </Flex>
      <FancyHeading size="sm" pl={2} borderLeft="2px solid" mb={4}>
        {role}
      </FancyHeading>
      <Text as="p" mb={6}>
        {description}
      </Text>
      <Flex bg={buttonGroupBg} borderRadius={16} overflow="hidden">
        <Link
          as={motion.a}
          width="50%"
          href={link}
          display="flex"
          justifyContent="center"
          cursor="pointer"
          padding={2}
          whileHover={{
            scale: !!link ? 1.2 : 1,
            opacity: !!link ? 0.75 : 0.4,
            transition: { duration: 0.05, type: "spring" },
          }}
          whileTap={{
            scale: 1.2,
            transition: { duration: 0.1 },
          }}
          opacity={!!link ? 1 : 0.45}
          pointerEvents={!!link ? "auto" : "none"}
        >
          <Image src={linkIcon} draggable="false" />
        </Link>
        <Link
          as={motion.a}
          cursor={!!codeLink ? "pointer" : "not-allowed"}
          width="50%"
          href={codeLink}
          display="flex"
          justifyContent="center"
          padding={2}
          whileHover={{
            scale: !!codeLink ? 1.2 : 1,
            opacity: !!codeLink ? 0.75 : 0.4,
            transition: { duration: 0.05, type: "spring" },
          }}
          whileTap={{
            scale: 1.2,
            transition: { duration: 0.1 },
          }}
          opacity={!!codeLink ? 1 : 0.45}
          pointerEvents={!!codeLink ? "auto" : "none"}
        >
          <Image src={codeIcon} draggable="false" />
        </Link>
      </Flex>
    </Flex>
  );
};
