/**
 * Motor de resolução de Sessões de Estudo (Sprint 7B/7C).
 */

import { supabase } from "@/integrations/supabase/client";
import { logEvent } from "@/lib/log";
import {
  parseAlternativesFromDb,
  parseMetadataFields,
  type QuestionAlternative,
  type QuestionMetadataFields,
} from "@/lib/questions";
import {
  StudySessionError,
  getFilteredQuestionIdsForDistribution,
  isFilterStudyMode,
  type StudyMode,
  type StudySessionSettings,
  type StudySessionStatus,
} from "@/lib/study-session";

export type StudySessionDetail = {
  id: string;
  user_id: string;
  distribution_id: string;
  mode: StudyMode;
  status: StudySessionStatus;
  settings: StudySessionSettings;
  started_at: string;
  finished_at: string | null;
  duration_seconds: number | null;
  distribution_name: string;
  package_version_id: string;
  version_number: string;
  version_name: string;
  version_status: string;
  package_name: string;
  course_name: string;
};

export type SessionResultsSummary = {
  totalQuestions: number;
  answeredCount: number;
  correctCount: number;
  wrongCount: number;
  percentage: number;
  totalTimeSeconds: number;
  averageTimeSeconds: number;
};

export type SessionResultItem = {
  order: number;
  index: number;
  sessionQuestionId: string;
  questionId: string;
  statement: string;
  statementSummary: string;
  selectedAnswer: string | null;
  correctAnswer: string | null;
  isCorrect: boolean | null;
  explanation: string | null;
  responseTimeSeconds: number | null;
  isAnswered: boolean;
  subjectName: string | null;
  topicName: string | null;
  boardName: string | null;
};

export type SessionResults = {
  summary: SessionResultsSummary;
  items: SessionResultItem[];
  sessionDate: string;
};

export type SessionQuestion = {
  id: string;
  statement: string;
  created_at: string;
};

export type StudySessionQuestionRow = {
  id: string;
  study_session_id: string;
  question_id: string;
  question_order: number;
  selected_answer: string | null;
  correct_answer: string | null;
  is_correct: boolean | null;
  answered_at: string | null;
  response_time_seconds: number | null;
  favorite: boolean;
  review_later: boolean;
};

export type QuestionFeedback = {
  isCorrect: boolean;
  correctAnswer: string;
  explanation: string | null;
  bibliography: string | null;
  legalReference: string | null;
};

export type QuestionContext = {
  boardName: string | null;
  year: number | null;
  subjectName: string | null;
  topicName: string | null;
  difficulty: string | null;
  imageUrl: string | null;
};

export type LoadedQuestion = {
  sessionQuestionId: string;
  questionId: string;
  index: number;
  total: number;
  statement: string;
  alternatives: QuestionAlternative[];
  savedAnswer: string | null;
  isAnswered: boolean;
  favorite: boolean;
  reviewLater: boolean;
  feedback: QuestionFeedback | null;
  context: QuestionContext;
};

export type StartedStudySession = {
  session: StudySessionDetail;
  totalQuestions: number;
  resumeIndex: number;
};

function isSubscriptionActive(startsAt: string, expiresAt: string | null): boolean {
  const now = Date.now();
  if (new Date(startsAt).getTime() > now) return false;
  if (expiresAt && new Date(expiresAt).getTime() < now) return false;
  return true;
}

function isDistributionAvailable(availableFrom: string | null, availableUntil: string | null): boolean {
  const now = Date.now();
  if (availableFrom && new Date(availableFrom).getTime() > now) return false;
  if (availableUntil && new Date(availableUntil).getTime() < now) return false;
  return true;
}

function parseSettings(raw: unknown): StudySessionSettings {
  const s = (raw ?? {}) as Partial<StudySessionSettings>;
  return {
    question_count: s.question_count ?? 10,
    question_order: s.question_order ?? "random",
    show_answers: s.show_answers ?? "during",
  };
}

async function validateSessionAccess(userId: string, distributionId: string) {
  const { data: sub, error: subError } = await supabase
    .from("subscriptions")
    .select("id, status, starts_at, expires_at")
    .eq("user_id", userId)
    .eq("distribution_id", distributionId)
    .eq("status", "ACTIVE")
    .maybeSingle();

  if (subError) throw subError;
  if (!sub) throw new StudySessionError("Assinatura ativa não encontrada para esta distribuição.");
  if (!isSubscriptionActive(sub.starts_at, sub.expires_at)) {
    throw new StudySessionError("Sua assinatura não está vigente neste período.");
  }

  const { data: dist, error: distError } = await supabase
    .from("content_distributions")
    .select("id, status, available_from, available_until")
    .eq("id", distributionId)
    .eq("status", "ACTIVE")
    .maybeSingle();

  if (distError) throw distError;
  if (!dist) throw new StudySessionError("Distribuição não encontrada ou inativa.");
  if (!isDistributionAvailable(dist.available_from, dist.available_until)) {
    throw new StudySessionError("Distribuição fora do período de disponibilidade.");
  }
}

async function fetchOrderedSessionQuestions(sessionId: string): Promise<StudySessionQuestionRow[]> {
  const PAGE_SIZE = 1000;
  const rows: StudySessionQuestionRow[] = [];

  let from = 0;
  for (;;) {
    const { data, error } = await supabase
      .from("study_session_questions")
      .select(
        "id, study_session_id, question_id, question_order, selected_answer, correct_answer, is_correct, answered_at, response_time_seconds, favorite, review_later",
      )
      .eq("study_session_id", sessionId)
      .order("question_order", { ascending: true })
      .range(from, from + PAGE_SIZE - 1);

    if (error) throw error;

    const page = data ?? [];
    rows.push(...page);
    if (page.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  return rows;
}

function getResumeIndex(rows: StudySessionQuestionRow[]): number {
  const firstUnanswered = rows.findIndex((row) => !row.answered_at);
  if (firstUnanswered === -1) return Math.max(rows.length - 1, 0);
  return firstUnanswered;
}

function countAnsweredQuestions(rows: StudySessionQuestionRow[]): number {
  return rows.filter((row) => row.answered_at).length;
}

function summarizeStatement(text: string, maxLength = 140): string {
  const trimmed = text.trim().replace(/\s+/g, " ");
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength)}…`;
}

async function fetchQuestionDetailsForResults(
  questionIds: string[],
): Promise<
  Map<
    string,
    {
      statement: string;
      explanation: string | null;
      subjectName: string | null;
      topicName: string | null;
      boardName: string | null;
    }
  >
> {
  const map = new Map<
    string,
    {
      statement: string;
      explanation: string | null;
      subjectName: string | null;
      topicName: string | null;
      boardName: string | null;
    }
  >();
  if (!questionIds.length) return map;

  const chunkSize = 200;
  for (let i = 0; i < questionIds.length; i += chunkSize) {
    const chunk = questionIds.slice(i, i + chunkSize);
    const { data, error } = await supabase
      .from("questions")
      .select(`
        id,
        statement,
        explanation,
        boards(name, acronym),
        subjects(name),
        topics(name)
      `)
      .in("id", chunk);

    if (error) throw error;
    for (const question of data ?? []) {
      const board = question.boards as { name: string; acronym: string | null } | null;
      const subject = question.subjects as { name: string } | null;
      const topic = question.topics as { name: string } | null;
      map.set(question.id, {
        statement: question.statement,
        explanation: question.explanation,
        subjectName: subject?.name?.trim() || null,
        topicName: topic?.name?.trim() || null,
        boardName: board?.acronym?.trim() || board?.name?.trim() || null,
      });
    }
  }

  return map;
}

function buildSessionResults(
  session: StudySessionDetail,
  rows: StudySessionQuestionRow[],
  questionMap: Map<
    string,
    {
      statement: string;
      explanation: string | null;
      subjectName: string | null;
      topicName: string | null;
      boardName: string | null;
    }
  >,
): SessionResults {
  const answered = rows.filter((row) => row.answered_at);
  const correctCount = answered.filter((row) => row.is_correct === true).length;
  const wrongCount = answered.filter((row) => row.is_correct === false).length;
  const answeredCount = answered.length;
  const totalQuestions = rows.length;

  const totalTimeFromRows = answered.reduce(
    (sum, row) => sum + (row.response_time_seconds ?? 0),
    0,
  );
  const totalTimeSeconds =
    totalTimeFromRows > 0 ? totalTimeFromRows : (session.duration_seconds ?? 0);
  const averageTimeSeconds =
    answeredCount > 0 ? Math.round(totalTimeFromRows / answeredCount) : 0;
  const percentage =
    answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

  const items: SessionResultItem[] = rows.map((row, index) => {
    const question = questionMap.get(row.question_id);
    const statement = question?.statement ?? "—";

    return {
      order: row.question_order,
      index,
      sessionQuestionId: row.id,
      questionId: row.question_id,
      statement,
      statementSummary: summarizeStatement(statement),
      selectedAnswer: row.selected_answer,
      correctAnswer: row.correct_answer,
      isCorrect: row.is_correct,
      explanation: question?.explanation?.trim() || null,
      responseTimeSeconds: row.response_time_seconds,
      isAnswered: !!row.answered_at,
      subjectName: question?.subjectName ?? null,
      topicName: question?.topicName ?? null,
      boardName: question?.boardName ?? null,
    };
  });

  return {
    summary: {
      totalQuestions,
      answeredCount,
      correctCount,
      wrongCount,
      percentage,
      totalTimeSeconds,
      averageTimeSeconds,
    },
    items,
    sessionDate: session.finished_at ?? session.started_at,
  };
}

async function loadSessionResults(
  session: StudySessionDetail,
  rows: StudySessionQuestionRow[],
): Promise<SessionResults> {
  const questionIds = [...new Set(rows.map((row) => row.question_id))];
  const questionMap = await fetchQuestionDetailsForResults(questionIds);
  return buildSessionResults(session, rows, questionMap);
}

function mapQuestionContext(question: {
  year: number | null;
  difficulty: string | null;
  metadata: unknown;
  boards: { name: string; acronym: string | null } | null;
  subjects: { name: string } | null;
  topics: { name: string } | null;
}): QuestionContext {
  const metadata = parseMetadataFields(question.metadata);
  const board = question.boards;
  return {
    boardName: board?.acronym?.trim() || board?.name?.trim() || null,
    year: question.year,
    subjectName: question.subjects?.name?.trim() || null,
    topicName: question.topics?.name?.trim() || null,
    difficulty: question.difficulty?.trim() || null,
    imageUrl: metadata.image_url || null,
  };
}

function buildQuestionFeedback(
  session: StudySessionDetail,
  row: StudySessionQuestionRow,
  explanation: string | null,
  metadata: QuestionMetadataFields,
): QuestionFeedback | null {
  if (session.mode !== "STUDY" && !isFilterStudyMode(session.mode)) return null;
  if (!row.answered_at || row.is_correct === null || !row.correct_answer) {
    return null;
  }

  return {
    isCorrect: row.is_correct,
    correctAnswer: row.correct_answer,
    explanation: explanation?.trim() || null,
    bibliography: metadata.bibliography || null,
    legalReference: metadata.legal_reference || null,
  };
}

export function formatStudyEngineError(error: unknown): string {
  if (error instanceof StudySessionError) return error.message;
  if (error instanceof Error) {
    if (error.message.includes("row-level security")) {
      return "Sem permissão para acessar esta sessão.";
    }
    if (error.message.includes("JSON object requested, multiple (or no) rows returned")) {
      return "Sessão não encontrada.";
    }
    return error.message;
  }
  return "Erro ao carregar sessão de estudo.";
}

export async function getStudySession(sessionId: string): Promise<StudySessionDetail> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new StudySessionError("Usuário não autenticado.");

  const { data, error } = await supabase
    .from("study_sessions")
    .select(`
      id,
      user_id,
      distribution_id,
      mode,
      status,
      settings,
      started_at,
      finished_at,
      duration_seconds,
      content_distributions!inner(
        id,
        name,
        package_version_id,
        package_versions!inner(
          id,
          version_number,
          name,
          status,
          packages(name, courses(name))
        )
      )
    `)
    .eq("id", sessionId)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new StudySessionError("Sessão não encontrada.");

  await validateSessionAccess(user.id, data.distribution_id);

  const dist = data.content_distributions as {
    id: string;
    name: string;
    package_version_id: string;
    package_versions: {
      id: string;
      version_number: string;
      name: string;
      status: string;
      packages: { name: string; courses: { name: string } | null } | null;
    };
  };

  return {
    id: data.id,
    user_id: data.user_id,
    distribution_id: data.distribution_id,
    mode: data.mode,
    status: data.status,
    settings: parseSettings(data.settings),
    started_at: data.started_at,
    finished_at: data.finished_at,
    duration_seconds: data.duration_seconds,
    distribution_name: dist.name,
    package_version_id: dist.package_version_id,
    version_number: dist.package_versions.version_number,
    version_name: dist.package_versions.name,
    version_status: dist.package_versions.status,
    package_name: dist.package_versions.packages?.name ?? "—",
    course_name: dist.package_versions.packages?.courses?.name ?? "—",
  };
}

export async function getSessionQuestions(session: StudySessionDetail): Promise<SessionQuestion[]> {
  if (session.version_status !== "PUBLISHED") {
    throw new StudySessionError("Versão publicada não encontrada para esta distribuição.");
  }

  if (isFilterStudyMode(session.mode)) {
    const questionIds = await getFilteredQuestionIdsForDistribution(
      session.user_id,
      session.package_version_id,
      session.mode,
    );
    if (!questionIds.length) return [];

    const { data, error } = await supabase
      .from("questions")
      .select("id, statement, created_at")
      .eq("package_version_id", session.package_version_id)
      .in("id", questionIds)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data ?? [];
  }

  const PAGE_SIZE = 1000;
  const rows: SessionQuestion[] = [];

  let from = 0;
  for (;;) {
    const { data, error } = await supabase
      .from("questions")
      .select("id, statement, created_at")
      .eq("package_version_id", session.package_version_id)
      .order("created_at", { ascending: true })
      .range(from, from + PAGE_SIZE - 1);

    if (error) throw error;

    const page = data ?? [];
    rows.push(...page);
    if (page.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  return rows;
}

function shuffleQuestions<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function buildQuestionSequence(
  questions: SessionQuestion[],
  settings: StudySessionSettings,
): SessionQuestion[] {
  const ordered =
    settings.question_order === "random"
      ? shuffleQuestions(questions)
      : [...questions].sort(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        );

  if (settings.question_count === "all") return ordered;
  return ordered.slice(0, settings.question_count);
}

export function getNextQuestion(
  sequence: SessionQuestion[],
  currentIndex = 0,
): SessionQuestion | null {
  if (currentIndex < 0 || currentIndex >= sequence.length) return null;
  return sequence[currentIndex] ?? null;
}

export async function openStudySession(sessionId: string) {
  const session = await getStudySession(sessionId);
  const existingRows = await fetchOrderedSessionQuestions(sessionId);

  const allAnswered =
    existingRows.length > 0 && existingRows.every((row) => row.answered_at);

  let sequence: SessionQuestion[];
  if (session.status === "FINISHED" && existingRows.length > 0) {
    sequence = existingRows.map((row) => ({
      id: row.question_id,
      statement: "",
      created_at: "",
    }));
  } else {
    const eligible = await getSessionQuestions(session);
    sequence = buildQuestionSequence(eligible, session.settings);
  }

  let results: SessionResults | null = null;
  if ((session.status === "FINISHED" || allAnswered) && existingRows.length > 0) {
    results = await loadSessionResults(session, existingRows);
  }

  await logEvent("study.session.open", "study_sessions", sessionId, {
    distribution_id: session.distribution_id,
    mode: session.mode,
    question_count: existingRows.length || sequence.length,
    started: existingRows.length > 0,
  });

  return {
    session,
    sequence,
    sessionQuestions: existingRows,
    answeredCount: countAnsweredQuestions(existingRows),
    results,
  };
}

export async function startStudySession(sessionId: string): Promise<StartedStudySession> {
  const session = await getStudySession(sessionId);
  if (session.status === "FINISHED") {
    throw new StudySessionError("Sessão já finalizada.");
  }

  let rows = await fetchOrderedSessionQuestions(sessionId);
  if (!rows.length) {
    const eligible = await getSessionQuestions(session);
    const sequence = buildQuestionSequence(eligible, session.settings);
    if (!sequence.length) {
      throw new StudySessionError("Nenhuma questão disponível para esta sessão.");
    }

    const { error } = await supabase.from("study_session_questions").insert(
      sequence.map((question, index) => ({
        study_session_id: sessionId,
        question_id: question.id,
        question_order: index + 1,
      })),
    );

    if (error) throw error;
    rows = await fetchOrderedSessionQuestions(sessionId);
  }

  await logEvent("study.session.start", "study_sessions", sessionId, {
    distribution_id: session.distribution_id,
    mode: session.mode,
    question_count: rows.length,
  });

  return {
    session,
    totalQuestions: rows.length,
    resumeIndex: getResumeIndex(rows),
  };
}

export async function loadQuestion(sessionId: string, index: number): Promise<LoadedQuestion> {
  const session = await getStudySession(sessionId);
  if (session.status === "FINISHED") {
    throw new StudySessionError("Sessão finalizada.");
  }

  const rows = await fetchOrderedSessionQuestions(sessionId);
  if (!rows.length) {
    throw new StudySessionError("Sessão não iniciada.");
  }
  if (index < 0 || index >= rows.length) {
    throw new StudySessionError("Questão inválida.");
  }

  const row = rows[index];
  const { data: question, error } = await supabase
    .from("questions")
    .select(`
      id,
      statement,
      alternatives,
      correct_answer,
      explanation,
      year,
      difficulty,
      metadata,
      boards(name, acronym),
      subjects(name),
      topics(name)
    `)
    .eq("id", row.question_id)
    .single();

  if (error) throw error;

  const metadata = parseMetadataFields(question.metadata);
  const boards = question.boards as { name: string; acronym: string | null } | null;
  const subjects = question.subjects as { name: string } | null;
  const topics = question.topics as { name: string } | null;

  return {
    sessionQuestionId: row.id,
    questionId: question.id,
    index,
    total: rows.length,
    statement: question.statement,
    alternatives: parseAlternativesFromDb(question.alternatives),
    savedAnswer: row.selected_answer,
    isAnswered: !!row.answered_at,
    favorite: row.favorite,
    reviewLater: row.review_later,
    feedback: buildQuestionFeedback(session, row, question.explanation, metadata),
    context: mapQuestionContext({
      year: question.year,
      difficulty: question.difficulty,
      metadata: question.metadata,
      boards,
      subjects,
      topics,
    }),
  };
}

export async function setQuestionFavorite(input: {
  sessionId: string;
  sessionQuestionId: string;
  favorite: boolean;
}) {
  await getStudySession(input.sessionId);

  const { error } = await supabase
    .from("study_session_questions")
    .update({ favorite: input.favorite })
    .eq("id", input.sessionQuestionId)
    .eq("study_session_id", input.sessionId);

  if (error) throw error;

  await logEvent(
    input.favorite ? "study.question.favorite" : "study.question.unfavorite",
    "study_session_questions",
    input.sessionQuestionId,
    { session_id: input.sessionId, favorite: input.favorite },
  );
}

export async function setQuestionReviewLater(input: {
  sessionId: string;
  sessionQuestionId: string;
  reviewLater: boolean;
}) {
  await getStudySession(input.sessionId);

  const { error } = await supabase
    .from("study_session_questions")
    .update({ review_later: input.reviewLater })
    .eq("id", input.sessionQuestionId)
    .eq("study_session_id", input.sessionId);

  if (error) throw error;

  await logEvent("study.question.review", "study_session_questions", input.sessionQuestionId, {
    session_id: input.sessionId,
    review_later: input.reviewLater,
  });
}

export async function saveAnswer(input: {
  sessionId: string;
  sessionQuestionId: string;
  selectedAnswer: string;
  responseTimeSeconds: number;
}) {
  const session = await getStudySession(input.sessionId);
  if (session.status === "FINISHED") {
    throw new StudySessionError("Sessão finalizada.");
  }

  const selected = input.selectedAnswer.trim().toUpperCase();
  if (!/^[A-Z]$/.test(selected)) {
    throw new StudySessionError("Selecione uma alternativa válida.");
  }

  const { data: row, error: rowError } = await supabase
    .from("study_session_questions")
    .select("id, question_id, answered_at")
    .eq("id", input.sessionQuestionId)
    .eq("study_session_id", input.sessionId)
    .single();

  if (rowError) throw rowError;

  const { data: question, error: questionError } = await supabase
    .from("questions")
    .select("correct_answer")
    .eq("id", row.question_id)
    .single();

  if (questionError) throw questionError;

  const correctAnswer = (question.correct_answer ?? "").trim().toUpperCase();
  const isCorrect = !!correctAnswer && selected === correctAnswer;
  const answeredAt = new Date().toISOString();
  const responseTime = Math.max(0, Math.round(input.responseTimeSeconds));

  const { error: updateError } = await supabase
    .from("study_session_questions")
    .update({
      selected_answer: selected,
      correct_answer: correctAnswer || null,
      is_correct: correctAnswer ? isCorrect : null,
      answered_at: answeredAt,
      response_time_seconds: responseTime,
    })
    .eq("id", input.sessionQuestionId)
    .eq("study_session_id", input.sessionId);

  if (updateError) throw updateError;

  await logEvent("study.question.answer", "study_session_questions", input.sessionQuestionId, {
    session_id: input.sessionId,
    question_id: row.question_id,
    selected_answer: selected,
    is_correct: isCorrect,
    response_time_seconds: responseTime,
  });

  return loadQuestion(input.sessionId, (await fetchOrderedSessionQuestions(input.sessionId)).findIndex(
    (item) => item.id === input.sessionQuestionId,
  ));
}

export async function goToNextQuestion(sessionId: string, currentIndex: number): Promise<number> {
  const rows = await fetchOrderedSessionQuestions(sessionId);
  if (!rows.length) throw new StudySessionError("Sessão não iniciada.");
  if (currentIndex < 0 || currentIndex >= rows.length) {
    throw new StudySessionError("Questão inválida.");
  }
  if (!rows[currentIndex]?.answered_at) {
    throw new StudySessionError("Responda a questão antes de avançar.");
  }
  if (currentIndex >= rows.length - 1) {
    throw new StudySessionError("Você está na última questão.");
  }
  return currentIndex + 1;
}

export async function goToPreviousQuestion(sessionId: string, currentIndex: number): Promise<number> {
  const rows = await fetchOrderedSessionQuestions(sessionId);
  if (!rows.length) throw new StudySessionError("Sessão não iniciada.");
  if (currentIndex <= 0) throw new StudySessionError("Você está na primeira questão.");
  if (currentIndex >= rows.length) throw new StudySessionError("Questão inválida.");
  return currentIndex - 1;
}

export async function finishStudySession(sessionId: string) {
  const session = await getStudySession(sessionId);
  if (session.status === "FINISHED") {
    throw new StudySessionError("Sessão já finalizada.");
  }

  const rows = await fetchOrderedSessionQuestions(sessionId);
  if (!rows.length) {
    throw new StudySessionError("Sessão não iniciada.");
  }

  const unanswered = rows.some((row) => !row.answered_at);
  if (unanswered) {
    throw new StudySessionError("Responda todas as questões antes de finalizar.");
  }

  const finishedAt = new Date().toISOString();
  const durationSeconds = Math.max(
    0,
    Math.floor((Date.now() - new Date(session.started_at).getTime()) / 1000),
  );

  const { error } = await supabase
    .from("study_sessions")
    .update({
      status: "FINISHED",
      finished_at: finishedAt,
      duration_seconds: durationSeconds,
    })
    .eq("id", sessionId);

  if (error) throw error;

  await logEvent("study.session.finish", "study_sessions", sessionId, {
    distribution_id: session.distribution_id,
    mode: session.mode,
    question_count: rows.length,
    duration_seconds: durationSeconds,
  });

  return {
    sessionId,
    finishedAt,
    durationSeconds,
    totalQuestions: rows.length,
  };
}

export async function getStudySessionProgress(sessionId: string) {
  const rows = await fetchOrderedSessionQuestions(sessionId);
  return {
    total: rows.length,
    answered: countAnsweredQuestions(rows),
  };
}
