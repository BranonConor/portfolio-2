"use client";

/**
 * Scroll-reveal primitives (P2) with built-in reduced-motion respect (P10).
 *
 * - <Reveal>        single element that fades + rises once when scrolled into view.
 * - <RevealGroup>   container that staggers its <RevealItem> children in.
 * - <RevealItem>    child of a RevealGroup.
 *
 * Under `prefers-reduced-motion` all variants collapse to a plain fade (no translate),
 * so nothing slides — avoiding vestibular discomfort while keeping a gentle entrance.
 *
 * Uses the Chakra `Box as={motion.div}` pattern (rather than `motion(Box)`) to avoid
 * the Chakra/Framer `transition` prop type clash.
 */

import { Box, BoxProps } from "@chakra-ui/react";
import { motion, useReducedMotion } from "framer-motion";
import {
  revealContainer,
  revealItem,
  revealItemReduced,
  inViewOnce,
} from "@/lib/motion";

/** A single element that reveals (fade + rise) once when it enters the viewport. */
export const Reveal: React.FC<BoxProps> = ({ children, ...rest }) => {
  const reduce = useReducedMotion();
  const variants = reduce ? revealItemReduced : revealItem;

  return (
    <Box
      as={motion.div}
      initial="hidden"
      whileInView="show"
      viewport={inViewOnce}
      variants={variants}
      {...rest}
    >
      {children}
    </Box>
  );
};

/** Container that staggers its <RevealItem> children into view. */
export const RevealGroup: React.FC<BoxProps> = ({ children, ...rest }) => {
  return (
    <Box
      as={motion.div}
      initial="hidden"
      whileInView="show"
      viewport={inViewOnce}
      variants={revealContainer}
      {...rest}
    >
      {children}
    </Box>
  );
};

/** Child of a <RevealGroup>. Inherits the group's staggered timing. */
export const RevealItem: React.FC<BoxProps> = ({ children, ...rest }) => {
  const reduce = useReducedMotion();
  const variants = reduce ? revealItemReduced : revealItem;
  return (
    <Box as={motion.div} variants={variants} {...rest}>
      {children}
    </Box>
  );
};
