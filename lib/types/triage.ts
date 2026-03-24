export type ActionType = "respond" | "amplify" | "delete";

export interface Action {
  type: ActionType;
  priority: number;
  summary: string;
  suggested_reply?: string;
  target?: string;
  evidence: string[];
}

export interface SimilarSolvedThread {
  thread_key: string;
  main_issue: string;
  proposed_solution: string;
  similarity: number;
  external_activity_url: string;
}

export interface TriageItemWithThread {
  id: string;
  thread_id: string;
  status: "open" | "resolved" | "dismissed";
  analyzed_at: string;
  action: Action;
  similar_solved_threads?: SimilarSolvedThread[];
  ai_suggested_reply?: string;
  thread: {
    title: string;
    thread_key: string;
    external_activity_url: string;
    author: string;
    labels: string[];
    sentiment: string;
  };
}
