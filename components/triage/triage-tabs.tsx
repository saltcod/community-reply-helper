"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActionCard } from "./action-card";
import { TriageItemWithThread } from "@/lib/types/triage";
import {
  MessageCircle,
  TrendingUp,
  Trash2,
  Inbox,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { type Filter } from "./triage-dashboard";

interface TriageTabsProps {
  amplifyItems: TriageItemWithThread[];
  respondItems: TriageItemWithThread[];
  deleteItems: TriageItemWithThread[];
  filter: Filter;
  onFilterChange: (f: Filter) => void;
  onFilterReset: () => void;
  platformFilter: string | null;
  onPlatformFilterChange: (platform: string) => void;
  aiTriagedCount: number;
  criticalCount: number;
  platformCounts: Record<string, number>;
}

export function TriageTabs({
  amplifyItems,
  respondItems,
  deleteItems,
  filter,
  onFilterChange,
  onFilterReset,
  platformFilter,
  onPlatformFilterChange,
  aiTriagedCount,
  criticalCount,
  platformCounts,
}: TriageTabsProps) {
  const platforms = Object.entries(platformCounts ?? {}).sort((a, b) => {
    if (a[0] === "reddit") return -1;
    if (b[0] === "reddit") return 1;
    return a[0].localeCompare(b[0]);
  });

  const renderEmpty = (type: string) => (
    <div
      className="flex flex-col items-center justify-center py-20 text-center"
      role="status"
    >
      <div
        className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center mb-4"
        aria-hidden="true"
      >
        <Inbox className="h-4 w-4 text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground">
        {filter || platformFilter
          ? `No matching ${type} items.`
          : `No ${type} actions at this time.`}
      </p>
      {(filter || platformFilter) && (
        <button
          onClick={onFilterReset}
          className="mt-2 text-xs text-primary hover:underline"
        >
          Clear filter
        </button>
      )}
    </div>
  );

  const renderItems = (items: TriageItemWithThread[]) => (
    <div className="divide-y divide-border/60 rounded-lg border border-border/50 bg-muted/20 overflow-hidden" role="list" aria-label="Triage items">
      {items.map((item, index) => (
        <div
          key={`${item.id}-${item.action.type}-${index}`}
          role="listitem"
          className="animate-card-enter"
          style={{ animationDelay: `${Math.min(index * 40, 300)}ms` }}
        >
          <ActionCard item={item} />
        </div>
      ))}
    </div>
  );

  return (
    <Tabs defaultValue="respond" className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex-1 min-w-0">
          <TabsList
            variant="line"
            className="h-auto w-full sm:w-auto gap-0 border-b border-border/40 rounded-none p-0"
          >
            <TabsTrigger
              value="respond"
              className="rounded-none px-3 py-2 gap-1.5 text-sm"
            >
              <MessageCircle
                className="h-3.5 w-3.5 shrink-0"
                aria-hidden="true"
              />
              <span className="hidden sm:inline">Respond</span>
              <span className="text-xs tabular-nums text-muted-foreground ml-0.5">
                {respondItems.length}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="amplify"
              className="rounded-none px-3 py-2 gap-1.5 text-sm"
            >
              <TrendingUp
                className="h-3.5 w-3.5 shrink-0"
                aria-hidden="true"
              />
              <span className="hidden sm:inline">Amplify</span>
              <span className="text-xs tabular-nums text-muted-foreground ml-0.5">
                {amplifyItems.length}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="delete"
              className="rounded-none px-3 py-2 gap-1.5 text-sm"
            >
              <Trash2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="hidden sm:inline">Delete</span>
              <span className="text-xs tabular-nums text-muted-foreground ml-0.5">
                {deleteItems.length}
              </span>
            </TabsTrigger>
          </TabsList>

          {platforms.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              {platforms.map(([platform, count]) => (
                <button
                  key={platform}
                  onClick={() => onPlatformFilterChange(platform)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium capitalize transition-colors ${
                    platformFilter === platform
                      ? "border border-emerald-300 bg-emerald-50 text-emerald-700"
                      : "border border-border bg-background text-muted-foreground hover:text-foreground"
                  }`}
                  aria-pressed={platformFilter === platform}
                >
                  {platform}
                  <span className="tabular-nums">{count}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-center">
          <button
            onClick={() => onFilterChange("ai_triaged")}
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
              filter === "ai_triaged"
                ? "bg-primary/15 text-primary border border-primary/30"
                : "text-muted-foreground hover:text-foreground border border-transparent hover:border-border"
            }`}
            aria-pressed={filter === "ai_triaged"}
          >
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            AI
            <span className="tabular-nums">{aiTriagedCount}</span>
          </button>
          <button
            onClick={() => onFilterChange("critical")}
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
              filter === "critical"
                ? "bg-destructive/10 text-destructive border border-destructive/30"
                : "text-muted-foreground hover:text-foreground border border-transparent hover:border-border"
            }`}
            aria-pressed={filter === "critical"}
          >
            <AlertTriangle className="h-3 w-3" aria-hidden="true" />
            Critical
            <span className="tabular-nums">{criticalCount}</span>
          </button>
        </div>
      </div>

      <TabsContent value="respond" className="mt-0">
        {respondItems.length === 0
          ? renderEmpty("respond")
          : renderItems(respondItems)}
      </TabsContent>

      <TabsContent value="amplify" className="mt-0">
        {amplifyItems.length === 0
          ? renderEmpty("amplify")
          : renderItems(amplifyItems)}
      </TabsContent>

      <TabsContent value="delete" className="mt-0">
        {deleteItems.length === 0
          ? renderEmpty("delete")
          : renderItems(deleteItems)}
      </TabsContent>
    </Tabs>
  );
}
