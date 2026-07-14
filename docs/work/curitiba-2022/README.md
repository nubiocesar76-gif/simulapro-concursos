# Prefeitura de Curitiba 2022 (NC/UFPR)

- Nome do concurso: Concurso Público Prefeitura de Curitiba Edital nº 10/2022
- Órgão: Prefeitura Municipal de Curitiba / PR
- Banca: Núcleo de Concursos da UFPR (NC/UFPR)
- Cargo: Enfermeiro – Área de Atuação: Saúde (código 208, 20 vagas)
- Status:
  ☑ Edital
  ☑ Prova
  ☑ Gabarito definitivo
  ☑ CSV
  ☑ questions.json
  ☑ Seed
  ☑ Validado (verificação via DB)

Questões importadas: 35 de 40 (5 anuladas: 13, 15, 16, 29, 37).

## Pré-checagem (antes do download)

1. Existe cargo Enfermeiro? SIM (código 208, 20 vagas, Edital nº 10/2022).
2. Existe edital público? SIM.
3. Existe prova pública? SIM.
4. Existe gabarito definitivo público? SIM (publicado em 09/01/2023, pós-recursos).

Todas as respostas SIM → sprint prosseguiu conforme o fluxo homologado.

## Fontes

Todos os documentos foram obtidos diretamente do portal oficial da NC/UFPR
(servicos.nc.ufpr.br), sem necessidade de mirror externo:

- Edital nº 10/2022: https://servicos.nc.ufpr.br/PortalNC/obterDocumento?pub=4559
- Prova + Gabarito definitivo (cargo 208 – Enfermeiro): https://servicos.nc.ufpr.br/documentos/pmc2022/provas/gabDefinitivo/208.pdf

A NC/UFPR publica, na fase pós-recursos, um único documento consolidado
("Provas e Gabaritos Definitivos") que reproduz o caderno de prova completo
com a alternativa correta marcada (►) e as questões anuladas identificadas
com asterisco (*), incluindo a nota de rodapé "Questão anulada, portanto
todos os candidatos serão pontuados". Por isso o mesmo arquivo (208.pdf) foi
salvo como `prova.pdf` e como `gabarito.pdf` — trata-se do mesmo artefato
oficial, que já contém ambas as informações.

Questões anuladas (excluídas do banco, conforme gabarito oficial):
13 (segurança da informação), 15 (periféricos de computador),
16 (Lei 9.000/1996 – competências do gestor municipal),
29 (interação medicamentosa – Vitamina D), 37 (atributos da RAS).

A questão 34 foi "revertida à condição do gabarito preliminar" (não é
anulada) — importada normalmente com a resposta do gabarito preliminar (a).

## Taxonomia

Reuso quase integral da taxonomia existente. 4 assuntos (tópicos) genuinamente
inéditos foram criados, todos dentro de disciplinas já existentes (nenhuma
disciplina nova):

- `legislacao-do-sus` → `politica-nacional-de-atencao-basica-pnab`
- `legislacao-municipal-e-institucional` → `lei-9000-1996-codigo-de-saude-de-curitiba`
- `saude-da-crianca-e-do-adolescente` → `principais-afeccoes-dermatologicas-do-recem-nascido`
- `urgencia-e-emergencia` → `crise-convulsiva-e-emergencias-neurologicas`

1 concurso novo: `concurso-publico-prefeitura-de-curitiba-edital-10-2022`
(banca `ufpr-nc`, já existente na taxonomia).
