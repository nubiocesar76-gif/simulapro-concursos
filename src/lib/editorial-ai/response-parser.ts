/**
 * Contrato do parser da resposta editorial (IT-015).
 * Transforma o texto bruto devolvido pelo Provider em um tipo próprio do
 * domínio editorial — distinto de EditorialGenerationResult (IT-013), que
 * representa apenas o transporte entre camadas. Não chama IA, não conhece
 * Claude, não acessa banco, não publica conteúdo.
 */

/**
 * Metadados estruturais sobre a interpretação — derivados trivialmente do
 * texto recebido, sem interpretar seu conteúdo.
 */
export type EditorialParsedResponseMetadata = {
  characterCount: number;
  parsedAt: string;
};

export type EditorialParsedAlternative = {
  letter: "A" | "B" | "C" | "D" | "E";
  text: string;
};

/**
 * Elementos E-01…E-10 reconhecidos ESTRUTURALMENTE (IA-004: "reconhecimento,
 * não validação") a partir das seções rotuladas definidas em
 * `prompt-composer.server.ts::RESPONSE_SECTION_LABELS` (Etapa 5). Nenhum
 * campo aqui foi julgado quanto a corretude/qualidade — isso é
 * `editorial-validator` (Etapa 7).
 */
export type EditorialParsedElements = {
  statement?: string;
  context?: string;
  alternatives: EditorialParsedAlternative[];
  correctAnswer?: string;
  explanation?: string;
  conceptReference?: string;
  cognitiveObjective?: string;
  bibliographicReference?: string;
};

/**
 * Resposta editorial interpretada. `content` preserva o texto bruto
 * original (rastreabilidade — nunca descartado); `elements` é o
 * reconhecimento estrutural. `warnings` sinaliza seção obrigatória ausente
 * — nunca é preenchida por inferência/adivinhação.
 */
export type EditorialParsedResponse = {
  content: string;
  elements: EditorialParsedElements;
  metadata: EditorialParsedResponseMetadata;
  notes: string[];
  warnings: string[];
};

export interface EditorialResponseParser {
  parse(rawText: string): EditorialParsedResponse;
}
