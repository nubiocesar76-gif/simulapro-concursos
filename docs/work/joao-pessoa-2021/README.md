# Prefeitura de João Pessoa 2021 (Instituto AOCP)

- Nome do concurso: Edital de Concurso Público nº 02/2020, Secretaria da Saúde
- Órgão: Prefeitura Municipal de João Pessoa / PB
- Banca: Instituto AOCP
- Cargo: Enfermeiro (código 403, 36 vagas + 2 PcD, nível superior)
- Status:
  ☑ Edital
  ☑ Prova
  ☑ Gabarito definitivo
  ☑ Formato validado (5 alternativas A–E)
  ☑ CSV
  ☑ questions.json
  ☑ Seed
  ☑ Validado (verificação via DB)

Questões importadas: 57 de 60 (3 anuladas: 16, 41, 60).

## Pré-checagem

1. Cargo Enfermeiro? **SIM** — confirmado no próprio Edital nº 02/2020, item 2.1,
   Tabela 2.1 (Nível Superior), código 403.
2. Edital público? **SIM**.
3. Prova pública? **SIM**.
4. Gabarito definitivo público? **SIM** — "GABARITO PÓS-RECURSOS - TARDE".
5. Formato da prova: **A–E (5 alternativas)** — confirmado tanto pelo item 9.3
   do próprio edital ("Cada questão da Prova Objetiva terá 5 (cinco)
   alternativas") quanto pela leitura direta do caderno de provas.

Todas as respostas SIM → sprint prosseguiu conforme o fluxo homologado.

## Fontes

- **Edital nº 02/2020**: obtido via Diário Oficial do Município (Semanário
  Oficial de João Pessoa, Edição Especial de 15/12/2020):
  http://antigo.joaopessoa.pb.gov.br/portal/wp-content/uploads/2020/12/2020_Edi%C3%A7%C3%A3o_Especial_15-12.pdf
  — confirmado como o mesmo edital via cópia espelhada no site
  eticaconcursos.com.br
  (`/provas/arquivos/edital/prefeitura_de_joao_pessoa_pb_2020_edital_n_02-edital.pdf`).
- **Prova (Enfermeiro, Tipo 01, Turno Tarde)**: o portal oficial do Instituto
  AOCP (institutoaocp.org.br) bloqueia acesso automatizado em suas páginas de
  concurso (HTTP 403), embora alguns subcaminhos do domínio permaneçam
  acessíveis. O arquivo foi obtido via mirror
  `eticaconcursos.com.br/provas/arquivos/prova/instituto-aocp-2021-prefeitura-de-joao-pessoa-pb-enfermeiro-prova.pdf`.
- **Gabarito definitivo pós-recursos**: mesmo mirror,
  `eticaconcursos.com.br/provas/arquivos/gabarito/instituto-aocp-2021-prefeitura-de-joao-pessoa-pb-enfermeiro-gabarito.pdf`
  — documento de 42 páginas "GABARITO PÓS-RECURSOS - TARDE" cobrindo todos os
  cargos de nível superior do turno da tarde, com 4 versões de prova
  (01 a 04) e questões anuladas marcadas com "X".

Questões anuladas (excluídas do banco, conforme gabarito oficial, Prova 01):
16 (informática — extensão .STL), 41 (hanseníase — esquema PB), 60 (ferida —
origem patológica, repetida da Q21).

## Taxonomia

Reuso quase integral da taxonomia existente. 2 assuntos (tópicos)
genuinamente inéditos foram criados, ambos dentro de disciplinas já
existentes (nenhuma disciplina nova):

- `saude-da-mulher` → `queixas-ginecologicas-comuns-e-sangramento-uterino`
- `saude-da-crianca-e-do-adolescente` → `grupos-operativos-com-adolescentes`

1 concurso novo: `concurso-publico-prefeitura-de-joao-pessoa-edital-02-2020`
(banca `instituto-aocp`, já existente na taxonomia).
