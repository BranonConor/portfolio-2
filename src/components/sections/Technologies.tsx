import {
  Box,
  Heading,
  Image,
  useColorModeValue,
  Tooltip,
  Grid,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useCallback, useState } from "react";

export const Technologies = () => {
  const [activeHover, setActiveHover] = useState<number | null>(null);
  const bg = useColorModeValue("brand.lightBg", "brand.darkBg");
  const logoBg = useColorModeValue("brand.lightGrey", "black");
  const itemShadow = useColorModeValue(
    "0px 4px 15px 0px rgba(0,0,0, 0.2)",
    "0px 4px 15px 0px rgba(226,175,255, 0.2)"
  );
  const secondaryShadow = useColorModeValue(
    "0px 2px 5px 0px rgba(0,0,0, 0.15)",
    "0px 2px 5px 0px rgba(226,175,255, 0.15)"
  );
  const technologies: { name: string; image: string }[] = [
    { name: "HTML", image: "html.svg" },
    { name: "CSS", image: "css.svg" },
    { name: "Javascript", image: "javascript.svg" },
    { name: "Typescript", image: "typescript.svg" },
    { name: "React", image: "react-logo.svg" },
    { name: "NextJS", image: "next.svg" },
    { name: "GatsbyJS", image: "gatsby.svg" },
    { name: "Figma", image: "figma.svg" },
    { name: "Styled Components", image: "styled-components.svg" },
    { name: "SASS", image: "sass.svg" },
    { name: "Chakra UI", image: "chakra.svg" },
    { name: "Material UI", image: "material-ui.svg" },
    { name: "Bootstrap", image: "bootstrap.svg" },
    { name: "Jest", image: "jest.svg" },
    { name: "Cypress", image: "cypress.svg" },
    { name: "Contentful CMS", image: "contentful.svg" },
    { name: "React Query", image: "react-query.svg" },
    { name: "GraphQL", image: "graphql.svg" },
    { name: "MongoDB", image: "mongodb.svg" },
    { name: "Git", image: "git.svg" },
    { name: "Github", image: "github.svg" },
    { name: "NPM", image: "npm.svg" },
    { name: "Express", image: "express.svg" },
    { name: "Node", image: "node.svg" },
    { name: "Netlify", image: "netlify.svg" },
    { name: "AWS", image: "aws.svg" },
    { name: "Atlassian", image: "atlassian.svg" },
    { name: "Axe DevTools", image: "axe.svg" },
  ];
  const getScale = useCallback(
    (index: number, activeHover: null | number) => {
      if (activeHover !== null) {
        // if there's a valid item before and the active hover is the one after it, scale it up
        if (technologies[activeHover - 1] && activeHover - 1 === index) {
          return 1.075;
        }
        // if there's a valid item after and the active hover is the one before it, scale it up
        if (technologies[activeHover + 1] && activeHover + 1 === index) {
          return 1.075;
        }
      } else {
        return 1;
      }
    },
    [activeHover]
  );
  const getShadow = useCallback(
    (index: number, activeHover: null | number) => {
      if (activeHover !== null) {
        // if there's a valid item before and the active hover is the one after it, scale it up
        if (technologies[activeHover - 1] && activeHover - 1 === index) {
          return secondaryShadow;
        }
        // if there's a valid item after and the active hover is the one before it, scale it up
        if (technologies[activeHover + 1] && activeHover + 1 === index) {
          return secondaryShadow;
        }
        return "none";
      } else {
        return "none";
      }
    },
    [activeHover]
  );

  return (
    <Box
      marginY={[8, 10, 12]}
      borderRadius={8}
      bg={bg}
      width="100%"
      padding={4}
      _hover={{
        div: {
          transform: "scale(0.95)",
        },
      }}
    >
      <Heading as="h3" size="l" fontWeight={700} mb={4}>
        My Tools and Tech
      </Heading>
      <Grid
        gridGap={4}
        gridTemplateColumns={[
          "repeat(4, 1fr)",
          "repeat(6, 1fr)",
          "repeat(8, 1fr)",
          "repeat(10, 1fr)",
          "repeat(12, 1fr)",
          "repeat(14, 1fr)",
          "repeat(16, 1fr)",
        ]}
        transition="0.2s ease all"
      >
        {technologies.map((item, index) => {
          console.log(getScale(index, activeHover));
          return (
            <Tooltip
              id={item.name}
              borderRadius={6}
              label={item.name}
              fontSize="md"
              placement="top"
              bg="brand.gradient"
              color="white"
              fontWeight="bold"
              gutter={8}
            >
              <Image
                onMouseEnter={() => setActiveHover(index)}
                onMouseLeave={() => setActiveHover(null)}
                draggable="false"
                as={motion.img}
                borderRadius={6}
                src={`/logos/${item.image}`}
                padding={1}
                boxSizing="border-box"
                bg={logoBg}
                transform={`scale(${getScale(index, activeHover)})`}
                transition="0.2s ease all"
                boxShadow={getShadow(index, activeHover)}
                // whileHover={{
                //   scale: 1.1,
                //   transition: { duration: 0.05, type: "spring" },
                //   boxShadow: itemShadow,
                // }}
                // whileTap={{
                //   scale: 1.2,
                //   transition: { duration: 0.1 },
                // }}
                _hover={{
                  transform: "scale(1.2)",
                  transition: "0.35s ease all",
                  boxShadow: itemShadow,
                  zIndex: 5,
                }}
              />
            </Tooltip>
          );
        })}
      </Grid>
    </Box>
  );
};
