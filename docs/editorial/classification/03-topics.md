# 03 — Assuntos (Topics)

Fonte: `docs/editorial/normalized/02-assuntos.json` (107 assuntos, V1.1).
Mapeamento para import CSV: usar **nome do assunto** no campo `topic` (convert valida contra `taxonomy.json` → `topics[]`).

Cada assunto pertence a **exatamente uma disciplina**. IDs preservados após reparentamentos V1.1.

---

## D01 — Administração em Enfermagem

### D01-A01 — Planejamento e Organização do Trabalho
- **Definição:** Processo administrativo aplicado ao serviço de enfermagem.
- **Exemplos:** ciclo PDCA, organização de escalas, fluxo de trabalho na unidade.
- **Fronteiras:** ≠ dimensionamento numérico (→ A02); ≠ liderança interpessoal (→ A03).

### D01-A02 — Dimensionamento de Pessoal
- **Definição:** Cálculo de quadro via SCP e Res. COFEN 543/2017.
- **Exemplos:** índice de ineficiência, horas/profissional, fórmulas de dimensionamento.
- **Fronteiras:** ≠ redação da Res. 543 como norma COFEN (→ D08); ≠ indicadores de qualidade (→ A04).

### D01-A03 — Liderança e Gestão de Pessoas
- **Definição:** Estilos de liderança, conflitos, educação permanente em serviço.
- **Exemplos:** delegação, feedback, gestão de equipe multiprofissional.
- **Fronteiras:** ≠ supervisão técnica de competência (→ A05).

### D01-A04 — Gestão da Qualidade
- **Definição:** Indicadores, acreditação, auditoria e custos assistenciais.
- **Exemplos:** indicadores de enfermagem, ONA, NPS assistencial.
- **Fronteiras:** ≠ metas internacionais de segurança (→ D23); ≠ CCIH (→ D03 D05-A01).

### D01-A05 — Supervisão e Avaliação
- **Definição:** Supervisão da equipe e avaliação de desempenho.
- **Exemplos:** visita de supervisão, plano de desenvolvimento individual.
- **Fronteiras:** ≠ processo ético-disciplinar (→ D08-A04).

---

## D03 — Biossegurança

### D03-A01 — Proteção Individual e Coletiva
- **Definição:** EPI e precauções padrão, por contato, gotículas e aerossóis.
- **Exemplos:** luvas, máscara N95, precauções para TB/HIV.
- **Fronteiras:** ≠ técnica de curativo (→ D10); ≠ meta 5 institucional (→ D23).

### D03-A02 — Gestão de Resíduos
- **Definição:** Classificação RSS, PGRSS, segregação e transporte.
- **Exemplos:** resíduo infectante Grupo A, perfurocortante Grupo E.
- **Fronteiras:** ≠ limpeza terminal de superfície (→ D05-A04).

### D03-A03 — Exposição Ocupacional
- **Definição:** Acidentes com material biológico e profilaxia pós-exposição.
- **Exemplos:** fluxograma PEP HIV, notificação de acidente.
- **Fronteiras:** ≠ evento adverso ao paciente (→ D23).

### D05-A01 — Estrutura da Vigilância de IRAS *(reparentado)*
- **Definição:** CCIH, SCIH, indicadores epidemiológicos de infecção.
- **Exemplos:** taxa de ISC, comissão de controle de infecção.
- **Fronteiras:** ≠ bundle clínico isolado (→ D05-A04); ≠ gestão de qualidade geral (→ D01-A04).

### D05-A02 — Infecções Relacionadas a Dispositivos *(reparentado)*
- **Definição:** ICS-CVC, ITU-AC, PAV, ISC por dispositivo.
- **Exemplos:** bundle CVC, manutenção de curativo de CVC.
- **Fronteiras:** ≠ VM como suporte (→ D25-A02); ≠ clínica da pneumonia comunitária (→ D07).

### D05-A03 — Microrganismos Multirresistentes *(reparentado)*
- **Definição:** MRSA, KPC, uso racional de antimicrobianos institucional.
- **Exemplos:** isolamento de contact precaution para KPC.
- **Fronteiras:** ≠ mecanismo do antibiótico (→ D09-A03).

### D05-A04 — Medidas de Prevenção *(reparentado)*
- **Definição:** Higienização das mãos, bundles, limpeza de superfícies.
- **Exemplos:** 5 momentos OMS, checklist de bundle.
- **Fronteiras:** ≠ técnica de assepsia cirúrgica (→ D04-A02).

---

## D04 — Centro Cirúrgico e CME

### D04-A01 — Estrutura e Organização do CC
- **Definição:** Planta física, zoneamento, equipe cirúrgica.
- **Exemplos:** área restrita, sala limpa, funções do circulante.
- **Fronteiras:** ≠ cuidado perioperatório em enfermaria (→ D07-A01).

### D04-A02 — Paramentação e Assepsia
- **Definição:** Paramentação, escovação, técnica asséptica cirúrgica.
- **Exemplos:** campo cirúrgico, antissepsia da pele.
- **Fronteiras:** ≠ precauções de isolamento em enfermaria (→ D03).

### D04-A03 — Instrumentação Cirúrgica
- **Definição:** Instrumental básico, posicionamento, contagem de compressas.
- **Exemplos:** pinça hemostática, posição de Trendelenburg.
- **Fronteiras:** ≠ especialidade cirúrgica clínica (→ D07-A02).

### D04-A04 — Recuperação Pós-Anestésica
- **Definição:** SRPA, escala de Aldrete, complicações imediatas.
- **Exemplos:** critérios de alta da SRPA, náusea pós-anestésica.
- **Fronteiras:** ≠ cuidado pós-op prolongado (→ D07-A01).

### D04-A05 — Central de Material e Esterilização
- **Definição:** Fluxo CME, métodos e indicadores de esterilização.
- **Exemplos:** autoclave, indicador biológico, área suja/limpa.
- **Fronteiras:** ≠ reprocessamento como vigilância epidemiológica (→ D05-A01).

---

## D06 — Enfermagem em Doenças Transmissíveis

### D06-A01 — Doenças de Transmissão Vetorial
- **Definição:** Dengue, zika, chikungunya, malária, febre amarela, leishmaniose, Chagas.
- **Exemplos:** classificação de dengue, sinais de alarme.
- **Fronteiras:** ≠ vigilância vetorial em abstrato (→ D17-A02).

### D06-A02 — Doenças de Transmissão Respiratória
- **Definição:** TB, hanseníase, covid-19, influenza.
- **Exemplos:** esquema RIPE, isolamento respiratório TB.
- **Fronteiras:** ≠ DPOC crônico (→ D07 D20-A03).

### D06-A03 — IST e Hepatites
- **Definição:** HIV/Aids, sífilis, hepatites virais, outras IST.
- **Exemplos:** profilaxia pós-exposição, testagem rápida.
- **Fronteiras:** ≠ planejamento reprodutivo geral (→ D19-A04).

### D06-A04 — Doenças Imunopreveníveis e Outras
- **Definição:** Sarampo, coqueluche, meningites, doenças negligenciadas.
- **Exemplos:** profilaxia pós-contato meningocócica.
- **Fronteiras:** ≠ calendário vacinal PNI (→ D11-A01 em D17).

### D06-A05 — Precaução e Manejo
- **Definição:** Precauções específicas e isolamento hospitalar por agravo.
- **Exemplos:** quarto de isolamento para varíola, fluxo de ebola.
- **Fronteiras:** ≠ precauções padrão genéricas (→ D03-A01).

---

## D07 — Enfermagem Médico-Cirúrgica

### D07-A01 — Cuidado Perioperatório
- **Definição:** Avaliação pré-op, complicações pós-op, drenos.
- **Exemplos:** jejum pré-op, cuidados com dreno de Blake.
- **Fronteiras:** ≠ CC como ambiente (→ D04); ≠ RCP (→ D26-A02).

### D07-A02 — Enfermagem em Especialidades Cirúrgicas
- **Definição:** Ortopedia, digestiva, urológica, neuro, cardíaca.
- **Exemplos:** cuidado pós-artroplastia, pós-craniotomia.
- **Fronteiras:** ≠ oncologia como linha de cuidado (→ D07-A04).

### D07-A03 — Estomas e Feridas Complexas
- **Definição:** Estomias, feridas cirúrgicas complexas, curativos avançados.
- **Exemplos:** colostomia, terapia por pressão negativa.
- **Fronteiras:** ≠ curativo simples (→ D10-A04).

### D07-A04 — Oncologia
- **Definição:** Enfermagem oncológica e cuidados paliativos oncológicos.
- **Exemplos:** extravasamento de quimioterápico, mucosite.
- **Fronteiras:** ≠ paliativo não oncológico (→ D20-A05).

### D20-A01 — Doenças Cardiovasculares *(reparentado)*
- **Definição:** HAS, IC, DAC, arritmias — cuidado de enfermagem.
- **Exemplos:** monitorização de PA, edema, IECA.
- **Fronteiras:** ≠ emergência IAM aguda (→ D26-A03); ≠ droga vasoativa em UTI (→ D25).

### D20-A02 — Doenças Endócrino-metabólicas *(reparentado)*
- **Definição:** DM, obesidade, dislipidemia, tireoide.
- **Exemplos:** hipoglicemia, insulinoterapia, pé diabético.
- **Fronteiras:** ≠ cálculo de insulina como técnica (→ D10-A05).

### D20-A03 — Doenças Respiratórias Crônicas *(reparentado)*
- **Definição:** DPOC e asma — manejo ambulatorial/crônico.
- **Exemplos:** técnica inalatória, oximetria domiciliar.
- **Fronteiras:** ≠ emergência respiratória aguda (→ D26-A03).

### D20-A04 — Doenças Renais e Neurológicas Crônicas *(reparentado)*
- **Definição:** DRC/TRS, AVC crônico, epilepsia.
- **Exemplos:** acesso para hemodiálise, cuidados pós-AVC.
- **Fronteiras:** ≠ AVC agudo (→ D26-A03); ≠ TRS contínua em UTI (→ D25-A04).

### D20-A05 — Cuidado Crônico e Linha de Cuidado *(reparentado)*
- **Definição:** Linhas de cuidado DCNT e paliativos não agudos.
- **Exemplos:** linha HAS/DM, cuidados paliativos domiciliares.
- **Fronteiras:** ≠ política de DCNT no SUS (→ D13 D14-A04).

---

## D08 — Ética e Legislação em Enfermagem

### D08-A01 — Marco Legal do Exercício Profissional
- **Definição:** Lei 7.498/1986 e Decreto 94.406/1987.
- **Exemplos:** atribuições do enfermeiro, prescrição de medicamentos.
- **Fronteiras:** ≠ Lei 8.080 (→ D13-A01).

### D08-A02 — Código de Ética dos Profissionais de Enfermagem
- **Definição:** Res. COFEN 564/2017 e processo ético-disciplinar.
- **Exemplos:** sigilo, conflito de interesse, denúncia.
- **Fronteiras:** ≠ código de ética do servidor público (→ exam-specific).

### D08-A03 — Sistema COFEN/COREN
- **Definição:** Organização, registro, fiscalização profissional.
- **Exemplos:** anotação de responsabilidade técnica, COREN.
- **Fronteiras:** ≠ conselho de saúde (→ D13-A04).

### D08-A04 — Responsabilidade Profissional
- **Definição:** Responsabilidade civil, penal, ética; imperícia, imprudência, negligência.
- **Exemplos:** erro de medicação — responsabilização.
- **Fronteiras:** ≠ evento adverso institucional (→ D23-A02).

### D08-A05 — Outras Normativas COFEN Correlatas
- **Definição:** Resoluções 358/2009, 543/2017, 429/2012 fora do escopo SAE puro.
- **Exemplos:** auditoria em enfermagem, consultoria.
- **Fronteiras:** ≠ processo de enfermagem detalhado (→ D24).

---

## D09 — Farmacologia

### D09-A01 — Princípios de Farmacologia
- **Definição:** Farmacocinética, farmacodinâmica, RAM, interações.
- **Exemplos:** meia-vida, antagonismo, reação anafilática medicamentosa.
- **Fronteiras:** ≠ técnica de administração (→ D10-A05).

### D09-A02 — Segurança Medicamentosa
- **Definição:** Medicamentos de alta vigilância, protocolos, notificação.
- **Exemplos:** lista ISMP, dupla checagem, bomba de infusão.
- **Fronteiras:** ≠ meta 3 identificação (→ D23-A01).

### D09-A03 — Classes Farmacológicas por Sistema
- **Definição:** Analgésicos, antibióticos, anti-hipertensivos, psicofármacos etc.
- **Exemplos:** betabloqueador, benzodiazepínico, heparina.
- **Fronteiras:** ≠ manejo clínico do transtorno (→ D22-A04).

### D09-A04 — Cálculo e Administração
- **Definição:** Cálculo de dose, diluição, compatibilidade em Y.
- **Exemplos:** regra de três mg/kg, diluição de noradrenalina.
- **Fronteiras:** ≠ cálculo matemático abstrato (→ D16-A02).

---

## D10 — Fundamentos de Enfermagem

### D10-A01 — Histórico e Bases Teóricas
- **Definição:** História da enfermagem, teorias, introdução ao processo.
- **Exemplos:** Nightingale, Henderson, Orem.
- **Fronteiras:** ≠ SAE formal NANDA (→ D24).

### D10-A02 — Exame Físico e Avaliação
- **Definição:** Exame físico, sinais vitais, semiologia, dor.
- **Exemplos:** ausculta, escala de dor, Glasgow como avaliação (não emergência).
- **Fronteiras:** ≠ emergência com Glasgow (→ D26-A04).

### D10-A03 — Higiene, Conforto e Mobilidade
- **Definição:** Higiene, mobilização, prevenção de quedas e LPP.
- **Exemplos:** banho no leito, escala de Braden, transferência.
- **Fronteiras:** ≠ síndrome geriátrica quedas (→ D21-A02); ≠ protocolo institucional quedas (→ D23).

### D10-A04 — Feridas e Curativos
- **Definição:** Curativos, cicatrização, bandagens.
- **Exemplos:** curativo oclusivo, fases da cicatrização.
- **Fronteiras:** ≠ estoma (→ D07-A03); ≠ ferida complexa oncologicamente (→ D07-A04).

### D10-A05 — Administração de Medicamentos
- **Definição:** Técnica, vias, cálculo operacional de dose.
- **Exemplos:** IM, EV, via enteral, 5 certos.
- **Fronteiras:** ≠ farmacodinâmica (→ D09).

### D10-A06 — Procedimentos Invasivos e Suporte
- **Definição:** Punção, sondagens, nutrição, oxigenoterapia, balanço hídrico.
- **Exemplos:** SNG, SV, O2 por cateter nasal.
- **Fronteiras:** ≠ VM invasiva (→ D25-A02).

### D10-A07 — Comunicação e Cuidado Perioperatório
- **Definição:** Comunicação efetiva/terapêutica; cuidados pré/pós-op básicos.
- **Exemplos:** entrevista motivacional, checklist cirurgia segura (lado do paciente).
- **Fronteiras:** ≠ CC ambiente (→ D04); ≠ perioperatório complexo (→ D07-A01).

### D10-A08 — Identificação e Registro
- **Definição:** Identificação do paciente, registros, humanização.
- **Exemplos:** pulseira, SBAR, prontuário.
- **Fronteiras:** ≠ prescrição de enfermagem SAE (→ D24-A04).

---

## D12 — Informática

### D12-A01 — Fundamentos de Hardware e Software
- **Definição:** Componentes de computador e sistemas operacionais.
- **Exemplos:** CPU, RAM, Windows, periféricos.
- **Fronteiras:** ≠ prontuário eletrônico clínico (→ D12-A04).

### D12-A02 — Ferramentas de Produtividade
- **Definição:** Editor de texto, planilha, apresentações.
- **Exemplos:** Word, Excel, PowerPoint.
- **Fronteiras:** ≠ estatística epidemiológica (→ D17-A01).

### D12-A03 — Internet e Segurança
- **Definição:** Navegadores, e-mail, segurança da informação.
- **Exemplos:** phishing, backup, firewall.
- **Fronteiras:** ≠ LGPD como política SUS (→ D13).

### D12-A04 — Informática em Saúde
- **Definição:** Prontuário eletrônico, sistemas de informação em saúde.
- **Exemplos:** PEP, RNDS, interoperabilidade.
- **Fronteiras:** ≠ registro de enfermagem (→ D24-A04).

---

## D13 — Legislação do SUS

### D13-A01 — Base Constitucional e Legal
- **Definição:** CF/1988, Lei 8.080, 8.142, LC 141/2012.
- **Exemplos:** art. 196, competências MS/estado/município.
- **Fronteiras:** ≠ Lei 7.498 (→ D08-A01).

### D13-A02 — Princípios e Diretrizes do SUS
- **Definição:** Universalidade, integralidade, equidade; regionalização, hierarquização.
- **Exemplos:** princípios doutrinários vs organizativos.
- **Fronteiras:** ≠ princípios bioéticos (→ D08).

### D13-A03 — Gestão e Pactuação
- **Definição:** NOB, NOAS, Pacto pela Saúde, CIT/CIB, COAP, Decreto 7.508/2011.
- **Exemplos:** contrato organizativo de ação pública.
- **Fronteiras:** ≠ gestão hospitalar privada (→ D01).

### D13-A04 — Controle Social
- **Definição:** Conselhos e conferências de saúde.
- **Exemplos:** Res. 453/2012, composição do CMS.
- **Fronteiras:** ≠ COREN (→ D08-A03).

### D13-A05 — Redes de Atenção à Saúde
- **Definição:** RAS, regionalização, hierarquização de serviços.
- **Exemplos:** porta de entrada, regulação.
- **Fronteiras:** ≠ RAPS clínica (→ D22-A02).

### D14-A01 — Atenção Primária à Saúde *(reparentado)*
- **Definição:** PNAB, ESF, ACS, eMulti, PSE, Previne Brasil.
- **Exemplos:** atribuições do enfermeiro na ESF.
- **Fronteiras:** ≠ administração hospitalar (→ D01).

### D14-A02 — Humanização e Acesso *(reparentado)*
- **Definição:** PNH/HumanizaSUS, PMAQ, acolhimento com classificação de risco.
- **Exemplos:** humanização do parto, acolhimento na APS.
- **Fronteiras:** ≠ Manchester em PS (→ D26-A01).

### D14-A03 — Redes Temáticas de Atenção à Saúde *(reparentado)*
- **Definição:** Rede Cegonha, RAPS, RUE, rede de deficiência.
- **Exemplos:** componentes da Rede Cegonha.
- **Fronteiras:** ≠ cuidado clínico obstétrico (→ D19).

### D14-A04 — Políticas Específicas por População/Agravo *(reparentado)*
- **Definição:** PNAISH, PNPIC, PNAN, PNPS e políticas por população.
- **Exemplos:** Política Nacional de Saúde Integral da População Negra.
- **Fronteiras:** ≠ clínica da população (→ disciplina clínica).

---

## D15 — Português

### D15-A01 — Compreensão Textual
- **Definição:** Interpretação, tipologia, coesão e coerência.
- **Exemplos:** inferência, ideia central, gênero textual.
- **Fronteiras:** ≠ gramática isolada (→ A02).

### D15-A02 — Gramática Normativa
- **Definição:** Ortografia, sintaxe, concordância, regência, crase, pontuação.
- **Exemplos:** crase facultativa, concordância verbal.
- **Fronteiras:** ≠ semântica/figuras (→ A03).

### D15-A03 — Semântica e Estilística
- **Definição:** Significação de palavras, figuras de linguagem.
- **Exemplos:** metáfora, polissemia, ironia.
- **Fronteiras:** ≠ interpretação de texto longo (→ A01).

---

## D16 — Raciocínio Lógico

### D16-A01 — Lógica Proposicional
- **Definição:** Proposições, conectivos, tabela-verdade, argumentação.
- **Exemplos:** negação, contraposição, silogismo.
- **Fronteiras:** ≠ estatística (→ D17-A01 ou A02).

### D16-A02 — Raciocínio Matemático Aplicado
- **Definição:** Sequências, porcentagem, regra de três, probabilidade, conjuntos.
- **Exemplos:** progressão aritmética, juros simples.
- **Fronteiras:** ≠ cálculo de dose clínica (→ D09-A04 ou D10-A05).

---

## D17 — Saúde Coletiva

### D17-A01 — Epidemiologia Aplicada
- **Definição:** Indicadores, coeficientes, cadeia epidemiológica, níveis de prevenção.
- **Exemplos:** incidência, prevalência, odds ratio.
- **Fronteiras:** ≠ clínica da doença (→ D06).

### D17-A02 — Vigilância em Saúde
- **Definição:** Vigilância epidemiológica, sanitária, ambiental, do trabalhador, notificação.
- **Exemplos:** SINAN, ficha de notificação, investigação de surto.
- **Fronteiras:** ≠ manejo clínico do caso (→ D06).

### D17-A03 — Determinantes e Promoção da Saúde
- **Definição:** DSS, Carta de Ottawa, educação em saúde.
- **Exemplos:** determinantes sociais, promoção vs prevenção.
- **Fronteiras:** ≠ política Pnaps como norma (→ D13 D14-A04).

### D17-A04 — Planejamento em Saúde
- **Definição:** Planejamento estratégico situacional, diagnóstico comunitário.
- **Exemplos:** matriz SWOT, priorização de problemas.
- **Fronteiras:** ≠ planejamento administrativo hospitalar (→ D01-A01).

### D11-A01 — Estrutura do Programa *(reparentado — Imunização)*
- **Definição:** PNI, calendário nacional, SI-PNI.
- **Exemplos:** campanhas nacionais, metas de cobertura.
- **Fronteiras:** ≠ técnica de aplicação (→ D11-A03).

### D11-A02 — Rede de Frio *(reparentado)*
- **Definição:** Cadeia de frio, armazenamento, sala de vacinação.
- **Exemplos:** temperatura da geladeira, termômetro calibrado.
- **Fronteiras:** ≠ biossegurança de resíduo (→ D03-A02).

### D11-A03 — Administração de Imunobiológicos *(reparentado)*
- **Definição:** Vias, aprazamento, contraindicações, EAPV.
- **Exemplos:** via IM, intervalo entre doses, anafilaxia vacinal.
- **Fronteiras:** ≠ técnica de punção genérica (→ D10-A06).

### D11-A04 — Imunobiológicos Específicos *(reparentado)*
- **Definição:** Vacinas do calendário, CRIE, soros.
- **Exemplos:** BCG, pentavalente, soro antiofídico.
- **Fronteiras:** ≠ doença imunoprevenível clínica (→ D06-A04).

---

## D18 — Saúde da Criança e do Adolescente

### D18-A01 — Cuidado ao Recém-nascido
- **Definição:** Apgar, cuidados imediatos, triagens neonatais, método canguru.
- **Exemplos:** teste do pezinho, banho do RN, hipotermia.
- **Fronteiras:** ≠ parto (→ D19-A02); ≠ reanimação neonatal avançada (→ A03 contexto).

### D18-A02 — Crescimento e Desenvolvimento
- **Definição:** Curvas OMS, DNPM, alimentação complementar.
- **Exemplos:** marcos do desenvolvimento, desnutrição.
- **Fronteiras:** ≠ puericultura como política (→ D13).

### D18-A03 — Doenças Prevalentes na Infância
- **Definição:** AIDPI, IRA, diarreia, desnutrição, exantemas.
- **Exemplos:** plano A/B/C diarreia, bronquiolite.
- **Fronteiras:** ≠ doença transmissível notificação (→ D06).

### D18-A04 — Proteção e Direitos
- **Definição:** ECA, notificação de maus-tratos.
- **Exemplos:** violência infantil, conselho tutelar.
- **Fronteiras:** ≠ SSR adolescente (→ A05).

### D18-A05 — Saúde do Adolescente
- **Definição:** SSR do adolescente, PSE, grupos operativos.
- **Exemplos:** contracepção adolescente, gravidez na adolescência.
- **Fronteiras:** ≠ pediatria geral (→ A02/A03).

---

## D19 — Saúde da Mulher

### D19-A01 — Pré-natal
- **Definição:** Consulta, IG/DPP, sinais de alarme, síndromes hipertensivas, DMG.
- **Exemplos:** proteinúria, movimentos fetais, suplementação.
- **Fronteiras:** ≠ parto (→ A02); ≠ planejamento sem gestação (→ A04).

### D19-A02 — Parto e Nascimento
- **Definição:** Mecanismo do parto, partograma, parto humanizado, cesariana.
- **Exemplos:** dilatação cervical, período expulsivo.
- **Fronteiras:** ≠ puerpério (→ A03); ≠ RN (→ D18-A01).

### D19-A03 — Puerpério
- **Definição:** Fases do puerpério, aleitamento, alojamento conjunto, depressão pós-parto.
- **Exemplos:** involução uterina, mastite, blues puerperal.
- **Fronteiras:** ≠ transtorno psiquiátrico puerperal profundo (→ D22-A04).

### D19-A04 — Saúde Sexual e Reprodutiva
- **Definição:** Planejamento reprodutivo, climatério, prevenção de câncer, violência.
- **Exemplos:** DIU, Papanicolau, menopausa.
- **Fronteiras:** ≠ IST clínica (→ D06-A03).

---

## D21 — Saúde do Idoso

### D21-A01 — Bases da Gerontologia
- **Definição:** Teorias do envelhecimento, Avaliação Geriátrica Ampla.
- **Exemplos:** envelhecimento saudável, AGA.
- **Fronteiras:** ≠ política do idoso (→ A04).

### D21-A02 — Síndromes Geriátricas
- **Definição:** Fragilidade, quedas, incontinência, delirium, demências, polifarmácia.
- **Exemplos:** escala de Morse, CAM delirium.
- **Fronteiras:** ≠ protocolo institucional de quedas (→ D23); ≠ demência como saúde mental (→ D22 se foco psiquiátrico).

### D21-A03 — Cuidado ao Idoso
- **Definição:** Cuidados paliativos, ILPI, cuidador, violência.
- **Exemplos:** cuidador não remunerado, abuso em ILPI.
- **Fronteiras:** ≠ paliativo oncológico (→ D07-A04).

### D21-A04 — Direitos e Políticas
- **Definição:** Estatuto do Idoso, Política Nacional da Pessoa Idosa.
- **Exemplos:** direitos do idoso, tipificação de maus-tratos.
- **Fronteiras:** ≠ ECA (→ D18-A04).

---

## D22 — Saúde Mental

### D22-A01 — Reforma Psiquiátrica e Modelo de Atenção
- **Definição:** Lei 10.216/2001, desinstitucionalização.
- **Exemplos:** hospital-dia, exclusão de manicômios.
- **Fronteiras:** ≠ RAPS como política abstrata (→ D13 D14-A03).

### D22-A02 — Rede de Atenção Psicossocial
- **Definição:** RAPS, CAPS, SRT, unidades de acolhimento.
- **Exemplos:** CAPS ad, CAPS i, componentes RAPS.
- **Fronteiras:** ≠ urgência psiquiátrica aguda (→ D26 se PS).

### D22-A03 — Álcool e Outras Drogas
- **Definição:** Redução de danos, CAPS AD, abstinência/intoxicação.
- **Exemplos:** síndrome de abstinência álcool, crack.
- **Fronteiras:** ≠ intoxicação exógena emergência (→ D26-A03).

### D22-A04 — Cuidado Clínico em Saúde Mental
- **Definição:** Transtornos mentais, risco de suicídio, manejo de crise.
- **Exemplos:** depressão maior, esquizofrenia, contraintenção.
- **Fronteiras:** ≠ psicofármaco em abstrato (→ D09-A03).

### D22-A05 — Relação Terapêutica e Cuidado
- **Definição:** Relação terapêutica, PTS, matriciamento.
- **Exemplos:** acolhimento, projeto terapêutico singular.
- **Fronteiras:** ≠ comunicação genérica (→ D10-A07).

---

## D23 — Segurança do Paciente

### D23-A01 — Metas Internacionais de Segurança do Paciente
- **Definição:** As 6 metas internacionais (identificação, comunicação, cirurgia segura etc.).
- **Exemplos:** meta 1 identificação, meta 6 redução de risco.
- **Fronteiras:** ≠ técnica isolada (→ D10).

### D23-A02 — Governança da Segurança
- **Definição:** NSP, notificação de eventos adversos, cultura de segurança.
- **Exemplos:** notifica Brasil, comissão de segurança.
- **Fronteiras:** ≠ CCIH (→ D05-A01).

### D23-A03 — Ferramentas de Gestão de Risco
- **Definição:** Checklists e protocolos dos 6 protocolos básicos.
- **Exemplos:** protocolo de quedas institucional, RCA.
- **Fronteiras:** ≠ prevenção técnica de LPP (→ D10-A03).

---

## D24 — SAE

### D24-A01 — Base Normativa e Conceitual
- **Definição:** Res. COFEN 358/2009 e conceito da SAE.
- **Exemplos:** definição legal de SAE, histórico.
- **Fronteiras:** ≠ código de ética (→ D08); ≠ Res. 358 como norma genérica COFEN (→ D08-A05).

### D24-A02 — As 5 Etapas do Processo de Enfermagem
- **Definição:** Coleta, diagnóstico, planejamento, implementação, avaliação.
- **Exemplos:** etapa de diagnóstico, plano de cuidados.
- **Fronteiras:** ≠ exame físico técnico (→ D10-A02).

### D24-A03 — Taxonomias e Sistemas de Classificação
- **Definição:** NANDA-I, NOC, NIC, ligação NNN, CIPE.
- **Exemplos:** diagnóstico NANDA, resultado NOC, intervenção NIC.
- **Fronteiras:** ≠ diagnóstico médico CID (→ especialidade clínica).

### D24-A04 — Registro e Documentação
- **Definição:** Prescrição, evolução, prontuário eletrônico de enfermagem.
- **Exemplos:** SOAP de enfermagem, registro de intercorrência.
- **Fronteiras:** ≠ informática genérica (→ D12-A04).

---

## D25 — Terapia Intensiva (UTI)

### D25-A01 — Monitorização do Paciente Crítico
- **Definição:** Monitorização hemodinâmica, escores de gravidade, neurológica.
- **Exemplos:** SAPS3, SOFA, PIC.
- **Fronteiras:** ≠ sinais vitais rotina (→ D10-A02).

### D25-A02 — Suporte Ventilatório
- **Definição:** VM invasiva/não invasiva, desmame, via aérea artificial.
- **Exemplos:** PEEP, FiO2, SBT.
- **Fronteiras:** ≠ oxigenoterapia simples (→ D10-A06); ≠ PAV como IRAS (→ D05-A02).

### D25-A03 — Suporte Hemodinâmico e Farmacológico
- **Definição:** Drogas vasoativas, sedação/analgesia, bloqueio neuromuscular.
- **Exemplos:** noradrenalina, propofol, cisatracúrio.
- **Fronteiras:** ≠ classe farmacológica abstrata (→ D09-A03).

### D25-A04 — Cuidados Específicos do Paciente Crítico
- **Definição:** Delirium em UTI, mobilização precoce, prevenção PAV, TRS contínua.
- **Exemplos:** CAM-ICU, bundle PAV.
- **Fronteiras:** ≠ delirium geriátrico enfermaria (→ D21-A02).

---

## D26 — Urgência e Emergência

### D26-A01 — Classificação de Risco e Organização do Serviço
- **Definição:** Manchester, ACCR, RUE, SAMU, UPA.
- **Exemplos:** cor Manchester, fluxo UPA, 192.
- **Fronteiras:** ≠ acolhimento APS (→ D13 D14-A02).

### D26-A02 — Suporte de Vida
- **Definição:** SBV, SAV, PCR/RCP, via aérea, desfibrilação.
- **Exemplos:** compressões 5-6 cm, ritmo chocável.
- **Fronteiras:** ≠ VM prolongada UTI (→ D25-A02).

### D26-A03 — Emergências Clínicas
- **Definição:** Dor torácica, AVC agudo, sepse, emergências metabólicas, anafilaxia.
- **Exemplos:** trombolítico AVC, bundle sepse 1h.
- **Fronteiras:** ≠ HAS crônica (→ D20-A01); ≠ sepse como vigilância (→ D05).

### D26-A04 — Emergências Traumáticas
- **Definição:** Politrauma, Glasgow, choque, queimaduras, afogamento.
- **Exemplos:** ABCDE trauma, escala de queimadura.
- **Fronteiras:** ≠ cuidado crônico trauma (→ D07).

---

## Regras de seleção de assunto

1. Escolher o assunto cujo **comando da questão** se encaixa, não apenas o cenário narrado.
2. Se dois assuntos parecerem iguais, preferir o de **menor ID numérico** dentro da mesma disciplina (regra V1.1 de sobrevivência em fusões).
3. Assuntos reparentados (D05-*, D11-*, D14-*, D20-*) mantêm ID histórico — usar ID/nome atual, disciplina pai correta.
4. Não criar assunto novo sem aprovação editorial (ver `07-rules.md` R-GOV-03).
