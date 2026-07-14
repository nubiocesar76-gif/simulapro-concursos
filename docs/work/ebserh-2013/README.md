# EBSERH Nacional 2013 (IBFC) — cargo Enfermeiro

- Nome do concurso: Concurso Público — Edital nº 03 - EBSERH - Área Assistencial, de 25 de junho de
  2013
- Órgão: Empresa Brasileira de Serviços Hospitalares (EBSERH) — HUB (Hospital Universitário de
  Brasília)
- Banca: IBFC (Instituto Brasileiro de Formação e Capacitação) — `concursos.ibfc.org.br`
- Cargo utilizado: **Enfermeiro** (IBFC_105, nível superior, prova aplicada em 01/09/2013).
- Status: **CONCLUÍDO**
  ☑ Edital
  ☑ Prova
  ☑ Gabarito definitivo
  ☑ Formato validado — **A–D (4 alternativas)**
  ☑ CSV
  ☑ questions.json
  ☑ Seed
  ☑ Validado (DB)

Questões importadas: **50 de 50**.

## Pré-checagem

1. Cargo Enfermeiro? **SIM** — caderno "IBFC_105 - ENFERMEIRO", HUB - Hospital Universitário de
   Brasília, 50 questões (Língua Portuguesa, Raciocínio Lógico e Matemático, Legislação Aplicada à
   EBSERH, Legislação Aplicada ao SUS e Conhecimentos Específicos).
2. Edital público? **SIM** — Edital nº 03 - EBSERH - Área Assistencial, de 25 de junho de 2013,
   obtido diretamente do servidor oficial da IBFC
   (`www2.ibfc.org.br/concurso/ebserh-1312/docs/ebserh-03-2013-edital.pdf`), salvo em
   `docs/work/ebserh-2013/edital.pdf`.
3. Prova pública? **SIM**, com ressalva de fonte — o link do "Caderno de Provas" para o cargo
   Enfermeiro não está disponível na seção "Provas e Gabaritos" do portal oficial da IBFC (a seção
   "Cadernos de Provas" dessa página está estruturalmente vazia para este concurso, sem nenhum item
   listado). A prova foi obtida do mirror oficial do Qconcursos.com
   (`arquivos.qconcursos.com/prova/arquivo_prova/33097/ibfc-2013-ebserh-enfermeiro-hub-prova.pdf`),
   fonte de terceiros amplamente utilizada para arquivamento de provas de concursos públicos, sem
   qualquer bloqueio de acesso (sem CAPTCHA ou bot-detection), salva em
   `docs/work/ebserh-2013/prova.pdf`.
4. Gabarito definitivo público? **SIM** — obtido diretamente do portal oficial da IBFC
   (`www2.ibfc.org.br/arquivos/hub/GABARITO_IBFC_105.pdf`, seção "Gabaritos de Provas"), salvo em
   `docs/work/ebserh-2013/gabarito.pdf`. Confirmado como versão definitiva (não preliminar) pelas
   seguintes evidências: (a) a lista completa de "Gabaritos Após Recurso" (05/11/2013) do mesmo
   portal — que cataloga os cargos cujo gabarito foi alterado após o julgamento de recursos — **não**
   inclui o cargo genérico "Enfermeiro" (apenas variantes específicas como "Enfermeiro - Terapia
   Intensiva Neonatal"), indicando que não houve alteração de gabarito para este cargo em decorrência
   de recursos; (b) o "Comunicado – Retificação Gabarito e Classificação Parcial" (08/11/2013)
   publicado pela banca refere-se exclusivamente à retificação da questão 17 de "Legislação Aplicada
   à EBSERH" para os cargos de **Nível Médio/Técnico**, não afetando o cargo Enfermeiro (nível
   superior). O arquivo obtido no Qconcursos.com é byte-idêntico (mesmo hash MD5) ao arquivo oficial
   da IBFC, confirmando a integridade da fonte terceira. **Não foi usado** nenhum gabarito preliminar.
5. Formato da prova: **A–D (4 alternativas)** — confirmado nas alternativas de todas as questões da
   prova e no próprio gabarito (que só apresenta as letras A, B, C e D em todas as 50 questões).

## Estrutura da prova

50 questões: Língua Portuguesa (Q1-10), Raciocínio Lógico e Matemático (Q11-15), Legislação
Aplicada à EBSERH (Q16-20), Legislação Aplicada ao SUS (Q21-25) e Conhecimentos Específicos
(Q26-50).

## Questões anuladas

**0 questões anuladas.** O gabarito oficial (`GABARITO_IBFC_105.pdf`) apresenta uma resposta válida
(letra A, B, C ou D) para todas as 50 questões, sem marcações de anulação; a ausência do cargo na
lista de "Gabaritos Após Recurso" corrobora que nenhuma questão deste cargo foi anulada ou alterada
após o processo de recursos.

## Questões excluídas por ausência de aderência ao domínio Enfermagem

**Nenhuma.** Diferentemente de sprints anteriores, todo o conteúdo desta prova (Português, Raciocínio
Lógico, Legislação Aplicada à EBSERH — incluindo a Lei nº 8.666/93 de licitações, tratada no âmbito
institucional da EBSERH — Legislação do SUS e Conhecimentos Específicos de Enfermagem) encontrou
correspondência direta em disciplinas e assuntos já existentes na taxonomia, sem necessidade de
exclusão por falta de aderência.

## Contagem final

- Total de questões na prova: 50
- Anuladas: 0
- Excluídas por falta de aderência ao domínio Enfermagem: 0
- **Importadas: 50** (Q1–Q50)

## Taxonomia

Reuso integral da taxonomia existente (banca `ibfc` já cadastrada, incluindo o assunto
`legislacao-aplicada-a-ebserh` criado em sprint anterior). **Nenhum assunto novo foi criado** — todas
as 50 questões encontraram assunto adequado já existente, incluindo casos notáveis:

- Legislação Aplicada à EBSERH (Lei nº 12.550/2011, Decreto nº 7.661/2011, Regimento Interno) →
  assuntos `lei-12550-2011`, `estatuto-da-ebserh`, `regimento-interno-da-administracao-central`
- Lei nº 8.666/93 (licitações) → `legislacao-aplicada-a-ebserh` / `regulamento-de-licitacoes-e-contratos-da-ebserh`
- SINAN → `saude-coletiva` / `sistemas-de-informacao-em-saude-sinan-sim`

1 concurso novo: `concurso-publico-ebserh-nacional-edital-3-2013` (banca `ibfc`, já existente na
taxonomia).

## Validação

- `npm run seed:taxonomy`: 0 assuntos criados, 1 concurso criado, 0 erros.
- `npm run convert:questions`: 50 questões convertidas, 0 erros.
- `npm run seed:questions`: 50 questões criadas, 0 ignoradas, 0 erros.
- Verificação via DB (script descartável): exame "Concurso Publico EBSERH Nacional Edital 3/2013" com
  50 questões vinculadas, todas com 4 alternativas persistidas corretamente; `package_version_id`
  resolvido para o pacote `banco-de-questoes-enfermagem` versão `1.0` (status PUBLISHED); total
  acumulado no banco = 879 questões.
