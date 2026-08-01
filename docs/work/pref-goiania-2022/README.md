- Nome do concurso: Concurso Público Edital 01/2020 — Prefeitura Municipal de Goiânia, Cronograma E (prova aplicada em 26/06/2022)
- Órgão: Prefeitura Municipal de Goiânia
- Banca: Centro de Seleção da Universidade Federal de Goiás (CS-UFG)
- Cargo: S614 — Especialista em Saúde — Enfermeiro Geral
- Status: **CONCLUÍDA** — 48 questões válidas homologadas (Nível de Validação A)
  ☑ Edital
  ☑ Prova
  ☑ Gabarito preliminar e definitivo
  ☑ CSV
  ☑ questions.json
  ☑ Seed
  ☑ Validado

## Nota (2026-07-24)

Este README ficou parado no rascunho inicial da FASE 1 (achados/pendências abaixo,
histórico). A prova foi concluída integralmente (ver `status.json`: estágios
REGISTERED → VALIDATED → TEXT_EXTRACTED → TAXONOMY_EXTENDED → SEEDED →
AUDIT_APPROVED → PUBLISHED, todos já registrados desde 2026-07-24) e confirmada no
banco: 48 questões (50 − 2 anuladas: Q08, Q26), `board=centro-de-selecao-da-universidade-federal-de-goias`,
`contest=concurso-publico-prefeitura-municipal-de-goiania-edital-001-2020`. Apenas
este arquivo não tinha sido atualizado — corrigido durante a reconciliação
catálogo × banco (ver `docs/BUGS.md` BUG-006).

## Achados iniciais (FASE 1, histórico)

- Portal oficial `centrodeselecao.ufg.br/2022/concurso-goiania/` está ATIVO (confirmado).
- Concurso teve múltiplos cronogramas (A a E) com datas de prova distintas — cargo Enfermeiro aparece associado ao Cronograma E (resultado final citando "S614 - Especialista em Saúde - Enfermeiro Geral").
- Editais consolidados disponíveis na seção "EDITAIS E ANEXOS" (Edital 01/2020 consolidado pelo 3º Aditivo; Anexo I por cronograma).
- Gabarito preliminar já catalogado em pesquisa anterior: `https://centrodeselecao.ufg.br/2022/concurso-goiania/sistema/provas_gabaritos/gabarito_preliminar/ESPECIALISTA-SAUDE-ENFERMEIRO-INTENSIVISTA-NEONATOLOGIA-PEDIATRIA-GABARITO.pdf` (ainda não verificado se está no ar).

## Pendente (continuação da FASE 1)

- Confirmar qual Cronograma (A–E) contém a prova objetiva do cargo Enfermeiro Geral (o nome do arquivo de gabarito já localizado sugere um cargo combinado "Intensivista/Neonatologia/Pediatria" — checar se "Enfermeiro Geral" tem prova própria separada).
- Baixar e validar: edital de abertura, prova objetiva, gabarito preliminar e definitivo.
- Verificar retificações e anulações.
- Classificar nível de validação (A/B/C).
