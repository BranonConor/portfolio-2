"use client";

import { Flex, Text, Box, Image } from "@chakra-ui/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

type IconProps = { color: string };

const HomeIcon = ({ color }: IconProps) => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M3 11l9-8 9 8v9a2 2 0 01-2 2h-4v-7h-6v7H5a2 2 0 01-2-2v-9z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SparkleIcon = ({ color }: IconProps) => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M12 3l1.8 5.4L19.2 10.2 13.8 12l-1.8 5.4L10.2 12 4.8 10.2 10.2 8.4 12 3z"
      fill={color}
    />
    <path
      d="M19 14l.9 2.7L22.6 17.6 19.9 18.5 19 21.2 18.1 18.5 15.4 17.6 18.1 16.7 19 14z"
      fill={color}
    />
  </svg>
);

const UsersIcon = ({ color }: IconProps) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <circle cx="9" cy="8" r="3.2" stroke={color} strokeWidth="1.8" />
    <circle cx="17" cy="9.5" r="2.4" stroke={color} strokeWidth="1.8" />
    <path
      d="M3 19c0-2.8 2.7-5 6-5s6 2.2 6 5"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M15 14.5c2.8 0 6 1.6 6 4.5"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const PencilIcon = ({ color }: IconProps) => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M4 20h4l10-10-4-4L4 16v4z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 6l4 4"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const InfoIcon = ({ color }: IconProps) => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
    <path d="M12 11v5" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="8" r="1.1" fill={color} />
  </svg>
);

const navItems: {
  label: string;
  href: string;
  color: string;
  Icon: (p: IconProps) => JSX.Element;
}[] = [
  { label: "Home", href: "/", color: "#a78bfa", Icon: HomeIcon },
  { label: "Projects", href: "/projects", color: "#da70d6", Icon: SparkleIcon },
  {
    label: "Engagements",
    href: "/engagements",
    color: "#22c55e",
    Icon: UsersIcon,
  },
  { label: "Blog", href: "/blog", color: "#61dafb", Icon: PencilIcon },
  { label: "About", href: "/about", color: "#f05032", Icon: InfoIcon },
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
        width="18px"
        height="18px"
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
            width: "38px",
            height: "38px",
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
        const iconColor = isActive ? item.color : "#a1a1aa";
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
              display="flex"
              alignItems="center"
              gap={1.5}
              fontSize="13px"
              fontWeight={isActive ? "500" : "400"}
              color={isActive ? item.color : "brand.textMuted"}
              bg={isActive ? `${item.color}18` : "transparent"}
              border="1px solid"
              borderColor={isActive ? `${item.color}40` : "transparent"}
              paddingX={3}
              paddingY={1.5}
              borderRadius="10px"
              transition="0.15s ease all"
              sx={{
                "&:hover svg path, &:hover svg circle": {
                  stroke: item.color,
                },
                "&:hover svg [fill]": {
                  fill: item.color,
                },
              }}
              _hover={{
                color: item.color,
                bg: `${item.color}18`,
                borderColor: `${item.color}40`,
              }}
            >
              <item.Icon color={iconColor} />
              {item.label}
            </Text>
          </Box>
        );
      })}
    </Flex>
  );
};
