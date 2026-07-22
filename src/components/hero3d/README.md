# P8 Tier B — react-three-fiber hero (optional, not shipped)

This folder contains a **true-3D** version of the home hero (`Hero3D.tsx`) built with
`three` / `@react-three/fiber` / `@react-three/drei`. It floats textured planes of
Branon's paint strokes at different z-depths, lights them, and eases the rig toward the
pointer — a genuine-3D echo of the press.stripe books.

## Status: implemented but intentionally NOT wired in

The shipped default is **P8 Tier A** (`src/components/HeroParallax.tsx`), a zero-dependency
faked-3D parallax stage. Tier B is kept here, isolated, so it's trivial to adopt or drop.

### Why it isn't enabled

`@react-three/fiber` v9 augments the **global** `JSX.IntrinsicElements` namespace with ~700
three.js elements. That inflates Chakra UI's polymorphic `as` type union past TypeScript's
limit, producing project-wide errors like:

```
TS2590: Expression produces a union type that is too complex to represent. (FancyHeading.tsx)
```

Because the augmentation is global, any typed file that transitively imports
`@react-three/fiber` breaks Chakra's typing everywhere. Rather than block the entire polish
PR on this, Tier A ships and this folder is excluded from typechecking via `tsconfig.json`
(`"exclude": ["src/components/hero3d"]`).

### How to enable it later (follow-up)

1. Resolve the Chakra `as` ↔ three JSX conflict, e.g. isolate the r3f subtree in its own
   package/tsconfig, or pin Chakra typings so `as` doesn't enumerate all intrinsic elements.
2. Import and mount behind a flag + client-only dynamic import (both files here are ready):

   ```tsx
   // src/app/page.tsx
   import { Hero3DLazy } from "@/components/hero3d/Hero3DLazy";
   const HERO_3D_ENABLED = process.env.NEXT_PUBLIC_HERO_3D === "1";
   // ...inside the hero graphic box, over <HeroParallax/>:
   {HERO_3D_ENABLED && (
     <Box position="absolute" inset={0} zIndex={2} pointerEvents="none"
          display={["none", "none", "block"]}>
       <Hero3DLazy />
     </Box>
   )}
   ```

3. Remove `src/components/hero3d` from the `exclude` list in `tsconfig.json`.

`Hero3D` already respects `prefers-reduced-motion` (no per-frame rotation/float) and
`Hero3DLazy` loads it via a client-only, code-split dynamic import so the three.js bundle
is never fetched unless the flag mounts it.

### Dependencies added for this tier

- `three`
- `@react-three/fiber`
- `@react-three/drei`

If Tier B is abandoned, remove these three packages to drop the weight.
