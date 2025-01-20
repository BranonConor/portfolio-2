"use client";

import { Box } from "@chakra-ui/react";
import Content from "./toolbar.mdx";
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
              title="Toolbar Component Rebuild @ Smartsheet"
              subtitle="Improving one of Smartsheet's most widely-used design system components"
              image="/projects/toolbar/cover.png"
              date="December 2024"
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
