/**
 * Extração de trechos de dossiês narrativos (Markdown) usados como insumo
 * bruto do Motor Editorial — discipline-loader (docs/editorial/02a…02l) e
 * board-loader (docs/metodologia/DOSSIE_<BANCA>_V1.md). Puramente textual:
 * não conhece Supabase, não conhece caminho de arquivo, não faz I/O.
 *
 * Os dossiês não têm um parser estruturado (são prosa para leitura humana/IA
 * — ver docs/editorial/engine-v2/09-IA-002-prompt-builder.md), então a
 * extração é por casamento de cabeçalho `#`/`##`/`###`, não por schema.
 */

export type MarkdownHeading = {
  level: number;
  text: string;
  start: number;
  contentStart: number;
};

function findHeadings(markdown: string): MarkdownHeading[] {
  const headings: MarkdownHeading[] = [];
  const regex = /^(#{1,6})\s+(.+)$/gm;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(markdown)) !== null) {
    headings.push({
      level: match[1].length,
      text: match[2].trim(),
      start: match.index,
      contentStart: match.index + match[0].length,
    });
  }
  return headings;
}

/**
 * Retorna o texto de uma seção cujo cabeçalho contém `headingSubstring`
 * (comparação case-insensitive, ignora acentuação não é feito — os dossiês
 * já usam grafia consistente), do fim do cabeçalho até o próximo cabeçalho
 * de nível igual ou mais raso (ou fim do arquivo).
 */
export function extractSectionBySubstring(
  markdown: string,
  headingSubstring: string,
): string | undefined {
  const headings = findHeadings(markdown);
  const needle = headingSubstring.trim().toLowerCase();
  const index = headings.findIndex((h) => h.text.toLowerCase().includes(needle));
  if (index === -1) return undefined;

  const heading = headings[index];
  const next = headings.slice(index + 1).find((h) => h.level <= heading.level);
  const end = next ? next.start : markdown.length;
  return markdown.slice(heading.contentStart, end).trim();
}

/**
 * Retorna o texto de uma subseção cujo cabeçalho contém `substring`, restrito
 * a dentro de um bloco maior já recortado (ex.: dentro do bloco de uma
 * disciplina específica de um dossiê que agrupa várias). Mesma regra de
 * corte (até o próximo cabeçalho de nível igual ou mais raso QUE A SUBSEÇÃO
 * ENCONTRADA, não do bloco pai).
 */
export function extractSubsectionBySubstring(
  blockMarkdown: string,
  substring: string,
): string | undefined {
  return extractSectionBySubstring(blockMarkdown, substring);
}

/**
 * Recorta o bloco de uma disciplina/banca específica dentro de um dossiê que
 * agrupa várias (ex.: docs/editorial/02a-*.md tem 3 disciplinas). Casa pelo
 * texto entre parênteses `(`slug`)` no cabeçalho — convenção usada em todos
 * os dossiês de disciplina — ou, na ausência de parênteses, pelo próprio
 * `headingSubstring`.
 */
export function extractDisciplineBlock(
  markdown: string,
  slugOrNameSubstring: string,
): string | undefined {
  const headings = findHeadings(markdown);
  const needle = slugOrNameSubstring.trim().toLowerCase();
  const index = headings.findIndex((h) => {
    const text = h.text.toLowerCase();
    return text.includes(`\`${needle}\``) || text.includes(needle);
  });
  if (index === -1) return undefined;

  const heading = headings[index];
  const next = headings.slice(index + 1).find((h) => h.level <= heading.level);
  const end = next ? next.start : markdown.length;
  return markdown.slice(heading.start, end).trim();
}

/**
 * Junta trechos não-vazios com um separador legível, descartando
 * `undefined`/string vazia — usado para montar as notas finais a partir de
 * várias subseções opcionais.
 */
export function joinExcerpts(parts: Array<string | undefined>, label?: string): string {
  const nonEmpty = parts.filter((p): p is string => Boolean(p && p.trim().length > 0));
  if (nonEmpty.length === 0) return "";
  const joined = nonEmpty.join("\n\n");
  return label ? `${label}:\n${joined}` : joined;
}
