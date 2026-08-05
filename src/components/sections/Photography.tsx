import { useState } from "react";
import {
  Flex,
  Text,
  Image,
  Box,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { pixelFont } from "@/components/boot-intro/pixelFont";
import { useBootChime } from "@/components/boot-intro/useBootChime";

export const Photography = () => {
  const awards = [
    {
      title: "VOICE Magazine, Funk Zone Art Walk Featured Artist",
      date: "Sept 2018",
      link: "https://issuu.com/CASAmagazine/docs/9.14.18.voice_24_pg/24",
    },
    {
      title: "Carpinteria Magazine Featured Artist",
      date: "Summer 2015",
      link: "https://issuu.com/coastalview/docs/cvn_summer2015/82",
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

  return (
    <Box width="100%">
      <Text fontSize="13px" color="brand.textMuted" mb={4} lineHeight="1.6">
        I&apos;ve had a super fun mini-career in photography, winning many
        awards and scoring contracts with some cool lifestyle product companies
        for collaborations and shoots.
      </Text>

      <Text textStyle="listTitle" color="brand.textMuted" mb={2}>
        Awards & honors
      </Text>
      <Flex
        flexDirection="column"
        gap={0}
        mb={5}
        sx={{
          "& > *:first-of-type::after": { display: "none" },
          "& > *:hover + *::after": { transform: "scaleX(0)" },
        }}
      >
        {awards.map((item) => (
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
              bg: "#f0503214",
              borderColor: "#f0503255",
              transform: "translateX(3px)",
              zIndex: 1,
              _after: { transform: "scaleX(0)" },
            }}
            transition="0.14s ease all"
          >
            <Flex
              justifyContent="space-between"
              alignItems="flex-start"
              gap={3}
            >
              <Flex flex={1} minWidth={0} gap={2}>
                <Text
                  as="span"
                  className={pixelFont.className}
                  fontSize="11px"
                  color="transparent"
                  _groupHover={{ color: "#f05032" }}
                  aria-hidden="true"
                  flexShrink={0}
                  mt="1px"
                  transition="color 0.14s ease"
                >
                  {"\u25B6"}
                </Text>
                <Box flex={1} minWidth={0}>
                  <Text textStyle="listTitle">{item.title}</Text>
                  <Text textStyle="listMeta" mt={0.5}>
                    {item.date}
                  </Text>
                </Box>
              </Flex>
              <ExternalLinkIcon
                boxSize={3}
                color="brand.textMuted"
                mt={0.5}
                flexShrink={0}
              />
            </Flex>
          </ChakraLink>
        ))}
      </Flex>

      <Text textStyle="listTitle" color="brand.textMuted" mb={2}>
        Collabs & Contracts
      </Text>
      <Flex
        flexDirection="column"
        gap={0}
        mb={5}
        sx={{
          "& > *:first-of-type::after": { display: "none" },
          "& > *:hover + *::after": { transform: "scaleX(0)" },
        }}
      >
        {collaborations.map((item) => (
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
            </Flex>
            <ExternalLinkIcon
              boxSize={3}
              color="brand.textMuted"
              flexShrink={0}
            />
          </ChakraLink>
        ))}
      </Flex>

      <Text textStyle="listTitle" color="brand.textMuted" mb={2}>
        Instagram
      </Text>
      <Flex
        flexDirection="column"
        gap={0}
        sx={{
          "& > *:first-of-type::after": { display: "none" },
          "& > *:hover + *::after": { transform: "scaleX(0)" },
        }}
      >
        <ChakraLink
          href="https://www.instagram.com/photosbyanasian/"
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
              @photosbyanasian
            </Text>
          </Flex>
          <ExternalLinkIcon
            boxSize={3}
            color="brand.textMuted"
            flexShrink={0}
          />
        </ChakraLink>
      </Flex>
    </Box>
  );
};

const PHOTOS: { location: string; image: string }[] = [
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

const CarouselArrow = ({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) => (
  <Box
    as="button"
    type="button"
    onClick={onClick}
    aria-label={direction === "prev" ? "Previous photo" : "Next photo"}
    className={pixelFont.className}
    fontSize="10px"
    color="brand.text"
    bg="brand.surface"
    border="2px solid"
    borderColor="brand.border"
    borderRadius="6px"
    width="28px"
    height="28px"
    display="flex"
    alignItems="center"
    justifyContent="center"
    cursor="pointer"
    flexShrink={0}
    transition="0.12s ease all"
    _hover={{ borderColor: "brand.borderHover", bg: "brand.surfaceHover" }}
  >
    {direction === "prev" ? "\u25C2" : "\u25B8"}
  </Box>
);

/**
 * A "photo cartridge" carousel — one bordered card at a time (like a game
 * cartridge slotting in), with chunky pixel-arrow nav either side and a
 * dot-strip below, instead of the old full vertical stack of images. Keeps
 * the same photo set but reads as a deliberate on-theme gallery rather than
 * a generic image feed.
 */
export const PhotoCarousel = () => {
  const [index, setIndex] = useState(0);
  const { unlock, playMoveBlip } = useBootChime();

  const goTo = (next: number) => {
    const clamped = (next + PHOTOS.length) % PHOTOS.length;
    setIndex(clamped);
    void unlock().then((running) => {
      if (running) void playMoveBlip();
    });
  };

  return (
    <Box width="100%">
      <Box
        width="100%"
        overflow="hidden"
        borderRadius="10px"
        position="relative"
        border="2px solid"
        borderColor="brand.border"
        bg="brand.surface"
      >
        <Flex
          width={`${PHOTOS.length * 100}%`}
          transform={`translateX(-${(index * 100) / PHOTOS.length}%)`}
          transition="transform 0.32s cubic-bezier(0.22, 1, 0.36, 1)"
        >
          {PHOTOS.map((photo, photoIndex) => (
            <Image
              key={photo.image}
              draggable="false"
              src={photo.image}
              alt={`${photo.location} photograph`}
              loading="eager"
              decoding="async"
              width={`${100 / PHOTOS.length}%`}
              flexShrink={0}
              height={["380px", "460px", "540px"]}
              objectFit="cover"
              aria-hidden={photoIndex !== index}
            />
          ))}
        </Flex>
        <Text
          as="span"
          className={pixelFont.className}
          fontSize="8px"
          bg="rgba(51, 44, 28, 0.72)"
          backdropFilter="blur(6px)"
          position="absolute"
          bottom={2}
          left={2}
          color="#fff"
          paddingX={2}
          paddingY={1.5}
          borderRadius="4px"
        >
          {PHOTOS[index].location}
        </Text>
        <Text
          as="span"
          fontSize="10px"
          color="#fff"
          bg="rgba(51, 44, 28, 0.72)"
          backdropFilter="blur(6px)"
          position="absolute"
          bottom={2}
          right={2}
          paddingX={2}
          paddingY={1}
          borderRadius="4px"
        >
          {index + 1}/{PHOTOS.length}
        </Text>
      </Box>
      <Flex alignItems="center" justifyContent="center" gap={3} mt={3}>
        <CarouselArrow direction="prev" onClick={() => goTo(index - 1)} />
        <Flex justifyContent="center" gap={1.5} flexWrap="wrap">
          {PHOTOS.map((p, i) => (
            <Box
              key={p.image}
              as="button"
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to photo ${i + 1}: ${p.location}`}
              width={i === index ? "16px" : "6px"}
              height="6px"
              borderRadius="3px"
              bg={i === index ? "#f05032" : "brand.border"}
              cursor="pointer"
              transition="0.15s ease all"
            />
          ))}
        </Flex>
        <CarouselArrow direction="next" onClick={() => goTo(index + 1)} />
      </Flex>
    </Box>
  );
};
