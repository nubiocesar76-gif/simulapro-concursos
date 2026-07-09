# Fluxo Definitivo — Produção de uma Prova Oficial

**Escopo:** auditoria do estado real do código (nenhuma alteração feita). Descreve o que **funciona hoje**, não o pipeline aspiracional documentado em `docs/work/README.md`.
**Caso de referência usado na auditoria:** `ebserh-2025` (única prova já registrada em `docs/catalog/enfermagem.csv` e `docs/work/ebserh-2025/`).
**Data:** 2026-07-09

---

## 1. Fluxo definitivo

Existem **dois sistemas paralelos e desconectados no código** que é preciso não confundir:

- **`docs/work/<workId>/`** (registro/inventário do Acervo — tabelas `exam_catalog`/`exam_files`): guarda o PDF, o gabarito e o *status* administrativo da prova (`REGISTERED` → `DOWNLOADED` → ...). **Nenhum script lê `questions.raw.json` ou `review.json` dessa pasta.** Eles existem como esqueleto para uma extração por IA que **não está implementada** (comentário no próprio código: `scripts/seed/questions/pdf/pipeline.ts:4-7`, "Fluxo futuro (não implementado nesta sprint)").
- **`docs/imports/` → `docs/seeds/`** (produção real de questões): é o único caminho hoje capaz de gerar `docs/seeds/questions.json` de fato. Não depende de `docs/work/` para funcionar.

O fluxo que **realmente roda**, do PDF ao aluno:

```
① PDF oficial + gabarito
       ↓ (manual — leitura humana, sem OCR/extração automática)
② Transcrição para docs/imports/questions.csv (ou .xlsx)
       ↓ npm run convert:questions          [automático]
③ docs/seeds/questions.json
       ↓ (manual — ver seção 3, item crítico)
④ questions.json com "package"/"packageVersion" preenchidos
       ↓ npm run seed:questions             [automático]
⑤ Questões gravadas em `questions` (banco), já com package_version_id
       ↓ (pré-requisito administrativo, feito uma vez por versão — não por prova)
⑥ Versão do pacote PUBLISHED + Distribuição ACTIVE + Assinatura do aluno
       ↓
⑦ Questão aparece na sessão de estudo do Portal do Aluno
```

`docs/work/<workId>/` e `docs/catalog/enfermagem.csv` continuam existindo como **camada de controle/observabilidade** (útil para saber quais provas estão em qual estágio administrativo), mas **não fazem parte da cadeia técnica que gera `questions.json`** — atualizá-los é boa prática de processo, não um requisito de código.

---

## 2. Arquivos envolvidos

### Necessários para transformar uma prova em `questions.json`

| Arquivo | Papel | Origem |
|---|---|---|
| `docs/imports/questions.csv` **ou** `docs/imports/questions.xlsx` | Conteúdo da prova já transcrito, uma linha por questão, no formato de 23 colunas — 14 obrigatórias + 9 opcionais, incluindo `package`/`package_version` (ver seção 3) | **100% manual** — transcrição humana da prova |
| `docs/seeds/taxonomy.json` | Fonte de verdade da taxonomia (posições, bancas, concursos, disciplinas, assuntos) contra a qual o conversor valida cada linha | Gerado por `npm run export:taxonomy` a partir do banco — precisa já conter os slugs usados na planilha antes da conversão |
| `docs/seeds/questions.json` (existente, se houver) | Preserva `metadata.version`/`description` do arquivo anterior ao regravar | Gerado por execução anterior de `convert:questions` |

**Saída:** `docs/seeds/questions.json` (sobrescrito por `npm run convert:questions`).

### Não fazem parte da cadeia técnica (apesar de existirem)

| Arquivo | Por quê |
|---|---|
| `docs/work/<workId>/questions.raw.json`, `review.json` | Criados vazios por `pipeline:init`; nenhum script lê ou escreve neles depois disso |
| `docs/work/<workId>/raw.md` | Template manual (`"Preenchido manualmente ou por extração (futuro)"` — texto literal do arquivo); não é lido por `convert:questions` nem por `seed:questions` |
| `docs/catalog/enfermagem.csv` | Só alimenta a tabela `exam_catalog` (Acervo/admin), não o pipeline de questões |

### Necessários para a questão chegar ao aluno (depois do seed)

| Item | Onde é gerido | Frequência |
|---|---|---|
| Pacote (`packages`) | `/admin/packages` | Uma vez por curso/produto |
| Versão publicada (`package_versions`, status `PUBLISHED`) | `/admin/versions` | Uma vez por versão (várias provas podem apontar para a mesma versão) |
| Distribuição ativa (`content_distributions`) | `/admin/distributions` | Uma vez por versão publicada |
| Assinatura do aluno (`subscriptions`) | `/admin/subscriptions` | Uma vez por aluno |

---

## 3. Etapas ainda manuais

| # | Etapa | Manual? | Observação |
|---|---|---|---|
| 1 | Extração de texto do PDF | 🔴 100% manual | Não existe OCR/parser de PDF no código — `raw.md` é preenchido à mão ou nem é usado |
| 2 | Transcrição de cada questão (enunciado, 5 alternativas, gabarito) para `questions.csv`/`.xlsx` | 🔴 100% manual | Sem ferramenta de estruturação automática nem IA implementada |
| 3 | Classificação por disciplina/assunto (`subject`, `topic` no CSV) | 🔴 100% manual | Critério humano, orientado por `docs/editorial/` |
| 4 | Conferência do gabarito transcrito contra o gabarito oficial | 🔴 100% manual | Nenhuma validação automática compara `correct_answer` com o PDF do gabarito |
| 5 | Garantir que `docs/seeds/taxonomy.json` já tem os slugs usados | 🟡 Manual só se faltar algo | Se a taxonomia usada já existe no banco, basta rodar `npm run export:taxonomy`; se não existe, precisa ser criada antes em `/admin/subjects`\|`topics`\|`boards`\|`exams`\|`positions` |
| 6 | Preencher `package`/`package_version` no CSV/XLSX (colunas opcionais, mesmo padrão de `board`/`subject`) | 🟡 Manual, mas dentro da própria transcrição (passo 2/5) | Decisão de a qual pacote/versão a prova pertence — não é mais uma edição separada do JSON gerado (ver ✅ abaixo) |
| 7 | Rodar `npm run convert:questions` | 🟢 Automático | Um comando, valida e gera `questions.json` **já com `package`/`packageVersion` inclusos**, sem edição manual do JSON — ver `docs/CORRECAO_CONVERSOR_PACKAGE_VERSION.md` |
| 8 | Rodar `npm run seed:questions` | 🟢 Automático | Um comando, resolve taxonomia + pacote/versão por slug e insere no banco |
| 9 | Garantir Pacote → Versão `PUBLISHED` → Distribuição `ACTIVE` → Assinatura do aluno | 🟡 Manual, mas via UI já pronta | Feito uma vez por versão/aluno, não por prova; usa telas de admin já implementadas e testadas |
| 10 | Conferir a prova no Portal do Aluno | 🔴 Manual (QA) | Nenhum teste automatizado no repositório |

**Resumo:** as únicas etapas hoje automatizadas por comando são a conversão (`convert:questions`) e o seed (`seed:questions`), e a conversão agora já emite `package`/`packageVersion` automaticamente a partir do CSV/XLSX — não sobra nenhuma edição manual de JSON entre a conversão e o seed. O que continua manual é só *ler a prova* (transcrição) e *decidir* a qual pacote/versão ela pertence (uma escolha, preenchida como mais uma coluna da planilha, não mais um passo à parte).

---

## 4. Comandos necessários

Executados a partir da raiz do projeto, nesta ordem:

```bash
# 1. (opcional) Sincronizar a taxonomia do banco para docs/seeds/taxonomy.json
#    — só necessário se a taxonomia foi alterada no Admin desde a última exportação
npm run export:taxonomy

# 2. Converter a planilha transcrita da prova em questions.json
#    Entrada: docs/imports/questions.csv (ou .xlsx, se presente, tem prioridade)
#    Colunas opcionais "package"/"package_version" já viram
#    "package"/"packageVersion" no JSON de saída — sem edição manual
#    Validação: contra docs/seeds/taxonomy.json
npm run convert:questions

# 3. Popular o banco a partir do questions.json gerado
npm run seed:questions
```

Comandos relacionados, usados fora dessa cadeia direta:

```bash
# Registrar PDF + criar pasta de trabalho (camada de controle, não gera questions.json)
npm run pipeline:init -- docs/imports/pdfs/<prova>.pdf

# Conferir o que está no banco hoje, no formato do contrato do seed
npm run export:questions
```

---

## 5. Confirmação — "gerar `questions.json` + rodar seed" é suficiente?

**Sim, com uma condição — e ela agora é preenchida na própria planilha, não mais editando o JSON.** `npm run seed:questions` disponibiliza a prova ao aluno desde que:

1. **A planilha de origem (`questions.csv`/`.xlsx`) tenha as colunas opcionais `package`/`package_version` preenchidas**, apontando para uma versão de pacote existente — `convert:questions` já propaga isso automaticamente para `package`/`packageVersion` no `questions.json` (correção aplicada em 2026-07-09, ver `docs/CORRECAO_CONVERSOR_PACKAGE_VERSION.md`). Se essas colunas ficarem vazias, o comportamento é o mesmo de antes: `package_version_id` fica `NULL` e a prova não aparece para nenhum aluno — mas isso agora é uma omissão na planilha de transcrição, não mais um passo extra depois da conversão.
2. **Essa versão de pacote já está `PUBLISHED`, com uma Distribuição `ACTIVE` e o aluno já tem uma Assinatura ativa para ela.** Isso normalmente já existe (feito uma vez, não por prova) — mas se for a primeira prova de um pacote novo, esse encadeamento (Pacote → Versão → Publicar → Distribuição → Assinatura) precisa ser montado no Admin antes ou depois do seed, não é automático.

Com a planilha preenchida corretamente e o pacote/versão/distribuição/assinatura já existentes, **`npm run seed:questions` é o último passo técnico** — sem nenhuma edição manual de `questions.json` entre a conversão e o seed.

---

## Checklist operacional — processar uma prova do início ao fim

- [ ] **1.** PDF oficial da prova + PDF do gabarito em mãos, conferidos (edital, ano, banca, órgão corretos)
- [ ] **2.** Prova registrada em `docs/catalog/enfermagem.csv` (ou `npm run pipeline:init -- docs/imports/pdfs/<prova>.pdf`) — camada de controle, opcional para o resultado técnico mas recomendado para rastreabilidade
- [ ] **3.** Conferir se todas as disciplinas/assuntos/bancas/concursos usados pela prova já existem na taxonomia (`/admin/subjects`, `/topics`, `/boards`, `/exams`, `/positions`); criar o que faltar
- [ ] **4.** `npm run export:taxonomy` — sincronizar `docs/seeds/taxonomy.json` com o que foi criado/confirmado no passo 3
- [ ] **5.** Confirmar/decidir a qual Pacote + Versão essa prova pertence (criar e publicar a Versão em `/admin/packages` → `/admin/versions`, se ainda não existir uma `PUBLISHED` adequada)
- [ ] **6.** Transcrever cada questão da prova para `docs/imports/questions.csv` (ou `.xlsx`): enunciado, 5 alternativas (A–E), gabarito, `position`/`board`/`contest`/`subject`/`topic` (slugs), ano, explicação, e **`package`/`package_version`** (slug do pacote + número da versão decididos no passo 5)
- [ ] **7.** Conferir cada `correct_answer` transcrito contra o PDF do gabarito oficial, um a um
- [ ] **8.** `npm run convert:questions` — gera/atualiza `docs/seeds/questions.json` já com `package`/`packageVersion` incluídos; se falhar, corrigir as linhas apontadas no relatório e repetir
- [ ] **9.** `npm run seed:questions` — grava no banco; conferir na saída que "Questões criadas" bate com o total esperado e "Erros: 0"
- [ ] **10.** Conferir em `/admin/questions` (ou `/admin/acervo`) que a contagem de questões da prova está correta
- [ ] **11.** Garantir Distribuição `ACTIVE` para a versão e ao menos uma Assinatura de teste ativa
- [ ] **12.** Login como aluno assinante → `/app/study` → criar sessão → confirmar que as questões da prova aparecem e respondem corretamente
- [ ] **13.** Atualizar `docs/catalog/enfermagem.csv` (`status=SEEDED`, contagem de questões) e `docs/work/<workId>/status.json`, se a prova estiver sendo rastreada pelo Acervo
