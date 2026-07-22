# Stripe-inspired interaction & visual proposals for branon.dev

_A design-engineering research doc. Studies the craft on [press.stripe.com](https://press.stripe.com/)
and [stripe.dev](https://stripe.dev/), then proposes concrete, tasteful upgrades that build on
Branon's existing paint-stroke / playful brand — without erasing it._

> **Scope:** research + proposal only. No site code is changed by this document. Every proposal
> names the real file(s) it would touch in this repo (Next.js 15 app router, React 19, Chakra UI +
> Emotion, Framer Motion 11, MDX; Poppins + Space Grotesk).

---

## Part 1 — Reverse-engineering the reference sites

### 1a. press.stripe.com — the 3D "books"

**What it looks like.** A row of hardcover books floating in a warm, near-black room. Each book is a
real 3D object: you see the cover, the spine, and a sliver of pages with genuine thickness. As the
cursor moves, every book tilts to "look at" the pointer with a soft, damped lag — it eases in and
settles rather than snapping. Scrolling glides the books horizontally and re-stages them; hovering
one lifts it slightly and sharpens its shadow. Lighting is directional (a soft key light with a long,
blurred contact shadow), and there's a faint film grain over the whole scene. Color and type are
extremely restrained: one warm background, one accent per book, a single quiet serif/grotesk pairing.

**Likely implementation.** This is **not** per-element CSS `rotateX/rotateY`. The page markup gives it
away: there is a single shared **`Canvas` controller** plus a `DomGraphic` controller, and the book
DOM nodes (`.PressHomepageBook`) are positioned with custom properties like `--canvasScale`, `--vh`,
and `--windowWidth`. The `.PressHomepageBook` element itself carries **no 3D transform** — it's a
transparent hit-target / text overlay (`cursor: pointer`, `pointer-events` toggled while scrolling).
That pattern — a full-viewport `<canvas>` doing the rendering with lightweight DOM nodes layered on
top for text and click targets — is the signature of a **WebGL scene** (custom GL or a three.js-class
renderer), not DOM 3D. The books are meshes with real materials (cover texture, page edge, spine),
a light for the soft shadow, and the "follow the mouse" behaviour is a per-frame **eased interpolation
(lerp/damped spring)** of each book's target rotation toward the pointer, updated in a
`requestAnimationFrame` loop. Scroll position drives camera/layout; grain is a texture or post overlay.

**Why WebGL and not CSS here:** true page thickness, per-object directional lighting, a soft contact
shadow that responds to tilt, and simultaneous smooth animation of many objects at 60fps is exactly
what a GL scene is good at and what stacked CSS transforms struggle to fake convincingly.

**Craft takeaways (transferable regardless of tech):**

- **Damped motion, never linear.** The lag/settle is the whole feeling. Target value + eased
  approach each frame (or a spring), not a direct `transform = f(mouse)`.
- **Depth is earned with light + shadow, not just perspective.** A single soft, offset, blurred
  shadow reads as "3D object in a room."
- **Restraint everywhere else.** One background, one accent, generous negative space, quiet type —
  so the one moving thing carries all the attention.
- **Grain** unifies flat vector/UI with "photographed object" and hides banding on gradients.

### 1b. stripe.dev — "fancy graphics as imagery"

**What it looks like.** A developer blog whose hero and post cards are carried by **generative,
illustrated graphics**: layered gradient meshes, soft glows/blooms, and iridescent/holographic
sheens, each tuned per-post so the grid feels curated rather than templated. Cards sit on a calm,
high-contrast layout with strong grid rhythm and consistent spacing. On hover, a card lifts, its
shadow deepens, and its graphic subtly brightens/shifts. On scroll, cards **reveal and stagger in**
(fade + short upward translate, a few tens of milliseconds apart) instead of popping.

**Notable effects, decomposed.**

| Effect | Looks like | Likely technique | Difficulty | In _this_ stack |
|---|---|---|---|---|
| Gradient/iridescent hero art | Soft multi-stop mesh gradients + glow, holographic sheen | Layered CSS `radial/conic-gradient` + blend modes, or a shader/`<canvas>`; often pre-rendered to image/SVG | S–M (CSS) / L (shader) | CSS gradients + `mix-blend-mode` in a Chakra `Box`; optional noise overlay |
| Card hover lift | Card rises, shadow grows, art brightens | `transform: translateY` + `box-shadow` + `filter` transition, eased | S | Framer Motion `whileHover` (already partly done in `ShowcaseCard`) |
| Scroll reveal + stagger | Cards fade/slide up in sequence | IntersectionObserver → animate; `staggerChildren` | S | Framer Motion `whileInView` + `variants` container/child |
| Grid rhythm & spacing | Even gutters, aligned baselines, generous whitespace | Design tokens, consistent gap scale | S | Chakra `Grid`/`gap` tokens (already uses `gridGap`) |
| Motion timing | Everything eases the same way | Shared duration/easing curves | S | A shared `motion.ts` token module |

**Craft takeaways:** the "fancy" is mostly **layered gradients + blend modes + one restrained glow**,
plus **consistent, gentle motion timing**. The magic is discipline (shared easing, shared spacing),
not one expensive trick.

---

## Part 2 — Grounding in this repo

What already exists (and is genuinely good — proposals should extend, not replace):

- **Paint-stroke brand.** `PaintStroke.tsx` renders `s1–s6.png` strokes as absolutely-positioned,
  low-opacity, `mixBlendMode="lighten"` accents (used in `HeroStrip.tsx`). This is the identity.
  Note: `AnimatedPaintStroke.tsx` is currently an **empty file** — a natural home for a motion-ified
  stroke.
- **`ShowcaseCard.tsx`** — lift-on-hover via Chakra `_hover` (`translateY(-4px)` + `boxShadow`), and
  Framer Motion `whileHover/whileTap` on the two icon buttons.
- **`blog/PostCard.tsx`** — already computes a **mouse-follow tilt** (`rotateX/rotateY` from cursor
  position via `getBoundingClientRect`) plus an image zoom/blur and an emoji reveal. It's driven by
  React state on every `mousemove` and applied through a big Chakra `_hover` block — expressive but
  un-damped and re-rendering per move. Prime candidate for a physics/refinement pass.
- **`blog/HeaderImage.tsx`** — Framer Motion entrance (top/scale) on post headers.
- **`sections/Showcase.tsx`** — gradient panel (`brand.newGradient`) with a `/noise.png` grain
  overlay at `opacity 0.2`. Grain is already in the toolbox.
- **`Wave.tsx`** — fixed decorative SVG wave, desktop-only.
- **`easter-egg/PortraitCanvas.tsx`** — a legitimately advanced `<canvas>` particle engine (16
  styles: glitch, liquify, magnetic ferrofluid, ink bleed…) with a `requestAnimationFrame` loop and
  mouse tracking. **Proof the codebase can already do real canvas work** and host a WebGL/canvas
  centerpiece.
- **Theme** (`app/theme.ts`): dark-first, zinc-black surfaces (`#09090b`/`#141416`), accents
  `blue #60a5fa`, `purple #a78bfa`, `pink #f472b6`, and a `gradient` token. Type: Poppins + Space
  Grotesk. Layout sets `scrollBehavior: smooth`.

**Gaps Stripe's playbook would fill:** motion is ad-hoc (durations/easings inline and inconsistent);
no shared easing tokens; no scroll-reveal choreography on the card grids; tilt is un-damped; gradient
card art isn't generative/per-item; `prefers-reduced-motion` isn't handled centrally.

---

## Part 3 — Design principles (Stripe taste ⋈ paint-stroke brand)

1. **Restraint is the feature.** One hero moment per view. Everything else stays calm so the paint
   strokes and one signature interaction breathe.
2. **Damped, shared motion.** Adopt a small set of easing/duration tokens and reuse them everywhere.
   Prefer eased approach / spring over linear. This alone makes the whole site feel "designed."
3. **Depth from light, not just perspective.** When we tilt or lift, pair it with shadow and a subtle
   highlight so it reads as a physical object — the way the strokes already feel hand-placed.
4. **Gradients + grain, tuned to his palette.** Use his blue/purple/pink, layered gradients with
   blend modes, and the existing `noise.png` to avoid banding and add tactility. This is the bridge:
   Stripe's iridescence rendered in Branon's colors and paint texture.
5. **Micro-interactions over flash.** Magnetic buttons, gentle stagger, a stroke that leans toward
   the cursor — small, tasteful, reversible. No autoplay spectacle.
6. **Accessibility is non-negotiable.** Every motion proposal ships with a `prefers-reduced-motion`
   path (reduce to a simple fade or none). Keyboard/focus states preserved.
7. **Playful, not corporate.** Stripe is precise but cool; Branon is precise _and_ warm. Keep the
   emoji, the strokes, the wave. Borrow Stripe's discipline, keep Branon's personality.

---

## Part 4 — Concrete proposals

Effort legend: **S** ≈ a focused afternoon · **M** ≈ 1–2 days · **L** ≈ multi-day / new dependency.

### P1 — Motion tokens (`src/lib/motion.ts`) · **Quick win** · Effort **S**
**Pitch:** one shared vocabulary of easings/durations so every animation feels like the same hand.
**Experience:** nothing new visually at first — but hovers, reveals, and entrances all start easing
identically, which is exactly what makes Stripe feel cohesive.
**Inspired by:** stripe.dev's consistent motion timing.
**Implementation:** new `src/lib/motion.ts` exporting tokens, e.g.
`export const ease = { out: [0.16,1,0.3,1], inOut: [0.65,0,0.35,1] }` and
`export const dur = { fast: 0.15, base: 0.25, slow: 0.45 }`, plus a `reveal` variants object.
Refactor inline values in `ShowcaseCard`, `PostCard`, `HeaderImage` to import these.
**Perf/A11y:** zero runtime cost; centralizes a `useReducedMotion()` gate other proposals reuse.
**Brand fit:** invisible glue; makes the paint-stroke moments feel intentional.

### P2 — Staggered scroll-reveal for card grids · **Quick win** · Effort **S**
**Pitch:** cards fade and drift up in a gentle stagger as they enter the viewport.
**Experience:** the Showcase, blog, projects, engagements, and in-the-wild grids assemble
themselves as you scroll instead of being fully present on load.
**Inspired by:** stripe.dev card entrances.
**Implementation:** wrap grids in a `motion.div` container with `whileInView="show"`,
`viewport={{ once: true, margin: "-10%" }}` and `variants={{ show: { transition: { staggerChildren: 0.06 } } }}`;
make each card a child variant (`hidden: { opacity:0, y:16 }`, `show: { opacity:1, y:0 }`) using P1's
easing. Touch `sections/Showcase.tsx` and the MDX-driven grid wrappers.
**Perf/A11y:** IntersectionObserver-backed, `once: true` so it runs a single time; under
reduced-motion collapse to opacity-only (or instant). GPU-friendly (`opacity`/`transform` only).
**Brand fit:** makes the playful cards feel choreographed, not busy.

### P3 — Refined magnetic + damped mouse-tilt on `ShowcaseCard` / `PostCard` · **Quick win → Signature** · Effort **M**
**Pitch:** cards subtly "look at" the cursor with a soft, spring-damped tilt and a light-following
sheen — the press.stripe feel, at card scale.
**Experience:** hovering a card tilts it a few degrees toward the pointer, eases/settles (not snap),
lifts with a deeper shadow, and a faint radial highlight tracks the cursor across the surface.
**Inspired by:** press.stripe book mouse-follow physics + stripe.dev hover lift.
**Implementation:** extract a `useTilt()` hook using Framer Motion `useMotionValue` +
`useSpring` (`{ stiffness: 150, damping: 20 }`) mapped through `useTransform` to `rotateX/rotateY`,
applied on a `motion.div` with `transformPerspective: 800`. Replace `PostCard`'s current
`useState`-per-`mousemove` approach (removes per-move React re-renders) and add it to `ShowcaseCard`.
Sheen = an absolutely-positioned `radial-gradient` layer whose position is another motion value.
**Perf/A11y:** motion values bypass React render; disable entirely under `prefers-reduced-motion` and
on touch/coarse pointers; keep existing keyboard focus styles.
**Brand fit:** upgrades an effect Branon already reached for — same idea, better physics.

### P4 — Generative gradient/iridescent card graphics in his palette · **Signature** · Effort **M**
**Pitch:** give cards Stripe-style generated hero art — layered gradient meshes + a holographic
sheen, deterministically tinted per item from his blue/purple/pink.
**Experience:** each Showcase/blog card gets a distinct, soft, glowing gradient backdrop (with grain),
so the grid looks art-directed rather than uniform.
**Inspired by:** stripe.dev generative post graphics.
**Implementation:** new `src/components/GradientArt.tsx` — a Chakra `Box` composing 2–3
`radial-gradient`/`conic-gradient` layers with `mix-blend-mode: screen/soft-light`, a `blur` bloom
layer, and the existing `/noise.png` overlay. A tiny hash of the card title picks hue offsets from
theme tokens for stable per-card variation. Optional slow gradient drift via Framer Motion
`animate` (respect reduced-motion). Wire into `ShowcaseCard` (behind content) and as a
`PostCard` fallback when a post has no image.
**Perf/A11y:** pure CSS, no canvas; static by default. Ensure text contrast stays AA over the art
(dark scrim). Reduced-motion → no drift.
**Brand fit:** the clearest fusion — Stripe iridescence rendered in Branon's colors + paint grain.

### P5 — Cursor-reactive signature paint stroke (`AnimatedPaintStroke.tsx`) · **Signature** · Effort **M**
**Pitch:** bring the empty `AnimatedPaintStroke` to life — a hero stroke that leans, stretches, and
parallax-shifts toward the cursor with damped physics; his brand mark doing the press.stripe "follow."
**Experience:** near the top of the home page, the signature stroke gently reacts to the pointer
(subtle skew/translate/scale), settling softly — alive but never distracting.
**Inspired by:** press.stripe damped mouse-follow, expressed through Branon's own motif.
**Implementation:** implement `AnimatedPaintStroke.tsx` using `PaintStroke`'s image + Framer Motion
`useMotionValue`/`useSpring`; map global pointer position (normalized) to small `x/y/rotate/skew`
transforms. Place in `app/page.tsx` hero. Could layer 2–3 strokes at different spring stiffness for
depth parallax.
**Perf/A11y:** one `pointermove` listener with rAF throttle; motion-values only; fully disabled under
reduced-motion (renders the static stroke). Desktop/fine-pointer only.
**Brand fit:** this _is_ the identity — the most on-brand way to borrow the press.stripe idea.

### P6 — Global animated grain/noise overlay · **Quick win** · Effort **S**
**Pitch:** a whole-page, ultra-subtle film grain to unify flat UI with the painterly art.
**Experience:** surfaces gain a faint tactile texture; gradients stop banding. Barely conscious,
very "premium."
**Inspired by:** press.stripe scene grain.
**Implementation:** a fixed, `pointer-events:none`, low-opacity (`~0.03–0.05`) `/noise.png` layer in
`PageWrapper.tsx` (or `layout.tsx`), optionally a slow steps() background-position shimmer via CSS.
Reuses the asset already used in `Showcase.tsx`.
**Perf/A11y:** single fixed element; static (or GPU background-position). No effect on reduced-motion
users if kept static.
**Brand fit:** extends the grain Branon already likes to the whole canvas.

### P7 — Magnetic buttons & nav CTAs · **Quick win** · Effort **S**
**Pitch:** primary buttons gently pull toward the cursor and spring back.
**Experience:** the resume/CTA buttons and nav links feel tactile — a small magnetic nudge with a
soft settle on hover.
**Inspired by:** Stripe-family micro-interactions.
**Implementation:** `useMagnetic()` hook (motion value + spring on pointer offset within an
enlarged hit area); apply to the CTA `Button`s in `app/page.tsx` and `Nav.tsx`. Compose with P1
easing.
**Perf/A11y:** disable on touch and under reduced-motion; keep transforms tiny so focus/click targets
don't drift; preserve visible focus ring.
**Brand fit:** playful and precise — matches the existing `whileTap` energy on card buttons.

### P8 — Scroll-parallax hero object echoing the press.stripe "book" · **Signature centerpiece** · Effort **L**
**Pitch:** a single 3D hero object (a floating "sketchbook/paint palette" that fits Branon's story)
that tilts to the cursor and re-stages on scroll — the full press.stripe moment, once, done well.
**Experience:** on the home hero, one tastefully-lit 3D object follows the pointer with damped
physics and drifts/rotates subtly as you scroll past.
**Inspired by:** press.stripe books (directly).
**Implementation (staged, so we can stop at "good enough"):**
- **Tier A (no new deps):** fake it with layered `PaintStroke`/image planes on a `transformPerspective`
  stage, each on its own spring for parallax depth. Ships the _feeling_ at ~P5 cost.
- **Tier B (new dep):** real 3D via **`three` + `@react-three/fiber` + `@react-three/drei`** — a lit
  mesh with a soft contact shadow, damped `useFrame` rotation toward pointer, scroll-linked transform.
  Reuse the `PortraitCanvas` mental model (rAF + mouse tracking) the repo already proves out.
  **Flag:** this is the only proposal that adds dependencies (~existing R3F stack, lazy-loaded).
**Perf/A11y:** lazy-load the 3D bundle (dynamic import, desktop/fine-pointer only); cap DPR; pause
`useFrame` when offscreen; **reduced-motion → render a static hero image** and skip WebGL entirely.
**Brand fit:** make the object unmistakably _his_ (paint palette / sketchbook / stroke), not a Stripe
book — homage, not copy. Recommend building **Tier A first**; only go Tier B if the payoff is clearly
worth the dependency + budget.

### P9 — Blog/`HeroStrip` gradient + parallax polish · **Quick win** · Effort **S**
**Pitch:** apply the P4 generative gradient behind `HeroStrip`/`HeaderImage` and add a light
scroll-parallax to post header images.
**Experience:** article headers get the same tasteful glow-and-grain treatment and a subtle depth
shift on scroll.
**Inspired by:** stripe.dev post heroes.
**Implementation:** compose `GradientArt` (P4) into `HeroStrip.tsx`; add `useScroll` +
`useTransform` `y` parallax to the image in `HeaderImage.tsx` (which is already a `motion.div`).
**Perf/A11y:** transform-only parallax; reduced-motion disables the shift.
**Brand fit:** unifies blog and home under one visual language.

### P10 — Focus/keyboard-first polish pass · **Quick win** · Effort **S**
**Pitch:** make every new interaction keyboard- and reduced-motion-complete.
**Experience:** identical hover affordances available on focus; motion respectfully reduced when asked.
**Inspired by:** Stripe's baseline rigor (accessible by default).
**Implementation:** a shared `useReducedMotion()` gate (from P1) + Chakra `_focusVisible` styles on
cards/buttons; ensure tilt/magnetic/parallax all short-circuit. Cross-cutting across P2–P9.
**Perf/A11y:** this _is_ the accessibility proposal; no perf cost.
**Brand fit:** quality signal that matches the craft.

---

## Part 5 — Prioritization

**Quick wins (ship first, low risk, high polish-per-hour):**
`P1` motion tokens · `P2` staggered scroll-reveal · `P6` global grain · `P7` magnetic buttons ·
`P10` a11y/focus pass · `P9` blog hero polish.

**Signature centerpieces (higher effort, memorable):**
`P3` damped card tilt + sheen · `P4` generative gradient card art · `P5` cursor-reactive signature
stroke · `P8` 3D hero object (the big swing).

---

## Part 6 — Recommended phased rollout

- **Phase 1 — Foundation (all Quick wins, no new deps):** P1 → P2 → P10, then P6, P7, P9.
  Establishes shared motion + reveal choreography and the a11y contract everything else relies on.
- **Phase 2 — Signature surfaces (no new deps):** P3 (damped tilt + sheen) and P4 (generative
  gradient art). This is where the site starts to feel distinctly "Stripe-grade" while staying
  entirely on the current stack.
- **Phase 3 — Brand centerpiece:** P5 (animated signature stroke), then **P8 Tier A** (faked 3D
  parallax hero). Evaluate impact.
- **Phase 4 — Optional big swing:** **P8 Tier B** only if Tier A validates the concept — adds
  `three` + `@react-three/fiber` + `@react-three/drei`, lazy-loaded, desktop-only, with a static
  reduced-motion fallback.

**New dependencies:** none for Phases 1–3. Phase 4 (optional) adds the React-Three-Fiber stack.

**Guiding constraint throughout:** borrow Stripe's _discipline_ (shared easing, restraint, depth via
light, grain, accessible-by-default) and render it in Branon's _voice_ (paint strokes, warm palette,
emoji, the wave). Harmonize — never replace — the existing identity.
