# DOSSIÊ MESTRE — IMUNIZAÇÃO — V1

## Objetivo

Base técnica oficial da disciplina "Imunização" do SimulaPro. Não gera questões, não resume para aluno. É a fonte editorial permanente para o Motor Editorial.

## Achado Editorial (obrigatório registrar — não silenciar)

**Achado 1 — rebaixamento na taxonomia-sombra, não aplicado à arquitetura real.** O documento de referência real (`docs/editorial/02c-saude-coletiva-imunizacao-doencas-transmissiveis.md`, seção 2) traz uma ERRATA V1.1 que classifica Imunização como **rebaixada de disciplina para "assunto forte" dentro de Saúde Coletiva**. Mesmo padrão já observado nesta sessão (Anatomia e Fisiologia, Saúde do Adulto/Médico-Cirúrgica, Controle de Infecção Hospitalar/Biossegurança): a fusão existe apenas na taxonomia-sombra `editorial_disciplines`; a tabela real `subjects` mantém "Imunização" (id `5f343163-8d9e-48b3-b6f9-b118a2bb4417`) como disciplina própria, independente e ativa, com 20 questões reais antes desta sprint. O usuário nomeou esta sprint explicitamente como "Imunização" — tratado como decisão editorial informada, prosseguindo sem reverter a arquitetura real nem a taxonomia-sombra.

**Achado 2 — sobreposição real substancial com Saúde Coletiva (mais intensa que os achados anteriores desta sessão).** O `subject` real "Saúde Coletiva" possui, com os **mesmos nomes** (linhas distintas, `subject_id` diferente), 3 dos 4 `topics` de Imunização — "Técnica de Administração de Vacinas", "Calendário Nacional de Vacinação", "Avaliação da Cobertura Vacinal" — com **14 questões reais próprias**, cobrindo conteúdo tecnicamente idêntico ao desta disciplina (EAPV, cadeia de frio, PNI histórico, esquemas vacinais, casos clínicos de sala de vacina). Isso é consistente com a nota da própria fonte (seção 1.6 de `02c`): "Saúde Coletiva vs. Imunização... uma questão sobre vacina pode ser classificada nas duas". **Tratamento adotado:** as 14 questões reais de Saúde Coletiva nesses 3 tópicos foram lidas integralmente antes da Produção (ver Inteligência Editorial), com checagem de duplicidade cruzada obrigatória (Fase 4) contra elas, além das 20 questões reais desta própria disciplina — nenhuma questão nova repete recorte já coberto em nenhuma das duas.

**Achado 3 — tópico indispensável ausente, criado nesta sprint.** Nenhum dos 4 `topics` reais cobria "Rede de Frio / Cadeia de Frio" (armazenamento, transporte e conservação de imunobiológicos, estrutura da sala de vacinação) — assunto de altíssima frequência real em provas de PNI, mas com cobertura quase nula no acervo (apenas 1 menção tangencial em Saúde Coletiva). Criado o `topic` **"Cadeia de Frio e Conservação de Imunobiológicos"** (slug `cadeia-de-frio-e-conservacao-de-imunobiologicos`), vinculado à disciplina Imunização, com taxonomia reexportada — único tópico novo desta sprint, fundamentado pelo Plano Editorial.

## Fonte real de base

Reaproveita `docs/editorial/02c-saude-coletiva-imunizacao-doencas-transmissiveis.md`, seção 2 (`Imunização`, `imunizacao`).

## Sinônimos, palavras-chave e siglas (herdados de 02c, seção 2)

Sinônimos: "Programa Nacional de Imunizações (PNI)", "Imunobiológicos", "Vacinação", "Calendário Vacinal", "Sala de Vacina".

Palavras-chave centrais: imunobiológico, soro, vacina, calendário nacional de vacinação, rede de frio, cadeia de frio, esquema vacinal, dose de reforço, eventos adversos pós-vacinação (EAPV), sala de vacina, contraindicação vacinal.

Siglas: PNI, EAPV, BCG, VOP/VIP, DTP, dT, dTpa, Hib, Pentavalente, Tríplice Viral (SCR), Tetraviral (SCRV), HPV, HB, SI-PNI.

## Assuntos e subassuntos (herdados de 02c, seção 2.4 — usados como guia de conteúdo dentro dos 5 `topics` reais, incluindo o novo)

**Estrutura do Programa:** PNI histórico e objetivos, Calendário Nacional de Vacinação, SI-PNI.

**Rede de Frio:** Cadeia de Frio, Armazenamento/Transporte/Conservação de Imunobiológicos, Sala de Vacinação (estrutura e organização) — mapeados ao novo tópico.

**Administração de Imunobiológicos:** Vias de Administração, Aprazamento e Esquemas Vacinais, Contraindicações e Falsas Contraindicações, EAPV.

**Imunobiológicos Específicos:** Vacinas do Calendário Básico, Imunobiológicos Especiais (CRIE), Soros e Imunoglobulinas.

## Leis, protocolos, portarias, programas

- PNI — instituído pela Lei nº 6.259/1975 e Decreto nº 78.231/1976 (já citado em questões reais de Saúde Coletiva).
- Manual de Normas e Procedimentos para Vacinação (MS, atualizado periodicamente).
- Calendário Nacional de Vacinação vigente (atualizado anualmente pelo MS — atenção: provas antigas podem cobrar calendário desatualizado).
- Portaria MS/GM nº 1.498/2013 — Manual de Rede de Frio.

## Casos ambíguos (herdados de 02c)

- **Imunização vs. Saúde Coletiva**: ver Achado 2 — sobreposição real e esperada; critério aplicado nesta sprint: manter o recorte técnico-operacional específico de vacinação (rede de frio, técnica, esquema, EAPV) nesta disciplina, evitando repetir os recortes já cobertos nos dois lados.
- **Imunização vs. Saúde da Criança/Saúde da Mulher**: técnica de vacinação/rede de frio/EAPV → Imunização; acompanhamento de crescimento/desenvolvimento ou pré-natal com vacina citada de passagem → Saúde da Criança/Saúde da Mulher. Verificado: 0 questões reais de Saúde da Criança e do Adolescente mencionam vacina — sem sobreposição real a checar.
- **Imunização vs. Doenças Transmissíveis**: prevenção via vacina → Imunização; manejo clínico do caso → Doenças Transmissíveis.
- **Imunização vs. Controle de Infecção Hospitalar/Biossegurança**: verificado — nenhum `topic` real dessas duas disciplinas trata de vacinação; sem sobreposição a checar.
- **Imunização vs. Políticas Públicas de Saúde**: verificado — apenas 1 menção tangencial real (PSE, fora do escopo de técnica vacinal); sem sobreposição relevante.

## Assuntos que aparecem juntos

Calendário Nacional + Vias de Administração + Contraindicações; Cadeia de Frio + Armazenamento + Sala de Vacinação; EAPV + Notificação Compulsória (Saúde Coletiva).

## Nota metodológica

Mesma cautela já aplicada às disciplinas anteriores: conteúdo normativo descrito com precisão técnica, sem transcrição literal certificada; calendário vacinal tratado em termos estruturais (idade/dose/via), evitando valores que mudem com frequência entre atualizações anuais do MS quando não essenciais à resposta.
