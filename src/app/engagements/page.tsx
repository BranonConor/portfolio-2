"use client";

import { Flex, Grid, Heading, useColorModeValue } from "@chakra-ui/react";
import { PageWrapper } from "@/components/PageWrapper";
import { FancyHeading } from "@/components/FancyHeading";
import { PostCard } from "@/components/blog/PostCard";

export default function Home() {
  const bg = useColorModeValue("white", "brand.grey");
  const engagements = [
    {
      title: "Design Systems Panel + Brunch 🥞",
      category: "Mentoring",
      image: "/engagements/design-systems-brunch/cover.png",
      link: "/engagements/posts/design-systems-brunch",
      date: "April 2022",
    },
    {
      title: "Mentoring on ADPList",
      category: "Mentoring",
      image: "/engagements/adplist/cover.png",
      link: "/engagements/posts/adplist",
      date: "Feb 2024 - Now",
    },
    {
      title: "Featured Guest @ One Bad Habit Podcast",
      category: "Public Speaking",
      image: "/engagements/one-bad-habit/cover.png",
      link: "/engagements/posts/one-bad-habit",
      date: "June 2022",
    },
    {
      title: "Design Panel @ SDSU + Friends of Figma",
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
          mb={8}
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
