import { Box, Text } from "@chakra-ui/react";
import type { CardGrading } from "@/lib/pokemonCards";

type Props = {
  grading: CardGrading;
  size?: "compact" | "detail";
};

export const PokemonGradeBadge: React.FC<Props> = ({
  grading,
  size = "compact",
}) => {
  const isDetail = size === "detail";

  return (
    <Box
      as="span"
      display="inline-flex"
      flexDirection={isDetail ? "row" : "column"}
      alignItems="center"
      gap={isDetail ? 1 : 0}
      flexShrink={0}
      whiteSpace="nowrap"
      fontFamily="monospace"
      fontWeight="700"
      lineHeight="1"
      color="#991b1b"
      background="rgba(255, 255, 255, 0.96)"
      border="2px solid #b91c1c"
      borderRadius="5px"
      paddingX={isDetail ? 2 : 1.5}
      paddingY={isDetail ? 1.5 : 1}
      boxShadow="0 2px 6px rgba(0, 0, 0, 0.28)"
      aria-label={`${grading.company} grade ${grading.grade}`}
    >
      <Text
        as="span"
        fontSize={isDetail ? "8px" : "6px"}
        fontWeight="800"
        lineHeight="1"
        letterSpacing="0.08em"
      >
        {grading.company}
      </Text>
      <Text
        as="span"
        fontSize={isDetail ? "12px" : "13px"}
        fontWeight="900"
        lineHeight="1"
      >
        {grading.grade}
      </Text>
    </Box>
  );
};
