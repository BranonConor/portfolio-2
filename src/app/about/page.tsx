"use client";

import {
  Flex,
  Button,
  Image,
  Heading,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
import { PageWrapper } from "@/components/PageWrapper";
import { FancyHeading } from "@/components/FancyHeading";
import { Photography } from "@/components/sections/Photography";
import { Music } from "@/components/sections/Music";
import Link from "next/link";
import { ChatIcon } from "@chakra-ui/icons";

export default function Home() {
  const bg = useColorModeValue("white", "brand.grey");

  return (
    <PageWrapper bg={bg} pb={8}>
      <Flex
        width="100%"
        alignItems="flex-start"
        justifyContent="flex-start"
        flexDirection="column"
      >
        <Heading as="h1" size="2xl" mb={4}>
          About Me 💭
        </Heading>
        <FancyHeading as="h2">I love people. I love technology.</FancyHeading>
        <Text as="p" mb={4}>
          My love of people and my interest in the human experience are the
          driving forces in my life. That's why I got my degree in neuroscience
          and spent my first few years out of college as the director of a
          neuropsychiatric clinic.
        </Text>
        <Text as="p" mb={4}>
          Nowadays, I specialize in design + engineering in design systems,
          accessibility, prototyping, and general frontend product work. I love
          flexing creativity and systems-level thinking in building beautiful
          and intuitive interfaces, and in constructing world-class design
          systems + component libraries.
        </Text>
        <Text as="p" mb={8}>
          Outside of my main roles, I build fullstack web apps, create Udemy
          software development courses for tens of thousands of students, do web
          design/development for small businesses, and much more!
        </Text>
        <Flex
          flexDirection={["column", "column", "row"]}
          width={["100%", "auto", "auto"]}
          mb={[10, 12, 16]}
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
            as={Link}
            href="/blog"
            width={["100%", "100%", "auto"]}
          >
            <ChatIcon mr={2} width={4} />
            Visit blog
          </Button>
        </Flex>

        <Heading my={4}>More than just a tech worker</Heading>
        <Text>
          Life's too short to do anything but what you love. Here are some of my
          other passions:
        </Text>
        <Music />
        <Photography />
      </Flex>
    </PageWrapper>
  );
}
