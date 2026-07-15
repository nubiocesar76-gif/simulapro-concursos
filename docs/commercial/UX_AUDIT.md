# UX_AUDIT — Auditoria de Experiência do Aluno e Conversão

**Documento:** Análise da experiência completa do aluno, do primeiro clique à sessão de estudo
**Data:** 2026-07-15
**Papel assumido:** UX Researcher / UX Writer / Product Designer / Especialista em Conversão / Especialista em SaaS / Especialista em Concursos
**Escopo:** apenas auditoria de experiência. Nenhum código foi escrito, nenhum componente foi criado, nenhuma funcionalidade nova foi proposta. Toda recomendação é compatível com a V1 existente — nenhuma sugere redesign.

---

## 0. Metodologia

Esta auditoria foi feita lendo o código-fonte real de cada tela (componentes React efetivamente em produção), não mockups nem a documentação comercial isoladamente — inclusive onde isso revelou uma divergência entre o que foi aprovado em `04-LANDING.md` e o que está de fato no ar. Onde uma tela exige autenticação (Portal do Aluno), a análise foi feita a partir do componente e da cópia reais, com o mesmo rigor que uma inspeção visual teria — estados de carregamento, mensagens de vazio, textos de botão, hierarquia de informação e fluxo de navegação são todos verificáveis diretamente no código, sem necessidade de suposição.

**Pergunta central respondida em cada tela:** se um enfermeiro entrar hoje no SimulaPro, o que gera confiança, o que gera dúvida, e o que reduz a conversão?

---

## 1. Achado mais crítico — a Landing real não é a Landing aprovada

Antes de entrar tela por tela: a página em `/` hoje em produção (`src/routes/index.tsx`) **não é** a Landing Page especificada e aprovada em `04-LANDING.md`. É uma página genérica de scaffold, sem qualquer menção a Enfermagem, ao Acervo, ao Plano Fundador, a preço, a garantia ou a prova social. Isso muda a leitura de todas as outras telas — muito do que `04-LANDING.md` foi desenhado para resolver (confiança, especialização, prova de valor antes da compra) simplesmente não existe ainda na experiência real do visitante. Este achado está detalhado na seção 2.1 e classificado como P0.

---

## 2. Análise por tela

### 2.1 Landing (`/`)

- **O que transmite confiança:** pouco. Visual limpo e profissional (tipografia, espaçamento, cards de benefício), mas sem nenhuma prova concreta.
- **O que parece inacabado:** a página inteira. Título genérico ("Prepare-se para concursos com estrutura profissional"), sem menção a Enfermagem, sem número de questões, sem bancas, sem preço, sem garantia, sem FAQ, sem comparativo — nenhuma das 19 seções aprovadas em `04-LANDING.md` está implementada.
- **O que parece confuso:** o botão **"Painel Admin" aparece publicamente no cabeçalho e na seção principal**, ao lado de "Entrar como Aluno". Qualquer visitante — inclusive um concorrente ou um bot — vê imediatamente que existe um painel administrativo, antes mesmo de saber o que o produto faz.
- **O que falta explicar:** que é uma plataforma exclusiva para Enfermagem (hoje soa genérica, como qualquer banco de questões de concurso); qual é o cargo, quais bancas, quantas questões; qual é a oferta real (não há preço, não há nome do plano, não há CTA de compra).
- **Excesso de informação:** nenhum.
- **Falta de informação:** quase tudo que sustenta a decisão de compra — prova, preço, garantia, comparativo, FAQ.
- **O aluno entende o que fazer?** Não fica claro se deve "Entrar como Aluno" (criar conta) ou já existe conta — o botão não deixa claro que é o início do cadastro, e não há nenhuma indicação do que acontece depois de clicar.
- **Etapa escondida:** a oferta real (Plano Fundador, preço, garantia) só aparece depois do cadastro, dentro de `/app/subscription` — hoje isso significa que o visitante decide entrar sem nenhuma informação de preço ou proposta de valor específica, o oposto do que `04-LANDING.md` recomenda (mostrar valor antes da oferta, nunca esconder o preço até depois do compromisso de criar conta).

**Classificação: P0.** É o ponto de maior impacto em toda a auditoria — sem isso, nenhuma outra melhoria de conversão tem efeito, porque o visitante nunca chega a entender a oferta.

**Duas correções pequenas e imediatas (não é o redesign completo, que é maior que uma "melhoria pequena"):**
- Remover o botão/link público "Painel Admin" da página inicial — é uma linha de código, resolve o problema de confiança/exposição imediatamente.
- Trocar o título e subtítulo genéricos por uma versão mínima que já mencione Enfermagem, o número real de questões e as bancas (mesmo sem implementar as 19 seções completas) — reaproveita a copy já aprovada em `04-LANDING.md` §3.1/3.2 sem precisar construir a página inteira agora.

---

### 2.2 Cadastro / Login (`/auth`)

- **O que transmite confiança:** visual limpo, abas claras "Entrar"/"Criar conta", formulário curto (nome, e-mail, senha) — baixa fricção.
- **O que parece inacabado:** a tela não tem nenhum vínculo visual ou textual com a oferta (Plano Fundador). Um visitante que chega até aqui não vê nenhuma reafirmação do que vai encontrar depois.
- **O que falta explicar:** exatamente o texto que `05-CHECKOUT.md` §3.2 já recomenda — "Depois de criar sua conta, você escolhe o Plano Fundador na próxima tela" — está escrito na documentação, mas não está na tela real.
- **O aluno entende o que fazer?** Sim, o formulário em si é direto — mas não há contexto do "próximo passo", o que é a origem exata do gap de abandono já identificado tecnicamente (ausência de nudge pós-cadastro).
- **Etapa escondida:** não existe link "Esqueci minha senha" — um aluno que errar a senha não tem nenhuma saída visível na própria tela, só pode tentar de novo ou criar conta nova.

**Classificação: P1.** Adicionar uma linha de apoio abaixo do formulário de cadastro ("Depois de criar sua conta, você escolhe o Plano Fundador na tela seguinte") é uma melhoria de uma linha de texto, sem nenhuma mudança estrutural — reaproveita copy já escrita e aprovada.

---

### 2.3 Dashboard (`/app`)

- **O que transmite confiança:** estrutura muito boa — "O que fazer agora" e "Como você está indo" dividem claramente ação imediata de acompanhamento de progresso. Esqueleto de carregamento (skeleton) bem construído, comunica que o conteúdo virá, sem tela em branco.
- **O que parece confuso:** quando o aluno não tem nenhuma distribuição liberada, a mensagem é **"Fale com o administrador para ativar sua assinatura."** Isso é uma mensagem de ferramenta corporativa interna, não de um produto de autoatendimento — e contradiz o próprio modelo comercial (o aluno deveria poder resolver isso sozinho comprando o Plano Fundador em `/app/subscription`, que já existe e já funciona).
- **O que falta explicar:** os "Atalhos de estudo" (Favoritos/Revisão/Erradas) não têm nenhuma legenda explicando a diferença entre usá-los aqui e usar a Central de Revisão (que cobre os mesmos quatro grupos, com mais filtro) — funcionalmente correto, mas dois caminhos para conceitos parecidos sem hierarquia explicada pode gerar "por qual eu uso?".
- **O aluno entende o que fazer?** Sim, quando já tem assinatura — a seção "O que fazer agora" é clara.

**Classificação: P0** para a mensagem de estado vazio (é a mesma raiz do problema da Landing: o produto empurra para contato manual em vez de para a compra self-service que já existe tecnicamente) — correção é trocar o texto e adicionar um botão para `/app/subscription`, sem nenhuma mudança de lógica.
**Classificação: P2** para a falta de diferenciação entre atalhos do Dashboard e Central de Revisão — cosmético, não bloqueia uso.

---

### 2.4 Estudo / Builder (`/app/study`)

- **O que transmite confiança:** o fluxo de 3 passos (escolher distribuição → configurar → sessão criada) é claro e previsível. O contador de questões correspondentes aos filtros escolhidos, atualizado ao vivo antes de criar a sessão, é um ótimo sinal de transparência — o aluno nunca é surpreendido com "0 questões" depois de criar.
- **O que parece confuso:** os cinco modos (Estudo, Prova, Revisão, Favoritos, Apenas Erradas) aparecem como rótulos curtos em botões de rádio, sem nenhuma explicação inline do que muda entre eles (quando a resposta é revelada, se conta para o histórico, etc.) — só o modo Prova e os modos de filtro têm uma frase de apoio; Estudo e Revisão, não.
- **O que falta explicar:** a diferença prática entre "Mostrar respostas: Durante" vs. "Apenas no final" também não tem nenhuma frase de apoio (o modo Prova tem, os outros não) — inconsistência de tratamento entre opções semelhantes.
- **O aluno entende o que fazer?** Sim, o fluxo é linear e o resumo lateral (`StudyBuilderSummary`) reforça o que foi escolhido antes de confirmar.

**Classificação: P1.** Adicionar uma frase de apoio de uma linha sob cada modo (mesmo padrão já usado para o modo Prova) — não é um componente novo, é completar um padrão que já existe parcialmente.

---

### 2.5 Sessão ativa (`/app/study/$sessionId`)

- **O que transmite confiança:** muito bem executado — cabeçalho com contador de questão, tempo decorrido e barra de progresso; estados visuais claros para alternativa selecionada/correta/errada com ícones; painel de contexto lateral (banca/disciplina/assunto) recolhível.
- **O que parece confuso:** depois de responder, aparecem **dois botões "Próxima"** simultaneamente — um dentro do painel de ações (ao lado de Favoritar/Revisar depois) e outro na barra fixa inferior. Ambos fazem exatamente a mesma coisa; não confunde o resultado, mas é uma repetição visual desnecessária que um usuário atento nota.
- **O que falta explicar:** nada de crítico — o feedback (correta/incorreta, explicação, referência bibliográfica/legal) é claro e bem hierarquizado.
- **Existe etapa desnecessária?** O botão "Próxima questão" duplicado (ver acima).

**Classificação: P2.** Ocultar o botão "Próxima questão" dentro do painel de ações quando a barra de navegação inferior já está visível (ou vice-versa) é uma alteração pontual de uma condição de exibição, não uma mudança de fluxo.

---

### 2.6 Resultados da sessão

- **O que transmite confiança:** muito bom — cartões de resumo (aproveitamento, acertos, erros, tempo), tabelas de desempenho por disciplina/assunto/banca, recomendações de revisão priorizadas por menor aproveitamento, e uma linha de ações clara ao final (Nova sessão, Revisar erros, Ver histórico, Dashboard).
- **O que parece confuso:** nada de relevante identificado.
- **O que falta explicar:** nada de crítico — os rótulos são diretos ("Corretas", "Erradas", "Aproveitamento").
- **O aluno entende o que fazer?** Sim — é a tela mais madura de toda a auditoria do ponto de vista de clareza e hierarquia de informação.

**Classificação: nenhuma ação necessária.** Esta tela deveria servir de referência de padrão para as pequenas melhorias sugeridas em outras telas (ex.: a mesma disciplina de "uma frase de apoio por opção" já vista aqui poderia ser replicada no Builder, seção 2.4).

---

### 2.7 Central de Revisão (`/app/review`)

- **O que transmite confiança:** cartões de estatística por categoria (Favoritas/Revisar/Erradas/Não Respondidas), abas claras, filtro por taxonomia consistente com o resto do produto.
- **O que parece confuso — achado concreto, não estético:** na aba **"Não Respondidas"**, o botão **"Responder"** ao lado de uma questão específica não leva a responder aquela questão — ele dispara uma sessão de Estudo genérica de 10 questões aleatórias, sem relação com o item clicado (confirmado no código: o modo de sessão não está mapeado para essa aba, e cai no comportamento padrão). Nas abas Favoritas/Revisar/Erradas, o mesmo botão pelo menos abre uma sessão com todas as questões daquele grupo — ainda não é "aquela questão específica", mas é semanticamente coerente com a aba. Só "Não Respondidas" quebra essa expectativa por completo.
- **O que falta explicar:** que o botão "Responder" abre uma sessão nova com o grupo, não a questão individual clicada — em nenhuma aba isso é dito explicitamente, mas a quebra é mais grave em "Não Respondidas" porque o resultado não tem relação alguma com o que foi clicado.
- **O aluno entende o que fazer?** Não, especificamente na aba "Não Respondidas" — a ação real diverge da expectativa criada pelo botão.

**Classificação: P1.** É uma mensagem/rótulo a ajustar (ex.: trocar o texto do botão para algo como "Estudar" em vez de "Responder" nessa aba específica, ou mapear o modo corretamente) — não exige nova arquitetura de sessão, apenas alinhar o rótulo ao comportamento real ou vice-versa.

---

### 2.8 Histórico (`/app/history`)

- **O que transmite confiança:** resumo compacto no topo (sessões, questões respondidas, aproveitamento, tempo total), filtros completos (curso, distribuição, modo, período, status), busca por texto.
- **O que parece confuso:** a tabela tem 10 colunas — bastante densa, ainda que bem resolvida tecnicamente (colunas fixas nas pontas, rolagem horizontal no meio). Para um primeiro uso, pode ser mais informação do que o aluno precisa processar de uma vez.
- **O que falta explicar:** nada crítico — os rótulos de coluna são diretos e o menu de ações por linha ("Continuar sessão"/"Ver resultado", "Refazer apenas erradas", "Estudar novamente") é claro.
- **Excesso de informação:** moderado — 10 colunas é mais denso que o necessário para a maioria das consultas do dia a dia.

**Classificação: P2.** Não é um problema de confiança ou conversão, é densidade de informação — poderia se beneficiar de esconder 1–2 colunas menos usadas (ex.: "Pacote") por padrão, mas não é urgente.

---

### 2.9 Minha Assinatura (`/app/subscription`)

- **O que transmite confiança:** consulta de status ao vivo direto do Asaas (não depende de atualização manual de página), botão "Atualizar" como reforço, e o modal de checkout já avisa antes do redirecionamento ("Você será redirecionado ao checkout seguro do Asaas") — isso é uma boa prática já presente no código.
- **O que parece inacabado:** o link "Gerenciar pagamento" abre uma URL externa (ícone de link externo já indica isso visualmente, o que é positivo), mas não há nenhuma frase de apoio avisando que é um site diferente do SimulaPro — para um usuário menos familiarizado com fintechs, isso pode gerar a mesma desconfiança de "por que fui redirecionado sem aviso" que o próprio modal de checkout já se preocupa em evitar em outro ponto do fluxo.
- **O que falta explicar:** não há, na própria tela, nenhuma menção a como pedir reembolso ou cancelar — o aluno não sabe, olhando só para esta tela, que existe uma garantia de 7 dias nem como exercê-la (essa informação vive em `08-FAQ.md`/`04-LANDING.md`, não nesta tela).
- **Etapa escondida:** o caminho para reembolso/cancelamento não está em lugar nenhum da interface — é inteiramente dependente de um canal de suporte que, como já registrado na auditoria técnica, ainda não foi formalizado.

**Classificação: P1** para a ausência de aviso de link externo (pequena frase de apoio, sem mudança de comportamento). **P2** para a ausência de menção à garantia — depende de decisão de produto sobre onde/como isso deve aparecer, mas uma linha de texto simples ("Dúvidas sobre cancelamento ou reembolso? [ver política]") já ajudaria, assim que a política existir.

---

### 2.10 Checkout (modal de confirmação de CPF)

- **O que transmite confiança:** o aviso prévio ao redirecionamento ("Você será redirecionado ao checkout seguro do Asaas para concluir o pagamento") é exatamente o tipo de transparência que evita desconfiança e contestação de pagamento.
- **O que parece inacabado:** o modal não reexibe o nome do plano nem o preço no momento da confirmação — o aluno vê isso no card por trás, mas o modal em si (o último passo antes de sair do site) não reforça "você está comprando X por R$Y" imediatamente antes do clique final.
- **O que falta explicar:** por que o CPF é pedido (existe uma frase recomendada em `05-CHECKOUT.md` §3.5 e em `08-FAQ.md`, mas ela não está implementada na tela real — só o aviso de redirecionamento está).
- **O aluno entende o que fazer?** Sim, o fluxo é curto e direto (CPF → confirmar → redirecionamento).

**Classificação: P1.** Repetir nome do plano e preço dentro do próprio modal, e adicionar a frase curta sobre o motivo do CPF (copy já escrita, só não implementada) — duas adições de texto, não uma mudança de fluxo.

---

### 2.11 E-mails (especificação em `06-EMAILS.md`, ainda não implementados)

- **O que transmite confiança (na especificação):** tom consistente, nunca usa urgência artificial, sempre honesto sobre limitação (ex.: "1.000 questões", nunca "milhares"). Isso é um ponto forte já garantido pela documentação.
- **O que parece inacabado:** nenhum desses e-mails dispara hoje — não há serviço de e-mail configurado (achado já registrado na auditoria técnica). Do ponto de vista de UX, isso significa que toda a "rede de segurança" que a experiência do produto depende (avisos de boas-vindas, confirmação de pagamento, lembretes) simplesmente não existe na jornada real hoje — o aluno vive a experiência descrita nas seções 2.1–2.10 **sem** nenhum desses reforços por e-mail.
- **Falta de informação:** o Dashboard e a tela de Assinatura (seções 2.3 e 2.9) foram desenhados presumindo que o e-mail de boas-vindas cobriria o vácuo pós-cadastro — sem o e-mail, esse vácuo fica sem nenhuma mitigação.

**Classificação: P0** (por decorrência): como a tela do Dashboard hoje não direciona para a assinatura (seção 2.3) **e** o e-mail que serviria de rede de segurança não dispara, o aluno recém-cadastrado pode não ter absolutamente nenhum estímulo para comprar. As duas correções de copy já recomendadas (2.3 e a implementação do e-mail, fora do escopo desta auditoria de UX) precisam ser tratadas como uma coisa só, não isoladamente.

---

### 2.12 Fluxo completo — visão de ponta a ponta

Juntando as onze telas: o fluxo hoje tem uma assimetria clara. **A parte "dentro do produto" (Dashboard, Estudo, Sessão, Resultados, Revisão, Histórico) está bem construída, coerente e transmite confiança real** — é visivelmente o trabalho mais maduro de toda a plataforma. **A parte "antes do produto" (Landing, Cadastro, nudge pós-cadastro, e-mails) é onde a experiência se rompe** — não por estar malfeita, mas por não existir ainda na forma aprovada. Um aluno que já pagou e chega ao Dashboard tem uma ótima experiência; um visitante que ainda não decidiu comprar não tem quase nenhuma informação para decidir.

---

## 3. Priorização consolidada

| ID | Tela | Achado | Prioridade | Esforço da correção |
|---|---|---|---|---|
| UX-01 | Landing | Copy genérica, sem especialização, sem oferta, sem prova | **P0** | Pequeno (troca de texto do hero, reaproveitando copy já aprovada) |
| UX-02 | Landing | Botão "Painel Admin" exposto publicamente | **P0** | Trivial (remover um link) |
| UX-03 | Dashboard | Estado vazio manda "falar com o administrador" em vez de apontar para `/app/subscription` | **P0** | Trivial (trocar texto + adicionar botão) |
| UX-04 | Estudo | Mesma mensagem "falar com o administrador" no estado vazio | **P0** | Trivial (mesma correção do UX-03) |
| UX-05 | E-mails / Dashboard | Vácuo pós-cadastro sem nudge no produto nem e-mail de boas-vindas ativo | **P0** | Depende de UX-03 + configuração de e-mail (fora do escopo desta auditoria) |
| UX-06 | Cadastro/Login | Sem frase de contexto sobre o próximo passo (Plano Fundador) | **P1** | Trivial (uma linha de texto já escrita em `05-CHECKOUT.md`) |
| UX-07 | Central de Revisão | Botão "Responder" na aba "Não Respondidas" não leva à questão nem ao grupo esperado | **P1** | Pequeno (ajustar rótulo ou mapeamento de modo) |
| UX-08 | Checkout (modal) | Modal não reforça plano/preço nem explica o pedido de CPF | **P1** | Pequeno (duas linhas de texto, copy já existente) |
| UX-09 | Minha Assinatura | Link "Gerenciar pagamento" não avisa que é site externo | **P1** | Trivial (uma linha de apoio) |
| UX-10 | Estudo (Builder) | Modos de sessão sem explicação inline consistente | **P1** | Pequeno (completar um padrão já parcialmente usado) |
| UX-11 | Sessão ativa | Botão "Próxima questão" duplicado na tela | **P2** | Trivial (ocultar uma das duas instâncias) |
| UX-12 | Dashboard | Atalhos de estudo vs. Central de Revisão sem diferenciação explicada | **P2** | Pequeno (uma linha de apoio) |
| UX-13 | Histórico | Tabela densa (10 colunas) para primeiro uso | **P2** | Pequeno (ocultar 1–2 colunas por padrão) |
| UX-14 | Minha Assinatura | Nenhuma menção à garantia de 7 dias na própria tela | **P2** | Pequeno (uma linha, depende da política existir) |

---

## 4. Fechamento

O produto que o aluno já pagante encontra (Dashboard em diante) é sólido — a maior parte dos achados desta auditoria são polimentos de uma linha de texto, não problemas estruturais. O risco real de conversão está concentrado nas primeiras duas telas (Landing e Cadastro) e no vácuo imediatamente após o cadastro — exatamente o trecho da jornada que a documentação comercial (`04-LANDING.md`, `05-CHECKOUT.md`, `06-EMAILS.md`) já havia identificado como crítico, mas que ainda não foi implementado na experiência real. Nenhuma correção sugerida aqui exige redesenho, novo componente ou mudança de arquitetura — todas são ajustes de texto, de link, ou de uma condição de exibição já existente.

---

*Fim da auditoria de UX. Nenhum outro documento foi alterado. Nenhum código foi escrito. Nenhuma implementação foi iniciada.*
