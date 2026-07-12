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
import { PaintStroke } from "@/components/PaintStroke";
import { PortraitCanvas } from "@/components/easter-egg";

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

const DownloadIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
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
    role: "UX Engineer",
    period: "May 2020 – May 2021",
    logo: "/charter.png",
  },
  {
    company: "TheraMind",
    role: "UX Engineer",
    period: "Dec 2019 – May 2020",
    logo: "/theramind.png",
  },
];

const otherExperience = [
  {
    company: "HumanHands",
    role: "Designer, Engineer & Creator",
    period: "Nov 2019 – Present",
    logo: "/humanhands.jpg",
    logoSize: "24px",
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
    title: "Hackathon: Merge Award Winner",
    org: "GitHub",
    date: "Dec 2025",
  },
  {
    title: "Hackathon: A11y & Inclusion Award Winner",
    org: "Color",
    date: "Aug 2022",
  },
];

const publications = [
  {
    title: "The Need for INCLUSION.md",
    publisher: "Designsystem.news",
    date: "May 2026",
    tag: "Tech",
    link: "https://designsystems.news/#:~:text=The%20need%20for%20INCLUSION.md",
  },
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
      "The Role of the Insula in Classical and Dissociative PTSD: A Double Case Study",
    publisher: "Neurocase",
    date: "Apr 2022",
    tag: "Neuroscience",
    link: "https://pubmed.ncbi.nlm.nih.gov/35452340/",
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

const projects = [
  {
    title: "INCLUSION.md 🧡",
    company: "Open Source",
    link: "/projects/posts/inclusion-md",
  },
  {
    title: "Reimagining GitHub 💭",
    company: "GitHub",
    link: "/projects/posts/reimagining-github",
  },
  {
    title: "Building thesis.social 💫",
    company: "HumanHands",
    link: "/projects/posts/thesis",
    hasPassword: true,
  },
  {
    title: "Loading Screen Revamp",
    company: "Smartsheet",
    link: "/projects/posts/loading-screen",
  },
  {
    title: "A11y Audit Program",
    company: "Color Health",
    link: "/projects/posts/a11y-kit",
  },
];

const writing = [
  {
    title: "The CLI is the New UI",
    date: "May 2026",
    link: "https://www.thesis.social/article/cmp73stnr000o04l6bxr194c5",
    external: true,
  },
  {
    title: "The need for INCLUSION.md",
    date: "May 2026",
    link: "/blog/posts/the-need-for-inclusion-md",
  },
  {
    title: "Creating an A11y Auditing Kit",
    date: "June 2022",
    link: "/blog/posts/creating-an-a11y-auditing-kit",
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

const inTheWild = [
  {
    title: "Secret scanning extended metadata",
    titleMobile: "Secret scanning extended metadata",
    source: "GitHub",
    date: "July 2026",
    logo: "/github.png",
    link: "/in-the-wild/posts/secret-scanning-extended-metadata",
  },
  {
    title: "Secret scanning public monitoring",
    source: "GitHub",
    date: "July 2026",
    logo: "/github.png",
    link: "https://github.blog/changelog/2026-07-01-secret-scanning-public-monitoring-for-enterprises/",
    external: true,
  },
  {
    title: "World's largest integrated health database",
    titleMobile: "World's largest integrated health DB",
    source: "The New York Times",
    date: "June 2026",
    logo: "/logos/nytimes.svg",
    link: "/in-the-wild/posts/nih-health-database",
  },
  {
    title: "Smartsheet's redesign: AI & a11y",
    source: "DesignRush",
    date: "October 2024",
    logo: "/logos/designrush.png",
    link: "/in-the-wild/posts/smartsheet-redesign",
  },
  {
    title: "DCTclock - TIME Best Inventions of 2021",
    source: "TIME",
    date: "November 2021",
    logo: "/logos/time.svg",
    link: "https://time.com/collections/best-inventions-2021/6113080/dctclock/",
    external: true,
  },
];

const showcase = [
  {
    title: "INCLUSION.md",
    description: "Context for inclusive AI design",
    link: "https://github.com/BranonConor/inclusion.md",
    icon: "/icons/repo-light.svg",
    tag: "Live",
  },
  {
    title: "Thesis",
    description: "AI-assisted knowledge network",
    link: "https://thesis.social",
    icon: "/thesis.png",
    tag: "Live",
  },
  {
    title: "ListRocket",
    description: "Collaborative event planning app",
    link: "https://listrocket.app",
    icon: "/listrocket.svg",
    tag: "Live",
  },
  {
    title: "HTML/CSS Bootcamp",
    description: "Udemy course w/ Colt Steele",
    link: "https://www.udemy.com/course/html-and-css-bootcamp",
    icon: "/udemy.png",
  },
  {
    title: "Typescript Course",
    description: "Udemy course w/ Colt Steele",
    link: "https://www.udemy.com/course/learn-typescript",
    icon: "/udemy.png",
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
      <HomeContent />
    </PageWrapper>
  );
}

function HomeContent() {

  return (
    <>
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
        overflow="hidden"
        position="relative"
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
              . I shape the craft and quality of interfaces used by millions —
              bridging design and code to build tools people genuinely love.
            </Text>

            {/* CTAs */}
            <Flex mt={5} gap={3}>
              <Button
                variant="primary"
                as={Link}
                href="/projects"
                size="sm"
                leftIcon={<SparkleIcon />}
              >
                See my work
              </Button>
              <Button
                variant="secondary"
                as="a"
                download
                href="/resume.pdf"
                size="sm"
                leftIcon={<DownloadIcon />}
              >
                Download resume
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
            {/* Subtle paint strokes behind portrait — mobile */}
            <PaintStroke
              variant={4}
              top="12px"
              right="-90px"
              width="1400px"
              opacity={0.3}
              rotate={65}
              scale={1.2}
              display={["block", "none", "none"]}
            />
            <PaintStroke
              variant={1}
              bottom="-140px"
              left="-118px"
              width="1500px"
              opacity={0.22}
              rotate={-40}
              scale={0.9}
              display={["block", "none", "none"]}
            />
            <PaintStroke
              variant={2}
              top="35%"
              left="40%"
              width="640px"
              opacity={0.16}
              rotate={85}
              flip
              display={["block", "none", "none"]}
            />

            {/* // Tablet! */}
            <PaintStroke
              variant={4}
              top="-10px"
              right="-170px"
              width="1400px"
              opacity={0.3}
              rotate={65}
              scale={1.5}
              display={["none", "block", "none"]}
            />
            <PaintStroke
              variant={1}
              bottom="-120px"
              left="-232px"
              width="1500px"
              opacity={0.22}
              rotate={-40}
              scale={1.2}
              display={["none", "block", "none"]}
            />
            <PaintStroke
              variant={2}
              top="35%"
              left="40%"
              width="640px"
              opacity={0.16}
              rotate={85}
              flip
              display={["none", "block", "none"]}
            />

            {/* Subtle paint strokes behind portrait — tablet & desktop */}
            <PaintStroke
              variant={4}
              top="-10px"
              right="-20px"
              width={["250px", "250px", "260px"]}
              opacity={0.3}
              rotate={40}
              scale={1.4}
              display={["none", "none", "block"]}
            />
            <PaintStroke
              variant={1}
              bottom="-80px"
              left="-84px"
              width={["280px", "280px", "300px"]}
              opacity={0.22}
              rotate={20}
              scale={1.2}
              display={["none", "none", "block"]}
            />
            <PaintStroke
              variant={2}
              top="35%"
              left="40%"
              width={["180px", "180px", "190px"]}
              opacity={0.16}
              rotate={85}
              flip
              display={["none", "none", "block"]}
            />
            {/* Mobile: static image */}
            <Image
              src="/me-light.png"
              alt="Branon doing peace signs"
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%) rotate(-6deg)"
              width="100%"
              height="100%"
              objectFit="contain"
              zIndex={1}
              userSelect="none"
              display={["block", "block", "none"]}
            />
            {/* Desktop: interactive particle canvas */}
            <Box
              display={["none", "none", "block"]}
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              width="100%"
              height="100%"
              zIndex={1}
            >
              <PortraitCanvas src="/me-light.png" width={240} height={240} />
            </Box>
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
                  borderRadius="100%"
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
          display={["contents", "contents", "flex"]}
        >
          {/* Experience */}
          <Box order={[1, 1, 0]} width="100%">
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
              </Box>
            </Section>
          </Box>

          {/* Education */}
          <Box order={[5, 5, 0]} width="100%">
            <Section title="Education">
              <Flex
                flexDirection="column"
                gap={0}
                sx={{ "& > *:first-child": { borderTop: "none" } }}
              >
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
          </Box>

          {/* Community Engagements */}
          <Box order={[4, 4, 0]} width="100%">
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
          </Box>

          {/* Honors & Accomplishments */}
          <Box order={[8, 8, 0]} width="100%">
            <Section title="Honors & Accomplishments">
              <Flex
                flexDirection="column"
                gap={0}
                sx={{ "& > *:first-child": { borderTop: "none" } }}
              >
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
          </Box>

          {/* Skills */}
          {/* Writing */}
          <Box order={[7, 7, 0]} width="100%">
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
                    {...(post.external
                      ? { href: post.link, isExternal: true }
                      : { as: Link, href: post.link })}
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
                    <Flex alignItems="center" gap={2}>
                      <Text
                        as="span"
                        textStyle="listTitle"
                        transition="0.12s ease all"
                      >
                        {post.title}
                      </Text>
                    </Flex>
                    <Flex alignItems="center" gap={2} flexShrink={0} ml={3}>
                      <Text textStyle="listMeta">{post.date}</Text>
                      {post.external && (
                        <ExternalLinkIcon boxSize={3} color="brand.textMuted" />
                      )}
                    </Flex>
                  </ChakraLink>
                ))}
              </Flex>
            </Section>
          </Box>

          {/* Skills */}
          <Box order={[9, 9, 0]} width="100%">
            <Section title="Skills">
              <Flex flexWrap="wrap" gap={2}>
                {[
                  { name: "TypeScript", color: "#3178c6" },
                  { name: "React", color: "#61dafb" },
                  { name: "HTML", color: "#e44d26" },
                  { name: "CSS", color: "#f472b6" },
                  { name: "Design Systems", color: "#f59e0b" },
                  { name: "Figma", color: "#a259ff" },
                  { name: "AI", color: "#da70d6" },
                  { name: "Git", color: "#f05032" },
                  { name: "Accessibility", color: "#22c55e" },
                  { name: "Testing", color: "#69d3a7" },
                  { name: "Prototyping", color: "#f0abfc" },
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
          </Box>
        </Flex>

        {/* Right column */}
        <Flex
          flexDirection="column"
          gap={4}
          flex={1}
          width={["100%", "100%", "50%"]}
          display={["contents", "contents", "flex"]}
        >
          {/* Showcase / Side Projects */}
          <Box order={[2, 2, 0]} width="100%">
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
                    <Flex alignItems="center" gap={2.5} flex={1} minWidth={0}>
                      {item.icon && (
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
                        >
                          <Image
                            src={item.icon}
                            alt={item.title}
                            width="20px"
                            height="20px"
                            objectFit="contain"
                            borderRadius="4px"
                          />
                        </Box>
                      )}
                      <Box minWidth={0}>
                        <Flex alignItems="center" gap={2}>
                          <Text
                            as="span"
                            textStyle="listTitle"
                            transition="0.12s ease all"
                          >
                            {item.title}
                          </Text>
                          {item.tag && (
                            <Box
                              as="span"
                              fontSize="11px"
                              fontWeight="600"
                              letterSpacing="0.02em"
                              color="#22c55e"
                              bg="#22c55e15"
                              px={2.5}
                              py={1}
                              borderRadius="6px"
                              verticalAlign="middle"
                              whiteSpace="nowrap"
                              display="inline-block"
                              flexShrink={0}
                            >
                              {item.tag}
                            </Box>
                          )}
                        </Flex>
                        <Text textStyle="listMeta" mt={0.5}>
                          {item.description}
                        </Text>
                      </Box>
                    </Flex>
                    <ExternalLinkIcon boxSize={3} color="brand.textMuted" />
                  </ChakraLink>
                ))}
              </Flex>
            </Section>
          </Box>

          {/* Projects */}
          <Box order={[3, 3, 0]} width="100%">
            <Section title="Projects" href="/projects">
              <Flex
                flexDirection="column"
                gap={0}
                sx={{
                  "& > *:first-child::after": { display: "none" },
                  "& > *:hover + *::after": { transform: "scaleX(0)" },
                }}
              >
                {projects.map((item) => (
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
          </Box>

          {/* In the Wild */}
          <Box order={[2, 2, 0]} width="100%">
            <Section title="In the Wild" href="/in-the-wild">
              <Flex
                flexDirection="column"
                gap={0}
                sx={{
                  "& > *:first-child::after": { display: "none" },
                  "& > *:hover + *::after": { transform: "scaleX(0)" },
                }}
              >
                {inTheWild.map((item) => (
                  <ChakraLink
                    key={item.title}
                    {...((item as { external?: boolean }).external
                      ? {
                          href: item.link,
                          isExternal: true,
                          target: "_blank",
                          rel: "noopener noreferrer",
                        }
                      : { as: Link, href: item.link })}
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
                      <Flex alignItems="center" gap={2.5} flex={1} minWidth={0}>
                        {item.logo && (
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
                          >
                            <Image
                              src={item.logo}
                              alt={item.source}
                              width="20px"
                              height="20px"
                              objectFit="contain"
                              borderRadius="4px"
                            />
                          </Box>
                        )}
                        <Box minWidth={0}>
                          <Text textStyle="listTitle">
                            {(item as { titleMobile?: string }).titleMobile ? (
                              <>
                                <Box
                                  as="span"
                                  display={{ base: "inline", md: "none" }}
                                >
                                  {
                                    (item as { titleMobile?: string })
                                      .titleMobile
                                  }
                                </Box>
                                <Box
                                  as="span"
                                  display={{ base: "none", md: "inline" }}
                                >
                                  {item.title}
                                </Box>
                              </>
                            ) : (
                              item.title
                            )}
                          </Text>
                          <Text textStyle="listMeta" mt={0.5}>
                            {item.source} · {item.date}
                          </Text>
                        </Box>
                      </Flex>
                    </Flex>
                  </ChakraLink>
                ))}
              </Flex>
            </Section>
          </Box>

          {/* Publications */}
          <Box order={[6, 6, 0]} width="100%">
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
                        <Box
                          display={{ base: "inline-flex", md: "none" }}
                          mt={2}
                          fontSize="10px"
                          fontWeight="600"
                          textTransform="uppercase"
                          letterSpacing="0.05em"
                          color={
                            pub.tag === "Tech" ? "brand.accent" : "#a78bfa"
                          }
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
                      </Box>
                      <Flex
                        flexShrink={0}
                        alignItems="center"
                        gap={2}
                        mt={0.5}
                      >
                        <Box
                          display={{ base: "none", md: "inline-flex" }}
                          fontSize="10px"
                          fontWeight="600"
                          textTransform="uppercase"
                          letterSpacing="0.05em"
                          color={
                            pub.tag === "Tech" ? "brand.accent" : "#a78bfa"
                          }
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
          </Box>
        </Flex>
      </Flex>
    </>
  );
}
