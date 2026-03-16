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
import { motion } from "framer-motion";
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
    link: "https://medium.com/color-research-design/we-used-ux-research-after-an-accessibility-audit-heres-what-happened-e84ac05ae20a",
  },
  {
    title: "Making Tech Products More Accessible in 5 Simple Steps",
    publisher: "Human Centered",
    date: "May 2022",
    tag: "Tech",
    link: "https://medium.com/color-research-design/making-tech-products-accessible-in-5-simple-steps-4dd09c1ceff4",
  },
  {
    title:
      "Assessment of multiple salivary biomarkers during rTMS treatment for major depression",
    publisher: "Psychiatry Research",
    date: "June 2021",
    tag: "Neuroscience",
    link: "https://pubmed.ncbi.nlm.nih.gov/34144510/",
  },
  {
    title:
      "Treating dissociative PTSD presenting as a functional movement disorder with TMS",
    publisher: "Neurological Sciences",
    date: "May 2020",
    tag: "Neuroscience",
    link: "https://pubmed.ncbi.nlm.nih.gov/32358703/",
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
          transition="0.12s ease all"
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
              <Text
                as="span"
                color="brand.text"
                fontWeight="500"
                position="relative"
                display="inline-block"
                zIndex={1}
              >
                @ GitHub
                {[
                  {
                    size: 16,
                    top: 0,
                    left: 16,
                    delay: 0,
                    dur: 2.4,
                    x: [-6, -12],
                    y: [-4, -22],
                  },
                  {
                    size: 13,
                    top: 2,
                    left: 40,
                    delay: 0.5,
                    dur: 2.0,
                    x: [3, 8],
                    y: [-2, -26],
                  },
                  {
                    size: 14,
                    top: -2,
                    left: 60,
                    delay: 1.2,
                    dur: 2.6,
                    x: [4, 12],
                    y: [-6, -16],
                  },
                  {
                    size: 12,
                    top: 4,
                    left: 28,
                    delay: 1.8,
                    dur: 2.2,
                    x: [-2, -8],
                    y: [-2, -28],
                  },
                  {
                    size: 15,
                    top: 0,
                    left: 50,
                    delay: 2.5,
                    dur: 2.3,
                    x: [2, 6],
                    y: [-4, -20],
                  },
                ].map((s, i) => (
                  <motion.div
                    key={i}
                    style={{
                      position: "absolute",
                      top: s.top,
                      left: s.left,
                      width: s.size,
                      height: s.size,
                      pointerEvents: "none",
                      display: "var(--sparkle-desktop)",
                      zIndex: -1,
                    }}
                    animate={{
                      opacity: [0, 0, 0.55, 0.4, 0],
                      x: s.x,
                      y: s.y,
                      scale: [0.3, 0.6, 1.15, 0.9, 0.2],
                    }}
                    transition={{
                      duration: s.dur,
                      delay: s.delay,
                      repeat: Infinity,
                      repeatDelay: 1.5,
                      ease: "easeOut",
                    }}
                  >
                    <Image
                      src="/github.png"
                      alt=""
                      aria-hidden="true"
                      width="100%"
                      height="100%"
                      objectFit="contain"
                      borderRadius="100%"
                    />
                  </motion.div>
                ))}
              </Text>
              . I craft elevated experiences on globally-loved platforms to
              delight users and supercharge their tech tools.
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
            {/* Mobile sparkles — emanate from portrait */}
            {[
              {
                size: 26,
                top: "30%",
                left: "10%",
                delay: 0,
                dur: 2.4,
                x: [-14, -28],
                y: [-10, -34],
                gif: "/monacat.gif",
              },
              {
                size: 22,
                top: "20%",
                left: "65%",
                delay: 0.6,
                dur: 2.0,
                x: [10, 22],
                y: [-8, -36],
                gif: "/mona-laugh.gif",
              },
              {
                size: 24,
                top: "35%",
                left: "78%",
                delay: 1.3,
                dur: 2.6,
                x: [12, 28],
                y: [-12, -26],
                gif: "/mona-tongue.gif",
              },
              {
                size: 20,
                top: "18%",
                left: "32%",
                delay: 1.9,
                dur: 2.2,
                x: [-6, -18],
                y: [-6, -38],
                gif: "/mona-mindblown.gif",
              },
              {
                size: 23,
                top: "22%",
                left: "50%",
                delay: 2.6,
                dur: 2.3,
                x: [6, 16],
                y: [-10, -30],
                gif: "/monacat.gif",
              },
              {
                size: 18,
                top: "26%",
                left: "22%",
                delay: 3.3,
                dur: 2.1,
                x: [-12, -22],
                y: [-8, -34],
                gif: "/mona-laugh.gif",
              },
            ].map((s, i) => (
              <motion.div
                key={`mobile-${i}`}
                style={{
                  position: "absolute",
                  top: s.top,
                  left: s.left,
                  width: s.size,
                  height: s.size,
                  pointerEvents: "none",
                  display: "var(--sparkle-mobile)",
                }}
                animate={{
                  opacity: [0, 0, 0.8, 0.65, 0],
                  x: s.x,
                  y: s.y,
                  scale: [0.3, 0.55, 1.1, 0.9, 0.2],
                }}
                transition={{
                  duration: s.dur,
                  delay: s.delay,
                  repeat: Infinity,
                  repeatDelay: 1.5,
                  ease: "easeOut",
                }}
              >
                <Image
                  src={s.gif}
                  alt=""
                  aria-hidden="true"
                  width="100%"
                  height="100%"
                  objectFit="cover"
                  borderRadius="100%"
                />
              </motion.div>
            ))}
            {/* Mobile GitHub logo sparkles — sparse, behind mona gifs */}
            {[
              {
                size: 15,
                top: "15%",
                left: "72%",
                delay: 0.3,
                dur: 2.5,
                x: [8, 18],
                y: [-6, -20],
              },
              {
                size: 13,
                top: "38%",
                left: "5%",
                delay: 1.6,
                dur: 2.3,
                x: [-10, -20],
                y: [-4, -18],
              },
              {
                size: 14,
                top: "24%",
                left: "88%",
                delay: 2.9,
                dur: 2.1,
                x: [6, 14],
                y: [-8, -24],
              },
            ].map((s, i) => (
              <motion.div
                key={`mobile-gh-${i}`}
                style={{
                  position: "absolute",
                  top: s.top,
                  left: s.left,
                  width: s.size,
                  height: s.size,
                  pointerEvents: "none",
                  display: "var(--sparkle-mobile)",
                  zIndex: -1,
                }}
                animate={{
                  opacity: [0, 0, 0.5, 0.35, 0],
                  x: s.x,
                  y: s.y,
                  scale: [0.3, 0.6, 1.15, 0.9, 0.2],
                }}
                transition={{
                  duration: s.dur,
                  delay: s.delay,
                  repeat: Infinity,
                  repeatDelay: 1.5,
                  ease: "easeOut",
                }}
              >
                <Image
                  src="/github.png"
                  alt=""
                  aria-hidden="true"
                  width="100%"
                  height="100%"
                  objectFit="contain"
                />
              </motion.div>
            ))}
          </Box>
        </Flex>
      </Box>

      {/* Two-column layout */}
      <Flex
        gap={4}
        flexDirection={["column", "column", "row"]}
        alignItems="flex-start"
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
                      <Text textStyle="listTitle">
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
                    <Text textStyle="listMeta">{role.period}</Text>
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
                        <Text textStyle="listTitle">
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
                      <Text textStyle="listMeta">{role.period}</Text>
                    </Box>
                  </Flex>
                ))}
              </Flex>
            </Box>
          </Section>

          {/* Education */}
          <Section title="Education">
            <Flex flexDirection="column" gap={0}>
              {education.map((item) => (
                <Flex
                  key={item.program}
                  gap={3}
                  alignItems="flex-start"
                  paddingY={2.5}
                  borderTop="1px solid"
                  borderTopColor="brand.border"
                >
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
          </Section>

          {/* Community Engagements */}
          <Section title="Community Engagements" href="/engagements">
            <Flex
              flexDirection="column"
              gap={0}
              sx={{
                "& > *:first-child::after": { display: "none" },
                "& > *:hover + *::after": { transform: "scaleX(0)" },
              }}
            >
              {engagements.map((item) => (
                <ChakraLink
                  key={item.title}
                  as={Link}
                  href={item.link}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  paddingY={2.5}
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
                    "& > span:first-of-type": { color: "brand.text" },
                  }}
                  transition="0.12s ease all"
                >
                  <Text
                    as="span"
                    textStyle="listTitle"
                    transition="0.12s ease all"
                  >
                    {item.title}
                  </Text>
                  <Text textStyle="listMeta" flexShrink={0} ml={3}>
                    {item.type}
                  </Text>
                </ChakraLink>
              ))}
              <ChakraLink
                as={Link}
                href="/engagements/posts/adplist"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                paddingY={2.5}
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
                  "& > span:first-of-type": { color: "brand.text" },
                }}
                transition="0.12s ease all"
              >
                <Text
                  as="span"
                  textStyle="listTitle"
                  transition="0.12s ease all"
                >
                  ADPList Mentoring
                </Text>
                <Text textStyle="listMeta" flexShrink={0} ml={3}>
                  Mentoring
                </Text>
              </ChakraLink>
            </Flex>
          </Section>

          {/* Publications */}
          <Section title="Publications">
            <Flex
              flexDirection="column"
              gap={0}
              sx={{
                "& > *:first-child::after": { display: "none" },
                "& > *:hover + *::after": { transform: "scaleX(0)" },
              }}
            >
              {publications.map((pub) => (
                <ChakraLink
                  key={pub.title}
                  href={pub.link}
                  isExternal
                  display="block"
                  paddingY={2.5}
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
                  <Flex
                    justifyContent="space-between"
                    alignItems="flex-start"
                    gap={3}
                  >
                    <Box flex={1} minWidth={0}>
                      <Text textStyle="listTitle">{pub.title}</Text>
                      <Text textStyle="listMeta" mt={0.5}>
                        {pub.publisher} · {pub.date}
                      </Text>
                    </Box>
                    <Flex flexShrink={0} alignItems="center" gap={2} mt={0.5}>
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
                      <ExternalLinkIcon boxSize={3} color="brand.textMuted" />
                    </Flex>
                  </Flex>
                </ChakraLink>
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
            <Flex
              flexDirection="column"
              gap={0}
              sx={{
                "& > *:first-child::after": { display: "none" },
                "& > *:hover + *::after": { transform: "scaleX(0)" },
              }}
            >
              {selectedWork.map((item) => (
                <ChakraLink
                  key={item.title}
                  as={Link}
                  href={item.link}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  paddingY={2.5}
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
                    "& > div > span:first-of-type": { color: "brand.text" },
                  }}
                  transition="0.12s ease all"
                >
                  <Box>
                    <Text
                      as="span"
                      textStyle="listTitle"
                      transition="0.12s ease all"
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
                  <Text textStyle="listMeta" flexShrink={0} ml={3}>
                    {item.company}
                  </Text>
                </ChakraLink>
              ))}
            </Flex>
          </Section>

          {/* Writing */}
          <Section title="Writing" href="/blog">
            <Flex
              flexDirection="column"
              gap={0}
              sx={{
                "& > *:first-child::after": { display: "none" },
                "& > *:hover + *::after": { transform: "scaleX(0)" },
              }}
            >
              {writing.map((post) => (
                <ChakraLink
                  key={post.title}
                  as={Link}
                  href={post.link}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  paddingY={2.5}
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
                    "& > span:first-of-type": { color: "brand.text" },
                  }}
                  transition="0.12s ease all"
                >
                  <Text
                    as="span"
                    textStyle="listTitle"
                    transition="0.12s ease all"
                  >
                    {post.title}
                  </Text>
                  <Text textStyle="listMeta" flexShrink={0} ml={3}>
                    {post.date}
                  </Text>
                </ChakraLink>
              ))}
            </Flex>
          </Section>

          {/* Honors & Accomplishments */}
          <Section title="Honors & Accomplishments">
            <Flex flexDirection="column" gap={0}>
              {honors.map((item) => (
                <Box
                  key={item.title}
                  paddingY={2.5}
                  borderTop="1px solid"
                  borderTopColor="brand.border"
                >
                  <Flex
                    justifyContent="space-between"
                    alignItems="flex-start"
                    gap={3}
                  >
                    <Box>
                      <Text textStyle="listTitle">{item.title}</Text>
                      <Text textStyle="listMeta" mt={0.5}>
                        {item.description}
                      </Text>
                    </Box>
                    <Text
                      textStyle="listMeta"
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
            <Flex
              flexDirection="column"
              gap={0}
              sx={{
                "& > *:first-child::after": { display: "none" },
                "& > *:hover + *::after": { transform: "scaleX(0)" },
              }}
            >
              {showcase.map((item) => (
                <ChakraLink
                  key={item.title}
                  href={item.link}
                  isExternal
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  paddingY={2.5}
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
                    "& > div > span:first-of-type": { color: "brand.text" },
                  }}
                  transition="0.12s ease all"
                >
                  <Box>
                    <Text
                      as="span"
                      textStyle="listTitle"
                      transition="0.12s ease all"
                    >
                      {item.title}
                    </Text>
                    <Text
                      as="span"
                      textStyle="listMeta"
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
