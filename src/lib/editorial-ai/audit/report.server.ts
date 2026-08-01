import {
  sampleEditorialAiCycles,
  type EditorialAuditSampleItem,
  type EditorialAuditSamplingInput,
} from "./sampling.server";
import {
  readEditorialAuditValidatorSignals,
  type EditorialAuditValidatorSignal,
} from "./validator-signals.server";
import {
  findEditorialAuditThematicOverlap,
  type EditorialAuditOverlapCandidate,
} from "./thematic-overlap.server";
import { getLatestEditorialAiContentByCycleId } from "../service.server";
import type { EditorialAiContent } from "../types";

/**
 * Relatório de auditoria por lote (Fase 5 — Auditor Editorial, IT-007).
 * Formato Markdown fixo, desenhado para ser relido por
 * `scripts/editorial/audit-metrics.ts` depois que um humano preencher os
 * vereditos `[PENDENTE]`. Nunca escreve em `editorial_ai_cycles` ou
 * `editorial_ai_decisions` — é só leitura + composição de texto.
 */

/**
 * Critérios exclusivos do Auditor (não existem em
 * `editorial_ai_annotations`/`EditorialAiAnnotationCriterion`) — cobrem os
 * pontos do escopo da Fase 5 que o Validator (IA-005) não avalia porque
 * exigem olhar o conteúdo em detalhe (qualidade do distrator em si,
 * qualidade da explicação, adequação da referência ao Conceito específico),
 * comparar com o acervo (repetição temática) ou comparar entre dificuldades
 * de um mesmo assunto (fora do escopo de um ciclo isolado).
 */
const AUDITOR_ONLY_CRITERIA = [
  "QUALIDADE_DISTRATORES",
  "QUALIDADE_EXPLICACAO",
  "ADEQUACAO_REFERENCIA",
  "REPETICAO_TEMATICA",
  "CONSISTENCIA_DIFICULDADE",
] as const;

type QuestionReportBlock = {
  sample: EditorialAuditSampleItem;
  content: EditorialAiContent | null;
  validatorSignals: EditorialAuditValidatorSignal[];
  overlapCandidates: EditorialAuditOverlapCandidate[];
};

async function buildQuestionBlock(sample: EditorialAuditSampleItem): Promise<QuestionReportBlock> {
  const [content, validatorSignals, overlapCandidates] = await Promise.all([
    getLatestEditorialAiContentByCycleId(sample.cycleId),
    readEditorialAuditValidatorSignals(sample.cycleId),
    findEditorialAuditThematicOverlap({
      boardId: sample.boardId,
      searchTerm: sample.subtopicName ?? sample.topicName,
    }),
  ]);
  return { sample, content, validatorSignals, overlapCandidates };
}

function statusLabel(status: EditorialAuditValidatorSignal["status"]): string {
  if (status === "OK_MECANICO") return "OK MECÂNICO";
  if (status === "FALHA_MECANICA") return "FALHA MECÂNICA";
  return "PENDENTE";
}

function renderQuestionBlock(block: QuestionReportBlock, index: number): string {
  const { sample, content, validatorSignals, overlapCandidates } = block;
  const lines: string[] = [];

  lines.push(
    `### Questão ${index} — ${sample.boardName} / ${sample.difficultyLevel} / ${sample.disciplineName}/${sample.topicName}${sample.subtopicName ? ` (${sample.subtopicName})` : ""}`,
  );
  lines.push(`cycle_id: ${sample.cycleId}`);
  lines.push(`batch_id: ${sample.batchId ?? "(sem lote)"}`);
  lines.push("");
  lines.push("-- Critérios do Validator (lidos de editorial_ai_annotations, não recalculados) --");
  for (const signal of validatorSignals) {
    const note =
      signal.status === "PENDENTE_HUMANO" ? " (humano, sem checagem mecânica no Validator)" : "";
    lines.push(`Critério: ${signal.criterion} | Veredito: [${statusLabel(signal.status)}]${note}`);
    lines.push("Notas: ");
  }
  lines.push("-- Critérios exclusivos do Auditor (não existem no Validator) --");
  for (const criterion of AUDITOR_ONLY_CRITERIA) {
    const note =
      criterion === "REPETICAO_TEMATICA" ? " (apoiado no achado de sobreposição abaixo)" : "";
    lines.push(`Critério: ${criterion} | Veredito: [PENDENTE]${note}`);
    lines.push("Notas: ");
  }
  lines.push("");

  if (!content) {
    lines.push("**Sem conteúdo gerado para este ciclo (editorial_ai_contents ausente).**");
  } else {
    lines.push(`**Enunciado:** ${content.statement ?? "(ausente)"}`);
    lines.push("");
    lines.push("**Alternativas:**");
    const alternatives = Array.isArray(content.alternatives) ? content.alternatives : [];
    for (const alt of alternatives) {
      lines.push(String(alt));
    }
    lines.push("");
    lines.push(`**Gabarito:** ${content.correct_answer ?? "(ausente)"}`);
    lines.push("");
    lines.push(`**Explicação:** ${content.explanation ?? "(ausente)"}`);
    lines.push("");
    lines.push(`**Referência bibliográfica:** ${content.bibliographic_reference ?? "(ausente)"}`);
    if (content.context && content.context !== "N/A") {
      lines.push("");
      lines.push(`**Contexto:** ${content.context}`);
    }
  }

  lines.push("");
  lines.push(
    overlapCandidates.length
      ? `**Candidatos de sobreposição temática no acervo (${overlapCandidates.length}):**`
      : "**Candidatos de sobreposição temática no acervo:** nenhum encontrado.",
  );
  for (const candidate of overlapCandidates) {
    lines.push(`- [${candidate.questionId.slice(0, 8)}] ${candidate.excerpt}`);
  }

  return lines.join("\n");
}

function renderCountsPanel(blocks: QuestionReportBlock[]): string {
  const lines: string[] = ["## Painel de contagens objetivas (sem veredito de lote)", ""];

  const mechanicalCounts = { OK_MECANICO: 0, FALHA_MECANICA: 0, PENDENTE_HUMANO: 0 };
  for (const block of blocks) {
    for (const signal of block.validatorSignals) {
      mechanicalCounts[signal.status] += 1;
    }
  }
  lines.push("**Sinais do Validator, agregados na amostra (lidos, não recalculados):**");
  lines.push(`- OK MECÂNICO: ${mechanicalCounts.OK_MECANICO}`);
  lines.push(`- FALHA MECÂNICA: ${mechanicalCounts.FALHA_MECANICA}`);
  lines.push(`- PENDENTE (sem checagem mecânica possível): ${mechanicalCounts.PENDENTE_HUMANO}`);
  lines.push("");

  const byBoard = new Map<string, number>();
  const byDiscipline = new Map<string, number>();
  const byDifficulty = new Map<string, number>();
  for (const block of blocks) {
    byBoard.set(block.sample.boardName, (byBoard.get(block.sample.boardName) ?? 0) + 1);
    byDiscipline.set(
      block.sample.disciplineName,
      (byDiscipline.get(block.sample.disciplineName) ?? 0) + 1,
    );
    byDifficulty.set(
      block.sample.difficultyLevel,
      (byDifficulty.get(block.sample.difficultyLevel) ?? 0) + 1,
    );
  }

  lines.push(
    `**Amostra por banca:** ${[...byBoard.entries()].map(([k, v]) => `${k}=${v}`).join(", ")}`,
  );
  lines.push(
    `**Amostra por disciplina:** ${[...byDiscipline.entries()].map(([k, v]) => `${k}=${v}`).join(", ")}`,
  );
  lines.push(
    `**Amostra por dificuldade:** ${[...byDifficulty.entries()].map(([k, v]) => `${k}=${v}`).join(", ")}`,
  );
  lines.push("");
  lines.push(
    `**Candidatos de sobreposição temática, total na amostra:** ${blocks.reduce((sum, b) => sum + b.overlapCandidates.length, 0)}`,
  );
  lines.push("");
  lines.push(
    "Nenhum limiar oficial de aprovação/reprovação de lote é aplicado nesta fase — as contagens acima são insumo para leitura humana, não uma conclusão automática (IA-009 §3). Preencha os vereditos `[PENDENTE]` de cada questão (`[OK]`/`[AJUSTE]`/`[REPROVADO]`, com notas) antes de rodar `npm run editorial:audit:metrics`.",
  );

  return lines.join("\n");
}

export async function generateEditorialAuditReport(
  samplingInput: EditorialAuditSamplingInput,
): Promise<string> {
  const samples = await sampleEditorialAiCycles(samplingInput);
  if (!samples.length) {
    throw new Error("Nenhum ciclo com insumo completo encontrado para os batchIds informados.");
  }

  const blocks = await Promise.all(samples.map((sample) => buildQuestionBlock(sample)));

  const header = [
    "# Relatório de Auditoria Editorial",
    "",
    `Gerado em: ${new Date().toISOString()}`,
    `Lote(s): ${samplingInput.batchIds.join(", ")}`,
    `Tamanho da amostra: ${blocks.length}`,
    "",
    "Este relatório implementa IA-006 (artefato de apoio à Etapa 12 — Auditoria",
    "editorial humana) e alimenta IA-009 (Otimização Contínua, Seção 4 —",
    "padrões recorrentes). Nenhum veredito aqui muda o estado editorial de",
    "nenhum ciclo — isso continua exclusivamente humano, via revisão e",
    "homologação (IA-006), fora do escopo deste relatório.",
    "",
    "**Como preencher:** troque `[PENDENTE]` por `[OK]`, `[AJUSTE]` ou",
    "`[REPROVADO]` em cada critério e escreva a nota na linha `Notas:` logo",
    "abaixo. Quando o achado se repetir de um jeito já visto em auditorias",
    "anteriores, marque com uma tag livre (ex.: `#referencia-forcada`,",
    "`#subitem-nao-verificado`, `#estilo-atipico`, `#concentracao-tematica`,",
    "`#dado-nao-verificado`) — `npm run editorial:audit:metrics` soma essas",
    "tags entre relatórios. Novas tags podem ser criadas livremente; não há",
    "lista fechada.",
    "",
    "---",
    "",
  ].join("\n");

  const questionBlocks = blocks
    .map((block, i) => renderQuestionBlock(block, i + 1))
    .join("\n\n---\n\n");
  const countsPanel = renderCountsPanel(blocks);

  return [header, questionBlocks, "", "---", "", countsPanel, ""].join("\n");
}
