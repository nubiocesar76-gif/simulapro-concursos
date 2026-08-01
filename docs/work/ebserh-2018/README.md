# EBSERH 2018 (CEBRASPE) — Preparação da Prova

**Status:** ✅ **CONCLUÍDA** — corrigido em 2026-07-24. Confirmado diretamente no banco de produção: 89 questões com `board=cebraspe`, `contest=concurso-publico-ebserh-assistencial-edital-3-2018` já estão seedadas (exatamente os 89 itens válidos previstos abaixo: 100 − 11 anuladas). Este README ainda descrevia o estado de "PAUSADA" de uma sessão anterior a este seed — igual ao caso do SESPA-PA 2023 (ver `docs/BUGS.md` BUG-006), o seed aconteceu sem que este arquivo fosse atualizado. Nenhum `docs/imports/questions.csv` nem commit git documentam quando/como isso foi feito; não foi possível confirmar a data exata do seed nesta sessão. Texto original da seção de bloqueio (histórico, já superado) mantido abaixo para contexto.

## Nota histórica (bloqueio original, já superado)

**Status original (antes da descoberta acima):** 🛑 PAUSADA — preparação e transcrição (ver [TRANSCRICAO.md](TRANSCRICAO.md)) concluídas e auditadas, mas a conversão para `questions.csv` estava tida como bloqueada por um problema estrutural, não uma decisão de conteúdo.

## ⚠️ Bloqueio — formato Certo/Errado incompatível com o contrato do CSV

A prova é inteiramente em formato Certo/Errado (padrão CEBRASPE) — cada item tem só 2 respostas possíveis. O contrato oficial do CSV (`scripts/seed/questions/convert/columns.ts`) exige `alternative_a` a `alternative_d` preenchidas (múltipla escolha, mínimo 4 opções); `convert:questions` rejeita qualquer linha sem isso. Não há precedente no acervo atual (0 de 1.020 questões são CEBRASPE/CESPE). Preencher alternativas C/D com conteúdo inventado violaria a disciplina desta produção editorial ("não assumir, confirmar documentalmente"); alterar `validate.ts` para aceitar 2 alternativas violaria a regra desta sprint de não alterar pipeline.

**Decisão do usuário (2026-07-18):** pausar esta prova sem ação de código, e levar o suporte a questões Certo/Errado para uma decisão de produto/arquitetura futura, fora do escopo da G7.5B.

**Achado secundário (dependente do bloqueio acima):** o concurso "EBSERH 2018" com banca `cebraspe` ainda não existe em `docs/seeds/taxonomy.json` (só há concursos EBSERH de 2013/2019/2023, todos banca `ibfc`). Banca `cebraspe` e cargo `enfermeiro` já existem na taxonomia; faltaria apenas o `contest`. Não resolvido — não faz sentido até o bloqueio principal ser equacionado.

Nenhum arquivo de código, pipeline ou banco foi alterado. Nenhum `questions.csv` foi gerado para esta prova.

## Fonte oficial

- **Concurso:** EBSERH 2018 — Concurso Público para Provimento de Vagas Efetivas e Formação de Cadastro Reserva (Hospitais Universitários Federais), Assistencial
- **Banca:** CEBRASPE
- **Página oficial:** https://www.cebraspe.org.br/concursos/EBSERH_18_ASSISTENCIAL
- **Vagas totais do concurso:** 706 (57 cargos distintos, nível médio e superior)
- **Aplicação da prova objetiva:** 06/05/2018 (confirmado no cabeçalho dos gabaritos oficiais)

## Escopo desta prova (decisão do usuário)

**Cargo 6 — Enfermeiro** (genérico, nível superior). Escopo mantido apenas neste cargo — não expandido para os demais cargos de especialidade de Enfermeiro deste mesmo concurso (7, 11, 16, 19–22, 24, 25, 29 etc.), que também têm prova e gabarito próprios já localizados, caso sejam priorizados em provas futuras do Lote 1/2.

## ⚠️ Verificação técnica — prova completa em dois cadernos (confirmado documentalmente)

A CEBRASPE, no padrão desta banca, publica a prova de cargos de nível superior em **dois cadernos separados**:

1. **Conhecimentos Básicos** — comum a **todos os cargos de nível superior** do concurso (não é específico do Cargo 6). Itens **1–40**.
2. **Conhecimentos Específicos** — próprio de cada cargo. Para o Cargo 6, itens **41–100**.

**Confirmação:** o cabeçalho de `gabarito-basicos.pdf` traz "CONHECIMENTOS BÁSICOS PARA TODOS OS CARGOS DE NÍVEL SUPERIOR" e a mesma data de aplicação (6/5/2018) do Cargo 6; o documento `justificativas-gabarito.pdf` traz uma seção dedicada "PROVAS DE CONHECIMENTOS BÁSICOS PARA OS CARGOS DE NÍVEL SUPERIOR", separada da seção "PROVAS DE CONHECIMENTOS ESPECÍFICOS PARA OS CARGOS DE NÍVEL SUPERIOR" onde está o Cargo 6. **Hipótese A confirmada; Hipótese B descartada** — o `prova.pdf` original não estava incompleto, ele corresponde apenas ao caderno de específicos, que é o padrão desta banca para provas de nível superior.

**Total oficial de itens do Cargo 6: 100** (40 básicos + 60 específicos).

## Arquivos (baixados em `docs/work/ebserh-2018/`)

| Arquivo | Documento | Tamanho | Data | Fonte |
|---|---|---|---|---|
| `edital.pdf` | Edital nº 3 — Abertura | 623.776 bytes | 22/03/2018 | [cdn.cebraspe.org.br](https://cdn.cebraspe.org.br/concursos/EBSERH_18_ASSISTENCIAL/arquivos/ED_3_EBSEHR_ASSISTENCIAL___ABERTURA.PDF) |
| `prova-basicos.pdf` | Prova Objetiva — Conhecimentos Básicos (todos os cargos de nível superior) | 83.142 bytes | 10/05/2018 | [cdn.cebraspe.org.br](https://cdn.cebraspe.org.br/concursos/EBSERH_18_ASSISTENCIAL/arquivos/394_EBSERHASSISTENCIALCB1__PAG_3.PDF) |
| `gabarito-basicos.pdf` | Gabarito Oficial Definitivo — Conhecimentos Básicos (nível superior) | 102.325 bytes | 30/05/2018 | [cdn.cebraspe.org.br](https://cdn.cebraspe.org.br/concursos/EBSERH_18_ASSISTENCIAL/arquivos/GAB_DEFINITIVO_394_EBSERHASSISTENCIALCB1.PDF) |
| `prova.pdf` | Prova Objetiva — Conhecimentos Específicos, Cargo 6 | 38.755 bytes | 10/05/2018 | [cdn.cebraspe.org.br](https://cdn.cebraspe.org.br/concursos/EBSERH_18_ASSISTENCIAL/arquivos/394_EBSERHASSISTENCIAL006__PAG_3.PDF) |
| `gabarito.pdf` | Gabarito Oficial Definitivo — Conhecimentos Específicos, Cargo 6 | 102.994 bytes | 30/05/2018 | [cdn.cebraspe.org.br](https://cdn.cebraspe.org.br/concursos/EBSERH_18_ASSISTENCIAL/arquivos/GAB_DEFINITIVO_394_EBSERHASSISTENCIAL006.PDF) |
| `justificativas-gabarito.pdf` | Justificativas de alteração de gabarito (todos os cargos, básicos e específicos) | 176.144 bytes | 20/06/2018 | [cdn.cebraspe.org.br](https://cdn.cebraspe.org.br/concursos/EBSERH_18_ASSISTENCIAL/arquivos/EBSERH_18_ASSISTENCIAL_JUSTIFICATIVAS_DE_ALTERA____ES_DE_GABARITO.PDF) |

Todos os 6 arquivos verificados como PDF válido (assinatura `%PDF-`) após o download; tamanhos batem exatamente com os valores confirmados via HEAD request antes do download. Texto extraído (`pdftotext -layout`) para todos, usado apenas para as confirmações abaixo — não versionado (`.txt` são artefatos de trabalho, não fazem parte do pacote de fontes).

## Confirmações (item 4 do fluxo)

- ✅ **Fonte oficial:** confirmada — todos os links resolvem no CDN oficial da CEBRASPE (`cdn.cebraspe.org.br`), `Content-Type: application/pdf`, conteúdo íntegro após download.
- ✅ **Quantidade de páginas/itens:** `prova-basicos.pdf` (3 páginas, itens 1–40) + `prova.pdf` (3 páginas, itens 41–100) = **prova completa do Cargo 6, 100 itens**, formato Certo/Errado (padrão CEBRASPE).
- ✅ **Cargo correto:** confirmado no edital de abertura, seção 2.1.6 — **"CARGO 6: ENFERMEIRO"**. Requisito: diploma de graduação em Enfermagem + registro ativo no COREN. Remuneração: R$ 5.218,78. Jornada: 30h semanais. Código do cargo: 300. 38 vagas de ampla concorrência (+ cadastro reserva).
- ✅ **Existência de questões anuladas:** confirmado e cruzado entre os 4 gabaritos/justificativas. Dos 100 itens totais:
  - **11 itens anulados**: item **35** (Conhecimentos Básicos) + itens **49, 51, 52, 57, 85, 87, 91, 92, 93, 94** (Conhecimentos Específicos).
  - **2 itens com gabarito alterado sem anulação**: **72** (preliminar C → definitivo E) e **90** (preliminar E → definitivo C), ambos em Conhecimentos Específicos.
  - **89 itens válidos e inalterados**, prontos para transcrição direta.

## Observação para a etapa de transcrição (não é ação desta sprint)

A prova usa o formato Certo/Errado (C/E) da CEBRASPE, não múltipla escolha A–E. Isso é uma característica do formato de origem, não um problema de fonte — a transcrição manual (etapa 2 do fluxo oficial) precisará adaptar cada item ao formato do banco de questões da plataforma. Os 11 itens anulados (lista acima) não devem ser transcritos. Os Conhecimentos Básicos (itens 1–40) são conteúdo genérico (português, RLM, ética no serviço público, legislação do SUS) — cabe avaliar, na transcrição, se todos entram no banco de questões de Enfermagem ou se apenas os itens de Conhecimentos Específicos (Enfermagem propriamente dita) serão aproveitados; essa é uma decisão editorial, não técnica, e não foi tomada aqui.

## Próximos passos

Preparação da Cargo 6 está completa e a prova está confirmada como completa (2 cadernos, 100 itens, 89 válidos). Aguardando validação do usuário para iniciar o pipeline (transcrição manual → `docs/imports/questions.csv` → `convert:questions` → `sync:questions` → Admin UI → QA → publicação), conforme o fluxo oficial da G7.5B. Nenhum comando de pipeline foi executado nesta etapa.
