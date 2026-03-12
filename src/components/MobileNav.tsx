"use client";

import { Flex, Text, Box, Image } from "@chakra-ui/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/projects" },
  { label: "Events", href: "/engagements" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
];

export const MobileNav = () => {
  const pathname = usePathname();

  return (
    <Flex
      as="nav"
      display={["flex", "flex", "none"]}
      position="fixed"
      bottom={3}
      left="50%"
      transform="translateX(-50%)"
      zIndex={100}
      alignItems="center"
      justifyContent="center"
      gap={0}
      bg="rgba(20, 20, 22, 0.6)"
      backdropFilter="blur(16px)"
      border="1px solid"
      borderColor="brand.border"
      borderRadius="14px"
      paddingX={1}
      paddingY={1.5}
      width="auto"
      maxWidth="95vw"
    >
      {navItems.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/" && pathname.startsWith(item.href));
        return (
          <Box key={item.href} as={motion.div} whileTap={{ scale: 0.95 }}>
            <Text
              as={Link}
              href={item.href}
              fontSize="12px"
              fontWeight={isActive ? "500" : "400"}
              color={isActive ? "brand.text" : "brand.textMuted"}
              bg={isActive ? "brand.surface" : "transparent"}
              paddingX={3}
              paddingY={1.5}
              borderRadius="10px"
              transition="0.15s ease all"
              whiteSpace="nowrap"
            >
              {item.label}
            </Text>
          </Box>
        );
      })}
    </Flex>
  );
};
