import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { EditorialPackage, ImportRecordCounts, ImportResult } from "./types";
import { validateEditorialPackage } from "./validator";
import { codeToSlug } from "./slug";

type IdMap = Map<string, string>;

async function resolveScope(courseSlug: string, positionSlug: string) {
  const { data: course, error: courseError } = await supabaseAdmin
    .from("courses")
    .select("id")
    .eq("slug", courseSlug)
    .maybeSingle();
  if (courseError) throw new Error(courseError.message);
  if (!course) {
    throw new Error(`Curso "${courseSlug}" não encontrado na taxonomia.`);
  }

  const { data: position, error: positionError } = await supabaseAdmin
    .from("positions")
    .select("id")
    .eq("course_id", course.id)
    .eq("slug", positionSlug)
    .maybeSingle();
  if (positionError) throw new Error(positionError.message);
  if (!position) {
    throw new Error(`Cargo "${positionSlug}" não encontrado na taxonomia.`);
  }

  return { courseId: course.id, positionId: position.id };
}

async function upsertArchitecture(
  pkg: EditorialPackage,
  courseId: string,
  positionId: string,
  importLogId: string | null,
) {
  const { manifest } = pkg;
  const description = [
    manifest.description ?? "",
    `Versão: ${manifest.architecture_version}`,
    `Importado de: docs/editorial/${pkg.path}`,
  ]
    .filter(Boolean)
    .join("\n");

  const { data: existing, error: findError } = await supabaseAdmin
    .from("editorial_architectures")
    .select("*")
    .eq("course_id", courseId)
    .eq("position_id", positionId)
    .eq("slug", manifest.architecture_slug)
    .maybeSingle();

  if (findError) throw new Error(findError.message);

  if (existing) {
    const { data, error } = await supabaseAdmin
      .from("editorial_architectures")
      .update({
        name: manifest.architecture_name,
        engine_version: manifest.engine_version,
        description,
        status: "APROVADO",
        is_active: true,
      })
      .eq("id", existing.id)
      .select("id")
      .single();

    if (error) throw new Error(error.message);

    await supabaseAdmin.from("editorial_changelog").insert({
      architecture_id: data.id,
      import_log_id: importLogId,
      entity_type: "ARCHITECTURE",
      entity_code: manifest.architecture_slug,
      entity_id: data.id,
      change_type: "UPDATED",
      previous_snapshot: existing,
      new_snapshot: {
        name: manifest.architecture_name,
        engine_version: manifest.engine_version,
        architecture_version: manifest.architecture_version,
      },
    });

    return data.id;
  }

  const { data, error } = await supabaseAdmin
    .from("editorial_architectures")
    .insert({
      course_id: courseId,
      position_id: positionId,
      slug: manifest.architecture_slug,
      name: manifest.architecture_name,
      engine_version: manifest.engine_version,
      description,
      status: "APROVADO",
      is_active: true,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  await supabaseAdmin.from("editorial_changelog").insert({
    architecture_id: data.id,
    import_log_id: importLogId,
    entity_type: "ARCHITECTURE",
    entity_code: manifest.architecture_slug,
    entity_id: data.id,
    change_type: "CREATED",
    new_snapshot: {
      name: manifest.architecture_name,
      engine_version: manifest.engine_version,
      architecture_version: manifest.architecture_version,
    },
  });

  return data.id;
}

async function deactivateOtherArchitectures(
  architectureId: string,
  courseId: string,
  positionId: string,
) {
  const { error } = await supabaseAdmin
    .from("editorial_architectures")
    .update({ is_active: false })
    .eq("course_id", courseId)
    .eq("position_id", positionId)
    .neq("id", architectureId);

  if (error) throw new Error(error.message);
}

async function loadByCode(table: string, architectureId: string) {
  const { data, error } = await supabaseAdmin
    .from(table)
    .select("*")
    .eq("architecture_id", architectureId);
  if (error) throw new Error(error.message);
  const map = new Map<string, Record<string, unknown>>();
  for (const row of data ?? []) {
    if (row.code) map.set(row.code, row);
  }
  return map;
}

async function deprecateMissing(
  table: string,
  architectureId: string,
  keepCodes: Set<string>,
  importLogId: string | null,
  entityType: string,
) {
  const { data, error } = await supabaseAdmin
    .from(table)
    .select("id, code, status")
    .eq("architecture_id", architectureId);

  if (error) throw new Error(error.message);

  let count = 0;
  for (const row of data ?? []) {
    if (row.status === "DEPRECIADO" || row.status === "MESCLADO") continue;
    if (!row.code || keepCodes.has(row.code)) continue;

    const { error: updateError } = await supabaseAdmin
      .from(table)
      .update({ status: "DEPRECIADO" })
      .eq("id", row.id);

    if (updateError) throw new Error(updateError.message);

    await supabaseAdmin.from("editorial_changelog").insert({
      architecture_id: architectureId,
      import_log_id: importLogId,
      entity_type: entityType,
      entity_code: row.code,
      entity_id: row.id,
      change_type: "DEPRECATED",
      previous_snapshot: row,
    });
    count += 1;
  }
  return count;
}

export async function executeEditorialImport(
  pkg: EditorialPackage,
  userId: string,
): Promise<ImportResult> {
  const started = Date.now();
  const validation = validateEditorialPackage(pkg);
  if (validation.errors.length > 0) {
    throw new Error(
      `Pacote inválido: ${validation.errors[0]?.message ?? "erros de validação"}`,
    );
  }

  const scope = await resolveScope(pkg.manifest.course_slug, pkg.manifest.position_slug);
  let importLogId: string | null = null;
  let architectureId = "";

  try {
    architectureId = await upsertArchitecture(
      pkg,
      scope.courseId,
      scope.positionId,
      null,
    );
    await deactivateOtherArchitectures(architectureId, scope.courseId, scope.positionId);

    const disciplineMap: IdMap = new Map();
    const topicMap: IdMap = new Map();
    const subtopicMap: IdMap = new Map();
    let changelogCount = 0;

    const existingDisciplines = await loadByCode("editorial_disciplines", architectureId);

    for (const [index, discipline] of pkg.disciplines.entries()) {
      const payload = {
        architecture_id: architectureId,
        code: discipline.id,
        slug: codeToSlug(discipline.id),
        name: discipline.nome,
        description: discipline.descricao ?? null,
        frequency_percent: discipline.frequencia_percentual ?? null,
        priority: discipline.prioridade ?? null,
        status: "PUBLICADO" as const,
        sort_order: index,
        notes: discipline.observacoes ?? null,
      };

      const existing = existingDisciplines.get(discipline.id);
      if (existing) {
        const { data, error } = await supabaseAdmin
          .from("editorial_disciplines")
          .update(payload)
          .eq("id", existing.id as string)
          .select("id")
          .single();
        if (error) throw new Error(error.message);
        disciplineMap.set(discipline.id, data.id);
        await supabaseAdmin.from("editorial_changelog").insert({
          architecture_id: architectureId,
          entity_type: "DISCIPLINE",
          entity_code: discipline.id,
          entity_id: data.id,
          change_type: "UPDATED",
          previous_snapshot: existing,
          new_snapshot: payload,
        });
        changelogCount += 1;
      } else {
        const { data, error } = await supabaseAdmin
          .from("editorial_disciplines")
          .insert(payload)
          .select("id")
          .single();
        if (error) throw new Error(error.message);
        disciplineMap.set(discipline.id, data.id);
        await supabaseAdmin.from("editorial_changelog").insert({
          architecture_id: architectureId,
          entity_type: "DISCIPLINE",
          entity_code: discipline.id,
          entity_id: data.id,
          change_type: "CREATED",
          new_snapshot: payload,
        });
        changelogCount += 1;
      }
    }

    const existingTopics = await loadByCode("editorial_topics", architectureId);

    for (const [index, topic] of pkg.topics.entries()) {
      const disciplineId = disciplineMap.get(topic.disciplina_id);
      if (!disciplineId) {
        throw new Error(`Disciplina não resolvida para assunto ${topic.id}`);
      }

      const payload = {
        architecture_id: architectureId,
        discipline_id: disciplineId,
        code: topic.id,
        slug: codeToSlug(topic.id),
        name: topic.nome,
        description: topic.descricao ?? null,
        status: "PUBLICADO" as const,
        sort_order: index,
      };

      const existing = existingTopics.get(topic.id);
      if (existing) {
        const { data, error } = await supabaseAdmin
          .from("editorial_topics")
          .update(payload)
          .eq("id", existing.id as string)
          .select("id")
          .single();
        if (error) throw new Error(error.message);
        topicMap.set(topic.id, data.id);
        changelogCount += 1;
      } else {
        const { data, error } = await supabaseAdmin
          .from("editorial_topics")
          .insert(payload)
          .select("id")
          .single();
        if (error) throw new Error(error.message);
        topicMap.set(topic.id, data.id);
        changelogCount += 1;
      }
    }

    const existingSubtopics = await loadByCode("editorial_subtopics", architectureId);

    for (const [index, subtopic] of pkg.subtopics.entries()) {
      const topicId = topicMap.get(subtopic.assunto_id);
      if (!topicId) {
        throw new Error(`Assunto não resolvido para subassunto ${subtopic.id}`);
      }

      const payload = {
        architecture_id: architectureId,
        topic_id: topicId,
        code: subtopic.id,
        slug: subtopic.slug,
        name: subtopic.nome,
        description: subtopic.descricao ?? null,
        status: "PUBLICADO" as const,
        sort_order: index,
      };

      const existing = existingSubtopics.get(subtopic.id);
      if (existing) {
        const { data, error } = await supabaseAdmin
          .from("editorial_subtopics")
          .update(payload)
          .eq("id", existing.id as string)
          .select("id")
          .single();
        if (error) throw new Error(error.message);
        subtopicMap.set(subtopic.id, data.id);
        changelogCount += 1;
      } else {
        const { data, error } = await supabaseAdmin
          .from("editorial_subtopics")
          .insert(payload)
          .select("id")
          .single();
        if (error) throw new Error(error.message);
        subtopicMap.set(subtopic.id, data.id);
        changelogCount += 1;
      }
    }

    const existingKeywords = await loadByCode("editorial_keywords", architectureId);

    for (const keyword of pkg.keywords) {
      const subtopicId = subtopicMap.get(keyword.subassunto_id);
      if (!subtopicId) {
        throw new Error(`Subassunto não resolvido para palavra-chave ${keyword.id}`);
      }

      const subtopic = pkg.subtopics.find((s) => s.id === keyword.subassunto_id);
      const topicId = subtopic ? topicMap.get(subtopic.assunto_id) : undefined;
      if (!topicId) {
        throw new Error(`Assunto não resolvido para palavra-chave ${keyword.id}`);
      }

      const payload = {
        architecture_id: architectureId,
        topic_id: topicId,
        subtopic_id: subtopicId,
        code: keyword.id,
        term: keyword.palavra,
        weight: keyword.peso,
        keyword_type: keyword.tipo,
        status: "PUBLICADO" as const,
      };

      const existing = existingKeywords.get(keyword.id);
      if (existing) {
        const { error } = await supabaseAdmin
          .from("editorial_keywords")
          .update(payload)
          .eq("id", existing.id as string);
        if (error) throw new Error(error.message);
        changelogCount += 1;
      } else {
        const { error } = await supabaseAdmin
          .from("editorial_keywords")
          .insert(payload);
        if (error) throw new Error(error.message);
        changelogCount += 1;
      }
    }

    const existingRules = await loadByCode("editorial_rules", architectureId);

    for (const rule of pkg.rules) {
      const disciplineId = disciplineMap.get(rule.disciplina_id) ?? null;
      const topicId = rule.assunto_id ? (topicMap.get(rule.assunto_id) ?? null) : null;
      const subtopicId = rule.subassunto_id
        ? (subtopicMap.get(rule.subassunto_id) ?? null)
        : null;

      const payload = {
        architecture_id: architectureId,
        code: rule.id,
        discipline_id: disciplineId,
        topic_id: topicId,
        subtopic_id: subtopicId,
        trigger_terms: rule.se_encontrar,
        confidence_percent: rule.confianca_percentual,
        status: "PUBLICADO" as const,
        engine_version: pkg.manifest.engine_version,
      };

      const existing = existingRules.get(rule.id);
      if (existing) {
        const { error } = await supabaseAdmin
          .from("editorial_rules")
          .update(payload)
          .eq("id", existing.id as string);
        if (error) throw new Error(error.message);
        changelogCount += 1;
      } else {
        const { error } = await supabaseAdmin.from("editorial_rules").insert(payload);
        if (error) throw new Error(error.message);
        changelogCount += 1;
      }
    }

    const disciplineCodes = new Set(pkg.disciplines.map((d) => d.id));
    const topicCodes = new Set(pkg.topics.map((t) => t.id));
    const subtopicCodes = new Set(pkg.subtopics.map((s) => s.id));
    const keywordCodes = new Set(pkg.keywords.map((k) => k.id));
    const ruleCodes = new Set(pkg.rules.map((r) => r.id));

    let deprecated = 0;
    deprecated += await deprecateMissing(
      "editorial_rules",
      architectureId,
      ruleCodes,
      importLogId,
      "RULE",
    );
    deprecated += await deprecateMissing(
      "editorial_keywords",
      architectureId,
      keywordCodes,
      importLogId,
      "KEYWORD",
    );
    deprecated += await deprecateMissing(
      "editorial_subtopics",
      architectureId,
      subtopicCodes,
      importLogId,
      "SUBTOPIC",
    );
    deprecated += await deprecateMissing(
      "editorial_topics",
      architectureId,
      topicCodes,
      importLogId,
      "TOPIC",
    );
    deprecated += await deprecateMissing(
      "editorial_disciplines",
      architectureId,
      disciplineCodes,
      importLogId,
      "DISCIPLINE",
    );

    const durationMs = Date.now() - started;
    const recordCounts: ImportRecordCounts = {
      architectures: 1,
      disciplines: pkg.disciplines.length,
      topics: pkg.topics.length,
      subtopics: pkg.subtopics.length,
      keywords: pkg.keywords.length,
      rules: pkg.rules.length,
      deprecated,
      changelog: changelogCount + deprecated,
    };

    const { data: logRow, error: logError } = await supabaseAdmin
      .from("editorial_import_logs")
      .insert({
        architecture_id: architectureId,
        user_id: userId,
        package_path: pkg.path,
        engine_version: pkg.manifest.engine_version,
        architecture_version: pkg.manifest.architecture_version,
        imported_files: pkg.filesRead,
        duration_ms: durationMs,
        record_counts: recordCounts,
        status: "SUCCESS",
      })
      .select("id")
      .single();

    if (logError) throw new Error(logError.message);
    importLogId = logRow.id;

    return {
      success: true,
      logId: logRow.id,
      architectureId,
      durationMs,
      recordCounts,
      importedFiles: pkg.filesRead,
    };
  } catch (error) {
    const durationMs = Date.now() - started;
    const message = error instanceof Error ? error.message : "Erro desconhecido";

    await supabaseAdmin.from("editorial_import_logs").insert({
      architecture_id: architectureId || null,
      user_id: userId,
      package_path: pkg.path,
      engine_version: pkg.manifest.engine_version,
      architecture_version: pkg.manifest.architecture_version,
      imported_files: pkg.filesRead,
      duration_ms: durationMs,
      record_counts: {},
      status: "FAILED",
      error_message: message,
    });

    throw error;
  }
}
