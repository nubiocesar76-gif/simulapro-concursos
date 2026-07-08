import { createHash } from "node:crypto";
import { parseAlternativesFromDb } from "../../../src/lib/questions.ts";

export type HashAlternative = { letter: string; text: string };

function normalizeAlternative(alt: HashAlternative) {
  return {
    letter: alt.letter.trim().toUpperCase(),
    text: alt.text.trim(),
  };
}

export function computeContentHash(
  statement: string,
  alternatives: HashAlternative[],
  correctAnswer: string,
): string {
  const payload = {
    statement: statement.trim(),
    alternatives: alternatives.map(normalizeAlternative),
    correctAnswer: correctAnswer.trim().toUpperCase(),
  };
  return createHash("sha256").update(JSON.stringify(payload)).digest("hex");
}

export function computeContentHashFromDb(
  statement: string,
  alternatives: unknown,
  correctAnswer: string | null,
): string {
  const parsed = parseAlternativesFromDb(alternatives);
  return computeContentHash(statement, parsed, correctAnswer ?? "");
}
