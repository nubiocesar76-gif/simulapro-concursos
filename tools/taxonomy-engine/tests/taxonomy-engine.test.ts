import { test } from "node:test";
import assert from "node:assert/strict";
import { loadTaxonomyIndex, buildIndexFromSeed, parseTaxonomySeed } from "../src/loader.ts";
import {
  findBoard,
  findById,
  findBySlug,
  findContest,
  findPosition,
  findSubject,
  findTopic,
} from "../src/lookup.ts";
import { findByName, search, searchPartial } from "../src/search.ts";
import {
  validateTaxonomyIndex,
  validateTaxonomySeed,
  validateTaxonomyStructure,
} from "../src/validator.ts";
import { readFile } from "node:fs/promises";
import { DEFAULT_TAXONOMY_PATH } from "../src/loader.ts";

test("carrega taxonomia oficial e valida estrutura", async () => {
  const index = await loadTaxonomyIndex();
  assert.ok(index.counts.total > 0);
  assert.equal(index.counts.boards, 22);
  assert.equal(index.counts.subjects, 29);
});

test("lookup por slug — board IBFC", async () => {
  const index = await loadTaxonomyIndex();
  const board = findBoard(index, { slug: "ibfc" });
  assert.ok(board);
  assert.equal(board!.name, "IBFC");
  assert.equal(board!.id, "board:ibfc");
});

test("lookup por nome exato — disciplina Português", async () => {
  const index = await loadTaxonomyIndex();
  const results = findByName(index, "Português", "subject");
  assert.equal(results.length, 1);
  assert.equal(results[0]!.record.slug, "portugues");
});

test("lookup parcial — busca 'enferm'", async () => {
  const index = await loadTaxonomyIndex();
  const results = searchPartial(index, "enferm", { kind: "subject", limit: 5 });
  assert.ok(results.length >= 1);
  assert.ok(results.some((r) => r.record.slug.includes("enferm")));
});

test("findSubject por slug global", async () => {
  const index = await loadTaxonomyIndex();
  const subject = findSubject(index, { subjectSlug: "fundamentos-de-enfermagem" });
  assert.ok(subject);
  assert.equal(subject!.kind, "subject");
});

test("findTopic com disciplina e assunto", async () => {
  const index = await loadTaxonomyIndex();
  const topic = findTopic(index, {
    courseSlug: "enfermagem",
    subjectSlug: "portugues",
    topicSlug: "interpretacao-de-texto",
  });
  assert.ok(topic);
  assert.equal(topic!.name, "Interpretação de Texto");
});

test("findContest composto board + concurso", async () => {
  const index = await loadTaxonomyIndex();
  const contest = findContest(index, {
    boardSlug: "ibfc",
    contestSlug: "concurso-ses-df-edital-14-2022",
  });
  assert.ok(contest);
  assert.equal(contest!.boardSlug, "ibfc");
});

test("findPosition com curso", async () => {
  const index = await loadTaxonomyIndex();
  const position = findPosition(index, { courseSlug: "enfermagem", positionSlug: "enfermeiro" });
  assert.ok(position);
  assert.equal(position!.name, "Enfermeiro");
});

test("findById retorna registro oficial", async () => {
  const index = await loadTaxonomyIndex();
  const record = findById(index, "board:fgv");
  assert.ok(record);
  assert.equal(record!.slug, "fgv");
});

test("findBySlug pode retornar múltiplos quando escopo difere", async () => {
  const index = await loadTaxonomyIndex();
  const ibfc = findBySlug(index, "ibfc", "board");
  assert.equal(ibfc.length, 1);
});

test("caso inexistente retorna undefined ou array vazio", async () => {
  const index = await loadTaxonomyIndex();
  assert.equal(findBoard(index, { slug: "banca-inexistente" }), undefined);
  assert.equal(findSubject(index, { subjectSlug: "nao-existe" }), undefined);
  assert.equal(search(index, "zzzzzzzzzzzzz-inexistente").length, 0);
});

test("search por sinônimo quando populado", async () => {
  const index = await loadTaxonomyIndex();
  const record = findById(index, "board:ibfc")!;
  record.synonyms = ["Instituto Brasileiro de Formação e Capacitação"];
  const results = search(index, "formação e capacitação", { kind: "board" });
  assert.ok(results.some((r) => r.matchedOn === "synonym"));
});

test("detecta slug duplicado em seed inválido", () => {
  const seed = parseTaxonomySeed({
    metadata: {
      version: "1.0.0",
      generatedAt: "",
      generatedBy: "",
      description: "",
      environment: "development",
    },
    courses: [
      {
        name: "Enfermagem",
        slug: "enfermagem",
        status: "ACTIVE",
        order: 1,
        positions: [{ name: "Enfermeiro", slug: "enfermeiro", status: "ACTIVE", order: 1 }],
        subjects: [
          {
            name: "Disciplina A",
            slug: "dup",
            status: "ACTIVE",
            order: 1,
            topics: [{ name: "T1", slug: "t1", status: "ACTIVE", order: 1 }],
          },
          {
            name: "Disciplina B",
            slug: "dup",
            status: "ACTIVE",
            order: 2,
            topics: [{ name: "T2", slug: "t2", status: "ACTIVE", order: 1 }],
          },
        ],
      },
    ],
    boards: [],
    contests: [],
  });

  const result = validateTaxonomySeed(seed);
  assert.equal(result.ok, false);
  assert.ok(result.issues.some((i) => i.check === "slug_duplicado"));
});

test("detecta concurso sem banca", () => {
  const seed = parseTaxonomySeed({
    metadata: {
      version: "1.0.0",
      generatedAt: "",
      generatedBy: "",
      description: "",
      environment: "development",
    },
    courses: [
      {
        name: "Enfermagem",
        slug: "enfermagem",
        status: "ACTIVE",
        order: 1,
        positions: [{ name: "Enfermeiro", slug: "enfermeiro", status: "ACTIVE", order: 1 }],
        subjects: [
          {
            name: "Português",
            slug: "portugues",
            status: "ACTIVE",
            order: 1,
            topics: [{ name: "Texto", slug: "texto", status: "ACTIVE", order: 1 }],
          },
        ],
      },
    ],
    boards: [{ name: "IBFC", slug: "ibfc", status: "ACTIVE", order: 1 }],
    contests: [
      {
        name: "Concurso Órfão",
        slug: "orfao",
        status: "ACTIVE",
        order: 1,
        boardSlug: "banca-fantasma",
        year: 2024,
      },
    ],
  });

  const result = validateTaxonomySeed(seed);
  assert.equal(result.ok, false);
  assert.ok(result.issues.some((i) => i.check === "referencia_inexistente" || i.check === "concurso_sem_banca"));
});

test("detecta estrutura inválida", () => {
  const result = validateTaxonomyStructure({ courses: "invalido" });
  assert.equal(result.ok, false);
  assert.ok(result.issues.some((i) => i.check === "estrutura_invalida"));
});

test("detecta id duplicado no index corrompido", async () => {
  const raw = JSON.parse(await readFile(DEFAULT_TAXONOMY_PATH, "utf-8"));
  const seed = parseTaxonomySeed(raw);
  const index = buildIndexFromSeed(seed, DEFAULT_TAXONOMY_PATH);
  index.records.push({ ...index.records[0]! });
  const validation = validateTaxonomyIndex(index, seed);
  assert.equal(validation.ok, false);
  assert.ok(validation.issues.some((i) => i.check === "id_duplicado"));
});

test("detecta assunto (topic) sem disciplina (subject) no index", async () => {
  const raw = JSON.parse(await readFile(DEFAULT_TAXONOMY_PATH, "utf-8"));
  const seed = parseTaxonomySeed(raw);
  const index = buildIndexFromSeed(seed, DEFAULT_TAXONOMY_PATH);
  const orphan = index.records.find((r) => r.kind === "topic");
  assert.ok(orphan && orphan.kind === "topic");
  if (orphan.kind === "topic") {
    orphan.subjectSlug = "disciplina-fantasma";
    orphan.id = `topic:${orphan.courseSlug}:disciplina-fantasma:${orphan.slug}`;
    index.byId.set(orphan.id, orphan);
    index.records.push(orphan);
  }
  const validation = validateTaxonomyIndex(index, seed);
  assert.equal(validation.ok, false);
  assert.ok(validation.issues.some((i) => i.check === "referencia_inexistente"));
});
