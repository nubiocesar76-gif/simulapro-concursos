import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { RawQuestion } from "./types.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = resolve(HERE, "..", "output");

async function main() {
  const questionsPath = resolve(OUTPUT_DIR, "questions.raw.json");
  if (!existsSync(questionsPath)) {
    throw new Error(`Arquivo não encontrado: ${questionsPath}. Rode "npm run pipeline:extract" primeiro.`);
  }

  const raw = await readFile(questionsPath, "utf-8");
  const questions = JSON.parse(raw) as RawQuestion[];

  const problems: string[] = [];
  for (const q of questions) {
    if (typeof q.number !== "number") problems.push(`Questão com "number" inválido: ${JSON.stringify(q)}`);
    if (!["VALID", "ANULADA", "REVIEW_REQUIRED"].includes(q.status)) {
      problems.push(`Questão ${q.number}: status inválido "${q.status}".`);
    }
    if (q.status === "VALID" && !q.correctAnswer) {
      problems.push(`Questão ${q.number}: status VALID mas sem correctAnswer.`);
    }
    if (q.status === "VALID" && Object.keys(q.alternatives).length < 4) {
      problems.push(`Questão ${q.number}: status VALID mas com menos de 4 alternativas.`);
    }
  }

  console.log(`Questões no arquivo: ${questions.length}`);
  console.log(`Problemas de schema encontrados: ${problems.length}`);
  for (const p of problems) console.log(" -", p);

  if (problems.length > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.stack ?? err.message : err);
  process.exit(1);
});
