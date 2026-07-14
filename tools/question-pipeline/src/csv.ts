/**
 * Minimal RFC4180-style CSV serialization: quotes a field only when needed
 * (contains comma, double quote or newline), doubling internal quotes.
 * Matches what the project's own CSV reader (SheetJS, via
 * scripts/seed/questions/convert/parse.ts) expects.
 */
export function csvField(value: string | number | null | undefined): string {
  const str = value === null || value === undefined ? "" : String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function csvRow(values: Array<string | number | null | undefined>): string {
  return values.map(csvField).join(",");
}

export function buildCsv(header: string[], rows: Array<Array<string | number | null | undefined>>): string {
  const lines = [csvRow(header), ...rows.map(csvRow)];
  return lines.join("\r\n") + "\r\n";
}
