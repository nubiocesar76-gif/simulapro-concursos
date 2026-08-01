# Regras Promovidas — Motor de Aprendizado

Log histórico append-only das regras de calibração já ativas no Motor
Editorial. Cada entrada mantém vínculo com sua origem (achado + relatórios/
auditorias, quando existirem) e um campo `Status`, para que auditorias
futuras possam reavaliar ou revogar uma regra que perder eficácia — sem
apagar o histórico (ajuste 3 do plano da Sprint 6.1, aprovado pelo usuário).

Nenhuma entrada aqui foi promovida automaticamente — toda promoção é decisão
humana explícita (IA-009 §3/§5), registrada com data e aprovador.

**Identificador permanente (ajuste 1 da Sprint 6.2):** cada regra tem um ID
fixo (`RULE-NNN`), atribuído na promoção e nunca reaproveitado nem alterado
— independe do texto da regra ou das tags associadas, que podem mudar entre
versões. Toda referência futura (histórico, reavaliação, relatório de
eficácia) usa o ID, nunca o texto.

**Formato de cada entrada** (parseado por
`src/lib/editorial-ai/learning/rule-registry.server.ts`): `**Status:**`,
`**Tags associadas:**`, `**Data de promoção:**` são campos de linha única,
obrigatórios e lidos por regex — não reformatar livremente. `### Versões do
texto` e `### Histórico de reavaliação` são seções de texto livre abaixo,
não parseadas por código nesta sprint (só leitura humana).

---

## RULE-001 — Referências bibliográficas: priorizar fonte primária

**Status:** ATIVA
**Tags associadas:** (nenhuma — origem anterior ao Auditor Editorial formal, ver nota abaixo)
**Data de promoção:** 2026-07-27

**Local no código:** `src/lib/editorial-ai/context-resolver.server.ts`,
constante `EDITORIAL_CALIBRATION_RESTRICTIONS` (item 1).

**Aprovado por:** usuário (aprovação do plano da Sprint 4.3).

**Origem/achado:** revisão editorial humana da Sprint 4.2 encontrou 2 casos
(questão sobre Sinais Vitais e questão sobre Prevenção de Lesão por Pressão)
em que o Motor Editorial anexou uma norma real, mas tematicamente periférica
ao Conceito cobrado (Portaria MS/GM nº 529/2013 para sinais vitais; Código
de Ética COFEN para prevenção de LPP) — não é cópia, não é erro técnico, mas
enfraquece a precisão da referência.

**Nota sobre a ausência de tag:** esta regra foi promovida antes de o
Auditor Editorial (Fase 5) existir como ferramenta formal — o achado vem do
histórico de chat da Sprint 4.2, nunca foi marcado com a tag
`#referencia-forcada` (sugerida na convenção de relatório) num relatório
real. Consequência prática: o relatório de eficácia (Sprint 6.2) não tem
como medir esta regra ainda — nenhuma ocorrência rastreada, nem antes nem
depois. Fica marcada explicitamente como `SEM_OPORTUNIDADE_DE_TESTE` até que
`#referencia-forcada` apareça em algum relatório real.

### Versões do texto
- v1 (ativa desde 2026-07-27): "Priorize sempre a referência primária mais
  específica ao Conceito. Nunca anexe uma norma apenas por estar
  tematicamente relacionada — cada referência citada deve ser a fonte real
  e central do conteúdo testado, não uma citação de reforço. Quando existir
  um protocolo oficial específico para o Conceito (ex.: um PCDT, uma
  Portaria dedicada, uma Resolução de conselho de classe), ele deve ser
  preferido a referências genéricas de literatura."

### Histórico de reavaliação
(nenhuma reavaliação ainda)

---

## RULE-002 — Normas: não citar número de artigo/subitem sem alta confiança

**Status:** ATIVA
**Tags associadas:** (nenhuma — mesma nota da RULE-001, achado pré-Auditor formal)
**Data de promoção:** 2026-07-27

**Local no código:** `src/lib/editorial-ai/context-resolver.server.ts`,
constante `EDITORIAL_CALIBRATION_RESTRICTIONS` (item 2).

**Aprovado por:** usuário (aprovação do plano da Sprint 4.3).

**Origem/achado:** Sprint 4.2, questão sobre EPI/NR-32 — o Motor Editorial
citou com confiança números de subitem específicos (32.2.4.4, 32.2.4.16) que
não foi possível verificar contra o texto oficial da norma sem acesso à
fonte primária. A regra em si (conteúdo normativo) estava correta; o risco
era a precisão inventada da citação.

**Nota sobre a ausência de tag:** mesma situação da RULE-001 — a tag
sugerida (`#subitem-nao-verificado`) nunca apareceu num relatório real
ainda. `SEM_OPORTUNIDADE_DE_TESTE` até haver ocorrência rastreada.

### Versões do texto
- v1 (ativa desde 2026-07-27): "Não cite número de artigo, inciso, alínea
  ou subitem de uma norma a menos que haja alta confiança na exatidão desse
  número. Em caso de dúvida sobre a numeração exata, cite apenas a norma
  oficial pelo nome/número principal (ex.: \"NR-32\", sem apontar o subitem
  específico)."

### Histórico de reavaliação
(nenhuma reavaliação ainda)

---

## RULE-003 — DNA das bancas: reforçar diferença real IBFC × FGV

**Status:** ATIVA
**Tags associadas:** (nenhuma — achado de estilo, não de tag de auditoria)
**Data de promoção:** 2026-07-27

**Local no código:** `src/lib/editorial-ai/prompt-composer.server.ts`,
função `buildBoardCalibrationNote`.

**Aprovado por:** usuário (aprovação do plano da Sprint 4.3).

**Origem/achado:** Sprint 4.2, questão IBFC/Difícil sobre HIV/Aids-PEP usou
uma vinheta clínica extensa (padrão mais típico de FGV) — o Dossiê IBFC
(Cap.5, achado empírico de 32 provas reais) documenta que esse tipo de
contexto funcional é raro (~5,7%) mesmo em questões difíceis da banca; o
escalonamento real observado é via julgamento composto. Hipótese testada e
confirmada na Sprint 4.3: regenerar a mesma questão (mesmo Conceito, mesma
banca, mesma dificuldade) com a regra ativa produziu uma versão sem vinheta
clínica, escalando a dificuldade por densidade normativa — mudança de
comportamento verificada diretamente no texto gerado, não presumida.

**Nota sobre a ausência de tag:** este é um achado de estilo (aderência ao
Dossiê), não corresponde a nenhuma tag de padrão de problema do vocabulário
usado nos relatórios do Auditor. Não é mensurável pelo mecanismo de
eficácia desta sprint (que opera sobre tags) — candidato a um mecanismo de
medição próprio numa sprint futura (ex.: critério `ADERENCIA_ESTILO_BANCA`
do próprio Validator, hoje sempre `[PENDENTE]` para leitura humana).

### Versões do texto
- v1 (ativa desde 2026-07-27), texto para IBFC: "Calibração (Sprint 4.3): o
  Dossiê IBFC (Cap.5) documenta que contexto clínico funcional é raro mesmo
  em nível Difícil (~5,7% da amostra) — o escalonamento real de dificuldade
  desta banca é por julgamento composto (V/F, I/II/III, \"apenas\") e por
  densidade normativa, não por vinheta clínica longa. Evite abrir a questão
  com um cenário de paciente extenso; prefira comando direto ou julgamento
  composto de afirmativas para elevar a dificuldade."
- v1 (ativa desde 2026-07-27), texto para FGV: "Calibração (Sprint 4.3): o
  Dossiê FGV documenta estudo de caso aplicado e personagem nomeado como
  mecanismo central de identidade da banca (Cap.2, Cap.7). Ao elevar a
  dificuldade, prefira consolidar múltiplas variáveis clínicas/
  administrativas em um caso concreto, não apenas comando direto —
  reforçando a diferença real de estilo frente ao IBFC."

### Histórico de reavaliação
(nenhuma reavaliação ainda)

---

## RULE-004 — Diversidade temática: evitar o ângulo mais óbvio quando houver alternativa

**Status:** ATIVA
**Tags associadas:** #concentracao-tematica
**Data de promoção:** 2026-07-27

**Local no código:** `src/lib/editorial-ai/context-resolver.server.ts`,
constante `EDITORIAL_CALIBRATION_RESTRICTIONS` (item 3).

**Aprovado por:** usuário (aprovação do plano da Sprint 4.3).

**Origem/achado:** Sprint 4.2, questão FGV/Fácil sobre a etapa "Sign In" do
Protocolo de Cirurgia Segura — o acervo publicado já tinha 2 questões reais
sobre o mesmo sub-tema específico (checklist de Sign In). Não configurou
cópia (ângulos de cobrança diferentes), mas revelou risco de concentração
temática dentro de um mesmo microtema.

**Nota sobre a única regra com tag real rastreada:** `#concentracao-tematica`
aparece 1 vez no relatório de auditoria real existente hoje
(`docs/editorial-ai/audit-reports/a8ff7611...md`, questão FGV/Fácil sobre
"Sign In"). **Limitação conhecida para medir eficácia (Sprint 6.2):** o
ciclo dessa ocorrência foi gerado na Sprint 4.3, no mesmo dia em que esta
regra foi promovida — sem separação de horário registrada com precisão
suficiente para classificar essa ocorrência específica como "antes" ou
"depois" da promoção com confiança. Tratada como dado insuficiente para
classificação nesta primeira rodada do relatório de eficácia; primeira
medição confiável só será possível com ciclos gerados em uma sessão
posterior a esta.

### Versões do texto
- v1 (ativa desde 2026-07-27): "Ao decidir o ângulo de cobrança dentro do
  microtema (qual estratégia, qual dado específico testar), evite o ângulo
  mais óbvio/genérico quando o Conceito comportar múltiplos ângulos
  válidos, reduzindo a chance de sobreposição com questões já publicadas
  sobre o mesmo microtema. Isso não impede gerar um ângulo semelhante
  quando for o único ângulo válido para o Conceito."

### Histórico de reavaliação
(nenhuma reavaliação ainda)
