# Auditoria Taxonômica V1.2 — SimulaPro

**Data:** 2026-07-14  
**Escopo:** `docs/seeds/taxonomy.json` (fonte operacional) × `docs/editorial/normalized/` (fonte editorial V1.1) × corpus de questões (`docs/seeds/questions.json`, 80 questões SESACRE 2022)  
**Tipo:** Somente leitura — nenhuma alteração aplicada  
**Versão alvo:** Taxonomia V1.2 (qualidade e alinhamento pós-homologação)

---

## Status pós-correção V1.2.1 (2026-07-14)

**Sprint V1.2.1 concluída.** Correções críticas aplicadas em `docs/seeds/taxonomy.json` v1.2.1.  
Taxonomia V1 congelada — ver `docs/TAXONOMY_V1_FREEZE.md`.

| Item | Status |
|---|---|
| C-01 — D07/D25 sem assuntos | **RESOLVIDO** |
| C-02 — Fusões V1.1 não aplicadas | **RESOLVIDO** |
| C-04 — Duplicidade SAE × Fundamentos | **RESOLVIDO** |
| C-05 — Disciplina regional replicável | **RESOLVIDO** |
| C-03 — Divergência Editorial × Operacional | Pendente (Sprint V1.2.2) |
| I-05 — UTI vazia | **RESOLVIDO** (D25-A01..A04) |
| I-06 — Anatomia classificável | **RESOLVIDO** (`INACTIVE`) |
| M-05 — Template regional | **RESOLVIDO** |

**Validação:** Taxonomy Engine 0 erros estruturais · Classification Engine 0 erros (80/80 questões).

---

## Resumo executivo

| Métrica | Valor |
|---|---|
| Disciplinas no seed operacional | 29 (todas `ACTIVE`) |
| Disciplinas editoriais V1.1 ativas | 21 |
| Assuntos operacionais (`topics[]`) | 192 |
| Assuntos editoriais normalizados | 107 |
| Gap estrutural assuntos | **+85** no seed vs editorial |
| Pares disciplina/assunto usados no corpus | 50 (de 192 possíveis = **26%**) |
| Disciplinas usadas no corpus | 14 (de 29 = **48%**) |
| **Total de problemas catalogados** | **38** |

---

## Problemas críticos

### C-01 — Disciplinas prioritárias sem nenhum assunto

| Disciplina | Slug | Assuntos no seed | Assuntos editoriais (V1.1) |
|---|---|---|---|
| Enfermagem Médico-Cirúrgica | `enfermagem-medico-cirurgica` | **0** | 9 (D07-A01..A04 + D20-A01..A05 reparentados) |
| Terapia Intensiva (UTI) | `terapia-intensiva-uti` | **0** | 4 (D25-A01..A04) |

**Impacto:** Impossível classificar questões de DCNT, oncologia clínica, monitorização invasiva e VM conforme regras editoriais V1.1. Homologação SESACRE 2022 contornou isso mapeando clínica adulta para `fundamentos-de-enfermagem` e `saude-do-adulto` (legado).  
**Recomendação:** Reparentar os 11 assuntos de `saude-do-adulto` para `enfermagem-medico-cirurgica` e criar/sincronizar os 9 assuntos D07 do editorial; criar 4 assuntos D25 para UTI.  
**Prioridade:** **ALTA**  
**Status V1.2.1:** **RESOLVIDO** — 9 assuntos D07 criados; 11 assuntos reparentados de `saude-do-adulto`; 4 assuntos D25 em UTI.

---

### C-02 — Fusões V1.1 não aplicadas no `taxonomy.json`

A arquitetura editorial V1.1 (documento `V1.1-arquitetura-corrigida.md`) define reparentamento de assuntos, mas o seed operacional **mantinha 5 disciplinas legadas `ACTIVE` com 21 assuntos filhos**:

| Disciplina legada | Slug | Destino V1.1 | Assuntos pendentes |
|---|---|---|---|
| Controle de Infecção Hospitalar | `controle-de-infeccao-hospitalar` | `biosseguranca` | 3 |
| Imunização | `imunizacao` | `saude-coletiva` | 4 |
| Políticas Públicas de Saúde | `politicas-publicas-de-saude` | `legislacao-do-sus` | 1 |
| Saúde do Adulto | `saude-do-adulto` | `enfermagem-medico-cirurgica` | 11 |
| Anatomia e Fisiologia | `anatomia-fisiologia` | `MATERIAL_DE_APOIO` | 2 |

**Impacto:** Classification Engine bloqueia 4 slugs legados (`rules.ts` → `legacySubjectSlugs`), mas a taxonomia ainda os expõe como válidos no convert/seed. Classificadores humanos veem disciplinas “fantasma”. IA futura receberá sinais conflitantes.  
**Recomendação:** Sprint de sincronização seed↔editorial: reparentar assuntos, marcar disciplinas legadas como `INACTIVE`/`MERGED` (metadado), manter slugs para retrocompatibilidade de import.  
**Prioridade:** **ALTA**  
**Status V1.2.1:** **RESOLVIDO** — 19 assuntos reparentados; 6 disciplinas legadas marcadas `INACTIVE` (5 fusões + anatomia).

---

### C-03 — Divergência estrutural Editorial (107) × Operacional (192)

O `02-assuntos.json` editorial define **107 assuntos** organizados por ID (Dxx-Ayy), enquanto `taxonomy.json` possui **192 topics** com granularidade e nomenclatura distintas.

Exemplos de drift:

| Disciplina | Editorial V1.1 | Taxonomia operacional |
|---|---|---|
| Administração (D01) | Planejamento, Liderança, Gestão da Qualidade… | ESF, Enfermeiro Gestor, Hospital-Dia… |
| Biossegurança (D03) | Proteção Individual, Resíduos, Exposição Ocupacional + 4 reparentados | Resíduos RSS, EPI, Limpeza/desinfecção (sem CCIH/IRAS como no editorial) |
| Fundamentos (D10) | ~8 assuntos editoriais | **35 assuntos** operacionais (hipergranular) |

**Impacto:** Documentação editorial, Classification Engine e convert validam contra slugs operacionais — não contra IDs editoriais. Curadoria humana e IA não têm mapa 1:1 confiável.  
**Recomendação:** Definir camada de alias (`editorialId` → `slug`) no manifest; consolidar Fundamentos para ≤12 assuntos núcleo + tags futuras.  
**Prioridade:** **ALTA**

---

### C-04 — Duplicidade SAE × Fundamentos

Assuntos de Processo/SAE existem **dentro de Fundamentos** e também como disciplina isolada:

| Slug | Em Fundamentos | Em SAE |
|---|---|---|
| `processo-de-enfermagem` | ✓ | — |
| `sistematizacao-da-assistencia-de-enfermagem-sae` | ✓ | — |
| `classificacao-de-intervencoes-de-enfermagem-nic` | — | ✓ (único assunto da disciplina SAE) |

O próprio `01-disciplinas.json` (D24) registra: *“Duplicidade estrutural no taxonomy.json legado… pendente de correção”*.

**Impacto:** Violação da regra R-019 (SAE vs Fundamentos). Classificadores divergem; estatísticas por disciplina ficam distorcidas.  
**Recomendação:** Remover `processo-de-enfermagem` e `sistematizacao-da-assistencia-de-enfermagem-sae` de Fundamentos; expandir SAE para assuntos D24-A01..A05 do editorial.  
**Prioridade:** **ALTA**  
**Status V1.2.1:** **RESOLVIDO** — removidos de Fundamentos; SAE expandida (D24-A01..A04 + NIC).

---

### C-05 — Ausência de disciplina regional replicável

Existe apenas `conhecimentos-gerais-sobre-o-distrito-federal` (2 assuntos). Não há template para Acre, Amazonas, Pará etc.

**Impacto:** Confirmado na homologação SESACRE 2022 — bloco História/Geografia do Acre (Q11–20) não classificável sem proxy inadequado. Escalabilidade para concursos estaduais comprometida.  
**Recomendação:** Padrão exam-specific regional: `conhecimentos-gerais-sobre-{uf}` com assuntos genéricos (História, Geografia, Economia, Instituições) — não duplicar por município.  
**Prioridade:** **ALTA**  
**Status V1.2.1:** **RESOLVIDO** — disciplina `conhecimentos-gerais-regionais` criada; regiões Acre e DF homologadas; DF legado `INACTIVE`.

---

## Problemas importantes

### I-01 — Cargos duplicados semanticamente

| Slug | Nome |
|---|---|
| `tecnico-enfermagem` | Técnico de Enfermagem |
| `tecnico-em-enfermagem` | Técnico em Enfermagem |

**Impacto:** Futuro currículo Técnico de Enfermagem exigirá filtros por cargo; duplicata gera imports divergentes e estatísticas partidas.  
**Recomendação:** Unificar em um slug canônico; manter alias no Taxonomy Engine.  
**Prioridade:** **MÉDIA**

---

### I-02 — Disciplinas exam-specific sem uso no corpus atual

12 disciplinas ativas **nunca usadas** nas 80 questões importadas (corpus ainda pequeno, mas estruturalmente ociosas):

`biosseguranca`, `enfermagem-medico-cirurgica`, `farmacologia`, `raciocinio-logico`, `saude-do-idoso`, `seguranca-do-paciente`, `sistematizacao-da-assistencia-de-enfermagem-sae`, `terapia-intensiva-uti`, `legislacao-aplicada-a-ebserh`, `legislacao-municipal-e-institucional`, `politicas-publicas-de-saude`, `saude-do-adulto`

**Impacto:** Taxonomia “inchada” dificulta busca e autocomplete; IA tende a sugerir disciplinas raras. Nem todas são erro — várias são prova-específicas aguardando conteúdo.  
**Recomendação:** Marcar `usageTier`: CORE | EXAM_SPECIFIC | LEGACY; ocultar LEGACY na UI de classificação.  
**Prioridade:** **MÉDIA**

---

### I-03 — 134 assuntos nunca utilizados (70% do total)

De 192 assuntos, apenas **58** aparecem no corpus atual (80 questões SESACRE + referências parciais).

**Impacto:** Baixo para produto inicial; alto para manutenção e curadoria. Lista de autocomplete com 70% ruído.  
**Recomendação:** Não excluir — priorizar por `frequencia` editorial; implementar ranking no Taxonomy Engine search.  
**Prioridade:** **MÉDIA**

---

### I-04 — Assuntos hiper-específicos (escalabilidade limitada)

**16 assuntos** amarrados a ente/municipio/edital específico:

- `legislacao-municipal-e-institucional`: Curitiba, Recife, Pará, DF (8 assuntos)
- `legislacao-aplicada-a-ebserh`: 5 assuntos EBSERH
- `conhecimentos-gerais-sobre-o-distrito-federal`: 2 assuntos
- `saude-da-mulher/ii-plano-distrital-de-politicas-para-mulheres-df`

**Impacto:** Modelo “1 assunto = 1 lei municipal” não escala para centenas de concursos. Manutenção manual inviável.  
**Recomendação:** Agrupar em assuntos genéricos (`legislacao-municipal-saude`, `estatuto-servidor-estadual`) com metadata `scope: {entity, uf, municipio}` para IA e filtros.  
**Prioridade:** **MÉDIA**

---

### I-05 — UTI sem assuntos; conteúdo crítico em Urgência/Farmacologia

`terapia-intensiva-uti` está vazia, mas `urgencia-e-emergencia` concentra 9 assuntos incluindo emergências que editorial coloca em UTI (VM, drogas vasoativas estão em `farmacologia/farmacos-vasoativos-e-inotropicos`).

**Impacto:** Fronteira Urgência ↔ UTI ↔ Farmacologia permanece ambígua para classificadores e IA.  
**Recomendação:** Implementar D25-A01..A04; mover `farmacos-vasoativos` para UTI ou criar cross-reference editorial (não duplicar slug).  
**Prioridade:** **MÉDIA**  
**Status V1.2.1:** **RESOLVIDO** — D25-A01..A04 implementados.

---

### I-06 — Anatomia e Fisiologia ainda classificável

Disciplina `anatomia-fisiologia` permanece `ACTIVE` com 2 assuntos, embora editorial V1.1 a rebaixe a `MATERIAL_DE_APOIO`.

**Impacto:** Questões de A&P podem ser classificadas como disciplina primária, violando regra editorial.  
**Recomendação:** Status `SUPPORT_MATERIAL`; redirecionar para disciplina clínica aplicada.  
**Prioridade:** **MÉDIA**  
**Status V1.2.1:** **RESOLVIDO** — `anatomia-fisiologia` marcada `INACTIVE`.

---

### I-07 — 13 bancas sem concurso cadastrado

22 bancas × 18 concursos → **13 bancas órfãs** (sem `contest` vinculado).

**Impacto:** Imports futuros de provas dessas bancas falharão validação de `contest` obrigatório.  
**Recomendação:** Cadastro mínimo placeholder ou relaxar validação com `contest: generic-{board}-{year}`.  
**Prioridade:** **MÉDIA**

---

### I-08 — Assuntos genéricos demais (baixa especificidade)

| Assunto | Disciplina | Risco |
|---|---|---|
| `conceitos-de-internet-e-redes` | Informática | Agrupa busca, e-mail, redes sociais |
| `fundamentos-da-urgencia-e-emergencia` | Urgência | Catch-all para triagem + clínica |

**Impacto:** IA e analytics perdem precisão; dashboards por assunto ficam pouco acionáveis.  
**Recomendação:** Subdividir quando frequência >5% em corpus acumulado; manter genéricos apenas como fallback temporário.  
**Prioridade:** **BAIXA**

---

### I-09 — Enfermagem em Doenças Transmissíveis sub-dimensionada

1 único assunto operacional (`prevencao-e-controle-de-doencas-transmissiveis`) vs 5 assuntos editoriais (D06-A01..A05).

**Impacto:** Dengue, TB, HIV, IST e zoonoses competem no mesmo bucket.  
**Recomendação:** Expandir para assuntos editoriais ou tags por agravo (PNI/SINAN-friendly).  
**Prioridade:** **MÉDIA**

---

## Melhorias futuras

### M-01 — Eixo Técnico de Enfermagem

Hoje o curso `enfermagem` serve Enfermeiro e Técnico com a **mesma árvore**. Editais de Técnico enfatizam Fundamentos, Biossegurança, CC/CME e legislação básica — não SAE/NANDA avançado.

**Sugestão:** Metadado `positions[]` por disciplina/assunto (`enfermeiro`, `tecnico-enfermagem`) sem duplicar árvore inteira.  
**Prioridade:** **MÉDIA** (pré-requisito para expansão de cargo)

---

### M-02 — Especialidades como sub-eixo (não disciplinas novas)

Oncologia, Obstetrícia, Pediatria, UTI já aparecem como **assuntos** ou disciplinas — evitar proliferar D27, D28…

**Sugestão:** Tags `specialty: oncologia|obstetricia|pediatria|uti` + assuntos estáveis; especialidade como dimensão analítica, não disciplina primária.  
**Prioridade:** **MÉDIA**

---

### M-03 — Camada de sinônimos para IA

Taxonomy Engine já tem `searchText`; falta mapeamento explícito editorial → operacional.

**Sugestão:** `docs/editorial/normalized/16-taxonomy-aliases.json` com `{editorialId, slug, synonyms[], deprecatedSlugs[]}`.  
**Prioridade:** **MÉDIA**

---

### M-04 — Tier de assuntos por frequência de edital

Integrar `frequencia_percentual` de `01-disciplinas.json` e `frequencia` de `02-assuntos.json` no índice exportado.

**Sugestão:** Campo `coverageTier: UNIVERSAL|FREQUENTE|VARIAVEL|EXAM_SPECIFIC` em cada entidade.  
**Prioridade:** **BAIXA**

---

### M-05 — Template regional replicável

**Sugestão:** Disciplina-mãe `conhecimentos-gerais-regionais` com assuntos fixos (História, Geografia, Economia, Instituições) + metadata `region: acre|df|am|…`.  
**Prioridade:** **ALTA** (bloqueador de escala geográfica)  
**Status V1.2.1:** **RESOLVIDO** — ver C-05.

---

### M-06 — Consolidação Fundamentos (35 → ~12 assuntos núcleo)

Assuntos operacionais como `bandagens`, `curativos`, `feridas-e-cicatrizacao` podem ser agrupados em `cuidados-de-enfermagem-basicos` com sub-tags.

**Prioridade:** **BAIXA** (após corpus >500 questões)

---

## Sugestões rejeitadas

| Sugestão | Motivo da rejeição |
|---|---|
| Excluir disciplinas legadas do `taxonomy.json` | Quebra imports históricos e hashes de questões já seedadas; usar `INACTIVE`/`MERGED` |
| Criar disciplina por especialidade (Oncologia, Pediatria, Obstetrícia…) | Inflaria de 21 para 35+ disciplinas; contradiz V1.1 e dificulta IA |
| Renomear `enfermagem-medico-cirurgica` | V1.1 explicitamente manteve nome; requer aprovação formal |
| Unificar `urgencia-e-emergencia` + `terapia-intensiva-uti` | Fronteiras clínicas distintas nos editais; manter separadas com assuntos corretos |
| 1 assunto por lei municipal permanentemente | Modelo insustentável; usar metadata de escopo |
| Classificar Anatomia como disciplina primária | Editorial V1.1 proíbe; conteúdo é suporte transversal |
| Duplicar slugs de assunto entre disciplinas | Validadores (convert + Classification Engine) exigem par único subject/topic |

---

## Plano de correção

### Fase 1 — Desbloqueadores (Sprint V1.2.1) — Prioridade ALTA — **CONCLUÍDA**

1. Reparentar 19 assuntos legados para disciplinas sobreviventes (C-02). **RESOLVIDO**
2. Criar/sincronizar 9 assuntos D07 em `enfermagem-medico-cirurgica` (C-01). **RESOLVIDO**
3. Criar 4 assuntos D25 em `terapia-intensiva-uti` (C-01). **RESOLVIDO**
4. Remover duplicatas SAE de Fundamentos (C-04). **RESOLVIDO**
5. Marcar 5 disciplinas legadas como `INACTIVE`/`MERGED` com `supersededBy`. **RESOLVIDO** (`INACTIVE`; slugs preservados)
6. Criar template regional mínimo (Acre + DF) (C-05). **RESOLVIDO**

**Entregável:** `taxonomy.json` v1.2.1 + revalidação Classification Engine 0 erros. **ENTREGUE**

---

### Fase 2 — Alinhamento editorial (Sprint V1.2.2) — Prioridade MÉDIA

1. Mapa `editorialId → slug` para 107 assuntos.
2. Reconciliar Administração e Biossegurança com nomenclatura D01/D03.
3. Unificar cargo `tecnico-enfermagem` / `tecnico-em-enfermagem` (I-01).
4. Expandir Doenças Transmissíveis para 5 assuntos (I-09).
5. Cadastrar concursos faltantes para 13 bancas (I-07).

**Entregável:** `16-taxonomy-aliases.json` + atualização `03-topics.md`.

---

### Fase 3 — Escala e IA (Sprint V1.2.3) — Prioridade BAIXA/MÉDIA

1. Consolidar assuntos municipais em buckets genéricos + metadata (I-04).
2. Implementar `coverageTier` e ranking de busca (M-04).
3. Metadado `positions[]` por assunto para Técnico (M-01).
4. Tags `specialty` transversais (M-02).
5. Revisar granularidade de Fundamentos com base em corpus >500 questões (M-06).

**Entregável:** Taxonomy Engine v1.2 com search ponderado + documentação IA.

---

## O que NÃO deve ser alterado

| Elemento | Motivo |
|---|---|
| Arquitetura geral (curso → disciplina → assunto) | Estável; convert, seed e engines dependem dela |
| Slugs de disciplinas V1.1 sobreviventes | Retrocompatibilidade de imports e Lovable sync |
| IDs editoriais D01–D26 | Referência em toda documentação normalizada |
| Banco de dados / migrations | Sprint explicitamente read-only |
| Question Pipeline, Editorial Engine, Taxonomy Engine, Classification Engine | Apenas consumidores; correção é no seed |
| convert / seed (código) | Validadores corretos; problema é dados |
| Portal Admin / Portal do Aluno | Fora do escopo |
| 22 slugs de bancas existentes | URLs e imports históricos |
| Concursos já cadastrados (18) | Não renomear slugs de concurso |
| Assuntos já usados em questões seedadas (50 pares) | Alterar exige remapeamento + re-seed |

---

## Apêndice — Checklist dos 10 eixos auditados

| # | Eixo | Resultado | Qtd. problemas |
|---|---|---|---|
| 1 | Disciplinas sem assuntos | **RESOLVIDO** | 0 |
| 2 | Assuntos órfãos (sob legado) | **RESOLVIDO** | 0 |
| 3 | Assuntos duplicados (slug) | OK | 0 |
| 3b | Duplicados conceituais (SAE) | **RESOLVIDO** | 0 |
| 4 | Assuntos genéricos demais | Atenção | 2 |
| 5 | Assuntos hiper-específicos | Atenção | 16 |
| 6 | Disciplinas legado não consolidadas | **RESOLVIDO** | 0 |
| 7 | Assuntos em múltiplas disciplinas (mesmo slug) | OK | 0 |
| 8 | Disciplinas nunca utilizadas | Atenção | 12 |
| 9 | Assuntos nunca utilizados | Atenção | 134 |
| 10 | Conflitos Editorial × Taxonomia | Parcial | C-03 pendente V1.2.2; C-01/C-04/C-05 **RESOLVIDOS** |

---

*Auditoria V1.2. Correções críticas V1.2.1 aplicadas em 2026-07-14. Taxonomia V1 congelada — ver `docs/TAXONOMY_V1_FREEZE.md`.*
