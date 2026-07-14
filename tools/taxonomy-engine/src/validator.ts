import type { TaxonomySeedFile } from "../../../scripts/seed/taxonomy/schema.ts";
import { taxonomySeedSchema } from "../../../scripts/seed/taxonomy/schema.ts";
import type { EntityKind, TaxonomyIndex, TaxonomyRecord, ValidationIssue, ValidationResult } from "./types.ts";

type SlugScope = { scope: string; kind: EntityKind; slug: string; id: string; name: string };

function pushDuplicate(
  issues: ValidationIssue[],
  check: string,
  scope: string,
  field: "slug" | "name" | "id",
  value: string,
  ids: string[],
): void {
  issues.push({
    check,
    detail: `${field} duplicado "${value}" no escopo ${scope}: ${ids.join(", ")}.`,
  });
}

function validateUniqueInScope(
  items: SlugScope[],
  issues: ValidationIssue[],
  field: "slug" | "name" | "id",
  check: string,
): void {
  const map = new Map<string, string[]>();
  for (const item of items) {
    const value = item[field];
    const bucket = map.get(value) ?? [];
    bucket.push(item.id);
    map.set(value, bucket);
  }
  for (const [value, ids] of map) {
    if (ids.length > 1) {
      pushDuplicate(issues, check, items.find((i) => i[field] === value)?.scope ?? "?", field, value, ids);
    }
  }
}

export function validateTaxonomyStructure(raw: unknown): ValidationResult {
  const parsed = taxonomySeedSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      issues: parsed.error.issues.map((issue) => ({
        check: "estrutura_invalida",
        detail: `${issue.path.join(".") || "root"}: ${issue.message}`,
      })),
    };
  }
  return { ok: true, issues: [] };
}

export function validateTaxonomySeed(seed: TaxonomySeedFile): ValidationResult {
  const issues: ValidationIssue[] = [];

  const boardSlugs = new Set(seed.boards.map((b) => b.slug));

  validateUniqueInScope(
    seed.boards.map((b) => ({
      scope: "boards",
      kind: "board" as EntityKind,
      slug: b.slug,
      id: `board:${b.slug}`,
      name: b.name,
    })),
    issues,
    "slug",
    "slug_duplicado",
  );
  validateUniqueInScope(
    seed.boards.map((b) => ({
      scope: "boards",
      kind: "board" as EntityKind,
      slug: b.slug,
      id: `board:${b.slug}`,
      name: b.name,
    })),
    issues,
    "name",
    "nome_duplicado",
  );

  for (const contest of seed.contests) {
    if (!boardSlugs.has(contest.boardSlug)) {
      issues.push({
        check: "referencia_inexistente",
        detail: `Concurso "${contest.slug}" referencia banca inexistente "${contest.boardSlug}".`,
      });
    }
  }

  const contestScopes: SlugScope[] = [];
  for (const contest of seed.contests) {
    contestScopes.push({
      scope: `contest/${contest.boardSlug}`,
      kind: "contest",
      slug: contest.slug,
      id: `contest:${contest.boardSlug}:${contest.slug}`,
      name: contest.name,
    });
  }
  validateUniqueInScope(contestScopes, issues, "slug", "slug_duplicado");

  if (seed.courses.length === 0) {
    issues.push({ check: "estrutura_invalida", detail: "Nenhum curso definido em courses[]." });
  }

  for (const course of seed.courses) {
    if (course.positions.length === 0) {
      issues.push({
        check: "cargo_sem_curso",
        detail: `Curso "${course.slug}" não possui cargos (positions[] vazio).`,
      });
    }

    validateUniqueInScope(
      course.positions.map((p) => ({
        scope: `course/${course.slug}/positions`,
        kind: "position",
        slug: p.slug,
        id: `position:${course.slug}:${p.slug}`,
        name: p.name,
      })),
      issues,
      "slug",
      "slug_duplicado",
    );

    for (const subject of course.subjects) {
      validateUniqueInScope(
        subject.topics.map((t) => ({
          scope: `course/${course.slug}/subject/${subject.slug}/topics`,
          kind: "topic",
          slug: t.slug,
          id: `topic:${course.slug}:${subject.slug}:${t.slug}`,
          name: t.name,
        })),
        issues,
        "slug",
        "slug_duplicado",
      );
    }

    validateUniqueInScope(
      course.subjects.map((s) => ({
        scope: `course/${course.slug}/subjects`,
        kind: "subject",
        slug: s.slug,
        id: `subject:${course.slug}:${s.slug}`,
        name: s.name,
      })),
      issues,
      "slug",
      "slug_duplicado",
    );
  }

  const globalSubjectSlugs = new Map<string, string[]>();
  for (const course of seed.courses) {
    for (const subject of course.subjects) {
      const bucket = globalSubjectSlugs.get(subject.slug) ?? [];
      bucket.push(course.slug);
      globalSubjectSlugs.set(subject.slug, bucket);
    }
  }
  for (const [slug, courses] of globalSubjectSlugs) {
    if (courses.length > 1) {
      issues.push({
        check: "slug_duplicado",
        detail: `Slug de disciplina duplicado globalmente "${slug}" nos cursos: ${courses.join(", ")}.`,
      });
    }
  }

  return { ok: issues.length === 0, issues };
}

export function validateTaxonomyIndex(index: TaxonomyIndex, seed: TaxonomySeedFile): ValidationResult {
  const issues: ValidationIssue[] = [...validateTaxonomySeed(seed).issues];

  validateUniqueInScope(
    index.records.map((r) => ({
      scope: "index/global",
      kind: r.kind,
      slug: r.slug,
      id: r.id,
      name: r.name,
    })),
    issues,
    "id",
    "id_duplicado",
  );

  for (const record of index.records) {
    if (record.kind === "topic") {
      const subject = index.byId.get(`subject:${record.courseSlug}:${record.subjectSlug}`);
      if (!subject) {
        issues.push({
          check: "referencia_inexistente",
          detail: `Assunto (topic) "${record.slug}" referencia disciplina inexistente "${record.subjectSlug}".`,
        });
      }
    }
    if (record.kind === "subject" || record.kind === "position" || record.kind === "topic") {
      const course = index.byId.get(`course:${record.courseSlug}`);
      if (!course) {
        issues.push({
          check: "referencia_inexistente",
          detail: `${record.kind} "${record.slug}" referencia curso inexistente "${record.courseSlug}".`,
        });
      }
    }
    if (record.kind === "contest") {
      const board = index.byId.get(`board:${record.boardSlug}`);
      if (!board) {
        issues.push({
          check: "concurso_sem_banca",
          detail: `Concurso "${record.slug}" referencia banca inexistente "${record.boardSlug}".`,
        });
      }
    }
  }

  const expectedTotal =
    seed.courses.length +
    seed.boards.length +
    seed.contests.length +
    seed.courses.reduce((acc, c) => acc + c.positions.length + c.subjects.length + c.subjects.reduce((a, s) => a + s.topics.length, 0), 0);

  if (index.records.length !== expectedTotal) {
    issues.push({
      check: "estrutura_invalida",
      detail: `Contagem de registros divergente: index=${index.records.length}, esperado=${expectedTotal}.`,
    });
  }

  return { ok: issues.length === 0, issues };
}

export function assertRecordKind<T extends TaxonomyRecord["kind"]>(
  record: TaxonomyRecord | undefined,
  kind: T,
): record is Extract<TaxonomyRecord, { kind: T }> {
  return record?.kind === kind;
}
