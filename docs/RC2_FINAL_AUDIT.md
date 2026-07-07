# RC2 — Auditoria Final

**Escopo:** todo o pacote de design da RC2 — Portal do Aluno (`RC1.2H`–`RC1.2L`, `PORTAL_ALUNO_FINAL_AUDIT_RC2`) e Portal Administrativo completo (`ADMIN_UX_AUDIT_RC2.1A` até `SUBSCRIPTIONS_REDESIGN_RC2.6B`), frente a `DESIGN_SYSTEM.md`, `UI_PREMIUM_GUIDELINES_RC2.0.md` e `DESIGN_PRINCIPLES.md`.
**Nota de escopo:** auditoria da especificação de design — nenhuma das telas foi implementada em código ainda. "Ajuste" aqui significa uma correção já identificável no papel, a incorporar na implementação.

---

## 1. Conformidade com os princípios (`DESIGN_PRINCIPLES.md`)

Confirmado em todo o pacote: nenhuma gamificação, IA, ranking, medalha ou funcionalidade fora do backlog foi proposta em nenhum dos ~25 documentos desta RC. Nenhuma regra de negócio, query, banco, API, permissão ou arquitetura foi alterada — verificado documento a documento durante a própria produção (`DESIGN_REVIEW_CHECKLIST.md` executado em cada um).

---

## 2. Achados novos desta síntese final

Só aparecem ao comparar o pacote inteiro de uma vez — nenhum documento individual os cobria isoladamente.

**01 — Botões de ícone com glifo corrigido para 16px, mas contêiner ainda `size="sm"`**
Em Importação, Pacotes, Versões, Distribuições e Assinaturas, cada documento corrigiu o ícone para `h-4 w-4`, mas nenhum corrigiu o botão de `size="sm"` para `size="icon"` — a área de clique real permanece abaixo do mínimo de 36×36px já exigido em `DESIGN_SYSTEM.md` §12.2.
**Bloqueante:** não. **Ajuste:** sim, em 5 documentos.

**02 — Histórico de Importações (11 colunas) nunca recebeu colunas prioritárias**
A regra de `UI_PREMIUM_GUIDELINES_RC2.0.md` Decisão 16 (tabelas com mais de 6 colunas) foi aplicada em Questões, Versões, Distribuições e Assinaturas, mas não na tabela mais densa do Admin.
**Bloqueante:** não. **Ajuste:** sim.

**03 — Histórico de Importações não migrou para `AdminTableBody`**
Recebeu uma composição própria de `Skeleton`/`EmptyState`/`PageErrorState` (`RC2.2A`/`RC2.2B`), enquanto os outros 10 módulos administrativos revisados foram todos direcionados para `AdminTableBody`. Resultado visual equivalente, mas é a única tabela do Admin fora do padrão de implementação.
**Bloqueante:** não. **Ajuste:** sim (uniformizar, ou documentar a exceção deliberadamente).

**04 — Estrutura do bloco de filtros não é uniforme entre famílias**
Importação e Questões envolvem os filtros num card com borda/padding; Taxonomia e a família Pipeline (Pacotes, Versões, Distribuições, Assinaturas) deixam os filtros soltos numa linha flex sem contêiner.
**Bloqueante:** não. **Ajuste:** sim — definir uma única estrutura para "bloco de filtros" em todo o Admin.

**05 — Rótulo do botão de salvar diverge entre famílias**
Taxonomia e Questões sempre dizem "Salvar"; a família Pipeline diferencia "Criar"/"Salvar" por modo. Nenhuma convenção única documentada.
**Bloqueante:** não. **Ajuste:** sim — escolher um padrão único.

---

## 3. Pendências já registradas (consolidadas, não bloqueantes)

Já documentadas em seus respectivos documentos — listadas aqui só para consolidar a contagem final, sem repetir a justificativa completa de cada uma:

| # | Pendência | Origem |
|---|---|---|
| 06 | Sidebar do Aluno sem item "Histórico" | `UXB-C1` / `PORTAL_ALUNO_FINAL_AUDIT_RC2` |
| 07 | "Nova sessão" com comportamento divergente por tela de origem | `PRODUCT_CONSISTENCY_REVIEW_RC1.2L` achado 04 |
| 08 | Cargo (formulário de Questões) sem filtro por curso | `QUESTIONS_FORM_REDESIGN_RC2.3C` achado 04 |
| 09 | "Limpar filtros" ausente na Lista de Questões | `QUESTIONS_FILTERS_REDESIGN_RC2.3B` achado 01 |
| 10 | Assuntos: filtro por disciplina só no formulário, não na listagem | `TOPICS_REDESIGN_RC2.4D` achado 05 |
| 11 | Versões: dropdown de Pacote herda filtro de curso da listagem | `VERSIONS_REDESIGN_RC2.5B` achado 07 |
| 12 | Assinaturas: registros legados sem `distribution_id` ocultos da listagem | `SUBSCRIPTIONS_REDESIGN_RC2.6B` achado 07 |
| 13 | Reindexação de letras/gabarito ao remover alternativa (bug de regra de negócio) | `RC1_AUDIT.md` M07 / `QUESTIONS_MODULE_FINAL_AUDIT_RC2.3` |
| 14 | Rótulos de seção propostos separadamente em `RC2.3B` e `RC2.3C` — alinhar tipografia antes da implementação | `QUESTIONS_MODULE_FINAL_AUDIT_RC2.3` |

Todas exigem, no máximo, uma consulta nova ou uma decisão de nomenclatura — nenhuma exige mudança de arquitetura.

---

## 4. Confirmado sem ajuste

- Estado vazio em `AdminTableBody` (texto na linha da tabela) é visualmente diferente do `EmptyState` do Portal do Aluno (ícone + moldura) — divergência intencional pelo contexto (linha de tabela vs. seção de página), não uma inconsistência.
- Botão "Cancelar" (`secondary` → `outline`) já foi corrigido de forma idêntica nos 4 módulos da família Pipeline — verificado consistente entre os 4 documentos.
- Ícones em 16px, `aria-label`, `<form onSubmit>`, radius único e `overflow-x-auto` já aplicados de forma equivalente em todos os módulos onde eram exigidos.

---

## 5. Parecer Final

- **Arquivo criado:** `docs/RC2_FINAL_AUDIT.md`
- **Ajustes encontrados:** 14 (5 novos desta síntese + 9 pendências já registradas e consolidadas aqui)
- **Bloqueantes:** 0

**RC2 APROVADA COM PEQUENOS AJUSTES**
