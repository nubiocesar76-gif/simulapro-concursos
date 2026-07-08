import { readFileSync } from "node:fs";
import { extname } from "node:path";
import * as XLSX from "xlsx";
import { OPTIONAL_COLUMNS, REQUIRED_COLUMNS } from "./columns.ts";

export type RawRow = Record<string, string>;

function normalizeKey(key: string) {
  return key.trim().toLowerCase().replace(/\s+/g, "_");
}

export function normalizeRow(raw: Record<string, unknown>): RawRow {
  const row: RawRow = {};
  for (const [key, value] of Object.entries(raw)) {
    row[normalizeKey(key)] = String(value ?? "").trim();
  }
  return row;
}

function readWorkbook(path: string) {
  const ext = extname(path).toLowerCase();
  if (ext === ".csv") {
    const text = readFileSync(path, "utf8").replace(/^\uFEFF/, "");
    return XLSX.read(text, { type: "string" });
  }
  return XLSX.read(readFileSync(path), { type: "buffer" });
}

export function readSpreadsheet(path: string): RawRow[] {
  const workbook = readWorkbook(path);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  if (!sheet) throw new Error("Planilha vazia ou sem abas.");

  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });
  return rows.map(normalizeRow).filter((row) => Object.values(row).some((value) => value.length > 0));
}

export function detectMissingColumns(rows: RawRow[]): string[] {
  if (!rows.length) return [...REQUIRED_COLUMNS];

  const keys = new Set(Object.keys(rows[0]));
  return REQUIRED_COLUMNS.filter((column) => !keys.has(column));
}

export function listKnownColumns() {
  return [...REQUIRED_COLUMNS, ...OPTIONAL_COLUMNS];
}
