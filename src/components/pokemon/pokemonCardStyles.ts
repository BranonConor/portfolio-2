export const POKEMON_CARD_FRAME_PROPS = {
  borderRadius: "12px",
  overflow: "hidden",
  border: "2px solid",
  borderColor: "brand.border",
  bg: "brand.surface",
  isolation: "isolate",
  transition: "border-color 0.2s ease",
  _hover: { borderColor: "brand.borderHover" },
  _focusVisible: {
    outline: "2px solid",
    outlineColor: "#f05032",
    outlineOffset: "4px",
  },
} as const;
