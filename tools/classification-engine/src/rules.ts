import type { EditorialRulesConfig } from "./types.ts";

/** Regras editoriais codificadas — espelham `docs/editorial/classification/`. */
export const EDITORIAL_RULE_IDS = {
  SINGLE_SUBJECT: "R-001",
  TOPIC_BELONGS_SUBJECT: "R-002",
  SINGLE_TOPIC: "R-003",
  KEYWORDS_COUNT: "R-004",
  VALID_TAXONOMY_SLUG: "R-007",
  NO_LEGACY_SUBJECT: "R-006",
} as const;

export function getEditorialRulesSnapshot(editorial: EditorialRulesConfig) {
  return {
    source: editorial.editorialDir,
    loaded: editorial.loaded,
    ruleIds: EDITORIAL_RULE_IDS,
    difficultyValues: [...editorial.difficultyValues],
    keywordsRange: [editorial.keywordsMin, editorial.keywordsMax] as const,
    yearRange: [editorial.yearMin, editorial.yearMax] as const,
    legacySubjectSlugs: [...editorial.legacySubjectSlugs],
  };
}

export function isLegacySubjectSlug(slug: string, editorial: EditorialRulesConfig): boolean {
  return editorial.legacySubjectSlugs.includes(slug.trim().toLowerCase());
}

export function isValidDifficulty(value: string, editorial: EditorialRulesConfig): boolean {
  if (!value.trim()) return false;
  return editorial.difficultyValues.includes(value.trim());
}

export function isValidYear(value: string, editorial: EditorialRulesConfig): boolean {
  const trimmed = value.trim();
  if (!/^\d{4}$/.test(trimmed)) return false;
  const year = Number.parseInt(trimmed, 10);
  return year >= editorial.yearMin && year <= editorial.yearMax;
}

const KNOWN_ACRONYMS = new Set([
  "HIV", "AIDS", "PNI", "SUS", "RAPS", "CAPS", "ECA", "SAE", "NANDA", "NIC", "NOC",
  "UTI", "PS", "MS", "COFEN", "COREN", "FGV", "IBFC", "AVC", "IAM", "DRC", "DPOC",
  "HAS", "DM", "IG", "PE", "PNSP", "OMS", "WHO", "ISO", "LGPD",
]);

export function isKeywordFormatValid(keyword: string, editorial: EditorialRulesConfig): boolean {
  const trimmed = keyword.trim();
  if (!trimmed) return false;
  if (trimmed.length > editorial.keywordMaxLength) return false;

  for (const prefix of editorial.allowedKeywordPrefixes) {
    if (trimmed.startsWith(prefix)) return true;
  }

  if (/[",\n\r]/.test(trimmed)) return false;
  if (trimmed.split(/\s+/).length > 8) return false;

  const words = trimmed.split(/\s+/);
  for (const word of words) {
    if (word === word.toUpperCase() && word.length >= 2 && KNOWN_ACRONYMS.has(word)) continue;
    if (word !== word.toLowerCase() && word !== word.toUpperCase()) {
      // Mixed case like "Diabetes" — allow single capitalized word
      if (!/^[A-ZÀ-Ü][a-zà-ü]+(-[a-zà-ü]+)*$/.test(word)) return false;
    }
    if (word === word.toUpperCase() && word.length > 1 && !KNOWN_ACRONYMS.has(word)) {
      return false;
    }
  }
  return true;
}

export function normalizeKeyword(keyword: string): string {
  return keyword
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .trim();
}

export function findDuplicateKeywords(keywords: string[]): string[] {
  const seen = new Map<string, string>();
  const duplicates: string[] = [];
  for (const kw of keywords) {
    const norm = normalizeKeyword(kw);
    if (!norm) continue;
    if (seen.has(norm)) {
      duplicates.push(kw);
    } else {
      seen.set(norm, kw);
    }
  }
  return duplicates;
}
