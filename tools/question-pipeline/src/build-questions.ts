import type { ExtractionReport, GabaritoEntry, RawQuestion } from "./types.ts";

export function buildQuestions(
  questions: RawQuestion[],
  gabarito: GabaritoEntry[],
): { questions: RawQuestion[]; report: ExtractionReport } {
  const gabaritoByNumber = new Map(gabarito.map((g) => [g.number, g]));
  const seenNumbers = new Map<number, number>();
  const duplicateNumbers: number[] = [];

  for (const q of questions) {
    seenNumbers.set(q.number, (seenNumbers.get(q.number) ?? 0) + 1);
  }
  for (const [num, count] of seenNumbers) {
    if (count > 1) duplicateNumbers.push(num);
  }

  let withoutGabarito = 0;
  let withoutCompleteAlternatives = 0;

  for (const q of questions) {
    const gabaritoEntry = gabaritoByNumber.get(q.number);
    const altCount = Object.keys(q.alternatives).length;
    const hasCompleteAlternatives = altCount === 4 || altCount === 5;
    if (!hasCompleteAlternatives) withoutCompleteAlternatives++;

    if (duplicateNumbers.includes(q.number)) {
      q.warnings.push("Número de questão duplicado no PDF de origem.");
      q.status = "REVIEW_REQUIRED";
    }

    if (!gabaritoEntry) {
      withoutGabarito++;
      q.warnings.push("Gabarito não localizado para esta questão.");
      if (q.status === "VALID") q.status = "REVIEW_REQUIRED";
      continue;
    }

    if (gabaritoEntry.anulada) {
      q.status = "ANULADA";
      q.correctAnswer = null;
      continue;
    }

    q.correctAnswer = gabaritoEntry.answer;
    if (gabaritoEntry.answer && !q.alternatives[gabaritoEntry.answer as "A" | "B" | "C" | "D" | "E"]) {
      q.warnings.push(
        `Gabarito aponta a alternativa ${gabaritoEntry.answer}, que não foi detectada entre as alternativas extraídas.`,
      );
      q.status = "REVIEW_REQUIRED";
    }
  }

  const report: ExtractionReport = {
    totalFound: questions.length,
    valid: questions.filter((q) => q.status === "VALID").length,
    anuladas: questions.filter((q) => q.status === "ANULADA").length,
    reviewRequired: questions.filter((q) => q.status === "REVIEW_REQUIRED").length,
    withoutGabarito,
    withoutCompleteAlternatives,
    duplicateNumbers,
    generatedAt: new Date().toISOString(),
  };

  return { questions, report };
}
