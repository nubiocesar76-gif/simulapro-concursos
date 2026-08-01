import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type {
  DisciplineLoader,
  DisciplineLoaderInput,
  DisciplineLoaderResult,
} from "./discipline-loader";
import { extractDisciplineBlock, extractSubsectionBySubstring, joinExcerpts } from "./dossie-text";

/**
 * Mesmo padrão de resolução de caminho já usado em
 * src/lib/editorial/import/reader.ts — repetido aqui (não importado de lá)
 * pelo mesmo motivo documentado em board-loader.server.ts: módulos
 * diferentes, o Pipeline Editorial existente não é alterado.
 */
function projectRoot() {
  return resolve(import.meta.dirname, "../../..");
}

type DossieFileEntry = {
  file: string;
  /** Slug entre parênteses no cabeçalho da disciplina, para dossiês que
   * agrupam várias disciplinas. Ausente quando o dossiê já é de 1 disciplina
   * só (o arquivo inteiro é o bloco, sem sub-cabeçalho de disciplina). */
  slugInHeading?: string;
};

/**
 * Mapa disciplina → dossiê narrativo, construído a partir da inspeção direta
 * de docs/editorial/02a-*.md…02l-*.md (Motor Editorial V1, Etapa 1,
 * 2026-07-24) — não é gerado, é fixo porque os 12 arquivos e as 21
 * disciplinas ativas (docs/editorial/normalized/01-disciplinas.json, V1.1)
 * são um conjunto fechado e versionado ("V1.1", sem novas disciplinas sem
 * nova auditoria). Chave = `editorial_disciplines.name` exato.
 */
const DISCIPLINE_DOSSIE_MAP: Record<string, DossieFileEntry> = {
  "Administração em Enfermagem": {
    file: "02b-etica-legislacao-administracao-politicas.md",
    slugInHeading: "administracao-em-enfermagem",
  },
  Biossegurança: {
    file: "02a-fundamentos-biosseguranca-seguranca-paciente.md",
    slugInHeading: "biosseguranca",
  },
  "Centro Cirúrgico e CME": {
    file: "02h-centro-cirurgico-cme-controle-infeccao.md",
    slugInHeading: "centro-cirurgico-e-cme",
  },
  "Enfermagem em Doenças Transmissíveis": {
    file: "02c-saude-coletiva-imunizacao-doencas-transmissiveis.md",
    slugInHeading: "enfermagem-em-doencas-transmissiveis",
  },
  "Enfermagem Médico-Cirúrgica": {
    file: "02e-saude-adulto-idoso-medico-cirurgica.md",
    slugInHeading: "enfermagem-medico-cirurgica",
  },
  "Ética e Legislação em Enfermagem": {
    file: "02b-etica-legislacao-administracao-politicas.md",
    slugInHeading: "etica-e-legislacao-em-enfermagem",
  },
  Farmacologia: { file: "02i-farmacologia.md" },
  "Fundamentos de Enfermagem": {
    file: "02a-fundamentos-biosseguranca-seguranca-paciente.md",
    slugInHeading: "fundamentos-de-enfermagem",
  },
  Informática: { file: "02l-conhecimentos-gerais.md", slugInHeading: "informatica" },
  "Legislação do SUS": {
    file: "02b-etica-legislacao-administracao-politicas.md",
    slugInHeading: "legislacao-do-sus",
  },
  Português: { file: "02l-conhecimentos-gerais.md", slugInHeading: "portugues" },
  "Raciocínio Lógico": { file: "02l-conhecimentos-gerais.md", slugInHeading: "raciocinio-logico" },
  "Saúde Coletiva": {
    file: "02c-saude-coletiva-imunizacao-doencas-transmissiveis.md",
    slugInHeading: "saude-coletiva",
  },
  "Saúde da Criança e do Adolescente": {
    file: "02d-saude-mulher-crianca-adolescente.md",
    slugInHeading: "saude-da-crianca-e-do-adolescente",
  },
  "Saúde da Mulher": {
    file: "02d-saude-mulher-crianca-adolescente.md",
    slugInHeading: "saude-da-mulher",
  },
  "Saúde do Idoso": {
    file: "02e-saude-adulto-idoso-medico-cirurgica.md",
    slugInHeading: "saude-do-idoso",
  },
  "Saúde Mental": { file: "02f-saude-mental.md" },
  "Segurança do Paciente": {
    file: "02a-fundamentos-biosseguranca-seguranca-paciente.md",
    slugInHeading: "seguranca-do-paciente",
  },
  "Sistematização da Assistência de Enfermagem (SAE)": {
    file: "02k-sae-cuidado-clinico-transversal.md",
  },
  "Terapia Intensiva (UTI)": {
    file: "02g-urgencia-emergencia-uti.md",
    slugInHeading: "terapia-intensiva-uti",
  },
  "Urgência e Emergência": {
    file: "02g-urgencia-emergencia-uti.md",
    slugInHeading: "urgencia-e-emergencia",
  },
};

function loadDisciplineDossieNotes(disciplineName: string): {
  dictionaryNotes?: string;
  ambiguousCasesNotes?: string;
} {
  const entry = DISCIPLINE_DOSSIE_MAP[disciplineName];
  if (!entry) return {};

  const path = resolve(projectRoot(), "docs/editorial", entry.file);
  if (!existsSync(path)) return {};
  const fullText = readFileSync(path, "utf8");

  const block = entry.slugInHeading
    ? extractDisciplineBlock(fullText, entry.slugInHeading)
    : fullText;
  if (!block) return {};

  const synonyms = extractSubsectionBySubstring(block, "Sinônimos usados pelas bancas");
  const keywords = extractSubsectionBySubstring(block, "Palavras-chave centrais");
  const acronyms = extractSubsectionBySubstring(block, "Siglas");
  const legalRefs = extractSubsectionBySubstring(block, "Leis, protocolos, portarias, programas");
  const ambiguousCases = extractSubsectionBySubstring(block, "Casos ambíguos");

  return {
    dictionaryNotes: joinExcerpts([synonyms, keywords, acronyms, legalRefs]) || undefined,
    ambiguousCasesNotes: ambiguousCases || undefined,
  };
}

export class DefaultDisciplineLoader implements DisciplineLoader {
  async load(input: DisciplineLoaderInput): Promise<DisciplineLoaderResult> {
    const hasTopic = Boolean(input.conceptTopicId);
    const hasSubtopic = Boolean(input.conceptSubtopicId);
    if (hasTopic === hasSubtopic) {
      throw new Error(
        "Informe exatamente um entre conceptTopicId e conceptSubtopicId (mesma regra de editorial_ai_inputs).",
      );
    }

    const [concept, disciplineName] = await Promise.all([
      this.resolveConcept(input),
      this.resolveDisciplineName(input),
    ]);
    const classificationNotes = await this.resolveClassificationNotes(input);
    const { dictionaryNotes, ambiguousCasesNotes } = disciplineName
      ? loadDisciplineDossieNotes(disciplineName)
      : {};

    return { concept, classificationNotes, dictionaryNotes, ambiguousCasesNotes };
  }

  private async resolveConcept(input: DisciplineLoaderInput) {
    if (input.conceptSubtopicId) {
      const { data, error } = await supabaseAdmin
        .from("editorial_subtopics")
        .select("name, description")
        .eq("id", input.conceptSubtopicId)
        .single();
      if (error || !data) {
        throw new Error(`Subassunto não encontrado: ${error?.message ?? input.conceptSubtopicId}`);
      }
      return { name: data.name, canonicalDefinition: data.description ?? "" };
    }

    const { data, error } = await supabaseAdmin
      .from("editorial_topics")
      .select("name, description")
      .eq("id", input.conceptTopicId as string)
      .single();
    if (error || !data) {
      throw new Error(`Assunto não encontrado: ${error?.message ?? input.conceptTopicId}`);
    }
    return { name: data.name, canonicalDefinition: data.description ?? "" };
  }

  /** Sobe conceptSubtopicId/conceptTopicId até editorial_disciplines.name — usado só para achar o Dossiê narrativo (I-11/I-12), não afeta classificação. */
  private async resolveDisciplineName(input: DisciplineLoaderInput): Promise<string | undefined> {
    let topicId = input.conceptTopicId;
    if (!topicId && input.conceptSubtopicId) {
      const { data } = await supabaseAdmin
        .from("editorial_subtopics")
        .select("topic_id")
        .eq("id", input.conceptSubtopicId)
        .single();
      topicId = data?.topic_id ?? undefined;
    }
    if (!topicId) return undefined;

    const { data: topic } = await supabaseAdmin
      .from("editorial_topics")
      .select("discipline_id")
      .eq("id", topicId)
      .single();
    if (!topic?.discipline_id) return undefined;

    const { data: discipline } = await supabaseAdmin
      .from("editorial_disciplines")
      .select("name")
      .eq("id", topic.discipline_id)
      .single();
    return discipline?.name ?? undefined;
  }

  private async resolveClassificationNotes(
    input: DisciplineLoaderInput,
  ): Promise<string | undefined> {
    const notes: string[] = [];

    let rulesQuery = supabaseAdmin
      .from("editorial_rules")
      .select("trigger_terms, confidence_percent");
    rulesQuery = input.conceptSubtopicId
      ? rulesQuery.eq("subtopic_id", input.conceptSubtopicId)
      : rulesQuery.eq("topic_id", input.conceptTopicId as string);
    const { data: rules } = await rulesQuery;
    for (const rule of rules ?? []) {
      notes.push(
        `Termos-gatilho (${rule.confidence_percent}% confiança): ${rule.trigger_terms.join(", ")}`,
      );
    }

    let keywordsQuery = supabaseAdmin
      .from("editorial_keywords")
      .select("term, weight, keyword_type");
    keywordsQuery = input.conceptSubtopicId
      ? keywordsQuery.eq("subtopic_id", input.conceptSubtopicId)
      : keywordsQuery.eq("topic_id", input.conceptTopicId as string);
    const { data: keywords } = await keywordsQuery;
    for (const keyword of keywords ?? []) {
      notes.push(`Palavra-chave ${keyword.keyword_type} (peso ${keyword.weight}): ${keyword.term}`);
    }

    const entityId = input.conceptSubtopicId ?? (input.conceptTopicId as string);
    const entityType = input.conceptSubtopicId ? "SUBTOPIC" : "TOPIC";
    const { data: evidence } = await supabaseAdmin
      .from("editorial_evidence")
      .select("description, evidence_type")
      .eq("entity_type", entityType)
      .eq("entity_id", entityId);
    for (const item of evidence ?? []) {
      if (item.description) notes.push(`Evidência (${item.evidence_type}): ${item.description}`);
    }

    return notes.length ? notes.join("\n") : undefined;
  }
}

export const disciplineLoader: DisciplineLoader = new DefaultDisciplineLoader();
