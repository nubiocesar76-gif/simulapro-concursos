# SES-MT 2024 (FGV) — cargo Enfermeiro

- Nome do concurso: Concurso Público — Edital nº 001
- Órgão: Secretaria de Estado de Saúde de Mato Grosso (SES-MT)
- Banca: FGV (Fundação Getulio Vargas) — `conhecimento.fgv.br`
- Cargo utilizado: **Enfermeiro** (CNS311, nível superior, Tipo 1 – Branca).
- Status: **CONCLUÍDO**
  ☑ Edital
  ☑ Prova
  ☑ Gabarito definitivo
  ☑ Formato validado — **A–D (4 alternativas)**, suportado pelo pipeline desde a
     adaptação estrutural da V1 (sprint anterior)
  ☑ CSV
  ☑ questions.json
  ☑ Seed
  ☑ Validado (DB + Admin Portal)

Questões importadas: **59 de 80** (ver "Questões excluídas" abaixo para o detalhamento
das exclusões).

## Pré-checagem

1. Cargo Enfermeiro? **SIM** — caderno "CNS311 - Enfermeiro – Tarde Tipo 1 – Branca",
   Conhecimentos Gerais + Conhecimentos Específicos, 80 questões.
2. Edital público? **SIM** — obtido diretamente do site oficial da FGV
   (`edital-de-abertura-concurso-publico-ses-mt-retificado-23.02.24.pdf`).
3. Prova pública? **SIM** — `cns311-enfermeiro-cns311-tipo-1.pdf`, obtido diretamente
   do site oficial, sem bloqueio.
4. Gabarito definitivo público? **SIM** — `gabarito-definitivo-ses-mt-v2.pdf`
   ("Gabaritos Definitivos das Provas Aplicadas em 14/04/2024"), obtido diretamente
   do site oficial. Documento multi-cargo (89 páginas); localizada a tabela
   "Enfermeiro - TIPO 1".
5. Formato da prova: **A–D (4 alternativas)** — confirmado na capa do caderno de
   questões. Suporte a esse formato já havia sido homologado e implementado no
   pipeline (`scripts/seed/questions/convert/columns.ts` e `validate.ts`) em sprint
   estrutural anterior, permitindo a continuidade desta prova sem alterar código.

## Estrutura da prova

A prova de 80 questões é composta por um bloco comum a **todos os cargos** do
concurso (Q1 a Q46: Língua Portuguesa, Raciocínio Lógico Matemático, História
Política e Econômica e Geografia de Mato Grosso, Noções de Administração Pública/
Ética/Filosofia/Atualidades, e Legislação do SUS + PNAB) e um bloco de Conhecimentos
Específicos de Enfermeiro (Q47 a Q80). A identidade do bloco comum entre todos os
cargos foi confirmada por comparação direta do gabarito de "Enfermeiro" com o de
"Administrador", "Advogado" e outros cargos do mesmo concurso (valores idênticos
nas 46 primeiras posições).

## Questões anuladas (gabarito oficial)

6 questões anuladas (marcadas com `*`): **Q30, Q31, Q40** (bloco comum) e **Q69,
Q72, Q76** (Conhecimentos Específicos de Enfermeiro).

## Questões excluídas por ausência de correspondência na taxonomia

As questões **Q21 a Q36** (18 questões, das quais 2 já anuladas: Q30, Q31 — 16
questões válidas) tratam de **História Política e Econômica e Geografia de Mato
Grosso** e **Noções de Administração Pública, Ética, Filosofia e Atualidades**
(estatuto do servidor público estadual, ética de Weber, cidadania, dilemas morais
etc.). Como a taxonomia deste banco de questões é inteiramente estruturada em torno
do curso "Enfermagem" (disciplinas exclusivamente clínicas/de saúde pública), não
há nenhuma disciplina existente compatível com esse conteúdo de cultura geral
estadual e administração pública genérica.

Seguindo o princípio de **não criar novas disciplinas** (regra vigente em todas as
sprints deste projeto) e de **não fabricar/forçar classificações incorretas**
(precedente estabelecido na sprint SESAU Recife 2019), essas 16 questões válidas
foram **excluídas** desta importação, e não da prova em si — o PDF completo
permanece salvo em `docs/work/ses-mt-2024/` para eventual tratamento futuro, caso
o produto decida criar uma disciplina de "Conhecimentos Gerais/Atualidades" no
banco.

Todas as demais questões válidas (Português, Raciocínio Lógico, Legislação do SUS
+ PNAB, e Conhecimentos Específicos de Enfermeiro) foram normalmente importadas.

## Contagem final

- Total de questões na prova: 80
- Anuladas (gabarito oficial): 6 (Q30, Q31, Q40, Q69, Q72, Q76)
- Excluídas por falta de disciplina compatível na taxonomia: 16 (Q21–Q36, já
  descontadas as 2 anuladas desse intervalo)
- **Importadas: 59** (Q1–Q19, Q37–Q39, Q41–Q46, Q47–Q68, Q70–Q71, Q73–Q75, Q77–Q80)

## Taxonomia

Reuso quase integral da taxonomia existente (banca `fgv` já cadastrada). 3 assuntos
(tópicos) genuinamente inéditos foram criados, todos dentro de disciplinas já
existentes (nenhuma disciplina nova):

- `saude-coletiva` → `suplementacao-de-ferro-e-anemia-ferropriva`
- `saude-da-crianca-e-do-adolescente` → `ictericia-neonatal`
- `saude-da-mulher` → `climaterio-e-terapia-hormonal`

1 concurso novo: `concurso-publico-secretaria-de-estado-de-saude-de-mato-grosso-edital-1-2024`
(banca `fgv`, já existente na taxonomia).

## Validação

- `npm run convert:questions`: 59 questões convertidas, 0 erros. Confirmado que
  todas as 59 questões possuem exatamente 4 alternativas no `questions.json`
  gerado.
- `npm run seed:taxonomy`: 3 assuntos criados, 1 concurso criado, 0 erros.
- `npm run seed:questions`: 59 questões criadas, 0 ignoradas, 0 erros.
- Verificação via DB (script descartável): exame
  "Concurso Publico Secretaria de Estado de Saude de Mato Grosso Edital 1/2024" com
  59 questões vinculadas, todas com 4 alternativas persistidas corretamente;
  `package_version_id` resolvido para o pacote `banco-de-questoes-enfermagem`
  versão `1.0` (status PUBLISHED); os 3 novos assuntos confirmados com 1 questão
  cada vinculada corretamente; total acumulado no banco = 677 questões.
