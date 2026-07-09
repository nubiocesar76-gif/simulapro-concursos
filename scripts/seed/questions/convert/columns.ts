export const CONVERTER_ENGINE_NAME = "SimulaPro Question Converter";

export const REQUIRED_COLUMNS = [
  "statement",
  "alternative_a",
  "alternative_b",
  "alternative_c",
  "alternative_d",
  "alternative_e",
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
  "organization",
  "exam",
  "page",
  "question",
  "references",
  "keywords",
  "status",
  "package",
  "package_version",
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
