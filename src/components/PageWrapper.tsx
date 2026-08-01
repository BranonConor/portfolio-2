"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Box, BoxProps, Flex } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { REVERSE_BOOT_STORAGE_KEY, PIXEL_CURSOR, PAPER_BG_SX } from "@/lib/consoleTheme";
import { CARTRIDGES } from "@/lib/cartridges";
import { CartridgeNav } from "./CartridgeNav";
import { CursorSparkles } from "./boot-intro/CursorSparkles";
import { pixelFont } from "./boot-intro/pixelFont";
import { proseFont } from "./proseFont";

// The exact same paper texture (grain + vignette, no scanlines) the boot
// intro's cartridge-select screen uses — so the "screen flicks on to
// paper" moment at the end of the boot sequence hands off to an identical
// surface underneath, rather than a different texture (this used to be a
// CRT scanline overlay) taking over the instant you land on a route.
const PaperTextureOverlay = () => (
  <Box aria-hidden="true" position="fixed" inset={0} pointerEvents="none" zIndex={0} sx={PAPER_BG_SX} />
);

export const PageWrapper: React.FC<BoxProps> = ({
  children,
  ...otherProps
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [poweringOff, setPoweringOff] = useState(false);

  // Themes the ESC/power button with the current route's cartridge accent
  // color (same lookup pattern used by PageHeading/filter chips), so it
  // reads as part of each section's palette rather than a generic overlay.
  const accentColor = useMemo(
    () => CARTRIDGES.find((c) => pathname.startsWith(c.href))?.color ?? "#332C1C",
    [pathname],
  );

  // ESC reverses the "zoom in" from anywhere inside the console back out
  // to the dormant GBC on the home screen — visitors can re-enter (press
  // START again) at any time, it's never a one-way trip.
  const powerOff = useCallback(() => {
    if (pathname === "/") return;
    setPoweringOff(true);
  }, [pathname]);

  useEffect(() => {
    if (pathname === "/") return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") powerOff();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pathname, powerOff]);

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
    <AnimatePresence mode="wait">
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
        sx={pathname === "/" ? undefined : { cursor: PIXEL_CURSOR }}
        {...otherProps}
      >
        <PaperTextureOverlay />
        {/* BootIntro (rendered above this on "/") already provides its own
            pixel cursor + sparkle trail while the overlay is up — avoid
            mounting a second identical pointermove listener on top of it. */}
        {pathname !== "/" && <CursorSparkles />}

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
          exit={{ opacity: 0, y: 8 }}
        >
          <Box position="relative">
            <CartridgeNav />
            {children}
          </Box>
        </Box>

        {pathname !== "/" && (
          <Flex
            position="fixed"
            top={4}
            left={4}
            zIndex={101}
            alignItems="center"
            gap={2}
          >
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

            {/* Wordmark logo — kept in its own full-color palette (not
                tinted per-route like ESC above) so it reads as a fixed
                brand mark rather than a themed UI control, and doesn't
                clash with whichever accent color the current route uses. */}
            <Box
              as="button"
              type="button"
              onClick={powerOff}
              display="flex"
              alignItems="center"
              justifyContent="center"
              height="30px"
              paddingX={2.5}
              bg="rgba(51, 44, 28, 0.06)"
              backdropFilter="blur(10px) saturate(160%)"
              sx={{ WebkitBackdropFilter: "blur(10px) saturate(160%)" }}
              border="2px solid"
              borderColor="brand.border"
              borderRadius="10px"
              _hover={{ borderColor: "brand.borderHover", bg: "rgba(51, 44, 28, 0.1)" }}
              transition="0.15s ease all"
              aria-label="Branon Eusebio — power off and return to the console"
            >
              <Box
                as="img"
                src="/logo-mark-color.svg"
                alt="Branon Eusebio"
                height="13px"
                width="auto"
                display="block"
              />
            </Box>
          </Flex>
        )}
      </Box>
    </AnimatePresence>
  );
};
