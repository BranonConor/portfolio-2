"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { Box, Text, Flex } from "@chakra-ui/react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Renderer, Program, Mesh, Geometry } from "ogl";
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
 * The card image is a regular <img> (no CORS issues). A transparent
 * OGL canvas sits on top, rendering only the holographic foil effect
 * that reacts to mouse position. Framer Motion handles the 3D tilt.
 */
export const PokemonCard: React.FC<Props> = ({ card, onInspect }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const hoverRef = useRef(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Framer Motion tilt values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [TILT_MAX, -TILT_MAX]), SPRING_CONFIG);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-TILT_MAX, TILT_MAX]), SPRING_CONFIG);

  // Init WebGL overlay
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Size the renderer to match the displayed container
    const rect = container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio, 2);
    const w = Math.round(rect.width);
    const h = Math.round(rect.height);

    const renderer = new Renderer({
      canvas,
      alpha: true,
      premultipliedAlpha: false,
      antialias: true,
      width: w,
      height: h,
      dpr,
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Full-viewport triangle
    const geometry = new Geometry(gl, {
      position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) },
      uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) },
    });

    const program = new Program(gl, {
      vertex: HOLO_VERTEX,
      fragment: HOLO_FRAGMENT,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: [0, 0] },
        uHover: { value: 0 },
      },
      transparent: true,
    });

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

    // Resize observer to keep canvas matched to container
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: ew, height: eh } = entry.contentRect;
        if (ew > 0 && eh > 0) {
          renderer.setSize(Math.round(ew), Math.round(eh));
        }
      }
    });
    ro.observe(container);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

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

  // Handle cached images that complete before React attaches onLoad
  const imgRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalHeight > 0) {
      setImageLoaded(true);
    }
  }, []);

  return (
    <Box
      width="100%"
      maxWidth="240px"
      cursor="pointer"
      onClick={handleClick}
    >
      {/* 3D tilt card container */}
      <Box
        as={motion.div}
        style={{
          perspective: "1000px",
        }}
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
          bg="#1a1a2e"
          transition="border-color 0.2s ease"
          _hover={{ borderColor: "brand.borderHover" }}
          position="relative"
          role="button"
          tabIndex={0}
          aria-label={`Inspect ${card.name}`}
        >
          {/* Card image + transparent holo overlay */}
          <Box
            ref={containerRef}
            position="relative"
            width="100%"
            overflow="hidden"
            sx={{ aspectRatio: "5 / 7" }}
          >
            <img
              ref={imgRef}
              src={card.image}
              alt={card.name}
              onLoad={() => setImageLoaded(true)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
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
                color="rgba(255,255,255,0.4)"
                letterSpacing="0.08em"
              >
                LOADING...
              </Flex>
            )}
            {/* Transparent WebGL holo overlay */}
            <canvas
              ref={canvasRef}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "block",
                pointerEvents: "none",
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Card info — outside the card border for true card shape */}
      <Box paddingX={1} paddingTop={2}>
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
  );
};
