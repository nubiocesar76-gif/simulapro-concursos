# 01 — Bancas Organizadoras

Fonte operacional: `docs/seeds/taxonomy.json` → `boards[]`.
Perfis editoriais complementares: `docs/editorial/normalized/14-perfil-bancas.json`.

**Regra:** usar sempre o **nome oficial** cadastrado e o **slug** exato na importação.
Nunca abreviar de forma ambígua (ex.: "FGV" pode referir-se a duas entradas distintas).

---

## Bancas cadastradas (22)

| # | Nome oficial | Slug | Sigla | Status | Observações |
|---|---|---|---|---|---|
| 1 | Avança SP | `avanca-sp` | Avança SP | ACTIVE | Perfil editorial B09 (Avalia). Formato 4 alternativas. Dificuldade baixa-média. |
| 2 | CEBRASPE | `cebraspe` | CEBRASPE | ACTIVE | Perfil B06. Formato Certo/Errado. Alta pegadinha normativa literal. |
| 3 | CESGRANRIO | `cesgranrio` | CESGRANRIO | ACTIVE | Perfil B14. 5 alternativas. Enunciados longos, dificuldade média-alta. |
| 4 | COSEAC | `coseac` | COSEAC | ACTIVE | Sem perfil editorial dedicado. Presença regional. |
| 5 | FEPESE | `fepese` | FEPESE | ACTIVE | Sem perfil editorial dedicado. Presença em SC. |
| 6 | FGV | `fgv` | FGV | ACTIVE | Perfil B02. 5 alternativas. Estudo de caso clínico frequente. |
| 7 | Fundação Carlos Chagas | `fundacao-carlos-chagas` | FCC | ACTIVE | Perfil B13. 5 alternativas. Dificuldade média-alta. |
| 8 | Fundação FAFIPA | `fundacao-fafipa` | Fundação FAFIPA | ACTIVE | Perfil B10. 4 alternativas. Enunciados diretos. |
| 9 | Fundação Getulio Vargas | `fundacao-getulio-vargas` | FGV | ACTIVE | **Entrada separada de `fgv`.** Verificar edital qual entidade organiza. |
| 10 | Fundação VUNESP | `fundacao-vunesp` | VUNESP | ACTIVE | Perfil B05. Citação literal de manuais MS. Forte em SP. |
| 11 | FUNDATEC | `fundatec` | FUNDATEC | ACTIVE | Sem perfil editorial dedicado. Presença RS. |
| 12 | IADES | `iades` | IADES | ACTIVE | Perfil B12. 5 alternativas. Presença DF/GO. |
| 13 | IBFC | `ibfc` | IBFC | ACTIVE | Perfil B01. 4 alternativas. Decoreba normativa frequente. |
| 14 | IDECAN | `idecan` | IDECAN | ACTIVE | Perfil B04. "Assinale a incorreta" frequente. |
| 15 | Instituto ACCESS | `instituto-access` | Instituto ACCESS | ACTIVE | Sem perfil editorial dedicado. |
| 16 | Instituto AOCP | `instituto-aocp` | Instituto AOCP | ACTIVE | Perfil B07. "De acordo com [norma], é correto afirmar". |
| 17 | Instituto Consulplan | `instituto-consulplan` | Instituto Consulplan | ACTIVE | Perfil B03. Mistura definição + caso clínico curto. |
| 18 | Legalle Concursos | `legalle-concursos` | Legalle Concursos | ACTIVE | Sem perfil editorial dedicado. |
| 19 | OBJETIVA Concursos | `objetiva-concursos` | OBJETIVA Concursos | ACTIVE | Sem perfil editorial dedicado. |
| 20 | Quadrix | `quadrix` | Quadrix | ACTIVE | Perfil B11. Certo/Errado com anulação. |
| 21 | UFPR / NC | `ufpr-nc` | UFPR / NC | ACTIVE | Perfil B15. 5 alternativas. Dificuldade média-alta. |
| 22 | IDIB | `idib` | IDIB | ACTIVE | Perfil editorial pendente. Cadastrado para expansão do acervo. |

---

## Regras de uso do campo `board`

1. Preencher com o **nome oficial** exatamente como na tabela (case-sensitive na importação via slug).
2. No CSV/`classification.template.json`, o valor de `board` deve corresponder ao **nome** cadastrado, não ao slug — o convert resolve internamente.
3. Se o edital citar sigla (ex.: "CESPE"), mapear para **CEBRASPE** (`cebraspe`).
4. **FGV vs Fundação Getulio Vargas:** consultar capa do edital/prova. Se indeterminado, registrar observação em `keywords` (`board:ambiguo-fgv`) e submeter à revisão humana.
5. **Avança SP / Avalia:** usar nome **Avança SP** no banco; perfil editorial referencia-se como Avalia (B09).
6. Banca desconhecida **não cadastrada:** não inventar. Registrar pendência e solicitar inclusão via governança editorial antes do seed.

---

## Mapeamento editorial → slug

| Perfil editorial | Bancas correspondentes |
|---|---|
| B01 IBFC | IBFC |
| B02 FGV | FGV, Fundação Getulio Vargas |
| B03 Consulplan | Instituto Consulplan |
| B04 IDECAN | IDECAN |
| B05 VUNESP | Fundação VUNESP |
| B06 Cebraspe | CEBRASPE |
| B07 AOCP | Instituto AOCP |
| B09 Avalia | Avança SP |
| B10 FAFIPA | Fundação FAFIPA |
| B11 Quadrix | Quadrix |
| B12 IADES | IADES |
| B13 FCC | Fundação Carlos Chagas |
| B14 Cesgranrio | CESGRANRIO |
| B15 UFPR/NC | UFPR / NC |
