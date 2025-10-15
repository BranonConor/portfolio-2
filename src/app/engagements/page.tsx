"use client";

import { Flex, Text, Grid, Heading, useColorModeValue } from "@chakra-ui/react";
import { PageWrapper } from "@/components/PageWrapper";
import { FancyHeading } from "@/components/FancyHeading";
import { PostCard } from "@/components/blog/PostCard";
import { useState } from "react";
import { mentoring, publicSpeaking } from "./consts";
import { AnimatePresence, motion } from "framer-motion";

export default function Home() {
  const [currentFilter, setCurrentFilter] = useState("all");
  const bg = useColorModeValue("white", "brand.grey");
  const filtersBg = useColorModeValue("brand.lightBg", "brand.darkBg");
  const chipBg = useColorModeValue("brand.lightGrey", "brand.grey");

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

        <Flex
          flexWrap="wrap"
          alignItems="center"
          mb={4}
          borderRadius="16px"
          bg={filtersBg}
          width="100%"
          padding={3}
          gap={1}
        >
          <Heading as="h3" m={0} mr={2} p={0} size="sm" width="auto">
            Filters:
          </Heading>
          <Text
            color={currentFilter === "all" ? "white" : undefined}
            as="button"
            fontSize="12px"
            paddingY={1}
            paddingX={2}
            bg={currentFilter === "all" ? "brand.pink" : chipBg}
            _hover={{
              boxShadow: "md",
              transform: "translateY(-2px)",
              transition: "0.1s ease all",
            }}
            borderRadius={120}
            onClick={() => setCurrentFilter("all")}
          >
            All
          </Text>
          <Text
            color={currentFilter === "Public Speaking" ? "white" : undefined}
            as="button"
            fontSize="12px"
            paddingY={1}
            paddingX={2}
            bg={currentFilter === "Public Speaking" ? "brand.pink" : chipBg}
            _hover={{
              boxShadow: "md",
              transform: "translateY(-2px)",
              transition: "0.1s ease all",
            }}
            borderRadius={120}
            onClick={() => setCurrentFilter("Public Speaking")}
          >
            🎙️ Public Speaking
          </Text>
          <Text
            color={currentFilter === "Mentoring" ? "white" : undefined}
            as="button"
            fontSize="12px"
            paddingY={1}
            paddingX={2}
            bg={currentFilter === "Mentoring" ? "brand.pink" : chipBg}
            _hover={{
              boxShadow: "md",
              transform: "translateY(-2px)",
              transition: "0.1s ease all",
            }}
            borderRadius={120}
            onClick={() => setCurrentFilter("Mentoring")}
          >
            🤝 Mentoring
          </Text>
        </Flex>

        <Flex
          width="100%"
          bg={filtersBg}
          borderRadius="16px"
          pt={[2]}
          pl={[4, 4, 8]}
          pr={[4, 4, 8]}
          pb={[4, 4, 8]}
          boxSizing="border-box"
          overflow="hidden"
          flexDirection="column"
          gap={8}
        >
          <AnimatePresence mode="wait">
            {currentFilter === "Mentoring" && (
              <motion.div
                key="mentoring"
                initial={{ x: -80, opacity: 0 }}
                animate={{
                  x: 0,
                  opacity: 1,
                  transition: {
                    ease: "easeIn",
                    duration: 0.35,
                    type: "spring",
                  },
                }}
                exit={{
                  x: 80,
                  opacity: 0,
                  transition: {
                    ease: "easeIn",
                    duration: 0.25,
                    type: "spring",
                  },
                }}
                style={{ width: "100%" }}
              >
                <Heading as="h3" size="md" my={4}>
                  🤝 Mentoring
                </Heading>
                <Grid
                  width="100%"
                  gridGap={[4, 4, 8]}
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

            {currentFilter === "Public Speaking" && (
              <motion.div
                key="publicSpeaking"
                initial={{ x: -80, opacity: 0 }}
                animate={{
                  x: 0,
                  opacity: 1,
                  transition: {
                    ease: "easeIn",
                    duration: 0.35,
                    type: "spring",
                  },
                }}
                exit={{
                  x: 80,
                  opacity: 0,
                  transition: {
                    ease: "easeIn",
                    duration: 0.25,
                    type: "spring",
                  },
                }}
                style={{ width: "100%" }}
              >
                <Heading as="h3" size="md" my={4}>
                  🎙️ Public Speaking
                </Heading>
                <Grid
                  width="100%"
                  gridGap={[4, 4, 8]}
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

            {currentFilter === "all" && (
              <Flex flexDirection="column" gap={8} width="100%">
                <motion.div
                  key="mentoringAll"
                  initial={{ x: -80, opacity: 0 }}
                  animate={{
                    x: 0,
                    opacity: 1,
                    transition: {
                      ease: "easeIn",
                      duration: 0.35,
                      type: "spring",
                    },
                  }}
                  exit={{
                    x: 80,
                    opacity: 0,
                    transition: {
                      ease: "easeIn",
                      duration: 0.25,
                      type: "spring",
                    },
                  }}
                  style={{ width: "100%" }}
                >
                  <Heading as="h3" size="md" my={4}>
                    🤝 Mentoring
                  </Heading>
                  <Grid
                    width="100%"
                    gridGap={[4, 4, 8]}
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

                <motion.div
                  key="publicSpeakingAll"
                  initial={{ x: -80, opacity: 0 }}
                  animate={{
                    x: 0,
                    opacity: 1,
                    transition: {
                      ease: "easeIn",
                      duration: 0.35,
                      type: "spring",
                    },
                  }}
                  exit={{
                    x: 80,
                    opacity: 0,
                    transition: {
                      ease: "easeIn",
                      duration: 0.25,
                      type: "spring",
                    },
                  }}
                  style={{ width: "100%" }}
                >
                  <Heading as="h3" size="md" my={4}>
                    🎙️ Public Speaking
                  </Heading>
                  <Grid
                    width="100%"
                    gridGap={[4, 4, 8]}
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
              </Flex>
            )}
          </AnimatePresence>
        </Flex>
      </Flex>
    </PageWrapper>
  );
}
