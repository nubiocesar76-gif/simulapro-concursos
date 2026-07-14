import type { RawQuestion } from "./types.ts";
import { splitAlternativeMarkers, type AltLetter } from "./alternative-markers.ts";

const QUESTION_START_NUMBERED = /^(\d{1,3})\)\s*(.*)$/;
const QUESTION_START_LABELED = /^QUEST[ÃA]O\s+(\d{1,3})\s*[-–.]?\s*(.*)$/i;
const PAGE_MARKER = /^=== PAGE (\d+) ===$/;

interface Line {
  text: string;
  page: number;
}

function flattenLines(text: string): Line[] {
  const lines: Line[] = [];
  let currentPage = 1;
  for (const rawLine of text.split("\n")) {
    const pageMatch = rawLine.match(PAGE_MARKER);
    if (pageMatch) {
      currentPage = Number(pageMatch[1]);
      continue;
    }
    lines.push({ text: rawLine, page: currentPage });
  }
  return lines;
}

/**
 * Splits prova.txt into raw question blocks. Detects question boundaries by
 * "N) ..." or "QUESTÃO N ..." at the start of a line, and alternative
 * boundaries via splitAlternativeMarkers(), which supports both a single
 * alternative starting a line (classic single-column layout) and multiple
 * alternatives packed into the same physical line (two-column layout, e.g.
 * "a) ... c) ..." followed by "b) ... d) ...").
 *
 * Never invents missing text: a question with fewer than 2 detected
 * alternatives, or no detectable statement, is still emitted with
 * status REVIEW_REQUIRED and a warning explaining what's missing.
 */
export function parseProva(text: string): RawQuestion[] {
  const lines = flattenLines(text);
  const questions: RawQuestion[] = [];

  let current: RawQuestion | null = null;
  let currentAlt: AltLetter | null = null;
  let statementBuffer: string[] = [];
  let altBuffers: Partial<Record<AltLetter, string[]>> = {};

  function flushCurrent() {
    if (!current) return;
    current.statement = statementBuffer.join(" ").replace(/\s+/g, " ").trim();
    for (const key of ["A", "B", "C", "D", "E"] as const) {
      const buf = altBuffers[key];
      if (buf && buf.length) {
        current.alternatives[key] = buf.join(" ").replace(/\s+/g, " ").trim();
      }
    }

    const altCount = Object.keys(current.alternatives).length;
    if (!current.statement) {
      current.warnings.push("Enunciado vazio ou não detectado.");
      current.status = "REVIEW_REQUIRED";
    }
    if (altCount < 2) {
      current.warnings.push(`Apenas ${altCount} alternativa(s) detectada(s) — verificar layout do PDF.`);
      current.status = "REVIEW_REQUIRED";
    } else if (altCount !== 4 && altCount !== 5) {
      current.warnings.push(
        `Número incomum de alternativas (${altCount}) — esperado 4 (A-D) ou 5 (A-E).`,
      );
      current.status = "REVIEW_REQUIRED";
    } else {
      // Sanity check: for N alternatives we expect exactly A..(A+N-1) present,
      // e.g. A-D or A-E, never a gap like A,B,D (missing C).
      const expectedLetters = (["A", "B", "C", "D", "E"] as const).slice(0, altCount);
      const missing = expectedLetters.filter((l) => !current!.alternatives[l]);
      if (missing.length > 0) {
        current.warnings.push(
          `Alternativas não formam uma sequência contígua a partir de A (faltando: ${missing.join(", ")}).`,
        );
        current.status = "REVIEW_REQUIRED";
      }
    }

    questions.push(current);
    current = null;
    currentAlt = null;
    statementBuffer = [];
    altBuffers = {};
  }

  for (const line of lines) {
    const trimmed = line.text.trim();
    if (!trimmed) continue;

    const numberedMatch = trimmed.match(QUESTION_START_NUMBERED);
    const labeledMatch = trimmed.match(QUESTION_START_LABELED);
    const questionMatch = numberedMatch ?? labeledMatch;

    if (questionMatch) {
      flushCurrent();
      const number = Number(questionMatch[1]);
      current = {
        number,
        statement: "",
        alternatives: {},
        correctAnswer: null,
        status: "VALID",
        page: line.page,
        warnings: [],
      };
      currentAlt = null;
      statementBuffer = [questionMatch[2] ?? ""];
      altBuffers = {};
      continue;
    }

    if (!current) {
      // Text before the first detected question (headers, instructions) is ignored.
      continue;
    }

    const segments = splitAlternativeMarkers(trimmed);
    if (segments.length > 0) {
      for (const segment of segments) {
        altBuffers[segment.letter] = segment.text ? [segment.text] : [];
        currentAlt = segment.letter;
      }
      continue;
    }

    if (currentAlt) {
      altBuffers[currentAlt] = [...(altBuffers[currentAlt] ?? []), trimmed];
    } else {
      statementBuffer.push(trimmed);
    }
  }
  flushCurrent();

  return questions;
}
