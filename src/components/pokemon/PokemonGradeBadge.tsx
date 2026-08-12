import { Text } from "@chakra-ui/react";
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
    <Text
      as="span"
      display="inline-flex"
      alignItems="center"
      flexShrink={0}
      whiteSpace="nowrap"
      fontSize={isDetail ? "8px" : "7px"}
      fontFamily="monospace"
      fontWeight="700"
      lineHeight="1"
      letterSpacing="0.04em"
      color="#a72d2d"
      background="rgba(255, 247, 241, 0.96)"
      border="1px solid rgba(167, 45, 45, 0.55)"
      borderRadius="3px"
      paddingX={isDetail ? 1.5 : 1}
      paddingY={isDetail ? "4px" : "3px"}
      aria-label={`${grading.company} grade ${grading.grade}`}
    >
      {grading.company} {grading.grade}
    </Text>
  );
};
