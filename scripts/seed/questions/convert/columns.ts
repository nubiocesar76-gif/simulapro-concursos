export const CONVERTER_ENGINE_NAME = "SimulaPro Question Converter";

export const REQUIRED_COLUMNS = [
  "statement",
  "alternative_a",
  "alternative_b",
  "alternative_c",
  "alternative_d",
  "correct_answer",
  "position",
  "board",
  "contest",
  "subject",
  "topic",
  "year",
  "explanation",
] as const;

export const OPTIONAL_COLUMNS = [
  "alternative_e",
  "organization",
  "exam",
  "page",
  "question",
  "references",
  "keywords",
  "status",
  "package",
  "package_version",
  // Sprint 6.8: "inedito" dispensa contest/year (ver validate.ts) — conteúdo
  // editorial sem concurso real de origem. Qualquer outro valor (ou coluna
  // ausente) preserva o comportamento padrão de prova real.
  "origin",
] as const;

export type RequiredColumn = (typeof REQUIRED_COLUMNS)[number];
export type OptionalColumn = (typeof OPTIONAL_COLUMNS)[number];

export const ALTERNATIVE_COLUMNS = [
  "alternative_a",
  "alternative_b",
  "alternative_c",
  "alternative_d",
  "alternative_e",
] as const;

export const ALTERNATIVE_LETTERS = ["A", "B", "C", "D", "E"] as const;

/**
 * A–D são sempre obrigatórias; E é opcional (questões de 4 ou 5 alternativas).
 * Usado pelo pipeline de extração de PDF (tools/question-pipeline), que só lida
 * com questões de múltipla escolha — não alterar sem revisar esse consumidor.
 */
export const REQUIRED_ALTERNATIVE_LETTERS = ["A", "B", "C", "D"] as const;

/**
 * G7.6A: piso mínimo para a validação de linhas do CSV em `convert:questions`.
 * A e B são sempre obrigatórias (mínimo de 2 alternativas); C, D e E são
 * opcionais, o que permite questões Certo/Errado (ex.: CEBRASPE — A = Certo,
 * B = Errado, sem alternativas fictícias) sem afetar `REQUIRED_ALTERNATIVE_LETTERS`
 * acima, que continua exigindo 4 alternativas para o pipeline de extração de PDF.
 */
export const MINIMUM_ALTERNATIVE_LETTERS = ["A", "B"] as const;
