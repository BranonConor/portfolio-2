"use client";

import {
  Flex,
  Text,
  Box,
  Grid,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import { PageWrapper } from "@/components/PageWrapper";
import { FancyHeading } from "@/components/FancyHeading";
import { PostCard } from "@/components/blog/PostCard";
import {
  brandingProjects,
  designSystemsProjects,
  a11yProjects,
  otherProjects,
} from "./consts";
import { useState } from "react";
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
          Projects 🛠️
        </Heading>
        <FancyHeading as="h2">Cool things I've worked on</FancyHeading>
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
              currentFilter === "Design Systems" ? "brand.pink" : "brand.blue"
            }
            borderRadius={120}
            onClick={() => setCurrentFilter("Design Systems")}
            mr={2}
            mb={2}
          >
            🎨 Design Systems
          </Text>
          <Text
            color="white"
            as="button"
            fontSize="12px"
            paddingY={1}
            paddingX={2}
            bg={currentFilter === "A11y" ? "brand.pink" : "brand.blue"}
            borderRadius={120}
            onClick={() => setCurrentFilter("A11y")}
            mr={2}
            mb={2}
          >
            🤝 Accessibility
          </Text>
          <Text
            color="white"
            as="button"
            fontSize="12px"
            paddingY={1}
            paddingX={2}
            bg={currentFilter === "Other" ? "brand.pink" : "brand.blue"}
            borderRadius={120}
            onClick={() => setCurrentFilter("Other")}
            mr={2}
            mb={2}
          >
            🚀 Miscellaneous
          </Text>
          <Text
            color="white"
            as="button"
            fontSize="12px"
            paddingY={1}
            paddingX={2}
            bg={currentFilter === "Brand Design" ? "brand.pink" : "brand.blue"}
            borderRadius={120}
            onClick={() => setCurrentFilter("Brand Design")}
            mr={2}
            mb={2}
          >
            🌈 Brand Design
          </Text>
        </Flex>

        {(currentFilter === "all" || currentFilter === "Design Systems") && (
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
              🎨 Design Systems
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
              {designSystemsProjects.map((project) => (
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

        {(currentFilter === "all" || currentFilter === "A11y") && (
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
              🤝 Accessibility
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

        {(currentFilter === "all" || currentFilter === "Other") && (
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
              🚀 Miscellaneous
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

        {(currentFilter === "all" || currentFilter === "Brand Design") && (
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
              🌈 Brand Design
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
      </Flex>
    </PageWrapper>
  );
}
