"use client";

import { Flex, Heading, Grid, useColorModeValue } from "@chakra-ui/react";
import { PageWrapper } from "@/components/PageWrapper";
import { FancyHeading } from "@/components/FancyHeading";
import { PostCard } from "@/components/blog/PostCard";

export default function Home() {
  const bg = useColorModeValue("white", "brand.grey");
  const posts = [
    {
      title: "Creating an A11y Auditing Kit",
      category: "A11y",
      image: "/blog/creating-an-a11y-auditing-kit/cover.png",
      link: "/blog/posts/creating-an-a11y-auditing-kit",
      date: "June 2022",
    },
    {
      title: "My strengths, as told by others",
      category: "Culture",
      image: "/blog/my-strengths-as-told-by-others/cover.png",
      link: "/blog/posts/my-strengths-as-told-by-others",
      date: "August 2022",
    },
  ];

  return (
    <PageWrapper bg={bg} pb={8}>
      <Flex
        flexDirection="column"
        width="100%"
        alignItems="flex-start"
        justifyContent="flex-start"
      >
        <Heading as="h1" size="2xl" mb={4}>
          Blog ✍🏼
        </Heading>
        <FancyHeading as="h2">Updates, thoughts, and more!</FancyHeading>
        <Grid
          width="100%"
          gridGap={4}
          gridTemplateColumns={["1fr", "1fr", "1fr 1fr", "1fr 1fr", "1fr 1fr"]}
        >
          {posts.map((post) => (
            <PostCard
              title={post.title}
              image={post.image}
              link={post.link}
              category={post.category}
              date={post.date}
            />
          ))}
        </Grid>
      </Flex>
    </PageWrapper>
  );
}
