# Taxonomia V1 — Congelamento Oficial

**Versão operacional:** 1.2.1  
**Data de homologação:** 2026-07-14  
**Fonte canônica:** `docs/seeds/taxonomy.json`  
**Índice exportado:** `tools/taxonomy-engine/taxonomy.index.json`

---

## Declaração

A **Taxonomia V1** está **homologada e congelada** após a Sprint V1.2.1 (correções críticas da auditoria `docs/editorial/auditoria/taxonomy-v1.2-audit.md`).

Validação final:

- Taxonomy Engine: **0 erros estruturais**
- Classification Engine: **0 erros** (80/80 questões SESACRE 2022)
- 0 referências quebradas
- 0 assuntos órfãos sob disciplinas legadas ativas
- 0 disciplinas `ACTIVE` sem assuntos

---

## Contagens homologadas (V1.2.1)

| Entidade | Quantidade |
|---|---|
| Disciplinas | 30 |
| Assuntos (topics) | 210 |
| Bancas | 22 |
| Concursos | 18 |

---

## Alterações permitidas (pós-congelamento)

Somente as seguintes evoluções são autorizadas **sem auditoria formal**:

1. **Novos concursos** — cadastro de `contests[]` vinculados a bancas existentes.
2. **Novos assuntos** — inclusão de `topics[]` em disciplinas já homologadas, respeitando slugs únicos no escopo da disciplina.
3. **Novas bancas** — cadastro em `boards[]` com slug kebab-case único.

---

## Alterações proibidas

Sem **auditoria formal** e aprovação explícita, é **proibido**:

1. **Trocar slugs** de disciplinas, assuntos, bancas ou concursos já homologados.
2. **Trocar IDs** editoriais ou identificadores estáveis usados em imports.
3. **Reorganizar disciplinas** (fusão, split, renomeação de disciplina primária).
4. **Mover assuntos** entre disciplinas sem registro de auditoria e plano de remapeamento de questões.

Disciplinas legadas marcadas `INACTIVE` devem permanecer no seed para retrocompatibilidade de import; não excluir.

---

## Modelo regional (Conhecimentos Gerais Regionais)

Disciplina única reutilizável: `conhecimentos-gerais-regionais`

Assuntos genéricos (não duplicar por UF):

| Assunto | Slug |
|---|---|
| História Regional | `historia-regional` |
| Geografia Regional | `geografia-regional` |
| Economia e Sociedade Regional | `economia-e-sociedade-regional` |
| Instituições e Organização Regional | `instituicoes-e-organizacao-regional` |

**Regiões homologadas inicialmente:**

| Região | Slug de região | Observação |
|---|---|---|
| Acre | `acre` | Classificação via assuntos genéricos + contexto do concurso |
| Distrito Federal | `distrito-federal` | Disciplina legada `conhecimentos-gerais-sobre-o-distrito-federal` permanece `INACTIVE` para imports existentes |

**Expansão futura** (Amazonas, Pará, Bahia, etc.): homologar novo slug de região na metadata do concurso; **não** criar disciplina por Estado.

---

## Referências

- Auditoria V1.2: `docs/editorial/auditoria/taxonomy-v1.2-audit.md`
- Editorial normalizado: `docs/editorial/normalized/`
- Regras de classificação: `docs/editorial/classification/`
