import { generatePackageSlug } from "../../../src/lib/packages.ts";
import { parseAlternativesFromDb } from "../../../src/lib/questions.ts";
import type { SeedDb } from "../taxonomy/entities.ts";
import {
  resolveBoard,
  resolveContest,
  resolvePackageVersion,
  resolvePosition,
  resolveSubject,
  resolveTopic,
} from "../taxonomy/entities.ts";
import { computeContentHashFromDb } from "./hash.ts";
import { EXPORT_PAGE_SIZE } from "./metadata.ts";
import type { QuestionSeedItem } from "./schema.ts";

export type TaxonomyMaps = {
  positionSlugToId: Map<string, string>;
  positionSlugToCourseId: Map<string, string>;
  subjectSlugToId: Map<string, string>;
  topicKeyToId: Map<string, string>;
  boardSlugToId: Map<string, string>;
  contestKeyToId: Map<string, string>;
  packageVersionKeyToId: Map<string, string>;
};

export type QuestionIndex = Map<string, string>;

function topicKey(subjectSlug: string, topicSlug: string) {
  return `${subjectSlug}/${topicSlug}`;
}

function contestKey(boardSlug: string, contestSlug: string) {
  return `${boardSlug}/${contestSlug}`;
}

function packageVersionKey(courseId: string, packageSlug: string, versionNumber: string) {
  return `${courseId}/${packageSlug}/${versionNumber}`;
}

export async function loadTaxonomyMaps(db: SeedDb): Promise<TaxonomyMaps> {
  const [
    { data: positions, error: positionsError },
    { data: subjects, error: subjectsError },
    { data: topics, error: topicsError },
    { data: boards, error: boardsError },
    { data: exams, error: examsError },
  ] = await Promise.all([
    db.from("positions").select("id,slug,course_id"),
    db.from("subjects").select("id,slug"),
    db.from("topics").select("id,slug,subject_id,subjects(slug)"),
    db.from("boards").select("id,name"),
    db.from("exams").select("id,name,board_id"),
  ]);

  if (positionsError) throw positionsError;
  if (subjectsError) throw subjectsError;
  if (topicsError) throw topicsError;
  if (boardsError) throw boardsError;
  if (examsError) throw examsError;

  const positionSlugToId = new Map<string, string>();
  const positionSlugToCourseId = new Map<string, string>();
  for (const position of positions ?? []) {
    if (!positionSlugToId.has(position.slug)) {
      positionSlugToId.set(position.slug, position.id);
      positionSlugToCourseId.set(position.slug, position.course_id);
    }
  }

  const subjectSlugToId = new Map((subjects ?? []).map((s) => [s.slug, s.id]));
  const topicKeyToId = new Map<string, string>();
  for (const topic of topics ?? []) {
    const subjectSlug = (topic.subjects as { slug: string } | null)?.slug;
    if (subjectSlug) topicKeyToId.set(topicKey(subjectSlug, topic.slug), topic.id);
  }

  const boardSlugToId = new Map(
    (boards ?? []).map((b) => [generatePackageSlug(b.name), b.id] as const),
  );
  const boardIdToSlug = new Map(
    (boards ?? []).map((b) => [b.id, generatePackageSlug(b.name)] as const),
  );

  const contestKeyToId = new Map<string, string>();
  for (const exam of exams ?? []) {
    const boardSlug = boardIdToSlug.get(exam.board_id);
    if (boardSlug)
      contestKeyToId.set(contestKey(boardSlug, generatePackageSlug(exam.name)), exam.id);
  }

  return {
    positionSlugToId,
    positionSlugToCourseId,
    subjectSlugToId,
    topicKeyToId,
    boardSlugToId,
    contestKeyToId,
    packageVersionKeyToId: new Map<string, string>(),
  };
}

// Chave de deduplicação para questões copiadas com rastreabilidade (ex.: cópias da
// demo — ver docs/commercial/FREEMIUM_ARCHITECTURE.md, Alternativa E). Escopada por
// package_version_id: a mesma questão original pode, em tese, ser copiada para versões
// diferentes sem colidir — o que não pode acontecer é a mesma origem duas vezes na
// mesma versão.
export type OriginIndex = Set<string>;

export function buildOriginKey(packageVersionId: string | null, originQuestionId: string): string {
  return `${packageVersionId ?? "null"}:${originQuestionId}`;
}

export async function loadQuestionIndex(
  db: SeedDb,
): Promise<{ hashIndex: QuestionIndex; originIndex: OriginIndex }> {
  const hashIndex: QuestionIndex = new Map();
  const originIndex: OriginIndex = new Set();
  let from = 0;

  while (true) {
    const { data, error } = await db
      .from("questions")
      .select("id,statement,alternatives,correct_answer,metadata,package_version_id")
      .range(from, from + EXPORT_PAGE_SIZE - 1);
    if (error) throw error;
    if (!data?.length) break;

    for (const row of data) {
      const metadata = (
        row.metadata && typeof row.metadata === "object" ? row.metadata : {}
      ) as Record<string, unknown>;
      const storedHash = typeof metadata.contentHash === "string" ? metadata.contentHash : null;
      const hash =
        storedHash ?? computeContentHashFromDb(row.statement, row.alternatives, row.correct_answer);
      hashIndex.set(hash, row.id);

      const origin = metadata.origin as { questionId?: unknown } | undefined;
      if (origin && typeof origin.questionId === "string") {
        originIndex.add(buildOriginKey(row.package_version_id, origin.questionId));
      }
    }

    if (data.length < EXPORT_PAGE_SIZE) break;
    from += EXPORT_PAGE_SIZE;
  }

  return { hashIndex, originIndex };
}

export async function resolveQuestionTaxonomyIds(
  db: SeedDb,
  item: QuestionSeedItem,
  maps: TaxonomyMaps,
): Promise<{
  position_id: string | null;
  subject_id: string | null;
  topic_id: string | null;
  board_id: string | null;
  exam_id: string | null;
  package_version_id: string | null;
}> {
  let position_id: string | null = null;
  if (item.position) {
    position_id = maps.positionSlugToId.get(item.position) ?? null;
    if (!position_id) {
      const { data, error } = await db
        .from("positions")
        .select("id,course_id")
        .eq("slug", item.position)
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      if (!data) throw new Error(`Cargo "${item.position}" não encontrado.`);
      position_id = data.id;
      maps.positionSlugToId.set(item.position, position_id);
      maps.positionSlugToCourseId.set(item.position, data.course_id);
    }
  }

  let subject_id: string | null = null;
  if (item.subject) {
    subject_id = maps.subjectSlugToId.get(item.subject) ?? null;
    if (!subject_id) {
      const resolved = await resolveSubject(db, item.subject, item.subject);
      if (!resolved) throw new Error(`Disciplina "${item.subject}" não encontrada.`);
      subject_id = resolved.id;
      maps.subjectSlugToId.set(item.subject, subject_id);
    }
  }

  let topic_id: string | null = null;
  if (item.topic) {
    if (!item.subject) throw new Error(`Assunto "${item.topic}" requer subject.`);
    const key = topicKey(item.subject, item.topic);
    topic_id = maps.topicKeyToId.get(key) ?? null;
    if (!topic_id && subject_id) {
      const resolved = await resolveTopic(db, subject_id, item.topic, item.topic);
      if (!resolved)
        throw new Error(`Assunto "${item.topic}" não encontrado em "${item.subject}".`);
      topic_id = resolved.id;
      maps.topicKeyToId.set(key, topic_id);
    }
  }

  let board_id: string | null = null;
  if (item.board) {
    board_id = maps.boardSlugToId.get(item.board) ?? null;
    if (!board_id) {
      const resolved = await resolveBoard(db, item.board, item.board);
      if (!resolved) throw new Error(`Banca "${item.board}" não encontrada.`);
      board_id = resolved.id;
      maps.boardSlugToId.set(item.board, board_id);
    }
  }

  let exam_id: string | null = null;
  if (item.contest) {
    if (!item.board) throw new Error(`Concurso "${item.contest}" requer board.`);
    const key = contestKey(item.board, item.contest);
    exam_id = maps.contestKeyToId.get(key) ?? null;
    if (!exam_id && board_id) {
      const resolved = await resolveContest(db, board_id, item.contest, item.contest);
      if (!resolved)
        throw new Error(`Concurso "${item.contest}" não encontrado em "${item.board}".`);
      exam_id = resolved.id;
      maps.contestKeyToId.set(key, exam_id);
    }
  }

  let package_version_id: string | null = null;
  if (item.package || item.packageVersion) {
    if (!item.package) throw new Error(`packageVersion "${item.packageVersion}" requer package.`);
    if (!item.packageVersion) throw new Error(`package "${item.package}" requer packageVersion.`);
    if (!item.position)
      throw new Error(`package "${item.package}" requer position (para resolver o curso).`);
    const courseId = maps.positionSlugToCourseId.get(item.position);
    if (!courseId) throw new Error(`Curso não resolvido para o cargo "${item.position}".`);

    const key = packageVersionKey(courseId, item.package, item.packageVersion);
    package_version_id = maps.packageVersionKeyToId.get(key) ?? null;
    if (!package_version_id) {
      const resolved = await resolvePackageVersion(db, courseId, item.package, item.packageVersion);
      if (!resolved) {
        throw new Error(
          `Versão "${item.packageVersion}" do pacote "${item.package}" não encontrada para o curso do cargo "${item.position}".`,
        );
      }
      package_version_id = resolved.id;
      maps.packageVersionKeyToId.set(key, package_version_id);
    }
  }

  return { position_id, subject_id, topic_id, board_id, exam_id, package_version_id };
}

export function buildSeedMetadata(item: QuestionSeedItem, contentHash: string) {
  const metadata: Record<string, unknown> = { contentHash };
  if (item.references.length) metadata.references = item.references;
  if (item.source && Object.keys(item.source).length) metadata.source = item.source;
  if (item.metadata && Object.keys(item.metadata).length) Object.assign(metadata, item.metadata);
  return metadata;
}

export function readSeedMetadata(metadata: unknown) {
  const m = (metadata && typeof metadata === "object" ? metadata : {}) as Record<string, unknown>;
  return {
    references: Array.isArray(m.references)
      ? m.references.filter((r): r is string => typeof r === "string")
      : [],
    source:
      m.source && typeof m.source === "object"
        ? (m.source as { organization?: string; exam?: string; page?: number; question?: number })
        : undefined,
  };
}

export function formatAlternativesForDb(alternatives: QuestionSeedItem["alternatives"]) {
  return alternatives.map((alt) => `${alt.letter}) ${alt.text.trim()}`);
}

export function parseAlternativesForSeed(alternatives: unknown): QuestionSeedItem["alternatives"] {
  return parseAlternativesFromDb(alternatives).filter((alt) => alt.text.trim().length > 0);
}
