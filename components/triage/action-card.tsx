"use client";

import { Button } from "@/components/ui/button";
import {
  ExternalLink,
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

const accentColors = {
  respond: "var(--respond)",
  amplify: "var(--amplify)",
  delete: "var(--action-delete)",
};

export function ActionCard({ item }: ActionCardProps) {
  const [isResolving, setIsResolving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();
  const detailsId = useId();

  const accent = accentColors[item.action.type];
  const isCritical = item.action.priority <= 2;

  const hasDetails =
    item.action.suggested_reply ||
    item.action.target ||
    (item.action.evidence && item.action.evidence.length > 0) ||
    item.ai_suggested_reply;

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

  return (
    <article className="group relative rounded-lg border border-border/50 bg-card overflow-hidden transition-colors duration-150 hover:border-border/80">
      {/* Left accent */}
      <div
        className="absolute left-0 top-0 bottom-0 w-0.5"
        style={{ background: `hsl(${accent})` }}
        aria-hidden="true"
      />

      <div className="pl-4 pr-4 py-4">
        {/* Top row: title + actions */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold leading-snug mb-1 truncate">
              {item.thread.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {item.action.summary}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="h-7 px-2 text-xs"
            >
              <a
                href={item.thread.external_activity_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
                <span className="sr-only sm:not-sr-only sm:ml-1">View</span>
              </a>
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

        {/* Meta row */}
        <div className="flex items-center gap-2 mt-2.5 text-xs text-muted-foreground">
          <span className="text-foreground/60">{item.thread.author}</span>

          {isCritical && (
            <>
              <span className="text-border" aria-hidden="true">
                ·
              </span>
              <span className="text-destructive font-medium">
                P{item.action.priority}
              </span>
            </>
          )}

          {item.ai_suggested_reply && (
            <>
              <span className="text-border" aria-hidden="true">
                ·
              </span>
              <span className="inline-flex items-center gap-0.5 text-primary">
                <Sparkles className="h-3 w-3" aria-hidden="true" />
                AI
              </span>
            </>
          )}

          {/* Expand toggle */}
          {hasDetails && (
            <>
              <span className="flex-1" />
              <button
                onClick={() => setExpanded(!expanded)}
                className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
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
            </>
          )}
        </div>

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
            {/* Suggested Reply */}
            {item.action.suggested_reply && (
              <div className="rounded-md bg-muted/40 p-3">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                  Suggested reply
                </p>
                <p className="text-sm italic text-foreground/80 leading-relaxed">
                  &ldquo;{item.action.suggested_reply}&rdquo;
                </p>
              </div>
            )}

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
