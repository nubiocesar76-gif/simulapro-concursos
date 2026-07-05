/**
 * Utilitários do módulo de Importação.
 * Reutiliza parsers de @/lib/questions sem alterar outros módulos.
 */

import * as XLSX from "xlsx";
import { supabase } from "@/integrations/supabase/client";
import {
  buildQuestionMetadata,
  normalizeText,
  parseAlternativesText,
  DIFFICULTY_OPTIONS,
} from "@/lib/questions";

export type ImportRow = {
  statement: string;
  alternatives: string[] | null;
  correct_answer: string;
  subject: string;
  topic: string;
  board: string;
  exam: string;
  position: string;
  year: string | number | null;
  difficulty: string | null;
  explanation: string | null;
  image_url: string | null;
  bibliography: string | null;
  legal_reference: string | null;
};

export type ImportFieldIssue = {
  field: string;
  message: string;
  severity: "error" | "warning";
};

export type ImportInvalidRow = {
  line: number;
  row: ImportRow;
  errors: ImportFieldIssue[];
};

export type ImportDuplicateRow = {
  line: number;
  row: ImportRow;
  reason: string;
};

export type ImportValidRow = ImportRow & {
  __line: number;
  warnings: string[];
};

export type ImportReport = {
  totalLines: number;
  valid: ImportValidRow[];
  invalid: ImportInvalidRow[];
  duplicates: ImportDuplicateRow[];
  warnings: { line: number; field: string; message: string }[];
  missingColumns: string[];
  analysisMs: number;
  counts: {
    total: number;
    valid: number;
    invalid: number;
    duplicates: number;
    warnings: number;
  };
};

const REQUIRED_COLUMNS = [
  { keys: ["statement", "enunciado"], label: "statement" },
  { keys: ["alternatives", "alternativas"], label: "alternatives" },
  { keys: ["correct_answer", "gabarito"], label: "correct_answer" },
  { keys: ["subject", "disciplina"], label: "subject" },
] as const;

type RawRow = Record<string, unknown>;

function normalizeKey(key: string) {
  return key.trim().toLowerCase();
}

export function detectMissingColumns(rawRows: RawRow[], isJson: boolean): string[] {
  if (!rawRows.length) return REQUIRED_COLUMNS.map((c) => c.label);

  const keys = new Set(
    Object.keys(isJson ? (rawRows[0] ?? {}) : rawRows[0] ?? {}).map(normalizeKey),
  );

  return REQUIRED_COLUMNS
    .filter((col) => !col.keys.some((k) => keys.has(normalizeKey(k))))
    .map((col) => col.label);
}

export async function readImportFile(file: File): Promise<{ rows: RawRow[]; isJson: boolean }> {
  const ext = file.name.split(".").pop()?.toLowerCase();

  if (ext === "json") {
    const text = await file.text();
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed)) throw new Error("JSON deve ser um array de questões.");
    return { rows: parsed as RawRow[], isJson: true };
  }

  if (ext === "csv") {
    const text = await file.text();
    const wb = XLSX.read(text, { type: "string" });
    const ws = wb.Sheets[wb.SheetNames[0]];
    return { rows: XLSX.utils.sheet_to_json(ws, { defval: "" }) as RawRow[], isJson: false };
  }

  if (ext === "xlsx" || ext === "xls") {
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, { type: "array" });
    const ws = wb.Sheets[wb.SheetNames[0]];
    return { rows: XLSX.utils.sheet_to_json(ws, { defval: "" }) as RawRow[], isJson: false };
  }

  throw new Error("Formato não suportado. Use CSV, XLSX ou JSON.");
}

export function mapImportRow(raw: RawRow): ImportRow {
  const get = (...names: string[]) => {
    for (const name of names) {
      const direct = raw[name];
      if (direct !== undefined && direct !== null && String(direct).trim() !== "") return direct;
      const found = Object.entries(raw).find(([k]) => normalizeKey(k) === normalizeKey(name));
      if (found && String(found[1]).trim() !== "") return found[1];
    }
    return "";
  };

  const alternatives = parseAlternativesText(get("alternatives", "alternativas"));

  return {
    statement: normalizeText(get("statement", "enunciado")),
    alternatives,
    correct_answer: normalizeText(get("correct_answer", "gabarito")),
    subject: normalizeText(get("subject", "disciplina")),
    topic: normalizeText(get("topic", "assunto")),
    board: normalizeText(get("board", "banca")),
    exam: normalizeText(get("exam", "concurso")),
    position: normalizeText(get("position", "cargo")),
    year: (() => {
      const rawYear = get("year", "ano");
      if (rawYear === "" || rawYear == null) return null;
      return typeof rawYear === "number" ? rawYear : String(rawYear);
    })(),
    difficulty: normalizeText(get("difficulty", "dificuldade")) || null,
    explanation: normalizeText(get("explanation", "explicacao", "explicação")) || null,
    image_url: normalizeText(get("image_url", "imagem")) || null,
    bibliography: normalizeText(get("bibliography", "bibliografia")) || null,
    legal_reference: normalizeText(get("legal_reference", "referencia_legal", "referência_legal")) || null,
  };
}

function extractAlternativeLetters(alternatives: string[]): string[] {
  return alternatives.map((alt, index) => {
    const match = alt.match(/^([A-Z])\)/i);
    return (match?.[1] ?? String.fromCharCode(65 + index)).toUpperCase();
  });
}

function validateImportRow(
  row: ImportRow,
  taxonomy: {
    subjects: Set<string>;
    boards: Set<string>;
  },
): { errors: ImportFieldIssue[]; warnings: string[] } {
  const errors: ImportFieldIssue[] = [];
  const warnings: string[] = [];

  if (!row.statement) errors.push({ field: "statement", message: "Enunciado obrigatório.", severity: "error" });
  else if (row.statement.length < 10) {
    errors.push({ field: "statement", message: "Enunciado deve ter pelo menos 10 caracteres.", severity: "error" });
  }

  if (!row.alternatives?.length) {
    errors.push({ field: "alternatives", message: "Não foi possível ler as alternativas.", severity: "error" });
  } else if (row.alternatives.length < 2) {
    errors.push({ field: "alternatives", message: "Mínimo de 2 alternativas.", severity: "error" });
  }

  const letters = row.alternatives ? extractAlternativeLetters(row.alternatives) : [];

  if (!row.correct_answer) {
    errors.push({ field: "correct_answer", message: "Gabarito obrigatório.", severity: "error" });
  } else if (!/^[A-Z]$/i.test(row.correct_answer)) {
    errors.push({ field: "correct_answer", message: "Gabarito deve ser uma letra (A, B, C...).", severity: "error" });
  } else if (letters.length && !letters.includes(row.correct_answer.toUpperCase())) {
    errors.push({
      field: "correct_answer",
      message: `Gabarito "${row.correct_answer.toUpperCase()}" não corresponde às alternativas (${letters.join(", ")}).`,
      severity: "error",
    });
  }

  if (!row.subject) {
    errors.push({ field: "subject", message: "Disciplina obrigatória.", severity: "error" });
  } else if (!taxonomy.subjects.has(row.subject.toLowerCase())) {
    warnings.push(`Disciplina "${row.subject}" será criada na aplicação.`);
  }

  if (row.topic && !row.subject) {
    errors.push({ field: "topic", message: "Assunto informado sem disciplina.", severity: "error" });
  } else if (row.topic) {
    warnings.push(`Assunto "${row.topic}" será criado ou vinculado na aplicação.`);
  }

  if (row.board && !taxonomy.boards.has(row.board.toLowerCase())) {
    warnings.push(`Banca "${row.board}" será criada na aplicação.`);
  }

  if (row.exam && !row.board) {
    warnings.push("Concurso informado sem banca; o concurso será ignorado na aplicação.");
  } else if (row.exam && row.board) {
    warnings.push(`Concurso "${row.exam}" será criado ou vinculado na aplicação.`);
  }

  if (row.position) {
    warnings.push(`Cargo "${row.position}" será criado ou vinculado na aplicação.`);
  }

  if (row.year) {
    const year = Number(row.year);
    if (!Number.isInteger(year) || year < 1900 || year > 2100) {
      errors.push({ field: "year", message: "Ano inválido (use 1900–2100).", severity: "error" });
    }
  }

  if (row.difficulty && !DIFFICULTY_OPTIONS.includes(row.difficulty as (typeof DIFFICULTY_OPTIONS)[number])) {
    warnings.push(`Dificuldade "${row.difficulty}" não está na lista padrão (Fácil, Média, Difícil).`);
  }

  return { errors, warnings };
}

async function loadTaxonomySets() {
  const [subjects, boards, existing] = await Promise.all([
    supabase.from("subjects").select("name"),
    supabase.from("boards").select("name"),
    supabase.from("questions").select("statement"),
  ]);

  return {
    subjects: new Set((subjects.data ?? []).map((s) => s.name.toLowerCase())),
    boards: new Set((boards.data ?? []).map((b) => b.name.toLowerCase())),
    dbStatements: new Set(
      (existing.data ?? []).map((q) => (q.statement as string).slice(0, 200).toLowerCase()),
    ),
  };
}

export async function validateImportFile(file: File): Promise<ImportReport> {
  const t0 = performance.now();
  const { rows: rawRows, isJson } = await readImportFile(file);
  const missingColumns = detectMissingColumns(rawRows, isJson);

  if (missingColumns.length) {
    return {
      totalLines: rawRows.length,
      valid: [],
      invalid: [],
      duplicates: [],
      warnings: [],
      missingColumns,
      analysisMs: Math.round(performance.now() - t0),
      counts: { total: rawRows.length, valid: 0, invalid: 0, duplicates: 0, warnings: 0 },
    };
  }

  const taxonomy = await loadTaxonomySets();
  const valid: ImportValidRow[] = [];
  const invalid: ImportInvalidRow[] = [];
  const duplicates: ImportDuplicateRow[] = [];
  const allWarnings: { line: number; field: string; message: string }[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < rawRows.length; i++) {
    const line = isJson ? i + 1 : i + 2;
    const row = mapImportRow(rawRows[i]);
    const { errors, warnings } = validateImportRow(row, taxonomy);

    warnings.forEach((msg) => {
      const field = msg.includes("Disciplina") ? "subject"
        : msg.includes("Assunto") ? "topic"
        : msg.includes("Banca") ? "board"
        : msg.includes("Concurso") ? "exam"
        : msg.includes("Cargo") ? "position"
        : msg.includes("Dificuldade") ? "difficulty"
        : "taxonomy";
      allWarnings.push({ line, field, message: msg });
    });

    const errorIssues = errors.filter((e) => e.severity === "error");
    if (errorIssues.length) {
      invalid.push({ line, row, errors: errorIssues });
      continue;
    }

    const key = row.statement.slice(0, 200).toLowerCase();
    if (seen.has(key)) {
      duplicates.push({ line, row, reason: "Duplicada no arquivo" });
      continue;
    }
    if (taxonomy.dbStatements.has(key)) {
      duplicates.push({ line, row, reason: "Já existe no banco" });
      continue;
    }

    seen.add(key);
    valid.push({ ...row, __line: line, warnings });
  }

  return {
    totalLines: rawRows.length,
    valid,
    invalid,
    duplicates,
    warnings: allWarnings,
    missingColumns: [],
    analysisMs: Math.round(performance.now() - t0),
    counts: {
      total: rawRows.length,
      valid: valid.length,
      invalid: invalid.length,
      duplicates: duplicates.length,
      warnings: allWarnings.length,
    },
  };
}

async function resolveByName(
  table: string,
  name: string,
  extra: Record<string, string | null> = {},
): Promise<string | null> {
  if (!name) return null;

  let q = supabase.from(table as "subjects").select("id").ilike("name", name);
  for (const [k, v] of Object.entries(extra)) {
    if (v != null) q = q.eq(k, v);
  }
  const { data: found } = await q.maybeSingle();
  if (found) return found.id;

  const { data: created, error } = await supabase
    .from(table as "subjects")
    .insert({ name, ...extra } as never)
    .select("id")
    .single();
  if (error) throw error;
  return created.id;
}

export async function applyImportBatch(batchId: string): Promise<{ count: number; questionIds: string[] }> {
  const { data: batch, error } = await supabase
    .from("import_batches")
    .select("*, packages(course_id)")
    .eq("id", batchId)
    .single();
  if (error) throw error;
  if (batch.status === "applied") throw new Error("Lote já aplicado.");
  if (batch.status === "cancelled") throw new Error("Lote cancelado.");

  const report = (batch.report ?? {}) as Record<string, unknown>;
  const rows = (report.rows ?? []) as ImportValidRow[];
  if (!rows.length) throw new Error("Sem linhas válidas para aplicar.");

  const courseIdOfPkg = (batch.packages as { course_id?: string } | null)?.course_id
    ?? (report.course_id as string | null)
    ?? null;

  const insertedIds: string[] = [];

  try {
    for (const r of rows) {
      const subject_id = await resolveByName("subjects", r.subject);
      const topic_id = r.topic ? await resolveByName("topics", r.topic, { subject_id: subject_id! }) : null;
      const board_id = r.board ? await resolveByName("boards", r.board) : null;
      const exam_id = r.exam && board_id
        ? await resolveByName("exams", r.exam, { board_id })
        : null;
      const position_id = r.position && courseIdOfPkg
        ? await resolveByName("positions", r.position, { course_id: courseIdOfPkg })
        : null;

      const payload = {
        package_id: batch.package_id,
        package_version_id: batch.package_version_id,
        subject_id,
        topic_id,
        board_id,
        exam_id,
        position_id,
        statement: r.statement,
        alternatives: r.alternatives,
        correct_answer: String(r.correct_answer).toUpperCase(),
        explanation: r.explanation,
        difficulty: r.difficulty,
        year: r.year ? Number(r.year) || null : null,
        metadata: buildQuestionMetadata({
          image_url: r.image_url ?? "",
          bibliography: r.bibliography ?? "",
          legal_reference: r.legal_reference ?? "",
        }),
      };

      const { data: created, error: insertError } = await supabase
        .from("questions")
        .insert(payload)
        .select("id")
        .single();
      if (insertError) throw insertError;
      insertedIds.push(created.id);
    }

    await supabase
      .from("import_batches")
      .update({
        status: "applied",
        report: {
          ...report,
          applied_at: new Date().toISOString(),
          applied_count: insertedIds.length,
          applied_question_ids: insertedIds,
        },
      })
      .eq("id", batchId);

    return { count: insertedIds.length, questionIds: insertedIds };
  } catch (err) {
    if (insertedIds.length) {
      await supabase.from("questions").delete().in("id", insertedIds);
    }
    throw err;
  }
}

export const IMPORT_COLUMN_HELP = [
  "Obrigatórias: statement, alternatives, correct_answer, subject",
  "Opcionais: topic, board, exam, position, year, difficulty, explanation, image_url, bibliography, legal_reference",
  "Aliases em português: enunciado, alternativas, gabarito, disciplina, assunto, banca, concurso, cargo, ano, dificuldade, explicacao",
].join(" · ");
