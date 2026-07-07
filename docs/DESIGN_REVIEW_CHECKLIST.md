# DESIGN_REVIEW_CHECKLIST

**Papel:** checklist oficial de revisão de Product Design do SimulaPro, aplicado a todo documento de redesign antes de qualquer implementação no Cursor.

---

# Objetivo

Este checklist garante que toda proposta de Product Design preserve a consistência visual e de experiência já estabelecida, reduza retrabalho ao antecipar conflitos antes da implementação, e preserve a arquitetura e as regras de negócio existentes do SimulaPro.

---

# Checklist obrigatório

## Arquitetura

- [ ] Não altera arquitetura existente.
- [ ] Não cria acoplamento entre módulos.
- [ ] Reutiliza componentes compartilhados.
- [ ] Não cria componentes específicos quando existe um genérico.

## Regras de negócio

- [ ] Não altera regras de negócio.
- [ ] Não altera banco de dados.
- [ ] Não altera queries.
- [ ] Não altera APIs.
- [ ] Não altera permissões.

## Design System

- [ ] Respeita `DESIGN_SYSTEM.md`.
- [ ] Respeita `UI_PREMIUM_GUIDELINES_RC2.0.md`.
- [ ] Mantém tipografia oficial.
- [ ] Mantém espaçamentos oficiais.
- [ ] Mantém tokens oficiais.
- [ ] Mantém componentes oficiais.

## UX

- [ ] Não cria funcionalidades fora do backlog.
- [ ] Não duplica ações.
- [ ] Não aumenta complexidade.
- [ ] Mantém consistência com módulos existentes.
- [ ] Estados vazios consistentes.
- [ ] Estados de erro consistentes.
- [ ] Responsividade preservada.

## Implementação

- [ ] Documento suficientemente específico para implementação.
- [ ] Não deixa decisões importantes para interpretação do Cursor.
- [ ] Não gera retrabalho em módulos futuros.

---

# Critério de aprovação

Um documento de Product Design somente poderá ser considerado aprovado quando todos os itens deste checklist forem atendidos.
