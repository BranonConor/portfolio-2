import { Flex, Grid, Image, Box, useColorModeValue } from "@chakra-ui/react";

export const Photography = () => {
  const photos: string[] = [
    "/photography/bug.png",
    "/photography/harbor.png",
    "/photography/jellybowl.png",
    "/photography/mammoth.png",
    "/photography/matt.png",
    "/photography/pismo.png",
    "/photography/rach.png",
    "/photography/sd.png",
    "/photography/tahoe.png",
  ];
  const border = useColorModeValue("brand.lightBg", "brand.darkBg");
  const shadow = useColorModeValue(
    "lg",
    "0px 4px 15px 0px rgba(226,175,255, 0.10)"
  );

  return (
    <Flex my={4} mb={16} width="100%">
      <Grid
        width="100%"
        gridGap={4}
        gridTemplateColumns={["1fr", "1fr 1fr", "1fr 1fr 1fr"]}
      >
        {photos.map((photo) => (
          <Box
            overflow="hidden"
            borderRadius={16}
            boxShadow={shadow}
            border={"8px solid"}
            borderColor={border}
          >
            <Image src={photo} minWidth="100%" objectFit="cover" />
          </Box>
        ))}
      </Grid>
    </Flex>
  );
};
