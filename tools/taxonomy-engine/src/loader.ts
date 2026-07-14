import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { TaxonomySeedFile } from "../../../scripts/seed/taxonomy/schema.ts";
import { taxonomySeedSchema } from "../../../scripts/seed/taxonomy/schema.ts";
import type {
  BoardRecord,
  ContestRecord,
  CourseRecord,
  EntityKind,
  PositionRecord,
  SubjectRecord,
  TaxonomyIndex,
  TaxonomyMetadata,
  TaxonomyRecord,
  TopicRecord,
} from "./types.ts";
import { validateTaxonomyIndex } from "./validator.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
export const DEFAULT_TAXONOMY_PATH = resolve(HERE, "../../../docs/seeds/taxonomy.json");

export function makeId(kind: EntityKind, parts: string[]): string {
  return `${kind}:${parts.join(":")}`;
}

function normalizeSearchText(parts: string[]): string {
  return parts
    .join(" ")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
}

function buildSearchText(name: string, slug: string, synonyms: string[]): string {
  return normalizeSearchText([name, slug, ...synonyms]);
}

export function buildIndexFromSeed(seed: TaxonomySeedFile, sourcePath: string): TaxonomyIndex {
  const records: TaxonomyRecord[] = [];

  for (const course of seed.courses) {
    const courseId = makeId("course", [course.slug]);
    const courseRecord: CourseRecord = {
      id: courseId,
      kind: "course",
      name: course.name,
      slug: course.slug,
      status: course.status,
      order: course.order,
      synonyms: [],
      searchText: buildSearchText(course.name, course.slug, []),
      description: course.description ?? null,
    };
    records.push(courseRecord);

    for (const position of course.positions) {
      const positionRecord: PositionRecord = {
        id: makeId("position", [course.slug, position.slug]),
        kind: "position",
        name: position.name,
        slug: position.slug,
        status: position.status,
        order: position.order,
        synonyms: [],
        searchText: buildSearchText(position.name, position.slug, []),
        courseSlug: course.slug,
        courseName: course.name,
        description: position.description ?? null,
      };
      records.push(positionRecord);
    }

    for (const subject of course.subjects) {
      const subjectRecord: SubjectRecord = {
        id: makeId("subject", [course.slug, subject.slug]),
        kind: "subject",
        name: subject.name,
        slug: subject.slug,
        status: subject.status,
        order: subject.order,
        synonyms: [],
        searchText: buildSearchText(subject.name, subject.slug, []),
        courseSlug: course.slug,
        courseName: course.name,
      };
      records.push(subjectRecord);

      for (const topic of subject.topics) {
        const topicRecord: TopicRecord = {
          id: makeId("topic", [course.slug, subject.slug, topic.slug]),
          kind: "topic",
          name: topic.name,
          slug: topic.slug,
          status: topic.status,
          order: topic.order,
          synonyms: [],
          searchText: buildSearchText(topic.name, topic.slug, []),
          courseSlug: course.slug,
          courseName: course.name,
          subjectSlug: subject.slug,
          subjectName: subject.name,
        };
        records.push(topicRecord);
      }
    }
  }

  const boardBySlug = new Map(seed.boards.map((b) => [b.slug, b]));

  for (const board of seed.boards) {
    const boardRecord: BoardRecord = {
      id: makeId("board", [board.slug]),
      kind: "board",
      name: board.name,
      slug: board.slug,
      status: board.status,
      order: board.order,
      synonyms: [],
      searchText: buildSearchText(board.name, board.slug, []),
      acronym: board.acronym ?? null,
    };
    records.push(boardRecord);
  }

  for (const contest of seed.contests) {
    const board = boardBySlug.get(contest.boardSlug);
    const contestRecord: ContestRecord = {
      id: makeId("contest", [contest.boardSlug, contest.slug]),
      kind: "contest",
      name: contest.name,
      slug: contest.slug,
      status: contest.status,
      order: contest.order,
      synonyms: [],
      searchText: buildSearchText(contest.name, contest.slug, []),
      boardSlug: contest.boardSlug,
      boardName: board?.name ?? contest.boardSlug,
      year: contest.year ?? null,
    };
    records.push(contestRecord);
  }

  const byId = new Map<string, TaxonomyRecord>();
  const bySlug = new Map<string, TaxonomyRecord[]>();
  const byKind = new Map<EntityKind, TaxonomyRecord[]>();

  for (const record of records) {
    byId.set(record.id, record);
    const slugBucket = bySlug.get(record.slug) ?? [];
    slugBucket.push(record);
    bySlug.set(record.slug, slugBucket);

    const kindBucket = byKind.get(record.kind) ?? [];
    kindBucket.push(record);
    byKind.set(record.kind, kindBucket);
  }

  const counts = {
    courses: byKind.get("course")?.length ?? 0,
    positions: byKind.get("position")?.length ?? 0,
    subjects: byKind.get("subject")?.length ?? 0,
    topics: byKind.get("topic")?.length ?? 0,
    boards: byKind.get("board")?.length ?? 0,
    contests: byKind.get("contest")?.length ?? 0,
    total: records.length,
  };

  return {
    metadata: seed.metadata as TaxonomyMetadata,
    sourcePath,
    generatedAt: new Date().toISOString(),
    counts,
    records,
    byId,
    bySlug,
    byKind,
  };
}

export function parseTaxonomySeed(raw: unknown): TaxonomySeedFile {
  const parsed = taxonomySeedSchema.safeParse(raw);
  if (!parsed.success) {
    const detail = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    throw new Error(`Estrutura inválida em taxonomy.json: ${detail}`);
  }
  return parsed.data;
}

export async function loadTaxonomyIndex(sourcePath: string = DEFAULT_TAXONOMY_PATH): Promise<TaxonomyIndex> {
  const content = await readFile(sourcePath, "utf-8");
  let raw: unknown;
  try {
    raw = JSON.parse(content);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`JSON inválido em ${sourcePath}: ${message}`);
  }

  const seed = parseTaxonomySeed(raw);
  const index = buildIndexFromSeed(seed, sourcePath);

  const validation = validateTaxonomyIndex(index, seed);
  if (!validation.ok) {
    const summary = validation.issues.map((i) => `[${i.check}] ${i.detail}`).join("\n");
    throw new Error(`Taxonomia oficial inválida:\n${summary}`);
  }

  return index;
}
