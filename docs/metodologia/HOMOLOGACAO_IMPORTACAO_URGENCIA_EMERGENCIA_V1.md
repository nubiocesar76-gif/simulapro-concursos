# HOMOLOGAÇÃO DA IMPORTAÇÃO (PILOTO) — URGÊNCIA E EMERGÊNCIA — V1

## Objetivo e status

Preparar e validar a importação real das 10 questões do `PRODUCAO_N1_PILOTO_URGENCIA_EMERGENCIA_V1.md` (todas aprovadas pelo Gate) contra o pipeline oficial de conversão (`scripts/seed/questions/convert`, executado via `npm run convert:questions`). **Nenhuma importação foi executada.** Nenhum banco, código, componente, SIA ou taxonomia foi alterado — apenas leituras (taxonomia local + 2 consultas de leitura ao Supabase de produção, para confirmar nomes reais de disciplina/tópicos/bancas/cargo e ausência de duplicidade) e a geração de 1 arquivo CSV novo.

## Identificação do "pipeline oficial" — investigação necessária antes de converter

Este projeto tem **dois** pipelines de importação de questões, com contratos incompatíveis entre si, e nenhum dos dois foi construído pensando em conteúdo inédito produzido pela trilha metodológica (Dossiê → Inteligência → Auditoria → Plano → Lote):

1. **`scripts/seed/questions/convert` (`npm run convert:questions`)** — o "SimulaPro Question Converter" real, documentado em `scripts/seed/convert-questions.ts` como o "Fluxo oficial: CSV/XLSX → questions.json → npm run seed:questions". Campos obrigatórios: `statement, alternative_a-d, correct_answer, position, board, contest, subject, topic, year, explanation`; opcionais: `alternative_e, organization, exam, page, question, references, keywords, status, package, package_version`. **100% do uso real já registrado neste pipeline (`docs/imports/questions.csv`, 204 linhas) é de provas reais extraídas de PDF** (EBSERH, SESPA, SEMSA Manaus, SES-DF, Recife, João Pessoa) — nenhuma linha de conteúdo inédito existe nesse arquivo.
2. **`convergence.server.ts`** — pipeline exclusivo do Motor Editorial de IA (`editorial_ai_cycles`), usado por `publish-cycle.ts`. Não aceita um arquivo CSV/JSON avulso; exige um `cycleId` real já existente nas tabelas `editorial_ai_cycles`/`editorial_ai_contents`/`editorial_ai_inputs`, preenchidas pelo orquestrador automático (Sprints 6.1-7.1). As 10 questões desta sprint foram redigidas diretamente em texto pela trilha metodológica, não pelo orquestrador de IA — não possuem `cycleId`, portanto este caminho não se aplica.

Dado que o comando do Sprint 6.6 lista exatamente os campos do pipeline (1) — `subject, topic, board, contest, position, package, package_version, keywords, status, referências` — a conversão foi feita usando esse pipeline, **por ser literalmente o que o enunciado descreve**, e por ser o único que gera um artefato CSV/JSON avulso e independente (sem depender de um ciclo de IA já existente).

## Etapa 1 — Conversão para o formato oficial

**Arquivo gerado:** [docs/imports/urgencia-emergencia-piloto-n1.csv](docs/imports/urgencia-emergencia-piloto-n1.csv) — 10 linhas, colunas exatamente conforme `columns.ts` (`REQUIRED_COLUMNS` + `OPTIONAL_COLUMNS`).

Valores usados (confirmados reais por leitura direta do Supabase de produção, não assumidos):

| Campo | Valor usado | Confirmação |
|---|---|---|
| `subject` | `urgencia-e-emergencia` | subjects.id = c75609bd-898c-4188-bbf4-a733ea07c068, consultado ao vivo |
| `topic` (8 questões) | `parada-cardiorrespiratoria-e-rcp`, `emergencias-cardiovasculares`, `atendimento-ao-politraumatizado`, `disturbios-hidroeletroliticos-e-acido-basicos` | os 4 tópicos existem de fato em `topics` para o `subject_id` acima |
| `topic` (Q9, Q10) | `escala-de-coma-de-glasgow` | **não existe** — usado propositalmente para expor o gap real, não uma tentativa de aprovar |
| `board` | `fgv`, `ibfc`, `instituto-aocp` | slugs confirmados em `boards` |
| `position` | `enfermeiro` | slug confirmado em `positions` |
| `package` / `package_version` | `banco-de-questoes-enfermagem` / `1.0` | combinação real já usada em 204/204 linhas de `docs/imports/questions.csv` — nenhum valor inventado |
| `contest` | *(vazio)* | nenhum valor honesto disponível — ver achado abaixo |
| `year` | *(vazio)* | idem |
| `status` | `ACTIVE` | padrão |
| `keywords` | *(vazio)* | opcional; nenhuma palavra-chave SIA autorada aqui (ver achado sobre metadados SIA) |

## Etapa 2/3 — Validação real (execução do pipeline, não simulada)

Comando executado: `npx tsx scripts/seed/convert-questions.ts docs/imports/urgencia-emergencia-piloto-n1.csv docs/seeds/tmp-urgencia-emergencia-piloto-n1.seed.json` (caminho de saída isolado, nunca sobrescrevendo `docs/seeds/questions.json` real).

**Saída real do validador (`validateRows`, sem edição):**

```
Linha | Campo   | Erro
------|---------|-----
  2-11| contest | Concurso é obrigatório.               (10/10 linhas)
  2-11| year    | Ano é obrigatório.                     (10/10 linhas)
 10-11| topic   | Assunto "escala-de-coma-de-glasgow" não existe na disciplina "urgencia-e-emergencia".  (2/10 linhas)

Total de erros: 22
```

Conversão **abortada automaticamente pelo próprio script** (exit code 1) — nenhum `questions.json` foi escrito, conforme "Não importar automaticamente se houver erro" (Etapa 4). `package`/`package_version` **não geraram erro** (checagem real contra o banco via `validatePackageReferences`, que só roda se a conversão síncrona passar — não chegou a rodar, mas o par usado é real e pré-existente, risco baixo).

## ACHADO TÉCNICO 1 — `contest` e `year` são incompatíveis com conteúdo inédito neste pipeline

`contest` é validado contra `hasContest(sets, board, contest)`, que só reconhece concursos reais já catalogados em `docs/seeds/taxonomy.json` (todos ligados a provas passadas específicas). **Não existe, em nenhuma banca, um concurso convencionado para "conteúdo inédito"** — confirmado por inspeção de 100% das combinações banca/concurso já usadas nas 204 linhas reais do arquivo de produção. `year` sofre do mesmo problema: é o ano do concurso real, que não existe para uma questão inédita.

Preencher esses campos com um valor inventado (ex.: criar um "concurso fictício" ou atribuir o ano de produção como se fosse o ano do certame) seria **falsificar a proveniência da questão** — contradiz diretamente a regra "Nunca copiar questão existente / inspirar-se apenas no estilo da banca" já estabelecida no Sprint 6.5A, e o próprio comentário do código-fonte (`convergence.server.ts`, linha 206) já resolve esse mesmo problema de outra forma para conteúdo de IA: `exam_id: null // conteúdo inédito por IA — não pertence a nenhum concurso real`. Este pipeline (`scripts/seed/questions/convert`) **não tem equivalente** a esse `null` — `contest`/`year` são incondicionalmente obrigatórios para toda e qualquer linha.

**Conclusão:** este pipeline é estruturalmente dedicado a lotes de prova real extraída de PDF, não a conteúdo inédito. Nenhuma das 10 questões pode ser convertida por ele sem falsificar dado de proveniência.

## ACHADO TÉCNICO 2 — gap de taxonomia em "Escala de Coma de Glasgow" (Q9, Q10)

Confirmado ao vivo: `topics` para `urgencia-e-emergencia` tem exatamente 10 entradas (Intoxicações Exógenas, Atendimento ao Politraumatizado, Parada Cardiorrespiratória e RCP, Fundamentos da Urgência e Emergência, Emergências Respiratórias, Distúrbios Hidroeletrolíticos e Ácido-Básicos, Emergências Cardiovasculares, AVC, Crise Convulsiva e Emergências Neurológicas, SAMU e Atendimento Pré-Hospitalar) — **nenhuma corresponde ao capítulo 5.2 do Dossiê Mestre** ("Escala de Coma de Glasgow"). Mesmo padrão de gap já registrado em Saúde Coletiva (Fase 5.0/Sprint H1, 13/30 bloqueadas). Forçar Q9/Q10 em "Atendimento ao Politraumatizado" (o tópico vizinho mais próximo) violaria o Nível 2 do Gate ("Cobertura correta do subassunto — não um subassunto vizinho por proximidade temática"), portanto não foi feito.

## ACHADO TÉCNICO 3 — ausência estrutural de campos SIA e de dificuldade neste pipeline

`columns.ts` não tem **nenhuma** coluna para os metadados SIA (`sia_tags`, pegadinha, interpretação, texto longo, cálculo etc.) nem para `difficulty`. Este é o mesmo gap já documentado em `QUESTION_SPEC_V1.md` (Seção 9) e replicado no comentário real de `src/lib/import.ts` ("Importação em massa (CSV/JSON) não traz conteúdo SIA — autoria acontece depois, via admin de Questões"). Não é um problema introduzido por esta sprint — é uma limitação estrutural já conhecida e já contornada no piloto do SIA V1 (autoria manual pós-importação via `QuestionsPage.tsx`). Os metadados SIA já levantados no `PRODUCAO_N1_PILOTO_URGENCIA_EMERGENCIA_V1.md` (tags, pegadinha, protocolo etc.) continuam válidos como insumo para essa autoria manual futura — não foram descartados, apenas não têm onde entrar neste CSV.

## Homologação — checklist do enunciado

| Item | Resultado |
|---|---|
| Nenhuma questão duplica o banco existente | ✓ Confirmado — comparação real dos prefixos das 10 questões contra as 66 questões reais já cadastradas em `urgencia-e-emergencia`: 0 colisões |
| Todas possuem alternativa correta única | ✓ Já validado no Gate (Sprint 6.5A, Nível 1) |
| Referências presentes | ✓ Todas as 10 têm referência oficial preenchida no CSV (`references`) |
| Metadados SIA consistentes | ⚠ Consistentes com o que foi autorado no piloto de produção, mas **sem coluna de destino neste pipeline** (Achado Técnico 3) — não avaliável dentro deste formato |
| Compatibilidade com o importador atual | ✗ **Não compatível** — `contest`/`year` obrigatórios sem valor honesto disponível (Achado Técnico 1) |
| Compatibilidade com o banco de produção | ⚠ Parcial — `subject`/`board`/`position`/`package`/`package_version` resolvem corretamente contra o banco real; `topic` resolve para 8/10 questões (Q9/Q10 bloqueadas, Achado Técnico 2) |

---

# ENTREGA

1. **Quantidade preparada:** 10 questões convertidas para o formato do pipeline oficial (arquivo gerado), 0 aprovadas na validação real do pipeline.
2. **Arquivo(s) gerado(s):** [docs/imports/urgencia-emergencia-piloto-n1.csv](docs/imports/urgencia-emergencia-piloto-n1.csv).
3. **Resultado da validação:** REPROVADA pelo pipeline — 22 erros reais (saída literal do validador acima), execução abortada automaticamente antes de gerar `questions.json`, nenhuma importação ocorreu.
4. **Inconsistências encontradas:** (1) `contest` obrigatório sem valor honesto para conteúdo inédito, 10/10 questões; (2) `year` obrigatório sem valor honesto, 10/10 questões; (3) `topic` inexistente para o capítulo 5.2 (Escala de Coma de Glasgow), 2/10 questões (Q9, Q10); (4) ausência estrutural de colunas para metadados SIA e dificuldade neste pipeline (achado, não bloqueio).
5. **Questões rejeitadas:** 10/10 nesta execução — Q1-Q8 por incompatibilidade estrutural do pipeline com conteúdo inédito (achado 1, corrigível fora desta sprint); Q9-Q10 adicionalmente por gap de taxonomia (achado 2).
6. **Questões aprovadas:** 0/10 nesta execução do pipeline (nota: as 10 permanecem **APROVADAS no Gate de Qualidade Editorial**, Sprint 6.5A — a reprovação aqui é de compatibilidade de formato/pipeline, não de qualidade de conteúdo).
7. **Prontas para importação? NÃO.**
8. **Próxima etapa exata:** decisão humana fora do escopo desta sprint (não executável sob as restrições "não alterar taxonomia/código/banco" já em vigor) sobre qual das duas rotas adotar para conteúdo inédito da trilha metodológica: (a) estender `scripts/seed/questions/convert` com um valor convencionado para `contest`/`year` de conteúdo inédito (ex.: `contest` opcional quando `year` ausente, e vice-versa), replicando para este pipeline o mesmo tratamento que `convergence.server.ts` já dá via `exam_id: null`; ou (b) registrar as 10 questões como um ciclo do Motor Editorial de IA (`editorial_ai_cycles`) só para aproveitar `convergence.server.ts`, mesmo tendo sido escritas manualmente. Adicionalmente, decisão sobre criar o tópico "Escala de Coma de Glasgow" na taxonomia real (bloqueia Q9/Q10 independentemente da rota escolhida acima).

## Encerramento desta fase

Nenhuma importação foi realizada. Nenhum banco, código, componente, SIA ou taxonomia foi alterado (apenas leituras). Encerrando imediatamente, conforme instrução explícita da Sprint 6.6.
