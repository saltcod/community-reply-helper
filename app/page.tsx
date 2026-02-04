import { createClient } from "@/lib/supabase/server";
import { TriageTabs } from "@/components/triage/triage-tabs";
import {
  Action,
  SimilarSolvedThread,
  TriageItemWithThread,
} from "@/lib/types/triage";
import { Suspense } from "react";

async function TriageContent() {
  const supabase = await createClient();

  // Fetch triage items with thread details
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
      <p className="text-muted-foreground">
        Error loading triage items. Please try again later.
      </p>
    );
  }

  // Parse JSONB actions and categorize by type
  const amplifyItems: TriageItemWithThread[] = [];
  const respondItems: TriageItemWithThread[] = [];
  const deleteItems: TriageItemWithThread[] = [];

  if (triageItems) {
    for (const item of triageItems) {
      // Parse the actions JSONB field
      const actions = item.actions as Action[];

      if (Array.isArray(actions)) {
        // Process each action in the array
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

          // Categorize by action type
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

  // Sort each category by priority (ascending - priority 1 first)
  amplifyItems.sort((a, b) => a.action.priority - b.action.priority);
  respondItems.sort((a, b) => a.action.priority - b.action.priority);
  deleteItems.sort((a, b) => a.action.priority - b.action.priority);

  return (
    <>
      <p className="text-muted-foreground mb-6">
        Review and manage thread actions across Amplify, Respond, and Delete
        categories.
      </p>
      <TriageTabs
        amplifyItems={amplifyItems}
        respondItems={respondItems}
        deleteItems={deleteItems}
      />
    </>
  );
}

export default function TriagePage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <div className="py-6 font-bold text-2xl mb-4">Triage Dashboard</div>
        <Suspense
          fallback={
            <p className="text-muted-foreground">Loading triage items...</p>
          }
        >
          <TriageContent />
        </Suspense>
      </div>
    </div>
  );
}
