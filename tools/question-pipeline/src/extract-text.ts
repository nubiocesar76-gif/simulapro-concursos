import { readFile } from "node:fs/promises";

/**
 * Extracts text from a searchable-text PDF using pdfjs-dist, page by page.
 * Each page is joined with a "=== PAGE N ===" marker so downstream parsers
 * can track which physical page a question came from.
 */
export async function extractPdfText(pdfPath: string): Promise<{ text: string; pageCount: number }> {
  const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const data = await readFile(pdfPath);
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(data) });
  const doc = await loadingTask.promise;

  const parts: string[] = [];
  for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
    const page = await doc.getPage(pageNum);
    const content = await page.getTextContent();

    let lastY: number | null = null;
    let line = "";
    const lines: string[] = [];

    for (const item of content.items as Array<{ str: string; transform: number[] }>) {
      if (!("str" in item)) continue;
      const y = item.transform[5];
      if (lastY !== null && Math.abs(y - lastY) > 2) {
        lines.push(line);
        line = "";
      }
      line += item.str;
      lastY = y;
    }
    if (line) lines.push(line);

    parts.push(`=== PAGE ${pageNum} ===\n${lines.join("\n")}`);
  }

  const pageCount = doc.numPages;
  if (typeof doc.destroy === "function") {
    await doc.destroy();
  }
  return { text: parts.join("\n"), pageCount };
}
