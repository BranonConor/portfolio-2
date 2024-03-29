"use client";

import { Flex, Grid, Heading, useColorModeValue } from "@chakra-ui/react";
import { PageWrapper } from "@/components/PageWrapper";
import { FancyHeading } from "@/components/FancyHeading";
import { PostCard } from "@/components/blog/PostCard";

export default function Home() {
  const bg = useColorModeValue("white", "brand.grey");
  const brandingProjects = [
    {
      title: "Rebranding @ Etch AI",
      category: "Brand Design",
      image: "/projects/etch/cover.png",
      link: "/projects/posts/etch",
      date: "March 2024",
    },
    {
      title: "Branding & Digital @ TIDAL Acupuncture",
      category: "Brand Design",
      image: "/projects/tidal/cover.png",
      link: "/projects/posts/tidal",
      date: "December 2023",
    },
    {
      title: "Rebranding @ Charter Healthcare",
      category: "Brand Design",
      image: "/projects/charter/cover.png",
      link: "/projects/posts/charter",
      date: "July 2020",
    },
  ];

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

        <Heading as="h3" size="md" my={4}>
          Brand Design
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
