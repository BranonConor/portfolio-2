import {
  Image,
  UnorderedList,
  ListItem,
  Flex,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import Link from "next/link";

export const MobileNav = () => {
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
  const shadow = useColorModeValue(
    "lg",
    "0px 4px 15px 0px rgba(226,175,255, 0.10)"
  );
  const border = useColorModeValue("2px solid", "0px solid");
  const borderColor = useColorModeValue("brand.lightGrey", "none");
  const itemShadow = useColorModeValue(
    "0px 4px 15px 0px rgba(0,0,0, 0.2)",
    "0px 4px 15px 0px rgba(226,175,255, 0.2)"
  );

  return (
    <Flex
      display={["block", "block", "none"]}
      as="nav"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      height="64px"
      position="fixed"
      left={0}
      bottom={0}
      zIndex={10}
      width="100%"
      bg={bg}
      boxShadow={shadow}
      borderTop={border}
      borderTopColor={borderColor}
      overflow="hidden"
    >
      <UnorderedList
        display="flex"
        alignItems="center"
        width="100%"
        margin={0}
        height="100%"
      >
        <ListItem
          borderRadius="10px"
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
            <Image src={homeIcon} width={6} height={6} boxSizing="border-box" />
          </Box>
        </ListItem>
        <ListItem
          borderRadius="10px"
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
              src={aboutIcon}
              width={6}
              height={6}
              boxSizing="border-box"
            />
          </Box>
        </ListItem>
        <ListItem
          borderRadius="10px"
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
              src={projectsIcon}
              width={6}
              height={6}
              boxSizing="border-box"
            />
          </Box>
        </ListItem>
        <ListItem
          borderRadius="10px"
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
              src={engagementsIcon}
              width={6}
              height={6}
              boxSizing="border-box"
            />
          </Box>
        </ListItem>
        <ListItem
          borderRadius="10px"
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
            <Image src={blogIcon} width={6} height={6} boxSizing="border-box" />
          </Box>
        </ListItem>
      </UnorderedList>
    </Flex>
  );
};
