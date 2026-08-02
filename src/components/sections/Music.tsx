import { Box, Flex, Text, Link as ChakraLink } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { RetroFilterPill } from "@/components/RetroFilterPill";
import { pixelFont } from "@/components/boot-intro/pixelFont";

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
      <Text fontSize="13px" color="brand.textMuted" mb={4} lineHeight="1.6">
        I produce music & beats under my producer name @PancitPapi. Great for
        focus time and locking in on a task. Here are my albums on Spotify:
      </Text>
      <Flex
        flexDirection="column"
        gap={0}
        sx={{
          "& > *:first-of-type::after": { display: "none" },
          "& > *:hover + *::after": { transform: "scaleX(0)" },
        }}
      >
        {items.map((item) => (
          <ChakraLink
            key={item.title}
            href={item.link}
            isExternal
            role="group"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
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
              bg: "#f0503214",
              borderColor: "#f0503255",
              transform: "translateX(3px)",
              zIndex: 1,
              _after: { transform: "scaleX(0)" },
            }}
            transition="0.14s ease all"
          >
            <Flex alignItems="center" gap={2}>
              <Text
                as="span"
                className={pixelFont.className}
                fontSize="11px"
                color="transparent"
                _groupHover={{ color: "#f05032" }}
                aria-hidden="true"
                flexShrink={0}
                transition="color 0.14s ease"
              >
                {"\u25B6"}
              </Text>
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
    <Box p={3} width="100%">
      <Flex gap={1.5} mb={3} flexWrap="wrap">
        {albums.map((album) => (
          <RetroFilterPill
            key={album.title}
            label={album.title}
            color="#f05032"
            active={activeAlbum.title === album.title}
            onClick={() => setActiveAlbum(album)}
          />
        ))}
      </Flex>
      <Box
        position="relative"
        height={["352px", "352px", "484px"]}
        overflow="hidden"
        borderRadius="10px"
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
