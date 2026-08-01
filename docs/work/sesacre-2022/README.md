- Nome do concurso: Concurso Público SESACRE Edital nº 001 SEPLAG/SESACRE, de 24/06/2022
- Órgão: Secretaria de Estado de Saúde do Acre (SESACRE) / SEPLAG
- Banca: IBFC (código do cargo: IBFC_11_ENFERMEIRO)
- Cargo: Enfermeiro
- Status: **CONCLUÍDA** — 80 questões válidas homologadas
  ☑ Edital
  ☑ Prova
  ☑ Gabarito (oficial pós-recursos, nível superior)
  ☑ CSV
  ☑ questions.json
  ☑ Seed
  ☑ Validado

## Nota (2026-07-24) — documentação criada retroativamente

Esta pasta continha `edital.pdf`, `prova.pdf` e `gabarito.pdf` mas nenhum
README/status.json. Confirmado diretamente no banco de produção durante a
reconciliação catálogo × banco (ver `docs/BUGS.md` BUG-006): **80 questões**
com `board=ibfc`, `contest=concurso-publico-sesacre-edital-01-2022`,
`position=enfermeiro` — batendo exatamente com os 80 itens do gabarito oficial
(gabarito pós-recursos, nível superior; nenhum item anulado visível no
documento). Não foi possível reconstruir nesta sessão a data exata do seed nem
o CSV de origem (nenhum commit ou `docs/imports/questions.csv` documenta este
lote especificamente) — mesmo padrão de outras provas descobertas nesta
reconciliação (ver `ebserh-2020`, `ebserh-2023`, `sespa-pa-2023`).

Esta prova também aparece citada em `docs/work/semsa-manaus-2022/README.md`
("141 questões = 80 SESACRE + 61 SEMSA"), confirmando de forma independente
que os 80 itens da SESACRE já estavam no banco antes daquele registro.
