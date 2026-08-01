# HOMOLOGAÇÃO — ANATOMIA E FISIOLOGIA — V1

## Pipeline executado (real, ponta a ponta)

1. **Dossiê Mestre** — `DOSSIE_MESTRE_ANATOMIA_FISIOLOGIA_V1.md`, reutilizando os 7 assuntos / 23 subassuntos de `docs/editorial/02j-anatomia-fisiologia.md`, com 2 Achados Editoriais registrados (tensão com MATERIAL_DE_APOIO; tópico Sistema Sensorial fora da taxonomia documentada).
2. **Inteligência Editorial** — `INTELIGENCIA_EDITORIAL_ANATOMIA_FISIOLOGIA_V1.md`, evidência real declarada insuficiente, prior editorial registrado sem uso como base quantitativa.
3. **Auditoria Normativa** — `AUDITORIA_NORMATIVA_ANATOMIA_FISIOLOGIA_V1.md`, sem bloqueios (disciplina de ciência básica sem normativa própria).
4. **Plano Editorial** — `PLANO_PRODUCAO_ANATOMIA_FISIOLOGIA_V1.md`, 50 questões distribuídas nos 23 subassuntos, com distribuição cognitiva 70/20/10 planejada.
5. **Produção** — `PRODUCAO_ANATOMIA_FISIOLOGIA_LOTE1_Q1-25_V1.md` e `LOTE2_Q26-50_V1.md`, 50 questões inéditas.
6. **Gate Editorial** — `GATE_EDITORIAL_ANATOMIA_FISIOLOGIA_V1.md`, 50/50 APROVADAS.
7. **Conversão** — `docs/imports/anatomia-fisiologia-lote-completo.csv` → `docs/seeds/anatomia-fisiologia-lote-completo.seed.json`, 50/50 convertidas sem erros pelo conversor oficial (`convert:questions`).
8. **Importação** — 22 novos `topics` criados no banco real (slugs idênticos aos definidos na fonte), `taxonomy.json` ressincronizado (`export:taxonomy`), 50/50 questões importadas via `seed:questions` (0 ignoradas, 0 erros).
9. **Homologação** — este documento.

## Verificação real pós-importação (consulta direta ao banco de produção)

- Total de questões da disciplina no banco: **52** (2 pré-existentes de Sistema Sensorial + 50 novas).
- 50/50 novas questões com `package_version_id` correto (`940ad0d6-1147-4ba1-be1a-0b07c34cb76b`, "Edição Inicial RC1", `status: PUBLISHED`, `published: true`) — mesma versão publicada usada por Políticas Públicas de Saúde e UTI.
- Cobertura por tópico: os 23 subassuntos do Dossiê Mestre têm exatamente a quantidade planejada (19 com 2 questões, 4 com 3 questões).
- 0 gabaritos inválidos (todos em {A,B,C,D,E}).
- Amostra de conteúdo conferida diretamente no banco: enunciado, alternativas, gabarito e `bibliography` (Guyton & Hall / Tortora / Moore) íntegros. Texto salvo sem acentuação (normalização ASCII), convenção idêntica à já usada nas importações de Políticas Públicas de Saúde e UTI — não é corrupção de dado, é o padrão real do pipeline de CSV deste projeto.
- Distribuição por banca: IBFC (10, incluindo as 2 pré-existentes), Fundação FAFIPA (6), FGV (6), Instituto Consulplan (6), Fundação VUNESP (6), CEBRASPE (6), Instituto AOCP (6), IDECAN (6) — 8 das 10 bancas de referência do SimulaPro usadas.

## Verificação funcional (limitada, sem login — regra de segurança da sessão)

Verificação restrita a nível de banco de dados, como em todas as sprints anteriores desta sessão (nunca login como aluno/admin). Confirmado estruturalmente: `questions.subject_id`/`topic_id`/`board_id`/`package_version_id` todos preenchidos e resolvendo para registros reais; a cadeia de consulta usada pelo aluno (`study-builder.ts` → `content_distributions` → `package_versions` → `questions`) já foi auditada e confirmada correta e sem cache na sprint anterior desta sessão — nenhuma alteração de código foi feita nesta sprint, então essa cadeia permanece válida sem necessidade de reauditoria.

## Achados Editoriais formalmente encerrados nesta homologação

- **Achado 1 (tensão MATERIAL_DE_APOIO):** registrado no Dossiê Mestre, não revertido, tratado como decisão editorial explícita do usuário sobre a arquitetura-sombra `editorial_disciplines` (que nunca chegou a ser aplicada à tabela real `subjects`).
- **Achado 2 (Sistema Sensorial fora da taxonomia):** as 2 questões pré-existentes permanecem intocadas; nenhuma nova questão foi produzida nesse tópico, por instrução explícita do usuário de usar apenas os 23 subassuntos documentados.

## Resultado

Disciplina Anatomia e Fisiologia homologada com 50 questões inéditas produzidas e importadas com sucesso, cobrindo a totalidade dos 7 assuntos / 23 subassuntos da taxonomia existente, com distribuição cognitiva 70/20/10 conferida, Gate Editorial 50/50 aprovado, e total da disciplina no banco em 52 questões.
