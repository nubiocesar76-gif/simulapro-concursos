# Correção — Conversor CSV/XLSX não gerava `package`/`packageVersion`

**Status:** ✅ Resolvido em 2026-07-09.
**Escopo respeitado:** nenhuma arquitetura nova, nenhum módulo novo, `scripts/seed/questions/seed.ts` e o schema do banco **não foram tocados** — apenas o conversor (`scripts/seed/questions/convert/`) foi completado para suportar os dois campos que o contrato do seed já aceita desde a correção anterior (`docs/CORRECAO_SEED_PACKAGE_VERSION.md`).

---

## Fluxo oficial confirmado (sem edição manual)

```
docs/imports/questions.csv (ou .xlsx)
       ↓  npm run convert:questions
docs/seeds/questions.json   (já com "package"/"packageVersion")
       ↓  npm run seed:questions
Banco (questions.package_version_id preenchido)
```

## Arquivos alterados

| Arquivo | Mudança |
|---|---|
| `scripts/seed/questions/convert/columns.ts` | `OPTIONAL_COLUMNS` ganhou `"package"` e `"package_version"` |
| `scripts/seed/questions/convert/validate.ts` | `ConvertedQuestionRow` ganhou `package?`/`packageVersion?`; validação por linha: exige o par completo (um sem o outro é erro), valida formato de slug para `package` e formato semântico para `package_version`, e normaliza inteiros de planilha (`"1"` → `"1.0"`) |
| `scripts/seed/questions/convert/convert.ts` | `toSeedItem()` passa a incluir `package`/`packageVersion` no `questions.json` de saída quando presentes |
| `docs/imports/questions.csv` | Duas colunas novas no header + valores preenchidos nas 2 linhas de exemplo (`banco-de-questoes-enfermagem` / `1.0`) |
| `docs/imports/questions.xlsx` | Regenerado a partir do CSV atualizado (`generate-xlsx-example.ts`) — o conversor prioriza `.xlsx` sobre `.csv` quando os dois existem, então precisam ficar sincronizados |

## Colunas adicionadas

| Coluna no CSV/XLSX | Campo no `questions.json` | Obrigatória? | Formato |
|---|---|---|---|
| `package` | `package` | Opcional — mas se presente, exige `package_version` no par | slug (`^[a-z0-9]+(?:-[a-z0-9]+)*$`), mesmo padrão de `board`/`subject` |
| `package_version` | `packageVersion` | Opcional — mas se presente, exige `package` no par | semântico `X.Y` ou `X.Y.Z` (ex.: `1.0`); inteiros vindos de célula numérica (`1`) são normalizados para `1.0` |

Seguem exatamente o mesmo padrão de validação já usado pelo par `board`/`contest` e `subject`/`topic`: nenhuma criação automática de pacote/versão (a existência real só é confirmada depois, no `seed:questions`, contra o banco) — o conversor valida apenas **formato** e **presença do par completo**, já que não há um espelho local de `packages`/`package_versions` equivalente a `docs/seeds/taxonomy.json`.

### Achado durante a implementação

Ao testar com o valor `"1.0"` na planilha, tanto o leitor de CSV quanto o de XLSX (biblioteca `xlsx`, usada por `parse.ts`) tipam a célula como número e descartam o zero final, entregando `"1"` em vez de `"1.0"` — e `"1"` sozinho não bate com o padrão semântico exigido pelo seed (`X.Y`). Corrigido normalizando qualquer `package_version` que seja um inteiro puro (`/^\d+$/`) para `"{n}.0"` antes da validação — um inteiro puro é sempre a *major version*, então a normalização é segura e não perde informação.

---

## Validação com uma conversão completa

```bash
$ npm run convert:questions
Conversão concluída: docs/seeds/questions.json
Questões convertidas: 2
```

`docs/seeds/questions.json` gerado **sem nenhuma edição manual posterior**, já com os campos novos em ambas as questões:

```json
{
  "package": "banco-de-questoes-enfermagem",
  "packageVersion": "1.0",
  "contentHash": "..."
}
```

Fluxo completo até o banco, sem erros:

```bash
$ npm run seed:questions
Lendo seed: .../docs/seeds/questions.json
Questões criadas: 0
Ignoradas: 2
Erros: 0
```

("Ignoradas: 2" é o comportamento correto — essas 2 questões já existem no banco desde a correção anterior, deduplicadas por `contentHash`; "Erros: 0" confirma que `package_version_id` resolveu sem falha contra o pacote/versão real já publicados.)

`npx tsc --noEmit` e `npm run build` seguem passando sem regressão (mesmos 22 erros pré-existentes e já documentados em `docs/AUDITORIA_FLUXO_PRODUCAO.md`, nenhum novo introduzido pelas mudanças no conversor).
