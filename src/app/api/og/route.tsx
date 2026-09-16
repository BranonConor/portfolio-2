import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";
import { CARTRIDGES } from "@/lib/cartridges";

// Single dynamic OG/Twitter preview image generator shared by every route.
// Rather than hand-authoring a static `opengraph-image.tsx` per page (or per
// blog/project post), pages point their `openGraph.images`/`twitter.images`
// metadata at this route with title, subtitle, and path query params. The
// path selects the matching cartridge artwork and color while this route
// keeps the composition and typography consistent across the site.
export const runtime = "nodejs";

const WIDTH = 1200;
const HEIGHT = 630;
const INK = "#332C1C";
const MUTED_INK = "#655C42";
const PAPER = "#EEE6D3";
const SCREEN = "#1D2A0C";
const DEFAULT_SECTION = {
  label: "PORTFOLIO",
  href: "/",
  color: "#a78bfa",
  art: null,
};
const HOME_CARTRIDGE_TILTS = [-10, -5, 0, 5, 10];
const HOME_CARTRIDGE_TOPS = [122, 72, 36, 72, 122];
const HOME_CARTRIDGE_Z_INDEXES = [1, 2, 5, 4, 3];

const logoSvg = fs.readFileSync(
  path.join(process.cwd(), "public", "logo-mark-color.svg"),
  "utf-8"
);
const logoDataUrl = `data:image/svg+xml;base64,${Buffer.from(logoSvg).toString("base64")}`;
const pixelFont = fs.readFileSync(
  path.join(process.cwd(), "public", "fonts", "press-start-2p.ttf")
);
const proseFontRegular = fs.readFileSync(
  path.join(process.cwd(), "public", "fonts", "ibm-plex-mono-400.ttf")
);
const proseFontMedium = fs.readFileSync(
  path.join(process.cwd(), "public", "fonts", "ibm-plex-mono-500.ttf")
);
const cartridgeDataUrls = Object.fromEntries(
  CARTRIDGES.map((cartridge) => {
    const cartridgeSvg = fs.readFileSync(
      path.join(
        process.cwd(),
        "public",
        "boot-intro",
        "cartridges",
        cartridge.art
      ),
      "utf-8"
    );

    return [
      cartridge.art,
      `data:image/svg+xml;base64,${Buffer.from(cartridgeSvg).toString("base64")}`,
    ];
  })
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title") ?? "Branon Eusebio").slice(0, 120);
  const subtitle =
    (searchParams.get("subtitle") ?? "Design Engineer building @ GitHub").slice(
      0,
      240
    );
  const routePath = searchParams.get("path") ?? "/";
  const section =
    CARTRIDGES.find(
      (cartridge) =>
        routePath === cartridge.href ||
        routePath.startsWith(`${cartridge.href}/`)
    ) ?? DEFAULT_SECTION;
  const titleFontSize =
    title.length > 58 ? 29 : title.length > 42 ? 33 : title.length > 28 ? 38 : 44;
  const subtitleFontSize =
    subtitle.length > 155 ? 19 : subtitle.length > 105 ? 21 : 23;
  const sectionPath =
    section.href === "/" ? "branon.dev" : `branon.dev${section.href}`;
  const cartridgeDataUrl = section.art
    ? cartridgeDataUrls[section.art]
    : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "stretch",
          backgroundColor: SCREEN,
          position: "relative",
          padding: 18,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
            overflow: "hidden",
            backgroundColor: PAPER,
            border: `4px solid ${INK}`,
            padding: "44px 46px 42px 50px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              display: "flex",
              position: "absolute",
              top: 24,
              left: 28,
              width: 230,
              height: 8,
              backgroundColor: section.color,
              boxShadow: `246px 0 0 ${section.color}66, 492px 0 0 ${section.color}33`,
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: 745,
              height: "100%",
              paddingTop: 12,
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 26,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: `${section.color}24`,
                    border: `3px solid ${section.color}`,
                    borderRadius: 8,
                    color: INK,
                    fontFamily: "Press Start 2P",
                    fontSize: 14,
                    lineHeight: 1,
                    padding: "11px 13px 9px",
                    marginRight: 16,
                  }}
                >
                  {section.label}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  color: INK,
                  fontFamily: "Press Start 2P",
                  fontSize: titleFontSize,
                  fontWeight: 400,
                  letterSpacing: -0.5,
                  lineHeight: 1.35,
                  marginBottom: 22,
                  maxWidth: 735,
                }}
              >
                {title}
              </div>
              <div
                style={{
                  display: "flex",
                  color: MUTED_INK,
                  fontFamily: "IBM Plex Mono",
                  fontSize: subtitleFontSize,
                  fontWeight: 400,
                  lineHeight: 1.45,
                  maxWidth: 710,
                }}
              >
                {subtitle}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderTop: `3px solid ${INK}22`,
                paddingTop: 18,
              }}
            >
              <img src={logoDataUrl} width={255} height={31} alt="" />
              <div
                style={{
                  display: "flex",
                  color: INK,
                  fontFamily: "IBM Plex Mono",
                  fontSize: 17,
                  fontWeight: 500,
                }}
              >
                {sectionPath}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 330,
              height: 430,
              flexShrink: 0,
              position: "relative",
            }}
          >
            {cartridgeDataUrl ? (
              <img
                src={cartridgeDataUrl}
                width={320}
                height={360}
                alt=""
                style={{
                  transform: "rotate(3deg)",
                }}
              />
            ) : (
              CARTRIDGES.map((cartridge, index) => (
                <img
                  key={cartridge.href}
                  src={cartridgeDataUrls[cartridge.art]}
                  width={164}
                  height={184}
                  alt=""
                  style={{
                    position: "absolute",
                    left: index * 39,
                    top: HOME_CARTRIDGE_TOPS[index],
                    zIndex: HOME_CARTRIDGE_Z_INDEXES[index],
                    transform: `rotate(${HOME_CARTRIDGE_TILTS[index]}deg)`,
                  }}
                />
              ))
            )}
          </div>
        </div>
      </div>
    ),
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        {
          name: "Press Start 2P",
          data: pixelFont,
          weight: 400,
          style: "normal",
        },
        {
          name: "IBM Plex Mono",
          data: proseFontRegular,
          weight: 400,
          style: "normal",
        },
        {
          name: "IBM Plex Mono",
          data: proseFontMedium,
          weight: 500,
          style: "normal",
        },
      ],
    }
  );
}
