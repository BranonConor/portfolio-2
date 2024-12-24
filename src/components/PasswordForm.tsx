import {
  Box,
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
  const [password, setPassword] = useState("");
  const [hasError, setHasError] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (password === "raybran") {
      setHasPassword(true);
    } else {
      setHasError(true);
    }
  };

  const bg = useColorModeValue("brand.lightBg", "brand.darkBg");

  const errorMessages = [
    "Wrong password!",
    "Nope! Try again.",
    "Incorrect - who gave you that one?",
  ];

  useEffect(() => {
    setMessage(errorMessages[Math.floor(Math.random() * 3)]);
  }, [hasError]);

  useEffect(() => {
    if (password === "") {
      setHasError(false);
    }
  }, [password]);

  return (
    <>
      {preview}
      <Box
        as="form"
        onSubmit={handleSubmit}
        padding={8}
        mt={8}
        borderRadius={16}
        bg={bg}
        boxShadow="lg"
      >
        <FancyHeading>Password Check 🔓</FancyHeading>
        <Text mb={4}>
          This one's pretty detailed - check with me and I'll get you a
          password, which you can enter here.
        </Text>
        <FormLabel htmlFor="password">Enter super secret password</FormLabel>
        <Input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          name="password"
          boxShadow="sm"
        />
        {!!hasError ? (
          <Text mt={2} color="red.500">
            {message}
          </Text>
        ) : null}
      </Box>
    </>
  );
};
