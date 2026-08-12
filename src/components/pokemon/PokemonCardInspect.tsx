"use client";

import { Box, Text, Flex } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { Renderer, Program, Mesh, Texture, Geometry } from "ogl";
import { HOLO_VERTEX, HOLO_FRAGMENT } from "./holoShader";
import { pixelFont } from "@/components/boot-intro/pixelFont";
import type { PokemonCard as PokemonCardType } from "@/lib/pokemonCards";

/**
 * Full-screen inspect overlay — shows a larger, interactive holographic
 * render of a single card with its details.
 */
export const PokemonCardInspect: React.FC<{
  card: PokemonCardType | null;
  onClose: () => void;
}> = ({ card, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);

  // Close on Escape
  useEffect(() => {
    if (!card) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, [card, onClose]);

  // Init large WebGL canvas
  useEffect(() => {
    if (!card) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    setImageLoaded(false);

    const renderer = new Renderer({
      canvas,
      alpha: true,
      premultipliedAlpha: false,
      antialias: true,
      width: 480,
      height: 672,
      dpr: Math.min(window.devicePixelRatio, 2),
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

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
        uHover: { value: 1 },
        uActive: { value: 1 },
      },
      transparent: true,
    });

    const mesh = new Mesh(gl, { geometry, program });
    const startTime = performance.now();

    const render = () => {
      const elapsed = (performance.now() - startTime) / 1000;
      program.uniforms.uTime.value = elapsed;
      program.uniforms.uMouse.value = [mouseRef.current.x, mouseRef.current.y];
      renderer.render({ scene: mesh });
      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [card]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
      mouseRef.current = { x, y };
    },
    [],
  );

  const rarityLabel =
    card?.rarity === "ex"
      ? "EX"
      : card?.rarity === "reverse-holo"
        ? "REV HOLO"
        : card?.rarity.toUpperCase() ?? "";

  return (
    <AnimatePresence>
      {card && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            position="fixed"
            inset={0}
            bg="rgba(20, 18, 12, 0.82)"
            backdropFilter="blur(12px)"
            sx={{ WebkitBackdropFilter: "blur(12px)" }}
            onClick={onClose}
            cursor="pointer"
          />
          <motion.div
            initial={{ scale: 0.85, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.85, y: 30 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            style={{ position: "relative", zIndex: 1 }}
          >
          <Box
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            onMouseMove={handleMouseMove}
            display="flex"
            flexDirection={["column", "column", "row"]}
            alignItems="center"
            gap={[4, 6, 8]}
            maxWidth="800px"
            padding={[4, 6]}
            cursor="default"
          >
            {/* Large card canvas */}
            <Box
              position="relative"
              width={["260px", "320px", "360px"]}
              flexShrink={0}
              borderRadius="14px"
              overflow="hidden"
              border="2px solid"
              borderColor="rgba(255,255,255,0.12)"
              boxShadow="0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(100,100,255,0.08)"
            >
              <Box
                position="relative"
                width="100%"
                paddingTop="140%"
                bg="#1a1a2e"
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
              </Box>
            </Box>

            {/* Card details */}
            <Box
              maxWidth="320px"
              textAlign={["center", "center", "left"]}
            >
              <Text
                className={pixelFont.className}
                fontSize="14px"
                letterSpacing="0.06em"
                color="white"
                lineHeight="1.4"
              >
                {card.name}
              </Text>
              <Flex
                gap={2}
                marginTop={1.5}
                justify={["center", "center", "flex-start"]}
                wrap="wrap"
              >
                <Text
                  className={pixelFont.className}
                  fontSize="9px"
                  color="rgba(255,255,255,0.5)"
                  letterSpacing="0.06em"
                >
                  {card.set}
                </Text>
                <Text
                  className={pixelFont.className}
                  fontSize="9px"
                  color="rgba(255,255,255,0.5)"
                  letterSpacing="0.06em"
                >
                  #{card.number}
                </Text>
                <Text
                  className={pixelFont.className}
                  fontSize="9px"
                  color="rgba(255,255,255,0.4)"
                  letterSpacing="0.06em"
                >
                  {rarityLabel}
                </Text>
                {card.firstEdition && (
                  <Text
                    className={pixelFont.className}
                    fontSize="9px"
                    color="#d4a017"
                    letterSpacing="0.06em"
                  >
                    1ST EDITION
                  </Text>
                )}
                {card.japanese && (
                  <Text
                    className={pixelFont.className}
                    fontSize="9px"
                    color="#e05050"
                    letterSpacing="0.06em"
                  >
                    JAPANESE
                  </Text>
                )}
              </Flex>
              {card.description && (
                <Text
                  fontSize="13px"
                  color="rgba(255,255,255,0.65)"
                  marginTop={3}
                  lineHeight="1.6"
                >
                  {card.description}
                </Text>
              )}
              <Text
                className={pixelFont.className}
                fontSize="8px"
                color="rgba(255,255,255,0.25)"
                marginTop={4}
                letterSpacing="0.08em"
              >
                CLICK ANYWHERE TO CLOSE · MOVE MOUSE FOR HOLO EFFECT
              </Text>
            </Box>
          </Box>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
