import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadTaxonomyIndexFromExport } from "../../taxonomy-engine/src/export.ts";
import {
  loadClassificationInput,
  loadEditorialRulesConfig,
  parseJsonFile,
} from "../src/loader.ts";
import { buildReport } from "../src/report.ts";
import { validateClassification } from "../src/validator.ts";
import type { ClassificationEntry, RawQuestionRef } from "../src/types.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const TAXONOMY_INDEX = resolve(HERE, "../../taxonomy-engine/taxonomy.index.json");
const EDITORIAL_DIR = resolve(HERE, "../../../docs/editorial/classification");

function validEntry(overrides: Partial<ClassificationEntry> = {}): ClassificationEntry {
  return {
    question: 1,
    board: "IBFC",
    contest: "Concurso SES-DF Edital 14/2022",
    position: "Enfermeiro",
    subject: "portugues",
    topic: "interpretacao-de-texto",
    year: "2022",
    difficulty: "Média",
    keywords: ["interpretacao de texto", "coesao textual", "leitura inferencial"],
    explanation: "A alternativa correta apresenta inferência válida a partir do texto base.",
    ...overrides,
  };
}

function rawRef(overrides: Partial<RawQuestionRef> = {}): RawQuestionRef {
  return { number: 1, status: "VALID", ...overrides };
}

async function loadIndex() {
  return loadTaxonomyIndexFromExport(TAXONOMY_INDEX);
}

test("classificação válida — sem erros", async () => {
  const index = await loadIndex();
  const editorial = await loadEditorialRulesConfig(EDITORIAL_DIR);
  const loaded = {
    raw: [rawRef()],
    classifications: [validEntry()],
    rawPath: "test",
    classificationPath: "test",
  };
  const issues = validateClassification(loaded, index, editorial);
  const errors = issues.filter((i) => i.severity === "ERROR");
  assert.equal(errors.length, 0);
});

test("disciplina inválida", async () => {
  const index = await loadIndex();
  const editorial = await loadEditorialRulesConfig(EDITORIAL_DIR);
  const issues = validateClassification(
    {
      raw: [rawRef()],
      classifications: [validEntry({ subject: "disciplina-fantasma" })],
      rawPath: "t",
      classificationPath: "t",
    },
    index,
    editorial,
  );
  assert.ok(issues.some((i) => i.code === "DISCIPLINA_INEXISTENTE"));
});

test("assunto inválido", async () => {
  const index = await loadIndex();
  const editorial = await loadEditorialRulesConfig(EDITORIAL_DIR);
  const issues = validateClassification(
    {
      raw: [rawRef()],
      classifications: [validEntry({ topic: "assunto-fantasma" })],
      rawPath: "t",
      classificationPath: "t",
    },
    index,
    editorial,
  );
  assert.ok(issues.some((i) => i.code === "ASSUNTO_INEXISTENTE"));
});

test("assunto incompatível com disciplina", async () => {
  const index = await loadIndex();
  const editorial = await loadEditorialRulesConfig(EDITORIAL_DIR);
  const issues = validateClassification(
    {
      raw: [rawRef()],
      classifications: [
        validEntry({
          subject: "portugues",
          topic: "parada-cardiorrespiratoria-e-rcp",
        }),
      ],
      rawPath: "t",
      classificationPath: "t",
    },
    index,
    editorial,
  );
  assert.ok(issues.some((i) => i.code === "ASSUNTO_FORA_DA_DISCIPLINA"));
});

test("banca inexistente", async () => {
  const index = await loadIndex();
  const editorial = await loadEditorialRulesConfig(EDITORIAL_DIR);
  const issues = validateClassification(
    {
      raw: [rawRef()],
      classifications: [validEntry({ board: "Banca Fantasma Ltda" })],
      rawPath: "t",
      classificationPath: "t",
    },
    index,
    editorial,
  );
  assert.ok(issues.some((i) => i.code === "BANCA_INEXISTENTE"));
});

test("keyword duplicada", async () => {
  const index = await loadIndex();
  const editorial = await loadEditorialRulesConfig(EDITORIAL_DIR);
  const issues = validateClassification(
    {
      raw: [rawRef()],
      classifications: [
        validEntry({
          keywords: ["interpretacao de texto", "Interpretacao de Texto", "coesao textual"],
        }),
      ],
      rawPath: "t",
      classificationPath: "t",
    },
    index,
    editorial,
  );
  assert.ok(issues.some((i) => i.code === "KEYWORD_DUPLICADA"));
});

test("dificuldade inválida", async () => {
  const index = await loadIndex();
  const editorial = await loadEditorialRulesConfig(EDITORIAL_DIR);
  const issues = validateClassification(
    {
      raw: [rawRef()],
      classifications: [validEntry({ difficulty: "Super Difícil" })],
      rawPath: "t",
      classificationPath: "t",
    },
    index,
    editorial,
  );
  assert.ok(issues.some((i) => i.code === "DIFICULDADE_INVALIDA"));
});

test("explicação vazia", async () => {
  const index = await loadIndex();
  const editorial = await loadEditorialRulesConfig(EDITORIAL_DIR);
  const issues = validateClassification(
    {
      raw: [rawRef()],
      classifications: [validEntry({ explanation: "" })],
      rawPath: "t",
      classificationPath: "t",
    },
    index,
    editorial,
  );
  assert.ok(issues.some((i) => i.code === "EXPLICAÇÃO_VAZIA"));
});

test("JSON inválido", () => {
  const parsed = parseJsonFile("{ invalid", "test.json");
  assert.equal(parsed.error, "JSON_INVÁLIDO");
});

test("relatório sempre gerado — buildReport com erros", async () => {
  const index = await loadIndex();
  const editorial = await loadEditorialRulesConfig(EDITORIAL_DIR);
  const loaded = {
    raw: [rawRef()],
    classifications: [validEntry({ explanation: "" })],
    rawPath: "t",
    classificationPath: "t",
  };
  const issues = validateClassification(loaded, index, editorial);
  const report = buildReport(loaded, issues, {
    taxonomyIndexPath: TAXONOMY_INDEX,
    editorialRulesPath: EDITORIAL_DIR,
  });
  assert.ok(report.issues.length > 0);
  assert.equal(report.summary.errors >= 1, true);
  assert.ok(report.generatedAt);
});

test("integração — run com classification.json ausente gera relatório", async () => {
  const missing = resolve(HERE, "fixtures/nao-existe.json");
  const result = await loadClassificationInput(missing, missing);
  assert.equal(result.error, "JSON_INVÁLIDO");
});

test("taxonomy index acessível", async () => {
  const content = await readFile(TAXONOMY_INDEX, "utf-8");
  assert.ok(content.includes('"kind": "board"'));
});
