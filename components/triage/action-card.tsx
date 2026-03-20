"use client";

import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  TrendingUp,
  MessageCircle,
  Trash2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Check,
  AlertCircle,
} from "lucide-react";
import { TriageItemWithThread } from "@/lib/types/triage";
import { markTriageResolved } from "@/app/actions";
import { useState, useId } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";

interface ActionCardProps {
  item: TriageItemWithThread;
}

const actionConfig = {
  respond: {
    icon: MessageCircle,
    label: "Respond",
    color: "var(--respond)",
    mutedColor: "var(--respond-muted)",
  },
  amplify: {
    icon: TrendingUp,
    label: "Amplify",
    color: "var(--amplify)",
    mutedColor: "var(--amplify-muted)",
  },
  delete: {
    icon: Trash2,
    label: "Delete",
    color: "var(--action-delete)",
    mutedColor: "var(--action-delete-muted)",
  },
};

export function ActionCard({ item }: ActionCardProps) {
  const [isResolving, setIsResolving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAiTriage, setShowAiTriage] = useState(false);
  const router = useRouter();
  const aiTriageId = useId();

  const config = actionConfig[item.action.type];
  const ActionIcon = config.icon;

  const getPriorityInfo = (priority: number) => {
    if (priority <= 2)
      return { text: "Critical", color: "var(--priority-critical)" };
    if (priority === 3)
      return { text: "Normal", color: "var(--priority-normal)" };
    return { text: "Low", color: "var(--priority-low)" };
  };

  const priorityInfo = getPriorityInfo(item.action.priority);

  const handleMarkResolved = async () => {
    setIsResolving(true);
    setError(null);
    try {
      await markTriageResolved(item.id);
      router.refresh();
    } catch (err) {
      console.error("Failed to mark as resolved:", err);
      setError(
        err instanceof Error ? err.message : "Failed to mark as resolved",
      );
      setIsResolving(false);
    }
  };

  const cardTitleId = `card-title-${item.id}-${item.action.type}`;

  return (
    <article
      className="group relative rounded-lg border border-border/50 bg-card overflow-hidden transition-colors duration-200 hover:border-border"
      aria-labelledby={cardTitleId}
    >
      {/* Left accent */}
      <div
        className="absolute left-0 top-0 bottom-0 w-0.5"
        style={{ background: `hsl(${config.color})` }}
        aria-hidden="true"
      />

      {/* Header */}
      <div className="pl-5 pr-5 pt-5 pb-0">
        <div className="flex items-center gap-2 mb-2.5 flex-wrap text-xs">
          <span
            className="inline-flex items-center gap-1 font-semibold uppercase tracking-wider"
            style={{ color: `hsl(${config.color})` }}
          >
            <ActionIcon className="h-3 w-3" aria-hidden="true" />
            {config.label}
          </span>

          <span className="text-border/60" aria-hidden="true">
            /
          </span>

          <span
            className="inline-flex items-center gap-1 font-medium"
            style={{ color: `hsl(${priorityInfo.color})` }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full shrink-0"
              style={{ background: `hsl(${priorityInfo.color})` }}
              aria-hidden="true"
            />
            P{item.action.priority} {priorityInfo.text}
          </span>

          <span className="text-border/60" aria-hidden="true">
            /
          </span>

          <span className="text-muted-foreground">
            <span className="font-medium text-foreground/70">
              {item.thread.author}
            </span>
          </span>

          {item.ai_suggested_reply && (
            <>
              <span className="text-border/60" aria-hidden="true">
                /
              </span>
              <span
                className="inline-flex items-center gap-1 font-medium text-primary"
              >
                <Sparkles className="h-3 w-3" aria-hidden="true" />
                AI triaged
              </span>
            </>
          )}
        </div>

        {/* Title */}
        <h3
          id={cardTitleId}
          className="text-base font-semibold leading-snug mb-1"
        >
          {item.thread.title}
        </h3>

        <code className="text-[11px] text-muted-foreground/50 font-mono">
          {item.thread.thread_key}
        </code>
      </div>

      {/* Content */}
      <div className="px-5 pb-5 space-y-4 mt-4">
        <div>
          <h4 className="sr-only">Summary</h4>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {item.action.summary}
          </p>
        </div>

        {/* Suggested Reply */}
        {item.action.suggested_reply && (
          <div
            className="rounded-md border border-border/30 p-4"
            style={{ background: `hsl(${config.mutedColor})` }}
          >
            <h4 className="text-[11px] font-semibold uppercase tracking-wider mb-2 text-muted-foreground font-display">
              Suggested Reply
            </h4>
            <p className="text-sm italic leading-relaxed text-foreground/80">
              &ldquo;{item.action.suggested_reply}&rdquo;
            </p>
          </div>
        )}

        {/* Target */}
        {item.action.target && (
          <div className="text-sm">
            <span className="font-medium">Target: </span>
            <span className="text-muted-foreground">{item.action.target}</span>
          </div>
        )}

        {/* Evidence */}
        {item.action.evidence && item.action.evidence.length > 0 && (
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-wider mb-2 text-muted-foreground font-display">
              Evidence
            </h4>
            <ul
              className="space-y-1.5"
              aria-label="Evidence supporting this action"
            >
              {item.action.evidence.map((evidence, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2.5 text-sm text-muted-foreground"
                >
                  <span
                    className="h-1 w-1 rounded-full bg-muted-foreground/30 mt-[7px] shrink-0"
                    aria-hidden="true"
                  />
                  {evidence}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* AI Triage — collapsible */}
        {item.ai_suggested_reply && (
          <div className="border-t border-border/30 pt-4">
            <button
              onClick={() => setShowAiTriage(!showAiTriage)}
              className="flex items-center gap-2 text-sm font-medium w-full text-left rounded-md px-3 py-2 -mx-3 hover:bg-muted/50 transition-colors"
              aria-expanded={showAiTriage}
              aria-controls={aiTriageId}
            >
              <Sparkles
                className="h-4 w-4 shrink-0 text-primary"
                aria-hidden="true"
              />
              <span>Related Threads</span>
              {showAiTriage ? (
                <ChevronUp
                  className="h-4 w-4 ml-auto shrink-0"
                  aria-hidden="true"
                />
              ) : (
                <ChevronDown
                  className="h-4 w-4 ml-auto shrink-0"
                  aria-hidden="true"
                />
              )}
            </button>

            {showAiTriage && (
              <div
                id={aiTriageId}
                className="mt-3 animate-expand"
                role="region"
                aria-label="Related threads content"
              >
                <div className="rounded-md bg-muted/30 border border-border/30 p-4 prose prose-sm dark:prose-invert max-w-none prose-p:my-2 prose-ol:my-2 prose-li:my-1 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:font-semibold">
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
              </div>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive"
          >
            <AlertCircle
              className="h-4 w-4 shrink-0 mt-0.5"
              aria-hidden="true"
            />
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-1">
          <Button variant="outline" size="sm" asChild className="rounded-md">
            <a
              href={item.thread.external_activity_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink
                className="h-3.5 w-3.5 mr-1.5"
                aria-hidden="true"
              />
              View Thread
            </a>
          </Button>
          <Button
            size="sm"
            onClick={handleMarkResolved}
            disabled={isResolving}
            className="rounded-md sb-btn-glow"
            aria-busy={isResolving}
          >
            {isResolving ? (
              <>
                <span
                  className="h-3.5 w-3.5 mr-1.5 animate-spin rounded-full border-2 border-current border-t-transparent"
                  aria-hidden="true"
                />
                Resolving&hellip;
              </>
            ) : (
              <>
                <Check
                  className="h-3.5 w-3.5 mr-1.5"
                  aria-hidden="true"
                />
                Resolve
              </>
            )}
          </Button>
        </div>
      </div>
    </article>
  );
}
