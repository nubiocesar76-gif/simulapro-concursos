import type { EditorialPackage, ValidationIssue } from "./types";
import { codeToSlug, slugifyEditorial } from "./slug";

function checkDuplicateIds(
  items: { id: string }[],
  entity: string,
  issues: ValidationIssue[],
) {
  const seen = new Map<string, number>();
  for (const item of items) {
    const id = item.id?.trim();
    if (!id) {
      issues.push({
        level: "error",
        code: "MISSING_ID",
        message: `${entity}: registro sem id.`,
        entity,
      });
      continue;
    }
    seen.set(id, (seen.get(id) ?? 0) + 1);
  }
  for (const [id, count] of seen) {
    if (count > 1) {
      issues.push({
        level: "error",
        code: "DUPLICATE_ID",
        message: `${entity}: id duplicado "${id}" (${count}x).`,
        entity,
        ref: id,
      });
    }
  }
}

function checkDuplicateSlugs(
  items: { slug: string }[],
  entity: string,
  issues: ValidationIssue[],
) {
  const seen = new Map<string, number>();
  for (const item of items) {
    const slug = item.slug?.trim().toLowerCase();
    if (!slug) {
      issues.push({
        level: "error",
        code: "MISSING_SLUG",
        message: `${entity}: registro sem slug.`,
        entity,
      });
      continue;
    }
    seen.set(slug, (seen.get(slug) ?? 0) + 1);
  }
  for (const [slug, count] of seen) {
    if (count > 1) {
      issues.push({
        level: "error",
        code: "DUPLICATE_SLUG",
        message: `${entity}: slug duplicado "${slug}" (${count}x).`,
        entity,
        ref: slug,
      });
    }
  }
}

export function validateEditorialPackage(pkg: EditorialPackage): {
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
} {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];

  const { manifest } = pkg;

  if (!manifest.engine_version?.trim()) {
    errors.push({
      level: "error",
      code: "MISSING_ENGINE_VERSION",
      message: "Metadata: engine_version ausente no manifest.",
    });
  }
  if (!manifest.architecture_version?.trim()) {
    errors.push({
      level: "error",
      code: "MISSING_ARCHITECTURE_VERSION",
      message: "Metadata: architecture_version ausente no manifest.",
    });
  }
  if (!manifest.course_slug?.trim()) {
    errors.push({
      level: "error",
      code: "MISSING_COURSE",
      message: "Metadata: course_slug ausente no manifest.",
    });
  }
  if (!manifest.position_slug?.trim()) {
    errors.push({
      level: "error",
      code: "MISSING_POSITION",
      message: "Metadata: position_slug ausente no manifest.",
    });
  }
  if (!manifest.architecture_slug?.trim()) {
    errors.push({
      level: "error",
      code: "MISSING_ARCHITECTURE_SLUG",
      message: "Metadata: architecture_slug ausente no manifest.",
    });
  }
  if (!manifest.architecture_name?.trim()) {
    errors.push({
      level: "error",
      code: "MISSING_ARCHITECTURE_NAME",
      message: "Metadata: architecture_name ausente no manifest.",
    });
  }

  checkDuplicateIds(pkg.disciplines, "Disciplinas", errors);
  checkDuplicateIds(pkg.topics, "Assuntos", errors);
  checkDuplicateIds(pkg.subtopics, "Subassuntos", errors);
  checkDuplicateIds(pkg.keywords, "Palavras-chave", errors);
  checkDuplicateIds(pkg.rules, "Regras", errors);

  const disciplineSlugs = pkg.disciplines.map((d) => ({
    slug: codeToSlug(d.id) || slugifyEditorial(d.nome),
  }));
  checkDuplicateSlugs(disciplineSlugs, "Disciplinas (slug derivado)", errors);

  const topicSlugs = pkg.topics.map((t) => ({
    slug: codeToSlug(t.id) || slugifyEditorial(t.nome),
  }));
  checkDuplicateSlugs(topicSlugs, "Assuntos (slug derivado)", errors);
  checkDuplicateSlugs(pkg.subtopics, "Subassuntos", errors);

  const disciplineIds = new Set(pkg.disciplines.map((d) => d.id));
  const topicIds = new Set(pkg.topics.map((t) => t.id));
  const subtopicIds = new Set(pkg.subtopics.map((s) => s.id));

  for (const topic of pkg.topics) {
    if (!disciplineIds.has(topic.disciplina_id)) {
      errors.push({
        level: "error",
        code: "BROKEN_REF",
        message: `Assunto "${topic.id}": disciplina inexistente "${topic.disciplina_id}".`,
        entity: "Assuntos",
        ref: topic.id,
      });
    }
  }

  for (const subtopic of pkg.subtopics) {
    if (!topicIds.has(subtopic.assunto_id)) {
      errors.push({
        level: "error",
        code: "BROKEN_REF",
        message: `Subassunto "${subtopic.id}": assunto inexistente "${subtopic.assunto_id}".`,
        entity: "Subassuntos",
        ref: subtopic.id,
      });
    }
  }

  for (const keyword of pkg.keywords) {
    if (!subtopicIds.has(keyword.subassunto_id)) {
      errors.push({
        level: "error",
        code: "ORPHAN_KEYWORD",
        message: `Palavra-chave "${keyword.id}": subassunto inexistente "${keyword.subassunto_id}".`,
        entity: "Palavras-chave",
        ref: keyword.id,
      });
    }
    if (!keyword.palavra?.trim()) {
      errors.push({
        level: "error",
        code: "INVALID_KEYWORD",
        message: `Palavra-chave "${keyword.id}": termo vazio.`,
        entity: "Palavras-chave",
        ref: keyword.id,
      });
    }
    if (keyword.peso < 0 || keyword.peso > 10) {
      errors.push({
        level: "error",
        code: "INVALID_KEYWORD",
        message: `Palavra-chave "${keyword.id}": peso fora do intervalo 0–10.`,
        entity: "Palavras-chave",
        ref: keyword.id,
      });
    }
    if (!["PRINCIPAL", "SECUNDARIA", "FRACA"].includes(keyword.tipo)) {
      errors.push({
        level: "error",
        code: "INVALID_KEYWORD",
        message: `Palavra-chave "${keyword.id}": tipo inválido "${keyword.tipo}".`,
        entity: "Palavras-chave",
        ref: keyword.id,
      });
    }
  }

  for (const rule of pkg.rules) {
    if (!disciplineIds.has(rule.disciplina_id)) {
      errors.push({
        level: "error",
        code: "BROKEN_REF",
        message: `Regra "${rule.id}": disciplina inexistente "${rule.disciplina_id}".`,
        entity: "Regras",
        ref: rule.id,
      });
    }
    if (rule.assunto_id && !topicIds.has(rule.assunto_id)) {
      errors.push({
        level: "error",
        code: "BROKEN_REF",
        message: `Regra "${rule.id}": assunto inexistente "${rule.assunto_id}".`,
        entity: "Regras",
        ref: rule.id,
      });
    }
    if (rule.subassunto_id && !subtopicIds.has(rule.subassunto_id)) {
      errors.push({
        level: "error",
        code: "BROKEN_REF",
        message: `Regra "${rule.id}": subassunto inexistente "${rule.subassunto_id}".`,
        entity: "Regras",
        ref: rule.id,
      });
    }
    if (!Array.isArray(rule.se_encontrar) || rule.se_encontrar.length === 0) {
      errors.push({
        level: "error",
        code: "INVALID_RULE",
        message: `Regra "${rule.id}": se_encontrar vazio ou inválido.`,
        entity: "Regras",
        ref: rule.id,
      });
    }
    if (
      typeof rule.confianca_percentual !== "number" ||
      rule.confianca_percentual < 0 ||
      rule.confianca_percentual > 100
    ) {
      errors.push({
        level: "error",
        code: "INVALID_RULE",
        message: `Regra "${rule.id}": confiança fora do intervalo 0–100.`,
        entity: "Regras",
        ref: rule.id,
      });
    }
  }

  for (const discipline of pkg.disciplines) {
    if (discipline.prioridade && !["ALTA", "MEDIA", "BAIXA"].includes(discipline.prioridade)) {
      warnings.push({
        level: "warning",
        code: "INVALID_PRIORITY",
        message: `Disciplina "${discipline.id}": prioridade desconhecida "${discipline.prioridade}".`,
        entity: "Disciplinas",
        ref: discipline.id,
      });
    }
  }

  return { errors, warnings };
}
