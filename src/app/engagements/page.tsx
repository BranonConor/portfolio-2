"use client";

import { Flex, Grid, Heading, useColorModeValue } from "@chakra-ui/react";
import { PageWrapper } from "@/components/PageWrapper";
import { FancyHeading } from "@/components/FancyHeading";
import { PostCard } from "@/components/blog/PostCard";

export default function Home() {
  const bg = useColorModeValue("white", "brand.grey");
  const engagements = [
    {
      title: "Design Panel w/ SDSU + Friends of Figma",
      category: "Mentoring",
      image: "/engagements/sdsu-friends-of-figma/cover.png",
      link: "/engagements/posts/sdsu-friends-of-figma",
      date: "April 2022",
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
          Engagements 🤝
        </Heading>
        <FancyHeading as="h2">Showing up for the community!</FancyHeading>
        <Grid
          width="100%"
          gridGap={4}
          gridTemplateColumns={["1fr", "1fr", "1fr 1fr", "1fr 1fr", "1fr 1fr"]}
        >
          {engagements.map((engagement) => (
            <PostCard
              title={engagement.title}
              image={engagement.image}
              link={engagement.link}
              category={engagement.category}
              date={engagement.date}
            />
          ))}
        </Grid>
      </Flex>
    </PageWrapper>
  );
}
