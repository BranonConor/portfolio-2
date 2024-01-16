"use client";

import { Flex, Box, Heading, useColorModeValue, Text } from "@chakra-ui/react";
import { PageWrapper } from "@/components/PageWrapper";
import { FancyHeading } from "@/components/FancyHeading";
import { Photography } from "@/components/sections/Photography";

export default function Home() {
  const bg = useColorModeValue("white", "brand.grey");
  const cardBg = useColorModeValue("brand.lightBg", "brand.darkBg");
  const shadow = useColorModeValue(
    "lg",
    "0px 4px 15px 0px rgba(226,175,255, 0.10)"
  );
  return (
    <PageWrapper bg={bg} pb={8}>
      <Flex
        width="100%"
        alignItems="flex-start"
        justifyContent="flex-start"
        flexDirection="column"
      >
        <Heading as="h1" size="2xl" mb={4}>
          About Me
        </Heading>
        <FancyHeading as="h2">I love people. I love technology.</FancyHeading>
        <Text as="p" mb={4}>
          My love of people and my interest in the human experience are the
          driving forces in my life. That's why I got my degree in neuroscience
          and spent my first few years out of college as the director of a
          neuropsychiatric clinic.
        </Text>
        <Text as="p" mb={4}>
          As my fascination with technology got the better of me, I began to
          experiment with designing and coding websites. I was hooked
          immediately, and since then I've been diving deeper and deeper into
          the vast worlds of software development and UX/UI design. Nowadays, I
          specialize in design systems, accessibility, prototyping, and general
          frontend engineering. I love flexing creativity and systems-level
          thinking in building beautiful and intuitive interfaces, and in
          constructing world-class design systems + component libraries.
        </Text>
        <Text as="p" mb={4}>
          Outside of my main roles, I build productivity tools in my startup,
          LIFTOFF, co-create Udemy software development courses for tens of
          thousands of students, freelance as a web designer and developer for
          small businesses, and much more!
        </Text>

        <Box
          width="100%"
          borderRadius={10}
          padding={4}
          mt={8}
          boxShadow={shadow}
          bg={cardBg}
        >
          <Heading
            color="brand.blue"
            as="h3"
            size="l"
            borderLeft="2px solid"
            pl={2}
            mb={4}
          >
            I'm more than just a tech worker though!
          </Heading>
          <Text>
            Life's too short to do anything but what you love. Here are some of
            my other passions:
          </Text>
        </Box>

        <Photography />
      </Flex>
    </PageWrapper>
  );
}
