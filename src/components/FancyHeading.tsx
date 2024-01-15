import { Heading, HeadingProps } from "@chakra-ui/react";

export const FancyHeading: React.FC<HeadingProps> = ({
  children,
  ...otherProps
}) => {
  return (
    <Heading
      as="h2"
      size="xl"
      color="brand.pink"
      borderLeft="4px solid"
      borderLeftColor="brand.pink"
      pl={6}
      mb={8}
      {...otherProps}
    >
      {children}
    </Heading>
  );
};
