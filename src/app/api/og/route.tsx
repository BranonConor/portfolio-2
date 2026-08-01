import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";

// Single dynamic OG/Twitter preview image generator shared by every route.
// Rather than hand-authoring a static `opengraph-image.tsx` per page (or per
// blog/project post), pages point their `openGraph.images`/`twitter.images`
// metadata at this route with `?title=`/`?subtitle=` query params, so every
// link preview renders the wordmark logo plus that page's own title and
// "Branon Eusebio" byline, without duplicating the image-generation code.
export const runtime = "nodejs";

const WIDTH = 1200;
const HEIGHT = 630;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? "Branon Eusebio";
  const subtitle =
    searchParams.get("subtitle") ?? "Design Engineer building @ GitHub";

  const logoSvg = fs.readFileSync(
    path.join(process.cwd(), "public", "logo-mark-color.svg"),
    "utf-8"
  );
  const logoDataUrl = `data:image/svg+xml;base64,${Buffer.from(logoSvg).toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#EEE6D3",
          position: "relative",
          padding: "0 90px",
        }}
      >
        {/* Faint console-green frame edge, echoing the boot intro's screen */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            border: "18px solid #1D2A0C",
            opacity: 0.9,
          }}
        />
        <img
          src={logoDataUrl}
          width={460}
          height={55}
          alt=""
          style={{ marginBottom: 40 }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 46,
            fontWeight: 600,
            color: "#332C1C",
            textAlign: "center",
            lineHeight: 1.25,
            marginBottom: 18,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 1,
            color: "#655C42",
            textAlign: "center",
          }}
        >
          {subtitle}
        </div>
      </div>
    ),
    { width: WIDTH, height: HEIGHT }
  );
}
