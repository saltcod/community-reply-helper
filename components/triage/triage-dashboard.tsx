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
}

export function TriageDashboard({
  amplifyItems,
  respondItems,
  deleteItems,
  aiTriagedCount,
  criticalCount,
}: TriageDashboardProps) {
  const [filter, setFilter] = useState<Filter>(null);

  const toggleFilter = (f: Filter) => {
    setFilter((prev) => (prev === f ? null : f));
  };

  const applyFilter = (items: TriageItemWithThread[]) => {
    if (filter === "ai_triaged")
      return items.filter((i) => i.ai_suggested_reply);
    if (filter === "critical")
      return items.filter((i) => i.action.priority <= 2);
    return items;
  };

  return (
    <TriageTabs
      amplifyItems={applyFilter(amplifyItems)}
      respondItems={applyFilter(respondItems)}
      deleteItems={applyFilter(deleteItems)}
      filter={filter}
      onFilterChange={toggleFilter}
      onFilterReset={() => setFilter(null)}
      aiTriagedCount={aiTriagedCount}
      criticalCount={criticalCount}
    />
  );
}
