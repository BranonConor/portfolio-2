"use client";

import { useEffect, useRef } from "react";
import { Box } from "@chakra-ui/react";

export const PaintReveal = () => {
  const imgRef = useRef<HTMLImageElement>(null);
  const brushRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let ticking = false;

    const getMaxScroll = () =>
      document.documentElement.scrollHeight - window.innerHeight;

    let maxScroll = getMaxScroll();

    const update = () => {
      const raw =
        maxScroll > 0
          ? Math.max(0, Math.min(1, window.scrollY / maxScroll))
          : 0;

      // Clamp elastic overscroll at edges
      const progress = raw > 0.997 ? 1 : raw < 0.003 ? 0 : raw;

      if (imgRef.current) {
        imgRef.current.style.clipPath = `inset(0 0 ${(1 - progress) * 100}% 0)`;
      }

      if (brushRef.current) {
        brushRef.current.style.top = `${progress * 100}%`;
        brushRef.current.style.opacity = progress > 0.005 ? "1" : "0";
      }

      if (pctRef.current) {
        pctRef.current.textContent = `${Math.round(progress * 100)}%`;
        pctRef.current.style.top = `${progress * 100}%`;
        pctRef.current.style.opacity = progress > 0.005 ? "1" : "0";
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    const onResize = () => {
      maxScroll = getMaxScroll();
    };

    // Watch for content height changes (MDX loads, images, etc.)
    const observer = new ResizeObserver(() => {
      maxScroll = getMaxScroll();
    });
    observer.observe(document.body);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      observer.disconnect();
    };
  }, []);

  return (
    <Box
      position="absolute"
      left={0}
      top={0}
      bottom={0}
      width="28px"
      display={["none", "none", "block"]}
      pointerEvents="none"
      zIndex={2}
    >
      {/* Paint stroke image — revealed progressively */}
      <img
        ref={imgRef}
        src="/s10.png"
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "fill",
          opacity: 0.75,
          mixBlendMode: "lighten",
          pointerEvents: "none",
          willChange: "clip-path",
          clipPath: "inset(0 0 100% 0)",
        }}
      />

      {/* Paintbrush emoji at the leading edge */}
      <div
        ref={brushRef}
        style={{
          position: "absolute",
          transform:
            "translate(calc(-30% + 17px), calc(-80% + 7px)) rotate(20deg)",
          fontSize: "24px",
          opacity: 0,
          pointerEvents: "none",
          transition: "opacity 0.3s ease",
          willChange: "top, left, opacity",
          filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.4))",
        }}
      >
        🖌️
      </div>

      {/* Scroll percentage label */}
      <span
        ref={pctRef}
        style={{
          position: "absolute",
          left: "50%",
          transform: "translate(-50%, 4px)",
          fontSize: "10px",
          fontWeight: 600,
          letterSpacing: "0.02em",
          color: "rgba(255,255,255,0.45)",
          pointerEvents: "none",
          opacity: 0,
          willChange: "top, opacity",
          whiteSpace: "nowrap",
        }}
      />
    </Box>
  );
};
