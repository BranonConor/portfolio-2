"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Box, Text } from "@chakra-ui/react";
import { BootLogoCanvas } from "./BootLogoCanvas";
import { PowerOnScene, type PowerOnSceneHandle } from "./PowerOnScene";
import { CursorSparkles } from "./CursorSparkles";
import { useBootChime } from "./useBootChime";
import { pixelFont } from "./pixelFont";
import { proseFont } from "../proseFont";
import { SCREEN_BG, REVERSE_BOOT_STORAGE_KEY, PIXEL_CURSOR, PAPER_BG_SX } from "@/lib/consoleTheme";
import { CARTRIDGES } from "@/lib/cartridges";

const NAME = "BRANON EUSEBIO";
const BASE_ROLE = "DESIGN ENGINEER";

// SCREEN_BG (imported above) is the console screen's own background color
// (sampled from console-shell.svg) — used once the boot logo takes over so
// the cut from "zoomed into the screen" to "letters flying in on this
// background" is seamless instead of jumping to a plain black void. It's
// also the same green the rest of the site uses (theme.ts) once you're
// past the intro, since every route now lives "inside the console".

// A warm, textured "paper" backdrop for the cartridge-select phase (see
// PAPER_BG_SX in consoleTheme.ts, shared with PageWrapper's in-product
// route background) — a tileable fractal-noise grain layered under a soft
// radial vignette, so the console reads as sitting on a warm surface
// rather than floating in a flat black void.

// Each letter spirals in oversized (right -> up -> left -> down -> center)
// and settles to size, then immediately does a couple of in-place bounces —
// cascading independently per letter (only offset by a short stagger) so the
// whole sequence stays snappy. Once every letter has cascaded through, the
// rainbow shine sweeps across the settled logo.
const STAGGER_MS = 55;
const LETTER_DURATION_MS = 480;
const SWEEP_GAP_MS = 120;
const SWEEP_DURATION_MS = 650;

// Duration of the reverse-boot "screen power-off" flash (see
// `screenOffFlashActive`) — kept short so it reads as a snappy CRT-style
// power-down beat rather than a slow fade.
const SCREEN_OFF_FLASH_MS = 360;
// Duration of the forward "screen power-on" flash (see
// `screenOnFlashActive`) — a touch longer than the power-off version since
// it has one more beat (dot -> line -> full flash -> settle, vs. the
// power-off's flash -> line -> dot), but still snappy.
const SCREEN_ON_FLASH_MS = 420;

const PLUG_IN_MS = 460;
// How long the finished boot logo (post-sweep) holds on screen before
// handing off to the destination page — gives players a beat to actually
// read the name/subtitle instead of it flashing straight through.
const POST_SWEEP_HOLD_MS = 1100;

type Phase = "select" | "booting";

/**
 * The home page's persistent "console hub" — like a real GBA, the shell
 * just idles until you load a cartridge. A cartridge-select list sits next
 * to the dormant console; picking one (click, or arrow keys + Enter) is
 * the real user gesture that unlocks audio and triggers the "power on"
 * zoom into the screen, handing off to the boot logo (fly-in letters +
 * rainbow sweep, its subtitle naming the chosen cartridge), then lands you
 * on that section. `Escape` from any other route (see PageWrapper) zooms
 * back out to this same hub, so you can load a different cartridge any
 * time. Users with `prefers-reduced-motion` get the same selector with all
 * animation skipped — choosing an item navigates immediately.
 */
export function BootIntro() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("select");
  const [selected, setSelected] = useState(0);
  const [activating, setActivating] = useState<number | null>(null);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  // True while playing the reverse "zoom back out" that picks up when
  // arriving from a route via ESC (see PageWrapper) — the console starts
  // snapped to its fully-zoomed frame and eases back down to idle, instead
  // of just appearing at rest, so leaving a route mirrors the boot-in zoom.
  const [reverseBoot, setReverseBoot] = useState(false);
  // Gates the "INSERT CARTRIDGE" list's visibility specifically. Kept a
  // beat behind `reverseBoot` itself (see handlePowerOffComplete) so the
  // list never fades in while the console/background are still mid-way
  // through their own reverse-zoom transition — it only appears once
  // everything else has fully settled at rest.
  //
  // Defaults to `false` (not `true`) deliberately: this is the *safe*
  // resting state for every fresh mount, reverse-boot or not. If it
  // defaulted to `true`, any render that slips out before the reverse-boot
  // layout effect below has run — e.g. a fast-refresh/dev double-render,
  // or a route transition that briefly re-renders this tree — would paint
  // the list visible for a frame even mid-zoom, which is exactly the
  // "flash" this component exists to prevent. Starting hidden and only
  // ever explicitly flipping it on (see the effect below, and
  // `handlePowerOffComplete`) means there's no code path that shows it
  // early by accident.
  const [cartridgeUiReady, setCartridgeUiReady] = useState(false);
  // Gates the boot logo's backdrop specifically: flips `true` once the
  // power-on flash (see `screenOnFlashActive`) has finished revealing the
  // paper backdrop the logo sequence itself plays on.
  const [bootFlickLit, setBootFlickLit] = useState(false);
  const bootFlickTimeoutRef = useRef<number | null>(null);
  // Plays a brief "CRT power-on" flash (a bright dot -> a thin horizontal
  // line -> a full-screen flash -> settles to paper) right as the zoom-in
  // completes and the boot logo takes over — the mirror of
  // `screenOffFlashActive` below, so powering on reads as the screen
  // switching on rather than an abrupt color swap. The boot logo itself is
  // held hidden until this finishes (see the shared opacity toggle further
  // down), so the two beats read in the right order: screen on, then the
  // logo appears.
  const [screenOnFlashActive, setScreenOnFlashActive] = useState(false);
  // Plays a brief "CRT power-off" flash (bright flash -> collapses to a
  // thin horizontal line -> pinches to a dot and fades to black) right as
  // the reverse-boot flow begins, so leaving a route back to the console
  // reads as the screen actually switching off rather than an abrupt color
  // swap. The zoom-out itself (`powerOff()` on the scene) is held until
  // this finishes, so the two beats read in the right order: screen off,
  // then camera pulls back.
  const [screenOffFlashActive, setScreenOffFlashActive] = useState(false);
  const { unlock, playLetterTwinkle, playSparkle, playMoveBlip, muted, toggleMute } =
    useBootChime();
  const powerOnRef = useRef<PowerOnSceneHandle>(null);
  const peekRef = useRef<HTMLImageElement>(null);
  const [flightStart, setFlightStart] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);
  const [consoleAnchor, setConsoleAnchor] = useState<{
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
  }, []);

  // On arriving at "/" from another route via ESC (see PageWrapper), the
  // console should visibly zoom back OUT to its idle resting frame instead
  // of just appearing there — the reverse of the cartridge power-on zoom.
  // Runs as a layout effect (before paint) so the console snaps to its
  // zoomed-in frame before the browser ever paints the normal idle one,
  // avoiding a one-frame flash of "idle" before jumping to "zoomed".
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const hasFlag = window.sessionStorage.getItem(REVERSE_BOOT_STORAGE_KEY);
    if (!hasFlag) {
      // Not arriving via the reverse-zoom flow (a normal fresh landing on
      // "/") — reveal the list right away rather than leaving it stuck at
      // its hidden default.
      setCartridgeUiReady(true);
      return;
    }
    window.sessionStorage.removeItem(REVERSE_BOOT_STORAGE_KEY);

    // Reduced-motion visitors just land on the normal idle screen — nothing
    // to reverse-animate.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCartridgeUiReady(true);
      return;
    }

    setReverseBoot(true);
    setScreenOffFlashActive(true);
    powerOnRef.current?.snapZoomedIn();
    // Let the power-off flash play out fully before the console starts
    // zooming back out — reads as "screen switches off, then the camera
    // pulls away from it" instead of both happening at once.
    const flashTimeout = window.setTimeout(() => {
      setScreenOffFlashActive(false);
      powerOnRef.current?.powerOff();
    }, SCREEN_OFF_FLASH_MS);
    return () => window.clearTimeout(flashTimeout);
  }, []);

  const handlePowerOffComplete = useCallback(() => {
    setReverseBoot(false);
    // The console's transform finishing is only part of the picture — the
    // overlay's own background also cross-fades (0.4s) from the solid
    // screen color back to the paper backdrop once `reverseBoot` flips.
    // Wait for that fade to fully settle too before revealing the
    // cartridge list, so it can never appear to pop in mid-transition.
    window.setTimeout(() => setCartridgeUiReady(true), 420);
  }, []);

  // Lock the page underneath from scrolling while this overlay is mounted —
  // it's a full-viewport experience, so the landing content behind it
  // shouldn't be reachable via scroll until the overlay is dismissed/unmounts.
  useEffect(() => {
    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";
    return () => {
      body.style.overflow = previousOverflow;
    };
  }, []);

  // The cartridge list is positioned a fixed 32px to the right of the
  // console's rendered right edge, rather than a percentage-based gap, so
  // the pair reads as a tight, deliberate group at any viewport size. The
  // console's on-screen box is derived analytically (its aspect ratio +
  // height budget + the -11% translateX applied to its full-bleed layer)
  // rather than measured via ref, since the shell tilts/bobs continuously
  // and measuring its live rect would make the list jitter every frame.
  const [listLeftPx, setListLeftPx] = useState<number | null>(null);
  // Below ~1170px there isn't quite enough room for the console + list pair
  // to breathe at the wide-desktop offsets, so the whole group shifts
  // further left and the cartridge peek switches from the right edge to
  // the top-center of the card (swinging down into view instead of out
  // sideways) to avoid crowding the picker's edge.
  const [isCompactDesktop, setIsCompactDesktop] = useState(false);
  // Below the `md` breakpoint (768px) the picker becomes a right-anchored
  // drawer — fixed to the bottom-right corner, auto height, non-rounded
  // right-side corners so it reads as flush against the viewport edge —
  // instead of the centered bottom sheet used previously. The console
  // nudges left a touch here too, mirroring the "console left / menu right"
  // framing used at wider breakpoints.
  const [isMobileDrawer, setIsMobileDrawer] = useState(false);
  // Below 550px there's no room for a side drawer at all — the picker goes
  // full-width and docks flush to the bottom edge instead, trims itself down
  // to a compact 2-column grid (no subtext, no hover-only affordances), and
  // the console re-centers but scoots up so the two don't overlap.
  const [isFullWidthMobile, setIsFullWidthMobile] = useState(false);
  // Below 350px even the 2-column grid is too tight — nav items go back to a
  // single full-width column, and the console shrinks and rides higher so it
  // doesn't get crowded out by the taller (single-column) picker beneath it.
  const [isTinyMobile, setIsTinyMobile] = useState(false);

  // Runs as a layout effect (before paint) rather than a regular effect —
  // otherwise the console/list render once with their un-measured
  // defaults (`listLeftPx: null`, etc.) and then visibly "scoot" into their
  // real positions a frame later once this recomputes on mount.
  useLayoutEffect(() => {
    const DESKTOP_MQL = "(min-width: 48em)"; // matches the `md` breakpoint used by the [base, sm, md] responsive arrays below
    const COMPACT_DESKTOP_MQL = "(min-width: 48em) and (max-width: 1170px)";
    const MOBILE_DRAWER_MQL = "(max-width: 47.99em)"; // below `md` (768px)
    const FULL_WIDTH_MOBILE_MQL = "(max-width: 549px)";
    const TINY_MOBILE_MQL = "(max-width: 350px)";
    const CONSOLE_ASPECT = 959 / 1418; // console-shell.svg intrinsic ratio
    const CONSOLE_TRANSLATE_FRACTION = 0.16; // matches translateX(-16%) below
    const COMPACT_EXTRA_SHIFT_PX = 120; // additional leftward shift under 1170px
    const CONSOLE_NUDGE_FRACTION = 0.02; // matches the -2% nudge applied while zooming/plugging in
    const LIST_GAP_PX = 48;

    const mql = window.matchMedia(DESKTOP_MQL);
    const compactMql = window.matchMedia(COMPACT_DESKTOP_MQL);
    const mobileDrawerMql = window.matchMedia(MOBILE_DRAWER_MQL);
    const fullWidthMobileMql = window.matchMedia(FULL_WIDTH_MOBILE_MQL);
    const tinyMobileMql = window.matchMedia(TINY_MOBILE_MQL);

    const recompute = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const consoleHeight = Math.min(vh * 0.64, 560);
      const compact = compactMql.matches;
      setIsCompactDesktop(compact);
      setIsMobileDrawer(mobileDrawerMql.matches);
      setIsFullWidthMobile(fullWidthMobileMql.matches);
      setIsTinyMobile(tinyMobileMql.matches);

      // The "plug it into the top of the console" flight target — anchored
      // near the top edge of the shell silhouette, at whatever horizontal
      // position the console will have settled into once the nudge (that
      // kicks in alongside the plug-in/zoom) finishes.
      const desktopExtraShift = mql.matches && compact ? COMPACT_EXTRA_SHIFT_PX : 0;
      const anchorX = mql.matches
        ? vw * 0.5 - vw * CONSOLE_NUDGE_FRACTION - desktopExtraShift
        : vw * 0.5;
      const anchorY = vh * 0.5 - consoleHeight * 0.5 + 26;
      setConsoleAnchor({ x: anchorX, y: anchorY });

      if (!mql.matches) {
        setListLeftPx(null);
        return;
      }
      const consoleWidth = consoleHeight * CONSOLE_ASPECT;
      const consoleCenterX = vw * 0.5 - vw * CONSOLE_TRANSLATE_FRACTION - desktopExtraShift;
      const consoleRight = consoleCenterX + consoleWidth / 2;
      setListLeftPx(consoleRight + LIST_GAP_PX);
    };

    recompute();
    window.addEventListener("resize", recompute);
    mql.addEventListener("change", recompute);
    compactMql.addEventListener("change", recompute);
    mobileDrawerMql.addEventListener("change", recompute);
    fullWidthMobileMql.addEventListener("change", recompute);
    tinyMobileMql.addEventListener("change", recompute);
    return () => {
      window.removeEventListener("resize", recompute);
      mql.removeEventListener("change", recompute);
      compactMql.removeEventListener("change", recompute);
      mobileDrawerMql.removeEventListener("change", recompute);
      fullWidthMobileMql.removeEventListener("change", recompute);
      tinyMobileMql.removeEventListener("change", recompute);
    };
  }, []);

  const cartridge = activating !== null ? CARTRIDGES[activating] : null;
  const role = cartridge ? `${BASE_ROLE} | ${cartridge.label}` : BASE_ROLE;
  const roleChars = useMemo(() => Array.from(role), [role]);

  const roleContainerVariants = useMemo(
    () => ({
      hidden: {},
      visible: {
        transition: {
          staggerChildren: SWEEP_DURATION_MS / 1000 / 2 / roleChars.length,
        },
      },
    }),
    [roleChars.length]
  );
  const roleCharVariants = {
    hidden: { opacity: 0, y: -7 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.16, ease: "easeOut" },
    },
  };

  // Any real change of the highlighted cartridge (hover, focus, or arrow-key
  // nav) unlocks audio (harmless if already unlocked/still locked) and plays
  // a short navigation blip — but only when the index actually changes, so
  // re-hovering the same already-selected item doesn't retrigger the sound.
  // `unlock()`/`playMoveBlip()` are called directly here (not nested inside
  // the `setSelected` updater) so they stay unambiguously synchronous within
  // whatever real user gesture triggered this, which Safari's autoplay
  // heuristics can be picky about.
  const selectCartridge = useCallback(
    (index: number) => {
      if (selected !== index) {
        unlock();
        playMoveBlip();
      }
      setSelected(index);
    },
    [selected, unlock, playMoveBlip]
  );

  const loadCartridge = useCallback(
    (index: number) => {
      if (activating !== null) return;

      if (reducedMotion) {
        router.push(CARTRIDGES[index].href);
        return;
      }

      // Snapshot where the peeking cartridge currently sits on screen so
      // the "plug it into the console" flight can animate from its real
      // position instead of a hardcoded one.
      const rect = peekRef.current?.getBoundingClientRect();
      setFlightStart(
        rect
          ? {
              left: rect.left,
              top: rect.top,
              width: rect.width,
              height: rect.height,
            }
          : null
      );

      setSelected(index);
      setActivating(index);
      // Audio unlock happens synchronously in this gesture handler (not
      // after the plug-in flight's timeout) to stay within the browser's
      // user-activation window for autoplay policies.
      unlock();

      window.setTimeout(
        () => {
          powerOnRef.current?.powerOn();
        },
        rect ? PLUG_IN_MS : 0
      );
    },
    [activating, reducedMotion, router, unlock]
  );

  useEffect(() => {
    if (phase !== "select" || reducedMotion || reverseBoot) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (activating !== null) return;
      if (event.key === "ArrowDown" || event.key === "s" || event.key === "S") {
        event.preventDefault();
        selectCartridge((selected + 1) % CARTRIDGES.length);
      } else if (
        event.key === "ArrowUp" ||
        event.key === "w" ||
        event.key === "W"
      ) {
        event.preventDefault();
        selectCartridge((selected - 1 + CARTRIDGES.length) % CARTRIDGES.length);
      } else if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        loadCartridge(selected);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase, reducedMotion, reverseBoot, selected, activating, loadCartridge, selectCartridge]);

  // The zoom-into-screen transition (from PowerOnScene) finishing is what
  // hands off to the boot logo sequence. Rather than an instant color cut,
  // this now plays the same CRT-style power-on flash used for the reverse
  // (ESC) power-off — a dot growing into a line, flashing bright, then
  // settling to the paper backdrop the logo sequence plays on — with the
  // logo itself held hidden until the flash finishes (see the shared
  // opacity toggle further down).
  const handlePowerOnComplete = useCallback(() => {
    setPhase((current) => {
      if (current !== "select") return current;
      setScreenOnFlashActive(true);
      if (bootFlickTimeoutRef.current !== null) {
        window.clearTimeout(bootFlickTimeoutRef.current);
      }
      bootFlickTimeoutRef.current = window.setTimeout(() => {
        setScreenOnFlashActive(false);
        setBootFlickLit(true);
      }, SCREEN_ON_FLASH_MS);
      return "booting";
    });
  }, []);

  useEffect(
    () => () => {
      if (bootFlickTimeoutRef.current !== null) {
        window.clearTimeout(bootFlickTimeoutRef.current);
      }
    },
    []
  );

  const handleLetterStart = useCallback(
    (index: number, total: number) => {
      playLetterTwinkle(index, total);
    },
    [playLetterTwinkle]
  );

  const handleSweepStart = useCallback(() => {
    playSparkle();
    setShowSubtitle(true);
  }, [playSparkle]);

  const handleSweepComplete = useCallback(() => {
    if (!cartridge) return;
    window.setTimeout(() => router.push(cartridge.href), POST_SWEEP_HOLD_MS);
  }, [cartridge, router]);

  // Sizing/positioning for the fanned row of cartridges shown at the top of
  // the picker below 550px. Below 350px they're a touch smaller, but both
  // tiers are sized much larger than the picker card itself so they read as
  // a real handful of cartridges rather than icons — tucked slightly beneath
  // the card's top edge, with a per-item tilt so they read as tossed
  // together rather than a uniform row.
  const mobileCartWidth = isTinyMobile ? 101 : 140;
  const mobileCartHeight = isTinyMobile ? 114 : 157;
  const mobileCartTop = isTinyMobile ? "-72px" : "-90px";
  const mobileCartSelectedY = isTinyMobile ? -2 : -12;
  const mobileCartRestY = isTinyMobile ? 6 : 8;
  const mobileCartOverlapPx = isTinyMobile ? -27 : -58;
  const MOBILE_CART_BASE_TILTS = [-8, 5, -4, 7, -6];

  const muteIcon = (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="3,9 8,9 13,4 13,20 8,15 3,15" fill="currentColor" stroke="none" />
      {muted ? (
        <path d="M16 9l6 6M22 9l-6 6" />
      ) : (
        <>
          <path d="M16.5 8a5 5 0 0 1 0 8" />
          <path d="M19.5 5a9 9 0 0 1 0 14" />
        </>
      )}
    </svg>
  );

  // Paper shows for the idle main menu, and again once the boot logo's
  // screen has "flicked on" (bootFlickLit) — except during the reverse
  // zoom-out, which stays on SCREEN_BG throughout so it lands seamlessly
  // on the console's own dark-green screen artwork.
  const showPaperScreen = reverseBoot ? false : phase === "select" || bootFlickLit;

  return (
    <Box
      position="fixed"
      inset={0}
      zIndex={9999}
      bg={showPaperScreen ? undefined : SCREEN_BG}
      sx={{
        cursor: PIXEL_CURSOR,
        ...(showPaperScreen ? PAPER_BG_SX : {}),
      }}
      // Both directions now play their own dedicated CRT-flash overlay
      // (screenOnFlashActive / screenOffFlashActive, rendered below) to
      // carry the actual color transition, so this background swap itself
      // stays an instant, un-transitioned cut in both cases — a lingering
      // CSS fade here would double up with the flash and read as mushy.
      // The one case that *does* still ease is the reverse (ESC) path's
      // final settle: once the zoom-out completes and `reverseBoot` flips
      // false, the idle "select" screen's paper tone eases in, since
      // there's no flash overlay covering that particular beat.
      transition={
        phase === "select" && !reverseBoot ? "background-color 0.4s ease" : "none"
      }
      display="flex"
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
      role="region"
      aria-label="Console home screen"
    >
      <CursorSparkles />

      {screenOffFlashActive && (
        <>
          {/* Classic CRT-style "power off": a bright instant flash, then the
              screen collapses vertically to a thin line, then pinches
              horizontally to a point and fades to black — before the
              console starts zooming back out (see the layout effect above).
              A plain <style> tag matches the pattern used by
              CursorSparkles.tsx for this kind of one-off keyframe. */}
          <style>{`
            @keyframes boot-screen-off-flash {
              0% { transform: scaleY(1) scaleX(1); background: #fdfaf2; opacity: 1; }
              22% { transform: scaleY(1) scaleX(1); background: #fdfaf2; opacity: 1; }
              55% { transform: scaleY(0.035) scaleX(1); background: #14110a; opacity: 1; }
              80% { transform: scaleY(0.035) scaleX(1); background: #000; opacity: 1; }
              100% { transform: scaleY(0.035) scaleX(0); background: #000; opacity: 0; }
            }
          `}</style>
          <Box
            aria-hidden="true"
            position="fixed"
            inset={0}
            zIndex={20}
            pointerEvents="none"
            transformOrigin="center"
            sx={{
              animation: `boot-screen-off-flash ${SCREEN_OFF_FLASH_MS}ms ease-in forwards`,
            }}
          />
        </>
      )}

      {screenOnFlashActive && (
        <>
          {/* The mirror of the power-off flash above: a black dot grows
              into a thin horizontal line, then flashes bright white, then
              settles to the paper backdrop the boot logo plays on — read as
              the screen switching back on, right as the zoom-in finishes
              (see handlePowerOnComplete). */}
          <style>{`
            @keyframes boot-screen-on-flash {
              0% { transform: scaleY(0.035) scaleX(0); background: #000; opacity: 1; }
              20% { transform: scaleY(0.035) scaleX(1); background: #000; opacity: 1; }
              45% { transform: scaleY(0.035) scaleX(1); background: #fdfaf2; opacity: 1; }
              72% { transform: scaleY(1) scaleX(1); background: #fdfaf2; opacity: 1; }
              100% { transform: scaleY(1) scaleX(1); background: #EEE6D3; opacity: 1; }
            }
          `}</style>
          <Box
            aria-hidden="true"
            position="fixed"
            inset={0}
            zIndex={20}
            pointerEvents="none"
            transformOrigin="center"
            sx={{
              animation: `boot-screen-on-flash ${SCREEN_ON_FLASH_MS}ms ease-out forwards`,
            }}
          />
        </>
      )}

      {/* Hides the console/logo scene entirely while either flash plays —
          otherwise the flash bar (shrinking down to a line on power-off, or
          growing out from one on power-on) would reveal the zoomed-in
          console or the boot logo peeking through above/below it,
          undermining the "screen switching on/off" read. It reappears the
          instant each flash finishes and the real zoom/logo transform
          takes over. */}
      <Box
        opacity={screenOffFlashActive || screenOnFlashActive ? 0 : 1}
        width="100%"
        height="100%"
        position="relative"
      >
        <AnimatePresence mode="wait">
        {phase === "select" ? (
          <Box
            key="select"
            as={motion.div}
            position="relative"
            width="100%"
            height="100%"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
          >
            {/*
              The console fills the whole screen as a background layer —
              rather than being boxed into a small side panel — so its idle
              tilt has room to move without clipping, and the "zoom into
              the screen" transition genuinely takes over the full
              viewport instead of just a small window.
            */}
            <Box
              position="absolute"
              inset={0}
              pointerEvents={activating !== null ? "none" : "auto"}
              style={{
                transform:
                  listLeftPx !== null
                    ? `translateX(calc(${activating !== null ? "-2%" : "-16%"} - ${
                        isCompactDesktop ? 120 : 0
                      }px))`
                    : isTinyMobile && activating === null
                      ? "scale(0.82) translateY(-20%)"
                      : isFullWidthMobile && activating === null
                        ? "translateY(-9%)"
                        : isMobileDrawer && activating === null
                          ? "translateX(-18%)"
                          : "none",
                transition: activating !== null ? "transform 580ms ease-in" : undefined,
              }}
            >
              <PowerOnScene
                ref={powerOnRef}
                onPowerOn={() => {}}
                onPowerOnComplete={handlePowerOnComplete}
                onPowerOffComplete={handlePowerOffComplete}
              />
            </Box>

            {/* The cartridge list floats on top of the console as a card,
                so it never has to compete with the shell for screen space.
                On desktop it's pinned a fixed 32px to the right of the
                console's rendered edge (via `listLeftPx`, computed above)
                so the pair reads as one tight, centered group regardless of
                viewport width. Below `md` it becomes a right-anchored
                drawer — fixed to the bottom-right corner, auto height, its
                right-side corners squared off so it reads as flush against
                the viewport edge, like a menu docked beside the console. */}
            <Box
              position="absolute"
              inset={0}
              display="flex"
              alignItems={["flex-end", "flex-end", "center"]}
              justifyContent={["center", "center", "flex-start"]}
              paddingX={[4, 6, 0]}
              paddingBottom={[6, 8, 0]}
              pointerEvents="none"
            >
              <Box
                position="relative"
                flex="0 0 auto"
                width={
                  isFullWidthMobile
                    ? "100%"
                    : isMobileDrawer
                      ? "clamp(200px, 56vw, 300px)"
                      : ["100%", "420px", "380px"]
                }
                maxWidth={isFullWidthMobile ? "100%" : "420px"}
                style={
                  isFullWidthMobile
                    ? {
                        position: "fixed",
                        left: 0,
                        right: 0,
                        bottom: 0,
                        top: "auto",
                      }
                    : isMobileDrawer
                      ? {
                          position: "fixed",
                          right: 0,
                          bottom: 0,
                          top: "auto",
                          left: "auto",
                        }
                      : listLeftPx !== null
                        ? {
                            position: "absolute",
                            left: listLeftPx,
                            top: isCompactDesktop ? "calc(50% + 60px)" : "50%",
                            transform: "translateY(-50%)",
                          }
                        : undefined
                }
                opacity={activating !== null || !cartridgeUiReady ? 0 : 1}
                transition="opacity 0.35s ease-out"
                pointerEvents={activating !== null || !cartridgeUiReady ? "none" : "auto"}
              >
                {/* The highlighted cartridge peeks out from behind/underneath
                    the picker card — tucking away and the next one untucking
                    as the selection changes (hover, focus, or arrow keys).
                    On wide desktop it peeks from the right edge, hinging at
                    its bottom-left corner (swings out and up). Below 1170px
                    there isn't room for that on the right, so it instead
                    peeks from the top-center of the card, hinging at its
                    bottom-center (swings down and out). Below 550px all the
                    cartridges are strewn out together in a row at the top of
                    the picker — the selected one peeks out bigger/higher,
                    the rest stay tucked in smaller/lower — so picking a new
                    one visibly peeks it out and tucks the others away before
                    the zoom-in kicks off. */}
                {isFullWidthMobile ? (
                  <Box
                    position="absolute"
                    left="50%"
                    top={mobileCartTop}
                    width="max-content"
                    display="flex"
                    alignItems="flex-end"
                    zIndex={0}
                    style={{ transform: "translateX(-50%)" }}
                  >
                    {CARTRIDGES.map((item, index) => {
                      const isSelected = index === selected;
                      const baseTilt = MOBILE_CART_BASE_TILTS[index % MOBILE_CART_BASE_TILTS.length];
                      return (
                        <Box
                          key={item.href}
                          as={motion.button}
                          type="button"
                          aria-label={`Preview ${item.label}`}
                          onClick={() => selectCartridge(index)}
                          zIndex={index}
                          flexShrink={0}
                          cursor="pointer"
                          style={{
                            marginLeft: index === 0 ? 0 : `${mobileCartOverlapPx}px`,
                            transformOrigin: "bottom center",
                            background: "none",
                            border: "none",
                            padding: 0,
                          }}
                          animate={{
                            y: isSelected ? mobileCartSelectedY : mobileCartRestY,
                            scale: isSelected ? 1.08 : 0.85,
                            rotate: isSelected ? baseTilt - 4 : baseTilt,
                            transition: { duration: 0.25, ease: "easeOut" },
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element -- small static SVG, no optimization needed */}
                          <img
                            ref={isSelected ? peekRef : undefined}
                            src={`/boot-intro/cartridges/${item.art}`}
                            alt=""
                            width={mobileCartWidth}
                            height={mobileCartHeight}
                            style={{
                              display: "block",
                              width: `${mobileCartWidth}px`,
                              height: `${mobileCartHeight}px`,
                              maxWidth: "none",
                              pointerEvents: "none",
                            }}
                          />
                        </Box>
                      );
                    })}
                  </Box>
                ) : (
                  <AnimatePresence initial={false}>
                    {isCompactDesktop || isMobileDrawer ? (
                      <Box
                        key={CARTRIDGES[selected].href}
                        as={motion.div}
                        position="absolute"
                        left="50%"
                        top="-136px"
                        zIndex={0}
                        pointerEvents="none"
                        style={{ x: "-50%", transformOrigin: "bottom center" }}
                        initial={{ y: -36, opacity: 0, rotate: -6 }}
                        animate={{
                          y: 0,
                          opacity: 1,
                          rotate: -4,
                          transition: { duration: 0.3, ease: "easeOut" },
                        }}
                        exit={{
                          y: -36,
                          opacity: 0,
                          rotate: -6,
                          transition: { duration: 0.22, ease: "easeIn" },
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element -- small static SVG, no optimization needed */}
                        <img
                          ref={peekRef}
                          src={`/boot-intro/cartridges/${CARTRIDGES[selected].art}`}
                          alt=""
                          width={168}
                          height={189}
                          style={{ display: "block" }}
                        />
                      </Box>
                    ) : (
                      <Box
                        key={CARTRIDGES[selected].href}
                        as={motion.div}
                        position="absolute"
                        right="-130px"
                        top="-24px"
                        zIndex={0}
                        pointerEvents="none"
                        style={{ transformOrigin: "bottom left" }}
                        initial={{ x: -36, y: 0, opacity: 0, rotate: 12 }}
                        animate={{
                          x: 0,
                          y: 0,
                          opacity: 1,
                          rotate: 6,
                          transition: { duration: 0.3, ease: "easeOut" },
                        }}
                        exit={{
                          x: -36,
                          y: 0,
                          opacity: 0,
                          rotate: 12,
                          transition: { duration: 0.22, ease: "easeIn" },
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element -- small static SVG, no optimization needed */}
                        <img
                          ref={peekRef}
                          src={`/boot-intro/cartridges/${CARTRIDGES[selected].art}`}
                          alt=""
                          width={168}
                          height={189}
                          style={{ display: "block" }}
                        />
                      </Box>
                    )}
                  </AnimatePresence>
                )}

                <Box
                  position="relative"
                  zIndex={1}
                  // Flat, chunky-bordered card — matches RetroCard, the
                  // container style every in-product list/post page uses —
                  // instead of the old blurred-glass treatment, so the
                  // picker reads as the same "container" the rest of the
                  // site uses rather than a one-off boot-screen widget.
                  bg="#F7F2E4"
                  border="2px solid rgba(75,90,46,0.25)"
                  borderRadius={
                    isFullWidthMobile ? "10px 10px 0 0" : isMobileDrawer ? "10px 0 0 10px" : "10px"
                  }
                  paddingX={[4, 5]}
                  paddingY={[4, 5]}
                  maxHeight={isMobileDrawer ? "82vh" : undefined}
                  overflowY={isMobileDrawer ? "auto" : undefined}
                  pointerEvents={activating !== null ? "none" : "auto"}
                >
                {isFullWidthMobile ? (
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                    <Text
                      className={pixelFont.className}
                      fontSize="10px"
                      letterSpacing="0.18em"
                      color="#4B5A2E"
                    >
                      INSERT CARTRIDGE
                    </Text>
                    <Box
                      as="button"
                      type="button"
                      onClick={toggleMute}
                      aria-pressed={muted}
                      aria-label={muted ? "Unmute sound effects" : "Mute sound effects"}
                      width="22px"
                      height="22px"
                      flexShrink={0}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      borderRadius="full"
                      border="1px solid rgba(75,90,46,0.3)"
                      bg="rgba(255,255,255,0.5)"
                      color="#4B5A2E"
                      cursor="pointer"
                      transition="background-color 0.15s ease"
                      sx={{
                        "&:hover": { bg: "rgba(255,255,255,0.85)" },
                        "&:focus-visible": {
                          outline: "2px solid #4B5A2E",
                          outlineOffset: "2px",
                        },
                      }}
                    >
                      {muteIcon}
                    </Box>
                  </Box>
                ) : (
                  <Text
                    className={pixelFont.className}
                    fontSize={["10px", "11px"]}
                    letterSpacing="0.18em"
                    color="#4B5A2E"
                    mb={3}
                  >
                    INSERT CARTRIDGE
                  </Text>
                )}
                <Box
                  as="ul"
                  listStyleType="none"
                  display={isFullWidthMobile && !isTinyMobile ? "grid" : "flex"}
                  gridTemplateColumns={isFullWidthMobile && !isTinyMobile ? "1fr 1fr" : undefined}
                  flexDirection={isFullWidthMobile && !isTinyMobile ? undefined : "column"}
                  gap={2}
                  role="listbox"
                  aria-label="Site sections"
                >
                  {CARTRIDGES.map((item, index) => {
                    const isSelected = index === selected;
                    return (
                      <Box as="li" key={item.href} listStyleType="none">
                        <Box
                          as={motion.button}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          onMouseEnter={() => selectCartridge(index)}
                          onFocus={() => selectCartridge(index)}
                          onClick={() => loadCartridge(index)}
                          width="100%"
                          display="flex"
                          alignItems="center"
                          gap={isFullWidthMobile ? 0 : 3}
                          paddingX={4}
                          paddingY={2.5}
                          borderRadius="10px"
                          border="2px solid"
                          borderColor={isSelected ? item.color : "rgba(75,90,46,0.25)"}
                          bg={isSelected ? `${item.color}22` : "rgba(255,255,255,0.35)"}
                          cursor="pointer"
                          textAlign="left"
                          animate={
                            !reducedMotion && !isFullWidthMobile && isSelected
                              ? {
                                  x: [0, 4, 0],
                                  transition: { duration: 0.5, repeat: Infinity },
                                }
                              : { x: 0 }
                          }
                          transition="border-color 0.15s ease, background-color 0.15s ease"
                          sx={{
                            "&:focus-visible": {
                              outline: `2px solid ${item.color}`,
                              outlineOffset: "2px",
                            },
                          }}
                        >
                          {!isFullWidthMobile && (
                            <Text
                              as="span"
                              className={pixelFont.className}
                              fontSize="11px"
                              color={isSelected ? item.color : "transparent"}
                              aria-hidden="true"
                            >
                              {"\u25B6"}
                            </Text>
                          )}
                          <Box>
                            <Text
                              className={pixelFont.className}
                              fontSize={["10px", "11px"]}
                              letterSpacing="0.06em"
                              color="#2A3318"
                            >
                              {item.label}
                            </Text>
                            {!isFullWidthMobile && (
                              <Text
                                className={proseFont.className}
                                fontSize="12px"
                                lineHeight="1.35"
                                color="#5C6B44"
                                mt={0.5}
                              >
                                {item.blurb}
                              </Text>
                            )}
                          </Box>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
                {!reducedMotion && !isFullWidthMobile && (
                  <Text
                    className={pixelFont.className}
                    fontSize="9px"
                    letterSpacing="0.08em"
                    color="#5C6B44"
                    mt={4}
                  >
                    ↑↓ SELECT · ENTER LOAD
                  </Text>
                )}

                {/* Tiny sound-effects toggle, tucked in the picker's corner
                    so it stays out of the way of the actual cartridge list.
                    Below 550px it moves inline with the title instead (see
                    above), since there's no spare corner in the full-width
                    layout. */}
                {!isFullWidthMobile && (
                  <Box
                    as="button"
                    type="button"
                    onClick={toggleMute}
                    aria-pressed={muted}
                    aria-label={muted ? "Unmute sound effects" : "Mute sound effects"}
                    position="absolute"
                    bottom="10px"
                    right="10px"
                    width="22px"
                    height="22px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="full"
                    border="1px solid rgba(75,90,46,0.3)"
                    bg="rgba(255,255,255,0.5)"
                    color="#4B5A2E"
                    cursor="pointer"
                    transition="background-color 0.15s ease"
                    sx={{
                      "&:hover": { bg: "rgba(255,255,255,0.85)" },
                      "&:focus-visible": {
                        outline: "2px solid #4B5A2E",
                        outlineOffset: "2px",
                      },
                    }}
                  >
                    {muteIcon}
                  </Box>
                )}
                </Box>
              </Box>

            </Box>

            {/* The "plug it into the console" flight — a clone of the
                peeking cartridge that detaches and flies from wherever it
                was peeking to the top of the console shell, shrinking as
                it "plugs in", right before the zoom-into-screen takes over. */}
            {activating !== null && flightStart && consoleAnchor && (
              <Box
                as={motion.img}
                src={`/boot-intro/cartridges/${CARTRIDGES[activating].art}`}
                alt=""
                style={{
                  position: "fixed",
                  left: flightStart.left,
                  top: flightStart.top,
                  width: flightStart.width,
                  height: flightStart.height,
                  zIndex: 20,
                  pointerEvents: "none",
                }}
                initial={{ x: 0, y: 0, scale: 1, rotate: 6, opacity: 1 }}
                animate={{
                  x:
                    consoleAnchor.x -
                    (flightStart.left + flightStart.width / 2),
                  y:
                    consoleAnchor.y -
                    (flightStart.top + flightStart.height / 2),
                  scale: 0.32,
                  rotate: 0,
                  opacity: [1, 1, 0],
                  transition: {
                    duration: PLUG_IN_MS / 1000,
                    ease: "easeIn",
                    opacity: { times: [0, 0.75, 1] },
                  },
                }}
              />
            )}
          </Box>
        ) : (
          <Box
            key="booting"
            as={motion.div}
            position="relative"
            width="100%"
            height="100%"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.2 } }}
          >
            {/* Held unmounted (not just hidden) until the power-on flash
                finishes — BootLogoCanvas drives its letter cascade off its
                own mount time, so mounting it early would let that timing
                run invisibly behind the flash and reveal a
                partway-finished cascade the instant it lifts. */}
            {!screenOnFlashActive && (
              <BootLogoCanvas
                label={NAME}
                staggerMs={STAGGER_MS}
                letterDurationMs={LETTER_DURATION_MS}
                sweepGapMs={SWEEP_GAP_MS}
                sweepDurationMs={SWEEP_DURATION_MS}
                onLetterStart={handleLetterStart}
                onSweepStart={handleSweepStart}
                onSweepComplete={handleSweepComplete}
              />
            )}
            {showSubtitle && (
              <Box
                as={motion.div}
                position="absolute"
                top="58%"
                left={0}
                right={0}
                textAlign="center"
                pointerEvents="none"
                initial="hidden"
                animate="visible"
                variants={roleContainerVariants}
              >
                <Text
                  className={pixelFont.className}
                  display="inline-block"
                  fontSize={["9px", "11px", "12px"]}
                  letterSpacing="0.2em"
                  color="rgba(51,44,28,0.72)"
                >
                  {roleChars.map((char, i) => (
                    <motion.span
                      key={i}
                      variants={roleCharVariants}
                      style={{ display: "inline-block" }}
                    >
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                  ))}
                </Text>
              </Box>
            )}

          </Box>
        )}
        </AnimatePresence>
      </Box>
    </Box>
  );
}
