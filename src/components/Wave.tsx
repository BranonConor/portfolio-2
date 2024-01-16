import { Image, useColorModeValue } from "@chakra-ui/react";

export const Wave = () => {
  const wave = useColorModeValue("/wave-light.svg", "/wave-dark.svg");

  return (
    <Image
      src={wave}
      position="fixed"
      right={0}
      bottom={0}
      zIndex={0}
      display={["none", "none", "none", "none", "none", "block"]}
    />
  );
};
