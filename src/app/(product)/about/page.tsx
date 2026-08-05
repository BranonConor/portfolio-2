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
import { pixelFont } from "@/components/boot-intro/pixelFont";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";
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

const GithubEvaporation = () => {
  const reduceMotion = useReducedMotion();
  const particles = [
    { left: "5%", delay: 0, size: 9, drift: -5 },
    { left: "28%", delay: 0.75, size: 12, drift: 6 },
    { left: "54%", delay: 1.45, size: 8, drift: -3 },
    { left: "76%", delay: 2.1, size: 11, drift: 5 },
  ];

  return (
    <Box as="span" position="relative" display="inline-block" color="brand.text">
      GitHub
      {!reduceMotion &&
        particles.map((particle) => (
          <motion.span
            key={`${particle.left}-${particle.delay}`}
            aria-hidden="true"
            style={{
              position: "absolute",
              left: particle.left,
              top: "-6px",
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              pointerEvents: "none",
              borderRadius: "50%",
              background: "#F7F2E4",
              boxSizing: "border-box",
              border: "1px solid rgba(51, 44, 28, 0.2)",
              boxShadow: "0 2px 5px rgba(51, 44, 28, 0.16)",
              overflow: "hidden",
            }}
            animate={{
              y: [0, -10, -22],
              x: [0, particle.drift / 2, particle.drift],
              opacity: [0, 0.72, 0],
              scale: [0.65, 1, 0.8],
            }}
            transition={{
              duration: 2.8,
              delay: particle.delay,
              repeat: Infinity,
              repeatDelay: 0.9,
              ease: "easeOut",
            }}
          >
            <img
              src="/github.png"
              alt=""
              style={{
                width: "100%",
                height: "100%",
                display: "block",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          </motion.span>
        ))}
    </Box>
  );
};

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
  const portraitVideoRef = useRef<HTMLVideoElement>(null);
  const [portraitPaused, setPortraitPaused] = useState(false);

  const togglePortraitPlayback = () => {
    const video = portraitVideoRef.current;
    if (!video) return;

    if (video.paused) {
      void video.play().then(() => setPortraitPaused(false));
    } else {
      video.pause();
      setPortraitPaused(true);
    }
  };

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
          <Flex
            flexDirection={["column", "column", "row"]}
            alignItems="stretch"
            minHeight={{ md: "350px" }}
          >
            <Box p={5} flex="1 1 58%" display="flex" flexDirection="column">
              <PageHeading title="About Me" mb={2} />
              <Text
                as="p"
                fontSize="13px"
                color="brand.textMuted"
                mb={4}
                lineHeight="1.7"
              >
                Design engineer currently @ <GithubEvaporation />.
                <br />
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

              <Flex flexDirection="row" width="auto" gap={3} mt="auto">
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

            <Box
              flex="1 1 42%"
              minHeight={["260px", "320px", "auto"]}
              position="relative"
              overflow="hidden"
              bg="#fff"
            >
              <Box
                aria-hidden="true"
                position="absolute"
                top={[0, 0, 0]}
                left={[0, 0, 0]}
                width={["100%", "100%", "2px"]}
                height={["2px", "2px", "100%"]}
                bg="brand.border"
                zIndex={2}
                pointerEvents="none"
              />
              <Box
                as="video"
                ref={portraitVideoRef}
                aria-label="Animated illustrated portrait of Branon flashing peace signs"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="/about/glitch-portrait-poster.png"
                width="100%"
                height="100%"
                position="absolute"
                inset={0}
                objectFit="cover"
                objectPosition="center"
                opacity={0.52}
                sx={{
                  "@media (prefers-reduced-motion: reduce)": {
                    display: "none",
                  },
                }}
              >
                <source src="/about/glitch-portrait.mp4" type="video/mp4" />
              </Box>
              <Image
                src="/about/glitch-portrait-poster.png"
                alt="Illustrated portrait of Branon flashing peace signs"
                width="100%"
                height="100%"
                position="absolute"
                inset={0}
                objectFit="cover"
                objectPosition="center"
                opacity={0.68}
                display="none"
                sx={{
                  "@media (prefers-reduced-motion: reduce)": {
                    display: "block",
                  },
                }}
              />
              <Box
                aria-hidden="true"
                position="absolute"
                inset={0}
                pointerEvents="none"
                boxShadow="inset 0 0 40px rgba(51, 44, 28, 0.08)"
              />
              <Box
                as="button"
                type="button"
                onClick={togglePortraitPlayback}
                aria-label={portraitPaused ? "Play portrait animation" : "Pause portrait animation"}
                aria-pressed={portraitPaused}
                position="absolute"
                top={3}
                right={3}
                zIndex={3}
                width="30px"
                height="30px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                color="brand.text"
                bg="brand.surface"
                border="2px solid"
                borderColor="brand.border"
                borderRadius="6px"
                cursor="pointer"
                transition="0.12s ease all"
                _hover={{
                  borderColor: "brand.borderHover",
                  bg: "brand.surfaceHover",
                }}
                _focusVisible={{
                  outline: "2px solid",
                  outlineColor: ABOUT_ACCENT,
                  outlineOffset: "2px",
                }}
                sx={{
                  "@media (prefers-reduced-motion: reduce)": {
                    display: "none",
                  },
                }}
              >
                <Box
                  as="svg"
                  viewBox="0 0 12 12"
                  width="12px"
                  height="12px"
                  display="block"
                  aria-hidden="true"
                >
                  {portraitPaused ? (
                    <path d="M3 2.1v7.8L9.3 6 3 2.1Z" fill="currentColor" />
                  ) : (
                    <>
                      <rect x="2.25" y="2" width="2.5" height="8" rx="0.75" fill="currentColor" />
                      <rect x="7.25" y="2" width="2.5" height="8" rx="0.75" fill="currentColor" />
                    </>
                  )}
                </Box>
              </Box>
            </Box>
          </Flex>
        </RetroCard>

        <Flex
          width="100%"
          flexDirection={["column", "column", "row"]}
          alignItems="flex-start"
          gap={4}
        >
          {/* Left column — Experience/Education/Honors/Music/Spotify. On
              desktop this is a real flex column so its items stack and
              top-align independently of the right column's item heights.
              On mobile `display: contents` removes this wrapper from the
              box model entirely, letting its children flatten into the
              outer single-column flex flow so the `order` values below can
              interleave them with the right column's items. */}
          <Box
            display={["contents", "contents", "flex"]}
            flexDirection="column"
            gap={4}
            flex={{ md: 1 }}
            minWidth={0}
            width={["100%", "100%", "auto"]}
          >
            <RetroCard p={5} order={[1, 1, "unset"]}>
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

            <RetroCard p={5} order={[2, 2, "unset"]}>
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

            <RetroCard p={5} order={[3, 3, "unset"]}>
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

            <RetroCard p={5} order={[5, 5, "unset"]}>
              <SectionHeading title="Music Production" color={ABOUT_ACCENT} />
              <Music />
            </RetroCard>
            <RetroCard order={[6, 6, "unset"]}>
              <SpotifyEmbed />
            </RetroCard>
          </Box>

          {/* Right column — Publications/Photography. Same `display: contents`
              trick on mobile, so on desktop it stays a separate, independently
              top-aligned flex column from the left one. */}
          <Box
            display={["contents", "contents", "flex"]}
            flexDirection="column"
            gap={4}
            flex={{ md: 1 }}
            minWidth={0}
            width={["100%", "100%", "auto"]}
          >
            <RetroCard p={5} order={[4, 4, "unset"]}>
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
                    role="group"
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
                      <Flex flex={1} minWidth={0} gap={2}>
                        <Text
                          as="span"
                          className={pixelFont.className}
                          fontSize="11px"
                          color="transparent"
                          _groupHover={{ color: ABOUT_ACCENT }}
                          aria-hidden="true"
                          flexShrink={0}
                          mt="1px"
                          transition="color 0.14s ease"
                        >
                          {"\u25B6"}
                        </Text>
                        <Box flex={1} minWidth={0}>
                          <Box mb={0.5}>
                            <Text textStyle="listTitle">{item.title}</Text>
                            <Text textStyle="listMeta">
                              {item.publisher} · {item.date}
                            </Text>
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
                              display="inline-block"
                              mt={1}
                            >
                              {item.tag}
                            </Box>
                          </Box>
                        </Box>
                      </Flex>
                      <ExternalLinkIcon boxSize={3} color="brand.textMuted" mt={0.5} flexShrink={0} />
                    </Flex>
                  </ChakraLink>
                ))}
              </Flex>
            </RetroCard>

            <RetroCard p={5} order={[7, 7, "unset"]}>
              <SectionHeading title="Photography & Digital Art" color={ABOUT_ACCENT} />
              <Photography />
              <Box mt={4}>
                <PhotoCarousel />
              </Box>
            </RetroCard>
          </Box>
        </Flex>
      </Flex>
    </PageWrapper>
  );
}
