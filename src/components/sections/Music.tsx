import { Box, Flex, Heading, Text, Link as ChakraLink } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

export const Music = () => {
  const items = [
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
    <Box width="100%" mt={8}>
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
              <ExternalLinkIcon boxSize={3} color="brand.textMuted" />
            </Flex>
            <Text textStyle="listMeta" flexShrink={0}>
              {item.date}
            </Text>
          </ChakraLink>
        ))}
      </Flex>
    </Box>
  );
};
