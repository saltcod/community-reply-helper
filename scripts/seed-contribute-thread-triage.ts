import {
  compact,
  parseJson,
  parseTimestamp,
  readCsvFile,
  seedFileExists,
  supabase,
  upsertInBatches,
  type ThreadInsert,
  type TriageInsert,
} from "./_seed";

const TRIAGE_CSV = "contribute_thread_triage.csv";
const TRIAGE_STATUSES = new Set(["open", "resolved", "hidden", "dismissed"]);

type TriageAction = {
  type?: string;
  target?: string;
  summary?: string;
  evidence?: string[];
};

function normalizeTriageRecord(
  record: Record<string, string>,
): TriageInsert {
  const status = record.status?.trim() || "open";
  if (!TRIAGE_STATUSES.has(status)) {
    throw new Error(`Invalid triage status: ${status}`);
  }

  const actions = parseJson(record.actions);
  if (!actions) {
    throw new Error(`Missing actions for triage row ${record.id}`);
  }

  return compact({
    id: record.id || undefined,
    contribute_thread_id: record.contribute_thread_id,
    thread_key: record.thread_key,
    actions,
    status,
    analyzed_at: parseTimestamp(record.analyzed_at) ?? undefined,
    model_version: record.model_version,
    prompt_version: record.prompt_version,
    similar_solved_threads: parseJson(record.similar_solved_threads),
  });
}

async function seedThreadDependenciesIfAvailable() {
  if (
    !seedFileExists("contribute_threads.json") &&
    !seedFileExists("contribute_threads.csv")
  ) {
    return false;
  }

  const module = await import("./seed-contribute-threads");
  await module.seedContributeThreads();
  return true;
}

function parseActions(record: Record<string, string>): TriageAction[] {
  const actions = parseJson(record.actions);
  return Array.isArray(actions) ? (actions as TriageAction[]) : [];
}

function inferSource(threadKey: string) {
  return threadKey.split(":")[0] || null;
}

function inferThreadId(threadKey: string) {
  return threadKey.includes(":") ? threadKey.split(":").slice(1).join(":") : threadKey;
}

function inferAuthor(actions: TriageAction[]) {
  const target = actions.find((action) => action.target)?.target?.trim();
  if (!target) {
    return "unknown";
  }

  const match = target.match(/^(.+?) on [A-Z][a-z]{2} \d{1,2}, \d{4}/);
  return match?.[1]?.trim() || target.slice(0, 80);
}

function inferTitle(threadKey: string, actions: TriageAction[]) {
  const evidence = actions.flatMap((action) => action.evidence ?? []).find(Boolean)?.trim();
  const target = actions.find((action) => action.target)?.target?.trim();
  const summary = actions.find((action) => action.summary)?.summary?.trim();
  return evidence || target || summary || `Seeded thread for ${threadKey}`;
}

function inferConversation(actions: TriageAction[]) {
  const lines = actions.flatMap((action) => {
    const parts: string[] = [];
    if (action.target) {
      parts.push(`Target: ${action.target}`);
    }
    if (action.summary) {
      parts.push(`Summary: ${action.summary}`);
    }
    for (const evidence of action.evidence ?? []) {
      parts.push(`Evidence: ${evidence}`);
    }
    return parts;
  });

  return lines.join("\n") || "Seeded from triage CSV";
}

function buildPlaceholderThread(row: Record<string, string>): ThreadInsert {
  const actions = parseActions(row);
  const threadKey = row.thread_key;

  return compact({
    id: row.contribute_thread_id,
    thread_id: inferThreadId(threadKey),
    thread_key: threadKey,
    author: inferAuthor(actions),
    title: inferTitle(threadKey, actions),
    conversation: inferConversation(actions),
    source: inferSource(threadKey),
    status: row.status || "open",
    summary: actions.find((action) => action.summary)?.summary ?? null,
    external_activity_url: null,
  });
}

async function seedPlaceholderThreads(rows: Record<string, string>[], missingThreadIds: string[]) {
  const missingSet = new Set(missingThreadIds);
  const placeholders = rows
    .filter((row) => missingSet.has(row.contribute_thread_id))
    .map(buildPlaceholderThread);

  if (placeholders.length === 0) {
    return;
  }

  console.log(`Seeding ${placeholders.length} placeholder contribute_threads rows`);
  await upsertInBatches("contribute_threads", placeholders, "id");
}

async function findMissingThreadIds(threadIds: string[]) {
  const missing = new Set(threadIds);

  for (let i = 0; i < threadIds.length; i += 500) {
    const batch = threadIds.slice(i, i + 500);
    const { data, error } = await supabase
      .from("contribute_threads")
      .select("id")
      .in("id", batch);

    if (error) {
      throw new Error(`Failed to verify parent contribute_threads rows: ${error.message}`);
    }

    for (const row of data ?? []) {
      missing.delete(row.id);
    }
  }

  return [...missing];
}

async function seedContributeThreadTriage() {
  const rows = readCsvFile(TRIAGE_CSV);
  const dependencySeeded = await seedThreadDependenciesIfAvailable();

  const threadIds = [...new Set(rows.map((row) => row.contribute_thread_id).filter(Boolean))];
  let missingThreadIds = await findMissingThreadIds(threadIds);

  if (missingThreadIds.length > 0 && !dependencySeeded) {
    await seedPlaceholderThreads(rows, missingThreadIds);
    missingThreadIds = await findMissingThreadIds(threadIds);
  }

  if (missingThreadIds.length > 0) {
    const sample = missingThreadIds.slice(0, 10).join(", ");
    throw new Error(
      [
        dependencySeeded
          ? "The triage seed ran after seeding contribute_threads, but some referenced parent rows are still missing."
          : "Missing referenced contribute_threads rows. Add lib/seed/contribute_threads.json or lib/seed/contribute_threads.csv, or seed those parents first.",
        `Missing ${missingThreadIds.length} thread IDs.`,
        `Sample: ${sample}`,
      ].join(" "),
    );
  }

  const records = rows.map(normalizeTriageRecord);
  console.log(`Seeding ${records.length} contribute_thread_triage rows`);
  await upsertInBatches("contribute_thread_triage", records, "id");
  console.log("Finished seeding contribute_thread_triage");
}

seedContributeThreadTriage().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
