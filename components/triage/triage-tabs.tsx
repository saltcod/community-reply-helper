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
  aiTriagedCount: number;
  criticalCount: number;
}

export function TriageTabs({
  amplifyItems,
  respondItems,
  deleteItems,
  filter,
  onFilterChange,
  onFilterReset,
  aiTriagedCount,
  criticalCount,
}: TriageTabsProps) {
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
        {filter
          ? `No matching ${type} items.`
          : `No ${type} actions at this time.`}
      </p>
      {filter && (
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
    <div className="space-y-2" role="list" aria-label="Triage items">
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

        {/* Filter pills */}
        <div className="flex items-center gap-1.5">
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
