export type ActionType = 'respond' | 'amplify' | 'delete';

export interface Action {
  type: ActionType;
  priority: number;
  summary: string;
  suggested_reply?: string;
  target?: string;
  evidence: string[];
}

export interface TriageItemWithThread {
  id: string;
  thread_id: string;
  status: 'open' | 'resolved' | 'dismissed';
  analyzed_at: string;
  action: Action;
  thread: {
    title: string;
    thread_key: string;
    external_activity_url: string;
    author: string;
    labels: string[];
    sentiment: string;
  };
}
