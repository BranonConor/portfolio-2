import {
  Image,
  UnorderedList,
  ListItem,
  Flex,
  Box,
  useColorModeValue,
  Tooltip,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import Link from "next/link";

export const Nav = () => {
  const homeIcon = useColorModeValue(
    "/icons/home-dark.svg",
    "/icons/home-light.svg"
  );
  const aboutIcon = useColorModeValue(
    "/icons/user-dark.svg",
    "/icons/user-light.svg"
  );
  const projectsIcon = useColorModeValue(
    "/icons/projects-dark.svg",
    "/icons/projects-light.svg"
  );
  const engagementsIcon = useColorModeValue(
    "/icons/engagements-dark.svg",
    "/icons/engagements-light.svg"
  );
  const blogIcon = useColorModeValue(
    "/icons/blog-dark.svg",
    "/icons/blog-light.svg"
  );
  const bg = useColorModeValue("brand.lightBg", "brand.darkBg");
  const brandBg = useColorModeValue("brand.lightGrey", "black");
  const shadow = useColorModeValue(
    "lg",
    "0px 4px 15px 0px rgba(226,175,255, 0.10)"
  );
  const border = useColorModeValue("2px solid", "0px solid");
  const borderColor = useColorModeValue("brand.lightGrey", "none");
  const logo = useColorModeValue("/logo-dark.svg", "/logo-light.svg");
  const itemShadow = useColorModeValue(
    "0px 4px 15px 0px rgba(0,0,0, 0.2)",
    "0px 4px 15px 0px rgba(226,175,255, 0.2)"
  );
  const tooltipBg = useColorModeValue("brand.gradient", "brand.gradient");
  const tooltipText = useColorModeValue("white", "white");

  return (
    <Flex
      display={["none", "none", "block"]}
      as="nav"
      alignItems="flex-start"
      justifyContent="flex-start"
      flexDirection="column"
      height="100%"
      position="fixed"
      left="0"
      top="0"
      zIndex={10}
      width={16}
      bg={bg}
      boxShadow={shadow}
      borderRight={border}
      borderRightColor={borderColor}
      overflow="hidden"
    >
      <Flex
        display="flex"
        width="100%"
        alignItems="center"
        justifyContent="center"
        bg={brandBg}
        boxShadow={shadow}
        mb={8}
      >
        <Image draggable="false" src={logo} width="42px" marginY={4} />
      </Flex>
      <UnorderedList
        display="flex"
        flexDirection="column"
        alignItems="center"
        width="100%"
        margin={0}
      >
        <Tooltip
          borderRadius={6}
          label="Home"
          fontSize="md"
          placement="right"
          bg={tooltipBg}
          color={tooltipText}
          fontWeight="bold"
          gutter={16}
        >
          <ListItem
            borderRadius="10px"
            marginY={1}
            as={motion.li}
            listStyleType="none"
            height={12}
            cursor="pointer"
            width="70%"
            whileHover={{
              scale: 1.1,
              transition: { duration: 0.05, type: "spring" },
              boxShadow: itemShadow,
            }}
            whileTap={{
              scale: 1.2,
              transition: { duration: 0.1 },
            }}
          >
            <Box
              as={Link}
              href="/"
              width="100%"
              height="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Image
                draggable="false"
                src={homeIcon}
                width={6}
                height={6}
                boxSizing="border-box"
              />
            </Box>
          </ListItem>
        </Tooltip>
        <Tooltip
          display={["none", "none", "block"]}
          borderRadius={6}
          label="About"
          fontSize="md"
          placement="right"
          bg={tooltipBg}
          color={tooltipText}
          fontWeight="bold"
          gutter={16}
        >
          <ListItem
            borderRadius="10px"
            marginY={1}
            as={motion.li}
            listStyleType="none"
            height={12}
            cursor="pointer"
            width="70%"
            whileHover={{
              scale: 1.1,
              transition: { duration: 0.05, type: "spring" },
              boxShadow: itemShadow,
            }}
            whileTap={{
              scale: 1.2,
              transition: { duration: 0.1 },
            }}
          >
            <Box
              as={Link}
              href="/about"
              width="100%"
              height="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Image
                draggable="false"
                src={aboutIcon}
                width={6}
                height={6}
                boxSizing="border-box"
              />
            </Box>
          </ListItem>
        </Tooltip>
        <Tooltip
          display={["none", "none", "block"]}
          borderRadius={6}
          label="Projects"
          fontSize="md"
          placement="right"
          bg={tooltipBg}
          color={tooltipText}
          fontWeight="bold"
          gutter={16}
        >
          <ListItem
            borderRadius="10px"
            marginY={1}
            as={motion.li}
            listStyleType="none"
            height={12}
            cursor="pointer"
            width="70%"
            whileHover={{
              scale: 1.1,
              transition: { duration: 0.05, type: "spring" },
              boxShadow: itemShadow,
            }}
            whileTap={{
              scale: 1.2,
              transition: { duration: 0.1 },
            }}
          >
            <Box
              as={Link}
              href="/projects"
              width="100%"
              height="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Image
                draggable="false"
                src={projectsIcon}
                width={6}
                height={6}
                boxSizing="border-box"
              />
            </Box>
          </ListItem>
        </Tooltip>
        <Tooltip
          display={["none", "none", "block"]}
          borderRadius={6}
          label="Engagements"
          fontSize="md"
          placement="right"
          bg={tooltipBg}
          color={tooltipText}
          fontWeight="bold"
          gutter={16}
        >
          <ListItem
            borderRadius="10px"
            marginY={1}
            as={motion.li}
            listStyleType="none"
            height={12}
            cursor="pointer"
            width="70%"
            whileHover={{
              scale: 1.1,
              transition: { duration: 0.05, type: "spring" },
              boxShadow: itemShadow,
            }}
            whileTap={{
              scale: 1.2,
              transition: { duration: 0.1 },
            }}
          >
            <Box
              as={Link}
              href="/engagements"
              width="100%"
              height="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Image
                draggable="false"
                src={engagementsIcon}
                width={6}
                height={6}
                boxSizing="border-box"
              />
            </Box>
          </ListItem>
        </Tooltip>
        <Tooltip
          display={["none", "none", "block"]}
          borderRadius={6}
          label="Blog"
          fontSize="md"
          placement="right"
          bg={tooltipBg}
          color={tooltipText}
          fontWeight="bold"
          gutter={16}
        >
          <ListItem
            borderRadius="10px"
            marginY={1}
            as={motion.li}
            listStyleType="none"
            height={12}
            cursor="pointer"
            width="70%"
            whileHover={{
              scale: 1.1,
              transition: { duration: 0.05, type: "spring" },
              boxShadow: itemShadow,
            }}
            whileTap={{
              scale: 1.2,
              transition: { duration: 0.1 },
            }}
          >
            <Box
              as={Link}
              href="/blog"
              width="100%"
              height="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Image
                draggable="false"
                src={blogIcon}
                width={6}
                height={6}
                boxSizing="border-box"
              />
            </Box>
          </ListItem>
        </Tooltip>
      </UnorderedList>
    </Flex>
  );
};
