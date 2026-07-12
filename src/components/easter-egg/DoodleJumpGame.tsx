"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { Box, Flex, Text, Button, Image } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "doodle-jump-high-score";

// Game constants (relative to canvas size)
const PLAYER_RATIO = 0.08; // player size relative to canvas width
const PLATFORM_W_RATIO = 0.12;
const PLATFORM_H = 10;
const GRAVITY = 0.35;
const JUMP_FORCE = -11.5;
const MOVE_SPEED = 5.5;
const PLATFORM_COUNT = 8;

// Particle types
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: "jump" | "trail" | "death" | "star" | "landing";
}

interface Platform {
  x: number;
  y: number;
  width: number;
  type: "normal" | "moving" | "fragile";
  dx?: number;
  broken?: boolean;
  glowPhase?: number;
}

interface DoodleJumpGameProps {
  onClose: () => void;
  portraitSrc: string;
}

export function DoodleJumpGame({ onClose, portraitSrc }: DoodleJumpGameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number>(0);
  const keysRef = useRef<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const portraitImgRef = useRef<HTMLImageElement | null>(null);
  const canvasSizeRef = useRef({ width: 600, height: 700 });
  const shakeRef = useRef({ x: 0, y: 0, intensity: 0 });
  const frameCountRef = useRef(0);

  // Game state refs
  const playerRef = useRef({
    x: 0,
    y: 0,
    vy: JUMP_FORCE,
    vx: 0,
    facingLeft: false,
    rotation: 0,
    squash: 1,
  });
  const platformsRef = useRef<Platform[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const starsRef = useRef<{ x: number; y: number; size: number; twinkle: number; speed: number }[]>([]);
  const scoreRef = useRef(0);
  const maxHeightRef = useRef(0);

  // Load high score
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setHighScore(parseInt(stored, 10));
  }, []);

  // Preload portrait image
  useEffect(() => {
    const img = new window.Image();
    img.src = portraitSrc;
    img.onload = () => {
      portraitImgRef.current = img;
    };
  }, [portraitSrc]);

  // Generate background stars
  useEffect(() => {
    const stars = [];
    for (let i = 0; i < 80; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 2 + 0.5,
        twinkle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.3 + 0.1,
      });
    }
    starsRef.current = stars;
  }, []);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const width = Math.floor(rect.width);
        const height = Math.floor(rect.height);
        canvasRef.current.width = width;
        canvasRef.current.height = height;
        canvasSizeRef.current = { width, height };
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Spawn particles
  const spawnParticles = useCallback(
    (
      x: number,
      y: number,
      count: number,
      type: Particle["type"],
      baseColor: string
    ) => {
      const particles = particlesRef.current;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
        const speed = type === "death" ? Math.random() * 6 + 2 : Math.random() * 3 + 1;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - (type === "jump" ? 2 : 0),
          life: 1,
          maxLife: type === "death" ? 60 : type === "jump" ? 25 : 15,
          size: type === "death" ? Math.random() * 5 + 3 : Math.random() * 3 + 1.5,
          color: baseColor,
          type,
        });
      }
    },
    []
  );

  const generatePlatforms = useCallback(() => {
    const { width, height } = canvasSizeRef.current;
    const platWidth = width * PLATFORM_W_RATIO;
    const platforms: Platform[] = [];
    platforms.push({
      x: width / 2 - platWidth / 2,
      y: height - 60,
      width: platWidth,
      type: "normal",
      glowPhase: Math.random() * Math.PI * 2,
    });
    for (let i = 1; i < PLATFORM_COUNT; i++) {
      const y = height - 60 - i * (height / PLATFORM_COUNT);
      const x = Math.random() * (width - platWidth);
      const rand = Math.random();
      let type: Platform["type"] = "normal";
      if (rand > 0.85) type = "moving";
      else if (rand > 0.7) type = "fragile";
      platforms.push({
        x,
        y,
        width: platWidth,
        type,
        dx: type === "moving" ? (Math.random() > 0.5 ? 2 : -2) : 0,
        glowPhase: Math.random() * Math.PI * 2,
      });
    }
    return platforms;
  }, []);

  const startGame = useCallback(() => {
    const { width, height } = canvasSizeRef.current;
    const playerSize = width * PLAYER_RATIO;
    playerRef.current = {
      x: width / 2 - playerSize / 2,
      y: height - 120,
      vy: JUMP_FORCE,
      vx: 0,
      facingLeft: false,
      rotation: 0,
      squash: 1,
    };
    platformsRef.current = generatePlatforms();
    particlesRef.current = [];
    scoreRef.current = 0;
    maxHeightRef.current = 0;
    shakeRef.current = { x: 0, y: 0, intensity: 0 };
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
  }, [generatePlatforms]);

  // Key handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      if (e.key === "Escape") onClose();
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key);
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [onClose]);

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const loop = () => {
      const { width, height } = canvasSizeRef.current;
      const playerSize = width * PLAYER_RATIO;
      const platWidth = width * PLATFORM_W_RATIO;
      const player = playerRef.current;
      const platforms = platformsRef.current;
      const particles = particlesRef.current;
      const keys = keysRef.current;
      frameCountRef.current++;

      // Input
      if (keys.has("ArrowLeft") || keys.has("a")) {
        player.vx = -MOVE_SPEED;
        player.facingLeft = true;
      } else if (keys.has("ArrowRight") || keys.has("d")) {
        player.vx = MOVE_SPEED;
        player.facingLeft = false;
      } else {
        player.vx *= 0.85; // Smooth deceleration
      }

      // Physics
      player.vy += GRAVITY;
      player.x += player.vx;
      player.y += player.vy;

      // Squash & stretch
      if (player.vy < -2) {
        player.squash = 0.85 + Math.min(Math.abs(player.vy) * 0.01, 0.15);
      } else if (player.vy > 2) {
        player.squash = 1.15 - Math.min(player.vy * 0.01, 0.15);
      } else {
        player.squash += (1 - player.squash) * 0.1;
      }

      // Subtle rotation based on horizontal velocity
      player.rotation = player.vx * 1.5;

      // Trail particles while moving fast
      if (Math.abs(player.vy) > 4 && frameCountRef.current % 3 === 0) {
        particles.push({
          x: player.x + playerSize / 2 + (Math.random() - 0.5) * 10,
          y: player.y + playerSize,
          vx: (Math.random() - 0.5) * 0.5,
          vy: player.vy > 0 ? -0.5 : 0.5,
          life: 1,
          maxLife: 15,
          size: Math.random() * 2 + 1,
          color: "#58a6ff",
          type: "trail",
        });
      }

      // Wrap around screen edges
      if (player.x > width) player.x = -playerSize;
      if (player.x + playerSize < 0) player.x = width;

      // Platform collision (only when falling)
      if (player.vy > 0) {
        for (const plat of platforms) {
          if (
            player.x + playerSize > plat.x + 5 &&
            player.x < plat.x + plat.width - 5 &&
            player.y + playerSize >= plat.y &&
            player.y + playerSize <= plat.y + PLATFORM_H + player.vy + 2
          ) {
            if (plat.type === "fragile") {
              plat.broken = true;
              // Fragile break particles
              spawnParticles(
                plat.x + plat.width / 2,
                plat.y,
                8,
                "death",
                "#da3633"
              );
              shakeRef.current.intensity = 3;
            } else {
              player.vy = JUMP_FORCE;
              player.y = plat.y - playerSize;
              player.squash = 0.7;
              // Jump particles
              spawnParticles(
                player.x + playerSize / 2,
                plat.y,
                6,
                "jump",
                plat.type === "moving" ? "#f0883e" : "#58a6ff"
              );
            }
          }
        }
      }

      // Move moving platforms
      for (const plat of platforms) {
        if (plat.type === "moving" && plat.dx) {
          plat.x += plat.dx;
          if (plat.x <= 0 || plat.x + plat.width >= width) {
            plat.dx *= -1;
          }
        }
        // Animate glow phase
        if (plat.glowPhase !== undefined) {
          plat.glowPhase += 0.03;
        }
      }

      // Scroll world
      const scrollThreshold = height * 0.35;
      if (player.y < scrollThreshold) {
        const offset = scrollThreshold - player.y;
        player.y = scrollThreshold;
        maxHeightRef.current += offset;
        scoreRef.current = Math.floor(maxHeightRef.current / 8);
        setScore(scoreRef.current);

        for (const plat of platforms) {
          plat.y += offset;
        }
        // Scroll particles too
        for (const p of particles) {
          p.y += offset;
        }

        // Recycle platforms
        for (let i = platforms.length - 1; i >= 0; i--) {
          if (platforms[i].y > height + 20) {
            const newY = Math.random() * -80 - 20;
            const newX = Math.random() * (width - platWidth);
            const rand = Math.random();
            let type: Platform["type"] = "normal";
            if (scoreRef.current > 50 && rand > 0.75) type = "moving";
            else if (scoreRef.current > 30 && rand > 0.6) type = "fragile";
            platforms[i] = {
              x: newX,
              y: newY,
              width: platWidth,
              type,
              dx: type === "moving" ? (Math.random() > 0.5 ? 2.5 : -2.5) : 0,
              broken: false,
              glowPhase: Math.random() * Math.PI * 2,
            };
          }
        }
      }

      // Update screen shake
      if (shakeRef.current.intensity > 0) {
        shakeRef.current.x = (Math.random() - 0.5) * shakeRef.current.intensity * 2;
        shakeRef.current.y = (Math.random() - 0.5) * shakeRef.current.intensity * 2;
        shakeRef.current.intensity *= 0.85;
        if (shakeRef.current.intensity < 0.1) shakeRef.current.intensity = 0;
      }

      // Update particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1 / p.maxLife;
        if (p.type === "jump" || p.type === "death") {
          p.vy += 0.1;
        }
        if (p.life <= 0) {
          particles.splice(i, 1);
        }
      }

      // Game over: fell below screen
      if (player.y > height + 50) {
        // Death explosion
        spawnParticles(
          player.x + playerSize / 2,
          height - 100,
          20,
          "death",
          "#ff6b6b"
        );
        shakeRef.current.intensity = 8;

        const finalScore = scoreRef.current;
        const stored = localStorage.getItem(STORAGE_KEY);
        const currentHigh = stored ? parseInt(stored, 10) : 0;
        if (finalScore > currentHigh) {
          localStorage.setItem(STORAGE_KEY, String(finalScore));
          setHighScore(finalScore);
        }
        setGameOver(true);
        return;
      }

      // === DRAW ===
      ctx.save();
      ctx.translate(shakeRef.current.x, shakeRef.current.y);

      // Background - deep space gradient
      const bg = ctx.createLinearGradient(0, 0, 0, height);
      bg.addColorStop(0, "#030810");
      bg.addColorStop(0.4, "#0a1628");
      bg.addColorStop(1, "#0d1117");
      ctx.fillStyle = bg;
      ctx.fillRect(-10, -10, width + 20, height + 20);

      // Background stars with parallax twinkle
      const stars = starsRef.current;
      for (const star of stars) {
        const sx = star.x * width;
        const sy = ((star.y * height + frameCountRef.current * star.speed * 0.3) % height);
        const twinkle = Math.sin(frameCountRef.current * 0.02 + star.twinkle) * 0.4 + 0.6;
        ctx.globalAlpha = twinkle * 0.7;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(sx, sy, star.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Platforms with glow effect
      for (const plat of platforms) {
        if (plat.broken) continue;

        const glowIntensity = Math.sin(plat.glowPhase || 0) * 0.3 + 0.7;
        let color = "#58a6ff";
        let glowColor = "rgba(88, 166, 255, 0.4)";
        if (plat.type === "moving") {
          color = "#f0883e";
          glowColor = "rgba(240, 136, 62, 0.4)";
        } else if (plat.type === "fragile") {
          color = "#da3633";
          glowColor = "rgba(218, 54, 51, 0.3)";
        }

        // Glow
        ctx.save();
        ctx.shadowBlur = 12 * glowIntensity;
        ctx.shadowColor = glowColor;
        ctx.fillStyle = color;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(plat.x, plat.y, plat.width, PLATFORM_H, 5);
        } else {
          ctx.rect(plat.x, plat.y, plat.width, PLATFORM_H);
        }
        ctx.fill();

        // Highlight on top edge
        ctx.fillStyle = `rgba(255, 255, 255, ${0.15 * glowIntensity})`;
        ctx.fillRect(plat.x + 2, plat.y, plat.width - 4, 2);
        ctx.restore();
      }

      // Particles
      for (const p of particles) {
        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = p.type === "death" ? 8 : 4;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Player with rotation and squash/stretch
      ctx.save();
      const px = player.x + playerSize / 2;
      const py = player.y + playerSize / 2;
      ctx.translate(px, py);
      ctx.rotate((player.rotation * Math.PI) / 180);
      ctx.scale(2 - player.squash, player.squash);

      // Player glow
      ctx.shadowBlur = 15;
      ctx.shadowColor = "rgba(88, 166, 255, 0.5)";

      if (portraitImgRef.current) {
        if (player.facingLeft) {
          ctx.scale(-1, 1);
        }
        ctx.drawImage(
          portraitImgRef.current,
          -playerSize / 2,
          -playerSize / 2,
          playerSize,
          playerSize
        );
      } else {
        ctx.fillStyle = "#58a6ff";
        ctx.beginPath();
        ctx.arc(0, 0, playerSize / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Score display on canvas (subtle, top-left)
      ctx.save();
      ctx.font = "bold 14px -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.fillText(`↑ ${scoreRef.current}`, 16, 30);
      ctx.restore();

      ctx.restore(); // End shake transform

      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(gameLoopRef.current);
  }, [gameStarted, gameOver, spawnParticles]);

  return (
    <Box
      ref={containerRef}
      position="relative"
      width="100%"
      height="100%"
      minHeight="500px"
      overflow="hidden"
      borderRadius="12px"
      bg="#030810"
    >
      {/* Full-bleed game canvas */}
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          position: "absolute",
          inset: 0,
        }}
      />

      {/* HUD overlay — always on top */}
      <Flex
        position="absolute"
        top={0}
        left={0}
        right={0}
        justify="space-between"
        align="center"
        px={4}
        py={3}
        bg="linear-gradient(to bottom, rgba(3,8,16,0.7), transparent)"
        zIndex={2}
        pointerEvents="none"
      >
        <Flex align="center" gap={3} pointerEvents="auto">
          <Text fontSize="13px" fontWeight="700" color="white" opacity={0.9}>
            Score: {score}
          </Text>
          <Text fontSize="11px" color="whiteAlpha.600">
            Best: {highScore}
          </Text>
        </Flex>
        <Button
          size="xs"
          variant="ghost"
          onClick={onClose}
          color="whiteAlpha.700"
          _hover={{ color: "white", bg: "whiteAlpha.100" }}
          fontSize="11px"
          pointerEvents="auto"
          borderRadius="6px"
        >
          ✕ ESC
        </Button>
      </Flex>

      {/* Platform legend — bottom */}
      {gameStarted && !gameOver && (
        <Flex
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          justify="center"
          gap={4}
          py={2}
          bg="linear-gradient(to top, rgba(3,8,16,0.6), transparent)"
          zIndex={2}
          pointerEvents="none"
        >
          <Flex align="center" gap={1} fontSize="10px" color="whiteAlpha.500">
            <Box w="8px" h="4px" bg="#58a6ff" borderRadius="1px" />
            Normal
          </Flex>
          <Flex align="center" gap={1} fontSize="10px" color="whiteAlpha.500">
            <Box w="8px" h="4px" bg="#f0883e" borderRadius="1px" />
            Moving
          </Flex>
          <Flex align="center" gap={1} fontSize="10px" color="whiteAlpha.500">
            <Box w="8px" h="4px" bg="#da3633" borderRadius="1px" />
            Fragile
          </Flex>
        </Flex>
      )}

      {/* Start / Game Over overlay */}
      <AnimatePresence>
        {(!gameStarted || gameOver) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 3,
            }}
          >
            <Flex
              direction="column"
              align="center"
              justify="center"
              bg="rgba(3, 8, 16, 0.85)"
              backdropFilter="blur(12px)"
              borderRadius="16px"
              border="1px solid rgba(88, 166, 255, 0.15)"
              p={8}
              gap={4}
              maxWidth="320px"
              boxShadow="0 0 60px rgba(88, 166, 255, 0.1), inset 0 1px 0 rgba(255,255,255,0.05)"
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Image
                  src={portraitSrc}
                  alt="Player character"
                  width="70px"
                  height="70px"
                  objectFit="contain"
                  filter="drop-shadow(0 0 12px rgba(88, 166, 255, 0.4))"
                />
              </motion.div>

              {gameOver ? (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring" }}
                  >
                    <Text
                      fontSize="22px"
                      fontWeight="800"
                      color="white"
                      letterSpacing="-0.02em"
                    >
                      Game Over
                    </Text>
                  </motion.div>
                  <Text fontSize="14px" color="whiteAlpha.700">
                    Score: {score}
                    {score >= highScore && score > 0 && " 🎉 New Best!"}
                  </Text>
                </>
              ) : (
                <Text
                  fontSize="18px"
                  fontWeight="700"
                  color="white"
                  letterSpacing="-0.01em"
                >
                  Doodle Jump
                </Text>
              )}

              <Text
                fontSize="12px"
                color="whiteAlpha.500"
                textAlign="center"
                lineHeight="1.5"
              >
                ← → or A/D to move
                <br />
                Jump on platforms · climb high!
              </Text>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="sm"
                  bg="linear-gradient(135deg, #58a6ff, #388bfd)"
                  color="white"
                  fontWeight="700"
                  _hover={{ bg: "linear-gradient(135deg, #79b8ff, #58a6ff)" }}
                  onClick={startGame}
                  borderRadius="8px"
                  px={6}
                  boxShadow="0 4px 20px rgba(88, 166, 255, 0.3)"
                >
                  {gameOver ? "Play Again" : "Start Game"}
                </Button>
              </motion.div>
            </Flex>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
