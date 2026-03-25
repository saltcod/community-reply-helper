import {
  compact,
  parseJson,
  parseNumber,
  parseStringArray,
  parseTimestamp,
  parseVector,
  readCsvFile,
  readJsonFile,
  seedFileExists,
  upsertInBatches,
  type ThreadInsert,
} from "./_seed";

function normalizeThreadRecord(record: Record<string, unknown>): ThreadInsert {
  return compact({
    id: record.id ? String(record.id) : undefined,
    thread_id: String(record.thread_id),
    author: String(record.author),
    title: String(record.title),
    conversation: String(record.conversation),
    external_activity_url: record.external_activity_url
      ? String(record.external_activity_url)
      : null,
    message_count: parseNumber(record.message_count),
    first_msg_time: parseTimestamp(record.first_msg_time),
    last_msg_time: parseTimestamp(record.last_msg_time),
    topic: record.topic ? String(record.topic) : null,
    subject: record.subject ? String(record.subject) : null,
    category: record.category ? String(record.category) : null,
    sub_category: record.sub_category ? String(record.sub_category) : null,
    product_areas: parseStringArray(record.product_areas),
    topic_embedding: parseVector(record.topic_embedding),
    subject_embedding: parseVector(record.subject_embedding),
    main_issue: record.main_issue ? String(record.main_issue) : null,
    issue_embedding: parseVector(record.issue_embedding),
    metadata: parseJson(record.metadata),
    topic_id: record.topic_id ? String(record.topic_id) : null,
    thread_key: record.thread_key ? String(record.thread_key) : null,
    summary: record.summary ? String(record.summary) : null,
    labels: parseStringArray(record.labels),
    entities: parseStringArray(record.entities),
    sentiment: record.sentiment ? String(record.sentiment) : null,
    status: record.status ? String(record.status) : null,
    resolved_by: record.resolved_by ? String(record.resolved_by) : null,
    created_at: parseTimestamp(record.created_at),
    updated_at: parseTimestamp(record.updated_at),
    processed_at: parseTimestamp(record.processed_at),
    source: record.source ? String(record.source) : null,
    stack: parseStringArray(record.stack),
    support_analyzed_at: parseTimestamp(record.support_analyzed_at),
    symptoms: parseStringArray(record.symptoms),
    proposed_solution: record.proposed_solution
      ? String(record.proposed_solution)
      : null,
  });
}

function loadThreadSeedData() {
  if (seedFileExists("contribute_threads.json")) {
    return readJsonFile<Record<string, unknown>[]>("contribute_threads.json");
  }

  if (seedFileExists("contribute_threads.csv")) {
    return readCsvFile("contribute_threads.csv");
  }

  throw new Error(
    "Missing lib/seed/contribute_threads.json or lib/seed/contribute_threads.csv",
  );
}

export async function seedContributeThreads() {
  const records = loadThreadSeedData().map(normalizeThreadRecord);
  console.log(`Seeding ${records.length} contribute_threads rows`);
  await upsertInBatches("contribute_threads", records, "thread_id");
  console.log("Finished seeding contribute_threads");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedContributeThreads().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
