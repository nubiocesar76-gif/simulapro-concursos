/**
 * SIA — Sistema de Inteligência de Aprendizagem (V1, piloto).
 * Catálogos fixos compartilhados entre a autoria (admin) e a exibição ao
 * aluno — nenhum texto de banca/pegadinha/etc. é improvisado, tudo vem
 * destes catálogos ou dos campos autorados em `questions.metadata`
 * (ver `QuestionMetadataFields` em `src/lib/questions.ts`).
 */

export type SiaTagKey =
  | "banca"
  | "pegadinha"
  | "texto_longo"
  | "interpretacao"
  | "lei_seca"
  | "calculo"
  | "protocolo"
  | "atencao_detalhes"
  | "tema_recorrente"
  | "questao_demorada";

export type SiaTagDefinition = {
  key: SiaTagKey;
  icon: string;
  label: string;
};

/**
 * As 10 tags do catálogo oficial. Todas são autoradas manualmente por
 * questão (nenhuma é derivada automaticamente de outro bloco) — em
 * particular "questao_demorada" NÃO é ligada ao cálculo do Bloco 9 (tempo):
 * são dois conceitos independentes, um editorial (esta tag) e um estatístico
 * (a comparação de tempo, sempre calculada, com ou sem esta tag marcada).
 */
export const SIA_TAG_CATALOG: SiaTagDefinition[] = [
  { key: "banca", icon: "🏦", label: "Estilo da banca" },
  { key: "pegadinha", icon: "🎯", label: "Pegadinha" },
  { key: "texto_longo", icon: "📖", label: "Texto longo" },
  { key: "interpretacao", icon: "🧠", label: "Interpretação" },
  { key: "lei_seca", icon: "⚖", label: "Lei seca" },
  { key: "calculo", icon: "📊", label: "Cálculo" },
  { key: "protocolo", icon: "📚", label: "Protocolo" },
  { key: "atencao_detalhes", icon: "🔍", label: "Atenção aos detalhes" },
  { key: "tema_recorrente", icon: "⭐", label: "Tema recorrente" },
  { key: "questao_demorada", icon: "⏱", label: "Questão demorada" },
];

export function getSiaTagDefinition(key: string): SiaTagDefinition | undefined {
  return SIA_TAG_CATALOG.find((t) => t.key === key);
}

export type SiaErrorReasonCategory =
  | "pegadinha"
  | "interpretacao"
  | "confusao_conceitos"
  | "erro_calculo"
  | "desconhecimento_lei"
  | "leitura_rapida"
  | "informacao_ignorada";

export const SIA_ERROR_REASON_OPTIONS: { key: SiaErrorReasonCategory; label: string }[] = [
  { key: "pegadinha", label: "Caiu na pegadinha" },
  { key: "interpretacao", label: "Interpretou errado" },
  { key: "confusao_conceitos", label: "Confundiu conceitos" },
  { key: "erro_calculo", label: "Errou cálculo" },
  { key: "desconhecimento_lei", label: "Não conhecia a lei" },
  { key: "leitura_rapida", label: "Leu rápido demais" },
  { key: "informacao_ignorada", label: "Ignorou informação importante" },
];

export function getSiaErrorReasonLabel(category: string): string | null {
  return SIA_ERROR_REASON_OPTIONS.find((o) => o.key === category)?.label ?? null;
}

/**
 * Frase do Bloco 2 — sempre com linguagem de probabilidade, nunca uma
 * afirmação determinística sobre o motivo real do erro individual do
 * aluno (o campo é estático por questão, não comprovado por alternativa
 * marcada — mapeamento por alternativa fica fora do escopo da V1).
 */
export function buildErrorReasonSentence(category: string): string | null {
  const label = getSiaErrorReasonLabel(category);
  if (!label) return null;
  return `Possível motivo do erro: ${label.toLowerCase()}.`;
}
