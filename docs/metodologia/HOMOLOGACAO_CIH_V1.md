# HOMOLOGAÇÃO — CONTROLE DE INFECÇÃO HOSPITALAR — V1

## Etapa 1 — Auditoria (estado real confirmado antes da produção)

Consulta direta ao banco: 18 questões reais pré-existentes, 3 `topics` reais (nenhum precisou ser criado). Nenhum documento em `docs/metodologia` para esta disciplina antes desta sprint. **Achado crítico registrado no Dossiê Mestre:** esta disciplina é marcada como `MESCLADA` em Biossegurança na taxonomia-sombra `editorial_disciplines` (nunca aplicado à tabela real `subjects`) — mesmo padrão já observado em Anatomia e Fisiologia e em Enfermagem Médico-Cirúrgica/Saúde do Adulto nesta sessão. Além disso, os 3 `topics` reais desta disciplina existem, com os mesmos nomes, também em Biossegurança (7 questões reais lá), exigindo checagem de duplicidade cruzada nesta sprint.

## Pipeline executado (real, ponta a ponta)

1-2. **Auditoria + Documentação** — `DOSSIE_MESTRE_CONTROLE_INFECCAO_HOSPITALAR_V1.md`, `INTELIGENCIA_EDITORIAL_CONTROLE_INFECCAO_HOSPITALAR_V1.md`, `AUDITORIA_NORMATIVA_CONTROLE_INFECCAO_HOSPITALAR_V1.md`, `PLANO_PRODUCAO_CONTROLE_INFECCAO_HOSPITALAR_V1.md` — criados nesta sprint, reaproveitando `docs/editorial/02h-centro-cirurgico-cme-controle-infeccao.md` (seção 2).
3. **Produção** — `PRODUCAO_CIH_LOTE1_Q1-16_V1.md` e `LOTE2_Q17-32_V1.md`, 32 questões inéditas, com verificação de duplicidade cruzada contra as 18 reais desta disciplina e as 7 reais de Biossegurança.
4. **Gate Editorial** — `GATE_EDITORIAL_CIH_V1.md`, 32/32 APROVADAS.
5. **Conversão** — `docs/imports/cih-lote-completo.csv` → `docs/seeds/cih-lote-completo.seed.json`, **32/32 convertidas sem erros** pelo `convert:questions` oficial.
6. **Importação** — `seed:questions`: **32 criadas, 0 ignoradas, 0 erros**. Nenhum tópico precisou ser criado.
7. **Homologação** — este documento.

## Verificação real pós-importação (consulta direta ao banco)

- Quantidade produzida: 32. Quantidade convertida: 32. Quantidade importada: 32. Quantidade ignorada: 0. Quantidade com erro: 0.
- Quantidade final da disciplina: **50** (18 pré-existentes + 32 novas).
- Cobertura dos assuntos: **3/3 tópicos reais** cobertos — CCIH e Prevenção de Infecção Hospitalar (24), Precauções e Isolamento (20), Reprocessamento de Produtos para Saúde (6).
- Cobertura dos subassuntos: os 14 subassuntos de `02h` (seção 2.4) usados como guia de conteúdo foram todos endereçados dentro dos 3 buckets reais (ver Plano Editorial para o mapeamento).
- `package_version_id`: **49/50 com a versão publicada principal** (`940ad0d6-1147-4ba1-be1a-0b07c34cb76b`); 1 questão pré-existente (não desta sprint) tem `package_version_id` diferente (`120a952a-e63f-4215-bf42-25db27a3bac2`) — confirmado, via `metadata`, tratar-se de uma cópia legítima e pré-existente (`demo: true`, `metadata.origin` referenciando a questão real original), feita para a distribuição "Primeiro Simulado Grátis" em 2026-07-15, antes desta sessão. Nenhuma ação necessária — achado apenas verificado e reportado por transparência, não é uma inconsistência introduzida nesta sprint.
- `subject_id`/`topic_id` corretos em 100% das 50 linhas. `exam_id` nulo nas 32 novas (esperado — inédito). 0 gabaritos inválidos.
- `bibliography`: presente nas 32 novas; ausente em 18 das 50 (as 18 pré-existentes, dado legado, não alterado).
- Distribuição por banca (50 questões, incluindo as 18 pré-existentes): FGV (12), IBFC (11), Instituto AOCP (5), IDECAN (5), Fundação VUNESP (5), CEBRASPE (4), Instituto Consulplan (4), COSEAC (3, pré-existente), UFPR/NC (1, pré-existente).
- **Total geral da plataforma após esta sprint: 1.557 questões** (1.525 antes desta sprint + 32 novas).

## Problemas encontrados e correções realizadas

- Nenhum bloqueio técnico real impediu a continuidade do Sprint.
- Achado arquitetural (disciplina marcada `MESCLADA` na taxonomia-sombra, real overlap de tópicos com Biossegurança) registrado explicitamente no Dossiê Mestre, tratado como decisão editorial informada do usuário (nomeou a disciplina explicitamente como "Controle de Infecção Hospitalar (CCIH/IRAS)"), sem reverter a arquitetura real nem a taxonomia-sombra.
- Verificação de duplicidade cruzada contra Biossegurança (achado não presente nas sprints anteriores desta fase) foi tratada como validação adicional no Gate Editorial, Nível 2 — nenhuma correção necessária, nenhuma duplicidade encontrada.
- 1 questão pré-existente com `package_version_id` de distribuição demo, verificada e explicada (não é erro).

## Resultado

Disciplina Controle de Infecção Hospitalar homologada com 32 questões inéditas produzidas e importadas com sucesso, cobrindo a totalidade dos 3 tópicos reais e dos 14 subassuntos-guia de `02h`, com Gate Editorial 32/32 aprovado (incluindo checagem de duplicidade cruzada com Biossegurança), e total da disciplina no banco em 50 questões.
