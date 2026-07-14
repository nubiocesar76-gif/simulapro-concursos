# SESAU Recife 2019/2020 (Instituto AOCP) — cargo Enfermeiro

- Nome do concurso: Edital de Concurso Público nº 001/2019
- Órgão: Secretaria de Saúde do Recife (SESAU) / Prefeitura do Recife (PE)
- Banca: Instituto AOCP
- Cargo utilizado: **Enfermeiro 30h Plantonista** (código 417, nível superior, 88 vagas —
  turno tarde). O concurso tem múltiplas variantes de "Enfermeiro" (Diarista, Plantonista,
  Obstetra, USF, Urgência/Emergência SAMU); a variante Plantonista foi a que permitiu
  transcrição completa e verificada do bloco SUS + Conhecimentos Específicos (ver
  "Fontes e limitação" abaixo).
- Status:
  ☑ Edital
  ☑ Prova (parcial — ver limitação)
  ☑ Gabarito definitivo
  ☑ Formato validado (5 alternativas A–E)
  ☑ CSV
  ☑ questions.json
  ☑ Seed
  ☑ Validado (verificação via DB)

Questões importadas: **35 de 50** (Sistema Único de Saúde/Saúde Coletiva + Conhecimentos
Específicos, questões 16 a 50). As questões 1–15 (Língua Portuguesa) não puderam ser
importadas — ver "Fontes e limitação".

## Pré-checagem

1. Cargo Enfermeiro? **SIM** — Edital nº 001/2019, Anexo I, cargos 416 a 422 (Enfermeiro em
   suas variantes), nível superior.
2. Edital público? **SIM** — obtido diretamente do site oficial da Prefeitura do Recife
   (`www2.recife.pe.gov.br`).
3. Prova pública? **SIM**, mas o caderno de questões oficial (PDF completo) não pôde ser
   baixado diretamente — ver "Fontes e limitação".
4. Gabarito definitivo público? **SIM** — obtido via Wayback Machine, arquivo
   `gabarito_def_tarde_recife.pdf` do Instituto AOCP, contendo o gabarito definitivo (pós
   recursos) de todos os cargos do turno da tarde, incluindo Enfermeiro 30h Plantonista.
5. Formato da prova: **A–E (5 alternativas)** — confirmado pelo item 9.3 do edital ("Cada
   questão da Prova Objetiva terá 5 (cinco) alternativas") e pela estrutura do gabarito
   oficial.

Todas as respostas SIM → sprint prosseguiu conforme o fluxo homologado, com a ressalva
documentada abaixo sobre a impossibilidade de acesso ao caderno de questões completo.

## Fontes e limitação

O portal oficial do Instituto AOCP (institutoaocp.org.br) bloqueia acesso automatizado
(HTTP 403) às páginas de listagem e download de provas. O Wayback Machine arquivou apenas
documentos administrativos do concurso (editais, cronogramas, resultados, **gabaritos**),
mas não o caderno de questões (prova objetiva) em si — arquivo aparentemente nunca
rastreado pelo crawler do arquivo.org.

Como fonte alternativa para o texto das questões, foi utilizado o simulador interativo
público do site `pciconcursos.com.br`
(`/provas/download/enfermeiro-30h-plantonista-prefeitura-recife-pe-aocp-2020`), que
disponibiliza — sem paywall, incorporado diretamente no HTML da página — o enunciado e as
5 alternativas de cada questão nº 16 a 50 da prova de Enfermeiro 30h Plantonista (bloco
SUS/Saúde Coletiva + Conhecimentos Específicos). O download do PDF completo da prova e do
gabarito nesse mesmo site é protegido por captcha (Cloudflare Turnstile) e não pôde ser
automatizado.

As questões 1 a 15 (Língua Portuguesa, conteúdo comum a todos os cargos) **não estão
disponíveis** nesse simulador nem em nenhuma outra fonte acessível verificada (qconcursos,
mapadaprova, tecconcursos e romulopassos.com.br retornaram bloqueio por autenticação,
captcha ou proteção anti-bot; o caderno de questões oficial não foi localizado em nenhuma
fonte arquivada). Diante da impossibilidade de obter esse conteúdo de forma verificada, e
para não fabricar ou adaptar conteúdo, as questões de Língua Portuguesa foram **excluídas
desta sprint**, mesmo estando o gabarito oficial disponível para elas.

Todas as 35 questões efetivamente importadas (SUS/Saúde Coletiva, questões 16 a 30, e
Conhecimentos Específicos, questões 31 a 50) tiveram texto e alternativas confrontados
com o gabarito oficial definitivo (pós-recurso) do Instituto AOCP, sem nenhuma questão
anulada nesse intervalo para o cargo Enfermeiro 30h Plantonista (a única anulada do
cargo, questão 6, pertence ao bloco de Português não importado).

## Taxonomia

Reuso quase integral da taxonomia existente. 4 assuntos (tópicos) genuinamente inéditos
foram criados, todos dentro de disciplinas já existentes (nenhuma disciplina nova):

- `legislacao-municipal-e-institucional` → `conferencia-municipal-de-saude-do-recife`
- `politicas-publicas-de-saude` → `historico-da-previdencia-social-no-brasil`
- `legislacao-do-sus` → `politica-nacional-de-saude-integral-da-populacao-negra-pnsipn`
- `legislacao-municipal-e-institucional` → `estatuto-dos-funcionarios-publicos-do-municipio-do-recife`

1 concurso novo: `concurso-publico-secretaria-de-saude-do-recife-edital-1-2019` (banca
`instituto-aocp`, já existente na taxonomia).
