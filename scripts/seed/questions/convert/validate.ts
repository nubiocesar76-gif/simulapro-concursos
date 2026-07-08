import {
  ALTERNATIVE_COLUMNS,
  ALTERNATIVE_LETTERS,
} from "./columns.ts";
import type { RawRow } from "./parse.ts";
import { hasContest, hasTopic, type TaxonomySets } from "./taxonomy.ts";

export type ConvertIssue = {
  line: number;
  field: string;
  error: string;
};

function splitReferences(value: string) {
  if (!value) return [];
  return value
    .split(/[|;]/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function splitKeywords(value: string) {
  if (!value) return [];
  return value
    .split(/[,|]/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function parsePositiveInt(value: string, field: string, issues: ConvertIssue[], line: number) {
  if (!value) return undefined;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    issues.push({ line, field, error: `${field} deve ser um número inteiro positivo.` });
    return undefined;
  }
  return parsed;
}

export type ConvertedQuestionRow = {
  statement: string;
  alternatives: Array<{ letter: string; text: string }>;
  correctAnswer: string;
  position: string;
  board: string;
  contest: string;
  subject: string;
  topic: string;
  year: number;
  explanation: string;
  references: string[];
  keywords: string[];
  status: "ACTIVE" | "INACTIVE";
  source?: {
    organization?: string;
    exam?: string;
    page?: number;
    question?: number;
  };
};

export function validateRows(
  rows: RawRow[],
  sets: TaxonomySets,
  headerLine = 1,
): { issues: ConvertIssue[]; converted: ConvertedQuestionRow[] } {
  const issues: ConvertIssue[] = [];
  const converted: ConvertedQuestionRow[] = [];

  for (let index = 0; index < rows.length; index++) {
    const line = headerLine + 1 + index;
    const row = rows[index];
    const rowIssuesBefore = issues.length;

    const statement = row.statement ?? "";
    if (!statement) {
      issues.push({ line, field: "statement", error: "Enunciado é obrigatório." });
    } else if (statement.length < 10) {
      issues.push({ line, field: "statement", error: "Enunciado deve ter pelo menos 10 caracteres." });
    }

    const alternatives: Array<{ letter: string; text: string }> = [];
    for (let i = 0; i < ALTERNATIVE_COLUMNS.length; i++) {
      const field = ALTERNATIVE_COLUMNS[i];
      const letter = ALTERNATIVE_LETTERS[i];
      const text = row[field] ?? "";
      if (!text) {
        issues.push({ line, field, error: `Alternativa ${letter} é obrigatória.` });
      } else {
        alternatives.push({ letter, text });
      }
    }

    const correctAnswer = (row.correct_answer ?? "").trim().toUpperCase();
    if (!correctAnswer) {
      issues.push({ line, field: "correct_answer", error: "Gabarito é obrigatório." });
    } else if (!/^[A-E]$/.test(correctAnswer)) {
      issues.push({ line, field: "correct_answer", error: "Gabarito deve ser uma letra de A a E." });
    } else if (!alternatives.some((alt) => alt.letter === correctAnswer)) {
      issues.push({
        line,
        field: "correct_answer",
        error: `Gabarito "${correctAnswer}" não corresponde às alternativas informadas.`,
      });
    }

    const position = row.position ?? "";
    if (!position) {
      issues.push({ line, field: "position", error: "Cargo é obrigatório." });
    } else if (!sets.positions.has(position)) {
      issues.push({ line, field: "position", error: `Cargo "${position}" não existe na taxonomia.` });
    }

    const board = row.board ?? "";
    if (!board) {
      issues.push({ line, field: "board", error: "Banca é obrigatória." });
    } else if (!sets.boards.has(board)) {
      issues.push({ line, field: "board", error: `Banca "${board}" não existe na taxonomia.` });
    }

    const contest = row.contest ?? "";
    if (!contest) {
      issues.push({ line, field: "contest", error: "Concurso é obrigatório." });
    } else if (!board) {
      issues.push({ line, field: "contest", error: "Concurso informado sem banca válida." });
    } else if (!hasContest(sets, board, contest)) {
      issues.push({
        line,
        field: "contest",
        error: `Concurso "${contest}" não existe na banca "${board}".`,
      });
    }

    const subject = row.subject ?? "";
    if (!subject) {
      issues.push({ line, field: "subject", error: "Disciplina é obrigatória." });
    } else if (!sets.subjects.has(subject)) {
      issues.push({ line, field: "subject", error: `Disciplina "${subject}" não existe na taxonomia.` });
    }

    const topic = row.topic ?? "";
    if (!topic) {
      issues.push({ line, field: "topic", error: "Assunto é obrigatório." });
    } else if (!subject) {
      issues.push({ line, field: "topic", error: "Assunto informado sem disciplina válida." });
    } else if (!hasTopic(sets, subject, topic)) {
      issues.push({
        line,
        field: "topic",
        error: `Assunto "${topic}" não existe na disciplina "${subject}".`,
      });
    }

    const yearRaw = row.year ?? "";
    let year: number | null = null;
    if (!yearRaw) {
      issues.push({ line, field: "year", error: "Ano é obrigatório." });
    } else {
      year = Number(yearRaw);
      if (!Number.isInteger(year) || year < 1900 || year > 2100) {
        issues.push({ line, field: "year", error: "Ano deve ser um número inteiro entre 1900 e 2100." });
        year = null;
      }
    }

    const explanation = row.explanation ?? "";
    if (!explanation) {
      issues.push({ line, field: "explanation", error: "Explicação é obrigatória." });
    }

    const statusRaw = (row.status ?? "ACTIVE").trim().toUpperCase();
    if (statusRaw !== "ACTIVE" && statusRaw !== "INACTIVE") {
      issues.push({ line, field: "status", error: 'Status deve ser "ACTIVE" ou "INACTIVE".' });
    }

    const source: ConvertedQuestionRow["source"] = {};
    if (row.organization) source.organization = row.organization;
    if (row.exam) source.exam = row.exam;
    const page = parsePositiveInt(row.page ?? "", "page", issues, line);
    const question = parsePositiveInt(row.question ?? "", "question", issues, line);
    if (page != null) source.page = page;
    if (question != null) source.question = question;

    if (issues.length > rowIssuesBefore) continue;

    converted.push({
      statement,
      alternatives,
      correctAnswer,
      position,
      board,
      contest,
      subject,
      topic,
      year: year!,
      explanation,
      references: splitReferences(row.references ?? ""),
      keywords: splitKeywords(row.keywords ?? ""),
      status: statusRaw as "ACTIVE" | "INACTIVE",
      source: Object.keys(source).length ? source : undefined,
    });
  }

  return { issues, converted };
}

export function printConvertReport(issues: ConvertIssue[]) {
  console.error("\nRelatório de conversão — ERROS\n");
  console.error("Linha | Campo | Erro");
  console.error("------|-------|-----");
  for (const issue of issues) {
    console.error(`${String(issue.line).padStart(5)} | ${issue.field} | ${issue.error}`);
  }
  console.error(`\nTotal de erros: ${issues.length}`);
}
