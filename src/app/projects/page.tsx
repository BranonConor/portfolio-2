"use client";

import { Flex, Grid, Heading, useColorModeValue } from "@chakra-ui/react";
import { PageWrapper } from "@/components/PageWrapper";
import { FancyHeading } from "@/components/FancyHeading";
import { PostCard } from "@/components/blog/PostCard";
import { brandingProjects } from "./consts";

export default function Home() {
  const bg = useColorModeValue("white", "brand.grey");

  return (
    <PageWrapper bg={bg}>
      <Flex
        flexDirection="column"
        width="100%"
        alignItems="flex-start"
        justifyContent="flex-start"
      >
        <Heading as="h1" size="2xl" mb={4}>
          Projects 🛠️
        </Heading>
        <FancyHeading as="h2">Cool things I've worked on</FancyHeading>

        {/* <Heading as="h3" size="md" mb={4}>
          🎨 Design Systems
        </Heading>
        <Grid
          width="100%"
          gridGap={4}
          mb={24}
          gridTemplateColumns={["1fr", "1fr", "1fr 1fr", "1fr 1fr", "1fr 1fr"]}
        >
          {brandingProjects.map((project) => (
            <PostCard
              title={project.title}
              image={project.image}
              link={project.link}
              category={project.category}
              date={project.date}
            />
          ))}
        </Grid> */}

        <Heading as="h3" size="md" my={4}>
          🌈 Brand Design
        </Heading>
        <Grid
          width="100%"
          gridGap={4}
          gridTemplateColumns={["1fr", "1fr", "1fr 1fr", "1fr 1fr", "1fr 1fr"]}
        >
          {brandingProjects.map((project) => (
            <PostCard
              title={project.title}
              image={project.image}
              link={project.link}
              category={project.category}
              date={project.date}
            />
          ))}
        </Grid>
      </Flex>
    </PageWrapper>
  );
}
