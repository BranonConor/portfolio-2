import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const primary = defineStyle({
  borderRadius: "8px",
  background: "rgba(167, 139, 250, 0.1)",
  color: "#a78bfa",
  fontWeight: "600",
  fontSize: "13px",
  letterSpacing: "0.01em",
  _hover: {
    background: "rgba(167, 139, 250, 0.18)",
    transform: "translateY(-1px)",
  },
  transition: "0.15s ease all",
});

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
  variants: { primary, secondary },
});
