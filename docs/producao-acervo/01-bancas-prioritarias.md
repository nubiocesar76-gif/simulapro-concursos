# 01 — Bancas Prioritárias

**Última revisão:** 2026-07-09
**Base:** contagem de ocorrências em `docs/catalog/enfermagem.csv` (67
provas já mapeadas) + perfil qualitativo de
`docs/editorial/06-diferencas-entre-bancas.md` e
`docs/editorial/normalized/14-perfil-bancas.json`.

## Critério de priorização

Ordem = volume de provas já planejadas para essa banca no catálogo atual.
Volume alto → dominar o estilo dessa banca primeiro tem o maior efeito
multiplicador sobre o acervo (mesma banca aparece em vários órgãos).

## Ranking

| # | Banca | Provas no catálogo atual | Formato | Nível de dificuldade | Observação de produção |
|---|---|---|---|---|---|
| 1 | **FGV** | 25 | Múltipla escolha, 5 alt. | Médio-alto | Maior volume do acervo (EBSERH, SES-RJ, SES-MG, Prefeitura RJ/BH, vários HUs). Estudo de caso clínico longo — checklist de produção deve reforçar conferência de gabarito (banca tende a manter gabarito mesmo com questionamento textual). |
| 2 | **IDIB** | 13 | Múltipla escolha | Médio | Concentrada em SES-BA e prefeituras/HUs do Nordeste (Salvador, Recife, Fortaleza, UFPE, UFBA). Perfil ainda não documentado em `06-diferencas-entre-bancas.md` — **pendência editorial**: nome já cadastrado na taxonomia (Sprint 11.2), mas sem perfil qualitativo próprio; ao processar a primeira prova IDIB, retroalimentar `docs/editorial/06-diferencas-entre-bancas.md`. |
| 3 | **Cebraspe (CESPE)** | 9 | Certo/Errado | Alto | Todas as 3 Forças Armadas (Marinha, Exército, Aeronáutica). Formato estrutural diferente (itens, não alternativas) — pipeline de extração precisa tratar esse caso à parte (ver `04-checklist-producao.md`). |
| 4 | **VUNESP** | 8 | Múltipla escolha, 5 alt. | Médio | SES-SP, Prefeitura de São Paulo, HU-Unifesp. Cita literalmente manuais/portarias do MS. |
| 5 | **UFPR / NC** | 7 | Múltipla escolha, 5 alt. | Médio-alto | SES-PR, Prefeitura de Curitiba, HU-UFPR. Perfil acadêmico, cobra Anatomia/Fisiologia aplicada com mais profundidade que a média. |
| 6 | **Instituto Consulplan** | 3 | Múltipla escolha, 5 alt. | Médio | Apenas SES-PE no catálogo atual. |
| 7 | **Quadrix** | 2 | Certo/Errado/Anulado (3 alt.) | Médio | Apenas Prefeitura de Goiânia. Formato próprio de 3 alternativas — mesmo cuidado de extração que Cebraspe. |

## Bancas com perfil documentado mas sem prova no catálogo atual

Presentes em `docs/editorial/normalized/14-perfil-bancas.json` e em
`docs/catalog/enfermagem.csv` (histórico de outras disciplinas/cargos), mas
sem prova de Enfermeiro planejada nas 67 linhas atuais — candidatas
naturais ao **backlog de expansão para 100 provas** (ver
`05-cronograma-producao.md`):

- **IBFC** — forte em Fundamentos, Ética/Legislação, Saúde Coletiva.
- **IDECAN** — forte em SAE, Farmacologia, Saúde Mental.
- **AOCP** — forte em Saúde Coletiva/Imunização, presente em HUs.
- **FUNDEP** — perfil acadêmico, concursos ligados à UFMG.
- **Avalia / FAFIPA** — provas menores, nível mais baixo, boas para
  variar a dificuldade do acervo.
- **IADES, FCC, Cesgranrio** — volume histórico baixo em Enfermagem, mas
  presentes em concursos federais/estaduais relevantes.

## Uso prático

1. Ao planejar um lote de produção (`05-cronograma-producao.md`), preferir
   agrupar provas da **mesma banca** — reduz retrabalho de calibração de
   estilo/distrator.
2. Ao revisar uma prova de banca ainda sem perfil qualitativo (ex.: IDIB),
   registrar as observações de estilo encontradas e propor a atualização de
   `docs/editorial/06-diferencas-entre-bancas.md` como item separado — este
   documento de controle não deve conter perfil de banca duplicado.
