# question-pipeline (local, sem IA)

Ferramenta interna e local para transformar `prova.pdf` + `gabarito.pdf` em
`questions.raw.json` e, a partir daí, num `questions.csv` no mesmo formato
aceito por `convert:questions` — reduzindo a necessidade de transcrição
manual completa de provas. Não usa IA nem chamadas externas — toda a
extração é feita localmente com `pdfjs-dist`, já que os PDFs de origem têm
texto pesquisável (não escaneado).

Ferramenta isolada: não altera o Portal Admin, o Portal do Aluno, o banco de
dados nem o pipeline de seed existente (`scripts/seed/`). Todo o output
(incluindo o `questions.csv`) fica dentro de
`tools/question-pipeline/output/` — nada é gravado em
`docs/imports/questions.csv`, em `docs/seeds/questions.json`, nem executado
contra o banco (`seed:questions` nunca é chamado por esta ferramenta).

## Objetivo

Dado um par `prova.pdf` + `gabarito.pdf` de uma banca que usa layout de
texto pesquisável e alternativas A–D ou A–E, gerar automaticamente um
rascunho estruturado (`questions.raw.json`) com enunciado, alternativas e
gabarito por questão — servindo de ponto de partida para revisão humana, e
não como substituto dela.

## Estrutura de pastas

```
tools/question-pipeline/
├── README.md
├── input/
│   ├── prova.pdf       (não versionado como "fonte de verdade"; copiar aqui a prova a processar)
│   └── gabarito.pdf
├── output/
│   ├── prova.txt              (texto bruto extraído, com marcadores === PAGE N ===)
│   ├── gabarito.txt
│   ├── questions.raw.json     (saída principal do pipeline:extract)
│   ├── extraction-report.json (estatísticas da extração)
│   ├── classification.template.json  (saída do pipeline:template — classificação humana)
│   ├── questions.csv          (saída do pipeline:merge ou pipeline:export legado)
│   ├── export-report.json     (validações do pipeline:export legado)
│   ├── merge-report.json      (validações do pipeline:merge)
│   └── questions.converted.json (gerado apenas quando a checagem de compatibilidade passa; descartável)
└── src/
    ├── types.ts
    ├── extract-text.ts          (PDF → texto, via pdfjs-dist)
    ├── alternative-markers.ts   (detecta 1+ marcadores "letra)" numa mesma linha)
    ├── alternative-markers.test.ts
    ├── parse-prova.ts           (texto → blocos de questão)
    ├── parse-prova.test.ts
    ├── parse-gabarito.ts        (texto → mapa número→resposta, incl. anuladas)
    ├── build-questions.ts       (junta prova + gabarito, aplica status/relatório)
    ├── csv.ts                   (serialização CSV RFC4180 mínima, reutilizável)
    ├── export-csv.ts            (questions.raw.json → linhas do CSV do projeto — legado)
    ├── generate-template.ts     (questions.raw.json → classification.template.json)
    ├── validate-classification.ts (validações de numeração, alinhamento e campos)
    ├── merge-questions.ts       (raw + classificação → CSV)
    ├── merge-questions.test.ts
    ├── template.ts              (orquestrador do "pipeline:template")
    ├── merge.ts                 (orquestrador do "pipeline:merge")
    ├── run.ts                   (orquestrador do "pipeline:extract")
    ├── export.ts                (orquestrador legado do "pipeline:export")
    └── validate.ts              (orquestrador do "pipeline:validate")
```

## Comandos

```bash
npm run pipeline:extract   # lê tools/question-pipeline/input/{prova,gabarito}.pdf
                            # e escreve tudo em tools/question-pipeline/output/

npm run pipeline:validate  # relê output/questions.raw.json e confere a
                            # consistência básica do schema (não reprocessa os PDFs)

npm run pipeline:test      # roda a suíte de testes do parser (node:test, sem
                            # dependência nova) — não toca em input/ nem output/

npm run pipeline:export    # legado — lê output/questions.raw.json direto para questions.csv
                            # (sem camada de classificação; campos semânticos ficam vazios)

npm run pipeline:template  # lê output/questions.raw.json e gera
                            # output/classification.template.json (campos vazios, uma entrada por questão)

npm run pipeline:merge     # lê output/questions.raw.json +
                            # output/classification.template.json e gera output/questions.csv
                            # (valida alinhamento, campos obrigatórios e compat. com convert:questions)
```

## Formato de entrada

Colocar em `tools/question-pipeline/input/`:

- `prova.pdf` — caderno de questões, com texto pesquisável (não escaneado/imagem).
- `gabarito.pdf` — gabarito **definitivo** (não preliminar), no formato de
  tabela "linha de números da questão" seguida de "linha de letras de
  resposta" (padrão usado por FGV, IBFC, Fundatec e a maioria das bancas
  observadas neste projeto). Anuladas devem aparecer como `*` ou variação de
  "ANULADA" na linha de respostas.

## Formato de saída

`questions.raw.json` é um array de objetos:

```json
{
  "number": 1,
  "statement": "Texto do enunciado",
  "alternatives": { "A": "...", "B": "...", "C": "...", "D": "...", "E": "..." },
  "correctAnswer": "A",
  "status": "VALID",
  "page": 3,
  "warnings": []
}
```

- `status` é um de `"VALID"`, `"ANULADA"` ou `"REVIEW_REQUIRED"`.
- `alternatives` só contém as chaves realmente detectadas (4 chaves em
  provas A–D, 5 em provas A–E). Nunca é preenchido com texto inventado.
- `correctAnswer` é `null` quando a questão é anulada ou quando o gabarito
  não foi localizado para aquele número.
- `warnings` explica, em texto, por que uma questão ficou como
  `REVIEW_REQUIRED` (ex.: número incomum de alternativas, gabarito não
  localizado, letra do gabarito não bate com nenhuma alternativa detectada,
  numeração duplicada).

`extraction-report.json` resume a extração: total encontrado, válidas,
anuladas, revisão necessária, sem gabarito, sem alternativas completas,
números duplicados e quantas entradas de gabarito foram reconhecidas.

### `classification.template.json`

Gerado por `pipeline:template`. Uma entrada por questão do raw, com campos
semânticos vazios — prontos para preenchimento humano (ou IA futura):

```json
{
  "question": 1,
  "board": "",
  "contest": "",
  "position": "",
  "subject": "",
  "topic": "",
  "year": "",
  "difficulty": "",
  "keywords": [],
  "explanation": ""
}
```

- `question` corresponde a `number` em `questions.raw.json`.
- Nenhum campo semântico é preenchido automaticamente nesta versão.
- `difficulty` não tem coluna própria no CSV — é preservado em `keywords`
  como `difficulty:<valor>` durante o merge.
- Questões `ANULADA` recebem entrada no template, mas são excluídas do CSV
  no merge (mesma regra do projeto).

## `pipeline:merge` em detalhe

Lê `output/questions.raw.json` + `output/classification.template.json` e
escreve `output/questions.csv`.

Validações executadas (mensagens claras por tipo de erro):

1. **JSON inválido** — arquivo ilegível ou com schema incorreto.
2. **Questão duplicada / número repetido** — mesmo `question` ou `number` mais de uma vez.
3. **Número ausente** — lacuna na sequência numérica.
4. **Classificação ausente** — quantidade ou numeração divergente entre raw e template.
5. **Campo obrigatório vazio** — `board`, `contest`, `position`, `subject`, `topic`, `year`, `explanation` devem estar preenchidos (exceto questões `ANULADA`).
6. **Alternativas e gabaritos** — mesmas regras do `pipeline:export`.
7. **Colunas obrigatórias** — header do CSV contém todas as `REQUIRED_COLUMNS`.
8. **UTF-8** — ausência de caracteres de substituição.
9. **Compatibilidade com `convert:questions`** — checagem real via `convertQuestions()`.

Relatório gravado em `output/merge-report.json`.

## Fluxo completo

```
prova.pdf + gabarito.pdf
        │  npm run pipeline:extract          (EXTRAÇÃO — mecânica, sem IA)
        ▼
questions.raw.json
  enunciado, alternativas, gabarito, status, página
        │  npm run pipeline:template         (CLASSIFICAÇÃO — template vazio)
        ▼
classification.template.json
  board, contest, position, subject, topic, year, difficulty, keywords, explanation
  (preenchimento humano nesta versão; futura IA preenche só este arquivo)
        │  npm run pipeline:merge            (MERGE — raw + classificação → CSV)
        ▼
questions.csv
        │  npm run convert:questions         (pipeline oficial do SimulaPro, inalterado)
        ▼
docs/seeds/questions.json
        │  npm run seed:questions            (pipeline oficial do SimulaPro, inalterado)
        ▼
Banco de dados
```

### Função de cada etapa

| Etapa | Comando | Entrada | Saída | Responsabilidade |
|---|---|---|---|---|
| **PDF** | — | `prova.pdf`, `gabarito.pdf` | — | Fonte original |
| **RAW** | `pipeline:extract` | PDFs | `questions.raw.json` | Extração mecânica: enunciado, alternativas, gabarito, status |
| **CLASSIFICATION** | `pipeline:template` | `questions.raw.json` | `classification.template.json` | Template vazio para classificação semântica (humana ou IA futura) |
| **CSV** | `pipeline:merge` | raw + classificação | `questions.csv` | Merge validado — nenhum dado perdido |
| **convert** | `convert:questions` | `questions.csv` | `questions.json` | Validação e normalização oficial do SimulaPro |
| **seed** | `seed:questions` | `questions.json` | banco | Carga no banco de questões |

O comando legado `pipeline:export` continua disponível: pula a camada de classificação e gera
`questions.csv` direto do raw (campos semânticos em branco). O fluxo recomendado a partir da
v1.3 é **extract → template → merge**.

Esta ferramenta termina no `questions.csv`. Os dois últimos passos
(`convert:questions` e `seed:questions`) são o pipeline oficial já existente
do projeto e não foram alterados nem chamados automaticamente por esta
sprint — a integração é manual e deliberada.

## `pipeline:export` em detalhe (legado)

Lê `output/questions.raw.json` e escreve `output/questions.csv` com
exatamente as colunas usadas pelo projeto (`REQUIRED_COLUMNS` +
`OPTIONAL_COLUMNS` de `scripts/seed/questions/convert/columns.ts`, a mesma
fonte de verdade usada por `convert:questions` — não há uma cópia
duplicada da lista de colunas).

Regras de conversão:

- **Questões `ANULADA`** são **excluídas** do CSV — mesma regra já seguida
  em todas as provas produzidas manualmente neste projeto ("questões
  anuladas ficam fora do banco").
- **Questões `REVIEW_REQUIRED`** **nunca são descartadas**: entram no CSV
  com todos os campos que puderam ser extraídos (mesmo que incompletos),
  a coluna `keywords` recebe o marcador `pipeline:REVIEW_REQUIRED` e a
  coluna `status` é forçada para `INACTIVE` — assim, mesmo que alguém pule
  a revisão manual, `seed:questions` nunca ativaria uma questão
  incompleta.
- **Questões `VALID`** entram com `status = ACTIVE` e sem marcador em
  `keywords`.
- Campos que exigem **classificação humana** — `position`, `board`,
  `contest`, `subject`, `topic`, `year`, `explanation`, `organization`,
  `exam`, `references`, `package`, `package_version` — não existem em
  `questions.raw.json` (são intencionalmente fora do escopo desta
  ferramenta não-IA) e por isso saem **em branco** no CSV. Preenchê-los
  continua sendo trabalho humano, feito diretamente no CSV antes de rodar
  `convert:questions`.

Validações executadas a cada `pipeline:export` (e gravadas em
`output/export-report.json`):

1. **Número de questões** — total exportado bate com total do raw.json
   menos as anuladas descartadas.
2. **Alternativas** — toda questão `VALID` tem as alternativas A–D (e E,
   quando aplicável) presentes.
3. **Gabaritos** — toda questão `VALID` tem `correct_answer` preenchido e
   correspondente a uma das alternativas extraídas.
4. **Colunas obrigatórias** — o header do CSV contém, literalmente, todas
   as `REQUIRED_COLUMNS` importadas de `scripts/seed/questions/convert/columns.ts`.
5. **UTF-8** — o arquivo é relido após escrito e verificado quanto à
   ausência de caracteres de substituição (`�`), sinal de problema de
   encoding.
6. **Compatibilidade com `convert:questions`** — chama diretamente a
   função `convertQuestions()` real do projeto
   (`scripts/seed/questions/convert/convert.ts`, importada, não
   duplicada), apontando a saída para
   `tools/question-pipeline/output/questions.converted.json` — **nunca**
   para `docs/imports/questions.csv` nem `docs/seeds/questions.json`. O
   resultado (ok ou lista de erros por campo) é exatamente o que
   `npm run convert:questions` produziria com este CSV.

### Sobre "compatibilidade sem edição manual"

Rodando `pipeline:export` sobre a saída de um PDF puro, a checagem 6
**vai** reportar erros — um por linha para cada um dos 7 campos de
classificação vazios (`position`, `board`, `contest`, `subject`, `topic`,
`year`, `explanation`). Isso é o resultado esperado, não uma falha da
ferramenta: esses campos representam decisão de domínio (que disciplina,
que assunto, qual concurso/banca já cadastrados na taxonomia, qual o ano,
qual a explicação da resposta), e a regra "nunca fabricar dados" desta
sprint (e de todas as sprints deste projeto) proíbe adivinhá-los. A saída
"sem edição manual" só é alcançada depois que esses 7 campos são
preenchidos no `questions.csv` — nesse ponto, `pipeline:export`
re-executado (ou o próprio `npm run convert:questions`) reporta
compatibilidade total.

## Layouts suportados

O parser (`parse-prova.ts` + `alternative-markers.ts`) reconhece um
marcador de alternativa (`a)`, `(A)`, `C)` etc.) tanto no início de uma
linha quanto em qualquer ponto de uma linha, desde que precedido por
espaço — o que permite capturar **mais de uma alternativa na mesma linha
física**, e não só uma alternativa por linha:

- **Uma coluna** (layout clássico, uma alternativa por linha):
  ```
  a) texto da alternativa A
  b) texto da alternativa B
  c) texto da alternativa C
  d) texto da alternativa D
  ```
- **Duas colunas na mesma linha**, em qualquer uma destas variações:
  ```
  A) texto...        C) texto...
  B) texto...        D) texto...
  ```
  ```
  A) ......... C) .........
  B) ......... D) .........
  ```
  incluindo espaçamento irregular entre as colunas (uma ou várias
  colunas de espaço, tabulação convertida em espaço pelo extrator etc.).
- **Provas A–D e A–E** — o parser aceita de 4 a 5 alternativas; qualquer
  outra contagem é tratada como incomum.
- **Alternativas quebradas em múltiplas linhas** — uma linha sem nenhum
  marcador de alternativa é tratada como continuação do texto da
  alternativa (ou do enunciado) em andamento.
- **Linhas vazias** dentro do bloco da questão são ignoradas, nunca viram
  conteúdo espúrio.
- **Numeração de questão** — aceita tanto `N) enunciado...` (padrão IBFC
  observado no piloto) quanto `QUESTÃO N – enunciado...` (padrão FGV/outras
  bancas já usado neste projeto).

Quando os marcadores encontrados não formam uma sequência contígua a
partir de A (ex.: A, B, D e E presentes, mas C ausente — sinal de que uma
coluna não foi capturada), ou quando a contagem final não é 4 nem 5, a
questão fica `REVIEW_REQUIRED` com um aviso explicando o motivo — a
ferramenta nunca fabrica a alternativa que falta.

## Teste piloto — SESACRE 2022 (Edital nº 001/2022, cargo Enfermeiro)

Entrada: cópia de `docs/work/sesacre-2022/prova.pdf` e
`docs/work/sesacre-2022/gabarito.pdf` (arquivos originais não foram
alterados).

Resultado (após o suporte a duas colunas, sprint V1.1):

| Métrica | V1 | V1.1 |
|---|---|---|
| Páginas (prova / gabarito) | 18 / 1 | 18 / 1 |
| Questões detectadas | 80 | 80 |
| Válidas | 76 | **80** |
| Anuladas | 0 | 0 |
| Revisão necessária | 4 (Q41, Q42, Q43, Q50) | **0** |
| Sem gabarito associado | 0 | 0 |
| Sem alternativas completas | 4 | **0** |
| Números duplicados | nenhum | nenhum |

As 4 questões que ficavam `REVIEW_REQUIRED` na V1 (Q41, Q42, Q43, Q50) usam
o layout de **alternativas em duas colunas** na mesma linha (ex.:
`a) 500 a 1.500   c) 1.000` seguido de `b) 7.000   d) 2.000 a 3.500`); com o
suporte a múltiplos marcadores por linha (V1.1), as 4 são reconhecidas
corretamente, sem nenhuma regressão nas outras 76.

As 80 questões válidas foram conferidas contra a transcrição manual já
produzida nesta sessão para as questões 1–10 e 31–80 (as únicas com
gabarito de referência já conhecido): **100% de correspondência** nas
respostas corretas, incluindo as 4 que antes ficavam em revisão.

## Limitações atuais

- **Sem OCR**: PDFs escaneados (imagem) não são suportados; o texto precisa
  ser pesquisável no PDF de origem.
- **Sem suporte a Cebraspe (Certo/Errado)**: o parser assume alternativas
  rotuladas A–E.
- **Questões com imagem essencial** (gráficos, figuras, tabelas complexas
  necessárias para responder) não são tratadas de forma especial — o texto
  ao redor da imagem é capturado, mas nada é inferido sobre o conteúdo
  visual.
- **Layouts de alternativas com mais de duas colunas**, ou com colunas que
  não se alinham em pares de linhas (ex.: A/B/C na mesma linha e D isolado
  numa linha própria, em vez do padrão A/C + B/D observado no piloto), não
  foram testados — o detector de marcadores por linha deve funcionar da
  mesma forma, mas sem um caso real para validar contra ele nesta sprint.
- **Sem classificação automática de disciplina/assunto/concurso/ano/explicação**:
  `pipeline:template` gera campos vazios; o preenchimento é humano nesta versão.
  `pipeline:merge` só produz CSV quando todos os campos obrigatórios estão
  preenchidos.
- **Campo `difficulty`** não existe no schema CSV oficial — é serializado em
  `keywords` durante o merge para não perder o dado.
- **Não executa `convert:questions` nem `seed:questions` de verdade**: a
  checagem de compatibilidade em `pipeline:export` chama a função real de
  conversão do projeto, mas sempre com um caminho de saída dentro de
  `tools/question-pipeline/output/` — nunca escreve em
  `docs/imports/questions.csv`, `docs/seeds/questions.json` nem no banco.
- Dependências novas adicionadas ao projeto: `pdfjs-dist` (extração de
  texto de PDF, sem binários nativos). Nenhuma dependência nova foi
  necessária para o `pipeline:export` (reutiliza `xlsx`/Zod já presentes
  via `scripts/seed/questions/convert/`).

## Como rodar com outra prova

1. Copiar o `prova.pdf` e o `gabarito.pdf` da nova prova para
   `tools/question-pipeline/input/` (sobrescrevendo os anteriores).
2. Rodar `npm run pipeline:extract`.
3. Conferir `tools/question-pipeline/output/extraction-report.json` para um
   resumo rápido.
4. Abrir `tools/question-pipeline/output/questions.raw.json` e revisar
   manualmente todas as questões com `status: "REVIEW_REQUIRED"` antes de
   usar o conteúdo em qualquer lugar — a ferramenta nunca fabrica texto
   ausente, então essas questões ficam incompletas de propósito.
5. `npm run pipeline:validate` confere a consistência básica do schema do
   `questions.raw.json` já gerado (não reprocessa os PDFs).
6. `npm run pipeline:template` gera `output/classification.template.json`.
7. Preencher manualmente `classification.template.json` (ou copiar para outro
   arquivo e editar — o merge lê `classification.template.json`).
8. `npm run pipeline:merge` gera `output/questions.csv` e o relatório de
   compatibilidade com `convert:questions`.
9. Copiar o `questions.csv` já revisado para `docs/imports/questions.csv` e
   seguir o fluxo oficial do projeto (`npm run convert:questions` e
   `npm run seed:questions`), fora do escopo desta ferramenta.
