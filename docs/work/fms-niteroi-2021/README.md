# FMS Niterói 2019/2021 (COSEAC/UFF) — cargo Enfermeiro

- Nome do concurso: Edital nº 1/2019
- Órgão: Fundação Municipal de Saúde de Niterói (FMS), executado pela COSEAC/UFF
- Banca: COSEAC (Coordenação de Seleção Acadêmica da UFF)
- Cargo: Enfermeiro (nível superior, 62 vagas: 55 ampla concorrência + 7 PcD)
- Status:
  ☑ Edital
  ☑ Prova
  ☑ Gabarito definitivo (pós-recurso)
  ☑ Formato validado (5 alternativas A–E)
  ☑ CSV
  ☑ questions.json
  ☑ Seed
  ☑ Validado (verificação via DB)

Questões importadas: 45 de 50 (5 anuladas: 2, 3, 26, 35, 43).

## Pré-checagem

1. Cargo Enfermeiro? **SIM** — Edital nº 1/2019, item 2.1 (Tabela de cargos), 62 vagas,
   nível superior.
2. Edital público? **SIM**.
3. Prova pública? **SIM**.
4. Gabarito definitivo público? **SIM** — "GABARITO APÓS RECURSO".
5. Formato da prova: **A–E (5 alternativas)** — confirmado tanto pelo item 7.2/7.14 do
   próprio edital ("questões de múltipla escolha, contendo 5 (cinco) opções de
   respostas") quanto pela leitura direta do caderno de provas (50 questões: 10 Língua
   Portuguesa, 10 SUS, 30 Conhecimentos Específicos).

Todas as respostas SIM → sprint prosseguiu conforme o fluxo homologado.

## Fontes

O portal oficial da COSEAC/UFF (coseac.uff.br) esteve completamente inacessível durante
toda a sprint — todas as tentativas de conexão direta (HTTP e HTTPS, múltiplos
caminhos) retornaram timeout de conexão (curl exit 28) ou ECONNREFUSED, diferente do
bloqueio anti-bot (HTTP 403) observado em bancas de sprints anteriores. A conectividade
geral da rede foi confirmada como normal (fetch de teste a api.github.com teve sucesso).

Diante da indisponibilidade total do site oficial, os três arquivos foram obtidos via
Wayback Machine (web.archive.org), a partir de capturas arquivadas do próprio domínio
coseac.uff.br:

- **edital.pdf**: `Concurso-PMN-FMS-20191-Edital.pdf`, captura de 14/04/2022
  (`http://web.archive.org/web/20220414150706/...`).
- **prova.pdf**: `CONCURSOFMS20191_Enfermeiro.pdf`, captura de 01/09/2024.
- **gabarito.pdf**: `CONCURSOFMS20191_GABARITO_FINAL_Enfermeiro.pdf`, captura de
  01/09/2024.

Todos os três arquivos foram validados como PDFs íntegros e bem formados (comando
`file`) antes da transcrição.

**Nota de desambiguação**: buscas iniciais por "Enfermeiro FMS Niterói COSEAC 2021"
retornaram resultados de uma organização distinta e mais recente — a FeSaúde (Fundação
Estatal de Saúde de Niterói), que tem concurso próprio de 2021 com subcargos
especializados de Enfermeiro (Consultório na Rua, Programa Médico de Família, RAPS).
O cargo genérico "Enfermeiro" (62 vagas) do Edital nº 1/2019 pertence à FMS (Fundação
Municipal de Saúde), entidade diferente, e foi confirmado via o caminho correto
`coseac.uff.br/concursos/pmm/fms/2019` antes do download dos arquivos.

Questões anuladas (excluídas do banco, conforme gabarito oficial pós-recurso):
2, 3 (Língua Portuguesa — Texto 2, tirinha), 26 (gestação de risco), 35 (PNAB — porta de
entrada), 43 (Planejamento Estratégico Situacional).

## Taxonomia

Reuso quase integral da taxonomia existente. 3 assuntos (tópicos) genuinamente inéditos
foram criados, todos dentro de disciplinas já existentes (nenhuma disciplina nova):

- `portugues` → `ortografia`
- `saude-da-crianca-e-do-adolescente` → `triagem-neonatal-teste-do-pezinho`
- `saude-do-adulto` → `hipertensao-arterial-sistemica`

1 concurso novo: `concurso-publico-fundacao-municipal-de-saude-de-niteroi-edital-1-2019`
(banca `coseac`, já existente na taxonomia).
