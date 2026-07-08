import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { EditorialPackage, EntityPreviewCounts, ImportPreview } from "./types";
import { validateEditorialPackage } from "./validator";
import { codeToSlug, slugifyEditorial } from "./slug";

type DbRow = {
  id: string;
  code: string | null;
  status: string;
  [key: string]: unknown;
};

function emptyCounts(total = 0): EntityPreviewCounts {
  return { total, new: 0, updated: 0, removed: 0, unchanged: 0 };
}

function fingerprint(value: unknown) {
  return JSON.stringify(value);
}

function compareByCode(
  sourceItems: { code: string; fingerprint: string }[],
  dbItems: DbRow[],
  fingerprintFn: (row: DbRow) => string,
): EntityPreviewCounts {
  const sourceMap = new Map(sourceItems.map((item) => [item.code, item.fingerprint]));
  const dbMap = new Map(
    dbItems
      .filter((row) => row.code)
      .map((row) => [row.code as string, { row, fingerprint: fingerprintFn(row) }]),
  );

  let newCount = 0;
  let updated = 0;
  let unchanged = 0;

  for (const [code, fp] of sourceMap) {
    const existing = dbMap.get(code);
    if (!existing) {
      newCount += 1;
    } else if (existing.fingerprint !== fp) {
      updated += 1;
    } else {
      unchanged += 1;
    }
  }

  let removed = 0;
  for (const [code, { row }] of dbMap) {
    if (!sourceMap.has(code) && row.status !== "DEPRECIADO" && row.status !== "MESCLADO") {
      removed += 1;
    }
  }

  return {
    total: sourceItems.length,
    new: newCount,
    updated,
    removed,
    unchanged,
  };
}

async function resolveScopeIds(courseSlug: string, positionSlug: string) {
  const { data: course, error: courseError } = await supabaseAdmin
    .from("courses")
    .select("id")
    .eq("slug", courseSlug)
    .maybeSingle();

  if (courseError) throw new Error(courseError.message);
  if (!course) return null;

  const { data: position, error: positionError } = await supabaseAdmin
    .from("positions")
    .select("id")
    .eq("course_id", course.id)
    .eq("slug", positionSlug)
    .maybeSingle();

  if (positionError) throw new Error(positionError.message);
  if (!position) return null;

  return { courseId: course.id, positionId: position.id };
}

export async function buildImportPreview(pkg: EditorialPackage): Promise<ImportPreview> {
  const validation = validateEditorialPackage(pkg);
  const scope = await resolveScopeIds(pkg.manifest.course_slug, pkg.manifest.position_slug);

  if (!scope) {
    validation.errors.push({
      level: "error",
      code: "SCOPE_NOT_FOUND",
      message: `Curso "${pkg.manifest.course_slug}" ou cargo "${pkg.manifest.position_slug}" não encontrado na taxonomia.`,
    });
  }

  let architectureId: string | null = null;
  let existingArchitecture: DbRow | null = null;

  if (scope) {
    const { data, error } = await supabaseAdmin
      .from("editorial_architectures")
      .select("id, slug, name, engine_version, status, is_active, description")
      .eq("course_id", scope.courseId)
      .eq("position_id", scope.positionId)
      .eq("slug", pkg.manifest.architecture_slug)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (data) {
      architectureId = data.id;
      existingArchitecture = { ...data, code: pkg.manifest.architecture_slug };
    }
  }

  const archFingerprint = fingerprint({
    name: pkg.manifest.architecture_name,
    engine_version: pkg.manifest.engine_version,
    description: pkg.manifest.description ?? null,
    architecture_version: pkg.manifest.architecture_version,
  });

  const architectureCounts: EntityPreviewCounts = existingArchitecture
    ? {
        total: 1,
        new: 0,
        updated:
          fingerprint({
            name: existingArchitecture.name,
            engine_version: existingArchitecture.engine_version,
            description: existingArchitecture.description ?? null,
          }) !== archFingerprint
            ? 1
            : 0,
        removed: 0,
        unchanged:
          fingerprint({
            name: existingArchitecture.name,
            engine_version: existingArchitecture.engine_version,
            description: existingArchitecture.description ?? null,
          }) === archFingerprint
            ? 1
            : 0,
      }
    : { total: 1, new: 1, updated: 0, removed: 0, unchanged: 0 };

  const loadTable = async (table: string) => {
    if (!architectureId) return [] as DbRow[];
    const { data, error } = await supabaseAdmin
      .from(table)
      .select("*")
      .eq("architecture_id", architectureId);
    if (error) throw new Error(error.message);
    return (data ?? []) as DbRow[];
  };

  const [disciplinesDb, topicsDb, subtopicsDb, keywordsDb, rulesDb, evidenceDb] =
    await Promise.all([
      loadTable("editorial_disciplines"),
      loadTable("editorial_topics"),
      loadTable("editorial_subtopics"),
      loadTable("editorial_keywords"),
      loadTable("editorial_rules"),
      loadTable("editorial_evidence"),
    ]);

  const disciplineSource = pkg.disciplines.map((d, index) => ({
    code: d.id,
    fingerprint: fingerprint({
      slug: codeToSlug(d.id),
      name: d.nome,
      description: d.descricao ?? null,
      frequency_percent: d.frequencia_percentual ?? null,
      priority: d.prioridade ?? null,
      sort_order: index,
    }),
  }));

  const topicSource = pkg.topics.map((t, index) => ({
    code: t.id,
    fingerprint: fingerprint({
      slug: codeToSlug(t.id),
      name: t.nome,
      description: t.descricao ?? null,
      discipline_code: t.disciplina_id,
      sort_order: index,
    }),
  }));

  const subtopicSource = pkg.subtopics.map((s, index) => ({
    code: s.id,
    fingerprint: fingerprint({
      slug: s.slug,
      name: s.nome,
      description: s.descricao ?? null,
      topic_code: s.assunto_id,
      sort_order: index,
    }),
  }));

  const keywordSource = pkg.keywords.map((k) => ({
    code: k.id,
    fingerprint: fingerprint({
      term: k.palavra,
      weight: k.peso,
      keyword_type: k.tipo,
      subtopic_code: k.subassunto_id,
    }),
  }));

  const ruleSource = pkg.rules.map((r) => ({
    code: r.id,
    fingerprint: fingerprint({
      discipline_code: r.disciplina_id,
      topic_code: r.assunto_id ?? null,
      subtopic_code: r.subassunto_id ?? null,
      trigger_terms: r.se_encontrar,
      confidence_percent: r.confianca_percentual,
    }),
  }));

  const disciplineCounts = compareByCode(
    disciplineSource,
    disciplinesDb,
    (row) =>
      fingerprint({
        slug: row.slug,
        name: row.name,
        description: row.description ?? null,
        frequency_percent: row.frequency_percent ?? null,
        priority: row.priority ?? null,
        sort_order: row.sort_order ?? 0,
      }),
  );

  const topicCounts = compareByCode(topicSource, topicsDb, (row) =>
    fingerprint({
      slug: row.slug,
      name: row.name,
      description: row.description ?? null,
      discipline_code: null,
      sort_order: row.sort_order ?? 0,
    }),
  );

  const subtopicCounts = compareByCode(subtopicSource, subtopicsDb, (row) =>
    fingerprint({
      slug: row.slug,
      name: row.name,
      description: row.description ?? null,
      topic_code: null,
      sort_order: row.sort_order ?? 0,
    }),
  );

  const keywordCounts = compareByCode(keywordSource, keywordsDb, (row) =>
    fingerprint({
      term: row.term,
      weight: row.weight,
      keyword_type: row.keyword_type,
      subtopic_code: null,
    }),
  );

  const ruleCounts = compareByCode(ruleSource, rulesDb, (row) =>
    fingerprint({
      discipline_code: null,
      topic_code: null,
      subtopic_code: null,
      trigger_terms: row.trigger_terms,
      confidence_percent: row.confidence_percent,
    }),
  );

  return {
    packagePath: pkg.path,
    manifest: pkg.manifest,
    filesRead: pkg.filesRead,
    validation: {
      valid: validation.errors.length === 0,
      errors: validation.errors,
      warnings: validation.warnings,
    },
    counts: {
      architectures: architectureCounts,
      disciplines: disciplineCounts,
      topics: topicCounts,
      subtopics: subtopicCounts,
      keywords: keywordCounts,
      rules: ruleCounts,
      evidence: {
        total: evidenceDb.length,
        new: 0,
        updated: 0,
        removed: 0,
        unchanged: evidenceDb.length,
      },
    },
    architectureId,
  };
}
