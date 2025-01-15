"use client";

import {
  Flex,
  Heading,
  useColorModeValue,
  Text,
  Button,
  Image,
  Box,
} from "@chakra-ui/react";
import { DownloadIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { Technologies } from "@/components/sections/Technologies";
import { FancyHeading } from "@/components/FancyHeading";
import { PageWrapper } from "@/components/PageWrapper";
import { Showcase } from "@/components/sections/Showcase";
import AdplistReviews from "@/components/blog/AdplistReviews";

export default function Home() {
  const bg = useColorModeValue("white", "brand.grey");
  const me = useColorModeValue("/me-dark.png", "/me-light.png");

  return (
    <PageWrapper bg={bg}>
      <Flex
        width="100%"
        flexDirection="column"
        alignItems="flex-start"
        justifyContent="flex-start"
        position="relative"
      >
        <Heading as="h1" size="2xl" mb={4}>
          Hi, I'm Branon! 👋
        </Heading>
        <FancyHeading>I'm a UX-focused software engineer.</FancyHeading>
        <Text
          as="p"
          mb={8}
          maxWidth={["100%", "100%", "50%", "60%", "60%", "70%"]}
        >
          With a degree in behavioral neuroscience, a seasoned eye for
          best-in-class UX/UI, and a powerful command of modern technologies to
          build quality interfaces and experiences, my strengths lie at the
          intersection of technology and people. I strive to build intuitive,
          accessible, and scalable software that delights users and propels
          businesses forward.
        </Text>

        <Box
          as="img"
          src={me}
          position="absolute"
          maxWidth={["230px", "250px", "400px", "400px", "400px", "400px"]}
          zIndex={0}
          top={["360px", "264px", "180px", "64px", "0px", "-50px"]}
          right={["-32px", "-16px", "-48px", "-24px", "0px", "-64px"]}
          transform={[
            "rotate(-25deg)",
            "rotate(-20deg)",
            "rotate(0deg)",
            "rotate(0deg)",
            "rotate(-10deg)",
            "rotate(-20deg)",
          ]}
        />

        <Flex
          flexDirection={["column", "column", "row"]}
          mb={[8, 10, 12]}
          position="relative"
          zIndex={1}
        >
          <Button
            variant="primary"
            as={Link}
            href="/projects"
            mr={[0, 0, 4]}
            mb={[4, 4, 0]}
            width={["auto"]}
          >
            <Image src="/icons/projects-light.svg" mr={2} width={4} />
            See My Work
          </Button>
          <Button
            variant="secondary"
            as="a"
            download
            href="/resume.pdf"
            width={["auto"]}
          >
            <DownloadIcon mr={2} width={4} />
            Download resume
          </Button>
        </Flex>

        <Technologies />
        <Showcase />

        <FancyHeading mt={12}>
          🤝 Mentoring Designers and Engineers
        </FancyHeading>
        <Text as="p" mb={8}>
          I love meeting with designers and engineers to pay forward much of the
          amazing help and guidance I received along my own career journey. Some
          of my mentees have left amazing feedback, which has definitely helped
          me feel confident that I'm addressing peoples' needs - I'm honored to
          share their kind reviews here, check 'em out!
        </Text>
        <AdplistReviews />

        <Flex
          flexDirection={["column", "column", "row"]}
          mb={[8, 10, 12]}
          mt={10}
        >
          <Button
            variant="primary"
            as={Link}
            href="https://adplist.org/mentors/branon-eusebio"
            mr={[0, 0, 4]}
            mb={[4, 4, 0]}
            width={["auto"]}
          >
            <Image src="/icons/engagements-light.svg" mr={2} width={4} />
            Let's chat!
          </Button>
          <Button
            variant="secondary"
            as="a"
            href="/engagements/posts/adplist"
            width={["auto"]}
          >
            Learn more
          </Button>
        </Flex>
      </Flex>
    </PageWrapper>
  );
}
