"use client";

import { Box } from "@chakra-ui/react";
import Content from "./reimagining-github.mdx";
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
              title="Reimagining GitHub 💭 @ GitHub"
              subtitle="Rethinking the GitHub experience from the ground up."
              date="December 2025"
              category="Hackweek"
            />
          }
          setHasPassword={setHasPassword}
        />
      )}
    </Box>
  );
};

export default Page;
