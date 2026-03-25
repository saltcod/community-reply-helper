"use client";

import { useState } from "react";
import { TriageItemWithThread } from "@/lib/types/triage";
import { TriageTabs } from "./triage-tabs";

export type Filter = null | "ai_triaged" | "critical";

interface TriageDashboardProps {
  amplifyItems: TriageItemWithThread[];
  respondItems: TriageItemWithThread[];
  deleteItems: TriageItemWithThread[];
  aiTriagedCount: number;
  criticalCount: number;
  platformCounts: Record<string, number>;
}

export function TriageDashboard({
  amplifyItems,
  respondItems,
  deleteItems,
  aiTriagedCount,
  criticalCount,
  platformCounts,
}: TriageDashboardProps) {
  const [filter, setFilter] = useState<Filter>(null);
  const [platformFilter, setPlatformFilter] = useState<string | null>(null);

  const toggleFilter = (f: Filter) => {
    setFilter((prev) => (prev === f ? null : f));
  };

  const togglePlatformFilter = (platform: string) => {
    setPlatformFilter((prev) => (prev === platform ? null : platform));
  };

  const applyFilter = (items: TriageItemWithThread[]) => {
    let filtered = items;

    if (filter === "ai_triaged") {
      filtered = filtered.filter((i) => i.ai_suggested_reply);
    }

    if (filter === "critical") {
      filtered = filtered.filter((i) => i.action.priority <= 2);
    }

    if (platformFilter) {
      filtered = filtered.filter(
        (i) => (i.thread.source ?? "unknown") === platformFilter,
      );
    }

    return filtered;
  };

  return (
    <TriageTabs
      amplifyItems={applyFilter(amplifyItems)}
      respondItems={applyFilter(respondItems)}
      deleteItems={applyFilter(deleteItems)}
      filter={filter}
      onFilterChange={toggleFilter}
      onFilterReset={() => {
        setFilter(null);
        setPlatformFilter(null);
      }}
      platformFilter={platformFilter}
      onPlatformFilterChange={togglePlatformFilter}
      aiTriagedCount={aiTriagedCount}
      criticalCount={criticalCount}
      platformCounts={platformCounts}
    />
  );
}
