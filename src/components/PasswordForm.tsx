import {
  Box,
  Button,
  Flex,
  FormLabel,
  Input,
  Text,
  useColorModePreference,
  useColorModeValue,
} from "@chakra-ui/react";
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

  console.log(one, two, three, four);

  const focusNextElement = (element: HTMLElement) => {
    const nextSibling = element.nextElementSibling;

    if (nextSibling) {
      (nextSibling as HTMLElement).focus();
    }
  };

  const bg = useColorModeValue("brand.lightBg", "brand.darkBg");

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
      <Box padding={8} mt={8} borderRadius={16} bg={bg} boxShadow="lg">
        <FancyHeading>Password Check 🔓</FancyHeading>
        <Text mb={4}>
          This one's pretty detailed - check with me and I'll get you a PIN,
          which you can enter here.
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
            boxShadow="sm"
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
            boxShadow="sm"
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
            boxShadow="sm"
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
            boxShadow="sm"
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
