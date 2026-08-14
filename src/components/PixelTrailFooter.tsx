"use client";

import { Box, Text } from "@chakra-ui/react";
import { pixelFont } from "@/components/boot-intro/pixelFont";

const Tree = ({
  x,
  y = 4,
  scale = 1,
}: {
  x: number;
  y?: number;
  scale?: number;
}) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <rect x="12" y="31" width="8" height="21" fill="#725b3b" />
    <rect x="9" y="48" width="14" height="5" fill="#5b472f" />
    <path
      d="M8 12h16v5h6v20h-5v6H7v-6H2V17h6z"
      fill="#344d2d"
    />
    <path d="M8 8h16v5h5v19h-6v6H7v-6H3V13h5z" fill="#496a3c" />
    <path d="M11 4h10v5h5v17h-5v5H9v-5H5V12h6z" fill="#63834b" />
    <rect x="9" y="14" width="5" height="5" fill="#88a462" />
    <rect x="18" y="9" width="4" height="6" fill="#88a462" />
    <rect x="20" y="23" width="5" height="4" fill="#3d5b34" />
  </g>
);

const Grass = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x} ${y})`} stroke="#63834b" strokeWidth="2">
    <path d="M0 6 3 1l2 5 3-4 2 4" fill="none" />
  </g>
);

const Flowers = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x="2" y="4" width="2" height="5" fill="#496a3c" />
    <rect x="0" y="1" width="3" height="3" fill="#d88b9a" />
    <rect x="4" y="0" width="3" height="3" fill="#e9b5be" />
    <rect x="8" y="4" width="2" height="5" fill="#496a3c" />
    <rect x="7" y="1" width="4" height="3" fill="#d8b35b" />
  </g>
);

const BackdropTile = ({ offset }: { offset: number }) => (
  <g transform={`translate(${offset} 0)`}>
    <Tree x={4} y={15} scale={0.63} />
    <Tree x={77} y={10} scale={0.74} />
    <Tree x={221} y={16} scale={0.61} />
    <Tree x={278} y={9} scale={0.76} />
  </g>
);

const ForegroundTile = ({ offset }: { offset: number }) => (
  <g transform={`translate(${offset} 0)`}>
    <Grass x={20} y={64} />
    <Flowers x={62} y={60} />
    <Grass x={112} y={67} />
    <Grass x={166} y={63} />
    <Flowers x={224} y={64} />
    <Grass x={274} y={59} />
    <Grass x={305} y={68} />
  </g>
);

/**
 * A small route footer built like a side-scrolling monster-RPG route. Shiny
 * Mew stays centered while original scenery tiles loop behind it.
 *
 * Sprite source and reuse guidance:
 * https://pokemondb.net/sprites/mew
 */
export const PixelTrailFooter = () => (
  <Box
    as="footer"
    aria-label="Shiny Mew floats through a tiny pixel landscape"
    width="100%"
    marginTop={[14, 16, 20]}
    opacity={0.76}
    overflow="hidden"
    pointerEvents="none"
    sx={{
      maskImage:
        "linear-gradient(to right, transparent 0%, black 9%, black 91%, transparent 100%)",
      WebkitMaskImage:
        "linear-gradient(to right, transparent 0%, black 9%, black 91%, transparent 100%)",
      maskSize: "100% 100%",
      WebkitMaskSize: "100% 100%",
      "@keyframes pixelBackdropScroll": {
        from: { transform: "translateX(0)" },
        to: { transform: "translateX(320px)" },
      },
      "@keyframes pixelForegroundScroll": {
        from: { transform: "translateX(0)" },
        to: { transform: "translateX(320px)" },
      },
      ".pixel-backdrop": {
        animation: "pixelBackdropScroll 28s linear infinite",
        willChange: "transform",
      },
      ".pixel-foreground": {
        animation: "pixelForegroundScroll 17s linear infinite",
        willChange: "transform",
      },
      ".pixel-mew-still": {
        display: "none",
      },
      ".pixel-swablu-still": {
        display: "none",
      },
      "@media (prefers-reduced-motion: reduce)": {
        ".pixel-backdrop, .pixel-foreground": {
          animation: "none",
        },
        ".pixel-mew-animated": {
          display: "none",
        },
        ".pixel-swablu-animated": {
          display: "none",
        },
        ".pixel-mew-still": {
          display: "block",
        },
        ".pixel-swablu-still": {
          display: "block",
        },
      },
    }}
  >
    <Box
      as="svg"
      viewBox="0 0 640 106"
      width="100%"
      height={["92px", "100px", "106px"]}
      display="block"
      role="img"
      aria-hidden="true"
      preserveAspectRatio="xMidYMax meet"
      shapeRendering="crispEdges"
    >
      <g transform="translate(0 29)">
        <g className="pixel-backdrop">
          <BackdropTile offset={-320} />
          <BackdropTile offset={0} />
          <BackdropTile offset={320} />
          <BackdropTile offset={640} />
        </g>
      </g>

      <g transform="translate(0 29)">
        <g className="pixel-foreground">
          <ForegroundTile offset={-320} />
          <ForegroundTile offset={0} />
          <ForegroundTile offset={320} />
          <ForegroundTile offset={640} />
        </g>
      </g>

      <image
        className="pixel-swablu-animated"
        href="/footer/shiny-swablu.gif"
        x="331"
        y="18"
        width="52"
        height="34"
        opacity="0.82"
        style={{ imageRendering: "pixelated" }}
      />
      <image
        className="pixel-swablu-still"
        href="/footer/shiny-swablu-static.png"
        x="331"
        y="18"
        width="52"
        height="34"
        opacity="0.82"
        style={{ imageRendering: "pixelated" }}
      />

      <image
        className="pixel-mew-animated"
        href="/footer/shiny-mew.gif"
        x="259"
        y="8"
        width="78"
        height="54"
        style={{ imageRendering: "pixelated" }}
      />
      <image
        className="pixel-mew-still"
        href="/footer/shiny-mew-static.png"
        x="259"
        y="8"
        width="78"
        height="54"
        style={{ imageRendering: "pixelated" }}
      />
    </Box>
    <Text
      className={pixelFont.className}
      fontSize={["7px", "7px", "8px"]}
      letterSpacing="0.04em"
      color="brand.textMuted"
      textAlign="center"
      marginTop={3}
      lineHeight="1.6"
    >
      Thanks for being a part of my journey.
    </Text>
  </Box>
);
