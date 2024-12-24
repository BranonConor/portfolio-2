"use client";

import { Box } from "@chakra-ui/react";
import Content from "./theme-refactor.mdx";
import { useState } from "react";
import HeroStrip from "@/components/blog/HeroStrip";
import { PasswordForm } from "@/components/PasswordForm";

const Page = () => {
  const [hasPassword, setHasPassword] = useState(false);

  return (
    <Box>
      {hasPassword ? (
        <Content />
      ) : (
        <PasswordForm
          preview={
            <HeroStrip
              title="Theme Architecture Refactor @ Smartsheet"
              subtitle="Building a more scalable theming architecture for design system consumers"
              image="/projects/theme-refactor/cover.png"
              date="June 2024"
              category="Design Systems"
            />
          }
          setHasPassword={setHasPassword}
        />
      )}
    </Box>
  );
};

export default Page;
