"use client";

import {
  Flex,
  Heading,
  Text,
  Box,
  Link as ChakraLink,
  Button,
  Image,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { PageWrapper } from "@/components/PageWrapper";

const experience = [
  {
    company: "GitHub",
    role: "Senior Design Engineer",
    period: "Nov 2025 – Present",
    logo: "/github.png",
    logoSize: "24px",
    current: true,
  },
  {
    company: "Smartsheet",
    role: "Senior Design Technologist II",
    period: "Feb 2024 – Oct 2025",
    logo: "/smar.png",
  },
  {
    company: "Endpoint",
    role: "Senior Design Technologist",
    period: "May 2023 – Feb 2024",
    logo: "/endpoint.png",
  },
  {
    company: "Color",
    role: "Design Technologist",
    period: "Dec 2021 – Mar 2023",
    logo: "/color.png",
  },
  {
    company: "Linus Health",
    role: "UX Engineer",
    period: "May 2021 – Dec 2021",
    logo: "/linus.png",
  },
  {
    company: "Charter Healthcare",
    role: "UX/UI Engineer",
    period: "May 2020 – May 2021",
    logo: "/charter.png",
  },
  {
    company: "TheraMind",
    role: "Web Developer & Designer",
    period: "Dec 2019 – May 2020",
    logo: "/theramind.png",
  },
];

const otherExperience = [
  {
    company: "GLIA Labs",
    role: "Designer, Engineer & Creator",
    period: "Nov 2019 – Present",
    logo: "/glialabs.png",
    current: true,
  },
  {
    company: "ADPList",
    role: "Design Engineering Mentor",
    period: "Feb 2024 – Feb 2026",
    logo: "/adplist.png",
  },
];

const education = [
  {
    program: "B.S. - Neuroscience",
    institution: "Westmont",
    note: "Dean's Scholarship",
    logo: "/westmont.png",
  },
  {
    program: "Social Entrepreneurship",
    institution: "Westmont",
    note: "C.S.E. Scholarship",
    logo: "/westmont.png",
  },
];

const honors = [
  {
    title: "Merge Award Winner, Hackathon",
    org: "GitHub",
    date: "Dec 2025",
    description:
      "Led a hackweek team in a bold reimagining of the GitHub platform design",
  },
  {
    title: "HTML & CSS Bootcamp Course",
    org: "Udemy",
    date: "Feb 2023",
    description: "Built and launched a top CSS course with Colt Steele",
  },
  {
    title: "A11y & Inclusion Award Winner",
    org: "Color",
    date: "Aug 2022",
    description:
      "Led a hackweek team to build a GitHub-like design review Figma widget",
  },
  {
    title: "Mastering Typescript Course",
    org: "Udemy",
    date: "July 2022",
    description: "Built and launched a top Typescript course with Colt Steele",
  },
];

const publications = [
  {
    title:
      "We Used UX Research After an Accessibility Audit. Here's What Happened.",
    publisher: "Human Centered",
    date: "Dec 2022",
    tag: "Tech",
  },
  {
    title: "Making Tech Products More Accessible in 5 Simple Steps",
    publisher: "Human Centered",
    date: "May 2022",
    tag: "Tech",
  },
  {
    title:
      "Assessment of multiple salivary biomarkers during rTMS treatment for major depression",
    publisher: "Psychiatry Research",
    date: "June 2021",
    tag: "Neuroscience",
  },
  {
    title:
      "Treating dissociative PTSD presenting as a functional movement disorder with TMS",
    publisher: "Neurological Sciences",
    date: "May 2020",
    tag: "Neuroscience",
  },
];

const selectedWork = [
  {
    title: "Toolbar Component Rebuild",
    company: "Smartsheet",
    link: "/projects/posts/toolbar",
    hasPassword: true,
  },
  {
    title: "Theme Architecture Refactor",
    company: "Smartsheet",
    link: "/projects/posts/theme-refactor",
    hasPassword: true,
  },
  {
    title: "Dynamic Token Layers",
    company: "Endpoint",
    link: "/projects/posts/dynamic-token-layers",
  },
  {
    title: "A11y Audit Program",
    company: "Color Health",
    link: "/projects/posts/a11y-kit",
  },
  {
    title: "UNIFY Design System",
    company: "Charter",
    link: "/projects/posts/unify",
  },
];

const writing = [
  {
    title: "Creating an A11y Auditing Kit",
    date: "June 2022",
    link: "/blog/posts/creating-an-a11y-auditing-kit",
  },
  {
    title: "My strengths, as told by others",
    date: "August 2022",
    link: "/blog/posts/my-strengths-as-told-by-others",
  },
];

const engagements = [
  {
    title: "Design Systems Panel + Brunch",
    type: "Panel",
    link: "/engagements/posts/design-systems-brunch",
  },
  {
    title: "One Bad Habit Podcast",
    type: "Podcast",
    link: "/engagements/posts/one-bad-habit",
  },
  {
    title: "SDSU + Friends of Figma",
    type: "Panel",
    link: "/engagements/posts/sdsu-friends-of-figma",
  },
];

const showcase = [
  {
    title: "ListRocket",
    description: "Productivity web app",
    link: "https://listrocket.app",
  },
  {
    title: "HTML/CSS Bootcamp",
    description: "Udemy course w/ Colt Steele",
    link: "https://www.udemy.com/course/html-and-css-bootcamp",
  },
  {
    title: "Typescript Course",
    description: "Udemy course w/ Colt Steele",
    link: "https://www.udemy.com/course/learn-typescript",
  },
];

const Section = ({
  title,
  children,
  href,
  ...props
}: {
  title: string;
  children: React.ReactNode;
  href?: string;
  [key: string]: any;
}) => (
  <Box
    border="1px solid"
    borderColor="brand.border"
    borderRadius="12px"
    bg="rgba(20, 20, 22, 0.6)"
    backdropFilter="blur(16px)"
    p={5}
    {...props}
  >
    <Flex justifyContent="space-between" alignItems="center" mb={4}>
      <Text
        fontSize="11px"
        fontWeight="600"
        textTransform="uppercase"
        letterSpacing="0.08em"
        color="brand.textMuted"
      >
        {title}
      </Text>
      {href && (
        <Text
          as={Link}
          href={href}
          fontSize="12px"
          color="brand.textMuted"
          _hover={{ color: "brand.text" }}
          transition="0.15s ease all"
        >
          View all →
        </Text>
      )}
    </Flex>
    {children}
  </Box>
);

export default function Home() {
  return (
    <PageWrapper>
      {/* Hero */}
      <Box
        border="1px solid"
        borderColor="brand.border"
        borderRadius="12px"
        bg="rgba(20, 20, 22, 0.6)"
        backdropFilter="blur(16px)"
        p={5}
        mb={4}
        width="100%"
      >
        <Flex
          alignItems={["flex-start", "flex-start", "center"]}
          justifyContent="space-between"
          flexDirection={["column", "column", "row"]}
          gap={[8, 8, 0]}
        >
          <Box>
            <Heading
              as="h1"
              fontSize={["32px", "40px", "48px"]}
              fontWeight="700"
              letterSpacing="-0.03em"
              lineHeight="1.1"
              mb={3}
            >
              Hi, I&apos;m Branon.
            </Heading>
            <Text
              fontSize={["16px", "18px"]}
              color="brand.textMuted"
              maxWidth="560px"
              lineHeight="1.6"
            >
              Design engineer currently building{" "}
              <Text as="span" color="brand.text" fontWeight="500">
                @ GitHub
              </Text>
              . I craft design systems, accessible interfaces, and tools that
              bridge design and engineering.
            </Text>

            {/* CTAs */}
            <Flex mt={5} gap={3}>
              <Button
                variant="primary"
                as="a"
                download
                href="/resume.pdf"
                size="sm"
              >
                Download Resume
              </Button>
              <Button variant="secondary" as={Link} href="/about" size="sm">
                More about me
              </Button>
            </Flex>
          </Box>

          {/* Peace sign graphic */}
          <Box
            position="relative"
            flexShrink={0}
            width={["180px", "200px", "240px"]}
            height={["180px", "200px", "240px"]}
            alignSelf={["center", "center", "auto"]}
          >
            <Image
              src="/me.png"
              alt="Branon doing peace signs"
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%) rotate(-6deg)"
              width="100%"
              height="100%"
              objectFit="contain"
            />
          </Box>
        </Flex>
      </Box>

      {/* Two-column layout */}
      <Flex
        gap={4}
        flexDirection={["column", "column", "row"]}
        alignItems="flex-start"
        mb={4}
      >
        {/* Left column */}
        <Flex
          flexDirection="column"
          gap={4}
          flex={1}
          width={["100%", "100%", "50%"]}
        >
          {/* Experience */}
          <Section title="Experience">
            <Flex flexDirection="column" gap={4}>
              {experience.map((role) => (
                <Flex key={role.company} gap={3} alignItems="flex-start">
                  <Box
                    width="36px"
                    height="36px"
                    minWidth="36px"
                    borderRadius="8px"
                    border="1px solid"
                    borderColor="brand.border"
                    bg="rgba(255, 255, 255, 0.06)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    overflow="hidden"
                    mt={0.5}
                  >
                    <Image
                      src={role.logo}
                      alt={role.company}
                      width={role.logoSize || "20px"}
                      height={role.logoSize || "20px"}
                      objectFit="contain"
                      borderRadius="4px"
                    />
                  </Box>
                  <Box>
                    <Flex alignItems="center" gap={2} mb={0.5}>
                      <Text fontSize="14px" fontWeight="600" color="brand.text">
                        {role.role} @ {role.company}
                      </Text>
                      {role.current && (
                        <Box
                          width="6px"
                          height="6px"
                          borderRadius="full"
                          bg="#22c55e"
                          flexShrink={0}
                        />
                      )}
                    </Flex>
                    <Text fontSize="12px" color="brand.textMuted">
                      {role.period}
                    </Text>
                  </Box>
                </Flex>
              ))}
            </Flex>

            {/* Other Experience */}
            <Box
              mt={5}
              pt={4}
              borderTop="1px solid"
              borderTopColor="brand.border"
            >
              <Text
                fontSize="11px"
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
                  <Flex key={role.company} gap={3} alignItems="flex-start">
                    <Box
                      width="36px"
                      height="36px"
                      minWidth="36px"
                      borderRadius="8px"
                      border="1px solid"
                      borderColor="brand.border"
                      bg="rgba(255, 255, 255, 0.06)"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      overflow="hidden"
                      mt={0.5}
                    >
                      <Image
                        src={role.logo}
                        alt={role.company}
                        width="20px"
                        height="20px"
                        objectFit="contain"
                        borderRadius="4px"
                      />
                    </Box>
                    <Box>
                      <Flex alignItems="center" gap={2} mb={0.5}>
                        <Text
                          fontSize="14px"
                          fontWeight="600"
                          color="brand.text"
                        >
                          {role.role} @ {role.company}
                        </Text>
                        {role.current && (
                          <Box
                            width="6px"
                            height="6px"
                            borderRadius="full"
                            bg="#22c55e"
                            flexShrink={0}
                          />
                        )}
                      </Flex>
                      <Text fontSize="12px" color="brand.textMuted">
                        {role.period}
                      </Text>
                    </Box>
                  </Flex>
                ))}
              </Flex>
            </Box>
          </Section>

          {/* Education */}
          <Section title="Education">
            <Flex flexDirection="column" gap={4}>
              {education.map((item) => (
                <Flex key={item.program} gap={3} alignItems="flex-start">
                  <Box
                    width="36px"
                    height="36px"
                    minWidth="36px"
                    borderRadius="8px"
                    border="1px solid"
                    borderColor="brand.border"
                    bg="rgba(255, 255, 255, 0.06)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    overflow="hidden"
                    mt={0.5}
                  >
                    <Image
                      src={item.logo}
                      alt={item.institution}
                      width="20px"
                      height="20px"
                      objectFit="contain"
                      borderRadius="4px"
                    />
                  </Box>
                  <Box>
                    <Text
                      fontSize="14px"
                      fontWeight="600"
                      color="brand.text"
                      mb={0.5}
                    >
                      {item.program} @ {item.institution}
                    </Text>
                    <Text fontSize="12px" color="brand.accent" opacity={0.8}>
                      {item.note}
                    </Text>
                  </Box>
                </Flex>
              ))}
              <Box>
                <Text fontSize="12px" color="brand.textMuted" lineHeight="1.7">
                  HTML, CSS, TypeScript, React, Copilot/AI, Figma, and tons more
                  🙂
                </Text>
              </Box>
            </Flex>
          </Section>

          {/* Speaking & Mentoring */}
          <Section title="Speaking & Mentoring" href="/engagements">
            <Flex flexDirection="column" gap={0}>
              {engagements.map((item) => (
                <ChakraLink
                  key={item.title}
                  as={Link}
                  href={item.link}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  paddingY={2.5}
                  borderBottom="1px solid"
                  borderBottomColor="brand.border"
                  _last={{ borderBottom: "none" }}
                  _hover={{
                    textDecoration: "none",
                    "& > span:first-of-type": { color: "brand.text" },
                  }}
                  transition="0.15s ease all"
                >
                  <Text
                    as="span"
                    fontSize="13px"
                    color="brand.textMuted"
                    transition="0.15s ease all"
                  >
                    {item.title}
                  </Text>
                  <Text
                    fontSize="12px"
                    color="brand.textMuted"
                    flexShrink={0}
                    ml={3}
                  >
                    {item.type}
                  </Text>
                </ChakraLink>
              ))}
              <ChakraLink
                href="https://adplist.org/mentors/branon-eusebio"
                isExternal
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                paddingY={2.5}
                _hover={{
                  textDecoration: "none",
                  "& > span:first-of-type": { color: "brand.text" },
                }}
                transition="0.15s ease all"
              >
                <Text
                  as="span"
                  fontSize="13px"
                  color="brand.textMuted"
                  transition="0.15s ease all"
                >
                  ADPList Mentoring
                </Text>
                <ExternalLinkIcon boxSize={3} color="brand.textMuted" />
              </ChakraLink>
            </Flex>
          </Section>

          {/* Publications */}
          <Section title="Publications">
            <Flex flexDirection="column" gap={0}>
              {publications.map((pub) => (
                <Box
                  key={pub.title}
                  paddingY={2.5}
                  borderBottom="1px solid"
                  borderBottomColor="brand.border"
                  _last={{ borderBottom: "none" }}
                >
                  <Flex
                    justifyContent="space-between"
                    alignItems="flex-start"
                    gap={3}
                  >
                    <Box flex={1} minWidth={0}>
                      <Text
                        fontSize="13px"
                        color="brand.textMuted"
                        lineHeight="1.5"
                      >
                        {pub.title}
                      </Text>
                      <Text fontSize="12px" color="brand.textMuted" mt={0.5}>
                        {pub.publisher}
                      </Text>
                    </Box>
                    <Flex flexShrink={0} alignItems="center" gap={2}>
                      <Box
                        fontSize="10px"
                        fontWeight="600"
                        textTransform="uppercase"
                        letterSpacing="0.05em"
                        color={pub.tag === "Tech" ? "brand.accent" : "#a78bfa"}
                        bg={
                          pub.tag === "Tech"
                            ? "rgba(96,165,250,0.1)"
                            : "rgba(167,139,250,0.1)"
                        }
                        px={2}
                        py={0.5}
                        borderRadius="4px"
                      >
                        {pub.tag}
                      </Box>
                      <Text
                        fontSize="12px"
                        color="brand.textMuted"
                        whiteSpace="nowrap"
                      >
                        {pub.date}
                      </Text>
                    </Flex>
                  </Flex>
                </Box>
              ))}
            </Flex>
          </Section>
        </Flex>

        {/* Right column */}
        <Flex
          flexDirection="column"
          gap={4}
          flex={1}
          width={["100%", "100%", "50%"]}
        >
          {/* Selected Work */}
          <Section title="Selected Work" href="/projects">
            <Flex flexDirection="column" gap={0}>
              {selectedWork.map((item) => (
                <ChakraLink
                  key={item.title}
                  as={Link}
                  href={item.link}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  paddingY={2.5}
                  borderBottom="1px solid"
                  borderBottomColor="brand.border"
                  _last={{ borderBottom: "none" }}
                  _hover={{
                    textDecoration: "none",
                    "& > div > span:first-of-type": { color: "brand.text" },
                  }}
                  transition="0.15s ease all"
                >
                  <Box>
                    <Text
                      as="span"
                      fontSize="13px"
                      color="brand.textMuted"
                      transition="0.15s ease all"
                    >
                      {item.title}
                    </Text>
                    {item.hasPassword && (
                      <Text
                        as="span"
                        fontSize="11px"
                        color="brand.textMuted"
                        ml={2}
                      >
                        🔒
                      </Text>
                    )}
                  </Box>
                  <Text
                    fontSize="12px"
                    color="brand.textMuted"
                    flexShrink={0}
                    ml={3}
                  >
                    {item.company}
                  </Text>
                </ChakraLink>
              ))}
            </Flex>
          </Section>

          {/* Writing */}
          <Section title="Writing" href="/blog">
            <Flex flexDirection="column" gap={0}>
              {writing.map((post) => (
                <ChakraLink
                  key={post.title}
                  as={Link}
                  href={post.link}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  paddingY={2.5}
                  borderBottom="1px solid"
                  borderBottomColor="brand.border"
                  _last={{ borderBottom: "none" }}
                  _hover={{
                    textDecoration: "none",
                    "& > span:first-of-type": { color: "brand.text" },
                  }}
                  transition="0.15s ease all"
                >
                  <Text
                    as="span"
                    fontSize="13px"
                    color="brand.textMuted"
                    transition="0.15s ease all"
                  >
                    {post.title}
                  </Text>
                  <Text
                    fontSize="12px"
                    color="brand.textMuted"
                    flexShrink={0}
                    ml={3}
                  >
                    {post.date}
                  </Text>
                </ChakraLink>
              ))}
            </Flex>
          </Section>

          {/* Honors & Awards */}
          <Section title="Honors & Awards">
            <Flex flexDirection="column" gap={0}>
              {honors.map((item) => (
                <Box
                  key={item.title}
                  paddingY={2.5}
                  borderBottom="1px solid"
                  borderBottomColor="brand.border"
                  _last={{ borderBottom: "none" }}
                >
                  <Flex
                    justifyContent="space-between"
                    alignItems="flex-start"
                    gap={3}
                  >
                    <Box>
                      <Text fontSize="13px" color="brand.text" fontWeight="500">
                        {item.title}
                      </Text>
                      <Text fontSize="12px" color="brand.textMuted" mt={0.5}>
                        {item.description}
                      </Text>
                    </Box>
                    <Text
                      fontSize="12px"
                      color="brand.textMuted"
                      flexShrink={0}
                      whiteSpace="nowrap"
                    >
                      {item.org} · {item.date}
                    </Text>
                  </Flex>
                </Box>
              ))}
            </Flex>
          </Section>

          {/* Showcase / Side Projects */}
          <Section title="Showcase">
            <Flex flexDirection="column" gap={0}>
              {showcase.map((item) => (
                <ChakraLink
                  key={item.title}
                  href={item.link}
                  isExternal
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  paddingY={2.5}
                  borderBottom="1px solid"
                  borderBottomColor="brand.border"
                  _last={{ borderBottom: "none" }}
                  _hover={{
                    textDecoration: "none",
                    "& > div > span:first-of-type": { color: "brand.text" },
                  }}
                  transition="0.15s ease all"
                >
                  <Box>
                    <Text
                      as="span"
                      fontSize="13px"
                      color="brand.textMuted"
                      transition="0.15s ease all"
                    >
                      {item.title}
                    </Text>
                    <Text
                      as="span"
                      fontSize="12px"
                      color="brand.textMuted"
                      ml={2}
                      display={["none", "inline"]}
                    >
                      {item.description}
                    </Text>
                  </Box>
                  <ExternalLinkIcon boxSize={3} color="brand.textMuted" />
                </ChakraLink>
              ))}
            </Flex>
          </Section>

          {/* Technologies */}
          <Section title="Technologies">
            <Flex flexWrap="wrap" gap={2}>
              {[
                { name: "TypeScript", color: "#3178c6" },
                { name: "React", color: "#61dafb" },
                { name: "Next.js", color: "#a1a1aa" },
                { name: "Figma", color: "#a259ff" },
                { name: "Copilot / AI", color: "#da70d6" },
                { name: "Design Tokens", color: "#f0abfc" },
                { name: "Web Components", color: "#e44d26" },
                { name: "Accessibility", color: "#22c55e" },
                { name: "CSS-in-JS", color: "#f472b6" },
                { name: "Styled Components", color: "#db7093" },
                { name: "Chakra UI", color: "#4fd1c5" },
                { name: "Jest", color: "#c63d14" },
                { name: "Cypress", color: "#69d3a7" },
                { name: "GraphQL", color: "#e535ab" },
                { name: "Node.js", color: "#68a063" },
                { name: "Git", color: "#f05032" },
              ].map((tech) => (
                <Box
                  key={tech.name}
                  fontSize="11px"
                  fontWeight="600"
                  letterSpacing="0.02em"
                  color={tech.color}
                  bg={`${tech.color}15`}
                  px={2.5}
                  py={1}
                  borderRadius="6px"
                  whiteSpace="nowrap"
                >
                  {tech.name}
                </Box>
              ))}
            </Flex>
          </Section>
        </Flex>
      </Flex>
    </PageWrapper>
  );
}
