"use client";

import { useState } from "react";
import {
  MessageCircle,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { TriageItemWithThread } from "@/lib/types/triage";
import { TriageTabs } from "./triage-tabs";

type Filter = null | "ai_triaged" | "critical";

interface TriageDashboardProps {
  amplifyItems: TriageItemWithThread[];
  respondItems: TriageItemWithThread[];
  deleteItems: TriageItemWithThread[];
  totalItems: number;
  aiTriagedCount: number;
  criticalCount: number;
}

function StatCard({
  label,
  value,
  icon,
  accentVar,
  delay,
  active,
  onClick,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  accentVar: string;
  delay: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="animate-stat-enter rounded-lg border bg-card p-5 transition-all text-left w-full hover:border-border"
      style={{
        animationDelay: `${delay * 80}ms`,
        borderColor: active ? `hsl(${accentVar})` : undefined,
        boxShadow: active ? `0 0 0 1px hsl(${accentVar})` : undefined,
      }}
      aria-pressed={active}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span
          style={{ color: `hsl(${accentVar})` }}
          className="opacity-60"
          aria-hidden="true"
        >
          {icon}
        </span>
      </div>
      <p
        className="text-3xl font-display font-semibold tracking-tight tabular-nums"
        aria-label={`${value} ${label}`}
      >
        {value}
      </p>
    </button>
  );
}

export function TriageDashboard({
  amplifyItems,
  respondItems,
  deleteItems,
  totalItems,
  aiTriagedCount,
  criticalCount,
}: TriageDashboardProps) {
  const [filter, setFilter] = useState<Filter>(null);

  const toggleFilter = (f: Filter) => {
    setFilter((prev) => (prev === f ? null : f));
  };

  const applyFilter = (items: TriageItemWithThread[]) => {
    if (filter === "ai_triaged") return items.filter((i) => i.ai_suggested_reply);
    if (filter === "critical") return items.filter((i) => i.action.priority <= 2);
    return items;
  };

  return (
    <>
      <h2 className="sr-only">Overview</h2>
      <div
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10"
        role="region"
        aria-label="Triage statistics"
      >
        <StatCard
          label="Open threads"
          value={totalItems}
          icon={<MessageCircle className="h-4 w-4" />}
          accentVar="var(--respond)"
          delay={0}
          active={filter === null}
          onClick={() => setFilter(null)}
        />
        <StatCard
          label="AI triaged"
          value={aiTriagedCount}
          icon={<Sparkles className="h-4 w-4" />}
          accentVar="var(--amplify)"
          delay={1}
          active={filter === "ai_triaged"}
          onClick={() => toggleFilter("ai_triaged")}
        />
        <StatCard
          label="Critical"
          value={criticalCount}
          icon={<AlertTriangle className="h-4 w-4" />}
          accentVar="var(--action-delete)"
          delay={2}
          active={filter === "critical"}
          onClick={() => toggleFilter("critical")}
        />
      </div>

      <h2 className="sr-only">Actions</h2>
      <TriageTabs
        amplifyItems={applyFilter(amplifyItems)}
        respondItems={applyFilter(respondItems)}
        deleteItems={applyFilter(deleteItems)}
      />
    </>
  );
}
