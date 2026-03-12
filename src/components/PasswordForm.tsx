import { Box, Button, Flex, FormLabel, Input, Text } from "@chakra-ui/react";
import {
  Dispatch,
  FormEventHandler,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { FancyHeading } from "./FancyHeading";

interface PasswordFormProps {
  preview: ReactNode;
  setHasPassword: Dispatch<SetStateAction<boolean>>;
}
export const PasswordForm = ({
  preview,
  setHasPassword,
}: PasswordFormProps) => {
  const [one, setOne] = useState("");
  const [two, setTwo] = useState("");
  const [three, setThree] = useState("");
  const [four, setFour] = useState("");
  const [hasError, setHasError] = useState(false);
  const [message, setMessage] = useState("");

  const focusNextElement = (element: HTMLElement) => {
    const nextSibling = element.nextElementSibling;

    if (nextSibling) {
      (nextSibling as HTMLElement).focus();
    }
  };

  const bg = "brand.surface";

  const errorMessages = [
    "Wrong password! ❌",
    "Nope! Try again.",
    "Incorrect - who gave you that one? 🤨",
    "Wrong 🫢",
  ];

  useEffect(() => {
    if (one + two + three + four === "") {
      setHasError(false);
    }
  }, [one, two, three, four]);

  const firstInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <>
      {preview}
      <Box
        padding={8}
        mx={[4, 5, 6]}
        mt={8}
        borderRadius={16}
        bg="rgba(255, 255, 255, 0.03)"
        border="1px solid"
        borderColor="brand.border"
      >
        <FancyHeading>Password Check 🔓</FancyHeading>
        <Text mb={4}>
          This project is pretty detailed and not entirely public - check with
          me and I'll get you a PIN.
        </Text>
        <FormLabel htmlFor="password">Enter super secret PIN 👇🏽</FormLabel>
        <Flex gap={2} width="300px">
          <Input
            onChange={(e) => {
              setOne(e.target.value[e.target.value.length - 1]);
              if (e.target.value) {
                focusNextElement(e.target);
              }
            }}
            value={one}
            name="one"
            border="1px solid"
            borderColor="brand.border"
            padding={2}
            type="number"
            width={12}
            ref={firstInputRef}
          />
          <Input
            onChange={(e) => {
              setTwo(e.target.value[e.target.value.length - 1]);
              if (e.target.value) {
                focusNextElement(e.target);
              }
            }}
            value={two}
            name="two"
            border="1px solid"
            borderColor="brand.border"
            padding={2}
            type="number"
            width={12}
          />
          <Input
            onChange={(e) => {
              setThree(e.target.value[e.target.value.length - 1]);
              if (e.target.value) {
                focusNextElement(e.target);
              }
            }}
            value={three}
            name="two"
            border="1px solid"
            borderColor="brand.border"
            padding={2}
            type="number"
            width={12}
          />
          <Input
            onChange={(e) => {
              setFour(e.target.value[e.target.value.length - 1]);
              if (e.target.value && !!one && !!two && !!three) {
                if (
                  one +
                    two +
                    three +
                    e.target.value[e.target.value.length - 1] ===
                    "1738" ||
                  one + two + three + four === "1738"
                ) {
                  setHasPassword(true);
                } else {
                  setHasError(true);
                  setMessage(errorMessages[Math.floor(Math.random() * 3)]);
                  (firstInputRef.current as HTMLInputElement)?.focus();
                }
              }
            }}
            value={four}
            name="two"
            border="1px solid"
            borderColor="brand.border"
            padding={2}
            type="number"
            width={12}
          />
        </Flex>
        {!!hasError ? (
          <Text mt={2} color="red.500">
            {message}
          </Text>
        ) : null}
      </Box>
    </>
  );
};
