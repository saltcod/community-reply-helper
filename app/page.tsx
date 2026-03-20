import { createClient } from "@/lib/supabase/server";
import { TriageDashboard } from "@/components/triage/triage-dashboard";
import {
  Action,
  SimilarSolvedThread,
  TriageItemWithThread,
} from "@/lib/types/triage";
import { Suspense } from "react";
import { AlertTriangle } from "lucide-react";

async function TriageContent() {
  const supabase = await createClient();

  const { data: triageItems, error } = await supabase
    .from("contribute_thread_triage")
    .select(
      `
      *,
      thread:contribute_threads(
        title,
        thread_key,
        external_activity_url,
        author,
        labels,
        sentiment
      )
    `,
    )
    .eq("status", "open")
    .order("analyzed_at", { ascending: false });

  if (error) {
    console.error("Error fetching triage items:", error);
    return (
      <div
        role="alert"
        className="rounded-lg border border-destructive/20 bg-destructive/5 p-8 text-center"
      >
        <AlertTriangle className="h-5 w-5 text-destructive mx-auto mb-3" />
        <p className="text-sm font-medium text-destructive">
          Error loading triage items. Please try again later.
        </p>
      </div>
    );
  }

  const amplifyItems: TriageItemWithThread[] = [];
  const respondItems: TriageItemWithThread[] = [];
  const deleteItems: TriageItemWithThread[] = [];

  if (triageItems) {
    for (const item of triageItems) {
      const actions = item.actions as Action[];
      if (Array.isArray(actions)) {
        for (const action of actions) {
          const enrichedItem: TriageItemWithThread = {
            id: item.id,
            thread_id: item.thread_id,
            status: item.status,
            analyzed_at: item.analyzed_at,
            action: action,
            similar_solved_threads: item.similar_solved_threads as
              | SimilarSolvedThread[]
              | undefined,
            ai_suggested_reply: item.ai_suggested_reply as string | undefined,
            thread: item.thread,
          };
          switch (action.type) {
            case "amplify":
              amplifyItems.push(enrichedItem);
              break;
            case "respond":
              respondItems.push(enrichedItem);
              break;
            case "delete":
              deleteItems.push(enrichedItem);
              break;
          }
        }
      }
    }
  }

  amplifyItems.sort((a, b) => a.action.priority - b.action.priority);
  respondItems.sort((a, b) => a.action.priority - b.action.priority);
  deleteItems.sort((a, b) => a.action.priority - b.action.priority);

  const allItems = [...amplifyItems, ...respondItems, ...deleteItems];
  const totalItems = allItems.length;
  const aiTriagedCount = allItems.filter((i) => i.ai_suggested_reply).length;
  const criticalCount = allItems.filter((i) => i.action.priority <= 2).length;

  return (
    <TriageDashboard
      amplifyItems={amplifyItems}
      respondItems={respondItems}
      deleteItems={deleteItems}
      totalItems={totalItems}
      aiTriagedCount={aiTriagedCount}
      criticalCount={criticalCount}
    />
  );
}


function LoadingSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading triage dashboard">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="rounded-lg border border-border/50 bg-card p-5 animate-pulse"
          >
            <div className="h-3 w-20 bg-muted rounded mb-5" />
            <div className="h-8 w-14 bg-muted rounded" />
          </div>
        ))}
      </div>
      <div className="h-10 bg-muted rounded-lg mb-6" />
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="rounded-lg border border-border/50 bg-card p-6 mb-3 animate-pulse"
        >
          <div className="h-3 w-32 bg-muted rounded mb-4" />
          <div className="h-5 w-3/4 bg-muted rounded mb-3" />
          <div className="h-3 w-full bg-muted rounded mb-2" />
          <div className="h-3 w-2/3 bg-muted rounded" />
        </div>
      ))}
    </div>
  );
}

export default function TriagePage() {
  return (
    <div className="w-full">
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-medium uppercase tracking-widest text-primary font-display">
            Dashboard
          </span>
        </div>
        <h1 className="text-3xl font-display font-semibold tracking-tight mb-2">
          Triage
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-xl">
          Review and manage community thread actions across Respond, Amplify,
          and Delete categories.
        </p>
      </div>
      <Suspense fallback={<LoadingSkeleton />}>
        <TriageContent />
      </Suspense>
    </div>
  );
}
