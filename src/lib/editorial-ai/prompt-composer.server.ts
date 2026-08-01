import type { EditorialPromptComposer, EditorialPromptContext } from "./prompt-composer";

/**
 * 7 blocos de docs/editorial/engine-v2/09-IA-002-prompt-builder.md (Motor
 * Editorial V1, Etapa 5): Missão e princípios, Conceito, Banca e estilo,
 * Decisão editorial do ciclo, Contexto operacional, Elementos exigidos na
 * saída, Restrições.
 */

/** Rótulos do contrato de saída — únicos inventados neste módulo (Etapa 5),
 * necessários para o response-parser (Etapa 6) reconhecer estruturalmente
 * a resposta. ASCII puro (sem acento) para casar de forma robusta por
 * regex independentemente de normalização de encoding. */
export const RESPONSE_SECTION_LABELS = {
  enunciado: "ENUNCIADO",
  contexto: "CONTEXTO",
  alternativas: "ALTERNATIVAS",
  gabarito: "GABARITO",
  justificativa: "JUSTIFICATIVA",
  referenciaConceito: "REFERENCIA_CONCEITO",
  objetivoCognitivo: "OBJETIVO_COGNITIVO",
  referenciaBibliografica: "REFERENCIA_BIBLIOGRAFICA",
} as const;

function buildMissionBlock(): string {
  return [
    "== Missão e princípios ==",
    "Você é o Motor Editorial do SimulaPro. Sua tarefa é produzir UMA questão de múltipla escolha completamente INÉDITA, cruzando 3 fontes: (1) o dossiê da disciplina (conceito, definição canônica, dicionário editorial, casos ambíguos), (2) o dossiê da banca (como ela estruturalmente cobra conteúdo) e (3) o conteúdo oficial já resolvido abaixo.",
    "Nunca copie ou reescreva uma questão real existente — a prova de outras provas é só material de aprendizado de ESTILO, não fonte de enunciado. O conhecimento nunca se curva ao estilo da banca: em conflito entre os dois, o Conceito prevalece.",
  ].join("\n");
}

function buildConceptBlock(context: EditorialPromptContext): string {
  return [
    "== Conceito ==",
    `Nome: ${context.concept.name}`,
    `Definição canônica: ${context.concept.canonicalDefinition}`,
  ].join("\n");
}

/**
 * Nota de calibração (Sprint 4.3, Regra 3 — "DNA das Bancas"): achado real da
 * homologação humana (Sprint 4.2) foi uma questão IBFC Difícil usando vinheta
 * clínica extensa, estrutura mais típica da FGV. Reforça, com base nos
 * próprios Dossiês (docs/metodologia/DOSSIE_IBFC_V1.md Cap.5; DOSSIE_FGV_V1.md
 * Cap.2/Cap.7), a diferença real e documentada de escalonamento de
 * dificuldade entre as duas bancas — não inventa característica nova.
 */
function buildBoardCalibrationNote(boardName: string): string | undefined {
  const normalized = boardName.trim().toUpperCase();
  if (normalized === "IBFC") {
    return 'Calibração (Sprint 4.3): o Dossiê IBFC (Cap.5) documenta que contexto clínico funcional é raro mesmo em nível Difícil (~5,7% da amostra) — o escalonamento real de dificuldade desta banca é por julgamento composto (V/F, I/II/III, "apenas") e por densidade normativa, não por vinheta clínica longa. Evite abrir a questão com um cenário de paciente extenso; prefira comando direto ou julgamento composto de afirmativas para elevar a dificuldade.';
  }
  if (normalized === "FGV") {
    return "Calibração (Sprint 4.3): o Dossiê FGV documenta estudo de caso aplicado e personagem nomeado como mecanismo central de identidade da banca (Cap.2, Cap.7). Ao elevar a dificuldade, prefira consolidar múltiplas variáveis clínicas/administrativas em um caso concreto, não apenas comando direto — reforçando a diferença real de estilo frente ao IBFC.";
  }
  return undefined;
}

function buildBoardBlock(context: EditorialPromptContext): string {
  const lines = [
    "== Banca e estilo ==",
    `Banca de referência: ${context.board.name}`,
    context.board.styleNotes,
  ];
  const calibrationNote = buildBoardCalibrationNote(context.board.name);
  if (calibrationNote) lines.push(calibrationNote);
  return lines.join("\n");
}

function buildCycleDecisionBlock(context: EditorialPromptContext): string {
  return [
    "== Decisão editorial do ciclo ==",
    `Curso: ${context.cycleDecision.courseName}`,
    `Cargo: ${context.cycleDecision.positionName}`,
    `Objetivo cognitivo: ${context.cycleDecision.cognitiveObjective}`,
    `Estratégia de cobrança: ${context.cycleDecision.strategy}`,
    context.cycleDecision.difficultyInstruction,
  ].join("\n");
}

function buildOperationalContextBlock(context: EditorialPromptContext): string {
  const lines = ["== Contexto operacional =="];
  if (context.operationalContext?.classificationNotes) {
    lines.push(`Regras de classificação: ${context.operationalContext.classificationNotes}`);
  }
  if (context.operationalContext?.dictionaryNotes) {
    lines.push(
      `Dicionário editorial (sinônimos/palavras-chave/siglas/leis): ${context.operationalContext.dictionaryNotes}`,
    );
  }
  if (context.operationalContext?.ambiguousCasesNotes) {
    lines.push(`Casos ambíguos conhecidos: ${context.operationalContext.ambiguousCasesNotes}`);
  }
  if (lines.length === 1) {
    lines.push("Nenhuma nota operacional adicional registrada para este conceito.");
  }
  return lines.join("\n");
}

function buildRequiredElementsBlock(context: EditorialPromptContext): string {
  const l = RESPONSE_SECTION_LABELS;
  return [
    "== Elementos exigidos na saída ==",
    `Responda EXCLUSIVAMENTE no formato abaixo, uma seção por linha iniciada pelo rótulo em maiúsculas seguido de dois-pontos. Não inclua nenhum texto fora dessas seções (sem saudação, sem explicação extra).`,
    "",
    `${l.enunciado}: <enunciado da questão, unívoco>`,
    `${l.contexto}: <cenário/contexto, ou "N/A" se não se aplicar>`,
    `${l.alternativas}:`,
    "(A) <texto da alternativa A>",
    "(B) <texto da alternativa B>",
    "(C) <texto da alternativa C>",
    "(D) <texto da alternativa D>",
    "(E) <texto da alternativa E>",
    `${l.gabarito}: <uma letra A-E>`,
    `${l.justificativa}: <por que a correta está certa e cada distrator está errado>`,
    `${l.referenciaConceito}: <como esta questão se conecta ao Conceito acima>`,
    `${l.objetivoCognitivo}: <qual objetivo cognitivo do bloco "Decisão editorial do ciclo" esta questão de fato exercita>`,
    `${l.referenciaBibliografica}: <fonte externa verificável — lei, protocolo, portaria ou literatura técnica>`,
    "",
    "Elementos exigidos (E-01…E-10, docs/editorial/engine-v2/08-IA-001-blueprint-editorial.md):",
    ...context.requiredElements.map((element) => `- ${element}`),
  ].join("\n");
}

function buildRestrictionsBlock(context: EditorialPromptContext): string {
  return [
    "== Restrições ==",
    ...context.restrictions.map((restriction) => `- ${restriction}`),
  ].join("\n");
}

export class DefaultEditorialPromptComposer implements EditorialPromptComposer {
  compose(context: EditorialPromptContext): string {
    return [
      buildMissionBlock(),
      buildConceptBlock(context),
      buildBoardBlock(context),
      buildCycleDecisionBlock(context),
      buildOperationalContextBlock(context),
      buildRequiredElementsBlock(context),
      buildRestrictionsBlock(context),
    ].join("\n\n");
  }
}

export const editorialPromptComposer: EditorialPromptComposer =
  new DefaultEditorialPromptComposer();
