"use client";

/**
 * <Magnetic> (P7) — wraps any element so it gently pulls toward the cursor and
 * springs back. Purely presentational: it renders an inline-flex motion wrapper and
 * leaves the child (e.g. a Chakra Button/Link) fully interactive. No-op under
 * reduced-motion / coarse pointers, so focus and click targets stay put.
 */

import { Box, BoxProps } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useMagnetic } from "@/lib/useMagnetic";

type MagneticProps = BoxProps & {
  /** Max pixel offset toward the cursor. */
  strength?: number;
};

export const Magnetic: React.FC<MagneticProps> = ({
  children,
  strength = 6,
  ...rest
}) => {
  const { handlers, style } = useMagnetic({ strength });
  return (
    <Box
      as={motion.div}
      display="inline-flex"
      style={style}
      {...handlers}
      {...rest}
    >
      {children}
    </Box>
  );
};
