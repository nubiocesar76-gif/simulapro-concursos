/**
 * Contrato do Board Loader — Motor Editorial V1, Etapa 2.
 *
 * Resolve a "Banca de referência" (I-04) e o "Dossiê da banca" (I-05) de
 * docs/editorial/engine-v2/08-IA-001-blueprint-editorial.md — os dois são
 * insumos obrigatórios SEPARADOS na especificação; este módulo entrega os
 * dois. A banca já vem escolhida (pelo content-selector); este módulo só
 * carrega o "como ela cobra", nunca decide qual banca usar.
 */

export type BoardLoaderInput = {
  boardId: string;
};

export type BoardLoaderResult = {
  name: string;
  /** Combinação do perfil resumido (JSON) + excertos do Dossiê narrativo (Cap. 2-7), quando existir. */
  styleNotes: string;
  /** false quando só existe o perfil JSON resumido — sem Dossiê narrativo completo para esta banca. */
  hasFullDossie: boolean;
};

export interface BoardLoader {
  load(input: BoardLoaderInput): Promise<BoardLoaderResult>;
}
