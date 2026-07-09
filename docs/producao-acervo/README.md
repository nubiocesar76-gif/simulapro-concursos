# Produção do Acervo — Enfermeiro (Controle Operacional)

Este diretório contém os **documentos de controle da produção editorial**
para o acervo de provas oficiais do cargo **Enfermeiro**. É documentação
operacional pura — não define arquitetura, não altera schema, não é código.

**Escopo desta fase:** processar as próximas **100 provas oficiais** do
cargo Enfermeiro, da entrada do PDF até a aprovação editorial, seguindo o
pipeline já implementado e descrito em `docs/work/README.md`.

## Fontes de verdade (não duplicadas aqui)

| Fonte | Conteúdo |
|---|---|
| `docs/catalog/enfermagem.csv` | Catálogo operacional das provas (uma linha por prova, com status) |
| `docs/work/<workId>/` | Pasta de trabalho por prova (pipeline PDF → questões) |
| `docs/work/README.md` | Estágios oficiais do pipeline (`status.json`) |
| `docs/editorial/06-diferencas-entre-bancas.md` | Perfil qualitativo de cada banca |
| `docs/editorial/normalized/14-perfil-bancas.json` | Perfil de bancas em formato estruturado |
| `docs/editorial/README.md` e demais arquivos `docs/editorial/` | Taxonomia oficial (disciplinas/assuntos) |

Os documentos aqui **não repetem** esses dados — eles adicionam a camada de
**priorização, checklist e cronograma** por cima do que já existe.

## Documentos

| Arquivo | Conteúdo |
|---|---|
| `01-bancas-prioritarias.md` | Ranking de bancas por volume/relevância para os próximos ciclos de produção |
| `02-orgaos-prioritarios.md` | Ranking de órgãos/concursos por prioridade de processamento |
| `03-status-processamento.md` | Snapshot do status atual do acervo por estágio do pipeline |
| `04-checklist-producao.md` | Checklist item a item para levar uma prova de PDF a aprovada |
| `05-cronograma-producao.md` | Faseamento da produção das 100 provas em ondas/sprints |
| `06-controle-provas.md` | Painel de controle prova a prova (camada de priorização sobre o catálogo) |

## Regras de uso

1. Este diretório é **só leitura de controle** — não é a origem de dados.
   Ao concluir um estágio de uma prova, atualizar sempre
   `docs/catalog/enfermagem.csv` e `docs/work/<workId>/status.json`
   primeiro; os documentos aqui refletem esse estado, não o substituem.
2. Nenhuma alteração de arquitetura, banco, migration ou código deve ser
   proposta a partir destes documentos — qualquer necessidade estrutural
   identificada durante a produção deve ser registrada como pendência e
   escalada separadamente, não decidida aqui.
3. Atualizar a data de "última revisão" no topo de cada documento sempre
   que o conteúdo for revisado, mesmo sem alteração de conteúdo.

---

*Criado em 2026-07-09, fase de produção editorial (pós-homologação da
Arquitetura Editorial V1.1 e da primeira prova, `ebserh-2025`).*
