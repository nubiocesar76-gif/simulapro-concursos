import type { ClassificationEntry, RawQuestion, ValidationIssue } from "./types.ts";
import { REQUIRED_CLASSIFICATION_FIELDS } from "./types.ts";

export function parseJsonFile<T>(raw: string, label: string): { data?: T; issues: ValidationIssue[] } {
  try {
    return { data: JSON.parse(raw) as T, issues: [] };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      issues: [{ check: "json_invalido", detail: `${label}: JSON inválido — ${message}.` }],
    };
  }
}

export function assertClassificationArray(
  value: unknown,
  label: string,
): { entries?: ClassificationEntry[]; issues: ValidationIssue[] } {
  if (!Array.isArray(value)) {
    return {
      issues: [{ check: "json_invalido", detail: `${label}: esperado um array JSON.` }],
    };
  }

  const issues: ValidationIssue[] = [];
  const entries: ClassificationEntry[] = [];

  for (let i = 0; i < value.length; i++) {
    const item = value[i];
    if (typeof item !== "object" || item === null) {
      issues.push({
        check: "json_invalido",
        detail: `${label}: entrada ${i} não é um objeto.`,
      });
      continue;
    }

    const record = item as Record<string, unknown>;
    if (typeof record.question !== "number" || !Number.isFinite(record.question)) {
      issues.push({
        check: "numero_ausente",
        detail: `${label}: entrada ${i} sem campo "question" numérico.`,
      });
      continue;
    }

    entries.push({
      question: record.question,
      board: typeof record.board === "string" ? record.board : "",
      contest: typeof record.contest === "string" ? record.contest : "",
      position: typeof record.position === "string" ? record.position : "",
      subject: typeof record.subject === "string" ? record.subject : "",
      topic: typeof record.topic === "string" ? record.topic : "",
      year: typeof record.year === "string" ? record.year : "",
      difficulty: typeof record.difficulty === "string" ? record.difficulty : "",
      keywords: Array.isArray(record.keywords)
        ? record.keywords.filter((k): k is string => typeof k === "string")
        : [],
      explanation: typeof record.explanation === "string" ? record.explanation : "",
    });
  }

  return { entries, issues };
}

/** Detecta números repetidos ou ausentes num conjunto de questões. */
export function validateQuestionNumbering(
  numbers: number[],
  label: string,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const seen = new Map<number, number>();

  for (const n of numbers) {
    seen.set(n, (seen.get(n) ?? 0) + 1);
  }

  const duplicates = [...seen.entries()].filter(([, count]) => count > 1).map(([n]) => n);
  if (duplicates.length > 0) {
    issues.push({
      check: "numero_repetido",
      detail: `${label}: número(s) repetido(s): ${duplicates.sort((a, b) => a - b).join(", ")}.`,
    });
    issues.push({
      check: "questao_duplicada",
      detail: `${label}: questão(ões) duplicada(s) nos números ${duplicates.sort((a, b) => a - b).join(", ")}.`,
    });
  }

  if (numbers.length === 0) return issues;

  const sorted = [...new Set(numbers)].sort((a, b) => a - b);
  const missing: number[] = [];
  for (let expected = sorted[0]; expected <= sorted[sorted.length - 1]; expected++) {
    if (!seen.has(expected)) missing.push(expected);
  }
  if (missing.length > 0) {
    issues.push({
      check: "numero_ausente",
      detail: `${label}: número(s) ausente(s) na sequência: ${missing.join(", ")}.`,
    });
  }

  return issues;
}

export function validateRawQuestions(questions: RawQuestion[]): ValidationIssue[] {
  return validateQuestionNumbering(
    questions.map((q) => q.number),
    "questions.raw.json",
  );
}

export function validateClassificationEntries(entries: ClassificationEntry[]): ValidationIssue[] {
  return validateQuestionNumbering(
    entries.map((e) => e.question),
    "classification.template.json",
  );
}

/** Confere correspondência 1:1 entre raw e classificação (mesma quantidade e numeração). */
export function validateRawClassificationAlignment(
  raw: RawQuestion[],
  classifications: ClassificationEntry[],
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  issues.push(...validateRawQuestions(raw));
  issues.push(...validateClassificationEntries(classifications));

  if (raw.length !== classifications.length) {
    issues.push({
      check: "classificacao_ausente",
      detail:
        `Quantidade divergente: ${raw.length} questão(ões) em questions.raw.json, ` +
        `${classifications.length} entrada(s) em classification.template.json.`,
    });
  }

  const rawByNumber = new Map(raw.map((q) => [q.number, q]));
  const classByNumber = new Map(classifications.map((c) => [c.question, c]));

  for (const q of raw) {
    if (!classByNumber.has(q.number)) {
      issues.push({
        check: "classificacao_ausente",
        detail: `Questão ${q.number}: presente em questions.raw.json mas sem entrada correspondente em classification.template.json.`,
      });
    }
  }

  for (const c of classifications) {
    if (!rawByNumber.has(c.question)) {
      issues.push({
        check: "classificacao_ausente",
        detail: `Questão ${c.question}: presente em classification.template.json mas ausente em questions.raw.json.`,
      });
    }
  }

  return issues;
}

export function validateRequiredClassificationFields(
  classifications: ClassificationEntry[],
  rawByNumber: Map<number, RawQuestion>,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  for (const entry of classifications) {
    const raw = rawByNumber.get(entry.question);
    if (!raw || raw.status === "ANULADA") continue;

    for (const field of REQUIRED_CLASSIFICATION_FIELDS) {
      const value = entry[field];
      if (typeof value !== "string" || value.trim() === "") {
        issues.push({
          check: "campo_obrigatorio_vazio",
          detail: `Questão ${entry.question}: campo obrigatório "${field}" está vazio.`,
        });
      }
    }
  }

  return issues;
}
