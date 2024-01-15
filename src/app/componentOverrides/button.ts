import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const primary = defineStyle({
  borderRadius: "20px",
  background: "brand.gradient",
  color: "white",
  fontWeight: "bold",
  position: "relative",
  overflow: "hidden",
  zIndex: 1,
  _hover: {
    opacity: 0.85,
    transform: "translateY(-2px)",
    _before: {
      opacity: 0.5,
    },
  },
  _before: {
    content: '""',
    width: "100%",
    height: "100%",
    background: "brand.blue",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: "-2",
    transition: "0.4s ease all",
    opacity: 0,
    cursor: "pointer",
  },
});

const secondary = defineStyle({
  borderRadius: "20px",
  fontWeight: "bold",
  position: "relative",
  overflow: "hidden",
  zIndex: 1,
  _dark: {
    color: "white",
    background: "brand.darkBg",
    boxShadow: "0px 4px 15px 0px rgba(226,175,255, 0.15)",
    _hover: {
      opacity: 0.85,
      transform: "translateY(-1px)",
      _before: {
        opacity: 0.5,
      },
    },
  },
  _light: {
    color: "brand.grey",
    background: "brand.lightBg",
    boxShadow: "md",
    _hover: {
      opacity: 0.85,
      transform: "translateY(-1px)",
      _before: {
        opacity: 0.5,
      },
    },
  },
});

export const buttonTheme = defineStyleConfig({
  variants: { primary, secondary },
});
