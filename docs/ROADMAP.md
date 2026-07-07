# SimulaPro — Roadmap Oficial

**Versão do documento:** RC1.2E  
**Última atualização:** julho/2026  
**Backlog detalhado:** [`PRODUCT_BACKLOG.md`](./PRODUCT_BACKLOG.md)  
**Histórico de entregas:** [`CHANGELOG.md`](./CHANGELOG.md)

---

## Visão por versão

```
v1.0 (RC1)     MVP estrutural — Admin produz, Aluno estuda
     ↓
RC1.1          Correções de fundação e homologação RC1
     ↓
RC1.2          Polimento pós-MVP (auditoria, UX, gaps funcionais)
     ↓
v1.1           Melhorias operacionais e qualidade
     ↓
v2.0           Plataforma competitiva (estatísticas, metas, design system)
```

---

## v1.0 — MVP (Release Candidate 1)

**Objetivo:** Entregar o ciclo completo *Admin produz e publica → Aluno estuda o comprado*.

**Tag de referência:** `v1.0.0-rc1-complete`

### Itens obrigatórios — Portal Administrativo

| Entrega | Status |
|---------|--------|
| Autenticação e gate admin | ✅ |
| Taxonomia completa (Cursos, Cargos, Bancas, Concursos, Disciplinas, Assuntos) | ✅ |
| CRUD Questões com filtros | ✅ |
| Importação (validar → staging → aplicar) | ✅ |
| Pacotes e Versões | ✅ |
| Publicação de versões | ✅ |
| Distribuições de conteúdo | ✅ |
| Assinaturas | ✅ |
| Exportação básica | ✅ |
| Dashboard e listagem de usuários | ✅ |

### Itens obrigatórios — Portal do Aluno

| Entrega | Status |
|---------|--------|
| Dashboard com estatísticas básicas | ✅ |
| Criação de sessão de estudo | ✅ |
| Resolução de questões (Estudo e Prova) | ✅ |
| Favoritos, Revisar depois, Apenas erradas | ✅ |
| Atalhos de filtro no dashboard | ✅ |

### Itens obrigatórios — Plataforma

| Entrega | Status |
|---------|--------|
| Supabase Auth + RLS | ✅ |
| TanStack Start + React Query + Shadcn UI | ✅ |
| Auditoria `logEvent` | ✅ |
| Landing e `/auth` | ✅ |

---

## RC1.1 — Correções de fundação

**Objetivo:** Estabilizar ambiente RC1 e corrigir bloqueios de homologação.

| Entrega | Status |
|---------|--------|
| Migração Supabase para projeto RC1 (`ddgpkijytvagmabtttor`) | ✅ |
| Correção redirect admin × aluno (`AppShell`) | ✅ |
| Colunas `slug` em taxonomia (migration) | ✅ |
| Histórico de importação (fix embed `profiles`) | ✅ |
| Listagem de assinaturas (fix relacionamento) | ✅ |
| Rotas de estudo com `<Outlet />` | ✅ |
| Atalhos padronizados no dashboard (Favoritas, Revisar, Erradas) | ✅ |
| Arquivos de exemplo de importação | ✅ |

---

## RC1.2 — Polimento pós-MVP

**Objetivo:** Fechar gaps funcionais e de UX identificados na homologação, sem alterar arquitetura.

### Concluído

| Sprint | Entrega | Status |
|--------|---------|--------|
| **RC1.2A** | Auditoria funcional (`RC1_AUDIT.md`) | ✅ |
| **RC1.2B** | Resultado detalhado da sessão | ✅ |
| **RC1.2C** | Histórico completo de sessões (`/app/history`) | ✅ |
| **RC1.2D** | Auditoria UX/UI (`UX_AUDIT_RC1.2D.md`) | ✅ |
| **RC1.2E** | Product Backlog, Roadmap e Changelog | ✅ |
| **RC2.0** | Princípios de design (`DESIGN_PRINCIPLES.md`) | ✅ |

### Pendente (RC1.2)

| Sprint | Entrega | Prioridade |
|--------|---------|------------|
| **RC1.2D** | Exportação profissional (XLSX, CSV, JSON, filtros, grandes volumes) | Alta |
| **RC1.2D** | Qualidade: console, toasts, performance de consultas | Média |
| Correções da auditoria | `show_answers: final`, dependências na exclusão, navegação ativa | Alta / Média |

---

## v1.1 — Melhorias operacionais

**Objetivo:** Consolidar operação admin, qualidade de código e experiência refinada.

| Entrega | Backlog | Prioridade |
|---------|---------|------------|
| Exportação profissional (se não concluída em RC1.2) | ADM-019 | Alta |
| Gestão de roles na UI | ADM-021 | Média |
| Leitura de logs admin | ADM-022 | Média |
| Testes automatizados | PLT-016 | Média |
| Documentação do banco | PLT-017 | Baixa |
| Pausar sessão de estudo | PA-024 | Baixa |
| Padronização visual pós-auditoria UX | PLT-011 | Média |

---

## v2.0 — Grandes funcionalidades

**Objetivo:** Transformar o SimulaPro em plataforma premium competitiva, alinhada a [`DESIGN_PRINCIPLES.md`](./DESIGN_PRINCIPLES.md).

### Portal do Aluno

| Entrega | Backlog |
|---------|---------|
| Estatísticas avançadas (banca, disciplina, assunto, período) | PA-017 |
| Metas diárias de estudo | PA-018 |
| Calendário de estudos | PA-019 |
| Sequência (streak) de dias estudados | PA-020 |
| Gráficos de evolução | PA-021 |
| Ranking pessoal (evolução individual) | PA-022 |
| Simulados completos com cronômetro | PA-023 |

### Plataforma e design

| Entrega | Backlog |
|---------|---------|
| Design system consolidado (pós Claude Design) | PLT-012 |
| Performance e escala em import/export | ADM-020, PLT-015 |

### IA (futuro)

| Entrega | Backlog |
|---------|---------|
| IA generativa / explicações assistidas | IA-001, IA-002 |
| Recomendação de estudo | IA-003 |

### Comercial (futuro)

| Entrega | Backlog |
|---------|---------|
| Checkout e pagamentos | COM-002 |
| Renovação automática | COM-003 |
| Planos e precificação | COM-004 |

---

## Critérios de transição entre versões

| De → Para | Critério |
|-----------|----------|
| RC1.2 → v1.1 | Itens pendentes de RC1.2 homologados; exportação profissional entregue |
| v1.1 → v2.0 | Design system aplicado; backlog v2.0 priorizado com base em uso real |
| Qualquer release | Homologação manual → commit → push → tag (conforme `CURSOR_RULES.md`) |

---

## Fora do roadmap (explicitamente)

Conforme visão de produto e princípios de design — **não planejado**:

- XP, medalhas, moedas, ranking mundial, avatar, loja
- Gamificação e animações excessivas
- Perfis além de Admin e Aluno

---

*Roadmap alinhado ao estado do repositório em julho/2026. Atualizar a cada release homologada.*
