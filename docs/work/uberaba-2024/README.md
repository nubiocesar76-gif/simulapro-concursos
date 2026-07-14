# Prefeitura de Uberaba 2024 (Instituto AOCP) — cargo Enfermeiro

- Nome do concurso: Concurso Público — Edital nº 001/2024
- Órgão: Prefeitura Municipal de Uberaba (MG)
- Banca: Instituto AOCP
- Cargo utilizado: **Enfermeiro Padrão** (nível superior, 7 vagas de ampla concorrência).
- Status: **CANCELADA — prova e gabarito inacessíveis em qualquer fonte verificada**
  ☑ Edital
  ☐ Prova (inacessível — ver "Fontes e esgotamento de alternativas")
  ☐ Gabarito definitivo (inacessível — ver "Fontes e esgotamento de alternativas")
  ☑ Formato validado — A–D (4 alternativas), **suportado pelo pipeline** desde a
     sprint estrutural de adaptação da V1 (não é mais motivo de pausa)
  ☐ CSV
  ☐ questions.json
  ☐ Seed
  ☐ Validado

Questões importadas: **0** (nenhum conteúdo de questão foi localizado em nenhuma
fonte acessível; nada foi transcrito para não fabricar conteúdo).

## Pré-checagem

1. Cargo Enfermeiro? **SIM** — "Enfermeiro Padrão", nível superior, Tabela 10.4 do
   Edital (Todos os cargos de Nível Superior, exceto 412 e 496), 7 vagas de ampla
   concorrência.
2. Edital público? **SIM** — edital consolidado (com todas as retificações até
   06/06/2024) obtido diretamente do portal oficial da Prefeitura de Uberaba
   (`uberaba.mg.gov.br`), já salvo em `docs/work/uberaba-2024/edital.pdf`.
3. Prova pública? **Divulgada pela banca, porém tecnicamente inacessível** — ver
   "Fontes e esgotamento de alternativas".
4. Gabarito definitivo público? **Divulgado pela banca, porém tecnicamente
   inacessível** — mesma situação da prova.
5. Formato da prova: **A–D (4 alternativas)** — confirmado pelo item 10.3 do Edital
   ("Cada questão da Prova Objetiva terá 4 (quatro) alternativas"). Esse formato já
   é suportado pelo pipeline (`convert:questions` / `seed:questions`) desde a sprint
   estrutural anterior, portanto **não é mais motivo de pausa** — o bloqueio desta
   sprint é exclusivamente a indisponibilidade do conteúdo das questões.

## Fontes e esgotamento de alternativas

Nesta sprint foram tentados, de forma exaustiva, todos os canais já utilizados com
sucesso em sprints anteriores para contornar bloqueios de bancas examinadoras, sem
êxito:

1. **Site oficial do Instituto AOCP** (`institutoaocp.org.br/concursos/603`):
   retorna desafio Cloudflare (HTTP 403) para requisições diretas (`curl`,
   `WebFetch`). Uma tentativa de navegação com o navegador real (que executa
   JavaScript e poderia, em tese, resolver o desafio) **travou indefinidamente**
   (timeout de 300s sem carregar a página), confirmando bloqueio efetivo mesmo para
   acesso automatizado com navegador completo.
2. **Wayback Machine (CDX API)**: buscas por `institutoaocp.org.br/concursos/*`,
   `institutoaocp.org.br/concursos/arquivos/*uberaba*` e variações não retornaram
   nenhum arquivo arquivado — diferentemente de sprints anteriores (ex.: FMS
   Niterói, SESAU Recife), o Wayback Machine não possui nenhuma captura deste
   concurso específico.
3. **Portal oficial da Prefeitura de Uberaba** (galeria "Pasta processo_seletivo /
   CONCURSO GERAL_001_2024"): contém apenas documentos administrativos (edital e
   retificações, editais de resultado/homologação, decretos de nomeação/designação).
   Não há prova nem gabarito hospedados nesse portal.
4. **pciconcursos.com.br**: não existe página de simulador/download para o cargo
   Enfermeiro Padrão deste concurso específico (verificado tanto na listagem
   `/provas/aocp-enfermeiro` quanto na página agregadora do concurso
   `/concursos/prefeitura-de-uberaba-mg` — nenhum link de prova para 2024).
5. **questoes.grancursosonline.com.br**: possui uma "prova comentada" com as 40
   questões do cargo, incluindo botões de download de Edital/Prova/Gabarito, mas
   todo o conteúdo (inclusive os links de download) está **bloqueado atrás de
   assinatura paga** ("Assinatura Ilimitada"), sem acesso gratuito ao texto das
   questões ou aos PDFs.
6. **Agregadores de notícias** (fiibrasil.com, acheconcursos.com.br): publicam
   apenas informações administrativas sobre datas de divulgação do gabarito, sem
   reproduzir seu conteúdo nem linkar diretamente para os PDFs oficiais.

Diante da impossibilidade de obter o conteúdo do caderno de questões ou do gabarito
de qualquer fonte verificada e gratuita, e para não fabricar ou adaptar conteúdo
(precedente estabelecido nas sprints anteriores deste projeto), **nenhuma questão
foi transcrita**. Apenas o `edital.pdf` permanece salvo em
`docs/work/uberaba-2024/` para referência futura, caso uma fonte alternativa se
torne disponível.

## Encerramento

Diferentemente da sprint anterior (pausada por formato A–D, já resolvido), esta
sprint é encerrada como **cancelada por indisponibilidade de fonte**, já que
faltam a prova e o gabarito — condição que, em todas as sprints deste projeto,
determina cancelamento em vez de importação parcial ou adaptada.
