# Prefeitura de Caraguatatuba 2023 (FGV) — cargo Enfermeiro

- Nome do concurso: Concurso Público — Edital nº 03/2023
- Órgão: Prefeitura Municipal de Caraguatatuba (SP)
- Banca: FGV (Fundação Getulio Vargas) — `conhecimento.fgv.br`
- Cargo utilizado: **Enfermeiro** (CNS310E3, nível superior, Tipo 2 – Verde,
  prova aplicada em 28/01/2024).
- Status: **CONCLUÍDO**
  ☑ Edital
  ☑ Prova
  ☑ Gabarito definitivo
  ☑ Formato validado — **A–E (5 alternativas)**
  ☑ CSV
  ☑ questions.json
  ☑ Seed
  ☑ Validado (DB)

Questões importadas: **55 de 60** (ver "Questões excluídas" abaixo).

## Pré-checagem

1. Cargo Enfermeiro? **SIM** — caderno "CNS310E3 - Enfermeiro – Manhã Tipo 2 –
   Verde", Conhecimentos Gerais + Conhecimentos Específicos, 60 questões.
2. Edital público? **SIM** — obtido diretamente do site oficial da FGV
   (`edital-3-pref-caraguatatuba-demais-cargos-retificado-27.11.pdf`).
3. Prova pública? **SIM** — `cns310e3-enfermeirocns310e3-tipo-2.pdf`, obtida
   diretamente do site oficial, sem bloqueio.
4. Gabarito definitivo público? **SIM** —
   `caraguatatuba2024e0302_gabarito_definitivo_20240226.pdf` ("Gabarito Definitivo
   da Prova Aplicada no dia 28/01/2024"), documento multi-cargo; localizada a
   tabela "Enfermeiro - TIPO 2" (correspondente ao Tipo 2 da prova baixada).
5. Formato da prova: **A–E (5 alternativas)** — confirmado na capa do caderno:
   "As questões objetivas têm 5 (cinco) opções de resposta (A, B, C, D e E)".

## Estrutura da prova

60 questões: Língua Portuguesa (Q1-10), Raciocínio Lógico Matemático (Q11-18),
Noções de Informática (Q19-26), Aspectos Locais de Caraguatatuba (Q27-30) e
Conhecimentos Específicos de Enfermagem (Q31-60).

## Questões anuladas (gabarito oficial, Enfermeiro - TIPO 2)

2 questões anuladas (marcadas com `*`): **Q28** e **Q36**.

## Questões excluídas por ausência de aderência ao domínio Enfermagem

As questões **Q27 a Q30** ("Aspectos Locais de Caraguatatuba": brasão de armas do
município, tombamento ambiental da Serra do Mar, ranking de competitividade
municipal e audiência pública sobre licenciamento ambiental) tratam de cultura
geral local/geografia/atualidades municipais, sem qualquer relação com o domínio
de Enfermagem. Conforme regra explícita desta sprint ("questões sem aderência ao
domínio Enfermagem... podem ser excluídas, desde que documentadas no README") e o
princípio de não criar novas disciplinas, essas 4 questões foram **excluídas**
desta importação (Q28 já estava anulada; Q27, Q29 e Q30 eram válidas mas sem
disciplina compatível na taxonomia).

## Contagem final

- Total de questões na prova: 60
- Anuladas (gabarito oficial): 2 (Q28, Q36)
- Excluídas por falta de aderência ao domínio Enfermagem: 3 adicionais (Q27, Q29,
  Q30 — Q28 já contabilizada como anulada)
- **Importadas: 55** (Q1–Q26, Q31–Q35, Q37–Q60)

## Taxonomia

Reuso quase integral da taxonomia existente (banca `fgv` já cadastrada). 3 assuntos
(tópicos) genuinamente inéditos foram criados, todos dentro de disciplinas já
existentes (nenhuma disciplina nova):

- `informatica` → `seguranca-da-informacao-e-backup`
- `informatica` → `hardware-e-unidades-de-armazenamento`
- `saude-da-crianca-e-do-adolescente` → `diabetes-na-infancia`

1 concurso novo: `concurso-publico-prefeitura-municipal-de-caraguatatuba-edital-3-2023`
(banca `fgv`, já existente na taxonomia).

## Validação

- `npm run convert:questions`: 55 questões convertidas, 0 erros.
- `npm run seed:taxonomy`: 3 assuntos criados, 1 concurso criado, 0 erros.
- `npm run seed:questions`: 55 questões criadas, 0 ignoradas, 0 erros.
- Verificação via DB (script descartável): exame
  "Concurso Publico Prefeitura Municipal de Caraguatatuba Edital 3/2023" com 55
  questões vinculadas, todas com 5 alternativas persistidas corretamente;
  `package_version_id` resolvido para o pacote `banco-de-questoes-enfermagem`
  versão `1.0` (status PUBLISHED); os 3 novos assuntos confirmados com 1 questão
  cada vinculada corretamente; total acumulado no banco = 732 questões.
