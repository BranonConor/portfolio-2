"use client";

import { Flex, Box } from "@chakra-ui/react";
import { PageWrapper } from "@/components/PageWrapper";
import { PageHeading } from "@/components/PageHeading";
import { RetroCard } from "@/components/RetroCard";
import { RetroFilterPill } from "@/components/RetroFilterPill";
import { TopLevelListItem } from "@/components/TopLevelListItem";
import { useState } from "react";
import { mentoring, publicSpeaking } from "./consts";

const categories = [
  { key: "all", label: "All" },
  { key: "Public Speaking", label: "Public Speaking" },
  { key: "Mentoring", label: "Mentoring" },
];

const allEngagements = [...publicSpeaking, ...mentoring];

export default function Engagements() {
  const [currentFilter, setCurrentFilter] = useState("all");

  const filteredEngagements =
    currentFilter === "all"
      ? allEngagements
      : allEngagements.filter((e) => e.category === currentFilter);

  return (
    <PageWrapper>
      <Flex
        flexDirection="column"
        width="100%"
        alignItems="flex-start"
        justifyContent="flex-start"
      >
        <RetroCard>
          <Box p={5} pb={3} borderBottom="2px solid" borderBottomColor="brand.border">
            <PageHeading
              title="Engagements"
              subtitle="Showing up for the community."
            />
          </Box>

          {/* Filters */}
          <Flex flexWrap="wrap" alignItems="center" gap={2} px={5} pt={4} pb={4}>
            {categories.map((cat) => (
              <RetroFilterPill
                key={cat.key}
                label={cat.label}
                color="#22c55e"
                active={currentFilter === cat.key}
                onClick={() => setCurrentFilter(cat.key)}
              />
            ))}
          </Flex>

          {/* Engagement List */}
          <Flex
            flexDirection="column"
            width="100%"
            gap={0}
            px={5}
            pb={3}
            sx={{
              "& > *:first-of-type::after": { display: "none" },
              "& > *:hover + *::after": { transform: "scaleX(0)" },
            }}
          >
            {filteredEngagements.map((engagement) => (
              <TopLevelListItem
                key={engagement.title}
                href={engagement.link}
                title={engagement.title}
                accent="#22c55e"
                meta={`${engagement.category} · ${engagement.date}`}
              />
            ))}
          </Flex>
        </RetroCard>
      </Flex>
    </PageWrapper>
  );
}
