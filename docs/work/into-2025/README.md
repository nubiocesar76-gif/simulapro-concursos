- Nome do concurso: CNU 2ª Edição — Bloco Temático 1 (Seguridade Social: Saúde, Assistência Social e Previdência Social)
- Órgão: **Ministério da Saúde - Instituto Nacional de Traumatologia e Ortopedia (INTO)** — confirmado oficialmente
- Banca: FGV
- Cargo: Enfermeiro — Especialidade **Enfermagem Geral** — código **B1-07-L** — 5 vagas — remuneração inicial R$ 5.982,49 (até R$ 6.818,69 com 100 pts GDPST)
- Status: **CONCLUÍDA (validação) → EM PRODUÇÃO**
  ☐ Edital
  ☐ Prova
  ☐ Gabarito
  ☐ CSV
  ☐ questions.json
  ☐ Seed
  ☑ Validado (vínculo institucional confirmado em 2026-07-24)

## Fonte da vinculação institucional

- **Edital:** Edital Enap nº 114/2025 — Concurso Público Nacional Unificado 2, de 30 de junho de 2025 (e retificações), Fundação Escola Nacional de Administração Pública (Enap) / Ministério da Gestão e da Inovação em Serviços Públicos (MGI)
- **Anexo:** Anexo I, Bloco Temático 1 — Seguridade Social: Saúde, Assistência Social e Previdência Social (8ª retificação, 21/11/2025) — `conhecimento.fgv.br/sites/default/files/concursos/cpnu2_anexo_blocotematico1_8aret.pdf`
- **Tabela oficial de vagas:** "Cargos e Salários CPNU2" — *Remunerações dos Cargos do Concurso Público Nacional Unificado 2*, planilha oficial do MGI, linkada pela página oficial de concursos do Ministério da Saúde (`gov.br/saude/pt-br/acesso-a-informacao/concursos-e-selecoes/concursos/edital-cpnu-2025`) — `gov.br/gestao/pt-br/concursonacional/cpnu-2/cargos-e-salarios-cpnu-2/cargos_salarios_cpnu2_-1.xlsx`
- **Órgão:** Ministério da Saúde — Instituto Nacional de Traumatologia e Ortopedia (INTO)
- **Cargo:** Enfermeiro
- **Código da vaga:** B1-07-L
- **Especialidade:** Enfermagem Geral
- **Validação:** Nível A

## Validação institucional definitiva (2026-07-24)

**Objetivo:** identificar documentalmente a qual órgão pertencem as vagas de
Enfermeiro do Bloco 1 (códigos B1-07-I a B1-07-L), já que o Anexo I do Bloco 1
(fonte usada na revalidação do INCA) não nomeia o instituto de lotação para
nenhuma delas.

**Fonte oficial que resolveu a vinculação:** planilha **"Cargos e Salários
CPNU2"** (`REMUNERAÇÕES DOS CARGOS DO CONCURSO PÚBLICO NACIONAL UNIFICADO 2`),
publicada pelo Ministério da Gestão e Inovação em Serviços Públicos (MGI) e
linkada oficialmente pela própria página de concursos do Ministério da Saúde
(`gov.br/saude/pt-br/acesso-a-informacao/concursos-e-selecoes/concursos/edital-cpnu-2025`,
seção "Quadro de vagas"). URL do arquivo:
`gov.br/gestao/pt-br/concursonacional/cpnu-2/cargos-e-salarios-cpnu-2/cargos_salarios_cpnu2_-1.xlsx`.

Diferente do Anexo I (que agrupa tudo sob "Ministério da Saúde (MS)"), esta
planilha **desagrega por unidade subordinada**, com colunas Órgão / Cargo /
Nível / Quantidade de vagas / Remuneração. Extração completa (via `zipfile`/XML,
já que é um .xlsx real) mostrou três linhas de órgão distintas para as 3
unidades de saúde do Rio de Janeiro:

| Órgão (linha da planilha) | Cargo | Nível | Vagas | Remuneração inicial |
|---|---|---|---|---|
| Ministério da Saúde - Instituto Nacional de Câncer (INCA) | (sem Enfermeiro — apenas Pesquisador/Analista/Técnico) | — | — | — |
| Ministério da Saúde - **Instituto Nacional de Cardiologia (INC)** | **Enfermeiro** | Superior | **17** | R$ 5.982,49 |
| Ministério da Saúde - **Instituto Nacional de Traumatologia e Ortopedia (INTO)** | **Enfermeiro** | Superior | **5** | R$ 5.982,49 |

Os números batem exatamente com os 4 códigos do Anexo I do Bloco 1:

- **INC = 17 vagas** = soma de B1-07-I (Cardiologia, 5) + B1-07-J (Terapia
  Intensiva, 7) + B1-07-K (Pediatria, 5).
- **INTO = 5 vagas** = exatamente B1-07-L (Enfermagem Geral, 5).

Essa reconciliação (quantidade + remuneração idênticas) confirma, de forma
cruzada e por fonte primária, que **B1-07-L (Enfermeiro — Enfermagem Geral,
5 vagas) pertence ao INTO**, e que B1-07-I/J/K pertencem ao INC — resolvendo
também, retroativamente, a dúvida remanescente da revalidação do INCA (nenhum
dos 4 códigos de Enfermeiro do Bloco 1 pertence ao INCA).

O valor de R$ 7.159,87 citado por blogs de concurso não corresponde a nenhuma
linha oficial encontrada; foi descartado como impreciso.

**Conclusão: CONFIRMAÇÃO OFICIAL POSITIVA — corresponde ao INTO.** Cargo
Enfermeiro, especialidade Enfermagem Geral, código B1-07-L, 5 vagas. Pronto
para seguir ao pipeline de produção (Localização da prova objetiva e gabarito
oficiais do CNU 2ª edição, Bloco 1, aplicada em 05/10/2025).
