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
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  vec2 hash2(vec2 p) {
    return vec2(
      hash(p + vec2(17.17, 41.73)),
      hash(p + vec2(63.91, 12.53))
    );
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
    return 0.58 + 0.42 * cos(
      6.2831853 * (phase + vec3(0.0, 0.34, 0.67))
    );
  }

  mat2 rotate2d(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c);
  }

  float angleFlash(float phase, float angle, float sharpness) {
    float wave = 0.5 + 0.5 * cos(phase * 6.2831853 + angle);
    return pow(wave, sharpness);
  }

  vec2 seededPosition(float salt) {
    return vec2(
      mix(-0.06, 1.06, hash(vec2(uSeed * 83.0 + salt, salt * 2.7))),
      mix(-0.06, 1.06, hash(vec2(salt * 4.1, uSeed * 97.0 + salt)))
    );
  }

  float heroOrb(vec2 uv, vec2 position, float radius, float phase, float angle) {
    vec2 delta = uv - position;
    delta.x *= uAspect;
    float distanceToCenter = length(delta);
    float flash = 0.34 + angleFlash(phase, angle, 5.0) * 0.66;
    float outerRing = 1.0 - smoothstep(
      0.018,
      0.05,
      abs(distanceToCenter - radius)
    );
    float innerRing = 1.0 - smoothstep(
      0.012,
      0.04,
      abs(distanceToCenter - radius * 0.58)
    );
    float glow = exp(-distanceToCenter * distanceToCenter * 32.0);
    float arc = 0.5 + 0.5 * cos(
      atan(delta.y, delta.x) * 2.0
      + distanceToCenter * 28.0
      + phase * 6.2831853
    );
    arc = pow(arc, 10.0)
        * (1.0 - smoothstep(
          radius * 0.35,
          radius * 1.15,
          distanceToCenter
        ));
    return flash * (outerRing + innerRing * 0.38 + glow * 0.22 + arc * 0.5);
  }

  float heroSparkle(
    vec2 uv,
    vec2 position,
    float size,
    float phase,
    float angle
  ) {
    vec2 delta = uv - position;
    delta.x *= uAspect;
    vec2 starUv = rotate2d(phase * 3.1415926) * delta;
    float flash = 0.28 + angleFlash(phase, angle, 8.0) * 0.72;
    float core = exp(-length(delta) * 95.0 / size);
    float cross = exp(-abs(starUv.x) * 82.0 / size)
                * exp(-abs(starUv.y) * 12.0 / size)
                + exp(-abs(starUv.y) * 82.0 / size)
                * exp(-abs(starUv.x) * 12.0 / size);
    vec2 diagonalUv = rotate2d(0.7853982) * starUv;
    float diagonal = exp(-abs(diagonalUv.x) * 105.0 / size)
                   * exp(-abs(diagonalUv.y) * 18.0 / size);
    return flash * (core + cross * 0.9 + diagonal * 0.42);
  }

  vec3 cosmoMotifs(vec2 uv, float scale, float seed, float angle) {
    vec2 gridUv = uv * vec2(scale * uAspect, scale);
    vec2 baseCell = floor(gridUv);
    vec2 local = fract(gridUv);
    vec3 motifs = vec3(0.0);

    for (int y = -1; y <= 1; y++) {
      for (int x = -1; x <= 1; x++) {
        vec2 cellOffset = vec2(float(x), float(y));
        vec2 cell = baseCell + cellOffset;
        vec2 random = hash2(cell + seed + uSeed * 37.0);
        vec2 delta = cellOffset + random - local;
        float distanceToCenter = length(delta);
        float kind = hash(cell + seed + 19.4 + uSeed * 13.0);
        float phase = hash(cell + seed + 47.7 + uSeed * 29.0);
        float presence = smoothstep(0.32, 0.58, phase);
        float flash = 0.18 + angleFlash(phase, angle, 7.0) * 0.82;

        if (kind < 0.43) {
          float radius = mix(0.16, 0.34, hash(cell + seed + 2.8));
          float ring = 1.0 - smoothstep(
            0.025,
            0.075,
            abs(distanceToCenter - radius)
          );
          float innerRing = 1.0 - smoothstep(
            0.015,
            0.055,
            abs(distanceToCenter - radius * 0.58)
          );
          float bloom = exp(-distanceToCenter * distanceToCenter * 8.0);
          float spiral = 0.5 + 0.5 * cos(
            atan(delta.y, delta.x) * 2.0
            + distanceToCenter * 18.0
            + phase * 6.2831853
          );
          spiral = pow(spiral, 8.0)
                 * (1.0 - smoothstep(
                   radius * 0.45,
                   radius * 1.25,
                   distanceToCenter
                 ));
          motifs.r += presence * flash
                    * (ring * 0.95 + innerRing * 0.28 + bloom * 0.2 + spiral * 0.25);
        } else if (kind < 0.72) {
          vec2 starUv = rotate2d(phase * 3.1415926) * delta;
          float core = exp(-distanceToCenter * 34.0);
          float cross = exp(-abs(starUv.x) * 52.0) * exp(-abs(starUv.y) * 5.0)
                      + exp(-abs(starUv.y) * 52.0) * exp(-abs(starUv.x) * 5.0);
          vec2 diagonalUv = rotate2d(0.7853982) * starUv;
          float diagonal = exp(-abs(diagonalUv.x) * 70.0)
                         * exp(-abs(diagonalUv.y) * 8.0);
          motifs.g += presence * flash * (core * 1.1 + cross * 0.75 + diagonal * 0.32);
        } else {
          float pinpoint = exp(-distanceToCenter * 70.0);
          motifs.b += presence * (0.35 + flash * 0.65) * pinpoint;
        }
      }
    }

    return motifs;
  }

  void main() {
    vec2 pointer = uMouse * 0.5;
    float time = uTime * uMotion;
    float viewAngle = dot(pointer, normalize(vec2(0.76, -0.65))) * 3.8
                    + length(pointer) * 0.85
                    + time * 0.16;

    vec2 centeredUv = vUv - 0.5;
    centeredUv.x *= uAspect;
    vec2 lightPosition = vec2(pointer.x * uAspect, -pointer.y) * 0.46;
    float lightDistance = length(centeredUv - lightPosition);
    float movingGlint = exp(-lightDistance * lightDistance * 3.8);

    float sweep = dot(vUv - 0.5, normalize(vec2(0.72, 1.0)));
    float phase = sweep * 0.82
                + pointer.x * 0.34
                - pointer.y * 0.24
                + time * 0.012
                + noise(vUv * 3.4 + pointer * 0.3 + uSeed * 5.0) * 0.1;
    vec3 prism = spectrum(phase);
    vec2 motifResolution = vec2(120.0 * uAspect, 120.0);
    vec2 motifUv = floor(vUv * motifResolution) / motifResolution;

    float foilBands = 0.5 + 0.5 * sin(
      sweep * 12.0 + viewAngle * 1.6
    );
    foilBands = smoothstep(0.2, 0.92, foilBands);

    vec3 largeMotifs = cosmoMotifs(motifUv, 3.4, 4.7, viewAngle);
    vec3 mediumMotifs = cosmoMotifs(motifUv, 7.2, 17.3, viewAngle + 1.4);
    vec3 smallMotifs = cosmoMotifs(motifUv, 14.0, 31.1, viewAngle - 0.9);
    float heroOrbs =
      heroOrb(motifUv, seededPosition(3.1), 0.115, 0.17 + uSeed, viewAngle)
      + heroOrb(motifUv, seededPosition(11.7), 0.072, 0.61 + uSeed, viewAngle + 0.8);
    float heroSparkles =
      heroSparkle(motifUv, seededPosition(19.3), 1.0, 0.31 + uSeed, viewAngle)
      + heroSparkle(motifUv, seededPosition(27.9), 0.72, 0.79 + uSeed, viewAngle + 1.2);
    float orbs = largeMotifs.r * 0.9 + mediumMotifs.r * 0.4 + heroOrbs * 1.15;
    float crosses = largeMotifs.g * 0.7
                  + mediumMotifs.g
                  + smallMotifs.g * 0.25
                  + heroSparkles * 1.2;
    float pinpoints = mediumMotifs.b * 0.7 + smallMotifs.b * 1.2;
    float motifLight = orbs + crosses + pinpoints;

    float cloudyFoil = noise(
      vUv * vec2(4.2 * uAspect, 4.2)
      + pointer * 0.45
      + uSeed * 11.0
    );
    cloudyFoil = smoothstep(0.25, 0.82, cloudyFoil);

    vec2 subjectUv = vec2((vUv.x - 0.52) * 1.18, vUv.y - 0.5);
    float inkMask = mix(
      0.44,
      1.0,
      smoothstep(0.16, 0.48, length(subjectUv))
    );

    vec3 baseColor = prism * (0.09 + foilBands * 0.13 + cloudyFoil * 0.08);
    baseColor += prism * movingGlint * 0.18;
    vec3 motifColor =
      mix(vec3(0.48, 0.76, 1.0), vec3(1.0, 0.5, 0.86), prism.r)
      * orbs * 0.9;
    motifColor += vec3(1.0, 0.97, 0.86) * crosses * 1.5;
    motifColor += vec3(0.86, 0.94, 1.0) * pinpoints * 1.15;
    vec3 color = baseColor + motifColor * inkMask;

    float alpha = 0.08
                + foilBands * 0.13
                + cloudyFoil * 0.07
                + movingGlint * 0.1
                + motifLight * 0.88 * inkMask;
    alpha = clamp(alpha * uIntensity, 0.0, 0.92);

    gl_FragColor = vec4(color, alpha);
  }
`;
