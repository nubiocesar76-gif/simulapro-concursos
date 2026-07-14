# Prefeitura de Belo Horizonte 2014 (IBFC) — cargo Enfermeiro

- Nome do concurso: Concurso Público — Edital nº 07/2014 — Área da Saúde (Edital de Abertura
  publicado em 12/12/2014; inscrições 23/02/2015 a 07/04/2015; prova aplicada em 24/05/2015)
- Órgão: Prefeitura Municipal de Belo Horizonte (MG)
- Banca: IBFC (Instituto Brasileiro de Formação e Capacitação) — `concursos.ibfc.org.br`
- Cargo utilizado: **Enfermeiro** (nível superior — especializações "Ciência da Informação, Saúde
  Pública ou Epidemiologia").
- Status: **CANCELADA — prova (caderno de questões) inacessível em qualquer fonte verificada e
  legítima**
  ☑ Edital
  ☒ Prova (inacessível — ver "Fontes e esgotamento de alternativas")
  ☑ Gabarito definitivo (após recursos, não preliminar)
  ☐ Formato — não confirmável sem o caderno de questões (o gabarito mostra apenas as letras A–D,
     sem o texto das questões)
  ☐ CSV
  ☐ questions.json
  ☐ Seed
  ☐ Validado

Questões importadas: **0** (sem o caderno de questões, não é possível transcrever nenhum conteúdo
sem fabricá-lo).

## Pré-checagem

1. Cargo Enfermeiro? **SIM** — cargo "Enfermeiro", especializações "Ciência da Informação", "Saúde
   Pública" e "Epidemiologia", nível superior, presente no gabarito oficial após recursos.
2. Edital público? **SIM** — Edital de Abertura nº 07/2014, obtido diretamente do portal oficial da
   IBFC (`f4fd22e0b5ca75ed014751fe5b3b7476.pdf`, publicado em 12/12/2014), salvo em
   `docs/work/prefeitura-bh-2014/edital.pdf`.
3. Prova pública? **NÃO** — o link oficial "Caderno de Questões – ENFERMEIRO – Ciência Da
   Informação, Saúde Pública Ou Epidemiologia" no portal da IBFC está desativado, exibindo a
   mensagem "Este link não está mais disponível para acesso." Essa indisponibilidade não é
   específica do cargo Enfermeiro: **todos os 8 links de "Caderno de Questões"** listados para este
   concurso (Médico em suas diversas especialidades, Técnico de Serviços de Saúde, Cirurgião
   Dentista, Técnico Superior de Saúde, Engenheiro e Enfermeiro) apresentam o mesmo link morto,
   indicando remoção geral dos cadernos de prova do portal da banca após o período de retenção —
   mesmo padrão já observado na sprint da Prefeitura de Fernandópolis 2015 (também banca IBFC).
4. Gabarito definitivo público? **SIM** — "Gabaritos Após Recursos" (24/06/2015, não preliminar),
   obtido diretamente do portal oficial da IBFC (`f8218279135a6c148d7311e8424643de.pdf`), documento
   multi-cargo (16 páginas) contendo a tabela de respostas do cargo Enfermeiro (incluindo ao menos
   uma questão anulada), salvo em `docs/work/prefeitura-bh-2014/gabarito_apos_recursos.pdf`. **Não
   foi usado** o gabarito preliminar (26/05/2015).
5. Formato da prova: **não confirmável** — o gabarito após recursos mostra apenas letras de resposta
   (A a D, sem ocorrência de E, sugerindo formato A–D), mas essa inferência não substitui a
   confirmação direta pela capa do caderno, que está inacessível.

## Fontes e esgotamento de alternativas (para a prova)

1. **Portal oficial da IBFC** (`concursos.ibfc.org.br/informacoes/246/`, aba "Provas e Gabaritos"):
   o link do caderno de questões do Enfermeiro é um `javascript:;` com alerta "Este link não está
   mais disponível para acesso." Verificação sistemática confirmou que **todos os 8** links de
   "Caderno de Questões" da página (para qualquer cargo/especialidade) estão identicamente mortos —
   apenas o Edital de Abertura e os Gabaritos (preliminar e após recursos) permanecem disponíveis.
2. **Qconcursos.com**: buscas específicas pela prova de Enfermeiro (Ciência da Informação/Saúde
   Pública/Epidemiologia) da Prefeitura de Belo Horizonte, IBFC 2015, não retornaram nenhuma página
   de prova indexada nesse site para este concurso específico (diferentemente da sprint EBSERH
   2013, na qual esse mirror esteve disponível e foi utilizado com sucesso).
3. **pciconcursos.com.br**: localizada a página de download da prova de Enfermeiro
   (`/provas/download/enfermeiro-saude-publica-e-epidemiologia-prefeitura-belo-horizonte-mg-ibfc-2015`),
   listando os arquivos `saude-publica-ou-epidemiologia.pdf` (prova) e `gab-preliminar.pdf`
   (gabarito preliminar — que, de todo modo, não seria utilizável por não ser a versão definitiva).
   O acesso a esses arquivos está protegido por verificação de segurança/CAPTCHA ("Complete a
   verificação abaixo para acessar os arquivos desta página"), a exemplo do Cloudflare Turnstile já
   identificado na sprint de Fernandópolis 2015. Contornar ou resolver CAPTCHAs é uma ação
   expressamente proibida nas diretrizes de segurança deste projeto, e por isso **não foi
   tentado**.
4. **Outras fontes** (estudegratis.com.br, gabarite.com.br, romulopassos.com.br): buscas não
   retornaram nenhum resultado com o caderno de questões completo desta prova especificamente; o
   único achado em `gabarite.com.br` (notícia sobre o gabarito) retornou erro HTTP 403 ao ser
   acessado.

Diante da impossibilidade de obter o caderno de questões de qualquer fonte legítima e acessível — e
para não fabricar o conteúdo das questões a partir apenas do gabarito (que contém somente as letras
corretas, sem enunciados nem alternativas) —, **nenhuma questão foi transcrita**.

## Encerramento

Conforme a regra explícita desta sprint ("Se faltar qualquer documento: cancelar imediatamente"),
esta sprint é encerrada como **cancelada por indisponibilidade da prova**. Edital e gabarito
definitivo (após recursos) permanecem salvos em `docs/work/prefeitura-bh-2014/` para referência
futura, caso uma fonte alternativa e legítima do caderno de questões se torne disponível. Nenhuma
alteração foi feita em CSV, JSON ou banco de dados.
