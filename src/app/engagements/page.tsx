"use client";

import { Flex, Text, Grid, Heading, useColorModeValue } from "@chakra-ui/react";
import { PageWrapper } from "@/components/PageWrapper";
import { FancyHeading } from "@/components/FancyHeading";
import { PostCard } from "@/components/blog/PostCard";
import { useState } from "react";
import { mentoring, publicSpeaking } from "./consts";
import { motion } from "framer-motion";

export default function Home() {
  const bg = useColorModeValue("white", "brand.grey");
  const [currentFilter, setCurrentFilter] = useState("all");

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

        <Flex flexWrap="wrap" mb={4}>
          <Heading as="h3" m={0} mr={2} p={0} size="md" width="auto">
            Filters:
          </Heading>
          <Text
            color="white"
            as="button"
            fontSize="12px"
            paddingY={1}
            paddingX={2}
            bg={currentFilter === "all" ? "brand.pink" : "brand.blue"}
            borderRadius={120}
            onClick={() => setCurrentFilter("all")}
            mr={2}
            mb={2}
          >
            All
          </Text>
          <Text
            color="white"
            as="button"
            fontSize="12px"
            paddingY={1}
            paddingX={2}
            bg={
              currentFilter === "Public Speaking" ? "brand.pink" : "brand.blue"
            }
            borderRadius={120}
            onClick={() => setCurrentFilter("Public Speaking")}
            mr={2}
            mb={2}
          >
            🎙️ Public Speaking
          </Text>
          <Text
            color="white"
            as="button"
            fontSize="12px"
            paddingY={1}
            paddingX={2}
            bg={currentFilter === "Mentoring" ? "brand.pink" : "brand.blue"}
            borderRadius={120}
            onClick={() => setCurrentFilter("Mentoring")}
            mr={2}
            mb={2}
          >
            🤝 Mentoring
          </Text>
        </Flex>

        {(currentFilter === "all" || currentFilter === "Mentoring") && (
          <motion.div
            initial={{ x: -32, scale: 0.95, opacity: 0 }}
            animate={{ x: 0, scale: 1, opacity: 1 }}
            transition={{
              duration: 0.15,
              type: "spring",
            }}
            style={{ width: "100%" }}
          >
            <Heading as="h3" size="md" my={4}>
              🤝 Mentoring
            </Heading>
            <Grid
              width="100%"
              gridGap={4}
              mb={8}
              gridTemplateColumns={[
                "1fr",
                "1fr",
                "1fr 1fr",
                "1fr 1fr",
                "1fr 1fr",
              ]}
            >
              {mentoring.map((engagement) => (
                <PostCard
                  title={engagement.title}
                  image={engagement.image}
                  link={engagement.link}
                  category={engagement.category}
                  date={engagement.date}
                />
              ))}
            </Grid>
          </motion.div>
        )}

        {(currentFilter === "all" || currentFilter === "Public Speaking") && (
          <motion.div
            initial={{ x: -32, scale: 0.95, opacity: 0 }}
            animate={{ x: 0, scale: 1, opacity: 1 }}
            transition={{
              duration: 0.15,
              type: "spring",
            }}
            style={{ width: "100%" }}
          >
            <Heading as="h3" size="md" my={4}>
              🎙️ Public Speaking
            </Heading>
            <Grid
              width="100%"
              gridGap={4}
              mb={8}
              gridTemplateColumns={[
                "1fr",
                "1fr",
                "1fr 1fr",
                "1fr 1fr",
                "1fr 1fr",
              ]}
            >
              {publicSpeaking.map((engagement) => (
                <PostCard
                  title={engagement.title}
                  image={engagement.image}
                  link={engagement.link}
                  category={engagement.category}
                  date={engagement.date}
                />
              ))}
            </Grid>
          </motion.div>
        )}
      </Flex>
    </PageWrapper>
  );
}
