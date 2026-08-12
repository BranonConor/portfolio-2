"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { Box, Text, Flex } from "@chakra-ui/react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Renderer, Program, Mesh, Texture, Geometry } from "ogl";
import { HOLO_VERTEX, HOLO_FRAGMENT } from "./holoShader";
import { pixelFont } from "@/components/boot-intro/pixelFont";
import type { PokemonCard as PokemonCardType } from "@/lib/pokemonCards";

// 3D tilt config
const TILT_MAX = 18;
const SPRING_CONFIG = { stiffness: 200, damping: 26, mass: 0.8 };

type Props = {
  card: PokemonCardType;
  onInspect?: (card: PokemonCardType) => void;
};

/**
 * A single Pokémon card with Balatro-style holographic WebGL overlay.
 *
 * The card image is rendered onto an OGL canvas with a custom fragment
 * shader that layers rainbow foil, specular highlights, grain, and edge
 * glow — all reactive to mouse position.
 *
 * The outer wrapper uses Framer Motion for smooth 3D perspective tilt.
 */
export const PokemonCard: React.FC<Props> = ({ card, onInspect }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const programRef = useRef<Program | null>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const hoverRef = useRef(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Framer Motion tilt values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [TILT_MAX, -TILT_MAX]), SPRING_CONFIG);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-TILT_MAX, TILT_MAX]), SPRING_CONFIG);

  // Init WebGL
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new Renderer({
      canvas,
      alpha: true,
      premultipliedAlpha: false,
      antialias: true,
      width: 320,
      height: 448,
      dpr: Math.min(window.devicePixelRatio, 2),
    });
    rendererRef.current = renderer;
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    // Card texture
    const texture = new Texture(gl, {
      generateMipmaps: false,
      minFilter: gl.LINEAR,
      magFilter: gl.LINEAR,
    });

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      texture.image = img;
      setImageLoaded(true);
    };
    img.src = card.image;

    // Full-screen quad geometry
    const geometry = new Geometry(gl, {
      position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) },
      uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) },
    });

    const program = new Program(gl, {
      vertex: HOLO_VERTEX,
      fragment: HOLO_FRAGMENT,
      uniforms: {
        tCard: { value: texture },
        uTime: { value: 0 },
        uMouse: { value: [0, 0] },
        uHover: { value: 0 },
        uActive: { value: 0 },
      },
      transparent: true,
    });
    programRef.current = program;

    const mesh = new Mesh(gl, { geometry, program });

    const startTime = performance.now();

    const render = () => {
      const elapsed = (performance.now() - startTime) / 1000;
      program.uniforms.uTime.value = elapsed;
      program.uniforms.uMouse.value = [mouseRef.current.x, mouseRef.current.y];

      // Smooth hover transition
      const targetHover = hoverRef.current;
      const currentHover = program.uniforms.uHover.value as number;
      program.uniforms.uHover.value = currentHover + (targetHover - currentHover) * 0.08;

      renderer.render({ scene: mesh });
      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [card.image]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(x);
      mouseY.set(y);
      mouseRef.current = { x: x * 2, y: -y * 2 };
    },
    [mouseX, mouseY],
  );

  const handleMouseEnter = useCallback(() => {
    hoverRef.current = 1;
  }, []);

  const handleMouseLeave = useCallback(() => {
    hoverRef.current = 0;
    mouseX.set(0);
    mouseY.set(0);
    mouseRef.current = { x: 0, y: 0 };
  }, [mouseX, mouseY]);

  const handleClick = useCallback(() => {
    onInspect?.(card);
  }, [card, onInspect]);

  const rarityLabel =
    card.rarity === "ex"
      ? "EX"
      : card.rarity === "reverse-holo"
        ? "REV HOLO"
        : card.rarity.toUpperCase();

  return (
    <Box
      as={motion.div}
      style={{
        perspective: "1000px",
      }}
      width="100%"
      maxWidth="240px"
      cursor="pointer"
      onClick={handleClick}
    >
      <Box
        as={motion.div}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        borderRadius="12px"
        overflow="hidden"
        border="2px solid"
        borderColor="brand.border"
        bg="brand.surface"
        transition="border-color 0.2s ease"
        _hover={{ borderColor: "brand.borderHover" }}
        position="relative"
        role="button"
        tabIndex={0}
        aria-label={`Inspect ${card.name}`}
      >
        {/* WebGL canvas with holo shader */}
        <Box
          position="relative"
          width="100%"
          paddingTop="140%"
          bg="#1a1a2e"
          overflow="hidden"
        >
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "block",
              opacity: imageLoaded ? 1 : 0,
              transition: "opacity 0.4s ease",
            }}
          />
          {!imageLoaded && (
            <Flex
              position="absolute"
              inset={0}
              align="center"
              justify="center"
              className={pixelFont.className}
              fontSize="10px"
              color="brand.textMuted"
              letterSpacing="0.08em"
            >
              LOADING...
            </Flex>
          )}
        </Box>

        {/* Card info footer */}
        <Box padding={2.5} paddingTop={2}>
          <Text
            className={pixelFont.className}
            fontSize="9px"
            letterSpacing="0.06em"
            color="brand.text"
            lineHeight="1.4"
            noOfLines={1}
          >
            {card.name}
          </Text>
          <Flex
            justify="space-between"
            align="center"
            marginTop={0.5}
          >
            <Text
              fontSize="9px"
              color="brand.textMuted"
              noOfLines={1}
            >
              {card.set} · {card.number}
            </Text>
            <Flex gap={1} align="center" flexShrink={0}>
              {card.firstEdition && (
                <Text
                  className={pixelFont.className}
                  fontSize="7px"
                  color="#d4a017"
                  letterSpacing="0.06em"
                >
                  1ST
                </Text>
              )}
              {card.japanese && (
                <Text
                  className={pixelFont.className}
                  fontSize="7px"
                  color="#e05050"
                  letterSpacing="0.06em"
                >
                  JP
                </Text>
              )}
              <Text
                className={pixelFont.className}
                fontSize="7px"
                color="brand.textMuted"
                letterSpacing="0.06em"
              >
                {rarityLabel}
              </Text>
            </Flex>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};
