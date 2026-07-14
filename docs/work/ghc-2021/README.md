# GHC 2021 (Fundatec) — cargo Enfermeiro — SPRINT CANCELADA

Status: ☒ Cancelada — prova e gabarito definitivo não puderam ser obtidos de
fonte pública verificável.

## Pré-checagem

1. Existe cargo Enfermeiro? **SIM.** Cargo "Enfermeiro (Intensivista Adulto)",
   Concurso Público nº 02/2021 do Grupo Hospitalar Conceição (GHC/RS),
   organizado pela Fundatec. Prova aplicada em 14/03/2021, nível superior,
   40 questões (Enfermagem 25, Português 5, Direito Sanitário 5). Fontes:
   qconcursos.com (página de listagem) e fundatec.org.br (referência ao
   "Edital 02").
2. Existe edital público? **Indício de SIM**, mas não confirmável por
   download direto (ver "Motivo do cancelamento").
3. Existe prova pública? **Não confirmável por download direto** — ver abaixo.
4. Existe gabarito definitivo público? **Não confirmável por download
   direto** — ver abaixo.
5. A prova possui 5 alternativas (A–E) em todas as questões? **Não
   verificável**, pois não foi possível abrir o caderno de prova.

Como os itens 3 e 4 não puderam ser confirmados por acesso efetivo e
verificado ao documento (apenas por referências de terceiros, sem download
íntegro possível), a sprint foi cancelada por precaução, sem baixar,
transcrever ou alterar banco/pipeline.

## Motivo do cancelamento

Tentativas de acesso às três fontes usualmente disponíveis para provas de
concursos públicos brasileiros falharam para este item específico:

1. **Portal oficial da Fundatec** (fundatec.org.br e o subdomínio
   publicacoes.fundatec.com.br): todas as requisições retornaram HTTP 202
   com corpo vazio ou timeout de conexão — o site está protegido por
   anti-bot (Cloudflare) e não permite acesso automatizado nem por
   ferramenta de fetch de página.
2. **qconcursos.com**: a página de listagem do exame
   (fundatec-2021-ghc-rs-enfermeiro-intensivista-adulto) foi acessível uma
   única vez de forma resumida (confirmando metadados: banca, cargo, data,
   nº de questões), mas todas as tentativas subsequentes de obter os links
   diretos de download (padrão arquivos.qconcursos.com/prova/arquivo_prova/
   {id}/...) retornaram HTTP 403. Sem o ID numérico exato do arquivo, não
   há como montar a URL de download (o CDN exige o par {id}+{slug} exato;
   tentativas com slug correto e IDs vizinhos retornaram 403 uniformemente).
3. **msconcursos.com.br** (mirror usado pela Fundatec para publicação de
   gabaritos/provas): um arquivo com o nome exato
   "GHC 2 - GABARITO DEFINITIVO - ENFERMEIRO (INTENSIVISTA ADULTO).pdf"
   foi localizado, mas a verificação via Wayback Machine (web.archive.org)
   mostrou que esse mesmo arquivo já existia com o **hash de conteúdo
   idêntico** em uma captura de 22/01/2019 — ou seja, antes mesmo do
   concurso de 2021 ter ocorrido. Isso indica que a Fundatec reutiliza a
   mesma URL para cargos de mesmo nome em concursos diferentes ao longo do
   tempo, e o conteúdo atualmente hospedado nessa URL não corresponde
   com segurança ao concurso de 2021. Usar esse arquivo arriscaria
   transcrever questões de um concurso diferente (provavelmente anterior a
   2019) sob o rótulo de "GHC 2021", violando a exigência de fonte
   verificada.
4. **Portal oficial do GHC** (ghc.com.br / ghc.com.br/portalrh): não
   expõe um arquivo histórico específico para este concurso na navegação
   testada.

## Conclusão

Não foi possível confirmar, por download efetivo e verificável, a prova
objetiva e o gabarito definitivo do concurso GHC 2021 (Fundatec) —
Enfermeiro (Intensivista Adulto). Nenhum arquivo foi baixado, nenhuma
questão foi transcrita, e nenhuma alteração foi feita no banco, taxonomia
ou pipeline.
