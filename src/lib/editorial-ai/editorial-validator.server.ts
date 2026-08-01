import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type {
  EditorialValidationAnnotation,
  EditorialValidationInput,
  EditorialValidator,
} from "./editorial-validator";

const HUMAN_JUDGMENT_NOTE =
  "Checagem mecânica não se aplica a este critério — apontamento reservado para leitura humana (IA-005: nenhum critério decide sozinho).";

function checkFidelidadeAoConceito(input: EditorialValidationInput): EditorialValidationAnnotation {
  return {
    criterion: "FIDELIDADE_AO_CONCEITO",
    description: `${HUMAN_JUDGMENT_NOTE} Conferir se o enunciado gerado corresponde à definição canônica de "${input.context.concept.name}": ${input.context.concept.canonicalDefinition}`,
  };
}

function checkClarezaEnunciado(input: EditorialValidationInput): EditorialValidationAnnotation {
  const statement = input.elements.statement ?? "";
  const questionMarks = (statement.match(/\?/g) ?? []).length;
  const issues: string[] = [];
  if (!statement.trim()) issues.push("enunciado ausente");
  if (questionMarks > 1)
    issues.push(
      `${questionMarks} pontos de interrogação — possível enunciado com mais de uma pergunta`,
    );
  const description = issues.length
    ? `Checagem mecânica encontrou possíveis problemas: ${issues.join("; ")}. Revisão humana necessária.`
    : `Checagem mecânica não encontrou problema estrutural óbvio (1 enunciado, ${questionMarks} interrogação(ões)). Univocidade e clareza continuam exigindo leitura humana.`;
  return { criterion: "CLAREZA_ENUNCIADO", description };
}

function checkCoerenciaContexto(input: EditorialValidationInput): EditorialValidationAnnotation {
  const contextText = input.elements.context?.trim();
  const hasContext = Boolean(contextText) && contextText !== "N/A";
  return {
    criterion: "COERENCIA_CONTEXTO",
    description: hasContext
      ? `${HUMAN_JUDGMENT_NOTE} Contexto fornecido: verificar se é funcional (indispensável para responder) ou apenas decorativo.`
      : "Nenhum contexto/cenário foi fornecido (marcado N/A ou ausente) — conferir se o objetivo cognitivo do ciclo realmente dispensava contexto.",
  };
}

function checkPlausibilidadeDistratores(
  input: EditorialValidationInput,
): EditorialValidationAnnotation {
  const alts = input.elements.alternatives;
  const issues: string[] = [];
  if (alts.length !== 5) issues.push(`${alts.length} alternativas encontradas (esperado 5)`);
  const emptyOnes = alts.filter((a) => !a.text.trim());
  if (emptyOnes.length) issues.push(`${emptyOnes.length} alternativa(s) vazia(s)`);
  const texts = alts.map((a) => a.text.trim().toLowerCase());
  const duplicated = texts.some((t, i) => t && texts.indexOf(t) !== i);
  if (duplicated) issues.push("duas ou mais alternativas com texto idêntico");
  return {
    criterion: "PLAUSIBILIDADE_DISTRATORES",
    description: issues.length
      ? `Checagem mecânica reprovou: ${issues.join("; ")}.`
      : "Checagem mecânica: 5 alternativas presentes, nenhuma vazia, nenhuma duplicada. Plausibilidade do erro em si continua exigindo leitura humana.",
  };
}

function checkDefensibilidadeGabarito(
  input: EditorialValidationInput,
): EditorialValidationAnnotation {
  const answer = input.elements.correctAnswer;
  const letters = input.elements.alternatives.map((a) => a.letter);
  const valid = Boolean(answer) && letters.includes(answer as (typeof letters)[number]);
  return {
    criterion: "DEFENSIBILIDADE_GABARITO",
    description: valid
      ? `Checagem mecânica: gabarito "${answer}" corresponde a uma alternativa presente. Defensibilidade do conteúdo continua exigindo leitura humana.`
      : `Checagem mecânica reprovou: gabarito "${answer ?? "(ausente)"}" não corresponde a nenhuma das alternativas presentes (${letters.join(", ") || "nenhuma"}).`,
  };
}

function checkConsistenciaJustificativa(
  input: EditorialValidationInput,
): EditorialValidationAnnotation {
  const explanation = input.elements.explanation ?? "";
  const answer = input.elements.correctAnswer;
  const mentionsAnswer = answer ? explanation.includes(answer) : false;
  return {
    criterion: "CONSISTENCIA_JUSTIFICATIVA",
    description: !explanation.trim()
      ? "Checagem mecânica reprovou: justificativa ausente."
      : mentionsAnswer
        ? `${HUMAN_JUDGMENT_NOTE} Justificativa presente e menciona a letra do gabarito ("${answer}").`
        : `${HUMAN_JUDGMENT_NOTE} Justificativa presente, mas não cita explicitamente a letra do gabarito — conferir se justifica a alternativa correta e cada distrator.`,
  };
}

function checkVerificabilidadeReferencia(
  input: EditorialValidationInput,
): EditorialValidationAnnotation {
  const ref = input.elements.bibliographicReference?.trim() ?? "";
  return {
    criterion: "VERIFICABILIDADE_REFERENCIA",
    description: !ref
      ? "Checagem mecânica reprovou: referência bibliográfica ausente."
      : `${HUMAN_JUDGMENT_NOTE} Referência informada: "${ref}". Conferir se é uma fonte real e verificável (lei/protocolo/portaria/literatura), não uma citação genérica ou inventada.`,
  };
}

function checkAderenciaEstiloBanca(input: EditorialValidationInput): EditorialValidationAnnotation {
  return {
    criterion: "ADERENCIA_ESTILO_BANCA",
    description: `${HUMAN_JUDGMENT_NOTE} Banca de referência: "${input.context.board.name}". Conferir enunciado/alternativas/comando contra o estilo descrito no bloco "Banca e estilo" do prompt usado neste ciclo.`,
  };
}

/**
 * Único critério com checagem mecânica contra o acervo real: busca por
 * correspondência textual exata (normalizada) do enunciado gerado dentro de
 * `questions.statement`. É uma checagem LIMITADA (só pega cópia literal, não
 * paráfrase) — por isso o resultado nunca é fraseado como aprovação
 * definitiva, sempre como "nenhuma correspondência EXATA encontrada".
 */
async function checkAusenciaIndicioCopia(
  input: EditorialValidationInput,
): Promise<EditorialValidationAnnotation> {
  const statement = input.elements.statement?.trim();
  if (!statement) {
    return {
      criterion: "AUSENCIA_INDICIO_COPIA",
      description: "Não foi possível checar contra o acervo: enunciado ausente.",
    };
  }

  const { data, error } = await supabaseAdmin
    .from("questions")
    .select("id")
    .eq("statement", statement)
    .limit(1);

  if (error) {
    return {
      criterion: "AUSENCIA_INDICIO_COPIA",
      description: `Checagem automática falhou (${error.message}) — revisão humana obrigatória para este critério.`,
    };
  }

  return {
    criterion: "AUSENCIA_INDICIO_COPIA",
    description:
      data && data.length > 0
        ? `ALERTA: encontrada questão existente no acervo com enunciado textualmente idêntico (id ${data[0].id}). Bloquear até revisão humana confirmar.`
        : "Nenhuma correspondência EXATA de enunciado encontrada no acervo publicado. Checagem limitada a cópia literal — não detecta paráfrase; revisão humana continua obrigatória.",
  };
}

function checkCoerenciaMetadados(input: EditorialValidationInput): EditorialValidationAnnotation {
  const e = input.elements;
  const requiredPresent = [
    ["Enunciado", e.statement],
    ["Alternativas", e.alternatives.length > 0 ? "ok" : ""],
    ["Gabarito", e.correctAnswer],
    ["Justificativa", e.explanation],
    ["Referência ao conceito", e.conceptReference],
    ["Objetivo cognitivo", e.cognitiveObjective],
    ["Referência bibliográfica", e.bibliographicReference],
  ] as const;
  const missing = requiredPresent.filter(([, value]) => !value?.trim()).map(([label]) => label);
  return {
    criterion: "COERENCIA_METADADOS",
    description: missing.length
      ? `Checagem mecânica reprovou: campos ausentes — ${missing.join(", ")}.`
      : "Checagem mecânica: todos os 7 campos estruturados obrigatórios estão presentes.",
  };
}

export class DefaultEditorialValidator implements EditorialValidator {
  async validate(input: EditorialValidationInput): Promise<EditorialValidationAnnotation[]> {
    const copiaCheck = await checkAusenciaIndicioCopia(input);
    return [
      checkFidelidadeAoConceito(input),
      checkClarezaEnunciado(input),
      checkCoerenciaContexto(input),
      checkPlausibilidadeDistratores(input),
      checkDefensibilidadeGabarito(input),
      checkConsistenciaJustificativa(input),
      checkVerificabilidadeReferencia(input),
      checkAderenciaEstiloBanca(input),
      copiaCheck,
      checkCoerenciaMetadados(input),
    ];
  }
}

export const editorialValidator: EditorialValidator = new DefaultEditorialValidator();
