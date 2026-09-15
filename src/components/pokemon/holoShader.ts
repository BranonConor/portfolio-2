/**
 * Procedural cosmo-holo overlay. The shader never samples the card image,
 * avoiding cross-origin texture restrictions and keeping the artwork semantic.
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
  uniform vec2 uMouse;
  uniform float uIntensity;
  uniform float uMotion;
  uniform float uAspect;
  uniform float uSeed;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32 + uSeed * 17.0);
    return fract(p.x * p.y);
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

  vec3 spectrum(float phase) {
    return 0.56 + 0.44 * cos(
      6.2831853 * (phase + vec3(0.0, 0.34, 0.67))
    );
  }

  float starField(vec2 uv, float scale, float threshold, float seed) {
    vec2 gridUv = uv * vec2(scale * uAspect, scale);
    vec2 cell = floor(gridUv);
    vec2 local = fract(gridUv) - 0.5;
    float value = hash(cell + seed);
    vec2 offset = vec2(
      hash(cell + seed + 8.3),
      hash(cell + seed + 19.7)
    ) - 0.5;
    vec2 delta = local - offset * 0.7;

    float radius = mix(0.032, 0.085, hash(cell + seed + 2.1));
    float core = 1.0 - smoothstep(0.0, radius, length(delta));
    return core * smoothstep(threshold, 1.0, value);
  }

  float sparkleField(vec2 uv, float scale, float seed) {
    vec2 gridUv = uv * vec2(scale * uAspect, scale);
    vec2 cell = floor(gridUv);
    vec2 local = fract(gridUv) - 0.5;
    float value = hash(cell + seed);
    vec2 offset = vec2(
      hash(cell + seed + 4.6),
      hash(cell + seed + 11.2)
    ) - 0.5;
    vec2 delta = local - offset * 0.58;

    float core = 1.0 - smoothstep(0.015, 0.07, length(delta));
    float rays = exp(-abs(delta.x) * 75.0) * exp(-abs(delta.y) * 7.0)
               + exp(-abs(delta.y) * 75.0) * exp(-abs(delta.x) * 7.0);
    return (core + rays * 0.52) * smoothstep(0.91, 1.0, value);
  }

  float galaxyBlooms(vec2 uv) {
    vec2 p = uv - 0.5;
    p.x *= uAspect;
    vec2 drift = uMouse * vec2(0.075 * uAspect, -0.06);
    vec2 seedOffset = vec2(
      hash(vec2(uSeed * 31.0, 4.2)) - 0.5,
      hash(vec2(8.7, uSeed * 43.0)) - 0.5
    ) * 0.1;

    vec2 bloomA = p - vec2(-0.27 * uAspect, 0.13) + drift * 0.45 + seedOffset;
    vec2 bloomB = p - vec2(0.22 * uAspect, -0.18) - drift * 0.7 - seedOffset;
    vec2 bloomC = p - vec2(0.08 * uAspect, 0.27) + drift * 0.25 + seedOffset.yx;

    float a = exp(-dot(bloomA, bloomA) * 12.0);
    float b = exp(-dot(bloomB, bloomB) * 18.0);
    float c = exp(-dot(bloomC, bloomC) * 25.0);
    return a * 0.7 + b * 0.55 + c * 0.35;
  }

  void main() {
    vec2 pointer = uMouse * 0.5;
    float time = uTime * uMotion;

    float sweep = dot(vUv - 0.5, normalize(vec2(0.72, 1.0)));
    float phase = sweep * 0.82
                + pointer.x * 0.28
                - pointer.y * 0.18
                + time * 0.025
                + noise(vUv * 3.2 + pointer * 0.35) * 0.08;
    vec3 prism = spectrum(phase);

    float broadFoil = 0.5 + 0.5 * sin(
      sweep * 13.0 + pointer.x * 4.0 - pointer.y * 2.5 + time * 0.18
    );
    broadFoil = smoothstep(0.15, 0.95, broadFoil) * 0.16 + 0.045;

    vec2 highlightPosition = vec2(0.5) + pointer * vec2(0.32, -0.25);
    vec2 highlightDelta = vUv - highlightPosition;
    highlightDelta.x *= uAspect;
    float highlight = exp(-dot(highlightDelta, highlightDelta) * 5.2);

    float stars = starField(vUv + vec2(time * 0.003, 0.0), 8.0, 0.77, 3.7);
    stars += starField(vUv - vec2(0.0, time * 0.002), 14.0, 0.86, 13.4) * 0.8;
    float sparkles = sparkleField(vUv, 6.0, 29.1);
    float blooms = galaxyBlooms(vUv);

    float grain = noise(vUv * 145.0 + vec2(time * 0.65, -time * 0.41));
    grain = (grain - 0.5) * 0.035;

    vec3 foilColor = prism * broadFoil;
    foilColor += prism * highlight * 0.18;
    foilColor += mix(vec3(0.35, 0.58, 1.0), vec3(1.0, 0.38, 0.75), prism.r)
               * blooms * 0.12;
    foilColor += vec3(0.88, 0.94, 1.0) * stars * 1.3;
    foilColor += vec3(1.0, 0.96, 0.82) * sparkles * 1.55;
    foilColor += prism * grain;

    float alpha = broadFoil * 0.72
                + highlight * 0.1
                + blooms * 0.12
                + stars * 0.72
                + sparkles * 0.9;
    alpha = clamp(alpha * uIntensity, 0.0, 0.7);

    gl_FragColor = vec4(foilColor, alpha);
  }
`;
