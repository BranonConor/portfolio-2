"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { REVERSE_BOOT_STORAGE_KEY, PIXEL_CURSOR, PAPER_BG_SX } from "@/lib/consoleTheme";
import { CARTRIDGES } from "@/lib/cartridges";
import { CartridgeNav } from "@/components/CartridgeNav";
import { CursorSparkles } from "@/components/boot-intro/CursorSparkles";
import { useBootChime } from "@/components/boot-intro/useBootChime";
import { SoundMuteIcon } from "@/components/boot-intro/SoundMuteIcon";
import { pixelFont } from "@/components/boot-intro/pixelFont";
import { proseFont } from "@/components/proseFont";
import { PixelTrailFooter } from "@/components/PixelTrailFooter";

// The exact same paper texture (grain + vignette, no scanlines) the boot
// intro's cartridge-select screen uses — so the "screen flicks on to
// paper" moment at the end of the boot sequence hands off to an identical
// surface underneath, rather than a different texture taking over the
// instant you land on a route.
const PaperTextureOverlay = () => (
  <Box aria-hidden="true" position="fixed" inset={0} pointerEvents="none" zIndex={0} sx={PAPER_BG_SX} />
);

/**
 * Persistent chrome shared by every "inside the console" route (About,
 * Blog, Projects, Engagements, In the Wild — everything except the
 * boot/cartridge-select home screen at "/"). Living in a route group layout
 * (rather than being re-rendered per page via `PageWrapper`, as it used to
 * be) means this stays mounted across navigations between those routes —
 * `CartridgeNav` in particular no longer unmounts/remounts on every route
 * change, so its per-cartridge tilt/position settle once and it only ever
 * pops up/down in place to reflect hover/active state, instead of resetting
 * and replaying its whole entrance every time you navigate.
 */
export default function ProductLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [poweringOff, setPoweringOff] = useState(false);
  const { muted, toggleMute } = useBootChime();

  // Keep the console route ready before the user presses ESC. In development,
  // an invalidated "/" route can otherwise spend several seconds compiling
  // after this page has already faded out, which looks like a stuck green
  // screen even though navigation is still pending.
  useEffect(() => {
    router.prefetch("/");
  }, [router]);

  // Themes the ESC/power button with the current route's cartridge accent
  // color (same lookup pattern used by PageHeading/filter chips), so it
  // reads as part of each section's palette rather than a generic overlay.
  const accentColor = useMemo(
    () => CARTRIDGES.find((c) => pathname.startsWith(c.href))?.color ?? "#332C1C",
    [pathname],
  );

  // Nested post pages (e.g. /blog/posts/[slug]) render their own fixed
  // up/down scroll arrows in the top-right corner — the logo needs to
  // shift left there to leave even spacing instead of overlapping them.
  const isPostPage = pathname.includes("/posts/");

  // ESC reverses the "zoom in" from anywhere inside the console back out
  // to the dormant GBC on the home screen — visitors can re-enter (press
  // START again) at any time, it's never a one-way trip.
  const powerOff = useCallback(() => {
    setPoweringOff(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") powerOff();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [powerOff]);

  useEffect(() => {
    if (!poweringOff) return;
    const timeout = window.setTimeout(() => {
      // Tells BootIntro (mounting fresh at "/") to play the console zooming
      // back OUT to its idle frame instead of just appearing there — the
      // reverse of the cartridge power-on zoom that brought us in.
      window.sessionStorage.setItem(REVERSE_BOOT_STORAGE_KEY, "1");
      router.push("/");
    }, 380);
    return () => window.clearTimeout(timeout);
  }, [poweringOff, router]);

  return (
    <Box
      as="main"
      id="main-content"
      className={proseFont.className}
      bg="brand.bg"
      minHeight="100vh"
      maxWidth="100%"
      width="100%"
      paddingY={0}
      display="flex"
      justifyContent="center"
      boxSizing="border-box"
      position="relative"
      overflow="hidden"
      zIndex={1}
      sx={{ cursor: PIXEL_CURSOR }}
    >
      <PaperTextureOverlay />
      <CursorSparkles />

      <Box
        as={motion.div}
        maxWidth="960px"
        position="relative"
        // Mobile needs a touch more headroom than the sm/md breakpoints:
        // the fixed ESC button (top=4) and the active/hovered cartridge in
        // CartridgeNav (which peeks up above this padding, then bumps up
        // further when active — see ROW_TOP/ACTIVE_Y) can otherwise
        // overlap around the top-left corner on narrow viewports.
        pt={[28, 24, 28]}
        pb={[10, 12, 16]}
        paddingX={[4, 6, 8]}
        width="100%"
        minHeight="100vh"
        boxSizing="border-box"
        display="flex"
        flexDirection="column"
        zIndex={1}
        initial={false}
        animate={
          poweringOff
            ? {
                opacity: 0,
                scale: 0.82,
                transition: { duration: 0.38, ease: "easeIn" },
              }
            : {
                y: 0,
                opacity: 1,
                scale: 1,
                transition: { duration: 0.4, ease: "easeOut" },
              }
        }
      >
        <Box position="relative" flex={1}>
          <CartridgeNav />
          {children}
        </Box>
        <PixelTrailFooter />
      </Box>

      <Flex position="fixed" top={4} left={4} zIndex={101} alignItems="center" gap={2}>
        <Box
          as="button"
          type="button"
          onClick={powerOff}
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={1.5}
          height="30px"
          className={pixelFont.className}
          fontSize="8px"
          letterSpacing="0.04em"
          color="brand.text"
          bg={`${accentColor}26`}
          backdropFilter="blur(10px) saturate(160%)"
          sx={{ WebkitBackdropFilter: "blur(10px) saturate(160%)" }}
          border="2px solid"
          borderColor={`${accentColor}55`}
          borderRadius="10px"
          paddingX={2}
          _hover={{ borderColor: accentColor, bg: `${accentColor}28` }}
          transition="0.15s ease all"
          aria-label="Power off and return to the console"
        >
          <Box as="svg" viewBox="0 0 24 24" width="10px" height="10px" aria-hidden="true">
            <path
              d="M12 3v7"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M6.5 6.5a8 8 0 1 0 11 0"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          </Box>
          ESC
        </Box>

        {/* Persistent sound toggle — same speaker glyph and mute-state
            store as the boot cartridge-picker's mute button, so muting
            here (or there) mutes every sound on every route, and this
            button always reflects the current state. Square icon-button
            sizing matches ESC's 30px band exactly. */}
        <Box
          as="button"
          type="button"
          onClick={toggleMute}
          aria-pressed={muted}
          aria-label={muted ? "Unmute sound effects" : "Mute sound effects"}
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="30px"
          height="30px"
          flexShrink={0}
          color="brand.text"
          bg={`${accentColor}26`}
          backdropFilter="blur(10px) saturate(160%)"
          sx={{ WebkitBackdropFilter: "blur(10px) saturate(160%)" }}
          border="2px solid"
          borderColor={`${accentColor}55`}
          borderRadius="10px"
          cursor="pointer"
          _hover={{ borderColor: accentColor, bg: `${accentColor}28` }}
          transition="0.15s ease all"
        >
          <SoundMuteIcon muted={muted} size={12} />
        </Box>
      </Flex>

      {/* Wordmark logo — mirrors the ESC button's distance from the
          corner and its 30px vertical band, just on the opposite side,
          so the two stay perfectly aligned. Rendered bare (no
          card/backdrop chrome) so it reads as a lightweight brand mark
          rather than another UI control; the mark itself is sized well
          under the 30px band and simply centers within it. Nested post
          pages render their own fixed up/down scroll arrows in this same
          corner (ScrollButton, right=4/top=16px, 30px squares) — on
          those routes we shift the logo further left, leaving even
          breathing room between it and the arrow column instead of
          overlapping. */}
      <Box
        as="button"
        type="button"
        onClick={powerOff}
        position="fixed"
        top={4}
        right={isPostPage ? "58px" : 4}
        zIndex={101}
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="30px"
        padding={0}
        bg="transparent"
        border="none"
        opacity={0.9}
        _hover={{ opacity: 1 }}
        transition="0.15s ease, right 0.2s ease"
        aria-label="Branon Eusebio — power off and return to the console"
      >
        <Box
          as="img"
          src="/logo-mark-color.svg"
          alt="Branon Eusebio"
          height="16px"
          width="auto"
          display="block"
        />
      </Box>
    </Box>
  );
}
