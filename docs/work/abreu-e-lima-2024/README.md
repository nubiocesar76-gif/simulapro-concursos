# Prefeitura de Abreu e Lima 2024 (FGV) — cargo Enfermeiro

- Nome do concurso: Concurso Público — Edital 02/2024
- Órgão: Prefeitura Municipal de Abreu e Lima (PE) / Secretaria de Saúde
- Banca: FGV (Fundação Getulio Vargas) — `conhecimento.fgv.br`
- Cargo utilizado: **Enfermeiro** (nível superior, 40h semanais, apenas cadastro de
  reserva — 0 vagas de ampla concorrência/PCD).
- Status:
  ☑ Edital
  ☑ Prova
  ☑ Gabarito definitivo
  ☑ Formato validado (5 alternativas A–E)
  ☑ CSV
  ☑ questions.json
  ☑ Seed
  ☑ Validado (verificação via DB)

Questões importadas: **68 de 70** (todas as questões da prova, exceto as 2 anuladas).

## Pré-checagem

1. Cargo Enfermeiro? **SIM** — Edital 02/2024, Anexo, Quadro II, nível superior,
   Secretaria de Saúde.
2. Edital público? **SIM** — obtido diretamente do site oficial da FGV
   (`conhecimento.fgv.br`), sem qualquer bloqueio.
3. Prova pública? **SIM** — caderno completo "Enfermeiro – Tarde – Nível Superior
   Tipo 1 – Branca" obtido diretamente do site oficial.
4. Gabarito definitivo público? **SIM** — "Gabarito Definitivo da Prova Aplicada no
   dia 01/09/2024", obtido diretamente do site oficial.
5. Formato da prova: **A–E (5 alternativas)** — confirmado pelo item 8.5 do edital
   ("70 questões de múltipla escolha... 5 alternativas cada e apenas uma resposta
   correta") e pela estrutura da prova e do gabarito.

Todas as respostas SIM → sprint prosseguiu normalmente conforme o fluxo homologado.

## Fontes

Diferente das duas sprints anteriores (FMS Niterói e SESAU Recife), o portal oficial
da banca (`conhecimento.fgv.br`) esteve **totalmente acessível**, sem bloqueio
anti-bot, captcha ou necessidade de Wayback Machine. Os três documentos (edital,
prova, gabarito) foram baixados diretamente via HTTP, com status 200:

- `edital.pdf` — versão final do edital (demais cargos).
- `prova.pdf` — caderno "Enfermeiro – Tarde – Nível Superior Tipo 1 – Branca" (70
  questões, 12 páginas).
- `gabarito.pdf` — gabarito definitivo pós-recurso (documento multi-cargo/multi-tipo;
  utilizada a tabela "Enfermeiro - TIPO 1", correspondente ao Tipo 1 da prova
  baixada).

## Questões anuladas

De acordo com o gabarito definitivo (tabela "Enfermeiro - TIPO 1"), 2 questões foram
anuladas (marcadas com `*`, com nota de rodapé "Questão anulada"):

- **Questão 20** (Raciocínio Lógico Matemático)
- **Questão 27** (Legislação da Saúde)

Ambas foram excluídas do CSV/banco, conforme a regra do fluxo homologado. As demais
68 questões (1–19, 21–26, 28–70) foram integralmente transcritas e conferidas com o
gabarito oficial.

## Taxonomia

Reuso quase integral da taxonomia existente (banca `fgv` já cadastrada, usada
anteriormente no concurso SEMSA Manaus 002/2021). 11 assuntos (tópicos) genuinamente
inéditos foram criados, todos dentro de disciplinas já existentes (nenhuma disciplina
nova):

- `portugues` → `morfologia-classes-de-palavras`
- `legislacao-do-sus` → `politica-nacional-de-promocao-da-saude-pnaps`
- `administracao-em-enfermagem` → `regime-de-hospital-dia`
- `sistematizacao-da-assistencia-de-enfermagem-sae` → `classificacao-de-intervencoes-de-enfermagem-nic`
- `saude-mental` → `rede-de-atencao-psicossocial-raps`
- `saude-do-adulto` → `rastreamento-de-doencas-cardiovasculares`
- `saude-do-adulto` → `doenca-renal-cronica-drc`
- `saude-do-adulto` → `metodos-dialiticos`
- `saude-da-crianca-e-do-adolescente` → `sindrome-congenita-do-zika-virus`
- `controle-de-infeccao-hospitalar` → `reprocessamento-de-produtos-para-saude`
- `fundamentos-de-enfermagem` → `metodos-diagnosticos-complementares`

1 concurso novo: `concurso-publico-prefeitura-municipal-de-abreu-e-lima-edital-2-2024`
(banca `fgv`, já existente na taxonomia).

## Validação

- `npm run convert:questions`: 68 questões convertidas, 0 erros.
- `npm run seed:taxonomy`: 11 assuntos criados, 1 concurso criado, 0 erros.
- `npm run seed:questions`: 68 questões criadas, 0 ignoradas, 0 erros.
- Verificação via DB (script descartável): exame
  "Concurso Publico Prefeitura Municipal de Abreu e Lima Edital 2/2024" com 68
  questões vinculadas; total acumulado no banco = 618 questões.
