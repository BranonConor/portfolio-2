"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { Box, Flex, Text, Button, Image } from "@chakra-ui/react";

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 600;
const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 50;
const PLATFORM_WIDTH = 70;
const PLATFORM_HEIGHT = 12;
const GRAVITY = 0.4;
const JUMP_FORCE = -12;
const MOVE_SPEED = 6;
const PLATFORM_COUNT = 7;

const STORAGE_KEY = "doodle-jump-high-score";

interface Platform {
  x: number;
  y: number;
  width: number;
  type: "normal" | "moving" | "fragile";
  dx?: number;
  broken?: boolean;
}

interface DoodleJumpGameProps {
  onClose: () => void;
  portraitSrc: string;
}

export function DoodleJumpGame({ onClose, portraitSrc }: DoodleJumpGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number>(0);
  const keysRef = useRef<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const portraitImgRef = useRef<HTMLImageElement | null>(null);

  // Game state refs (mutable during animation loop)
  const playerRef = useRef({
    x: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2,
    y: CANVAS_HEIGHT - 100,
    vy: JUMP_FORCE,
    vx: 0,
    facingLeft: false,
  });
  const platformsRef = useRef<Platform[]>([]);
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

  const generatePlatforms = useCallback(() => {
    const platforms: Platform[] = [];
    // Starting platform under player
    platforms.push({
      x: CANVAS_WIDTH / 2 - PLATFORM_WIDTH / 2,
      y: CANVAS_HEIGHT - 50,
      width: PLATFORM_WIDTH,
      type: "normal",
    });
    for (let i = 1; i < PLATFORM_COUNT; i++) {
      const y = CANVAS_HEIGHT - 50 - i * (CANVAS_HEIGHT / PLATFORM_COUNT);
      const x = Math.random() * (CANVAS_WIDTH - PLATFORM_WIDTH);
      const rand = Math.random();
      let type: Platform["type"] = "normal";
      if (rand > 0.85) type = "moving";
      else if (rand > 0.7) type = "fragile";
      platforms.push({
        x,
        y,
        width: PLATFORM_WIDTH,
        type,
        dx: type === "moving" ? (Math.random() > 0.5 ? 2 : -2) : 0,
      });
    }
    return platforms;
  }, []);

  const startGame = useCallback(() => {
    playerRef.current = {
      x: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2,
      y: CANVAS_HEIGHT - 100,
      vy: JUMP_FORCE,
      vx: 0,
      facingLeft: false,
    };
    platformsRef.current = generatePlatforms();
    scoreRef.current = 0;
    maxHeightRef.current = 0;
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
      const player = playerRef.current;
      const platforms = platformsRef.current;
      const keys = keysRef.current;

      // Input
      if (keys.has("ArrowLeft") || keys.has("a")) {
        player.vx = -MOVE_SPEED;
        player.facingLeft = true;
      } else if (keys.has("ArrowRight") || keys.has("d")) {
        player.vx = MOVE_SPEED;
        player.facingLeft = false;
      } else {
        player.vx = 0;
      }

      // Physics
      player.vy += GRAVITY;
      player.x += player.vx;
      player.y += player.vy;

      // Wrap around screen edges
      if (player.x > CANVAS_WIDTH) player.x = -PLAYER_WIDTH;
      if (player.x + PLAYER_WIDTH < 0) player.x = CANVAS_WIDTH;

      // Platform collision (only when falling)
      if (player.vy > 0) {
        for (const plat of platforms) {
          if (
            player.x + PLAYER_WIDTH > plat.x &&
            player.x < plat.x + plat.width &&
            player.y + PLAYER_HEIGHT >= plat.y &&
            player.y + PLAYER_HEIGHT <= plat.y + PLATFORM_HEIGHT + player.vy
          ) {
            if (plat.type === "fragile") {
              plat.broken = true;
            } else {
              player.vy = JUMP_FORCE;
              player.y = plat.y - PLAYER_HEIGHT;
            }
          }
        }
      }

      // Move moving platforms
      for (const plat of platforms) {
        if (plat.type === "moving" && plat.dx) {
          plat.x += plat.dx;
          if (plat.x <= 0 || plat.x + plat.width >= CANVAS_WIDTH) {
            plat.dx *= -1;
          }
        }
      }

      // Scroll world when player goes above mid-screen
      const scrollThreshold = CANVAS_HEIGHT * 0.4;
      if (player.y < scrollThreshold) {
        const offset = scrollThreshold - player.y;
        player.y = scrollThreshold;
        maxHeightRef.current += offset;
        scoreRef.current = Math.floor(maxHeightRef.current / 10);
        setScore(scoreRef.current);

        for (const plat of platforms) {
          plat.y += offset;
        }

        // Remove platforms below screen, add new ones above
        for (let i = platforms.length - 1; i >= 0; i--) {
          if (platforms[i].y > CANVAS_HEIGHT) {
            const newY = Math.random() * -60;
            const newX = Math.random() * (CANVAS_WIDTH - PLATFORM_WIDTH);
            const rand = Math.random();
            let type: Platform["type"] = "normal";
            if (scoreRef.current > 50 && rand > 0.8) type = "moving";
            else if (scoreRef.current > 30 && rand > 0.65) type = "fragile";
            platforms[i] = {
              x: newX,
              y: newY,
              width: PLATFORM_WIDTH,
              type,
              dx: type === "moving" ? (Math.random() > 0.5 ? 2.5 : -2.5) : 0,
              broken: false,
            };
          }
        }
      }

      // Game over: fell below screen
      if (player.y > CANVAS_HEIGHT) {
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

      // Draw
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Background gradient
      const bg = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
      bg.addColorStop(0, "#0d1117");
      bg.addColorStop(1, "#161b22");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Platforms
      for (const plat of platforms) {
        if (plat.broken) continue;
        ctx.save();
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(plat.x, plat.y, plat.width, PLATFORM_HEIGHT, 4);
        } else {
          ctx.rect(plat.x, plat.y, plat.width, PLATFORM_HEIGHT);
        }
        if (plat.type === "normal") {
          ctx.fillStyle = "#58a6ff";
        } else if (plat.type === "moving") {
          ctx.fillStyle = "#f0883e";
        } else {
          ctx.fillStyle = "#da3633";
        }
        ctx.fill();
        ctx.restore();
      }

      // Player (portrait image)
      ctx.save();
      if (portraitImgRef.current) {
        ctx.save();
        if (player.facingLeft) {
          ctx.translate(player.x + PLAYER_WIDTH, player.y);
          ctx.scale(-1, 1);
          ctx.drawImage(
            portraitImgRef.current,
            0,
            0,
            PLAYER_WIDTH,
            PLAYER_HEIGHT
          );
        } else {
          ctx.drawImage(
            portraitImgRef.current,
            player.x,
            player.y,
            PLAYER_WIDTH,
            PLAYER_HEIGHT
          );
        }
        ctx.restore();
      } else {
        // Fallback circle
        ctx.fillStyle = "#58a6ff";
        ctx.beginPath();
        ctx.arc(
          player.x + PLAYER_WIDTH / 2,
          player.y + PLAYER_HEIGHT / 2,
          PLAYER_WIDTH / 2,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
      ctx.restore();

      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(gameLoopRef.current);
  }, [gameStarted, gameOver]);

  return (
    <Flex
      direction="column"
      align="center"
      gap={3}
      width="100%"
      py={4}
    >
      {/* Header */}
      <Flex
        width={`${CANVAS_WIDTH}px`}
        maxWidth="100%"
        justify="space-between"
        align="center"
      >
        <Flex align="center" gap={3}>
          <Text fontSize="14px" fontWeight="700" color="brand.text">
            Score: {score}
          </Text>
          <Text fontSize="12px" color="brand.textMuted">
            Best: {highScore}
          </Text>
        </Flex>
        <Button
          size="xs"
          variant="ghost"
          onClick={onClose}
          color="brand.textMuted"
          _hover={{ color: "brand.text" }}
          fontSize="12px"
        >
          ✕ Close (Esc)
        </Button>
      </Flex>

      {/* Game canvas */}
      <Box
        position="relative"
        width={`${CANVAS_WIDTH}px`}
        maxWidth="100%"
        height={`${CANVAS_HEIGHT}px`}
        borderRadius="8px"
        overflow="hidden"
        border="1px solid"
        borderColor="brand.border"
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          style={{ display: "block", width: "100%", height: "100%" }}
        />

        {/* Start / Game Over overlay */}
        {(!gameStarted || gameOver) && (
          <Flex
            position="absolute"
            inset={0}
            direction="column"
            align="center"
            justify="center"
            bg="rgba(13, 17, 23, 0.9)"
            gap={4}
          >
            <Image
              src={portraitSrc}
              alt="Player character"
              width="60px"
              height="60px"
              objectFit="contain"
            />
            {gameOver && (
              <Text fontSize="24px" fontWeight="700" color="brand.text">
                Game Over!
              </Text>
            )}
            {gameOver && (
              <Text fontSize="16px" color="brand.textMuted">
                Score: {score}
                {score >= highScore && score > 0 && " 🎉 New High Score!"}
              </Text>
            )}
            <Text
              fontSize="13px"
              color="brand.textMuted"
              textAlign="center"
              maxWidth="280px"
            >
              Use ← → or A/D keys to move. Jump on platforms and climb as high
              as you can!
            </Text>
            <Button
              size="sm"
              bg="brand.accent"
              color="white"
              _hover={{ opacity: 0.9 }}
              onClick={startGame}
            >
              {gameOver ? "Play Again" : "Start Game"}
            </Button>
          </Flex>
        )}
      </Box>

      {/* Legend */}
      <Flex gap={4} fontSize="11px" color="brand.textMuted">
        <Flex align="center" gap={1}>
          <Box w="10px" h="6px" bg="#58a6ff" borderRadius="2px" />
          Normal
        </Flex>
        <Flex align="center" gap={1}>
          <Box w="10px" h="6px" bg="#f0883e" borderRadius="2px" />
          Moving
        </Flex>
        <Flex align="center" gap={1}>
          <Box w="10px" h="6px" bg="#da3633" borderRadius="2px" />
          Fragile
        </Flex>
      </Flex>
    </Flex>
  );
}
