export type AltLetter = "A" | "B" | "C" | "D" | "E";

export interface AlternativeSegment {
  letter: AltLetter;
  text: string;
}

/**
 * Matches an alternative marker ("a)", "(A)", "C)"...) at the start of the
 * line, or elsewhere in the line as long as it's preceded by whitespace
 * (never mid-word) — this is what lets a single physical line hold more
 * than one alternative, as in two-column layouts:
 *
 *   "a) 500 a 1.500 c) 1.000"
 *   "b) 7.000 d) 2.000 a 3.500"
 */
const ALT_MARKER_GLOBAL = /(^|\s)\(?([A-Ea-e])\)\s*/g;

/**
 * Splits a single line of text into zero or more alternative segments,
 * one per detected marker. A line with a single marker at position 0
 * behaves exactly like the classic single-column parser. A line with two
 * or more markers (two-column layout) is split at each marker boundary so
 * every column's text is attributed to its own letter.
 *
 * Returns an empty array when no marker is found — callers should treat
 * that as "continuation of whatever was being read before", never as an
 * empty alternative.
 */
export function splitAlternativeMarkers(line: string): AlternativeSegment[] {
  const matches = [...line.matchAll(ALT_MARKER_GLOBAL)];
  if (matches.length === 0) return [];

  const segments: AlternativeSegment[] = [];
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const letter = match[2].toUpperCase() as AltLetter;
    const contentStart = (match.index ?? 0) + match[0].length;
    const contentEnd = i + 1 < matches.length ? matches[i + 1].index! : line.length;
    const text = line.slice(contentStart, contentEnd).trim();
    segments.push({ letter, text });
  }
  return segments;
}
