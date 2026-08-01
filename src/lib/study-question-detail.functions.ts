// SIA V1 — ponto único onde o enunciado/gabarito/explicação/metadados
// secretos de uma questão são buscados no banco. Roda inteiramente no
// servidor (createServerFn, mesmo padrão de free-subscription.functions.ts
// e study-time-benchmark.functions.ts) — o objeto retornado ao cliente é
// montado campo a campo aqui dentro, NUNCA um spread da linha crua da
// tabela `questions`. Antes de a questão estar respondida nesta sessão,
// o payload retornado simplesmente não contém `correct_answer`,
// `explanation`, nem nenhuma chave `sia_*` secreta — não é um filtro
// aplicado depois no componente, é o próprio contrato de retorno desta
// função (ver "Princípio de segurança" no plano SIA V1).

import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { parseMetadataFields } from "@/lib/questions";
import { buildErrorReasonSentence } from "@/lib/sia";
import { computeQuestionTimeBenchmark } from "@/lib/study-time-benchmark.functions";

export type QuestionSiaPegadinha = { trigger: string; explanation: string };
export type QuestionSiaInterpretation = { trigger: string; explanation: string };
export type QuestionSiaLongText = { excerpts: string[]; note: string | null };
export type QuestionSiaCalculation = { steps: string; commonError: string | null };
export type QuestionSiaTime = {
  studentSeconds: number;
  averageSeconds: number | null;
  sampleSize: number;
  note: string;
};

export type QuestionForStudyBase = {
  statement: string;
  alternatives: string[];
  year: number | null;
  difficulty: string | null;
  boardName: string | null;
  subjectName: string | null;
  topicName: string | null;
  imageUrl: string | null;
  siaTags: string[];
};

export type QuestionSiaData = {
  reasonSentence: string | null;
  pegadinha: QuestionSiaPegadinha | null;
  longText: QuestionSiaLongText | null;
  interpretation: QuestionSiaInterpretation | null;
  calculation: QuestionSiaCalculation | null;
  boardStyleSummary: string | null;
  time: QuestionSiaTime;
  lessonsLearned: string[];
};

export type QuestionForStudy =
  | ({ answered: false } & QuestionForStudyBase)
  | ({
      answered: true;
      isCorrect: boolean;
      correctAnswer: string;
      selectedAnswer: string | null;
      explanation: string | null;
      bibliography: string | null;
      legalReference: string | null;
      sia: QuestionSiaData;
    } & QuestionForStudyBase);

function formatSeconds(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds % 60);
  return minutes > 0 ? `${minutes}min${String(seconds).padStart(2, "0")}` : `${seconds}s`;
}

function buildTimeNote(
  studentSeconds: number,
  benchmark: Awaited<ReturnType<typeof computeQuestionTimeBenchmark>>,
  tags: string[],
): string {
  if (!benchmark) {
    return `Ainda não há respostas suficientes para calcular uma média confiável. Seu tempo foi de ${formatSeconds(studentSeconds)}. Use este valor para acompanhar sua evolução.`;
  }

  const label =
    benchmark.source === "question"
      ? "Média de resolução desta questão"
      : "Média entre os alunos do SimulaPro";
  const avg = formatSeconds(benchmark.averageSeconds);
  const own = formatSeconds(studentSeconds);

  if (studentSeconds > benchmark.averageSeconds * 1.3) {
    const reason = tags.includes("interpretacao")
      ? " Você demorou mais que a média, possivelmente por interpretar o texto com cuidado."
      : tags.includes("calculo")
        ? " Você demorou mais que a média, possivelmente pelo tempo gasto no cálculo."
        : " Você demorou mais que a média entre os alunos.";
    return `${label}: ${avg}. Seu tempo: ${own}.${reason}`;
  }

  if (studentSeconds < benchmark.averageSeconds * 0.5) {
    return `${label}: ${avg}. Seu tempo: ${own}. Você respondeu bem mais rápido que a média — se a questão exigia leitura cuidadosa, vale reconferir com calma da próxima vez.`;
  }

  return `${label}: ${avg}. Seu tempo: ${own}. Tempo dentro do esperado para esta questão.`;
}

function buildLessonsLearned(input: {
  reasonSentence: string | null;
  boardStyleSummary: string | null;
  boardName: string | null;
  pegadinha: QuestionSiaPegadinha | null;
  longText: QuestionSiaLongText | null;
  interpretation: QuestionSiaInterpretation | null;
  legalReference: string | null;
  calculation: QuestionSiaCalculation | null;
}): string[] {
  const bullets: string[] = [];
  if (input.reasonSentence) bullets.push(input.reasonSentence);
  if (input.boardStyleSummary) {
    bullets.push(
      `Como a banca${input.boardName ? ` ${input.boardName}` : ""} costuma cobrar esse tipo de questão.`,
    );
  }
  if (input.pegadinha) bullets.push("Onde estava a pegadinha desta questão.");
  if (input.longText) bullets.push("Quais trechos do enunciado realmente importavam.");
  if (input.interpretation) bullets.push("Como interpretar corretamente o comando da questão.");
  if (input.legalReference) bullets.push("Qual base legal sustenta a resposta correta.");
  if (input.calculation) bullets.push("Como resolver o cálculo desta questão passo a passo.");
  if (!bullets.length) bullets.push("Revise a explicação e a referência indicadas.");
  return bullets;
}

export const getQuestionForStudy = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator(
    (input: { sessionId: string; sessionQuestionId: string; feedbackAllowed: boolean }) => input,
  )
  .handler(async ({ context, data }): Promise<QuestionForStudy> => {
    // RLS de study_session_questions já restringe a linha à própria sessão
    // do usuário autenticado — se não pertencer a ele, a query não retorna
    // nada e `.single()` lança abaixo, sem precisar de checagem manual extra.
    const { data: row, error: rowError } = await context.supabase
      .from("study_session_questions")
      .select(
        "id, question_id, answered_at, is_correct, correct_answer, selected_answer, response_time_seconds",
      )
      .eq("id", data.sessionQuestionId)
      .eq("study_session_id", data.sessionId)
      .single();
    if (rowError) throw rowError;

    const { data: question, error: qError } = await context.supabase
      .from("questions")
      .select(
        `
        id,
        statement,
        alternatives,
        year,
        difficulty,
        metadata,
        explanation,
        board_id,
        topic_id,
        boards(name, acronym, style_summary),
        subjects(name),
        topics(name)
      `,
      )
      .eq("id", row.question_id)
      .single();
    if (qError) throw qError;

    const metadata = parseMetadataFields(question.metadata);
    const board = question.boards as {
      name: string;
      acronym: string | null;
      style_summary: string | null;
    } | null;
    const subject = question.subjects as { name: string } | null;
    const topic = question.topics as { name: string } | null;

    const base: QuestionForStudyBase = {
      statement: question.statement,
      alternatives: Array.isArray(question.alternatives) ? (question.alternatives as string[]) : [],
      year: question.year,
      difficulty: question.difficulty,
      boardName: board?.acronym?.trim() || board?.name?.trim() || null,
      subjectName: subject?.name?.trim() || null,
      topicName: topic?.name?.trim() || null,
      imageUrl: metadata.image_url || null,
      siaTags: metadata.sia_tags,
    };

    // `feedbackAllowed` reflete a mesma regra de negócio já existente (modo
    // EXAM nunca revela feedback por questão, só no fim da prova — ver
    // `isFilterStudyMode`/checagem de `session.mode` em `study-engine.ts`).
    // Decidido aqui, não só no componente: em modo EXAM o payload retornado
    // é sempre o seguro, mesmo que a questão já tenha sido respondida.
    if (
      !data.feedbackAllowed ||
      !row.answered_at ||
      row.is_correct === null ||
      !row.correct_answer
    ) {
      // Pré-resposta (ou feedback não permitido neste modo): só o objeto
      // seguro. `question.explanation`, o gabarito e todas as chaves
      // `sia_*` secretas nunca entram neste retorno.
      return { answered: false, ...base };
    }

    const pegadinha: QuestionSiaPegadinha | null =
      metadata.sia_pegadinha_trigger && metadata.sia_pegadinha_explanation
        ? {
            trigger: metadata.sia_pegadinha_trigger,
            explanation: metadata.sia_pegadinha_explanation,
          }
        : null;

    const interpretation: QuestionSiaInterpretation | null =
      metadata.sia_interpretation_trigger && metadata.sia_interpretation_explanation
        ? {
            trigger: metadata.sia_interpretation_trigger,
            explanation: metadata.sia_interpretation_explanation,
          }
        : null;

    const longTextExcerpts = metadata.sia_long_text_key_excerpts
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const longText: QuestionSiaLongText | null = longTextExcerpts.length
      ? { excerpts: longTextExcerpts, note: metadata.sia_long_text_note || null }
      : null;

    const calculation: QuestionSiaCalculation | null = metadata.sia_calculation_steps
      ? {
          steps: metadata.sia_calculation_steps,
          commonError: metadata.sia_calculation_common_error || null,
        }
      : null;

    const reasonSentence = buildErrorReasonSentence(metadata.sia_error_reason_category);
    const boardStyleSummary = board?.style_summary?.trim() || null;

    const benchmark = await computeQuestionTimeBenchmark(context.supabase, {
      questionId: question.id,
      topicId: question.topic_id,
      boardId: question.board_id,
    });
    const studentSeconds = row.response_time_seconds ?? 0;

    const sia = {
      reasonSentence,
      pegadinha,
      longText,
      interpretation,
      calculation,
      boardStyleSummary,
      time: {
        studentSeconds,
        averageSeconds: benchmark?.averageSeconds ?? null,
        sampleSize: benchmark?.sampleSize ?? 0,
        note: buildTimeNote(studentSeconds, benchmark, metadata.sia_tags),
      },
      lessonsLearned: buildLessonsLearned({
        reasonSentence,
        boardStyleSummary,
        boardName: base.boardName,
        pegadinha,
        longText,
        interpretation,
        legalReference: metadata.legal_reference || null,
        calculation,
      }),
    };

    return {
      answered: true,
      ...base,
      isCorrect: row.is_correct,
      correctAnswer: row.correct_answer,
      selectedAnswer: row.selected_answer,
      explanation: question.explanation?.trim() || null,
      bibliography: metadata.bibliography || null,
      legalReference: metadata.legal_reference || null,
      sia,
    };
  });
