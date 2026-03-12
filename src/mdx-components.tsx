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

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including inline styles,
// components from other libraries, and more.

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <Heading as="h1" size="xl" mt={8} color="brand.text" px={[4, 5, 6]}>
        {children}
      </Heading>
    ),
    h2: ({ children }) => (
      <FancyHeading
        as="h2"
        size="md"
        pl={2}
        borderLeft="2px solid"
        borderLeftColor="brand.border"
        mt={8}
        mx={[4, 5, 6]}
        color="brand.textMuted"
      >
        {children}
      </FancyHeading>
    ),
    h3: ({ children }) => (
      <Heading
        as="h3"
        size="md"
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
      <Heading as="h4" size="sm" fontWeight="bold" mt={6} color="brand.text" px={[4, 5, 6]}>
        {children}
      </Heading>
    ),
    p: ({ children }) => (
      <Text as="p" size="s" mt={4} color="brand.textMuted" lineHeight="1.8" px={[4, 5, 6]}>
        {children}
      </Text>
    ),
    ul: ({ children }) => (
      <UnorderedList mt={4} size="md" color="brand.textMuted" lineHeight="1.8" px={[4, 5, 6]}>
        {children}
      </UnorderedList>
    ),
    ol: ({ children }) => (
      <OrderedList mt={4} size="md" color="brand.textMuted" lineHeight="1.8" px={[4, 5, 6]}>
        {children}
      </OrderedList>
    ),
    a: ({ children, href }) => (
      <Link
        color="brand.accent"
        textDecoration="underline"
        fontWeight={600}
        href={href}
        target="blank"
        rel="noreferrer noopenner"
        size="md"
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
        borderLeft="3px solid"
        borderLeftColor="brand.accent"
        pl={4}
        mx={[4, 5, 6]}
        my={4}
        fontStyle="italic"
        color="brand.textMuted"
      >
        {children}
      </Box>
    ),
    strong: ({ children }) => (
      <Text as="strong" fontWeight="700" color="brand.text">
        {children}
      </Text>
    ),
    ...components,
  };
}
