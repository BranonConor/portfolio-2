"use client";

import {
  Flex,
  Button,
  Text,
  Box,
  Image,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { PageWrapper } from "@/components/PageWrapper";
import { PageHeading } from "@/components/PageHeading";
import { RetroCard } from "@/components/RetroCard";
import { SectionHeading } from "@/components/SectionHeading";
import Link from "next/link";
import { Photography, PhotoCarousel } from "@/components/sections/Photography";
import { Music, SpotifyEmbed } from "@/components/sections/Music";
import {
  experience,
  otherExperience,
  education,
  honors,
  publications,
} from "./consts";

const ABOUT_ACCENT = "#f05032";

const SparkleIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M12 3l1.8 5.4L19.2 10.2 13.8 12l-1.8 5.4L10.2 12 4.8 10.2 10.2 8.4 12 3z"
      fill="currentColor"
    />
    <path
      d="M19 14l.9 2.7L22.6 17.6 19.9 18.5 19 21.2 18.1 18.5 15.4 17.6 18.1 16.7 19 14z"
      fill="currentColor"
    />
  </svg>
);

const PencilIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M4 20h4l10-10-4-4L4 16v4z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 6l4 4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const RoleRow = ({
  role,
}: {
  role: {
    company: string;
    role: string;
    period: string;
    logo: string;
    logoSize?: string;
    current?: boolean;
  };
}) => (
  <Flex gap={3} alignItems="flex-start">
    <Box
      width="32px"
      height="32px"
      minWidth="32px"
      borderRadius="6px"
      border="2px solid"
      borderColor="brand.border"
      bg="brand.surface"
      display="flex"
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
    >
      <Image
        src={role.logo}
        alt={role.company}
        width={role.logoSize || "18px"}
        height={role.logoSize || "18px"}
        objectFit="contain"
        borderRadius="3px"
      />
    </Box>
    <Box>
      <Flex alignItems="center" gap={2} mb={0.5}>
        <Text textStyle="listTitle">
          {role.role} @ {role.company}
        </Text>
        {role.current && (
          <Box width="6px" height="6px" borderRadius="full" bg="#22c55e" flexShrink={0} />
        )}
      </Flex>
      <Text textStyle="listMeta">{role.period}</Text>
    </Box>
  </Flex>
);

export default function About() {
  return (
    <PageWrapper>
      <Flex
        width="100%"
        alignItems="flex-start"
        justifyContent="flex-start"
        flexDirection="column"
        gap={4}
      >
        <RetroCard>
          <Box p={5}>
            <PageHeading title="About Me" mb={2} />
            <Text
              as="p"
              fontSize="13px"
              color="brand.textMuted"
              mb={4}
              lineHeight="1.7"
            >
              From neuroscience to building technology, my passion for the human
              experience is the driving force in my life. As a design engineer,
              I work at the forefront of AI-driven development of tech products,
              specializing in design systems, accessibility, prototyping, and
              general frontend product work.
            </Text>
            <Text
              as="p"
              fontSize="13px"
              color="brand.textMuted"
              mb={5}
              lineHeight="1.7"
            >
              Outside of my main roles, I build fullstack web apps, create Udemy
              software development courses for tens of thousands of students, do
              web design/development for small businesses, and much more!
            </Text>

            <Flex flexDirection="row" width="auto" gap={3}>
              <Button
                variant="primaryOrange"
                as={Link}
                href="/projects"
                size="sm"
                leftIcon={<SparkleIcon />}
              >
                See my work
              </Button>
              <Button
                variant="secondary"
                as={Link}
                href="/blog"
                size="sm"
                leftIcon={<PencilIcon />}
              >
                Visit blog
              </Button>
            </Flex>
          </Box>
        </RetroCard>

        <Box
          display="grid"
          gridTemplateColumns={["1fr", "1fr", "1fr 1fr"]}
          gap={4}
          width="100%"
          alignItems="start"
        >
          <RetroCard
            p={5}
            gridColumn={["1", "1", "1"]}
            gridRow={["auto", "auto", "1"]}
            order={[1, 1, "unset"]}
          >
            <SectionHeading title="Experience" color={ABOUT_ACCENT} />
            <Flex flexDirection="column" gap={4}>
              {experience.map((role) => (
                <RoleRow key={role.company} role={role} />
              ))}
            </Flex>
            <Box mt={5} pt={4} borderTop="2px solid" borderTopColor="brand.border">
              <Text
                fontSize="10px"
                fontWeight="600"
                textTransform="uppercase"
                letterSpacing="0.08em"
                color="brand.textMuted"
                mb={3}
              >
                Other
              </Text>
              <Flex flexDirection="column" gap={4}>
                {otherExperience.map((role) => (
                  <RoleRow key={role.company} role={role} />
                ))}
              </Flex>
            </Box>
          </RetroCard>

          <RetroCard
            p={5}
            gridColumn={["1", "1", "1"]}
            gridRow={["auto", "auto", "2"]}
            order={[2, 2, "unset"]}
          >
            <SectionHeading title="Education" color={ABOUT_ACCENT} />
            <Flex flexDirection="column" gap={0}>
              {education.map((item, i) => (
                <Flex
                  key={item.program}
                  gap={3}
                  alignItems="flex-start"
                  paddingY={2.5}
                  borderTop={i === 0 ? "none" : "2px solid"}
                  borderTopColor="brand.border"
                >
                  <Box
                    width="32px"
                    height="32px"
                    minWidth="32px"
                    borderRadius="6px"
                    border="2px solid"
                    borderColor="brand.border"
                    bg="brand.surface"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    overflow="hidden"
                  >
                    <Image
                      src={item.logo}
                      alt={item.institution}
                      width="18px"
                      height="18px"
                      objectFit="contain"
                      borderRadius="3px"
                    />
                  </Box>
                  <Box>
                    <Text textStyle="listTitle">
                      {item.program} @ {item.institution}
                    </Text>
                    <Text textStyle="listMeta" mt={0.5}>
                      {item.note}
                    </Text>
                  </Box>
                </Flex>
              ))}
            </Flex>
          </RetroCard>

          <RetroCard
            p={5}
            gridColumn={["1", "1", "1"]}
            gridRow={["auto", "auto", "3"]}
            order={[3, 3, "unset"]}
          >
            <SectionHeading title="Honors & Accomplishments" color={ABOUT_ACCENT} />
            <Flex flexDirection="column" gap={0}>
              {honors.map((item, i) => (
                <Box
                  key={item.title}
                  paddingY={2.5}
                  borderTop={i === 0 ? "none" : "2px solid"}
                  borderTopColor="brand.border"
                >
                  <Flex justifyContent="space-between" alignItems="flex-start" gap={3}>
                    <Text textStyle="listTitle">{item.title}</Text>
                    <Text textStyle="listMeta" flexShrink={0} whiteSpace="nowrap">
                      {item.org} · {item.date}
                    </Text>
                  </Flex>
                </Box>
              ))}
            </Flex>
          </RetroCard>

          <RetroCard
            p={5}
            gridColumn={["1", "1", "2"]}
            gridRow={["auto", "auto", "1"]}
            order={[4, 4, "unset"]}
          >
            <SectionHeading title="Publications" color={ABOUT_ACCENT} />
            <Flex
              flexDirection="column"
              gap={0}
              sx={{
                "& > *:first-of-type::after": { display: "none" },
                "& > *:hover + *::after": { transform: "scaleX(0)" },
              }}
            >
              {publications.map((item) => (
                <ChakraLink
                  key={item.title}
                  href={item.link}
                  isExternal
                  display="block"
                  position="relative"
                  paddingY={2.5}
                  paddingX={3}
                  borderRadius="10px"
                  border="2px solid transparent"
                  _after={{
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 2,
                    right: 2,
                    height: "2px",
                    bg: "brand.border",
                    transition: "0.15s ease all",
                    transformOrigin: "center",
                  }}
                  _hover={{
                    textDecoration: "none",
                    bg: `${ABOUT_ACCENT}14`,
                    borderColor: `${ABOUT_ACCENT}55`,
                    transform: "translateX(3px)",
                    zIndex: 1,
                    _after: { transform: "scaleX(0)" },
                  }}
                  transition="0.14s ease all"
                >
                  <Flex justifyContent="space-between" alignItems="flex-start" gap={3}>
                    <Box flex={1} minWidth={0}>
                      <Flex alignItems="center" gap={2} mb={0.5} flexWrap="wrap">
                        <Text textStyle="listTitle">{item.title}</Text>
                        <Box
                          as="span"
                          fontSize="10px"
                          fontWeight="600"
                          letterSpacing="0.02em"
                          color={item.tag === "Tech" ? "#61dafb" : "#22c55e"}
                          bg={item.tag === "Tech" ? "#61dafb15" : "#22c55e15"}
                          px={2}
                          py={0.5}
                          borderRadius="4px"
                          whiteSpace="nowrap"
                        >
                          {item.tag}
                        </Box>
                      </Flex>
                      <Text textStyle="listMeta">
                        {item.publisher} · {item.date}
                      </Text>
                    </Box>
                    <ExternalLinkIcon boxSize={3} color="brand.textMuted" mt={0.5} flexShrink={0} />
                  </Flex>
                </ChakraLink>
              ))}
            </Flex>
          </RetroCard>

          <RetroCard
            p={5}
            gridColumn={["1", "1", "1"]}
            gridRow={["auto", "auto", "4"]}
            order={[5, 5, "unset"]}
          >
            <SectionHeading title="Music Production" color={ABOUT_ACCENT} />
            <Music />
          </RetroCard>
          <RetroCard
            gridColumn={["1", "1", "1"]}
            gridRow={["auto", "auto", "5"]}
            order={[6, 6, "unset"]}
          >
            <SpotifyEmbed />
          </RetroCard>

          <RetroCard
            p={5}
            gridColumn={["1", "1", "2"]}
            gridRow={["auto", "auto", "2"]}
            order={[7, 7, "unset"]}
          >
            <SectionHeading title="Photography & Digital Art" color={ABOUT_ACCENT} />
            <Photography />
            <Box mt={4}>
              <PhotoCarousel />
            </Box>
          </RetroCard>
        </Box>
      </Flex>
    </PageWrapper>
  );
}
