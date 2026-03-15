import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const makePrimary = (color: string) =>
  defineStyle({
    borderRadius: "8px",
    background: `${color}18`,
    color: color,
    fontWeight: "600",
    fontSize: "13px",
    letterSpacing: "0.01em",
    border: "1px solid",
    borderColor: `${color}40`,
    _hover: {
      background: `${color}2e`,
      borderColor: `${color}66`,
      transform: "translateY(-1px)",
    },
    transition: "0.15s ease all",
  });

const primary = makePrimary("#a78bfa");
const primaryPink = makePrimary("#da70d6");
const primaryGreen = makePrimary("#22c55e");
const primaryBlue = makePrimary("#61dafb");
const primaryOrange = makePrimary("#f05032");

const secondary = defineStyle({
  borderRadius: "8px",
  fontWeight: "500",
  fontSize: "13px",
  color: "brand.textMuted",
  background: "rgba(255, 255, 255, 0.04)",
  border: "1px solid",
  borderColor: "brand.border",
  _hover: {
    background: "rgba(255, 255, 255, 0.07)",
    borderColor: "brand.borderHover",
    color: "brand.text",
    transform: "translateY(-1px)",
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
    secondary,
  },
});
