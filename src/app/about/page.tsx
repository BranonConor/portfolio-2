"use client";

import { Flex, Button, Heading, Text, Box } from "@chakra-ui/react";
import { PageWrapper } from "@/components/PageWrapper";
import { PaintStroke } from "@/components/PaintStroke";
import Link from "next/link";
import { Photography } from "@/components/sections/Photography";
import { Music } from "@/components/sections/Music";

export default function About() {
  return (
    <PageWrapper>
      <Flex
        width="100%"
        alignItems="flex-start"
        justifyContent="flex-start"
        flexDirection="column"
      >
        <Box
          border="1px solid"
          borderColor="brand.border"
          borderRadius="12px"
          bg="rgba(20, 20, 22, 0.6)"
          backdropFilter="blur(16px)"
          overflow="hidden"
          mb={[10, 12, 16]}
          width="100%"
        >
          {/* Paint stroke header area */}
          <Box
            position="relative"
            width="100%"
            height={["80px", "100px", "120px"]}
            overflow="hidden"
            borderBottom="1px solid"
            borderBottomColor="brand.border"
          >
            <PaintStroke
              variant={2}
              top="-40px"
              left="-60px"
              width={["200px", "260px", "320px"]}
              opacity={0.35}
            />
            <PaintStroke
              variant={4}
              top="-20px"
              right="-40px"
              width={["180px", "220px", "280px"]}
              opacity={0.25}
            />
            <PaintStroke
              variant={1}
              bottom="-50px"
              left="30%"
              width={["160px", "200px", "240px"]}
              opacity={0.2}
              rotate={-15}
            />
          </Box>

          <Box p={5}>
            <Heading
              as="h1"
              fontSize={["28px", "36px"]}
              fontWeight="700"
              letterSpacing="-0.03em"
              mb={2}
            >
              About Me
            </Heading>
            <Text fontSize="15px" color="brand.textMuted" mb={6}>
              I love people. I love technology.
            </Text>

            <Text
              as="p"
              fontSize="14px"
              color="brand.textMuted"
              mb={4}
              lineHeight="1.7"
            >
              My love of people and my interest in the human experience are the
              driving forces in my life. That&apos;s why I got my degree in
              neuroscience and spent my first few years out of college as the
              director of a neuropsychiatric clinic.
            </Text>
            <Text
              as="p"
              fontSize="14px"
              color="brand.textMuted"
              mb={4}
              lineHeight="1.7"
            >
              Nowadays, I specialize in design + engineering in design systems,
              accessibility, prototyping, and general frontend product work. I
              love flexing creativity and systems-level thinking in building
              beautiful and intuitive interfaces, and in constructing
              world-class design systems + component libraries.
            </Text>
            <Text
              as="p"
              fontSize="14px"
              color="brand.textMuted"
              mb={8}
              lineHeight="1.7"
            >
              Outside of my main roles, I build fullstack web apps, create Udemy
              software development courses for tens of thousands of students, do
              web design/development for small businesses, and much more!
            </Text>

            <Flex
              flexDirection={["column", "column", "row"]}
              width={["100%", "auto", "auto"]}
              gap={3}
            >
              <Button variant="primary" as={Link} href="/projects" size="sm">
                See my work
              </Button>
              <Button variant="secondary" as={Link} href="/blog" size="sm">
                Visit blog
              </Button>
            </Flex>
          </Box>
        </Box>

        <Heading
          as="h2"
          fontSize={["20px", "24px"]}
          fontWeight="600"
          letterSpacing="-0.02em"
          mb={2}
        >
          More than just a tech worker
        </Heading>
        <Text fontSize="14px" color="brand.textMuted" mb={4}>
          Life&apos;s too short to do anything but what you love. Here are some
          of my other passions:
        </Text>
        <Music />
        <Photography />
      </Flex>
    </PageWrapper>
  );
}
