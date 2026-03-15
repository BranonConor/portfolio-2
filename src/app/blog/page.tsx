"use client";

import { Flex, Heading, Text, Box, Link as ChakraLink } from "@chakra-ui/react";
import { PageWrapper } from "@/components/PageWrapper";
import { PaintStroke } from "@/components/PaintStroke";
import Link from "next/link";

export default function Blog() {
  const posts = [
    {
      title: "Creating an A11y Auditing Kit",
      category: "Accessibility",
      link: "/blog/posts/creating-an-a11y-auditing-kit",
      date: "June 2022",
      description:
        "How I established an accessibility auditing program that combined UX research with systematic a11y evaluation.",
    },
    {
      title: "My strengths, as told by others",
      category: "Culture",
      link: "/blog/posts/my-strengths-as-told-by-others",
      date: "August 2022",
      description:
        "A reflection on feedback from colleagues and what it reveals about my approach to collaboration and craft.",
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
        <Box
          border="1px solid"
          borderColor="brand.border"
          borderRadius="12px"
          bg="rgba(20, 20, 22, 0.6)"
          backdropFilter="blur(16px)"
          overflow="hidden"
          width="100%"
        >
          {/* Paint stroke header area */}
          <Box
            position="relative"
            width="100%"
            height={["80px", "100px", "120px"]}
            overflow="hidden"
            borderBottom="1px solid"
            borderBottomColor="brand.border"
          >
            <PaintStroke
              variant={3}
              top="-30px"
              left="-50px"
              width={["200px", "260px", "320px"]}
              opacity={0.35}
            />
            <PaintStroke
              variant={5}
              top="-20px"
              right="-40px"
              width={["180px", "220px", "280px"]}
              opacity={0.25}
            />
            <PaintStroke
              variant={2}
              bottom="-50px"
              left="40%"
              width={["160px", "200px", "240px"]}
              opacity={0.2}
              rotate={10}
            />
          </Box>

          <Box p={5} pb={3}>
            <Heading
              as="h1"
              fontSize={["28px", "36px"]}
              fontWeight="700"
              letterSpacing="-0.03em"
              mb={2}
            >
              Blog
            </Heading>
            <Text fontSize="15px" color="brand.textMuted">
              Updates, thoughts, and more.
            </Text>
          </Box>

          <Flex
            flexDirection="column"
            width="100%"
            gap={0}
            px={5}
            pb={3}
            sx={{ "& > *:hover + *::after": { transform: "scaleX(0)" } }}
          >
            {posts.map((post) => (
              <ChakraLink
                key={post.title}
                as={Link}
                href={post.link}
                display="flex"
                flexDirection={["column", "row"]}
                justifyContent="space-between"
                alignItems={["flex-start", "center"]}
                paddingY={4}
                position="relative"
                _after={{
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "1px",
                  bg: "brand.border",
                  transition: "0.18s ease all",
                  transformOrigin: "center",
                }}
                _hover={{
                  textDecoration: "none",
                  bg: "brand.surfaceHover",
                  marginX: -3,
                  paddingX: 3,
                  borderRadius: "10px",
                  zIndex: 1,
                  _after: { transform: "scaleX(0)" },
                }}
                transition="0.12s ease all"
              >
                <Box>
                  <Flex alignItems="center" gap={3} mb={1}>
                    <Text fontSize="15px" fontWeight="500" color="brand.text">
                      {post.title}
                    </Text>
                    <Text
                      fontSize="11px"
                      color="brand.textMuted"
                      bg="brand.surface"
                      paddingX={2}
                      paddingY={0.5}
                      borderRadius="6px"
                      display={["none", "block"]}
                    >
                      {post.category}
                    </Text>
                  </Flex>
                  <Text
                    fontSize="13px"
                    color="brand.textMuted"
                    maxWidth="500px"
                  >
                    {post.description}
                  </Text>
                </Box>
                <Text
                  fontSize="12px"
                  color="brand.textMuted"
                  opacity={0.6}
                  flexShrink={0}
                  ml={[0, 4]}
                  mt={[2, 0]}
                >
                  {post.date}
                </Text>
              </ChakraLink>
            ))}
          </Flex>
        </Box>
      </Flex>
    </PageWrapper>
  );
}
