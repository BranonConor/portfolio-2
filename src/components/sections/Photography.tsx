import {
  Flex,
  Heading,
  Text,
  Grid,
  Image,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";

export const Photography = () => {
  const photos: { location: string; image: string }[] = [
    { location: "Mammoth, CA", image: "/photography/bug.png" },
    { location: "Santa Barbara, CA", image: "/photography/harbor.png" },
    { location: "Carpinteria, CA", image: "/photography/jellybowl.png" },
    { location: "Mammoth, CA", image: "/photography/mammoth.png" },
    { location: "Oceano Dunes, CA", image: "/photography/matt.png" },
    { location: "Pismo Beach, CA", image: "/photography/pismo.png" },
    { location: "Montecito, CA", image: "/photography/rach.png" },
    { location: "San Diego, CA", image: "/photography/sd.png" },
    { location: "Lake Tahoe, CA", image: "/photography/tahoe.png" },
  ];
  const shadow = useColorModeValue(
    "md",
    "0px 4px 15px 0px rgba(226,175,255, 0.10)"
  );
  const cardBg = useColorModeValue("brand.lightBg", "brand.darkBg");
  const bannerBg = useColorModeValue("brand.lightGrey", "brand.grey");
  const textColor = useColorModeValue("black", "white");
  const icon = useColorModeValue(
    "/icons/location-dark.svg",
    "/icons/location-light.svg"
  );

  return (
    <Box width="100%" borderRadius={10} padding={4} mt={8} bg={cardBg}>
      <Heading as="h3" size="xl" mb={4}>
        Photography & Digital Art
      </Heading>
      <Text as="p" mb={8}>
        I've been doing photography for almost a decade, winning many awards and
        honors as well as scoring contracts with large companies for
        collaborations and shoots. Photography has been one of my favorite ways
        to flex my creative muscles ever since I picked it up!
      </Text>

      <Flex width="100%">
        <Grid
          bg={cardBg}
          width="100%"
          gridGap={4}
          borderRadius={8}
          gridTemplateColumns={["1fr", "1fr 1fr", "1fr 1fr 1fr"]}
        >
          {photos.map((photo) => (
            <Box overflow="hidden" borderRadius={16} position="relative">
              <Image
                draggable="false"
                src={photo.image}
                minWidth="100%"
                objectFit="cover"
                boxShadow={shadow}
              />
              <Text
                bg={bannerBg}
                position="absolute"
                top={1}
                left={1}
                height={8}
                color={textColor}
                fontWeight={700}
                width="calc(100% - 8px)"
                borderRadius={12}
                display="flex"
                justifyContent="center"
                alignItems="center"
                as="span"
                boxShadow={shadow}
                fontSize="12px"
              >
                <Image
                  src={icon}
                  width={4}
                  height={4}
                  mr={2}
                  draggable="false"
                />
                {photo.location}
              </Text>
              {/* <Box
                position="absolute"
                top={1}
                left={1}
                border="4px solid"
                borderColor={bannerBg}
                width="calc(100% - 8px)"
                height="calc(100% - 8px)"
                borderRadius={16}
              /> */}
            </Box>
          ))}
        </Grid>
      </Flex>
    </Box>
  );
};
