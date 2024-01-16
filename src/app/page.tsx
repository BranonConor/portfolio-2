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
import { DownloadIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { Technologies } from "@/components/sections/Technologies";
import { FancyHeading } from "@/components/FancyHeading";
import { PageWrapper } from "@/components/PageWrapper";
import { Showcase } from "@/components/sections/Showcase";

export default function Home() {
  const bg = useColorModeValue("white", "brand.grey");

  return (
    <PageWrapper bg={bg}>
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
        <Flex
          flexDirection={["column", "column", "row"]}
          width={["100%", "auto", "auto"]}
          mb={[8, 10, 12]}
        >
          <Button
            variant="primary"
            as={Link}
            href="/projects"
            mr={[0, 0, 4]}
            mb={[4, 4, 0]}
            width={["100%", "100%", "auto"]}
          >
            <Image src="/icons/projects-light.svg" mr={2} width={4} />
            See my work
          </Button>
          <Button
            variant="secondary"
            as="a"
            download
            href="/resume.pdf"
            width={["100%", "100%", "auto"]}
          >
            <DownloadIcon mr={2} width={4} />
            Download resume
          </Button>
        </Flex>

        <Technologies />
        <Showcase />
      </Flex>
    </PageWrapper>
  );
}
