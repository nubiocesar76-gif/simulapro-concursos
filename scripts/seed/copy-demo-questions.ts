/**
 * Sprint P1.4 — copia as 20 questões curadas da demo para Package Version Demo 1.0.
 *
 * Executar: npx tsx scripts/seed/copy-demo-questions.ts
 *
 * Somente INSERT de cópias — nenhuma questão original é alterada ou removida.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Json } from "@/integrations/supabase/types";
import { loadEnv, projectRoot } from "./core/env.ts";
import { createSeedClient } from "./core/client.ts";
import { QUESTIONS_SEED_PATH } from "./core/io.ts";
import { computeContentHash, computeContentHashFromDb } from "./questions/hash.ts";
import type { QuestionSeedItem } from "./questions/schema.ts";

const DEMO_PACKAGE_SLUG = "primeiro-simulado-gratis";
const DEMO_VERSION = "1.0";
const PAID_PACKAGE_SLUG = "banco-de-questoes-enfermagem";
const PAID_VERSION = "1.0";
const EBSERH_CONTEST = "concurso-publico-01-2023-ebserh-nacional";

const DEMO_QUESTION_NUMBERS = [
  54, 55, 59, 51, 46, 58, 50, 47, 57, 43, 56, 41, 60, 45, 2, 9, 14, 15, 48, 24,
] as const;

type QuestionsFile = {
  metadata: Record<string, unknown>;
  questions: QuestionSeedItem[];
};

type DbQuestion = {
  id: string;
  statement: string;
  alternatives: unknown;
  correct_answer: string | null;
  explanation: string | null;
  year: number | null;
  subject_id: string | null;
  topic_id: string | null;
  board_id: string | null;
  exam_id: string | null;
  position_id: string | null;
  package_version_id: string | null;
  metadata: Json | null;
};

async function resolvePackageVersionId(
  db: ReturnType<typeof createSeedClient>,
  packageSlug: string,
  versionNumber: string,
) {
  const { data: pkg, error: pkgError } = await db
    .from("packages")
    .select("id")
    .eq("slug", packageSlug)
    .maybeSingle();
  if (pkgError) throw pkgError;
  if (!pkg) throw new Error(`Pacote "${packageSlug}" não encontrado.`);

  const { data: version, error: versionError } = await db
    .from("package_versions")
    .select("id")
    .eq("package_id", pkg.id)
    .eq("version_number", versionNumber)
    .maybeSingle();
  if (versionError) throw versionError;
  if (!version) {
    throw new Error(`Versão "${versionNumber}" do pacote "${packageSlug}" não encontrada.`);
  }
  return version.id;
}

function findSeedOriginal(file: QuestionsFile, questionNumber: number): QuestionSeedItem {
  const match = file.questions.find(
    (q) =>
      q.contest === EBSERH_CONTEST &&
      q.source?.question === questionNumber &&
      q.package === PAID_PACKAGE_SLUG &&
      q.packageVersion === PAID_VERSION,
  );
  if (!match) {
    throw new Error(`Questão ${questionNumber} não encontrada no seed (${EBSERH_CONTEST}).`);
  }
  return match;
}

function findDbOriginal(
  paidRows: DbQuestion[],
  seedItem: QuestionSeedItem,
): DbQuestion {
  const hash = computeContentHash(seedItem.statement, seedItem.alternatives, seedItem.correctAnswer);
  const match = paidRows.find(
    (row) => computeContentHashFromDb(row.statement, row.alternatives, row.correct_answer) === hash,
  );
  if (!match) {
    throw new Error(
      `Questão ${seedItem.source?.question} não encontrada no banco (package_version pago).`,
    );
  }
  return match;
}

function buildDemoSeedItem(
  original: QuestionSeedItem,
  origin: {
    questionId: string;
    examId: string | null;
    packageVersionId: string | null;
    copiedAt: string;
  },
): QuestionSeedItem & { metadata: Record<string, unknown> } {
  return {
    ...original,
    package: DEMO_PACKAGE_SLUG,
    packageVersion: DEMO_VERSION,
    metadata: {
      demo: true,
      origin: {
        questionId: origin.questionId,
        examId: origin.examId,
        packageVersionId: origin.packageVersionId,
        copiedAt: origin.copiedAt,
      },
    },
  };
}

async function main() {
  const root = projectRoot();
  loadEnv(root);

  const seedPath = QUESTIONS_SEED_PATH;
  const file = JSON.parse(readFileSync(seedPath, "utf8")) as QuestionsFile;
  const db = createSeedClient();

  const demoPackageVersionId = await resolvePackageVersionId(db, DEMO_PACKAGE_SLUG, DEMO_VERSION);
  const paidPackageVersionId = await resolvePackageVersionId(db, PAID_PACKAGE_SLUG, PAID_VERSION);

  const { count: paidBefore, error: paidCountError } = await db
    .from("questions")
    .select("id", { count: "exact", head: true })
    .eq("package_version_id", paidPackageVersionId);
  if (paidCountError) throw paidCountError;

  const { count: demoBefore, error: demoCountError } = await db
    .from("questions")
    .select("id", { count: "exact", head: true })
    .eq("package_version_id", demoPackageVersionId);
  if (demoCountError) throw demoCountError;

  if ((demoBefore ?? 0) >= 20) {
    console.log(`Demo já possui ${demoBefore} questões — abortando para evitar duplicatas.`);
    process.exit(0);
  }

  const { data: paidRows, error: paidRowsError } = await db
    .from("questions")
    .select(
      "id,statement,alternatives,correct_answer,explanation,year,subject_id,topic_id,board_id,exam_id,position_id,package_version_id,metadata",
    )
    .eq("package_version_id", paidPackageVersionId);
  if (paidRowsError) throw paidRowsError;

  const paidSnapshot = JSON.stringify(paidRows);
  const copiedAt = new Date().toISOString();
  const demoSeedItems: Array<QuestionSeedItem & { metadata: Record<string, unknown> }> = [];
  const copiedNumbers: number[] = [];

  for (const questionNumber of DEMO_QUESTION_NUMBERS) {
    const seedOriginal = findSeedOriginal(file, questionNumber);
    const dbOriginal = findDbOriginal(paidRows ?? [], seedOriginal);

    const baseMetadata =
      dbOriginal.metadata && typeof dbOriginal.metadata === "object"
        ? { ...(dbOriginal.metadata as Record<string, unknown>) }
        : {};

    const metadata: Record<string, unknown> = {
      ...baseMetadata,
      demo: true,
      origin: {
        questionId: dbOriginal.id,
        examId: dbOriginal.exam_id,
        packageVersionId: dbOriginal.package_version_id,
        copiedAt,
      },
    };

    const { error: insertError } = await db.from("questions").insert({
      statement: dbOriginal.statement,
      alternatives: dbOriginal.alternatives as Json,
      correct_answer: dbOriginal.correct_answer,
      explanation: dbOriginal.explanation,
      year: dbOriginal.year,
      subject_id: dbOriginal.subject_id,
      topic_id: dbOriginal.topic_id,
      board_id: dbOriginal.board_id,
      exam_id: dbOriginal.exam_id,
      position_id: dbOriginal.position_id,
      package_version_id: demoPackageVersionId,
      metadata: metadata as Json,
    });
    if (insertError) throw insertError;

    demoSeedItems.push(
      buildDemoSeedItem(seedOriginal, {
        questionId: dbOriginal.id,
        examId: dbOriginal.exam_id,
        packageVersionId: dbOriginal.package_version_id,
        copiedAt,
      }),
    );
    copiedNumbers.push(questionNumber);
  }

  const { data: paidAfter, error: paidAfterError } = await db
    .from("questions")
    .select(
      "id,statement,alternatives,correct_answer,explanation,year,subject_id,topic_id,board_id,exam_id,position_id,package_version_id,metadata",
    )
    .eq("package_version_id", paidPackageVersionId);
  if (paidAfterError) throw paidAfterError;

  if (JSON.stringify(paidAfter) !== paidSnapshot) {
    throw new Error("Questões originais do pacote pago foram alteradas — abortando.");
  }

  const existingDemoInSeed = file.questions.filter((q) => q.package === DEMO_PACKAGE_SLUG).length;
  if (existingDemoInSeed === 0) {
    file.questions.push(...demoSeedItems);
    file.metadata = {
      ...file.metadata,
      generatedAt: copiedAt,
      generatedBy: "SimulaPro Demo Copy (Sprint P1.4)",
    };
    writeFileSync(seedPath, `${JSON.stringify(file, null, 2)}\n`, "utf8");
  }

  const { count: paidFinal, error: paidFinalError } = await db
    .from("questions")
    .select("id", { count: "exact", head: true })
    .eq("package_version_id", paidPackageVersionId);
  if (paidFinalError) throw paidFinalError;

  const { count: demoFinal, error: demoFinalError } = await db
    .from("questions")
    .select("id", { count: "exact", head: true })
    .eq("package_version_id", demoPackageVersionId);
  if (demoFinalError) throw demoFinalError;

  const { data: demoRows, error: demoRowsError } = await db
    .from("questions")
    .select("id,metadata")
    .eq("package_version_id", demoPackageVersionId);
  if (demoRowsError) throw demoRowsError;

  const missingMetadata = (demoRows ?? []).filter((row) => {
    const m = row.metadata as Record<string, unknown> | null;
    const origin = m?.origin as Record<string, unknown> | undefined;
    return m?.demo !== true || !origin?.questionId || !origin?.copiedAt;
  });

  console.log("=== Sprint P1.4 — Demo Questions Copy ===");
  console.log(`Demo Package Version ID: ${demoPackageVersionId}`);
  console.log(`Copiadas: ${copiedNumbers.length}`);
  console.log(`Questões (source.question): ${copiedNumbers.join(", ")}`);
  console.log(`Pacote pago antes/depois: ${paidBefore} / ${paidFinal}`);
  console.log(`Demo antes/depois: ${demoBefore} / ${demoFinal}`);
  console.log(`Metadata ausente: ${missingMetadata.length}`);
  console.log(`Seed JSON atualizado: ${existingDemoInSeed === 0 ? "sim" : "já continha demo"}`);
  console.log(`Total questions.json: ${file.questions.length}`);

  if (copiedNumbers.length !== 20) throw new Error("Esperado 20 cópias.");
  if (paidBefore !== paidFinal) throw new Error("Contagem do pacote pago mudou.");
  if (demoFinal !== 20) throw new Error("Demo não possui exatamente 20 questões.");
  if (missingMetadata.length > 0) throw new Error("Metadata demo incompleta.");

  console.log("ALL P1.4 CHECKS PASSED");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
