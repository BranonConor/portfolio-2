"use client";

import { PageWrapper } from "@/components/PageWrapper";
import { Box, Button, Flex } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import ScrollButton from "@/components/blog/ScrollButton";
import { AnimatePresence } from "framer-motion";

export default function MdxLayout({ children }: { children: React.ReactNode }) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isEndOfPage, setIsEndOfPage] = useState(false);
  const [bottomPosition, setBottomPosition] = useState(0);

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
    <PageWrapper pb={10} id="blog-page">
      <Flex justifyContent="center" width="100%">
        <Flex
          flexDirection="column"
          width="100%"
          maxWidth="950px"
          alignItems="flex-start"
          justifyContent="flex-start"
          sx={{
            "code:not(pre > code)": {
              color: "#61dafb",
              bg: "#61dafb15",
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
          <Box
            bg="rgba(20, 20, 22, 0.6)"
            backdropFilter="blur(16px)"
            style={{ WebkitBackdropFilter: "blur(16px)" }}
            border="1px solid"
            borderColor="brand.border"
            borderRadius="12px"
            overflow="hidden"
            width="100%"
            pb={[6, 8, 10]}
          >
            {children}
          </Box>
          <Flex>
            <Button mt={8} variant="primaryBlue" as={Link} href="/blog">
              👈🏽 Back to blog
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </PageWrapper>
  );
}
