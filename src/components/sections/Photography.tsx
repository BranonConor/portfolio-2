import { Flex, Heading, Text, Grid, Image, Box } from "@chakra-ui/react";

export const Photography = () => {
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
      <Text fontSize="13px" color="brand.textMuted" mb={5} lineHeight="1.6">
        I&apos;ve been doing photography for almost a decade, winning many
        awards and scoring contracts with large companies for collaborations and
        shoots.
      </Text>

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
