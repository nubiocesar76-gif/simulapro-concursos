# SimulaPro — Product Backlog Oficial

**Versão do documento:** RC1.2E  
**Última atualização:** julho/2026  
**Referências:** [`00-VISAO-GERAL.md`](./00-VISAO-GERAL.md) · [`DESIGN_PRINCIPLES.md`](./DESIGN_PRINCIPLES.md) · [`RC1_AUDIT.md`](./RC1_AUDIT.md)

---

## Legenda

| Campo | Valores |
|-------|---------|
| **Prioridade** | Alta · Média · Baixa |
| **Status** | Concluído · Em progresso · Pendente · Planejado |
| **Versão** | Release prevista (`v1.0`, `RC1.2`, `v1.1`, `v2.0`, etc.) |

---

## Portal do Aluno

| ID | Funcionalidade | Descrição | Prioridade | Status | Versão |
|----|----------------|-----------|------------|--------|--------|
| PA-001 | Dashboard do aluno | Cards de estatísticas, continuar estudo, distribuições, últimas sessões e desempenho por disciplina | Alta | Concluído | v1.0 |
| PA-002 | Listagem de distribuições | Exibir apenas distribuições com assinatura ativa e vigente | Alta | Concluído | v1.0 |
| PA-003 | Criação de sessão de estudo | Wizard: distribuição → configurar (modo, quantidade, ordem, mostrar respostas) → criar sessão | Alta | Concluído | v1.0 |
| PA-004 | Resolução de questões | Iniciar, responder, navegar, finalizar sessão com correção e tempo por questão | Alta | Concluído | v1.0 |
| PA-005 | Modos de estudo | Estudo, Prova, Favoritos, Revisar depois, Apenas erradas | Alta | Concluído | v1.0 |
| PA-006 | Favoritar questão | Marcar/desmarcar favorito durante a resolução (`study_session_questions.favorite`) | Alta | Concluído | v1.0 |
| PA-007 | Revisar depois | Marcar questão para revisão posterior (`review_later`) | Alta | Concluído | v1.0 |
| PA-008 | Atalhos de filtro no dashboard | Iniciar sessão Favoritas / Revisar depois / Apenas erradas a partir do dashboard | Alta | Concluído | RC1.1 |
| PA-009 | Resultado detalhado da sessão | Resumo (acertos, erros, %, tempo), lista de questões, revisão e ações pós-sessão | Alta | Concluído | RC1.2 |
| PA-010 | Histórico completo de sessões | Página `/app/history` com tabela paginada, filtros, pesquisa e ações por linha | Alta | Concluído | RC1.2 |
| PA-011 | Continuar última sessão | Card no dashboard para sessão `IN_PROGRESS` | Média | Concluído | v1.0 |
| PA-012 | Estatísticas básicas | Questões respondidas, aproveitamento, sessões concluídas, tempo total | Alta | Concluído | v1.0 |
| PA-013 | Desempenho por disciplina | Tabela ordenada por percentual (menor → maior) | Média | Concluído | v1.0 |
| PA-014 | Respeitar `show_answers: final` | Ocultar feedback durante a sessão quando configurado para o final | Alta | Pendente | RC1.2 |
| PA-015 | Alinhar contadores dos atalhos de filtro | Contagem global vs. distribuições disponíveis no dashboard | Média | Pendente | RC1.2 |
| PA-016 | Navegação ativa em sub-rotas | Destacar item "Estudo" em `/app/study/{id}` e histórico na sidebar | Média | Pendente | RC1.2 |
| PA-017 | Estatísticas avançadas | Por banca, disciplina, assunto e período | Alta | Planejado | v2.0 |
| PA-018 | Metas diárias de estudo | Meta configurável com acompanhamento de progresso | Média | Planejado | v2.0 |
| PA-019 | Calendário de estudos | Visualização de sessões e atividade por data | Média | Planejado | v2.0 |
| PA-020 | Sequência (streak) | Dias consecutivos estudados | Média | Planejado | v2.0 |
| PA-021 | Gráficos de evolução | Evolução de aproveitamento e volume ao longo do tempo | Média | Planejado | v2.0 |
| PA-022 | Ranking pessoal | Comparativo do desempenho do aluno consigo mesmo (não ranking mundial) | Baixa | Planejado | v2.0 |
| PA-023 | Simulados completos com cronômetro | Sessão tipo prova com tempo global e experiência dedicada | Alta | Planejado | v2.0 |
| PA-024 | Pausar sessão | Suporte ao status `PAUSED` na UI | Baixa | Planejado | v1.1 |

---

## Portal Administrativo

| ID | Funcionalidade | Descrição | Prioridade | Status | Versão |
|----|----------------|-----------|------------|--------|--------|
| ADM-001 | Dashboard admin | Cards de contagem, questões publicadas, importação e última publicação | Alta | Concluído | v1.0 |
| ADM-002 | CRUD Cursos | Criar, editar, excluir, buscar, paginar com bloqueio por dependências | Alta | Concluído | v1.0 |
| ADM-003 | CRUD Cargos | Taxonomia vinculada a curso | Alta | Concluído | v1.0 |
| ADM-004 | CRUD Bancas | Nome e sigla com unicidade | Alta | Concluído | v1.0 |
| ADM-005 | CRUD Concursos | Vinculado a banca | Alta | Concluído | v1.0 |
| ADM-006 | CRUD Disciplinas | Taxonomia de conteúdo | Alta | Concluído | v1.0 |
| ADM-007 | CRUD Assuntos | Vinculado a disciplina | Alta | Concluído | v1.0 |
| ADM-008 | CRUD Questões | CRUD completo com filtros, alternativas dinâmicas e metadados | Alta | Concluído | v1.0 |
| ADM-009 | Importação de questões | Validar → salvar lote → aplicar/cancelar (CSV, XLSX, JSON) | Alta | Concluído | v1.0 |
| ADM-010 | Histórico de importação | Listagem de lotes com status e relatório | Alta | Concluído | RC1.1 |
| ADM-011 | Exemplos de importação | Arquivos oficiais em `docs/import-examples/` | Média | Concluído | RC1.1 |
| ADM-012 | CRUD Pacotes | Por curso, slug, status, bloqueio de exclusão | Alta | Concluído | v1.0 |
| ADM-013 | CRUD Versões | Numeração semântica, status DRAFT/READY/PUBLISHED | Alta | Concluído | v1.0 |
| ADM-014 | Publicação de versões | Publicar versão READY com auditoria | Alta | Concluído | v1.0 |
| ADM-015 | CRUD Distribuições | Vincular versão publicada, ativar/desativar, datas opcionais | Alta | Concluído | v1.0 |
| ADM-016 | CRUD Assinaturas | Usuário + distribuição, ativar/desativar, validação de datas | Alta | Concluído | v1.0 |
| ADM-017 | Listagem de usuários | Perfis e roles (somente leitura) | Média | Concluído | v1.0 |
| ADM-018 | Exportação básica | Download CSV/JSON/"Excel" por tabela (`/admin/export`) | Média | Concluído | v1.0 |
| ADM-019 | Exportação profissional | XLSX real, CSV, JSON, filtros e suporte a grandes volumes | Alta | Pendente | RC1.2 |
| ADM-020 | Importação em escala | Homologar e otimizar lotes de 100, 500 e 1.000 questões | Alta | Pendente | RC1.2 |
| ADM-021 | Promover usuário a admin (UI) | Interface para gestão de roles sem SQL manual | Média | Planejado | v1.1 |
| ADM-022 | Logs administrativos (leitura) | Tela para consultar eventos `logs` | Média | Planejado | v1.1 |
| ADM-023 | Configurações admin | Página de configurações do sistema | Baixa | Planejado | v1.1 |
| ADM-024 | Padronizar `AdminTableBody` | Migrar módulos admin restantes para componente compartilhado | Baixa | Pendente | RC1.2 |
| ADM-025 | Corrigir verificação de dependências na exclusão | Tratar erro de contagem RLS/rede como bloqueio (auditoria C03) | Alta | Pendente | RC1.2 |

---

## Plataforma

| ID | Funcionalidade | Descrição | Prioridade | Status | Versão |
|----|----------------|-----------|------------|--------|--------|
| PLT-001 | Autenticação login/cadastro | Supabase Auth com redirect por role | Alta | Concluído | v1.0 |
| PLT-002 | Gate de rotas autenticadas | `_authenticated`, redirect para `/auth` | Alta | Concluído | v1.0 |
| PLT-003 | AppShell e navegação | Sidebar colapsável, logout, guard admin | Alta | Concluído | v1.0 |
| PLT-004 | Redirecionamento admin × aluno | Admin não redirecionado indevidamente; student bloqueado em `/admin` | Alta | Concluído | RC1.1 |
| PLT-005 | RLS e roles | `admin` / `student`, função `has_role`, policies por tabela | Alta | Concluído | v1.0 |
| PLT-006 | Auditoria `logEvent` | Registro de eventos em operações críticas | Alta | Concluído | v1.0 |
| PLT-007 | Migrations e schema RC1 | `study_sessions`, `content_distributions`, taxonomia com `slug` | Alta | Concluído | RC1.1 |
| PLT-008 | Configuração Supabase RC1 | Cliente e `.env` alinhados ao projeto correto | Alta | Concluído | RC1.1 |
| PLT-009 | Componentes compartilhados UX | `EmptyState`, `PageErrorState`, `AdminTableBody` | Média | Concluído | v1.0 |
| PLT-010 | Auditoria funcional RC1.2A | Documento `RC1_AUDIT.md` com 54 achados | Média | Concluído | RC1.2 |
| PLT-011 | Auditoria UX RC1.2D | Documento `UX_AUDIT_RC1.2D.md` | Média | Concluído | RC1.2 |
| PLT-012 | Princípios de design RC2.0 | Documento `DESIGN_PRINCIPLES.md` | Média | Concluído | RC2.0 |
| PLT-013 | Eliminar warnings do console | Remover `console.log` debug e ruídos em fluxos críticos | Média | Pendente | RC1.2 |
| PLT-014 | Padronizar toasts e mensagens de erro | Consistência entre módulos admin e aluno | Média | Pendente | RC1.2 |
| PLT-015 | Performance de consultas | Revisar queries pesadas (export, import, dashboard) | Média | Pendente | RC1.2 |
| PLT-016 | Testes automatizados | Suite de testes unitários e/ou E2E | Média | Planejado | v1.1 |
| PLT-017 | Documentação do banco | `docs/02-BANCO-DE-DADOS.md` | Baixa | Planejado | v1.1 |
| PLT-018 | Landing page | Página pública `/` | Média | Concluído | v1.0 |
| PLT-019 | Tag e release RC1 | `v1.0.0-rc1-complete` homologada no GitHub | Alta | Concluído | RC1 |

---

## IA

| ID | Funcionalidade | Descrição | Prioridade | Status | Versão |
|----|----------------|-----------|------------|--------|--------|
| IA-001 | IA generativa para questões | Geração ou enriquecimento de conteúdo por IA | Baixa | Planejado | v2.0 |
| IA-002 | Explicações assistidas | Sugestões de explicação ou dicas contextuais na resolução | Média | Planejado | v2.0 |
| IA-003 | Recomendação de estudo | Sugerir disciplinas/assuntos com base no desempenho | Média | Planejado | v2.0 |

> **Nota:** IA está explicitamente fora do escopo do MVP ([`00-VISAO-GERAL.md`](./00-VISAO-GERAL.md)). Itens acima são backlog futuro, sem implementação no código atual.

---

## Comercial

| ID | Funcionalidade | Descrição | Prioridade | Status | Versão |
|----|----------------|-----------|------------|--------|--------|
| COM-001 | Gestão manual de assinaturas | Admin cria e gerencia assinaturas por usuário e distribuição | Alta | Concluído | v1.0 |
| COM-002 | Checkout e pagamentos | Integração com gateway de pagamento | Alta | Planejado | v2.0 |
| COM-003 | Renovação automática | Ciclo de renovação de assinatura | Média | Planejado | v2.0 |
| COM-004 | Planos e precificação | Catálogo de planos comerciais na plataforma | Média | Planejado | v2.0 |
| COM-005 | Faturamento e notas | Emissão de documentos fiscais | Baixa | Planejado | v2.0 |

> **Nota:** Pagamentos estão fora do escopo do MVP. Assinaturas são gerenciadas manualmente pelo Admin.

---

## Resumo por status

| Status | Quantidade |
|--------|------------|
| Concluído | 52 |
| Pendente | 11 |
| Planejado | 18 |
| Em progresso | 0 |

---

*Backlog derivado do código atual, documentação existente e discussões das sprints RC1 → RC2.0. Não inclui funcionalidades inventadas.*
