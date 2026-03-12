"use client";

import { Box, BoxProps } from "@chakra-ui/react";

const strokes = [
  "/s1.png",
  "/s2.png",
  "/s3.png",
  "/s4.png",
  "/s5.png",
  "/s6.png",
];

interface PaintStrokeProps extends BoxProps {
  /** Which stroke variant to use (1–6) */
  variant?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Rotation in degrees */
  rotate?: number;
  /** Scale factor */
  scale?: number;
  /** Whether to flip horizontally */
  flip?: boolean;
}

export const PaintStroke = ({
  variant = 1,
  rotate = 0,
  scale = 1,
  flip = false,
  opacity = 0.07,
  ...props
}: PaintStrokeProps) => (
  <Box
    as="img"
    src={strokes[variant - 1]}
    alt=""
    aria-hidden="true"
    position="absolute"
    pointerEvents="none"
    userSelect="none"
    opacity={opacity}
    transform={`rotate(${rotate}deg) scale(${flip ? -scale : scale}, ${scale})`}
    mixBlendMode="lighten"
    zIndex={0}
    {...props}
  />
);
