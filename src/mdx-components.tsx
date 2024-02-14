import {
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
      <Heading as="h1" size="xl" mt={4}>
        {children}
      </Heading>
    ),
    h2: ({ children }) => (
      <FancyHeading as="h2" size="md" pl={2} borderLeft="2px solid" mt={4}>
        {children}
      </FancyHeading>
    ),
    h3: ({ children }) => (
      <Heading as="h3" size="md" borderLeft="2px solid" pl={2} mt={8}>
        {children}
      </Heading>
    ),
    h4: ({ children }) => (
      <Heading as="h4" size="sm" fontWeight="bold" mt={4}>
        {children}
      </Heading>
    ),
    p: ({ children }) => (
      <Text as="p" size="s" mt={4}>
        {children}
      </Text>
    ),
    ul: ({ children }) => (
      <UnorderedList mt={4} size="md">
        {children}
      </UnorderedList>
    ),
    ol: ({ children }) => (
      <OrderedList mt={4} size="md">
        {children}
      </OrderedList>
    ),
    a: ({ children, href }) => (
      <Link
        color="brand.blue"
        textDecoration="underline"
        fontWeight={700}
        href={href}
        target="blank"
        rel="noreferrer noopenner"
        size="md"
        _hover={{
          color: "brand.pink",
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
    ...components,
  };
}
