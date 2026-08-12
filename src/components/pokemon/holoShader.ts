/**
 * Balatro-style holographic overlay shaders for OGL.
 *
 * This shader renders a *transparent* holographic overlay that sits on
 * top of a regular <img> element. It doesn't sample the card texture at
 * all — that avoids CORS issues with cross-origin card images and lets
 * the browser handle image loading/scaling natively.
 *
 * The overlay layers:
 * 1. A prismatic rainbow foil that shifts with mouse/tilt
 * 2. A specular highlight that follows the cursor
 * 3. Balatro-style pixelated scanlines + CRT pixel grid
 * 4. A noise/grain texture for authentic foil feel
 * 5. Subtle edge glow
 */

export const HOLO_VERTEX = /* glsl */ `
  attribute vec2 position;
  attribute vec2 uv;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

export const HOLO_FRAGMENT = /* glsl */ `
  precision highp float;

  varying vec2 vUv;

  uniform float uTime;
  uniform vec2 uMouse;       // normalized mouse position (-1 to 1)
  uniform float uHover;      // 0 = idle, 1 = hovering

  // --- Noise helpers ---
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  void main() {
    // --- Holographic rainbow foil ---
    vec2 mouseOffset = uMouse * 0.3;
    float foilAngle = (vUv.x + vUv.y) * 3.0
                    + mouseOffset.x * 2.5
                    + mouseOffset.y * 1.5
                    + uTime * 0.15;

    // Multi-frequency rainbow for richer foil
    vec3 rainbow1 = 0.5 + 0.5 * cos(6.28318 * (foilAngle * 0.8) + vec3(0.0, 2.094, 4.188));
    vec3 rainbow2 = 0.5 + 0.5 * cos(6.28318 * (foilAngle * 1.3 + 0.5) + vec3(1.0, 3.0, 5.0));
    vec3 rainbow = mix(rainbow1, rainbow2, 0.3);

    // Diagonal foil bands — the signature streaks
    float band1 = sin((vUv.x - vUv.y) * 18.0 + mouseOffset.x * 8.0 + uTime * 0.3);
    float band2 = sin((vUv.x + vUv.y * 0.7) * 12.0 - mouseOffset.y * 6.0 + uTime * 0.2);
    float bands = (band1 * 0.5 + 0.5) * (band2 * 0.3 + 0.7);

    // --- Specular highlight ---
    vec2 specPos = (vUv - 0.5) - mouseOffset * 0.6;
    float specular = exp(-dot(specPos, specPos) * 6.0);
    specular = pow(specular, 1.5) * 0.7;

    // --- Balatro-style pixel grid / CRT effect ---
    // Creates the distinctive "pixel card" look with visible sub-pixels
    float pixelScale = 120.0; // density of the pixel grid
    vec2 pixelUv = vUv * pixelScale;
    vec2 pixelCell = fract(pixelUv);

    // Sub-pixel RGB columns (like a CRT phosphor mask)
    float subPixelCol = fract(pixelUv.x * 3.0);
    vec3 subPixelMask = vec3(
      smoothstep(0.0, 0.33, subPixelCol) - smoothstep(0.33, 0.66, subPixelCol),
      smoothstep(0.33, 0.66, subPixelCol) - smoothstep(0.66, 1.0, subPixelCol),
      smoothstep(0.66, 1.0, subPixelCol)
    );
    // Soften the mask so it's not too harsh
    subPixelMask = mix(vec3(1.0), subPixelMask * 1.5 + 0.4, 0.35 * uHover);

    // Scanline darkening (horizontal lines between pixel rows)
    float scanline = smoothstep(0.4, 0.5, abs(pixelCell.y - 0.5));
    scanline = mix(1.0, 0.82, scanline * 0.5 * uHover);

    // Pixel cell border (subtle grid between pixels)
    float cellBorder = smoothstep(0.05, 0.1, pixelCell.x)
                     * smoothstep(0.05, 0.1, pixelCell.y)
                     * smoothstep(0.05, 0.1, 1.0 - pixelCell.x)
                     * smoothstep(0.05, 0.1, 1.0 - pixelCell.y);
    cellBorder = mix(0.88, 1.0, cellBorder);

    // --- Grain / noise ---
    float grain = noise(vUv * 200.0 + uTime * 2.0) * 0.06;

    // --- Edge glow ---
    vec2 edgeDist = min(vUv, 1.0 - vUv);
    float edgeFactor = smoothstep(0.0, 0.08, min(edgeDist.x, edgeDist.y));
    float edgeGlow = (1.0 - edgeFactor) * 0.12;

    // --- Compose transparent overlay ---
    float foilStrength = bands * 0.4;
    vec3 holoColor = rainbow * foilStrength
                   + specular * vec3(1.0, 0.97, 0.9)
                   + grain * rainbow * 0.5
                   + edgeGlow * rainbow;

    // Apply the Balatro pixel treatment to the holo
    holoColor *= subPixelMask * scanline * cellBorder;

    // Alpha fades in with hover — fully transparent when not hovering
    float alpha = uHover * (foilStrength * 0.55 + specular * 0.6 + edgeGlow * 0.4 + 0.06);

    // The pixel grid also contributes a subtle darkening overlay
    // even in non-rainbow areas for that overall pixelated card feel
    float gridDarken = (1.0 - cellBorder) * 0.12 + (1.0 - scanline) * 0.08;
    alpha = clamp(alpha + gridDarken * uHover, 0.0, 0.7);

    gl_FragColor = vec4(holoColor, alpha);
  }
`;
