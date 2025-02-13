"use client";

import { PageWrapper } from "@/components/PageWrapper";
import { Button, Flex, useColorModeValue } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import ScrollButton from "@/components/blog/ScrollButton";

export default function MdxLayout({ children }: { children: React.ReactNode }) {
  const bg = useColorModeValue("white", "brand.grey");
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isEndOfPage, setIsEndOfPage] = useState(false);
  const [bottomPosition, setBottomPosition] = useState(0);
  const codeBg = useColorModeValue("brand.lightGrey", "brand.darkBg");
  const codeColor = useColorModeValue("brand.darkPink", "brand.pink");

  const handleScroll = () => {
    if (typeof global?.window !== "undefined") {
      const position = global?.window.pageYOffset;
      const totalPageHeight = document.body.scrollHeight;
      setBottomPosition(totalPageHeight);
      const scrollPoint = global?.window.scrollY + global?.window.innerHeight;

      // check if we hit the bottom of the page
      if (scrollPoint + 32 >= totalPageHeight) {
        setIsEndOfPage(true);
      } else {
        setIsEndOfPage(false);
      }

      setScrollPosition(position);
    }
  };

  useEffect(() => {
    if (typeof global?.window !== "undefined") {
      global?.window.addEventListener("scroll", handleScroll, {
        passive: true,
      });
    }

    return () => {
      if (typeof global?.window !== "undefined") {
        global?.window.removeEventListener("scroll", handleScroll);
      }
    };
  }, [global?.window, scrollPosition]);

  useEffect(() => {
    handleScroll();
  }, []);

  return (
    <PageWrapper
      bg={bg}
      mt="-32px"
      pb={10}
      sx={{
        ".remark-highlight": {
          width: "100%",
          my: "16px",
        },
      }}
    >
      <Flex justifyContent="center" width="100%">
        <Flex
          flexDirection="column"
          width="100%"
          maxWidth="950px"
          alignItems="flex-start"
          justifyContent="flex-start"
          sx={{
            "code:not(pre > code)": {
              color: codeColor,
              bg: codeBg,
              padding: "1px 4px",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "bold",
            },
            "pre[class*='language-']": {
              borderRadius: "16px",
            },
          }}
        >
          <AnimatePresence>
            {scrollPosition > 128 && (
              <ScrollButton
                key="up"
                scrollDirection="up"
                bottomPosition={bottomPosition}
                scrollPosition={scrollPosition}
                isEndOfPage={isEndOfPage}
              />
            )}
            {!isEndOfPage && (
              <ScrollButton
                key="down"
                scrollDirection="down"
                bottomPosition={bottomPosition}
                scrollPosition={scrollPosition}
                isEndOfPage={isEndOfPage}
              />
            )}
          </AnimatePresence>
          {children}
          <Flex>
            <Button mt={8} variant="primary" as={Link} href="/projects">
              👈🏽 Back to Projects
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </PageWrapper>
  );
}
