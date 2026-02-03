"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  TrendingUp,
  MessageCircle,
  Trash2,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  List,
} from "lucide-react";
import { TriageItemWithThread } from "@/lib/types/triage";
import { markTriageResolved } from "@/app/protected/triage/actions";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";

interface ActionCardProps {
  item: TriageItemWithThread;
}

export function ActionCard({ item }: ActionCardProps) {
  const [isResolving, setIsResolving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAiTriage, setShowAiTriage] = useState(false);
  const [showRawThreads, setShowRawThreads] = useState(false);
  const router = useRouter();

  const similarThreads = item.similar_solved_threads || [];

  const getPriorityVariant = (priority: number) => {
    if (priority <= 2) return "destructive";
    if (priority === 3) return "default";
    return "secondary";
  };

  const getActionIcon = () => {
    switch (item.action.type) {
      case "amplify":
        return <TrendingUp className="h-4 w-4" />;
      case "respond":
        return <MessageCircle className="h-4 w-4" />;
      case "delete":
        return <Trash2 className="h-4 w-4" />;
    }
  };

  const handleMarkResolved = async () => {
    setIsResolving(true);
    setError(null);
    try {
      await markTriageResolved(item.id);
      router.refresh();
    } catch (error) {
      console.error("Failed to mark as resolved:", error);
      setError(
        error instanceof Error ? error.message : "Failed to mark as resolved",
      );
      setIsResolving(false);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {getActionIcon()}
              <CardTitle className="text-lg">{item.thread.title}</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={getPriorityVariant(item.action.priority)}>
                Priority {item.action.priority}
              </Badge>
              <span className="text-sm text-muted-foreground">
                by {item.thread.author}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium mb-1">Summary</p>
          <p className="text-sm text-muted-foreground">{item.action.summary}</p>
        </div>

        {item.action.suggested_reply && (
          <div>
            <p className="text-sm font-medium mb-1">Suggested Reply</p>
            <p className="text-sm text-muted-foreground italic">
              {item.action.suggested_reply}
            </p>
          </div>
        )}

        {item.action.target && (
          <div>
            <p className="text-sm font-medium mb-1">Target</p>
            <p className="text-sm text-muted-foreground">
              {item.action.target}
            </p>
          </div>
        )}

        {item.action.evidence && item.action.evidence.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-1">Evidence</p>
            <ul className="list-disc list-inside space-y-1">
              {item.action.evidence.map((evidence, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  {evidence}
                </li>
              ))}
            </ul>
          </div>
        )}

        {(item.ai_suggested_reply || similarThreads.length > 0) && (
          <div className="border-t pt-4">
            <button
              onClick={() => setShowAiTriage(!showAiTriage)}
              className="flex items-center gap-2 text-sm font-medium w-full text-left hover:text-primary transition-colors"
            >
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              <span>AI Triage</span>
              {showAiTriage ? (
                <ChevronUp className="h-4 w-4 ml-auto" />
              ) : (
                <ChevronDown className="h-4 w-4 ml-auto" />
              )}
            </button>
            {showAiTriage && (
              <div className="mt-3 space-y-4">
                {item.ai_suggested_reply && (
                  <div className="bg-muted/50 rounded-lg p-4 prose prose-sm dark:prose-invert max-w-none prose-p:my-2 prose-ol:my-2 prose-li:my-1 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:font-semibold">
                    <ReactMarkdown
                      components={{
                        a: ({ href, children }) => (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {children}
                          </a>
                        ),
                      }}
                    >
                      {item.ai_suggested_reply}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
            {error}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" asChild>
            <a
              href={item.thread.external_activity_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              View Thread
            </a>
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleMarkResolved}
            disabled={isResolving}
          >
            {isResolving ? "Marking..." : "Mark Resolved"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
