import { Heading, HeadingProps } from "@chakra-ui/react";

export const FancyHeading: React.FC<HeadingProps> = ({
  children,
  ...otherProps
}) => {
  return (
    <Heading
      as="h2"
      size="lg"
      color="brand.textMuted"
      fontWeight="400"
      mb={6}
      {...otherProps}
    >
      {children}
    </Heading>
  );
};
