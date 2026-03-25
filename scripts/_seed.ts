import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { parse } from "csv-parse/sync";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import type { Database, Json } from "../lib/types/database";

dotenv.config({ path: join(process.cwd(), ".env.local") });
dotenv.config({ path: join(process.cwd(), ".env.prod"), override: false });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey =
  process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY",
  );
}

export const supabase = createClient<Database>(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export const seedDir = join(process.cwd(), "lib", "seed");

export type ThreadInsert = Database["public"]["Tables"]["contribute_threads"]["Insert"];
export type TriageInsert = Database["public"]["Tables"]["contribute_thread_triage"]["Insert"];

export function resolveSeedPath(fileName: string) {
  return join(seedDir, fileName);
}

export function seedFileExists(fileName: string) {
  return existsSync(resolveSeedPath(fileName));
}

export function readJsonFile<T>(fileName: string): T {
  return JSON.parse(readFileSync(resolveSeedPath(fileName), "utf-8")) as T;
}

export function readCsvFile(fileName: string): Record<string, string>[] {
  return parse(readFileSync(resolveSeedPath(fileName), "utf-8"), {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as Record<string, string>[];
}

export function nullIfBlank(value: unknown) {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

export function parseJson(value: unknown): Json | null {
  const normalized = nullIfBlank(value);
  if (normalized === null) {
    return null;
  }

  if (typeof normalized !== "string") {
    return normalized as Json;
  }

  return JSON.parse(normalized) as Json;
}

export function parseStringArray(value: unknown): string[] | null {
  const parsed = parseJson(value);
  if (parsed === null) {
    return null;
  }
  if (!Array.isArray(parsed)) {
    throw new Error(`Expected JSON array, got ${typeof parsed}`);
  }
  return parsed.map((item) => String(item));
}

export function parseNumber(value: unknown): number | null {
  const normalized = nullIfBlank(value);
  if (normalized === null) {
    return null;
  }
  const parsed = Number(normalized);
  if (Number.isNaN(parsed)) {
    throw new Error(`Invalid number value: ${String(value)}`);
  }
  return parsed;
}

export function parseTimestamp(value: unknown): string | null {
  const normalized = nullIfBlank(value);
  return normalized === null ? null : String(normalized);
}

export function parseVector(value: unknown): string | null {
  const normalized = nullIfBlank(value);
  if (normalized === null) {
    return null;
  }
  return typeof normalized === "string"
    ? normalized
    : JSON.stringify(normalized);
}

export function compact<T extends Record<string, unknown>>(record: T): T {
  return Object.fromEntries(
    Object.entries(record).filter(([, value]) => value !== undefined),
  ) as T;
}

export async function upsertInBatches(
  table: "contribute_threads",
  rows: ThreadInsert[],
  onConflict: string,
  batchSize?: number,
): Promise<void>;
export async function upsertInBatches(
  table: "contribute_thread_triage",
  rows: TriageInsert[],
  onConflict: string,
  batchSize?: number,
): Promise<void>;
export async function upsertInBatches(
  table: "contribute_threads" | "contribute_thread_triage",
  rows: ThreadInsert[] | TriageInsert[],
  onConflict: string,
  batchSize = 100,
) {
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const { error } = table === "contribute_threads"
      ? await supabase.from(table).upsert(batch as ThreadInsert[], {
          onConflict,
          ignoreDuplicates: false,
        })
      : await supabase.from(table).upsert(batch as TriageInsert[], {
          onConflict,
          ignoreDuplicates: false,
        });

    if (error) {
      throw new Error(
        `Failed to upsert ${table} batch ${Math.floor(i / batchSize) + 1}: ${error.message}`,
      );
    }
  }
}
