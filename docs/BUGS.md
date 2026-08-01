# BUGS — Log de Produção (Modo Produção)

Registro rápido de problemas encontrados durante produção editorial. Não bloqueiam produção salvo perda de dados, quebra de pipeline ou corrupção de banco — nesses casos a produção para imediatamente.

---

### BUG-001 — Filtro "Banca" no Portal do Aluno mostra 80 em vez de 89 questões (EBSERH 2018 / CEBRASPE)

- **Onde:** tela "Configurar sessão" do Portal do Aluno, filtro Banca.
- **Sintoma:** com Banca=CEBRASPE selecionado, mostra "CEBRASPE (80)" — deveria ser 89 (confirmado no banco: 89 questões com `board=CEBRASPE`, `exam=EBSERH 2018`, nenhuma outra questão CEBRASPE no acervo).
- **Causa provável:** não investigada (fora de escopo em modo produção).
- **Gravidade:** Média — não impede uso, mas contador incorreto pode confundir o aluno.
- **Status:** Aberto.

### BUG-003 — Fontes candidatas a "Prova #2" com bloqueios reais de sourcing (não produzidas)

- **pref-poa-2019 (Fundatec, CP 597 Enfermeiro):** portal oficial (`www2.portoalegre.rs.gov.br`) lista edital de abertura, gabarito preliminar e gabarito definitivo, mas **não publica o caderno de provas (questões) em nenhum lugar da página do concurso** — sem o texto das questões, não é possível transcrever. Descartada para produção.
- **IBFC (ebserh-2020, base de outras provas IBFC):** menu "Provas e Gabaritos" > "Cadernos de Questões" usa `href="javascript:;"` (carregamento dinâmico via JS) que trava a automação do navegador (timeout repetido). Não investigado a fundo (fora de escopo em modo produção). Pulado por ora.
- **Status:** Ambas descartadas desta rodada; seguindo para próxima fonte da fila (P1).

### BUG-004 — SESPA-PA 2023, item 18 excluído (depende de imagem/planilha) — SUPERADO, ver BUG-006

- **Onde:** Prova SESPA-PA 2023, Enfermeiro, item 18 (MS-Excel, função SOMASE).
- **Sintoma:** o enunciado referencia "a planilha a seguir" — uma imagem/tabela embutida no PDF, não reproduzível em texto puro sem risco de erro.
- **Ação:** item excluído do lote (não transcrito, não fabricado). Total do lote: 50 − 3 anuladas (22, 23, 24) − 1 (item 18) = 46 válidos.
- **Status:** Superado — este CSV de 46 itens nunca foi seedado (ver BUG-006). A prova já estava completa no banco desde 2026-07-10, com 47 itens incluindo o item 18 (a "planilha" do enunciado é decorativa; a questão testa apenas sintaxe da função SOMASE, sem depender de valores não reproduzíveis em texto — a exclusão foi cautelar demais). `docs/work/sespa-pa-2023/questions.csv` foi substituído pela exportação real do banco.

### BUG-006 — SESPA-PA 2023 seedada sem documentação em 2026-07-10; produção desta sessão criou 37 duplicatas antes de detectar

- **Onde:** `questions` (banco de produção), contest `concurso-publico-sespa-edital-01-2023`.
- **Sintoma:** em 2026-07-24, ao processar SESPA-PA 2023 como próxima prova da fila, `seed:questions` criou apenas 37 de 46 questões esperadas (BUG-004). Investigação revelou que já existiam 47 questões da mesma prova no banco, seedadas em 2026-07-10 por uma sessão que não deixou nenhum rastro em git, `docs/work/` ou `docs/imports/questions.csv` — nem `status.json`/README foram criados na época.
- **Causa raiz:** processo de produção anterior não seguiu a disciplina de documentação (toda prova seedada deveria ter pasta `docs/work/<id>/` com histórico rastreável). A memória de longo prazo desta sessão ("SESPA CSV pronto aguardando seed") ficou desatualizada em relação ao estado real do banco.
- **Ação:** investigação item a item (casando alternativas de cada uma das 84 questões então existentes contra o texto oficial dos 50 itens do gabarito, não a metadata solta) confirmou que as 47 pré-existentes já cobriam os 47 itens válidos corretamente, sem corrupção real (a aparência de corrupção em investigações intermediárias foi artefato de codepage do console Windows em scripts Python de diagnóstico, não um problema do banco). As 37 duplicatas desta sessão foram removidas (DELETE por id, com checagem dupla de exam_id e contagem). Acervo restaurado a 1266. `docs/work/sespa-pa-2023/` documentado retroativamente.
- **Achado colateral:** assuntos `saude-do-adulto` e `imunizacao` existiam em `taxonomy.json` como `INACTIVE`/sem tópicos, mas já eram usados pelas 47 questões reais — mesma sessão de 07-10 também alterou taxonomia direto no banco sem atualizar o arquivo fonte. Corrigido (ver `docs/work/sespa-pa-2023/status.json`).
- **Pendência aberta:** reconverter `docs/work/sespa-pa-2023/questions.csv` via `convert:questions` volta a gerar hash diferente do já seedado (causa não identificada), recriando duplicatas se `seed:questions` for rodado em seguida. Não rodar `convert:questions` sobre este CSV sem investigar antes.
- **Gravidade:** Média — sem perda de dados (nenhuma questão original foi apagada, apenas duplicatas desta sessão), mas evidencia gap de processo (seeds diretos no banco sem documentação) que pode ter acontecido em outras provas ainda não auditadas.
- **Status:** Fechado para SESPA-PA 2023. Confirmado que o mesmo gap afeta `docs/work/ebserh-2018/`: o README dizia "PAUSADA — bloqueada", mas o banco já tem as 89 questões válidas (`board=cebraspe`) seedadas; corrigido na mesma auditoria (ver `docs/work/ebserh-2018/README.md`).
- **Achado de escopo (não é bug, é contexto):** o acervo de 1266 questões inclui pelo menos 13 outras combinações banca/concurso (ex.: `fundacao-vunesp`/Campinas, `coseac`/Niterói, `fundatec`/RS, `ufpr-nc`/Curitiba, várias FGV/IBFC de UFs e municípios) sem NENHUMA pasta `docs/work/` correspondente. Diferente do caso SESPA/EBSERH-2018 (onde a pasta existe e está desatualizada), aqui não há pasta nenhuma — consistente com ser acervo herdado de antes da convenção `docs/work/` da Operação Enfermagem, não um gap de documentação da operação atual. Não investigado a fundo (fora do escopo desta sessão); mencionado para quem for auditar a Fase 5.

### BUG-005 — Outras consultas a `questions` potencialmente sujeitas ao limite de 1000 linhas do Supabase/PostgREST

- **Onde:** durante a produção da Prova 001 (EBSERH 2025 – Enfermeiro – FGV), o acervo total ultrapassou 1000 questões pela primeira vez, o que expôs e permitiu corrigir um truncamento silencioso em `fetchStudyBuilderCatalog` (`src/lib/study-builder.ts`) — `.select()` sem `.range()` era limitado a 1000 linhas pelo Supabase/PostgREST. Corrigido via paginação explícita (`fetchAllQuestionsForPackageVersion`).
- **Estado real verificado na auditoria GO-001 (contagem no banco: distribuição de Enfermagem = 1068 questões, já ultrapassa o teto):**
  - **Corrigidas (paginação `.range()` em loop já aplicada):**
    - `src/lib/study-engine.ts` — `fetchOrderedSessionQuestions`.
    - `src/lib/study-engine.ts` — `getSessionQuestions` (ramo sem filtro).
    - `src/lib/review-center.ts` — `fetchReviewCenterSnapshot` (bloco `acervoRows`).
    - `src/lib/student-dashboard.ts` — `fetchDashboardDistributions` (corrigida na GO-002; verificado no banco real: sem paginação retornava 1000 linhas, com paginação retorna as 1088 reais — 1068 + 20 por versão).
  - **Seguras por construção, não exigem correção:**
    - `src/lib/study-engine.ts` — `fetchQuestionDetailsForResults` (busca por `.in("id", chunk)` em lotes de 200, nunca ilimitada).
    - `src/lib/study-engine.ts` — `loadQuestion` e `saveAnswer` (busca de uma única linha por `id`).
  - **Risco baixo, ainda sem paginação, mantido em aberto deliberadamente:**
    - `src/lib/study-engine.ts` — `getSessionQuestions` (ramo filtrado, `isFilterStudyMode`): limitado aos IDs já filtrados de um único aluno (favoritos/revisão/erradas) — improvável ultrapassar 1000 na prática, mas não paginado.
- **Gravidade:** era Alta (dados ausentes sem erro visível) nos pontos já corrigidos; Baixa no ponto remanescente.
- **Status:** 4 de 5 pontos reais corrigidos e verificados contra o banco. Ramo filtrado de `getSessionQuestions` permanece aberto, risco baixo, sem prazo definido.

### BUG-002 — Instabilidade do dev server (Vite HMR) interrompe sessões de estudo

- **Onde:** app inteiro, mais frequente em `/app/study` e `/app/study/:sessionId`.
- **Sintoma:** WebSocket de HMR reconecta repetidamente ("[vite] connecting... connected." em loop), causando remount da aplicação e tela travada em "Carregando...".
- **Causa provável:** ambiente local de desenvolvimento (HMR), não deve afetar produção (sem HMR ativo).
- **Gravidade:** Alta para testes locais nesta sessão; não avaliada para produção.
- **Status:** Aberto.
