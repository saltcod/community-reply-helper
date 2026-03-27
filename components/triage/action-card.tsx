"use client";

import { Button } from "@/components/ui/button";
import {
  Check,
  AlertCircle,
  Github,
} from "lucide-react";
import { TriageItemWithThread } from "@/lib/types/triage";
import { getThreadExternalUrl } from "@/lib/triage/url";
import { markTriageResolved } from "@/app/actions";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface ActionCardProps {
  item: TriageItemWithThread;
}

export function ActionCard({ item }: ActionCardProps) {
  const [isResolving, setIsResolving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const isCritical = item.action.priority <= 2;
  const threadUrl = getThreadExternalUrl(
    item.thread.thread_key,
    item.thread.external_activity_url,
  );

  const timeAgo = formatRelativeTime(item.thread.first_msg_time ?? item.analyzed_at);
  const sourceLabel = formatSourceLabel(item.thread.source ?? "unknown");
  const sourceBadge = getSourceBadge(sourceLabel);
  const metaTags = getMetaTags(item);

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
    <article className="group relative transition-colors duration-150 hover:bg-muted/70">
      <div className="flex items-center gap-3 px-3 py-3 pr-10">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold ${sourceBadge.className}`}
          aria-label={sourceLabel}
          title={sourceLabel}
        >
          <SourceBadgeIcon source={item.thread.source} fallback={sourceBadge.label} />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold leading-snug text-foreground">
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

          <div className="mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-muted-foreground">
            <span>{timeAgo}</span>
            {isCritical && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-medium text-destructive">Critical</span>
              </>
            )}
            {metaTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border bg-background px-2 py-px text-[10px] font-medium uppercase tracking-wide text-foreground/75"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleMarkResolved}
          disabled={isResolving}
          className="h-6 w-6 rounded-full p-0 text-muted-foreground hover:text-foreground"
          aria-busy={isResolving}
          aria-label={isResolving ? "Resolving" : "Resolve"}
        >
          {isResolving ? (
            <span
              className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent"
              aria-hidden="true"
            />
          ) : (
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
          )}
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="mx-3 mb-2 flex items-start gap-2 rounded-md bg-destructive/10 border border-destructive/20 p-2.5 text-xs text-destructive"
        >
          <AlertCircle
            className="h-3.5 w-3.5 shrink-0 mt-px"
            aria-hidden="true"
          />
          {error}
        </div>
      )}
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

function formatSourceLabel(source: string) {
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

function getMetaTags(item: TriageItemWithThread) {
  const labels = item.thread.labels ?? [];
  return labels
    .filter(Boolean)
    .slice(0, 3)
    .map((label) => label.replace(/[_-]/g, " "));
}

function getSourceBadge(sourceLabel: string) {
  const normalized = sourceLabel.toLowerCase();

  if (normalized.includes("reddit")) {
    return { label: "R", className: "border-0 bg-muted text-orange-500" };
  }

  if (normalized.includes("github")) {
    return { label: "G", className: "border-0 bg-muted text-foreground" };
  }

  if (normalized.includes("discord")) {
    return { label: "D", className: "border-0 bg-muted text-indigo-500" };
  }

  return {
    label: sourceLabel.charAt(0).toUpperCase(),
    className: "border-0 bg-muted text-foreground/75",
  };
}

function SourceBadgeIcon({
  source,
  fallback,
}: {
  source: string | null;
  fallback: string;
}) {
  const normalized = source?.toLowerCase();

  if (normalized === "github") {
    return <Github className="h-5 w-5" aria-hidden="true" />;
  }

  if (normalized === "reddit") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5 fill-current"
        aria-hidden="true"
      >
        <path d="M14.37 15.88c.19.2.19.52 0 .72-.61.6-1.49.9-2.37.9-.88 0-1.76-.3-2.37-.9a.52.52 0 0 1 0-.72.49.49 0 0 1 .71 0c.91.9 2.41.9 3.32 0 .2-.2.52-.2.71 0Zm-3.87-2.36a1.11 1.11 0 1 0 0-2.22 1.11 1.11 0 0 0 0 2.22Zm3 0a1.11 1.11 0 1 0 0-2.22 1.11 1.11 0 0 0 0 2.22Zm8.5-1.47a2.17 2.17 0 0 0-3.7-1.53c-1.5-1.02-3.58-1.67-5.87-1.74l1-4.72 3.28.7a1.69 1.69 0 1 0 .1-1.03l-3.62-.77a.5.5 0 0 0-.59.38l-1.13 5.34c-2.34.05-4.47.7-5.99 1.74a2.16 2.16 0 1 0-2.67 3.35c-.02.16-.03.33-.03.5 0 3.11 3.59 5.64 8 5.64s8-2.53 8-5.64c0-.17-.01-.34-.03-.5A2.17 2.17 0 0 0 22 12.05Z" />
      </svg>
    );
  }

  if (normalized === "discord") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5 fill-current"
        aria-hidden="true"
      >
        <path d="M20.32 4.37A18.14 18.14 0 0 0 15.8 3a.08.08 0 0 0-.09.04c-.2.37-.42.86-.58 1.25a16.67 16.67 0 0 0-5.07 0 12.64 12.64 0 0 0-.59-1.25A.08.08 0 0 0 9.38 3a18.1 18.1 0 0 0-4.53 1.37.07.07 0 0 0-.03.03C1.93 8.7 1.13 12.9 1.52 17.05a.08.08 0 0 0 .03.06 18.29 18.29 0 0 0 5.56 2.81.08.08 0 0 0 .09-.03c.43-.58.81-1.2 1.15-1.85a.08.08 0 0 0-.04-.11 12.04 12.04 0 0 1-1.74-.83.08.08 0 0 1-.01-.13c.12-.09.24-.18.35-.27a.08.08 0 0 1 .08-.01c3.65 1.67 7.6 1.67 11.2 0a.08.08 0 0 1 .09.01c.11.09.23.18.35.27a.08.08 0 0 1-.01.13c-.55.32-1.13.6-1.74.83a.08.08 0 0 0-.04.11c.35.65.73 1.27 1.15 1.85a.08.08 0 0 0 .09.03 18.23 18.23 0 0 0 5.56-2.81.08.08 0 0 0 .03-.06c.46-4.8-.77-8.96-3.3-12.65a.06.06 0 0 0-.03-.03ZM9.12 14.52c-1.1 0-2-.99-2-2.2 0-1.22.88-2.2 2-2.2 1.11 0 2 .99 2 2.2 0 1.21-.89 2.2-2 2.2Zm5.76 0c-1.1 0-2-.99-2-2.2 0-1.22.88-2.2 2-2.2 1.11 0 2 .99 2 2.2 0 1.21-.89 2.2-2 2.2Z" />
      </svg>
    );
  }

  return <span>{fallback}</span>;
}
