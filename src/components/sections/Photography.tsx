import {
  Flex,
  Heading,
  Text,
  Grid,
  Image,
  Box,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

export const Photography = () => {
  const awards = [
    {
      title: "VOICE Magazine, Funk Zone Art Walk Featured Artist",
      date: "Sept 2018",
      link: "https://issuu.com/CASAmagazine/docs/9.14.18.voice_24_pg",
    },
    {
      title: "Carpinteria Magazine Featured Artist",
      date: "Summer 2015",
      link: "https://issuu.com/coastalview/docs/cvn_summer2015",
    },
    {
      title: "HORIZON Newspaper (x2) Artist of the Week",
      date: "March & Oct 2015",
      link: "https://horizon.westmont.edu/",
    },
    {
      title: "Original Grain 'Living Minimal' Photo Contest, 2nd Place",
      date: "July 2015",
      link: "https://www.originalgrain.com/blogs/news/original-grains-living-minimal-photography-contest?srsltid=AfmBOooMLQG4hvsw41p8LmsJ9jyWdNHXmh5tJNjn4KBliOsVpJOclfA1",
    },
    {
      title: "Westmont Student Life Photography Contest Winner",
      date: "March 2015",
      link: "https://www.facebook.com/media/set/?vanity=WestmontStudentLife&set=a.893168660704149",
    },
  ];

  const collaborations = [
    {
      title: "MVMT Watches",
      link: "https://www.mvmt.com/home",
    },
    {
      title: "Rareform",
      link: "https://www.rareform.com/",
    },
    {
      title: "Original Grain",
      link: "https://www.originalgrain.com/",
    },
    {
      title: "Vincero Collective",
      link: "https://vincerocollective.com/",
    },
  ];

  const photos: { location: string; image: string }[] = [
    { location: "Mammoth, CA", image: "/photography/bug.png" },
    { location: "Santa Barbara, CA", image: "/photography/harbor.png" },
    { location: "El Nido, PHI", image: "/photography/elnido.png" },
    { location: "Mammoth, CA", image: "/photography/mammoth.png" },
    { location: "Oceano Dunes, CA", image: "/photography/matt.png" },
    { location: "Pismo Beach, CA", image: "/photography/pismo.png" },
    { location: "Montecito, CA", image: "/photography/rach.png" },
    { location: "San Diego, CA", image: "/photography/sd.png" },
    { location: "Lake Tahoe, CA", image: "/photography/tahoe.png" },
    { location: "Carpinteria, CA", image: "/photography/jellybowl.png" },
  ];

  return (
    <Box width="100%" mt={10}>
      <Heading
        as="h3"
        fontSize="18px"
        fontWeight="600"
        letterSpacing="-0.02em"
        mb={2}
      >
        Photography & Digital Art
      </Heading>
      <Text fontSize="13px" color="brand.textMuted" mb={4} lineHeight="1.6">
        I&apos;ve been doing photography for almost a decade, winning many
        awards and scoring contracts with large companies for collaborations and
        shoots.
      </Text>

      <Text fontSize="13px" fontWeight="600" color="brand.text" mb={1}>
        Awards & honors
      </Text>
      <Flex
        flexDirection="column"
        gap={0}
        mb={5}
        sx={{
          "& > *:first-child::after": { display: "none" },
          "& > *:hover + *::after": { transform: "scaleX(0)" },
        }}
      >
        {awards.map((item) => (
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
            <Text textStyle="listMeta" flexShrink={0} ml={3}>
              {item.date}
            </Text>
          </ChakraLink>
        ))}
      </Flex>

      <Text fontSize="13px" fontWeight="600" color="brand.text" mb={1}>
        Collabs & Contracts
      </Text>
      <Flex
        flexDirection="column"
        gap={0}
        mb={5}
        sx={{
          "& > *:first-child::after": { display: "none" },
          "& > *:hover + *::after": { transform: "scaleX(0)" },
        }}
      >
        {collaborations.map((item) => (
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
          </ChakraLink>
        ))}
      </Flex>

      <Grid
        width="100%"
        gridGap={3}
        gridTemplateColumns={["1fr", "1fr 1fr", "1fr 1fr"]}
      >
        {photos.map((photo) => (
          <Box
            key={photo.image}
            overflow="hidden"
            borderRadius="10px"
            position="relative"
            border="1px solid"
            borderColor="brand.border"
          >
            <Image
              draggable="false"
              src={photo.image}
              minWidth="100%"
              objectFit="cover"
            />
            <Text
              bg="rgba(9, 9, 11, 0.7)"
              backdropFilter="blur(8px)"
              position="absolute"
              bottom={2}
              left={2}
              color="brand.text"
              fontWeight={500}
              paddingX={2}
              paddingY={1}
              borderRadius="8px"
              fontSize="11px"
            >
              {photo.location}
            </Text>
          </Box>
        ))}
      </Grid>
    </Box>
  );
};
