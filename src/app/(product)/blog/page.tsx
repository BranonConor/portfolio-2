"use client";

import { Flex, Text, Box } from "@chakra-ui/react";
import { PageWrapper } from "@/components/PageWrapper";
import { PageHeading } from "@/components/PageHeading";
import { RetroCard } from "@/components/RetroCard";
import { TopLevelListItem } from "@/components/TopLevelListItem";

export default function Blog() {
  const posts = [
    {
      title: "The CLI is the New UI",
      category: "AI & DX",
      link: "https://www.thesis.social/article/cmp73stnr000o04l6bxr194c5",
      date: "May 2026",
      external: true,
    },
    {
      title: "The need for INCLUSION.md",
      category: "Accessibility",
      link: "/blog/posts/the-need-for-inclusion-md",
      date: "May 2026",
    },
    {
      title: "Creating an A11y Auditing Kit",
      category: "Accessibility",
      link: "/blog/posts/creating-an-a11y-auditing-kit",
      date: "June 2022",
    },
  ];

  return (
    <PageWrapper>
      <Flex
        flexDirection="column"
        width="100%"
        alignItems="flex-start"
        justifyContent="flex-start"
      >
        <RetroCard>
          <Box p={5} pb={3} borderBottom="2px solid" borderBottomColor="brand.border">
            <PageHeading title="Blog" subtitle="Updates, thoughts, and more." />
          </Box>

          <Flex
            flexDirection="column"
            width="100%"
            gap={0}
            px={5}
            pt={4}
            pb={4}
            sx={{
              "& > *:first-of-type::after": { display: "none" },
              "& > *:hover + *::after": { transform: "scaleX(0)" },
            }}
          >
            {posts.map((post) => (
              <TopLevelListItem
                key={post.title}
                title={post.title}
                href={post.link}
                external={post.external}
                accent="#61dafb"
                meta={`${post.category} · ${post.date}`}
              />
            ))}
          </Flex>
        </RetroCard>
      </Flex>
    </PageWrapper>
  );
}
