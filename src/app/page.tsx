"use client";

import {
  Box,
  Flex,
  Heading,
  useColorModeValue,
  Text,
  Button,
  Image,
} from "@chakra-ui/react";
import { Nav } from "../components/Nav";
import { DownloadIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { Technologies } from "@/components/sections/Technologies";
import { FancyHeading } from "@/components/FancyHeading";
import { PageWrapper } from "@/components/PageWrapper";

export default function Home() {
  const bg = useColorModeValue("white", "brand.grey");

  return (
    <PageWrapper bg={bg}>
      <Nav />
      <Flex
        width="100%"
        flexDirection="column"
        alignItems="flex-start"
        justifyContent="flex-start"
      >
        <Heading as="h1" size="2xl" mb={4}>
          Hi, I'm Branon! 👋
        </Heading>
        <FancyHeading>I'm a UX-focused software engineer.</FancyHeading>
        <Text as="p" mb={8}>
          With a degree in behavioral neuroscience, a seasoned eye for
          best-in-class UX/UI, and a powerful command of modern technologies to
          build quality interfaces and experiences, my strengths lie at the
          intersection of technology and people. I strive to build intuitive,
          accessible, and scalable software that delights users and propels
          businesses forward.
        </Text>
        <Flex>
          <Button variant="primary" as={Link} href="/projects" mr={4}>
            <Image src="/icons/projects-light.svg" mr={2} width={4} />
            See my work
          </Button>
          <Button variant="secondary" as="a" download href="/resume.pdf">
            <DownloadIcon mr={2} width={4} />
            Download resume
          </Button>
        </Flex>

        <Technologies />
      </Flex>
    </PageWrapper>
  );
}
