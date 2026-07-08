# 02k — Sistematização da Assistência de Enfermagem (SAE) (`sistematizacao-da-assistencia-de-enfermagem-sae`)

## 0. Alerta de inconsistência de dados (ação requerida)

Hoje `docs/seeds/taxonomy.json` contém **"Sistematização da Assistência de
Enfermagem (SAE)"** em dois lugares:
- como `topic` (subassunto) dentro de "Fundamentos de Enfermagem" (order 35);
- como `subject` (disciplina) isolado, de mesmo nome e mesmo slug (order 24).

Isso não é uma opção editorial — é uma duplicidade que vai gerar
classificação inconsistente de questões (a mesma questão pode cair em dois
lugares diferentes dependendo de qual nó o importador escolher). **Decisão
editorial deste documento**: manter SAE como **disciplina própria** (nível
`subject`), pelo peso que o tema tem isoladamente nas 10 bancas de
referência (é cobrado com frequência Alta/Muito Alta, comparável a
Fundamentos), e **remover o `topic` duplicado de dentro de "Fundamentos de
Enfermagem"** na próxima atualização do `taxonomy.json`. O "Processo de
Enfermagem" (topic order 29 de Fundamentos) permanece em Fundamentos apenas
como introdução conceitual (o que é, histórico), enquanto SAE (disciplina)
aprofunda as 5 etapas normatizadas pela Resolução COFEN 358/2009 e as
taxonomias (NANDA-NOC-NIC, CIPE).

## 1. Sinônimos usados pelas bancas
"SAE", "Processo de Enfermagem" (tratado como sinônimo direto por FGV e
IDECAN), "Metodologia da Assistência de Enfermagem — MAE" (termo mais
antigo, ainda usado por IBFC e FAFIPA em provas anteriores a 2015),
"Diagnóstico de Enfermagem" (quando a banca reduz o bloco só a esse eixo).

## 2. Palavras-chave centrais
histórico de enfermagem, exame físico, diagnóstico de enfermagem,
planejamento, implementação, avaliação, taxonomia NANDA-I, CIPE, NOC, NIC,
prescrição de enfermagem, evolução de enfermagem.

## 3. Siglas
SAE, PE (Processo de Enfermagem), NANDA-I (North American Nursing Diagnosis
Association International), NOC (Nursing Outcomes Classification), NIC
(Nursing Interventions Classification), CIPE/ICNP (Classificação
Internacional para a Prática de Enfermagem), MAE (Metodologia da
Assistência de Enfermagem).

## 4. Assuntos e subassuntos

**Assunto: Base Normativa e Conceitual**
- Resolução COFEN nº 358/2009 (dispõe sobre a SAE e a implementação do
  Processo de Enfermagem) (`resolucao-cofen-358-2009-sae`)
- Conceito e Finalidade da SAE (`conceito-e-finalidade-da-sae`)
- Obrigatoriedade da SAE em Ambiente Público e Privado (`obrigatoriedade-da-sae`)

**Assunto: As 5 Etapas do Processo de Enfermagem**
1. Coleta de Dados / Histórico de Enfermagem (`coleta-de-dados-historico-de-enfermagem`)
2. Diagnóstico de Enfermagem (`diagnostico-de-enfermagem`)
3. Planejamento de Enfermagem (`planejamento-de-enfermagem`)
4. Implementação (`implementacao-de-enfermagem`)
5. Avaliação de Enfermagem (`avaliacao-de-enfermagem`)

**Assunto: Taxonomias e Sistemas de Classificação**
- Taxonomia NANDA-I (Domínios e Classes) (`taxonomia-nanda-i`)
- Classificação NOC (Resultados de Enfermagem) (`classificacao-noc`)
- Classificação NIC (Intervenções de Enfermagem) (`classificacao-nic`)
- Ligações NANDA-NOC-NIC (NNN Linkage) (`ligacoes-nanda-noc-nic`)
- CIPE / ICNP (`cipe-icnp`)

**Assunto: Registro e Documentação**
- Prescrição de Enfermagem (`prescricao-de-enfermagem`)
- Evolução de Enfermagem (`evolucao-de-enfermagem`)
- Prontuário Eletrônico e Registro da SAE (`prontuario-eletronico-e-registro-sae`)

## 5. Leis, protocolos, portarias, programas
- Resolução COFEN nº 358/2009 (norma central e mais citada da disciplina).
- Resolução COFEN nº 429/2012 (registros de enfermagem no prontuário —
  citada em conjunto com SAE quando o tema é documentação).
- Lei nº 7.498/1986 (base legal do ato privativo de "prescrição da
  assistência de enfermagem").

## 6. Casos ambíguos
- **SAE vs. Ética e Legislação em Enfermagem**: ver `02b` seção 1.6 — regra:
  citação explícita da resolução como norma → pode ir para Ética/Legislação;
  descrição das etapas do processo → SAE.
- **Diagnóstico de Enfermagem vs. Diagnóstico Médico**: questões que listam
  diagnósticos de enfermagem (ex.: "Padrão respiratório ineficaz
  relacionado a...") são SAE; questões sobre diagnóstico de doença
  (patologia) pertencem à disciplina clínica correspondente. É um erro
  comum de bancas menos rigorosas misturar os dois em um mesmo item — quando
  isso ocorrer em uma prova real, classificar pelo **verbo/estrutura da
  taxonomia NANDA** (título do diagnóstico + fator relacionado + características
  definidoras) como critério decisivo.
- **SAE vs. Administração em Enfermagem**: implementação de SAE como
  *política institucional* (indicador de adesão, auditoria de prontuário)
  pode ser cobrada em Administração; a *técnica de elaborar* cada etapa é
  SAE.

## 7. Assuntos que aparecem juntos
As 5 etapas do processo quase sempre aparecem em sequência numa mesma
questão (associação ou ordenação); Diagnóstico de Enfermagem + Taxonomia
NANDA-I + Ligação NNN; Prescrição de Enfermagem + Evolução de Enfermagem +
Registros (Fundamentos).
