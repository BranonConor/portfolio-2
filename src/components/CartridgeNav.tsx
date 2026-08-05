"use client";

import { useRef, useState } from "react";
import { Box } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { CARTRIDGES } from "@/lib/cartridges";
import { useBootChime } from "./boot-intro/useBootChime";
import { proseFont } from "./proseFont";

// The same fan of alternating tilts used for the mobile boot-intro
// cartridge row (BootIntro.tsx's MOBILE_CART_BASE_TILTS) — reusing it here
// keeps the "cartridges strewn across the top" motif consistent between
// the pre-boot picker and this in-page nav.
const BASE_TILTS = [-8, 5, -4, 7, -6];

// Same physical cartridge size as the original single "plugged in" art, so
// the row reads as the same object family, just repeated.
const CART_WIDTH = [48, 56, 64];
const CART_HEIGHT = [55, 64, 73];
// A slight overlap between neighbors rather than the dense stack the boot
// intro's mobile row uses — this is a spread-out nav strip, not a tucked
// deck of cards.
const OVERLAP_PX = ["-6px", "-7px", "-8px"];
// Rest state deliberately mirrors the original single-cartridge peek
// amount (~40% of the art visible above the card) so it reads as "tucked
// behind/plugged into" the page container, not floating on top of it.
const ROW_TOP = ["-22px", "-26px", "-30px"];
const HOVER_Y = -8;
const ACTIVE_Y = -14;

/**
 * All five section cartridges rendered together in a row tucked at the top
 * of every inside-the-console page — replaces the old single "plugged in"
 * cartridge with a persistent, in-product way to jump between sections
 * (Projects/Blog/Engagements/In the Wild/About) without detouring back
 * through the boot/cartridge-select screen. Doubles as the navigation the
 * removed Nav/MobileNav used to provide.
 *
 * Sits behind the page's card via a negative z-index (same painting-order
 * trick the original single cartridge used) so each one is mostly tucked
 * out of view — only the top sliver peeks out above the card, like a
 * cartridge plugged into a console. The active route's cartridge stands up
 * straighter and peeks a little higher; hovering (or focusing, for
 * keyboard users) any other cartridge raises it partway to preview the
 * affordance before committing to a click, playing the same synthesized
 * "move" blip as the boot intro's own cartridge picker.
 */
export function CartridgeNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { unlock, playMoveBlip } = useBootChime();
  const lastPlayedRef = useRef<number | null>(null);

  const playHoverBlip = (index: number) => {
    if (lastPlayedRef.current === index) return;
    lastPlayedRef.current = index;
    void unlock().then((running) => {
      if (running) void playMoveBlip();
    });
  };

  return (
    <Box
      as="nav"
      aria-label="Site sections"
      position="absolute"
      top={ROW_TOP}
      left={["6px", "14px", "18px"]}
      display="flex"
      alignItems="flex-end"
      zIndex={-1}
    >
      {CARTRIDGES.map((item, index) => {
        const isActive =
          item.href === pathname || pathname.startsWith(item.href);
        const isHovered = hoveredIndex === index;
        const baseTilt = BASE_TILTS[index % BASE_TILTS.length];
        const y = isActive ? ACTIVE_Y : isHovered ? HOVER_Y : 0;

        return (
          <Box
            key={item.href}
            as={motion.button}
            type="button"
            onClick={() => router.push(item.href)}
            onMouseEnter={() => {
              setHoveredIndex(index);
              playHoverBlip(index);
            }}
            onMouseLeave={() => {
              setHoveredIndex(null);
              lastPlayedRef.current = null;
            }}
            onFocus={() => {
              setHoveredIndex(index);
              playHoverBlip(index);
            }}
            onBlur={() => {
              setHoveredIndex(null);
              lastPlayedRef.current = null;
            }}
            aria-label={`Go to ${item.label}`}
            aria-current={isActive ? "page" : undefined}
            zIndex={isActive ? CARTRIDGES.length + 1 : index}
            flexShrink={0}
            marginLeft={index === 0 ? 0 : OVERLAP_PX}
            border="none"
            bg="transparent"
            p={0}
            style={{ transformOrigin: "bottom center" }}
            animate={{
              y,
              scale: isActive ? 1.06 : isHovered ? 1.03 : 1,
              rotate: isActive ? baseTilt / 3 : baseTilt,
              transition: { duration: 0.2, ease: "easeOut" },
            }}
            _focusVisible={{
              outline: "2px solid",
              outlineColor: item.color,
              outlineOffset: "2px",
              borderRadius: "4px",
            }}
          >
            <Box
              as="img"
              src={`/boot-intro/cartridges/${item.art}`}
              alt=""
              display="block"
              width={CART_WIDTH.map((v) => `${v}px`)}
              height={CART_HEIGHT.map((v) => `${v}px`)}
              maxWidth="none"
              filter={
                isActive
                  ? "drop-shadow(0 6px 10px rgba(0,0,0,0.4))"
                  : "drop-shadow(0 3px 5px rgba(0,0,0,0.3))"
              }
            />
          </Box>
        );
      })}

      {/* Which cartridge is which color isn't obvious at a glance, so
          hovering/focusing one reveals its name here — a colored dot
          (matching that section's accent) plus its label, snug to the
          right of the whole row. Desktop-only: there's no hover state on
          touch, and screen space is tighter on mobile anyway. */}
      <Box
        as="span"
        alignSelf="flex-start"
        display={["none", "none", "flex"]}
        alignItems="center"
        gap={2}
        ml={3}
        mt="2px"
        pointerEvents="none"
        opacity={hoveredIndex !== null ? 1 : 0}
        transform={hoveredIndex !== null ? "translateX(0)" : "translateX(-4px)"}
        transition="opacity 0.15s ease, transform 0.15s ease"
        className={proseFont.className}
        fontSize="12px"
        color="brand.text"
        whiteSpace="nowrap"
        aria-hidden="true"
      >
        <Box
          as="span"
          width="10px"
          height="10px"
          borderRadius="full"
          bg={hoveredIndex !== null ? CARTRIDGES[hoveredIndex].color : "transparent"}
          flexShrink={0}
        />
        {hoveredIndex !== null ? CARTRIDGES[hoveredIndex].label : ""}
      </Box>
    </Box>
  );
}
