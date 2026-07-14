# Prefeitura de Fernandópolis 2015 (IBFC) — cargo Enfermeiro

- Nome do concurso: Concurso Público — Edital nº 03/2015 (Saúde)
- Órgão: Prefeitura Municipal de Fernandópolis (SP)
- Banca: IBFC (Instituto Brasileiro de Formação e Capacitação) —
  `concursos.ibfc.org.br` / `fs.ibfc.org.br`
- Cargo utilizado: **Enfermeiro** (nível superior, IBFC_63, prova aplicada em
  08/11/2015).
- Status: **CANCELADA — prova (caderno de questões) inacessível em qualquer
  fonte verificada e legítima**
  ☑ Edital
  ☒ Prova (inacessível — ver "Fontes e esgotamento de alternativas")
  ☑ Gabarito definitivo (após recursos, não preliminar)
  ☑ Formato validado — **A–D (4 alternativas)**, identificável a partir do
     próprio gabarito (nenhuma questão tem alternativa E)
  ☐ CSV
  ☐ questions.json
  ☐ Seed
  ☐ Validado

Questões importadas: **0** (sem o caderno de questões, não é possível
transcrever nenhum conteúdo sem fabricá-lo).

## Pré-checagem

1. Cargo Enfermeiro? **SIM** — cargo "IBFC_63 - ENFERMEIRO", nível superior,
   Edital nº 03/2015 – Saúde.
2. Edital público? **SIM** — obtido diretamente do portal oficial da IBFC
   (`869e43dafa1ea922d64d07dedcf2b879.pdf`, publicado em 22/09/2015), já salvo
   em `docs/work/fernandopolis-2015/edital.pdf`.
3. Prova pública? **NÃO** — o link oficial do "Caderno de Questões – Edital
   03/2015 – Saúde - ENFERMEIRO" no portal da IBFC está desativado, exibindo a
   mensagem "Este link não está mais disponível para acesso." Essa
   indisponibilidade não é específica do cargo Enfermeiro: **todos os 72
   links de "Caderno de Questões" desse concurso** (todos os cargos, todos os
   editais) apresentam o mesmo link morto, indicando remoção geral dos
   cadernos de prova do portal da banca após o período de retenção.
4. Gabarito definitivo público? **SIM** — "Gabarito Oficial Após Recursos"
   (não preliminar), extraído do pacote
   `Gabaritos Após Recursos - Edital N°. 03/2015 – Saúde - Nível Superior.zip`
   (30/11/2015), arquivo `IBFC_63_ENFERMEIRO_APOSRECURSOS.pdf`, salvo em
   `docs/work/fernandopolis-2015/gabarito_enfermeiro_apos_recursos.pdf`.
5. Formato da prova: **A–D (4 alternativas)** — identificável diretamente no
   gabarito (só há ocorrências das letras A, B, C e D em todas as 50
   questões, nenhuma E).

## Fontes e esgotamento de alternativas (para a prova)

1. **Portal oficial da IBFC** (`concursos.ibfc.org.br/informacoes/261/`):
   o link do caderno de questões do Enfermeiro é um `javascript:;` com alerta
   "Este link não está mais disponível para acesso." Verificação sistemática
   confirmou que **nenhum** dos 72 links de "Caderno de Questões" da página
   (para qualquer cargo) está funcional — apenas editais e gabaritos
   permanecem disponíveis.
2. **Wayback Machine (CDX API)**: a única captura existente da página
   `concursos.ibfc.org.br/informacoes/261/` é de 2025 (já com os links
   mortos); não há snapshots arquivados do período 2015–2017 que pudessem
   preservar os links originais dos cadernos de prova.
3. **pciconcursos.com.br**: localizada a página de download da prova de
   Enfermeiro (`/provas/download/enfermeiro-prefeitura-fernandopolis-sp-ibfc-2015`),
   porém o acesso aos arquivos (`enfermeiro.pdf`, `gabaritos.pdf`) está
   protegido por **Cloudflare Turnstile (CAPTCHA)** — o link real só é
   liberado após a resolução do desafio. Contornar ou resolver CAPTCHAs é uma
   ação expressamente proibida nas diretrizes de segurança deste projeto, e
   por isso **não foi tentado**.
4. **qconcursos.com / acheconcursos.com.br**: busca não retornou nenhum
   resultado correspondente a esta prova específica (Enfermeiro, Fernandópolis,
   IBFC, 2015).

Diante da impossibilidade de obter o caderno de questões de qualquer fonte
legítima e acessível — e para não fabricar o conteúdo das questões a partir
apenas do gabarito (que contém somente as letras corretas, sem enunciados nem
alternativas) —, **nenhuma questão foi transcrita**.

## Encerramento

Conforme a regra explícita desta sprint ("Se faltar qualquer documento:
cancelar imediatamente"), esta sprint é encerrada como **cancelada por
indisponibilidade da prova**. Edital e gabarito definitivo (após recursos)
permanecem salvos em `docs/work/fernandopolis-2015/` para referência futura,
caso uma fonte alternativa e legítima do caderno de questões se torne
disponível.
