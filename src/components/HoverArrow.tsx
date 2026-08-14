import { Text } from "@chakra-ui/react";
import { pixelFont } from "@/components/boot-intro/pixelFont";

export const HOVER_ARROW_SHIFT = "17px";

export const HoverArrow = ({ color }: { color: string }) => (
  <Text
    as="span"
    className={pixelFont.className}
    fontSize="11px"
    color={color}
    aria-hidden="true"
    position="absolute"
    left={0}
    top="1px"
    opacity={0}
    transform="translateX(-4px)"
    transition="opacity 0.14s ease, transform 0.14s ease"
    _groupHover={{
      opacity: [0, 0, 1],
      transform: ["translateX(-4px)", "translateX(-4px)", "translateX(0)"],
    }}
  >
    {"\u25B6"}
  </Text>
);
