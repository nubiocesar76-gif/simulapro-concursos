import { test } from "node:test";
import assert from "node:assert/strict";
import { parseProva } from "./parse-prova.ts";

test("single-column A-D question", () => {
  const text = [
    "=== PAGE 1 ===",
    "1) Qual é a capital do Acre?",
    "a) Cruzeiro do Sul.",
    "b) Rio Branco.",
    "c) Sena Madureira.",
    "d) Tarauacá.",
  ].join("\n");

  const [q] = parseProva(text);
  assert.equal(q.number, 1);
  assert.equal(q.statement, "Qual é a capital do Acre?");
  assert.deepEqual(q.alternatives, {
    A: "Cruzeiro do Sul.",
    B: "Rio Branco.",
    C: "Sena Madureira.",
    D: "Tarauacá.",
  });
  assert.equal(q.status, "VALID");
  assert.equal(q.page, 1);
  assert.deepEqual(q.warnings, []);
});

test("two-column A-D layout (a/c on one line, b/d on the next)", () => {
  const text = [
    "=== PAGE 9 ===",
    "41) Preencha a lacuna com o valor correto.",
    "a) 500 a 1.500 c) 1.000",
    "b) 7.000 d) 2.000 a 3.500",
  ].join("\n");

  const [q] = parseProva(text);
  assert.deepEqual(q.alternatives, {
    A: "500 a 1.500",
    B: "7.000",
    C: "1.000",
    D: "2.000 a 3.500",
  });
  assert.equal(q.status, "VALID");
  assert.deepEqual(q.warnings, []);
});

test("two-column layout with irregular spacing between columns", () => {
  const text = [
    "=== PAGE 1 ===",
    "50) Estão corretas as alternativas:",
    "a) I, II e IV apenas       c)  II, III e IV apenas",
    "b) I e II apenas       d)  I, II, III e IV",
  ].join("\n");

  const [q] = parseProva(text);
  assert.deepEqual(q.alternatives, {
    A: "I, II e IV apenas",
    B: "I e II apenas",
    C: "II, III e IV apenas",
    D: "I, II, III e IV",
  });
  assert.equal(q.status, "VALID");
});

test("A-E question (five alternatives, single column)", () => {
  const text = [
    "=== PAGE 1 ===",
    "1) Assinale a alternativa correta.",
    "a) primeira",
    "b) segunda",
    "c) terceira",
    "d) quarta",
    "e) quinta",
  ].join("\n");

  const [q] = parseProva(text);
  assert.deepEqual(q.alternatives, {
    A: "primeira",
    B: "segunda",
    C: "terceira",
    D: "quarta",
    E: "quinta",
  });
  assert.equal(q.status, "VALID");
});

test("alternative text wrapped across multiple lines", () => {
  const text = [
    "=== PAGE 1 ===",
    "1) Sobre o tema, assinale a alternativa correta.",
    "a) Esta é uma alternativa bastante longa que foi",
    "quebrada em duas linhas pelo layout do PDF.",
    "b) Esta é curta.",
    "c) Também curta.",
    "d) Curta também.",
  ].join("\n");

  const [q] = parseProva(text);
  assert.equal(
    q.alternatives.A,
    "Esta é uma alternativa bastante longa que foi quebrada em duas linhas pelo layout do PDF.",
  );
  assert.equal(q.status, "VALID");
});

test("empty lines inside a question block are ignored, not treated as content", () => {
  const text = [
    "=== PAGE 1 ===",
    "1) Pergunta com linhas em branco no meio.",
    "",
    "a) Primeira alternativa.",
    "",
    "b) Segunda alternativa.",
    "c) Terceira alternativa.",
    "d) Quarta alternativa.",
    "",
  ].join("\n");

  const [q] = parseProva(text);
  assert.equal(q.statement, "Pergunta com linhas em branco no meio.");
  assert.deepEqual(q.alternatives, {
    A: "Primeira alternativa.",
    B: "Segunda alternativa.",
    C: "Terceira alternativa.",
    D: "Quarta alternativa.",
  });
  assert.equal(q.status, "VALID");
});

test("question with only 2 alternatives is flagged REVIEW_REQUIRED, never fabricated", () => {
  const text = [
    "=== PAGE 1 ===",
    "1) Pergunta incompleta no PDF de origem.",
    "a) Primeira.",
    "b) Segunda.",
  ].join("\n");

  const [q] = parseProva(text);
  assert.deepEqual(q.alternatives, { A: "Primeira.", B: "Segunda." });
  assert.equal(q.status, "REVIEW_REQUIRED");
  assert.ok(q.warnings.some((w) => w.includes("alternativa")));
});

test("3 alternatives detected (unusual count) is flagged, never filled in", () => {
  const text = [
    "=== PAGE 1 ===",
    "1) Pergunta com layout de duas colunas quebrado.",
    "a) Primeira. d) Quarta.",
    "b) Segunda.",
  ].join("\n");

  const [q] = parseProva(text);
  assert.deepEqual(q.alternatives, { A: "Primeira.", B: "Segunda.", D: "Quarta." });
  assert.equal(q.status, "REVIEW_REQUIRED");
  assert.ok(q.warnings.some((w) => w.includes("incomum")));
});

test("4 alternatives detected but with a gap (A,B,D,E instead of A-D) is flagged, never filled in", () => {
  const text = [
    "=== PAGE 1 ===",
    "1) Pergunta com uma coluna faltando (C ausente).",
    "a) Primeira. d) Quarta.",
    "b) Segunda. e) Quinta.",
  ].join("\n");

  const [q] = parseProva(text);
  assert.deepEqual(q.alternatives, { A: "Primeira.", B: "Segunda.", D: "Quarta.", E: "Quinta." });
  assert.equal(q.status, "REVIEW_REQUIRED");
  assert.ok(q.warnings.some((w) => w.includes("faltando")));
});

test("multiple questions in sequence are split correctly, including a two-column one in the middle", () => {
  const text = [
    "=== PAGE 1 ===",
    "1) Primeira pergunta.",
    "a) A1.",
    "b) B1.",
    "c) C1.",
    "d) D1.",
    "2) Segunda pergunta, em duas colunas.",
    "a) A2. c) C2.",
    "b) B2. d) D2.",
    "3) Terceira pergunta.",
    "a) A3.",
    "b) B3.",
    "c) C3.",
    "d) D3.",
  ].join("\n");

  const questions = parseProva(text);
  assert.equal(questions.length, 3);
  assert.deepEqual(questions[1].alternatives, { A: "A2.", B: "B2.", C: "C2.", D: "D2." });
  assert.equal(questions[1].status, "VALID");
});
