- Nome do concurso: Concurso Público SESPA-PA Edital 01/2023
- Órgão: Secretaria de Estado de Saúde Pública do Pará (SESPA) / SEPLAD
- Banca: Instituto Consulplan
- Cargo: Enfermeiro (Tipo 1 — Branca)
- Status: **CONCLUÍDA** — 47 questões válidas homologadas
  ☑ Edital
  ☑ Prova
  ☑ Gabarito (pós-recursos/definitivo)
  ☑ CSV
  ☑ questions.json
  ☑ Seed
  ☑ Validado

## Achado desta sessão (2026-07-24) — produção já estava concluída, sem documentação

Ao chegar a esta prova como próximo item válido da fila (depois de INTO 2025 ser
marcada INVÁLIDA — ver `docs/work/into-2025/README.md`), encontrei um CSV de 46
questões já transcrito nesta pasta (auditado em `docs/BUGS.md`, BUG-004) e nenhum
`status.json`/README, o que sugeria "pronto, aguardando seed". Ao rodar o pipeline
normal (`convert:questions` + `seed:questions`), descobri que **já existiam 47
questões da SESPA-PA 2023 no banco de produção**, seedadas em 2026-07-10 por uma
sessão anterior que nunca deixou rastro em git, `docs/work/` ou `docs/imports/`.

Investigação item a item contra o `prova.txt` oficial (casando pelas alternativas
de cada questão contra o texto de cada um dos 50 itens do gabarito, não pela
metadata solta de número de item — que se mostrou não confiável entre lotes
diferentes) confirmou que **as 47 questões pré-existentes já cobrem, de forma
completa e correta, todos os 47 itens válidos da prova** (50 itens − 3 anuladas:
22, 23, 24). Não havia corrupção de encoding real no banco — a aparência de
corrupção vista em investigações anteriores desta sessão foi um artefato de
codepage do console Windows nos meus próprios scripts Python de diagnóstico
(confirmado consultando o banco diretamente via Node/Supabase, que mostrou texto
corretamente acentuado).

As 37 questões que o `seed:questions` desta sessão criou de novo (do CSV de
BUG-004) eram, portanto, duplicatas parafraseadas dos mesmos 37 itens já
presentes — removidas do banco após confirmação item a item (ver
`status.json`, estágio `RECONCILED`). O acervo voltou ao valor original de 1266
(que já contava as 47 questões da SESPA).

`questions.csv` nesta pasta foi **substituído** pela exportação autoritativa das
47 questões reais do banco (via script descartável, não commitado). O CSV
original de 46 itens do BUG-004 permanece apenas como registro histórico em
`docs/BUGS.md` — não é mais a fonte de verdade desta prova.

## Pendência aberta

Reconverter `docs/work/sespa-pa-2023/questions.csv` via `convert:questions` +
`seed:questions` volta a criar 47 duplicatas: o hash de conteúdo calculado a
partir do CSV reconvertido não bate com o hash das linhas já existentes no
banco (causa raiz não identificada nesta sessão — suspeita de diferença de
normalização de aspas/espaços no round-trip CSV). **Não rodar `convert:questions`
de novo sobre este CSV específico sem investigar essa divergência primeiro.**
`docs/seeds/questions.json` foi gerado via `export:questions` (fonte: banco),
não via `convert:questions`, e deve permanecer assim.

## Achado adicional — pasta duplicada encontrada

Durante a reconciliação catálogo × banco (instrução seguinte desta sessão),
encontrei `docs/work/sespa-2023/` — uma pasta **duplicada** para esta mesma
prova, com PDFs originais (edital, prova, gabarito, mirror qconcursos) e um
README já correto (47/50, fontes oficiais, status CONCLUÍDA). Ou seja, a
documentação original desta prova **já existia** desde o início, só sob um
nome de pasta diferente (`sespa-2023` em vez de `sespa-pa-2023`) — a causa raiz
do retrabalho acima foi duas pastas para a mesma prova, não ausência total de
documentação. Consolidado: esta pasta (`sespa-pa-2023/`) é a canônica daqui
para frente; `sespa-2023/` ficou com uma nota apontando para cá.

## Achado colateral — taxonomia desatualizada

Os assuntos `saude-do-adulto` e `imunizacao` já existiam em `taxonomy.json`
(status `INACTIVE`, 0 tópicos), mas já eram usados pelas 47 questões reais no
banco — confirmando que a sessão de 07-10 também criou taxonomia diretamente no
banco sem atualizar o arquivo fonte. Adicionados os 4 tópicos faltantes e os 2
assuntos promovidos para `ACTIVE` (ver `status.json`, estágio
`TAXONOMY_EXTENDED`).
