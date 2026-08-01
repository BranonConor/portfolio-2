import { Heading, HeadingProps } from "@chakra-ui/react";
import { pixelFont } from "@/components/boot-intro/pixelFont";

export const FancyHeading: React.FC<HeadingProps> = ({
  children,
  ...otherProps
}) => {
  return (
    <Heading
      as="h2"
      size="lg"
      className={pixelFont.className}
      color="brand.textMuted"
      fontWeight="400"
      letterSpacing="0.02em"
      mb={6}
      {...otherProps}
    >
      {children}
    </Heading>
  );
};
