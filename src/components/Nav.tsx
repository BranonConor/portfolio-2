"use client";

import { Flex, Text, Box, Image } from "@chakra-ui/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Engagements", href: "/engagements" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
];

export const Nav = () => {
  const pathname = usePathname();

  return (
    <Flex
      as="nav"
      display={["none", "none", "flex"]}
      position="fixed"
      top={4}
      left="50%"
      transform="translateX(-50%)"
      zIndex={100}
      alignItems="center"
      justifyContent="center"
      gap={1}
      bg="rgba(20, 20, 22, 0.6)"
      backdropFilter="blur(16px)"
      border="1px solid"
      borderColor="brand.border"
      borderRadius="14px"
      paddingX={2}
      paddingY={2}
      overflow="visible"
    >
      <Box
        as={Link}
        href="/"
        position="relative"
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="36px"
        height="36px"
        mr={1}
        overflow="visible"
        flexShrink={0}
        _hover={{ opacity: 0.8 }}
        transition="0.15s ease all"
      >
        <Image
          src="/s0.png"
          alt="Branon Eusebio"
          position="absolute"
          top="50%"
          left="50%"
          style={{
            width: "76px",
            height: "76px",
            transform: "translate(-50%, -50%)",
          }}
          objectFit="contain"
          pointerEvents="none"
          maxWidth="none"
        />
      </Box>
      {navItems.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/" && pathname.startsWith(item.href));
        return (
          <Box
            key={item.href}
            as={motion.div}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Text
              as={Link}
              href={item.href}
              fontSize="13px"
              fontWeight={isActive ? "500" : "400"}
              color={isActive ? "brand.text" : "brand.textMuted"}
              bg={isActive ? "brand.surface" : "transparent"}
              paddingX={3}
              paddingY={1.5}
              borderRadius="10px"
              transition="0.15s ease all"
              _hover={{
                color: "brand.text",
                bg: "brand.surface",
              }}
            >
              {item.label}
            </Text>
          </Box>
        );
      })}
    </Flex>
  );
};
