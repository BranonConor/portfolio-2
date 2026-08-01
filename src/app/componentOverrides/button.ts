import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const makePrimary = (color: string) =>
  defineStyle({
    borderRadius: "10px",
    background: `${color}18`,
    color: color,
    fontWeight: "700",
    fontSize: "13px",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    border: "2px solid",
    borderColor: `${color}55`,
    _hover: {
      background: `${color}2e`,
      borderColor: `${color}80`,
      transform: "translateY(-1px)",
    },
    _active: {
      transform: "translateY(1px)",
      background: `${color}3a`,
    },
    transition: "0.15s ease all",
  });

const primary = makePrimary("#a78bfa");
const primaryPink = makePrimary("#da70d6");
const primaryGreen = makePrimary("#22c55e");
const primaryBlue = makePrimary("#61dafb");
const primaryOrange = makePrimary("#f05032");
const primaryAmber = makePrimary("#fbbf24");

const secondary = defineStyle({
  borderRadius: "10px",
  fontWeight: "700",
  fontSize: "13px",
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  color: "brand.textMuted",
  background: "rgba(230, 230, 190, 0.04)",
  border: "2px solid",
  borderColor: "brand.border",
  _hover: {
    background: "rgba(230, 230, 190, 0.07)",
    borderColor: "brand.borderHover",
    color: "brand.text",
    transform: "translateY(-1px)",
  },
  _active: {
    transform: "translateY(1px)",
    background: "rgba(230, 230, 190, 0.1)",
  },
  transition: "0.15s ease all",
});

export const buttonTheme = defineStyleConfig({
  variants: {
    primary,
    primaryPink,
    primaryGreen,
    primaryBlue,
    primaryOrange,
    primaryAmber,
    secondary,
  },
});
