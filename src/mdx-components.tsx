import {
  Box,
  Heading,
  Text,
  OrderedList,
  UnorderedList,
  Link,
} from "@chakra-ui/react";
import type { MDXComponents } from "mdx/types";
import Image, { ImageProps } from "next/image";
import { FancyHeading } from "./components/FancyHeading";
import { pixelFont } from "./components/boot-intro/pixelFont";
import { proseFont } from "./components/proseFont";

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including inline styles,
// components from other libraries, and more.

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <Heading
        as="h2"
        className={pixelFont.className}
        fontSize={["15px", "18px"]}
        fontWeight="400"
        letterSpacing="0.02em"
        lineHeight="1.5"
        mt={8}
        color="brand.text"
        px={[4, 5, 6]}
      >
        {children}
      </Heading>
    ),
    h2: ({ children }) => (
      <FancyHeading
        as="h3"
        fontSize={["13px", "15px"]}
        pl={2}
        borderLeft="2px solid"
        borderLeftColor="brand.border"
        mt={8}
        mx={[4, 5, 6]}
        color="brand.text"
      >
        {children}
      </FancyHeading>
    ),
    h3: ({ children }) => (
      <Heading
        as="h4"
        className={pixelFont.className}
        fontSize={["12px", "13px"]}
        fontWeight="400"
        letterSpacing="0.02em"
        lineHeight="1.5"
        borderLeft="2px solid"
        borderLeftColor="brand.border"
        pl={2}
        mt={8}
        color="brand.text"
        mx={[4, 5, 6]}
      >
        {children}
      </Heading>
    ),
    h4: ({ children }) => (
      <Heading
        as="h5"
        className={pixelFont.className}
        fontSize={["10.5px", "11px"]}
        fontWeight="400"
        letterSpacing="0.02em"
        lineHeight="1.5"
        mt={6}
        color="brand.text"
        px={[4, 5, 6]}
      >
        {children}
      </Heading>
    ),
    p: ({ children }) => (
      <Text
        as="p"
        className={proseFont.className}
        fontSize="15px"
        mt={4}
        color="brand.textMuted"
        lineHeight="1.6"
        px={[4, 5, 6]}
      >
        {children}
      </Text>
    ),
    ul: ({ children }) => (
      <UnorderedList
        className={proseFont.className}
        fontSize="15px"
        mt={4}
        color="brand.textMuted"
        lineHeight="1.6"
        px={[4, 5, 6]}
      >
        {children}
      </UnorderedList>
    ),
    ol: ({ children }) => (
      <OrderedList
        className={proseFont.className}
        fontSize="15px"
        mt={4}
        color="brand.textMuted"
        lineHeight="1.6"
        px={[4, 5, 6]}
      >
        {children}
      </OrderedList>
    ),
    a: ({ children, href }) => (
      <Link
        className={proseFont.className}
        color="brand.accent"
        textDecoration="underline"
        fontWeight={600}
        fontSize="15px"
        href={href}
        target="blank"
        rel="noreferrer noopener"
        _hover={{
          opacity: 0.8,
        }}
      >
        {children}
      </Link>
    ),

    img: (props) => (
      <Image
        sizes="100vw"
        style={{ width: "100%", height: "auto" }}
        {...(props as ImageProps)}
      />
    ),
    hr: () => (
      <Box
        as="hr"
        my={8}
        mx={[4, 5, 6]}
        borderColor="brand.border"
        borderTopWidth="1px"
      />
    ),
    blockquote: ({ children }) => (
      <Box
        as="blockquote"
        className={proseFont.className}
        fontSize="15px"
        borderLeft="3px solid"
        borderLeftColor="brand.accent"
        pl={4}
        mx={[4, 5, 6]}
        my={4}
        lineHeight="1.6"
        fontStyle="italic"
        color="brand.textMuted"
      >
        {children}
      </Box>
    ),
    strong: ({ children }) => (
      <Text
        as="strong"
        className={proseFont.className}
        fontSize="15px"
        fontWeight="700"
        color="brand.text"
      >
        {children}
      </Text>
    ),
    code: ({ children, ...props }) => {
      // If inside a <pre>, render plain code (no inline styling)
      const isBlock = typeof children === "string" && children.includes("\n");
      if (isBlock) return <code {...props}>{children}</code>;
      return (
        <Text
          as="code"
          fontSize="0.85em"
          fontWeight="600"
          color="#da70d6"
          bg="#da70d615"
          px={1.5}
          py={0.5}
          borderRadius="5px"
          {...props}
        >
          {children}
        </Text>
      );
    },
    pre: ({ children, ...props }) => (
      <Box px={[4, 5, 6]} mt={6} mb={4}>
        <Box
          as="pre"
          overflow="auto"
          borderRadius="10px"
          border="1px solid"
          borderColor="brand.border"
          p={5}
          fontSize="13px"
          lineHeight="1.6"
          {...props}
        >
          {children}
        </Box>
      </Box>
    ),
    ...components,
  };
}
