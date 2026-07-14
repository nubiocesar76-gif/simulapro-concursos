import type { GabaritoEntry } from "./types.ts";

const PAGE_MARKER = /^=== PAGE (\d+) ===$/;
const ANSWER_TOKEN = /^(\*|ANULAD[AO]|[A-Ea-e])$/;

/**
 * Parses gabarito.txt looking for the classic "row of question numbers"
 * immediately followed by a "row of answer letters" table layout used by
 * most bancas (FGV, IBFC, Fundatec, etc.). Anuladas are recognized when the
 * answer token is "*" or a variant of "ANULADA".
 *
 * Never guesses an answer: a question number that never appears in a
 * matched number/answer row pair is simply absent from the result.
 */
export function parseGabarito(text: string): GabaritoEntry[] {
  const lines = text
    .split("\n")
    .filter((l) => !PAGE_MARKER.test(l.trim()))
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const entries = new Map<number, GabaritoEntry>();

  for (let i = 0; i < lines.length; i++) {
    const numberTokens = lines[i].split(/\s+/);
    if (numberTokens.length < 2) continue;
    if (!numberTokens.every((t) => /^\d{1,3}$/.test(t))) continue;

    const numbers = numberTokens.map(Number);
    let ascending = true;
    for (let k = 1; k < numbers.length; k++) {
      if (numbers[k] <= numbers[k - 1]) {
        ascending = false;
        break;
      }
    }
    if (!ascending) continue;

    // Look ahead a few lines for a matching answer row of the same length.
    for (let j = i + 1; j < Math.min(i + 4, lines.length); j++) {
      const answerTokens = lines[j].split(/\s+/);
      if (answerTokens.length !== numbers.length) continue;
      if (!answerTokens.every((t) => ANSWER_TOKEN.test(t.toUpperCase()))) continue;

      numbers.forEach((num, idx) => {
        const raw = answerTokens[idx].toUpperCase();
        const anulada = raw === "*" || raw.startsWith("ANULAD");
        entries.set(num, {
          number: num,
          answer: anulada ? null : raw,
          anulada,
        });
      });
      i = j; // skip past the consumed answer row
      break;
    }
  }

  return [...entries.values()].sort((a, b) => a.number - b.number);
}
