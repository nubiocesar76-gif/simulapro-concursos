import { test } from "node:test";
import assert from "node:assert/strict";
import type { ClassificationEntry, RawQuestion } from "./types.ts";
import { generateClassificationTemplate } from "./generate-template.ts";
import { mergeQuestionsToCsv } from "./merge-questions.ts";
import {
  validateRawClassificationAlignment,
  validateRequiredClassificationFields,
  validateQuestionNumbering,
} from "./validate-classification.ts";

function sampleRaw(overrides: Partial<RawQuestion> = {}): RawQuestion {
  return {
    number: 1,
    statement: "Enunciado?",
    alternatives: { A: "a", B: "b", C: "c", D: "d" },
    correctAnswer: "A",
    status: "VALID",
    page: 1,
    warnings: [],
    ...overrides,
  };
}

function filledClassification(question: number): ClassificationEntry {
  return {
    question,
    board: "FGV",
    contest: "SESACRE 2022",
    position: "Enfermeiro",
    subject: "Português",
    topic: "Interpretação",
    year: "2022",
    difficulty: "medio",
    keywords: ["literatura"],
    explanation: "Porque sim.",
  };
}

test("generateClassificationTemplate — uma entrada vazia por questão", () => {
  const raw = [sampleRaw({ number: 2 }), sampleRaw({ number: 1 })];
  const template = generateClassificationTemplate(raw);
  assert.equal(template.length, 2);
  assert.deepEqual(template[0], {
    question: 1,
    board: "",
    contest: "",
    position: "",
    subject: "",
    topic: "",
    year: "",
    difficulty: "",
    keywords: [],
    explanation: "",
  });
  assert.equal(template[1].question, 2);
});

test("validateQuestionNumbering — detecta repetido e ausente", () => {
  const issues = validateQuestionNumbering([1, 2, 2, 4], "teste");
  const checks = issues.map((i) => i.check);
  assert.ok(checks.includes("numero_repetido"));
  assert.ok(checks.includes("questao_duplicada"));
  assert.ok(checks.includes("numero_ausente"));
});

test("validateRawClassificationAlignment — exige correspondência 1:1", () => {
  const raw = [sampleRaw({ number: 1 }), sampleRaw({ number: 2 })];
  const classifications = [filledClassification(1)];
  const issues = validateRawClassificationAlignment(raw, classifications);
  assert.ok(issues.some((i) => i.check === "classificacao_ausente"));
});

test("mergeQuestionsToCsv — falha com campos obrigatórios vazios", () => {
  const raw = [sampleRaw()];
  const classifications = generateClassificationTemplate(raw);
  const { csv, issues } = mergeQuestionsToCsv(raw, classifications);
  assert.equal(csv, "");
  assert.ok(issues.some((i) => i.check === "campo_obrigatorio_vazio"));
});

test("mergeQuestionsToCsv — une raw + classificação preenchida", () => {
  const raw = [sampleRaw(), sampleRaw({ number: 2, status: "ANULADA", correctAnswer: null })];
  const classifications = [filledClassification(1), filledClassification(2)];
  const { csv, summary, issues } = mergeQuestionsToCsv(raw, classifications);
  assert.equal(issues.length, 0);
  assert.equal(summary.exported, 1);
  assert.equal(summary.skippedAnuladas, 1);
  assert.match(csv, /FGV/);
  assert.match(csv, /difficulty:medio/);
  assert.match(csv, /literatura/);
});

test("mergeQuestionsToCsv — preserva marcador REVIEW_REQUIRED", () => {
  const raw = [sampleRaw({ status: "REVIEW_REQUIRED", correctAnswer: null })];
  const classifications = [filledClassification(1)];
  const { csv } = mergeQuestionsToCsv(raw, classifications);
  assert.match(csv, /pipeline:REVIEW_REQUIRED/);
  assert.match(csv, /INACTIVE/);
});

test("validateRequiredClassificationFields — ignora ANULADA", () => {
  const rawByNumber = new Map<number, RawQuestion>([
    [1, sampleRaw({ status: "ANULADA" })],
  ]);
  const classifications = generateClassificationTemplate([rawByNumber.get(1)!]);
  const issues = validateRequiredClassificationFields(classifications, rawByNumber);
  assert.equal(issues.length, 0);
});
