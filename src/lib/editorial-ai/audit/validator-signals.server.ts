import { listEditorialAiAnnotationsByCycleId } from "../service.server";
import type { EditorialAiAnnotationCriterion } from "../types";

/**
 * Leitura dos apontamentos já gravados pelo Validator (Fase 5 — Auditor
 * Editorial, IT-007). Ajuste explícito do usuário: o Auditor NUNCA
 * recalcula nada — só lê `editorial_ai_annotations` (já persistido por
 * `editorial-validator.server.ts` no momento da geração) e classifica o
 * texto já escrito. Nenhuma lógica de checagem é duplicada aqui.
 *
 * Classificação textual: a própria fraseologia do Validator marca falha
 * mecânica com a palavra "reprovou" (ex.: "Checagem mecânica reprovou:
 * campos ausentes..."), confirmado nos dados reais das Sprints 4.1/4.3,
 * inclusive no caso de truncamento capturado na Sprint 4.1. Os dois
 * critérios sem NENHUM ramo mecânico no Validator (sempre a mesma nota fixa
 * "reservado para leitura humana", nunca "reprovou" nem "Checagem mecânica:
 * ... presente") são marcados à parte para não sugerir uma checagem que
 * nunca existiu.
 */
export type EditorialAuditValidatorSignalStatus =
  "OK_MECANICO" | "FALHA_MECANICA" | "PENDENTE_HUMANO";

export type EditorialAuditValidatorSignal = {
  criterion: EditorialAiAnnotationCriterion;
  status: EditorialAuditValidatorSignalStatus;
  /** Texto exatamente como gravado pelo Validator — nunca reescrito aqui. */
  description: string;
};

/**
 * Os 2 critérios que o Validator (`editorial-validator.server.ts`) sempre
 * retorna como nota fixa de leitura humana, sem nenhum ramo de checagem
 * mecânica: `checkFidelidadeAoConceito` e `checkAderenciaEstiloBanca`.
 * Registrado aqui como fato de classificação (o que o Validator já faz),
 * não como lógica de checagem nova.
 */
const VALIDATOR_HUMAN_ONLY_CRITERIA = new Set<EditorialAiAnnotationCriterion>([
  "FIDELIDADE_AO_CONCEITO",
  "ADERENCIA_ESTILO_BANCA",
]);

export async function readEditorialAuditValidatorSignals(
  cycleId: string,
): Promise<EditorialAuditValidatorSignal[]> {
  const annotations = await listEditorialAiAnnotationsByCycleId(cycleId);
  return annotations.map((annotation) => {
    if (VALIDATOR_HUMAN_ONLY_CRITERIA.has(annotation.criterion)) {
      return {
        criterion: annotation.criterion,
        status: "PENDENTE_HUMANO" as const,
        description: annotation.description,
      };
    }
    const status = annotation.description.includes("reprovou")
      ? ("FALHA_MECANICA" as const)
      : ("OK_MECANICO" as const);
    return { criterion: annotation.criterion, status, description: annotation.description };
  });
}
