import type { ClassificationEntry, RawQuestion } from "./types.ts";

const EMPTY_ENTRY = {
  board: "",
  contest: "",
  position: "",
  subject: "",
  topic: "",
  year: "",
  difficulty: "",
  keywords: [] as string[],
  explanation: "",
};

/** Gera uma entrada vazia por questão do raw — sem inferência semântica. */
export function generateClassificationTemplate(questions: RawQuestion[]): ClassificationEntry[] {
  return [...questions]
    .sort((a, b) => a.number - b.number)
    .map((q) => ({
      question: q.number,
      ...EMPTY_ENTRY,
    }));
}
