# 04 — Checklist da Produção (por prova)

**Última revisão:** 2026-07-09
**Uso:** copiar esta checklist para o acompanhamento de cada prova ao
avançar estágio a estágio no pipeline descrito em `docs/work/README.md`.
Nenhum item aqui cria novo estágio — cada bloco corresponde a um estágio
já existente em `status.json`.

## Antes de começar

- [ ] Prova está listada em `docs/catalog/enfermagem.csv` com `status=PLANNED`
- [ ] Órgão, banca, cargo e ano conferem com o edital/prova oficial
- [ ] PDF da prova e do gabarito localizados e íntegros (abrem sem erro,
      páginas completas)

## `REGISTERED` → `DOWNLOADED`

- [ ] PDF copiado para `docs/imports/pdfs/<workId>.pdf`
- [ ] `npm run pipeline:init -- docs/imports/pdfs/<workId>.pdf` executado
      com as variáveis `PIPELINE_ORGANIZATION`, `PIPELINE_CONTEST`,
      `PIPELINE_BOARD`, `PIPELINE_POSITION`, `PIPELINE_YEAR` corretas
- [ ] Pasta `docs/work/<workId>/` criada com `metadata.json`, `source.pdf`
- [ ] `gabarito.pdf` adicionado à pasta de trabalho
- [ ] Estrutura da prova validada (número de questões, formato de
      alternativas confere com o perfil da banca em
      `docs/editorial/06-diferencas-entre-bancas.md`)
- [ ] `status.json` atualizado para `DOWNLOADED`
- [ ] `docs/catalog/enfermagem.csv` atualizado (`status`, `pdf_available`,
      `answer_key_available`)

## `DOWNLOADED` → `TEXT_EXTRACTED`

- [ ] Texto bruto extraído do PDF para `raw.md`
- [ ] Conferência visual: `raw.md` não tem páginas faltando nem blocos de
      texto corrompidos/fora de ordem
- [ ] `status.json` atualizado para `TEXT_EXTRACTED`

## `TEXT_EXTRACTED` → `EXTRACTING` → `REVIEW`

- [ ] Questões estruturadas em `questions.raw.json` (enunciado,
      alternativas, gabarito por questão)
- [ ] Cada questão tem candidato de classificação (disciplina/assunto)
      segundo `docs/editorial/01-catalogo-disciplinas.md` e os arquivos
      `02a`–`02l`
- [ ] Casos ambíguos de classificação resolvidos conforme
      `docs/editorial/05-casos-ambiguos-regras-classificacao.md`
- [ ] Termos/siglas não catalogados verificados contra
      `docs/editorial/03-dicionario-editorial-sinonimos-siglas.md`
- [ ] `review.json` criado/atualizado com o resultado da revisão humana
- [ ] `status.json` atualizado para `REVIEW`

## `REVIEW` → `APPROVED`

- [ ] Gabarito de cada questão conferido contra `gabarito.pdf` (atenção
      redobrada em bancas com histórico de manter gabarito contestável —
      ver observações de banca em `01-bancas-prioritarias.md`)
- [ ] Nenhuma questão duplicada de outra prova já no acervo (checagem
      manual ou por hash, se disponível)
- [ ] Disciplina/assunto de cada questão validado por segunda leitura
- [ ] Achados novos (assunto, sinônimo, sigla não previstos) retroalimentados
      em `docs/editorial/` antes de aprovar, conforme regra de governança em
      `docs/editorial/README.md`
- [ ] `status.json` atualizado para `APPROVED`

## `APPROVED` → `CONVERTED` → `SEEDED`

- [ ] Questões exportadas para `docs/seeds/questions.json`
- [ ] `npm run seed:questions` executado sem erro
- [ ] Contagem de questões seedadas confere com a contagem aprovada
- [ ] `status.json` atualizado para `SEEDED`
- [ ] `docs/catalog/enfermagem.csv` atualizado (`status=SEEDED`,
      `questions`, `imported=true`, `reviewed=true`, `approved=true`)
- [ ] `docs/producao-acervo/03-status-processamento.md` atualizado com o
      novo snapshot

## Casos especiais

- [ ] **Bancas em formato Certo/Errado (Cebraspe) ou 3 alternativas
      (Quadrix):** confirmar que `questions.raw.json` representa o item no
      formato correto — não forçar múltipla escolha de 4/5 alternativas
- [ ] **Banca sem perfil documentado (ex.: IDIB):** registrar observações
      de estilo encontradas durante a revisão como pendência para
      `docs/editorial/06-diferencas-entre-bancas.md`
