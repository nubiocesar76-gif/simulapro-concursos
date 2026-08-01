/**
 * Contrato do Content Selector — Motor Editorial V1, Etapa 3.
 *
 * Fronteira que mantém o Motor Editorial agnóstico sobre QUEM decide "o que
 * estudar". Hoje só o modo `"manual"` está implementado (disciplina →
 * assunto → subassunto, decidido por uma pessoa). O modo `"intelligent"`
 * está reservado para um futuro Motor de Aprendizado (concurso, banca,
 * métricas do aluno, plano de estudo) — ver plano aprovado em
 * `C:\Users\Nubio\.claude\plans\inherited-discovering-origami.md`, Etapa 3.
 *
 * Tudo daqui para frente na engine (discipline-loader via IDs resolvidos,
 * board-loader, difficulty-engine, orchestrator) consome exclusivamente
 * `EditorialContentTarget` — nunca sabe se a origem foi manual ou
 * inteligente. Trocar a origem no futuro não deve exigir tocar em nenhum
 * outro módulo do Motor Editorial.
 */

export type EditorialTargetSourceOrigin = "MANUAL" | "INTELLIGENT";

/**
 * Alvo editorial já resolvido — o único contrato que os módulos de geração
 * enxergam. `subtopicId` e `topicId` são mutuamente exclusivos (mesma regra
 * XOR de `editorial_ai_inputs`/discipline-loader).
 */
export type EditorialContentTarget = {
  subtopicId?: string;
  topicId?: string;
  boardId: string;
  cognitiveObjective: string;
  strategy: string;
  sourceOrigin: EditorialTargetSourceOrigin;
};

export type EditorialManualTargetRequest = {
  mode: "manual";
  /** Nome (ou trecho do nome) da disciplina — ex.: "Saúde do Idoso". Resolvido por nome, não por slug interno (`editorial_disciplines.slug` é um código opaco tipo "d21", não um slug legível). */
  disciplineName: string;
  /** Nome (ou trecho do nome) do assunto — ex.: "Síndromes Geriátricas". */
  topicName: string;
  /** Nome (ou trecho do nome) do subassunto — ex.: "Quedas". Opcional: quando ausente, o alvo fica no nível de assunto (`topicId`). */
  subtopicName?: string;
  boardId: string;
  quantity: number;
};

/**
 * Reservado para o futuro Motor de Aprendizado — NÃO implementado nesta
 * fase. Os campos abaixo documentam o formato de extensão esperado
 * (concurso, banca, métricas do aluno, plano de estudo), mas
 * `selectContentTargets` lança erro explícito se este ramo for usado.
 */
export type EditorialIntelligentTargetRequest = {
  mode: "intelligent";
  contestId?: string;
  boardId?: string;
  studentMetrics?: unknown;
  studyPlanId?: string;
  quantity: number;
};

export type EditorialTargetRequest =
  EditorialManualTargetRequest | EditorialIntelligentTargetRequest;

export type EditorialTargetSelectionResult = {
  targets: EditorialContentTarget[];
  /** Ex.: quando o repertório catalogado não suportava `quantity` alvos distintos e menos alvos foram retornados. */
  warnings: string[];
};

export interface ContentSelector {
  selectTargets(request: EditorialTargetRequest): Promise<EditorialTargetSelectionResult>;
}
