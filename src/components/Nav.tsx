import {
  Image,
  UnorderedList,
  ListItem,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
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

  return (
    <Flex
      as="nav"
      alignItems="flex-start"
      justifyContent="flex-start"
      flexDirection="column"
      height="100%"
      position="fixed"
      left="0"
      top="0"
      width={16}
      bg={bg}
      boxShadow={shadow}
      borderRight={border}
      borderRightColor={borderColor}
      overflow="hidden"
    >
      <Flex
        width="100%"
        alignItems="center"
        justifyContent="center"
        bg={brandBg}
        boxShadow={shadow}
        mb={8}
      >
        <Image src={logo} width="42px" marginY={4} />
      </Flex>
      <UnorderedList
        display="flex"
        flexDirection="column"
        alignItems="center"
        width="100%"
        margin={0}
      >
        <ListItem
          listStyleType="none"
          height={12}
          display="flex"
          alignItems="center"
        >
          <Link href="/">
            <Image src={homeIcon} width={6} height={6} boxSizing="border-box" />
          </Link>
        </ListItem>
        <ListItem
          listStyleType="none"
          height={12}
          display="flex"
          alignItems="center"
        >
          <Link href="/about">
            <Image
              src={aboutIcon}
              width={6}
              height={6}
              boxSizing="border-box"
            />
          </Link>
        </ListItem>
        <ListItem
          listStyleType="none"
          height={12}
          display="flex"
          alignItems="center"
        >
          <Link href="/projects">
            <Image
              src={projectsIcon}
              width={6}
              height={6}
              boxSizing="border-box"
            />
          </Link>
        </ListItem>
        <ListItem
          listStyleType="none"
          height={12}
          display="flex"
          alignItems="center"
        >
          <Link href="/blog">
            <Image src={blogIcon} width={6} height={6} boxSizing="border-box" />
          </Link>
        </ListItem>
      </UnorderedList>
    </Flex>
  );
};
