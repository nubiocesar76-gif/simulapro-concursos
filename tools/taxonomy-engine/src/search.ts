import type { SearchOptions, SearchResult, TaxonomyIndex } from "./types.ts";

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .trim();
}

function scoreMatch(query: string, recordText: string, recordName: string, recordSlug: string): { score: number; matchedOn: SearchResult["matchedOn"] } | null {
  const q = normalize(query);
  if (!q) return null;

  const name = normalize(recordName);
  const slug = normalize(recordSlug);

  if (name === q || slug === q) {
    return { score: 100, matchedOn: name === q ? "name" : "slug" };
  }
  if (name.startsWith(q) || slug.startsWith(q)) {
    return { score: 80, matchedOn: name.startsWith(q) ? "name" : "slug" };
  }
  if (name.includes(q) || slug.includes(q) || recordText.includes(q)) {
    return { score: 60, matchedOn: name.includes(q) ? "name" : slug.includes(q) ? "slug" : "name" };
  }
  return null;
}

export function search(index: TaxonomyIndex, query: string, options: SearchOptions = {}): SearchResult[] {
  const limit = options.limit ?? 20;
  const includeSynonyms = options.includeSynonyms ?? true;
  const q = normalize(query);
  if (!q) return [];

  const pool = options.kind ? (index.byKind.get(options.kind) ?? []) : index.records;
  const results: SearchResult[] = [];

  for (const record of pool) {
    let matchedOn: SearchResult["matchedOn"] | null = null;
    let score = 0;

    const primary = scoreMatch(q, record.searchText, record.name, record.slug);
    if (primary) {
      score = primary.score;
      matchedOn = primary.matchedOn;
    }

    if (includeSynonyms && record.synonyms.length > 0) {
      for (const synonym of record.synonyms) {
        const syn = normalize(synonym);
        if (syn === q) {
          score = Math.max(score, 90);
          matchedOn = "synonym";
        } else if (syn.includes(q)) {
          score = Math.max(score, 70);
          matchedOn = "synonym";
        }
      }
    }

    if (matchedOn) {
      results.push({ record, score, matchedOn });
    }
  }

  return results.sort((a, b) => b.score - a.score || a.record.name.localeCompare(b.record.name, "pt-BR")).slice(0, limit);
}

/** Busca por nome parcial — alias de `search()` para API explícita. */
export function searchPartial(index: TaxonomyIndex, query: string, options?: SearchOptions): SearchResult[] {
  return search(index, query, options);
}

/** Busca exata por nome (case-insensitive, ignora acentos). */
export function findByName(index: TaxonomyIndex, name: string, kind?: SearchOptions["kind"]): SearchResult[] {
  const q = normalize(name);
  const pool = kind ? (index.byKind.get(kind) ?? []) : index.records;
  return pool
    .filter((record) => normalize(record.name) === q)
    .map((record) => ({ record, score: 100, matchedOn: "name" as const }));
}
