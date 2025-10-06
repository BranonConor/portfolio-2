"use client";

import {
  Flex,
  Text,
  Grid,
  Heading,
  useColorModeValue,
  Box,
} from "@chakra-ui/react";
import { PageWrapper } from "@/components/PageWrapper";
import { FancyHeading } from "@/components/FancyHeading";
import { PostCard } from "@/components/blog/PostCard";
import {
  brandingProjects,
  designSystemsProjects,
  a11yProjects,
  otherProjects,
  motionProjects,
} from "./consts";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Home() {
  const bg = useColorModeValue("white", "brand.grey");
  const chipBg = useColorModeValue("brand.lightGrey", "brand.grey");
  const filtersBg = useColorModeValue("brand.lightBg", "brand.darkBg");
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
          Projects 🛠️
        </Heading>
        <FancyHeading as="h2">Cool things I've worked on</FancyHeading>
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
            color={currentFilter === "Design Systems" ? "white" : undefined}
            as="button"
            fontSize="12px"
            paddingY={1}
            paddingX={2}
            bg={currentFilter === "Design Systems" ? "brand.pink" : chipBg}
            _hover={{
              boxShadow: "md",
              transform: "translateY(-2px)",
              transition: "0.1s ease all",
            }}
            borderRadius={120}
            onClick={() => setCurrentFilter("Design Systems")}
          >
            🎨 Design Systems
          </Text>
          <Text
            color={currentFilter === "A11y" ? "white" : undefined}
            as="button"
            fontSize="12px"
            paddingY={1}
            paddingX={2}
            bg={currentFilter === "A11y" ? "brand.pink" : chipBg}
            _hover={{
              boxShadow: "md",
              transform: "translateY(-2px)",
              transition: "0.1s ease all",
            }}
            borderRadius={120}
            onClick={() => setCurrentFilter("A11y")}
          >
            🤝 Accessibility
          </Text>
          <Text
            color={currentFilter === "Motion" ? "white" : undefined}
            as="button"
            fontSize="12px"
            paddingY={1}
            paddingX={2}
            bg={currentFilter === "Motion" ? "brand.pink" : chipBg}
            _hover={{
              boxShadow: "md",
              transform: "translateY(-2px)",
              transition: "0.1s ease all",
            }}
            borderRadius={120}
            onClick={() => setCurrentFilter("Motion")}
          >
            💫 Motion{" "}
          </Text>
          <Text
            color={currentFilter === "Other" ? "white" : undefined}
            as="button"
            fontSize="12px"
            paddingY={1}
            paddingX={2}
            bg={currentFilter === "Other" ? "brand.pink" : chipBg}
            _hover={{
              boxShadow: "md",
              transform: "translateY(-2px)",
              transition: "0.1s ease all",
            }}
            borderRadius={120}
            onClick={() => setCurrentFilter("Other")}
          >
            🚀 Miscellaneous
          </Text>
          <Text
            color={currentFilter === "Brand Design" ? "white" : undefined}
            as="button"
            fontSize="12px"
            paddingY={1}
            paddingX={2}
            bg={currentFilter === "Brand Design" ? "brand.pink" : chipBg}
            _hover={{
              boxShadow: "md",
              transform: "translateY(-2px)",
              transition: "0.1s ease all",
            }}
            borderRadius={120}
            onClick={() => setCurrentFilter("Brand Design")}
          >
            🌈 Brand Design
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
          gap={12}
        >
          <AnimatePresence mode="wait">
            {currentFilter === "Design Systems" && (
              <motion.div
                key="designSystems"
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
                  🎨 Design Systems
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
                  {designSystemsProjects.map((project) => (
                    <PostCard
                      title={project.title}
                      image={project.image}
                      link={project.link}
                      category={project.category}
                      date={project.date}
                      hasPassword={project.hasPassword}
                    />
                  ))}
                </Grid>
              </motion.div>
            )}

            {currentFilter === "A11y" && (
              <motion.div
                key="a11y"
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
                  🤝 Accessibility
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
                  {a11yProjects.map((project) => (
                    <PostCard
                      title={project.title}
                      image={project.image}
                      link={project.link}
                      category={project.category}
                      date={project.date}
                    />
                  ))}
                </Grid>
              </motion.div>
            )}

            {currentFilter === "Motion" && (
              <motion.div
                key="motion"
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
                  💫 Motion
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
                  {motionProjects.map((project) => (
                    <PostCard
                      title={project.title}
                      image={project.image}
                      link={project.link}
                      category={project.category}
                      date={project.date}
                    />
                  ))}
                </Grid>
              </motion.div>
            )}

            {currentFilter === "Other" && (
              <motion.div
                key="miscellaneous"
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
                  🚀 Miscellaneous
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
                  {otherProjects.map((project) => (
                    <PostCard
                      title={project.title}
                      image={project.image}
                      link={project.link}
                      category={project.category}
                      date={project.date}
                    />
                  ))}
                </Grid>
              </motion.div>
            )}

            {currentFilter === "Brand Design" && (
              <motion.div
                key="brandDesign"
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
                  🌈 Brand Design
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
              </motion.div>
            )}

            {currentFilter === "all" && (
              <Flex flexDirection="column" gap={8} width="100%">
                <motion.div
                  key="designSystemsAll"
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
                    🎨 Design Systems
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
                    {designSystemsProjects.map((project) => (
                      <PostCard
                        title={project.title}
                        image={project.image}
                        link={project.link}
                        category={project.category}
                        date={project.date}
                        hasPassword={project.hasPassword}
                      />
                    ))}
                  </Grid>
                </motion.div>
                <motion.div
                  key="a11yAll"
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
                    🤝 Accessibility
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
                    {a11yProjects.map((project) => (
                      <PostCard
                        title={project.title}
                        image={project.image}
                        link={project.link}
                        category={project.category}
                        date={project.date}
                      />
                    ))}
                  </Grid>
                </motion.div>
                <motion.div
                  key="motionAll"
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
                    💫 Motion
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
                    {motionProjects.map((project) => (
                      <PostCard
                        title={project.title}
                        image={project.image}
                        link={project.link}
                        category={project.category}
                        date={project.date}
                      />
                    ))}
                  </Grid>
                </motion.div>
                <motion.div
                  key="miscellaneousAll"
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
                    🚀 Miscellaneous
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
                    {otherProjects.map((project) => (
                      <PostCard
                        title={project.title}
                        image={project.image}
                        link={project.link}
                        category={project.category}
                        date={project.date}
                      />
                    ))}
                  </Grid>
                </motion.div>

                <motion.div
                  key="brandDesignAll"
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
                    🌈 Brand Design
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
                </motion.div>
              </Flex>
            )}
          </AnimatePresence>
        </Flex>
      </Flex>
    </PageWrapper>
  );
}
