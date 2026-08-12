/**
 * Balatro-style holographic card shaders for OGL.
 *
 * The fragment shader layers:
 * 1. The card texture (the Pokémon card art)
 * 2. A prismatic rainbow foil that shifts with mouse/tilt
 * 3. A specular highlight that follows the cursor
 * 4. A noise/grain overlay for authentic foil texture
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

  uniform sampler2D tCard;
  uniform float uTime;
  uniform vec2 uMouse;       // normalized mouse position (-1 to 1)
  uniform float uHover;      // 0 = idle, 1 = hovering
  uniform float uActive;     // 0 = normal, 1 = clicked/inspecting

  // --- Noise helpers ---
  // Simple hash for grain
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  // Smooth noise
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
    vec4 card = texture2D(tCard, vUv);

    // Skip transparent areas
    if (card.a < 0.01) {
      gl_FragColor = card;
      return;
    }

    // --- Holographic rainbow foil ---
    // The foil pattern shifts based on mouse position and UV, creating
    // that prismatic "oil slick" look that moves as you tilt the card
    vec2 mouseOffset = uMouse * 0.3;
    float foilAngle = (vUv.x + vUv.y) * 3.0
                    + mouseOffset.x * 2.5
                    + mouseOffset.y * 1.5
                    + uTime * 0.15;

    // Multi-frequency rainbow for richer foil look
    vec3 rainbow1 = 0.5 + 0.5 * cos(6.28318 * (foilAngle * 0.8) + vec3(0.0, 2.094, 4.188));
    vec3 rainbow2 = 0.5 + 0.5 * cos(6.28318 * (foilAngle * 1.3 + 0.5) + vec3(1.0, 3.0, 5.0));
    vec3 rainbow = mix(rainbow1, rainbow2, 0.3);

    // Directional foil bands — creates those signature diagonal streaks
    float band1 = sin((vUv.x - vUv.y) * 18.0 + mouseOffset.x * 8.0 + uTime * 0.3);
    float band2 = sin((vUv.x + vUv.y * 0.7) * 12.0 - mouseOffset.y * 6.0 + uTime * 0.2);
    float bands = (band1 * 0.5 + 0.5) * (band2 * 0.3 + 0.7);

    // --- Specular highlight ---
    // A bright glare spot that follows the mouse like light reflecting off foil
    vec2 specPos = (vUv - 0.5) - mouseOffset * 0.6;
    float specular = exp(-dot(specPos, specPos) * 6.0);
    specular = pow(specular, 1.5) * 0.7;

    // --- Grain / noise texture ---
    // Subtle noise that makes the foil feel physical
    float grain = noise(vUv * 200.0 + uTime * 2.0) * 0.08;

    // --- Edge glow ---
    // Subtle luminance boost near the card edges
    vec2 edgeDist = min(vUv, 1.0 - vUv);
    float edgeFactor = smoothstep(0.0, 0.08, min(edgeDist.x, edgeDist.y));
    float edgeGlow = (1.0 - edgeFactor) * 0.15;

    // --- Compose the holographic overlay ---
    float foilStrength = bands * 0.35 * uHover;
    vec3 holoOverlay = rainbow * foilStrength + specular * vec3(1.0, 0.97, 0.9) * uHover;

    // Blend: additive holographic over the card art
    vec3 result = card.rgb + holoOverlay + grain * uHover + edgeGlow * rainbow * uHover;

    // Slight brightness boost on hover
    result = mix(card.rgb, result, uHover * 0.85 + 0.15);

    gl_FragColor = vec4(result, card.a);
  }
`;
