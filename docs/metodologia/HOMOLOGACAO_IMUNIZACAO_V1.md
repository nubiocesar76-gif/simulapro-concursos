# HOMOLOGAÇÃO — IMUNIZAÇÃO — V1

## Fase 1 — Auditoria (estado real confirmado antes da produção)

Consulta direta ao banco: 20 questões reais pré-existentes, 4 `topics` reais. Nenhum documento em `docs/metodologia` para esta disciplina antes desta sprint. **Achados críticos registrados no Dossiê Mestre:** (1) disciplina rebaixada a "assunto forte" de Saúde Coletiva na taxonomia-sombra, nunca aplicado à tabela real `subjects`; (2) **sobreposição real substancial** — Saúde Coletiva possui 14 questões reais nos mesmos 3 nomes de tópico desta disciplina; (3) tópico indispensável "Rede de Frio" ausente do acervo real, criado nesta sprint.

## Pipeline executado (real, ponta a ponta)

1-2. **Auditoria + Documentação** — `DOSSIE_MESTRE_IMUNIZACAO_V1.md`, `INTELIGENCIA_EDITORIAL_IMUNIZACAO_V1.md`, `AUDITORIA_NORMATIVA_IMUNIZACAO_V1.md`, `PLANO_PRODUCAO_IMUNIZACAO_V1.md` — criados nesta sprint, reaproveitando `docs/editorial/02c-saude-coletiva-imunizacao-doencas-transmissiveis.md` (seção 2).
3. **Produção** — `PRODUCAO_IMUNIZACAO_LOTE1_Q1-15_V1.md` e `LOTE2_Q16-30_V1.md`, 30 questões inéditas.
4. **Fase 4 — Controle de duplicidade** (obrigatória, checagem cruzada contra 5 disciplinas): 20 questões reais desta disciplina + 14 questões reais de Saúde Coletiva (mesmos nomes de tópico) lidas integralmente; 0 sobreposição real com Controle de Infecção Hospitalar e Biossegurança (nenhum tópico vacinal); 0 questões reais de Saúde da Criança e do Adolescente mencionam vacina; sobreposição irrelevante com Políticas Públicas de Saúde (1 menção tangencial). Nenhuma duplicidade real encontrada nas 30 novas — apenas sobreposição temática legítima com Saúde Coletiva, documentada e diferenciada por recorte.
5. **Gate Editorial** — `GATE_EDITORIAL_IMUNIZACAO_V1.md`, 30/30 APROVADAS.
6-7. **Conversão + Validação** — `docs/imports/imunizacao-lote-completo.csv` → `docs/seeds/imunizacao-lote-completo.seed.json`, **30/30 convertidas sem erros** pelo `convert:questions` oficial.
7. **Importação** — `seed:questions`: **30 criadas, 0 ignoradas, 0 erros**. Único tópico novo criado nesta sprint: "Cadeia de Frio e Conservação de Imunobiológicos" (justificado, vinculado à disciplina, taxonomia reexportada antes da conversão).
8. **Homologação** — este documento.

## Verificação real pós-importação (consulta direta ao banco)

- Quantidade produzida: 30. Quantidade convertida: 30. Quantidade importada: 30. Quantidade ignorada: 0. Erros: 0.
- Quantidade final da disciplina: **50** (20 pré-existentes + 30 novas).
- Cobertura dos assuntos: **5/5 tópicos reais** cobertos — Calendário Nacional de Vacinação (18), Cadeia de Frio e Conservação de Imunobiológicos (12, novo), Técnica de Administração de Vacinas (11), Resposta Imune Humoral e Imunoglobulinas (5), Avaliação da Cobertura Vacinal (4).
- Cobertura dos subassuntos: os 13 subassuntos-guia de `02c` (seção 2.4) foram todos endereçados dentro dos 5 tópicos reais.
- `subject_id`/`topic_id` corretos em 100% das 50 linhas. `board_id` presente em 100%. `package_version_id`: **49/50 com a versão publicada principal**; 1 questão pré-existente (não desta sprint) tem `package_version_id` de distribuição demo (`120a952a-e63f-4215-bf42-25db27a3bac2`) — confirmado, via `metadata` (`demo: true`, referência ao exame real EBSERH Nacional 2023), cópia legítima pré-existente de 2026-07-15, mesmo padrão já observado e explicado nas duas sprints anteriores. `exam_id` nulo nas 30 novas (esperado — inédito). 0 gabaritos inválidos.
- `bibliography`: presente nas 30 novas; ausente em 20 das 50 (as 20 pré-existentes, dado legado).
- Distribuição por banca (50 questões, incluindo as 20 pré-existentes): IBFC (12), FGV (12), Instituto AOCP (6), Fundação VUNESP (5), Instituto Consulplan (4), CEBRASPE (4), FUNDATEC (3, pré-existente), IDECAN (3), UFPR/NC (1, pré-existente).
- **Total geral da plataforma após esta sprint: 1.618 questões** (1.588 antes desta sprint + 30 novas).

## Distribuição cognitiva

30 questões novas: **21 aplicação clínica (70,0%)**, **6 julgamento clínico (20,0%)**, **3 integração normativa (10,0%)** — proporção exata (30 é múltiplo de 10).

## Problemas encontrados e correções realizadas

- Sobreposição real substancial com Saúde Coletiva (14 questões nos mesmos 3 tópicos) — a mais intensa observada nesta sessão até aqui — tratada com leitura integral obrigatória e checagem cruzada documentada, sem nenhuma duplicidade real na produção nova.
- Tópico indispensável "Rede de Frio" ausente — criado 1 tópico novo, único necessário, vinculado corretamente, taxonomia reexportada.
- 1 questão pré-existente com `package_version_id` de distribuição demo — investigada e confirmada como cópia legítima, sem necessidade de correção.
- Nenhum bloqueio técnico, normativo ou metodológico real encontrado.

## Resultado

Disciplina Imunização homologada com 30 questões inéditas produzidas e importadas com sucesso, cobrindo a totalidade dos 5 tópicos reais e dos 13 subassuntos-guia de `02c`, com Gate Editorial 30/30 aprovado (incluindo checagem de duplicidade cruzada contra 5 disciplinas), e total da disciplina no banco em 50 questões.
