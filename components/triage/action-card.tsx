"use client";

import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Check,
  AlertCircle,
  Copy,
} from "lucide-react";
import { TriageItemWithThread } from "@/lib/types/triage";
import { getThreadExternalUrl } from "@/lib/triage/url";
import { markTriageResolved } from "@/app/actions";
import { useState, useId } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";

interface ActionCardProps {
  item: TriageItemWithThread;
}

const accentColors = {
  respond: "var(--respond)",
  amplify: "var(--amplify)",
  delete: "var(--action-delete)",
};

export function ActionCard({ item }: ActionCardProps) {
  const [isResolving, setIsResolving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const detailsId = useId();

  const accent = accentColors[item.action.type];
  const isCritical = item.action.priority <= 2;
  const threadUrl = getThreadExternalUrl(
    item.thread.thread_key,
    item.thread.external_activity_url,
  );

  const hasDetails =
    item.action.target ||
    (item.action.evidence && item.action.evidence.length > 0) ||
    item.ai_suggested_reply;

  const userMessage = getUserMessage(item);
  const sourceLabel = formatSourceLabel(item.thread.source);
  const timeAgo = formatRelativeTime(item.thread.first_msg_time ?? item.analyzed_at);

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

  const handleCopySuggestedReply = async () => {
    if (!item.action.suggested_reply) {
      return;
    }

    try {
      await navigator.clipboard.writeText(item.action.suggested_reply);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy suggested reply:", err);
    }
  };

  return (
    <article className="group relative rounded-lg border border-border/50 bg-card overflow-hidden transition-colors duration-150 hover:border-border/80">
      {/* Left accent */}
      <div
        className="absolute left-0 top-0 bottom-0 w-0.5"
        style={{ background: `hsl(${accent})` }}
        aria-hidden="true"
      />

      <div className="pl-4 pr-4 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
              <span className="font-medium text-foreground/80">{sourceLabel}</span>
              <span aria-hidden="true">·</span>
              <span>{timeAgo}</span>
              <span aria-hidden="true">·</span>
              <span>by {item.thread.author}</span>
              {isCritical && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-medium text-destructive">P{item.action.priority}</span>
                </>
              )}
              {item.ai_suggested_reply && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1 text-primary">
                    <Sparkles className="h-3 w-3" aria-hidden="true" />
                    AI
                  </span>
                </>
              )}
            </div>

            <h3 className="text-base font-semibold leading-snug mb-1.5">
              {threadUrl ? (
                <a
                  href={threadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline underline-offset-2"
                >
                  {item.thread.title}
                </a>
              ) : (
                item.thread.title
              )}
            </h3>
            {userMessage && (
              <p className="text-sm text-foreground/80 leading-relaxed line-clamp-3">
                {userMessage}
              </p>
            )}
            <p className="mt-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              AI Summary
            </p>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {item.action.summary}
            </p>
            {item.action.suggested_reply && (
              <div className="mt-3 rounded-md border border-border/40 bg-muted/30 p-3">
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Suggested reply
                  </p>
                  <button
                    type="button"
                    onClick={handleCopySuggestedReply}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
                    aria-label="Copy suggested reply"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3 w-3" aria-hidden="true" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" aria-hidden="true" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <p className="text-sm italic text-foreground/80 leading-relaxed line-clamp-3">
                  &ldquo;{item.action.suggested_reply}&rdquo;
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
            <Button
              variant="ghost"
              size="sm"
              asChild={Boolean(threadUrl)}
              className="h-7 px-2 text-xs"
              disabled={!threadUrl}
            >
              {threadUrl ? (
                <a href={threadUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  <span className="sr-only sm:not-sr-only sm:ml-1">View</span>
                </a>
              ) : (
                <span>
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  <span className="sr-only sm:not-sr-only sm:ml-1">View</span>
                </span>
              )}
            </Button>
            <Button
              size="sm"
              onClick={handleMarkResolved}
              disabled={isResolving}
              className="h-7 px-2.5 text-xs rounded-md"
              aria-busy={isResolving}
            >
              {isResolving ? (
                <span
                  className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent"
                  aria-hidden="true"
                />
              ) : (
                <Check className="h-3 w-3" aria-hidden="true" />
              )}
              <span className="sr-only sm:not-sr-only sm:ml-1">
                {isResolving ? "..." : "Resolve"}
              </span>
            </Button>
          </div>
        </div>

        {hasDetails && (
          <div className="mt-3 flex justify-end">
            <button
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              aria-expanded={expanded}
              aria-controls={detailsId}
            >
              Details
              {expanded ? (
                <ChevronUp className="h-3 w-3" aria-hidden="true" />
              ) : (
                <ChevronDown className="h-3 w-3" aria-hidden="true" />
              )}
            </button>
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-md bg-destructive/10 border border-destructive/20 p-2.5 text-xs text-destructive mt-3"
          >
            <AlertCircle
              className="h-3.5 w-3.5 shrink-0 mt-px"
              aria-hidden="true"
            />
            {error}
          </div>
        )}

        {/* Expanded details */}
        {expanded && hasDetails && (
          <div
            id={detailsId}
            className="mt-3 pt-3 border-t border-border/30 space-y-3 animate-expand"
            role="region"
            aria-label="Thread details"
          >
            {/* Target */}
            {item.action.target && (
              <p className="text-sm">
                <span className="text-muted-foreground">Target: </span>
                {item.action.target}
              </p>
            )}

            {/* Evidence */}
            {item.action.evidence && item.action.evidence.length > 0 && (
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                  Evidence
                </p>
                <ul className="space-y-1">
                  {item.action.evidence.map((evidence, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
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

            {/* AI Triage */}
            {item.ai_suggested_reply && (
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" aria-hidden="true" />
                  Related threads
                </p>
                <div className="rounded-md bg-muted/30 border border-border/30 p-3 prose prose-sm dark:prose-invert max-w-none prose-p:my-1.5 prose-ol:my-1.5 prose-li:my-0.5 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:font-semibold">
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
      </div>
    </article>
  );
}

function getUserMessage(item: TriageItemWithThread) {
  const evidence = item.action.evidence?.filter(Boolean).map((line) => line.trim()) ?? [];
  if (evidence.length > 0) {
    return evidence.join(" ");
  }

  const target = item.action.target?.trim();
  if (target) {
    const match = target.match(/^.+? on [A-Z][a-z]{2} \d{1,2}, \d{4}, [0-9: ]+[AP]M: (.+)$/);
    return match?.[1]?.trim() || target;
  }

  const firstConversationLine = item.thread.conversation
    ?.split("\n")
    .map((line) => line.trim())
    .find(Boolean);

  if (!firstConversationLine) {
    return null;
  }

  const labeledLine = firstConversationLine.replace(/^(Target|Evidence|Summary):\s*/i, "");
  const colonIndex = labeledLine.indexOf(":");
  return colonIndex >= 0 ? labeledLine.slice(colonIndex + 1).trim() : labeledLine;
}

function formatSourceLabel(source: string | null) {
  if (!source) {
    return "Unknown";
  }

  return source
    .split(/[_-]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatRelativeTime(timestamp: string | null) {
  if (!timestamp) {
    return "Unknown time";
  }

  const date = new Date(timestamp);
  const diffMs = Date.now() - date.getTime();

  if (Number.isNaN(diffMs) || diffMs < 0) {
    return "Just now";
  }

  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < minute) {
    return "Just now";
  }

  if (diffMs < hour) {
    return `${Math.floor(diffMs / minute)}m ago`;
  }

  if (diffMs < day) {
    return `${Math.floor(diffMs / hour)}h ago`;
  }

  return `${Math.floor(diffMs / day)}d ago`;
}
