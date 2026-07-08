import type { AcervoStats, CatalogExam, CatalogExamStatus } from "./types";

export const CATALOG_CSV_HEADERS = [
  "id",
  "status",
  "organization",
  "contest",
  "year",
  "board",
  "position",
  "questions",
  "pdf",
  "answer_key",
  "imported",
  "reviewed",
  "approved",
  "package",
  "observations",
  "verified",
  "pdf_available",
  "answer_key_available",
] as const;

function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (char === "," && !inQuotes) {
      fields.push(current);
      current = "";
      continue;
    }
    current += char;
  }
  fields.push(current);
  return fields;
}

function escapeCsvField(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function parseBool(value: string) {
  return value.trim().toLowerCase() === "true";
}

function parseYes(value: string) {
  return value.trim().toUpperCase() === "YES";
}

function rowToExam(headers: string[], row: string[]): CatalogExam | null {
  const record: Record<string, string> = {};
  headers.forEach((header, index) => {
    record[header] = row[index] ?? "";
  });

  const id = record.id?.trim();
  if (!id) return null;

  const status = (record.status?.trim() || "PLANNED") as CatalogExamStatus;
  const questions = Number(record.questions) || 0;
  const imported = parseBool(record.imported ?? "");
  const reviewed = parseBool(record.reviewed ?? "");
  const approved = parseBool(record.approved ?? "");
  const observations = record.observations?.trim() ?? "";

  return {
    catalogId: "",
    id,
    status,
    organization: record.organization?.trim() ?? "",
    contest: record.contest?.trim() ?? "",
    year: Number(record.year) || 0,
    board: record.board?.trim() ?? "",
    boardId: "",
    position: record.position?.trim() ?? "",
    positionId: "",
    questions,
    importedQuestions: imported ? questions : 0,
    approvedQuestions: approved ? questions : 0,
    publishedQuestions: status === "PUBLISHED" ? questions : 0,
    pdf: record.pdf?.trim() ?? "",
    answerKey: record.answer_key?.trim() ?? "",
    storageFolder: id,
    notes: observations,
    imported,
    reviewed,
    approved,
    package: record.package?.trim() ?? "",
    observations,
    verified: parseYes(record.verified ?? ""),
    pdfAvailable: parseYes(record.pdf_available ?? ""),
    answerKeyAvailable: parseYes(record.answer_key_available ?? ""),
  };
}

function examToRow(exam: CatalogExam): string[] {
  return [
    exam.id,
    exam.status,
    exam.organization,
    exam.contest,
    String(exam.year || ""),
    exam.board,
    exam.position,
    String(exam.questions),
    exam.pdf,
    exam.answerKey,
    String(exam.imported),
    String(exam.reviewed),
    String(exam.approved),
    exam.package,
    exam.observations,
    exam.verified ? "YES" : "",
    exam.pdfAvailable ? "YES" : "",
    exam.answerKeyAvailable ? "YES" : "",
  ];
}

export function parseCatalogCsv(content: string): CatalogExam[] {
  const lines = content.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];

  const headers = parseCsvLine(lines[0]).map((h) => h.trim());
  return lines
    .slice(1)
    .map((line) => parseCsvLine(line))
    .map((row) => rowToExam(headers, row))
    .filter((exam): exam is CatalogExam => exam !== null);
}

export function serializeCatalogCsv(exams: CatalogExam[]): string {
  const header = CATALOG_CSV_HEADERS.join(",");
  const rows = exams.map((exam) => examToRow(exam).map(escapeCsvField).join(","));
  return [header, ...rows].join("\n") + "\n";
}

export function computeAcervoStats(exams: CatalogExam[]): AcervoStats {
  return {
    totalExams: exams.length,
    publishedExams: exams.filter((exam) => exam.status === "PUBLISHED").length,
    importedQuestions: exams.reduce((sum, exam) => sum + exam.importedQuestions, 0),
    reviewedQuestions: exams.reduce((sum, exam) => sum + exam.approvedQuestions, 0),
  };
}
