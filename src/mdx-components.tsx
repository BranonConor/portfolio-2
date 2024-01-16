import { Heading, Text, UnorderedList } from "@chakra-ui/react";
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
      <Heading as="h1" size="xl" mb={4}>
        {children}
      </Heading>
    ),
    h2: ({ children }) => (
      <FancyHeading as="h2" size="l" pl={2} borderLeft="2px solid" mb={4}>
        {children}
      </FancyHeading>
    ),
    h3: ({ children }) => (
      <Heading as="h3" size="l" borderLeft="2px solid" pl={2}>
        {children}
      </Heading>
    ),
    p: ({ children }) => (
      <Text as="p" size="md" my={4}>
        {children}
      </Text>
    ),
    ul: ({ children }) => <UnorderedList size="md">{children}</UnorderedList>,

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
