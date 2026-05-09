"use client";

import { Box } from "@chakra-ui/react";
import Content from "./thesis.mdx";
import { useState } from "react";
import HeroStrip from "@/components/blog/HeroStrip";
import { PasswordForm } from "@/components/PasswordForm";

const Page = () => {
  const [hasPassword, setHasPassword] = useState(false);

  return (
    <Box width="100%">
      {hasPassword ? (
        <Content />
      ) : (
        <PasswordForm
          preview={
            <HeroStrip
              title="Building thesis.social 💫"
              subtitle="An AI-assisted knowledge platform where research happens through conversation"
              date="March 2026"
              category="Side Projects"
            />
          }
          setHasPassword={setHasPassword}
        />
      )}
    </Box>
  );
};

export default Page;
