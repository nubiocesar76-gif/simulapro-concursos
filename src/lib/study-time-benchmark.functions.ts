// SIA V1 (Bloco 9 "Tempo") — createServerFn seguro para importar de
// componentes React (mesmo padrão de free-subscription.functions.ts):
// a implementação real só roda no servidor, o bundle do cliente recebe um
// stub RPC. Nunca lança para o chamador — falha do benchmark não pode
// bloquear a correção (regra explícita do plano SIA V1).

import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

const MIN_SAMPLE = 5;
const TIMEOUT_MS = 3000;

export type QuestionTimeBenchmark = {
  averageSeconds: number;
  sampleSize: number;
  source: "question" | "topic" | "board";
} | null;

async function averageResponseTime(
  supabase: SupabaseClient<Database>,
  questionIds: string[],
): Promise<{ averageSeconds: number; sampleSize: number } | null> {
  if (!questionIds.length) return null;

  const { data, error } = await supabase
    .from("study_session_questions")
    .select("response_time_seconds")
    .in("question_id", questionIds)
    .not("response_time_seconds", "is", null);
  if (error) throw error;

  const values = (data ?? [])
    .map((r: { response_time_seconds: number | null }) => r.response_time_seconds)
    .filter((v: number | null): v is number => typeof v === "number" && v > 0);

  if (values.length < MIN_SAMPLE) return null;

  const sum = values.reduce((acc: number, v: number) => acc + v, 0);
  return { averageSeconds: Math.round(sum / values.length), sampleSize: values.length };
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("timeout")), ms)),
  ]);
}

/**
 * Lógica pura, reaproveitável tanto pelo endpoint RPC abaixo quanto por
 * `study-question-detail.functions.ts` (chamada direta, sem round-trip HTTP
 * extra, já que ambos rodam no mesmo processo de servidor). Fallback em
 * cascata: questão específica → tópico → banca. Nunca lança — qualquer
 * falha (timeout, erro de query) vira `null`, tratado pelo chamador como
 * "amostra insuficiente" (o Bloco 9 sempre tem uma frase de fallback).
 */
export async function computeQuestionTimeBenchmark(
  supabase: SupabaseClient<Database>,
  input: { questionId: string; topicId: string | null; boardId: string | null },
): Promise<QuestionTimeBenchmark> {
  try {
    return await withTimeout(
      (async (): Promise<QuestionTimeBenchmark> => {
        const byQuestion = await averageResponseTime(supabase, [input.questionId]);
        if (byQuestion) return { ...byQuestion, source: "question" };

        if (input.topicId) {
          const { data: topicQuestions, error } = await supabase
            .from("questions")
            .select("id")
            .eq("topic_id", input.topicId);
          if (!error && topicQuestions?.length) {
            const byTopic = await averageResponseTime(
              supabase,
              topicQuestions.map((q: { id: string }) => q.id),
            );
            if (byTopic) return { ...byTopic, source: "topic" };
          }
        }

        if (input.boardId) {
          const { data: boardQuestions, error } = await supabase
            .from("questions")
            .select("id")
            .eq("board_id", input.boardId);
          if (!error && boardQuestions?.length) {
            const byBoard = await averageResponseTime(
              supabase,
              boardQuestions.map((q: { id: string }) => q.id),
            );
            if (byBoard) return { ...byBoard, source: "board" };
          }
        }

        return null;
      })(),
      TIMEOUT_MS,
    );
  } catch {
    return null;
  }
}

export const getQuestionTimeBenchmark = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator(
    (input: { questionId: string; topicId: string | null; boardId: string | null }) => input,
  )
  .handler(async ({ context, data }): Promise<QuestionTimeBenchmark> =>
    computeQuestionTimeBenchmark(context.supabase, data),
  );
