/**
 * Difficulty Engine — Motor Editorial V1, Etapa 4.
 *
 * Traduz um nível de dificuldade da escala oficial
 * (docs/editorial/classification/05-difficulty.md) em instrução concreta de
 * autoria, usando a mesma matriz D1×0,4 + D2×0,35 + D3×0,25 já fixada
 * naquele documento — não inventa critério novo, aplica a matriz existente
 * "de trás para frente" (dado o nível-alvo, que combinação D1/D2/D3 produz
 * esse score).
 *
 * Módulo puro (sem I/O, sem Supabase) — por isso não tem par `.server.ts`,
 * diferente dos demais módulos do Motor Editorial: não há nada para separar
 * entre contrato e implementação quando não existe chamada externa.
 */

export type EditorialDifficultyLevel =
  "Muito Fácil" | "Fácil" | "Média" | "Difícil" | "Muito Difícil";

export type EditorialDifficultyGuidance = {
  level: EditorialDifficultyLevel;
  /** Instrução textual pronta para o bloco "Decisão editorial do ciclo" do prompt. */
  instruction: string;
  /** Objetivo cognitivo default sugerido para este nível — o content-selector usa isso só quando o Dossiê de disciplina não restringir a escolha. */
  suggestedCognitiveObjective: string;
};

type LevelConfig = {
  d1: number;
  d2: number;
  d3: number;
  d1Criterion: string;
  d2Criterion: string;
  d3Criterion: string;
  atalho?: string;
  suggestedCognitiveObjective: string;
};

/**
 * Uma combinação D1/D2/D3 representativa por nível (existem várias
 * combinações possíveis que caem na mesma faixa de score — esta é só uma
 * combinação válida e verificável pela fórmula, não a única).
 * Score = D1×0,4 + D2×0,35 + D3×0,25.
 */
const LEVEL_CONFIG: Record<EditorialDifficultyLevel, LevelConfig> = {
  "Muito Fácil": {
    d1: 1,
    d2: 1,
    d3: 1,
    d1Criterion: "1 conceito único, definível em 1 frase",
    d2Criterion: "3+ alternativas claramente absurdas; 1 óbvia",
    d3Criterion: 'Verbos tipo "É definido como", "Significa", "Consiste em"',
    atalho: "Definição direta com 1 alternativa absurda tende a Muito Fácil.",
    suggestedCognitiveObjective: "Reconhecimento/recordação direta",
  },
  Fácil: {
    d1: 2,
    d2: 1,
    d3: 2,
    d1Criterion: "2 conceitos ou 1 conceito + 1 dado numérico",
    d2Criterion: "3+ alternativas claramente absurdas; 1 óbvia",
    d3Criterion: 'Verbos tipo "Está correto afirmar", "De acordo com [norma]" (literal)',
    atalho: "Decoreba literal de número de artigo sem contexto tende a Fácil.",
    suggestedCognitiveObjective: "Reconhecimento/recordação direta",
  },
  Média: {
    d1: 3,
    d2: 3,
    d3: 2,
    d1Criterion: "3+ conceitos ou integração de 2 domínios",
    d2Criterion: "4 alternativas plausíveis; diferença de 1 termo técnico",
    d3Criterion: 'Verbos tipo "Está correto afirmar", "De acordo com [norma]" (literal)',
    atalho: "Cálculo com fórmula explícita no enunciado tende a Média.",
    suggestedCognitiveObjective: "Julgamento composto (afirmativas em lista)",
  },
  Difícil: {
    d1: 4,
    d2: 4,
    d3: 3,
    d1Criterion: "Estudo de caso com 4+ variáveis clínicas/normativas",
    d2Criterion: "4-5 alternativas muito próximas; exige detalhe normativo/clínico",
    d3Criterion: 'Verbos tipo "A conduta adequada é", "O procedimento correto"',
    atalho: "Estudo de caso com 5 alternativas e 4 variáveis clínicas tende a Difícil.",
    suggestedCognitiveObjective: "Aplicação a caso concreto",
  },
  "Muito Difícil": {
    d1: 5,
    d2: 5,
    d3: 5,
    d1Criterion: "Integração de 3+ domínios + dado numérico + norma",
    d2Criterion: "Múltipla escolha com pegadinha em termo único",
    d3Criterion: 'Verbos tipo "Assinale a alternativa incorreta", "Exceto", "NÃO se aplica"',
    atalho: "Termo técnico trocado com comando negativo tende a Muito Difícil.",
    suggestedCognitiveObjective: "Verificação por eliminação",
  },
};

function computeScore(config: LevelConfig): number {
  return Number((config.d1 * 0.4 + config.d2 * 0.35 + config.d3 * 0.25).toFixed(2));
}

export function buildDifficultyGuidance(
  level: EditorialDifficultyLevel,
): EditorialDifficultyGuidance {
  const config = LEVEL_CONFIG[level];
  if (!config) {
    const valid = Object.keys(LEVEL_CONFIG).join(", ");
    throw new Error(`Nível de dificuldade inválido: "${level}". Valores aceitos: ${valid}.`);
  }

  const score = computeScore(config);
  const instruction = [
    `Nível de dificuldade alvo: ${level} (score de referência ${score}, matriz de docs/editorial/classification/05-difficulty.md).`,
    `D1 — Pré-requisito de conhecimento (peso 40%): ${config.d1Criterion}.`,
    `D2 — Distância entre alternativas (peso 35%): ${config.d2Criterion}.`,
    `D3 — Tipo de comando (peso 25%): ${config.d3Criterion}.`,
    config.atalho,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    level,
    instruction,
    suggestedCognitiveObjective: config.suggestedCognitiveObjective,
  };
}
