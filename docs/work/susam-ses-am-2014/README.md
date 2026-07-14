# SUSAM/SES-AM 2014 (FGV) — cargo Enfermeiro

- Nome do concurso: Concurso Público — Edital nº 01/2014
- Órgão: Secretaria de Estado de Saúde do Amazonas (SUSAM)
- Banca: FGV (Fundação Getulio Vargas) — `conhecimento.fgv.br` (portal
  `fgvprojetos.fgv.br/concursos/susam`)
- Cargo utilizado: **Enfermeiro** (nível superior, Tipo 1 – Branca, prova
  aplicada em 24/08/2014).
- Status: **CONCLUÍDO**
  ☑ Edital
  ☑ Prova
  ☑ Gabarito definitivo
  ☑ Formato validado — **A–E (5 alternativas)**
  ☑ CSV
  ☑ questions.json
  ☑ Seed
  ☑ Validado (DB)

Questões importadas: **56 de 60** (ver "Questões anuladas" abaixo).

## Pré-checagem

1. Cargo Enfermeiro? **SIM** — caderno "Nível Superior – Profissionais de
   Saúde – Enfermeiro Tipo 1 – Cor Branca", 60 questões (Língua Portuguesa,
   Princípios e Organização do SUS, Conhecimentos Específicos).
2. Edital público? **SIM** — obtido diretamente do site oficial da FGV
   (`Edital_SUSAM_Nivel_Superior_2014_10_16.pdf`).
3. Prova pública? **SIM** — `477_prova_9.pdf` (Enfermeiro Tipo 1), obtida
   diretamente do portal oficial via a página de provas de nível superior do
   concurso, sem bloqueio.
4. Gabarito definitivo público? **SIM** —
   `susam_gabarito_definitivo_superior_2014-10-01.pdf` ("Gabaritos – Nível
   Superior – Provas do dia 24/08/2014"), documento multi-cargo (125 páginas);
   localizada a tabela "Enfermeiro – Tipo 1". **Não foi usado o gabarito
   preliminar** (`susam_gabarito_preliminar_superior_20140909.pdf`), apenas o
   definitivo.
5. Formato da prova: **A–E (5 alternativas)** — confirmado na capa do caderno:
   "esse caderno de prova contendo 60 (sessenta) questões objetivas, cada qual
   com cinco alternativas de respostas (A, B, C, D e E)".

## Estrutura da prova

60 questões: Língua Portuguesa (Q1-20), Princípios e Organização do SUS
(Q21-30) e Conhecimentos Específicos de Enfermagem (Q31-60). Diferentemente de
sprints anteriores (SES-MT, Caraguatatuba), esta prova não possui bloco de
cultura geral local/atualidades sem aderência ao domínio Enfermagem — todo o
conteúdo (Português, legislação do SUS e conhecimentos específicos) é
compatível com a taxonomia existente.

## Questões anuladas (gabarito oficial, Enfermeiro – Tipo 1)

4 questões anuladas (marcadas com `*`): **Q28, Q31, Q42 e Q46**.

## Contagem final

- Total de questões na prova: 60
- Anuladas (gabarito oficial): 4 (Q28, Q31, Q42, Q46)
- Excluídas por falta de aderência ao domínio Enfermagem: 0 (não houve bloco
  de cultura geral/atualidades nesta prova)
- **Importadas: 56** (Q1–Q27, Q29–Q30, Q32–Q41, Q43–Q45, Q47–Q60)

## Taxonomia

Reuso quase integral da taxonomia existente (banca `fgv` já cadastrada,
incluindo assuntos criados em sprints anteriores como
`saude-coletiva/suplementacao-de-ferro-e-anemia-ferropriva` e
`saude-da-mulher/climaterio-e-terapia-hormonal`, ambos reaproveitados aqui).
Apenas 1 assunto genuinamente inédito foi criado, dentro de disciplina já
existente (nenhuma disciplina nova):

- `urgencia-e-emergencia` → `samu-e-atendimento-pre-hospitalar`

1 concurso novo: `concurso-publico-secretaria-de-estado-de-saude-do-amazonas-edital-1-2014`
(banca `fgv`, já existente na taxonomia).

## Validação

- `npm run convert:questions`: 56 questões convertidas, 0 erros.
- `npm run seed:taxonomy`: 1 assunto criado, 1 concurso criado, 0 erros.
- `npm run seed:questions`: 56 questões criadas, 0 ignoradas, 0 erros.
- Verificação via DB (script descartável): exame
  "Concurso Publico Secretaria de Estado de Saude do Amazonas Edital 1/2014"
  com 56 questões vinculadas, todas com 5 alternativas persistidas
  corretamente; `package_version_id` resolvido para o pacote
  `banco-de-questoes-enfermagem` versão `1.0` (status PUBLISHED); o novo
  assunto confirmado com 1 questão vinculada; total acumulado no banco = 788
  questões.
