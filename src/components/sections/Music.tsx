import { Box, Flex, Heading, Text, Link as ChakraLink } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { useState } from "react";

export const Music = () => {
  const items = [
    {
      title: "BETTER DAYS",
      date: "2025",
      link: "https://open.spotify.com/album/1deGJrJHVrQfds2DfA4tDZ?si=2gpreRs0Q9qpQ3ZOUvDc6Q",
    },
    {
      title: "Adobo Tapes",
      date: "2024",
      link: "https://open.spotify.com/album/1VwNNoVc3fJFH45PQ7yqTK?si=mnPFB9RHSaWKzikZa1SB7w",
    },
    {
      title: "OVER THE YEARS",
      date: "2023",
      link: "https://open.spotify.com/album/3sTnhMmZkSWRqwOjUd61Q8",
    },
    {
      title: "Vancouver Loft",
      date: "2022",
      link: "https://open.spotify.com/album/0jgqurG0HxAJipHhhxrgwg?si=3UnMP0ZEQtSyg4oA4Mb4aw",
    },
    {
      title: "FEEL SOMETHING TAPES",
      date: "2021",
      link: "https://open.spotify.com/album/2Sd57YRcNyJDEEH4tyfBRb?si=PXu62aKAT--jt8-azOxXbg",
    },
  ];

  return (
    <Box width="100%">
      <Heading
        as="h3"
        fontSize="18px"
        fontWeight="600"
        letterSpacing="-0.02em"
        mb={2}
      >
        Music Production
      </Heading>
      <Text fontSize="13px" color="brand.textMuted" mb={4} lineHeight="1.6">
        I&apos;ve been producing hip hop beats for over a decade under my
        producer name @PancitPapi. Here are my albums on Spotify:
      </Text>
      <Flex
        flexDirection="column"
        gap={0}
        sx={{
          "& > *:first-child::after": { display: "none" },
          "& > *:hover + *::after": { transform: "scaleX(0)" },
        }}
      >
        {items.map((item) => (
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
              "& > span:first-of-type": { color: "brand.text" },
            }}
            transition="0.12s ease all"
          >
            <Flex alignItems="center" gap={2}>
              <Text as="span" textStyle="listTitle" transition="0.12s ease all">
                {item.title}
              </Text>
              <Text textStyle="listMeta">{item.date}</Text>
            </Flex>
            <ExternalLinkIcon
              boxSize={3}
              color="brand.textMuted"
              flexShrink={0}
            />
          </ChakraLink>
        ))}
      </Flex>
    </Box>
  );
};

export const SpotifyEmbed = () => {
  const albums = [
    {
      title: "🧢 BETTER DAYS",
      embedUrl:
        "https://open.spotify.com/embed/album/1deGJrJHVrQfds2DfA4tDZ?utm_source=generator",
    },
    {
      title: "📸 Adobo Tapes",
      embedUrl:
        "https://open.spotify.com/embed/album/1VwNNoVc3fJFH45PQ7yqTK?utm_source=generator",
    },
    {
      title: "💫 OVER THE YEARS",
      embedUrl:
        "https://open.spotify.com/embed/album/3sTnhMmZkSWRqwOjUd61Q8?utm_source=generator",
    },
    {
      title: "🏙️ Vancouver Loft",
      embedUrl:
        "https://open.spotify.com/embed/album/0jgqurG0HxAJipHhhxrgwg?utm_source=generator",
    },
    {
      title: "🪻 FEEL SOMETHING",
      embedUrl:
        "https://open.spotify.com/embed/album/2Sd57YRcNyJDEEH4tyfBRb?utm_source=generator",
    },
  ];

  const [activeAlbum, setActiveAlbum] = useState(albums[0]);

  return (
    <Box
      border="1px solid"
      borderColor="brand.border"
      borderRadius="12px"
      bg="rgba(20, 20, 22, 0.6)"
      backdropFilter="blur(16px)"
      overflow="hidden"
      p={3}
      width="100%"
    >
      <Flex gap={1.5} mb={3} flexWrap="wrap">
        {albums.map((album) => (
          <Box
            key={album.title}
            as="button"
            onClick={() => setActiveAlbum(album)}
            fontSize="11px"
            fontWeight="500"
            px={2.5}
            py={1}
            borderRadius="6px"
            border="1px solid"
            borderColor={
              activeAlbum.title === album.title ? "#f0503240" : "brand.border"
            }
            bg={activeAlbum.title === album.title ? "#f0503218" : "transparent"}
            color={
              activeAlbum.title === album.title ? "#f05032" : "brand.textMuted"
            }
            cursor="pointer"
            transition="0.15s ease all"
            _hover={{
              bg:
                activeAlbum.title === album.title
                  ? "#f0503218"
                  : "brand.surfaceHover",
              color:
                activeAlbum.title === album.title ? "#f05032" : "brand.text",
            }}
          >
            {album.title}
          </Box>
        ))}
      </Flex>
      <Box
        position="relative"
        height={["352px", "352px", "484px"]}
        overflow="hidden"
        borderRadius="12px"
      >
        {albums.map((album) => (
          <Box
            key={album.title}
            as="iframe"
            src={album.embedUrl}
            width="100%"
            height="100%"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            borderRadius="12px"
            position="absolute"
            top={0}
            left={0}
            opacity={activeAlbum.title === album.title ? 1 : 0}
            pointerEvents={activeAlbum.title === album.title ? "auto" : "none"}
            zIndex={activeAlbum.title === album.title ? 1 : 0}
            transition="opacity 0.2s ease"
          />
        ))}
      </Box>
    </Box>
  );
};
