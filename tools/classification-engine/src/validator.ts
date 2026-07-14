import type { TaxonomyIndex, TaxonomyRecord } from "../../taxonomy-engine/src/types.ts";
import {
  findBoard,
  findContest,
  findPosition,
  findSubject,
  findTopic,
} from "../../taxonomy-engine/src/lookup.ts";
import { findByName } from "../../taxonomy-engine/src/search.ts";
import type {
  ClassificationEntry,
  ClassificationIssue,
  EditorialRulesConfig,
  LoadedClassificationInput,
  RawQuestionRef,
} from "./types.ts";
import {
  EDITORIAL_RULE_IDS,
  findDuplicateKeywords,
  isKeywordFormatValid,
  isLegacySubjectSlug,
  isValidDifficulty,
  isValidYear,
} from "./rules.ts";

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .trim();
}

function issue(
  question: number | null,
  severity: ClassificationIssue["severity"],
  code: ClassificationIssue["code"],
  message: string,
  suggestion: string,
  ruleId?: string,
): ClassificationIssue {
  return { question, severity, code, message, suggestion, ...(ruleId ? { ruleId } : {}) };
}

function resolveByNameOrSlug(
  index: TaxonomyIndex,
  value: string,
  kind: TaxonomyRecord["kind"],
): TaxonomyRecord | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  const bySlug = index.bySlug.get(trimmed) ?? index.bySlug.get(trimmed.toLowerCase());
  const slugMatch = bySlug?.find((r) => r.kind === kind);
  if (slugMatch) return slugMatch;

  const norm = normalize(trimmed);
  const pool = index.byKind.get(kind) ?? [];
  const exact = pool.find((r) => normalize(r.name) === norm || r.slug === norm);
  if (exact) return exact;

  const searchResults = findByName(index, trimmed, kind);
  return searchResults[0]?.record;
}

function resolveSubject(index: TaxonomyIndex, value: string) {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const bySlug = findSubject(index, { subjectSlug: trimmed });
  if (bySlug) return bySlug;
  return resolveByNameOrSlug(index, trimmed, "subject");
}

function resolveTopicGlobal(index: TaxonomyIndex, value: string) {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const bySlug = index.bySlug.get(trimmed)?.find((r) => r.kind === "topic");
  if (bySlug) return bySlug;
  return resolveByNameOrSlug(index, trimmed, "topic");
}

function resolveTopic(index: TaxonomyIndex, subject: TaxonomyRecord | undefined, value: string) {
  const trimmed = value.trim();
  if (!trimmed || !subject || subject.kind !== "subject") return undefined;

  const byComposite = findTopic(index, {
    courseSlug: subject.courseSlug,
    subjectSlug: subject.slug,
    topicSlug: trimmed,
  });
  if (byComposite) return byComposite;

  const pool = index.byKind.get("topic") ?? [];
  const norm = normalize(trimmed);
  return pool.find(
    (r) =>
      r.kind === "topic" &&
      r.subjectSlug === subject.slug &&
      (r.slug === trimmed || normalize(r.name) === norm),
  );
}

function resolveBoard(index: TaxonomyIndex, value: string) {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return findBoard(index, { slug: trimmed }) ?? findBoard(index, { name: trimmed }) ?? resolveByNameOrSlug(index, trimmed, "board");
}

function resolveContest(index: TaxonomyIndex, board: TaxonomyRecord | undefined, value: string) {
  const trimmed = value.trim();
  if (!trimmed || !board || board.kind !== "board") return undefined;

  const byComposite = findContest(index, { boardSlug: board.slug, contestSlug: trimmed });
  if (byComposite) return byComposite;

  const pool = index.byKind.get("contest") ?? [];
  const norm = normalize(trimmed);
  return pool.find(
    (r) =>
      r.kind === "contest" &&
      r.boardSlug === board.slug &&
      (r.slug === trimmed || normalize(r.name) === norm),
  );
}

function resolvePosition(index: TaxonomyIndex, value: string) {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const pool = index.byKind.get("position") ?? [];
  const norm = normalize(trimmed);
  return (
    pool.find((r) => r.slug === trimmed || normalize(r.name) === norm) ??
    resolveByNameOrSlug(index, trimmed, "position")
  );
}

function validateAlignment(
  raw: RawQuestionRef[],
  classifications: ClassificationEntry[],
  issues: ClassificationIssue[],
): Map<number, RawQuestionRef> {
  const rawByNumber = new Map(raw.map((q) => [q.number, q]));

  if (raw.length !== classifications.length) {
    issues.push(
      issue(
        null,
        "ERROR",
        "CLASSIFICACAO_AUSENTE",
        `Quantidade divergente: ${raw.length} questões no raw, ${classifications.length} na classificação.`,
        "Gere classification.json com uma entrada por questão do raw.",
      ),
    );
  }

  for (const q of raw) {
    if (!classifications.some((c) => c.question === q.number)) {
      issues.push(
        issue(
          q.number,
          "ERROR",
          "CLASSIFICACAO_AUSENTE",
          `Questão ${q.number}: presente no raw mas ausente em classification.json.`,
          "Adicione entrada correspondente em classification.json.",
        ),
      );
    }
  }

  for (const c of classifications) {
    if (!rawByNumber.has(c.question)) {
      issues.push(
        issue(
          c.question,
          "ERROR",
          "QUESTAO_ORFA",
          `Questão ${c.question}: presente em classification.json mas ausente no raw.`,
          "Remova a entrada ou corrija o número da questão.",
        ),
      );
    }
  }

  return rawByNumber;
}

function validateEntry(
  entry: ClassificationEntry,
  raw: RawQuestionRef | undefined,
  index: TaxonomyIndex,
  editorial: EditorialRulesConfig,
  issues: ClassificationIssue[],
): void {
  const q = entry.question;
  const skipRequired = raw?.status === "ANULADA";

  if (skipRequired) return;

  if (!entry.subject.trim()) {
    issues.push(
      issue(
        q,
        "ERROR",
        "DISCIPLINA_INEXISTENTE",
        `Questão ${q}: disciplina (subject) não informada.`,
        "Preencha subject com slug ou nome oficial da taxonomia.",
        EDITORIAL_RULE_IDS.SINGLE_SUBJECT,
      ),
    );
  } else {
    const subject = resolveSubject(index, entry.subject);
    if (!subject) {
      issues.push(
        issue(
          q,
          "ERROR",
          "DISCIPLINA_INEXISTENTE",
          `Questão ${q}: disciplina "${entry.subject}" não encontrada na taxonomia oficial.`,
          "Consulte tools/taxonomy-engine/taxonomy.index.json ou docs/seeds/taxonomy.json.",
          EDITORIAL_RULE_IDS.VALID_TAXONOMY_SLUG,
        ),
      );
    } else {
      if (isLegacySubjectSlug(subject.slug, editorial)) {
        issues.push(
          issue(
            q,
            "ERROR",
            "REGRA_EDITORIAL_DESCUMPRIDA",
            `Questão ${q}: disciplina "${subject.slug}" está mesclada/inativa na arquitetura editorial V1.1.`,
            "Use a disciplina sobrevivente correspondente (ver docs/editorial/classification/02-subjects.md).",
            EDITORIAL_RULE_IDS.NO_LEGACY_SUBJECT,
          ),
        );
      }

      if (!entry.topic.trim()) {
        issues.push(
          issue(
            q,
            "ERROR",
            "ASSUNTO_INEXISTENTE",
            `Questão ${q}: assunto (topic) não informado.`,
            "Preencha topic com slug ou nome oficial vinculado à disciplina.",
            EDITORIAL_RULE_IDS.SINGLE_TOPIC,
          ),
        );
      } else {
        const topicGlobal = resolveTopicGlobal(index, entry.topic);
        const topic =
          subject && subject.kind === "subject"
            ? resolveTopic(index, subject, entry.topic) ?? topicGlobal
            : topicGlobal;

        if (!topic) {
          issues.push(
            issue(
              q,
              "ERROR",
              "ASSUNTO_INEXISTENTE",
              `Questão ${q}: assunto "${entry.topic}" não encontrado na taxonomia oficial.`,
              "Verifique slug/nome em docs/seeds/taxonomy.json.",
              EDITORIAL_RULE_IDS.VALID_TAXONOMY_SLUG,
            ),
          );
        } else if (
          subject &&
          subject.kind === "subject" &&
          topic.kind === "topic" &&
          topic.subjectSlug !== subject.slug
        ) {
          issues.push(
            issue(
              q,
              "ERROR",
              "ASSUNTO_FORA_DA_DISCIPLINA",
              `Questão ${q}: assunto "${entry.topic}" pertence à disciplina "${topic.subjectName}" (${topic.subjectSlug}), não a "${entry.subject}".`,
              `Altere subject para ${topic.subjectSlug} ou escolha assunto de ${subject.name}.`,
              EDITORIAL_RULE_IDS.TOPIC_BELONGS_SUBJECT,
            ),
          );
        }
      }
    }
  }

  if (!entry.board.trim()) {
    issues.push(
      issue(
        q,
        "ERROR",
        "BANCA_INEXISTENTE",
        `Questão ${q}: banca (board) não informada.`,
        "Preencha board com nome ou slug oficial.",
      ),
    );
  } else {
    const board = resolveBoard(index, entry.board);
    if (!board) {
      issues.push(
        issue(
          q,
          "ERROR",
          "BANCA_INEXISTENTE",
          `Questão ${q}: banca "${entry.board}" não encontrada na taxonomia.`,
          "Consulte docs/editorial/classification/01-boards.md.",
        ),
      );
    } else if (entry.contest.trim()) {
      const contest = resolveContest(index, board, entry.contest);
      if (!contest) {
        issues.push(
          issue(
            q,
            "ERROR",
            "CONCURSO_INEXISTENTE",
            `Questão ${q}: concurso "${entry.contest}" não encontrado para banca "${entry.board}".`,
            "Use slug/nome de concurso cadastrado com boardSlug correspondente.",
          ),
        );
      }
    }
  }

  if (!entry.contest.trim()) {
    issues.push(
      issue(
        q,
        "ERROR",
        "CONCURSO_INEXISTENTE",
        `Questão ${q}: concurso (contest) não informado.`,
        "Preencha contest com nome ou slug oficial.",
      ),
    );
  }

  if (!entry.position.trim()) {
    issues.push(
      issue(
        q,
        "ERROR",
        "CARGO_INEXISTENTE",
        `Questão ${q}: cargo (position) não informado.`,
        "Preencha position com slug ou nome oficial (ex.: Enfermeiro).",
      ),
    );
  } else {
    const position = resolvePosition(index, entry.position);
    if (!position) {
      issues.push(
        issue(
          q,
          "ERROR",
          "CARGO_INEXISTENTE",
          `Questão ${q}: cargo "${entry.position}" não encontrado na taxonomia.`,
          "Consulte cargos em docs/seeds/taxonomy.json.",
        ),
      );
    }
  }

  if (!entry.year.trim() || !isValidYear(entry.year, editorial)) {
    issues.push(
      issue(
        q,
        "ERROR",
        "ANO_INVALIDO",
        `Questão ${q}: ano "${entry.year}" inválido.`,
        `Informe ano com 4 dígitos entre ${editorial.yearMin} e ${editorial.yearMax}.`,
      ),
    );
  }

  if (!entry.difficulty.trim() || !isValidDifficulty(entry.difficulty, editorial)) {
    issues.push(
      issue(
        q,
        "ERROR",
        "DIFICULDADE_INVALIDA",
        `Questão ${q}: dificuldade "${entry.difficulty}" inválida.`,
        `Use: ${editorial.difficultyValues.join(", ")}.`,
      ),
    );
  }

  if (!entry.explanation.trim()) {
    issues.push(
      issue(
        q,
        "ERROR",
        "EXPLICAÇÃO_VAZIA",
        `Questão ${q}: explicação vazia.`,
        "Redija explicação conforme docs/editorial/classification/06-explanation.md.",
      ),
    );
  }

  const duplicates = findDuplicateKeywords(entry.keywords);
  for (const dup of duplicates) {
    issues.push(
      issue(
        q,
        "ERROR",
        "KEYWORD_DUPLICADA",
        `Questão ${q}: keyword duplicada "${dup}".`,
        "Remova duplicatas — uma forma canônica por conceito.",
      ),
    );
  }

  for (const kw of entry.keywords) {
    if (!isKeywordFormatValid(kw, editorial)) {
      issues.push(
        issue(
          q,
          "ERROR",
          "KEYWORD_FORA_DO_PADRÃO",
          `Questão ${q}: keyword fora do padrão editorial: "${kw}".`,
          "Use minúsculas, siglas conhecidas, máx. 80 caracteres, sem frases longas (ver 04-keywords.md).",
        ),
      );
    }
  }

  const contentKeywords = entry.keywords.filter(
    (kw) => !editorial.allowedKeywordPrefixes.some((p) => kw.startsWith(p)),
  );
  if (contentKeywords.length < editorial.keywordsMin) {
    issues.push(
      issue(
        q,
        "WARNING",
        "REGRA_EDITORIAL_DESCUMPRIDA",
        `Questão ${q}: apenas ${contentKeywords.length} keyword(s) de conteúdo (mínimo recomendado: ${editorial.keywordsMin}).`,
        "Adicione keywords conforme docs/editorial/classification/04-keywords.md.",
        EDITORIAL_RULE_IDS.KEYWORDS_COUNT,
      ),
    );
  }
  if (contentKeywords.length > editorial.keywordsMax) {
    issues.push(
      issue(
        q,
        "WARNING",
        "REGRA_EDITORIAL_DESCUMPRIDA",
        `Questão ${q}: ${contentKeywords.length} keywords de conteúdo (máximo recomendado: ${editorial.keywordsMax}).`,
        "Reduza para termos mais específicos.",
        EDITORIAL_RULE_IDS.KEYWORDS_COUNT,
      ),
    );
  }
}

export function validateClassification(
  loaded: LoadedClassificationInput,
  index: TaxonomyIndex,
  editorial: EditorialRulesConfig,
): ClassificationIssue[] {
  const issues: ClassificationIssue[] = [];

  if (!editorial.loaded) {
    issues.push(
      issue(
        null,
        "WARNING",
        "REGRA_EDITORIAL_DESCUMPRIDA",
        `Diretório editorial não encontrado: ${editorial.editorialDir}.`,
        "Verifique docs/editorial/classification/ — validação usa regras codificadas em rules.ts.",
      ),
    );
  }

  const rawByNumber = validateAlignment(loaded.raw, loaded.classifications, issues);
  const seenQuestions = new Set<number>();

  for (const entry of loaded.classifications) {
    if (seenQuestions.has(entry.question)) {
      issues.push(
        issue(
          entry.question,
          "ERROR",
          "JSON_INVÁLIDO",
          `Questão ${entry.question}: número repetido em classification.json.`,
          "Mantenha uma única entrada por question.",
        ),
      );
    }
    seenQuestions.add(entry.question);
    validateEntry(entry, rawByNumber.get(entry.question), index, editorial, issues);
  }

  return issues;
}

export function countQuestionStatuses(raw: RawQuestionRef[]) {
  return {
    anuladas: raw.filter((q) => q.status === "ANULADA").length,
    active: raw.filter((q) => q.status !== "ANULADA").length,
  };
}

export function questionHasError(issues: ClassificationIssue[], question: number): boolean {
  return issues.some((i) => i.question === question && i.severity === "ERROR");
}

export function questionHasWarning(issues: ClassificationIssue[], question: number): boolean {
  return issues.some((i) => i.question === question && i.severity === "WARNING");
}
