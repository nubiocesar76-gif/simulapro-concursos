import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { BoardLoader, BoardLoaderInput, BoardLoaderResult } from "./board-loader";
import { extractSectionBySubstring, joinExcerpts } from "./dossie-text";

function projectRoot() {
  return resolve(import.meta.dirname, "../../..");
}

type BoardProfile = {
  id: string;
  nome: string;
  caracteristicas: string[];
  estilo_de_cobranca: string;
  nivel_dificuldade: string;
};

/**
 * Único arquivo com perfil de banca resumido em JSON (I-04). Continua sendo
 * lido — é o resumo estruturado e rápido de ler — mas deixou de ser a única
 * fonte de estilo: ver `loadFullDossieExcerpts` abaixo para o Dossiê
 * narrativo completo (I-05), que a IA-001 exige como insumo separado.
 */
function loadBoardProfile(boardName: string): BoardProfile | null {
  const path = resolve(projectRoot(), "docs/editorial/normalized/14-perfil-bancas.json");
  if (!existsSync(path)) return null;
  const profiles = JSON.parse(readFileSync(path, "utf8")) as BoardProfile[];
  const normalized = boardName.trim().toLowerCase();
  return profiles.find((p) => p.nome.trim().toLowerCase() === normalized) ?? null;
}

function formatBoardProfileNotes(profile: BoardProfile | null): string {
  if (!profile) {
    return "Sem perfil editorial resumido registrado para esta banca.";
  }
  return [
    profile.caracteristicas.join("; "),
    `Estilo de cobrança: ${profile.estilo_de_cobranca}`,
    `Nível de dificuldade: ${profile.nivel_dificuldade}`,
  ].join(". ");
}

/**
 * Mapa banca → Dossiê narrativo completo (docs/metodologia/DOSSIE_<BANCA>_V1.md).
 * Só existem 2 hoje (IBFC, FGV — "V1.0, Congelado"); as demais 8 bancas do
 * acervo caem no fallback do perfil JSON resumido (`hasFullDossie: false`),
 * sinalizado explicitamente para quem monta o prompt (Etapa 5) não fingir
 * que tem o mesmo nível de profundidade para todas.
 */
const BOARD_DOSSIE_FILE: Record<string, string> = {
  ibfc: "DOSSIE_IBFC_V1.md",
  fgv: "DOSSIE_FGV_V1.md",
};

/**
 * Capítulos 2-7 do Dossiê — "como a banca cobra" (filosofia de avaliação,
 * estrutura dos enunciados, perfil dos distratores, uso de contexto,
 * objetivos cognitivos, estratégias de cobrança). Deliberadamente excluídos:
 * Capítulo 1 (identidade institucional, não afeta geração) e Capítulo 8
 * (Matriz de Validação de Fidelidade — é insumo do `editorial-validator`,
 * Etapa 7, não do prompt de geração).
 *
 * Extraído o capítulo inteiro (não só a síntese final de cada um) — os
 * dossiês não nomeiam a subseção de síntese de forma uniforme entre
 * capítulos/bancas, e o conteúdo completo é mais fiel a "o estilo vem do
 * dossiê da banca" do que um resumo perdendo achados.
 */
const DOSSIE_CHAPTERS = [
  "CAPÍTULO 2",
  "CAPÍTULO 3",
  "CAPÍTULO 4",
  "CAPÍTULO 5",
  "CAPÍTULO 6",
  "CAPÍTULO 7",
];

function loadFullDossieExcerpts(boardName: string): string | undefined {
  const key = boardName.trim().toLowerCase();
  const fileName = BOARD_DOSSIE_FILE[key];
  if (!fileName) return undefined;

  const path = resolve(projectRoot(), "docs/metodologia", fileName);
  if (!existsSync(path)) return undefined;
  const fullText = readFileSync(path, "utf8");

  const chapters = DOSSIE_CHAPTERS.map((chapterMarker) =>
    extractSectionBySubstring(fullText, chapterMarker),
  );
  return joinExcerpts(chapters) || undefined;
}

export class DefaultBoardLoader implements BoardLoader {
  async load(input: BoardLoaderInput): Promise<BoardLoaderResult> {
    const { data, error } = await supabaseAdmin
      .from("boards")
      .select("name")
      .eq("id", input.boardId)
      .single();
    if (error || !data) {
      throw new Error(`Banca não encontrada: ${error?.message ?? input.boardId}`);
    }

    const profile = loadBoardProfile(data.name);
    const fullDossieExcerpts = loadFullDossieExcerpts(data.name);

    const styleNotes = fullDossieExcerpts
      ? `${formatBoardProfileNotes(profile)}\n\n${fullDossieExcerpts}`
      : formatBoardProfileNotes(profile);

    return {
      name: data.name,
      styleNotes,
      hasFullDossie: Boolean(fullDossieExcerpts),
    };
  }
}

export const boardLoader: BoardLoader = new DefaultBoardLoader();
