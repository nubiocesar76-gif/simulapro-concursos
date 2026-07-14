# 02 — Disciplinas (Subjects)

Fonte editorial: `docs/editorial/normalized/01-disciplinas.json` (V1.1).
Fonte operacional (slug para import): `docs/seeds/taxonomy.json` → `subjects[]`.

**Regra central:** cada questão possui **exatamente uma disciplina primária**.
Tag secundária só quando regra R-CL-05 autorizar (estudo de caso multi-eixo).

---

## Disciplinas ativas (21)

### D01 — Administração em Enfermagem

| Campo | Valor |
|---|---|
| **Nome** | Administração em Enfermagem |
| **Slug (seed)** | `administracao-em-enfermagem` |
| **Descrição** | Gestão, liderança, dimensionamento de pessoal, qualidade e supervisão do serviço de enfermagem. |
| **Quando utilizar** | Questão pede cálculo de quadro (SCP), liderança, indicadores de gestão, acreditação institucional, educação permanente, organização do trabalho. |
| **Quando NÃO utilizar** | Conteúdo clínico direto ao paciente (→ Fundamentos ou especialidade clínica). Norma COFEN sobre exercício profissional (→ Ética). Estrutura do SUS (→ Legislação do SUS). |

---

### D03 — Biossegurança

| Campo | Valor |
|---|---|
| **Nome** | Biossegurança |
| **Slug** | `biosseguranca` |
| **Descrição** | Proteção do profissional e do ambiente: EPI, precauções, resíduos, exposição ocupacional, vigilância de IRAS (absorve ex-Controle de Infecção). |
| **Quando utilizar** | EPI, precauções padrão/especiais, PGRSS, acidente com perfurocortante, CCIH, bundles de prevenção, IRAS, MDRO. |
| **Quando NÃO utilizar** | Técnica de curativo sem contexto de precaução (→ Fundamentos). Meta internacional de segurança institucional (→ Segurança do Paciente). Clínica da doença transmissível (→ Doenças Transmissíveis ou Saúde Coletiva). |

**Observação V1.1:** slug legado `controle-de-infeccao-hospitalar` foi mesclado aqui — não usar como disciplina separada.

---

### D04 — Centro Cirúrgico e CME

| Campo | Valor |
|---|---|
| **Nome** | Centro Cirúrgico e CME |
| **Slug** | `centro-cirurgico-e-cme` |
| **Descrição** | Ambiente cirúrgico, paramentação, instrumentação, SRPA e central de material esterilizado. |
| **Quando utilizar** | CC, CME, esterilização, paramentação, escala de Aldrete, zoneamento do bloco cirúrgico. |
| **Quando NÃO utilizar** | Cuidado clínico pós-operatório em enfermaria (→ Médico-Cirúrgica). Técnica asséptica genérica fora do CC (→ Fundamentos ou Biossegurança). |

---

### D06 — Enfermagem em Doenças Transmissíveis

| Campo | Valor |
|---|---|
| **Nome** | Enfermagem em Doenças Transmissíveis |
| **Slug** | `enfermagem-em-doencas-transmissiveis` |
| **Descrição** | Doenças infecciosas e parasitárias: clínica, notificação e manejo específico por agravo. |
| **Quando utilizar** | Dengue, TB, HIV, hanseníase, IST, doenças imunopreveníveis no contexto clínico da doença. |
| **Quando NÃO utilizar** | Vigilância epidemiológica em abstrato (→ Saúde Coletiva). Vacinação/programa PNI (→ Saúde Coletiva, assuntos D11-A*). Isolamento hospitalar técnico (→ Biossegurança). |

---

### D07 — Enfermagem Médico-Cirúrgica

| Campo | Valor |
|---|---|
| **Nome** | Enfermagem Médico-Cirúrgica |
| **Slug** | `enfermagem-medico-cirurgica` |
| **Descrição** | Cuidado clínico ao adulto com doenças crônicas e perioperatório (absorve ex-Saúde do Adulto). |
| **Quando utilizar** | HAS, DM, DPOC, DRC, oncologia, cuidado perioperatório em enfermaria, estomas, linhas de cuidado DCNT. |
| **Quando NÃO utilizar** | CC/CME como ambiente (→ D04). UTI/monitorização invasiva (→ UTI). Emergência aguda (→ Urgência). Idoso com síndrome geriátrica específica (→ Saúde do Idoso). |

**Observação V1.1:** slug legado `saude-do-adulto` mesclado aqui.

---

### D08 — Ética e Legislação em Enfermagem

| Campo | Valor |
|---|---|
| **Nome** | Ética e Legislação em Enfermagem |
| **Slug** | `etica-e-legislacao-em-enfermagem` |
| **Descrição** | Marco legal do exercício profissional, Código de Ética, COFEN/COREN, responsabilidade profissional. |
| **Quando utilizar** | Lei 7.498/86, Decreto 94.406, Res. COFEN 564/2017, processo ético, deontologia, registro profissional. |
| **Quando NÃO utilizar** | Lei 8.080/8.142 (→ Legislação do SUS). Res. 358/2009 como processo de enfermagem (→ SAE). Dimensionamento como cálculo (→ Administração). |

---

### D09 — Farmacologia

| Campo | Valor |
|---|---|
| **Nome** | Farmacologia |
| **Slug** | `farmacologia` |
| **Descrição** | Farmacocinética, farmacodinâmica, classes farmacológicas, RAM e segurança medicamentosa. |
| **Quando utilizar** | Mecanismo de ação, classe terapêutica, interação, efeito adverso, antídoto, farmacovigilância. |
| **Quando NÃO utilizar** | Técnica de administração (via, diluição, cálculo operacional) (→ Fundamentos). Infusão de droga vasoativa em UTI (→ UTI se foco for monitorização). |

---

### D10 — Fundamentos de Enfermagem

| Campo | Valor |
|---|---|
| **Nome** | Fundamentos de Enfermagem |
| **Slug** | `fundamentos-de-enfermagem` |
| **Descrição** | Técnicas básicas, semiologia/semiotécnica, procedimentos, comunicação e cuidados processuais. |
| **Quando utilizar** | Sinais vitais, punção venosa, curativos, sondagens, oxigenoterapia, higiene das mãos, administração de medicamentos (técnica). |
| **Quando NÃO utilizar** | Processo de Enfermagem formal/NANDA (→ SAE). Mecanismo farmacológico (→ Farmacologia). Protocolo de emergência (→ Urgência). |

---

### D12 — Informática

| Campo | Valor |
|---|---|
| **Nome** | Informática |
| **Slug** | `informatica` |
| **Descrição** | Hardware, software, internet, segurança da informação e informática em saúde. |
| **Quando utilizar** | Word, Excel, Windows, navegadores, LGPD aplicada a TI, prontuário eletrônico como sistema. |
| **Quando NÃO utilizar** | Registro de enfermagem como processo clínico (→ SAE). Política de saúde digital do SUS (→ Legislação do SUS). |

---

### D13 — Legislação do SUS

| Campo | Valor |
|---|---|
| **Nome** | Legislação do SUS |
| **Slug** | `legislacao-do-sus` |
| **Descrição** | Base constitucional e legal, princípios, gestão, controle social, RAS e políticas públicas (absorve ex-Políticas Públicas). |
| **Quando utilizar** | CF/88 art. 196-200, Lei 8.080, 8.142, PNAB, PNH, RAPS como política, conselhos de saúde, financiamento SUS. |
| **Quando NÃO utilizar** | Código de Ética de Enfermagem (→ D08). Programa clínico de imunização (→ Saúde Coletiva). Lei municipal específica (→ disciplina exam-specific). |

**Observação V1.1:** slug legado `politicas-publicas-de-saude` mesclado aqui.

---

### D15 — Português

| Campo | Valor |
|---|---|
| **Nome** | Português |
| **Slug** | `portugues` |
| **Descrição** | Compreensão textual, gramática normativa, semântica e estilística. |
| **Quando utilizar** | Interpretação de texto, concordância, crase, coesão, ortografia, tipologia textual. |
| **Quando NÃO utilizar** | Conteúdo clínico ou normativo de saúde disfarçado de questão de texto — classificar pela substância se for prova específica de enfermagem clínica. |

---

### D16 — Raciocínio Lógico

| Campo | Valor |
|---|---|
| **Nome** | Raciocínio Lógico |
| **Slug** | `raciocinio-logico` |
| **Descrição** | Lógica proposicional e raciocínio matemático aplicado. |
| **Quando utilizar** | Tabela-verdade, sequências, porcentagem, probabilidade, conjuntos, argumentação lógica. |
| **Quando NÃO utilizar** | Cálculo de medicamento clínico (→ Fundamentos ou Farmacologia conforme foco). Estatística epidemiológica (→ Saúde Coletiva). |

---

### D17 — Saúde Coletiva

| Campo | Valor |
|---|---|
| **Nome** | Saúde Coletiva |
| **Slug** | `saude-coletiva` |
| **Descrição** | Epidemiologia, vigilância, determinantes sociais, planejamento e imunização (assuntos ex-D11 reparentados). |
| **Quando utilizar** | Indicadores epidemiológicos, SINAN, notificação compulsória, PNI, calendário vacinal, rede de frio, vigilância sanitária. |
| **Quando NÃO utilizar** | Manejo clínico da doença (→ Doenças Transmissíveis ou especialidade). Técnica de vacinação isolada sem programa (→ Fundamentos se técnica pura). |

**Observação V1.1:** slug legado `imunizacao` — assuntos reparentados para D17, disciplina não existe mais.

---

### D18 — Saúde da Criança e do Adolescente

| Campo | Valor |
|---|---|
| **Nome** | Saúde da Criança e do Adolescente |
| **Slug** | `saude-da-crianca-e-do-adolescente` |
| **Descrição** | RN, crescimento/desenvolvimento, doenças infantis, ECA e saúde do adolescente. |
| **Quando utilizar** | Apgar, aleitamento, AIDPI, puericultura, exantemas infantis, reanimação neonatal. |
| **Quando NÃO utilizar** | Pré-natal e parto (→ Saúde da Mulher). Imunização como programa nacional (→ Saúde Coletiva). |

---

### D19 — Saúde da Mulher

| Campo | Valor |
|---|---|
| **Nome** | Saúde da Mulher |
| **Slug** | `saude-da-mulher` |
| **Descrição** | Pré-natal, parto, puerpério e saúde sexual/reprodutiva. |
| **Quando utilizar** | IG/DPP, partograma, DMG, pré-eclâmpsia, planejamento reprodutivo, climatério. |
| **Quando NÃO utilizar** | Cuidado ao RN após nascimento (→ Saúde da Criança). Depressão pós-parto com foco psiquiátrico (→ Saúde Mental). |

---

### D21 — Saúde do Idoso

| Campo | Valor |
|---|---|
| **Nome** | Saúde do Idoso |
| **Slug** | `saude-do-idoso` |
| **Descrição** | Gerontologia, síndromes geriátricas, cuidado e políticas para pessoa idosa. |
| **Quando utilizar** | Fragilidade, quedas, delirium, demência, polifarmácia, Estatuto do Idoso, AGA. |
| **Quando NÃO utilizar** | HAS/DM genéricos sem especificidade geriátrica (→ Médico-Cirúrgica). Protocolo institucional de quedas (→ Segurança do Paciente). |

---

### D22 — Saúde Mental

| Campo | Valor |
|---|---|
| **Nome** | Saúde Mental |
| **Slug** | `saude-mental` |
| **Descrição** | Reforma Psiquiátrica, RAPS/CAPS, transtornos mentais e cuidado em saúde mental. |
| **Quando utilizar** | Lei 10.216/2001, CAPS, redução de danos, suicídio, psicofármacos no contexto do transtorno. |
| **Quando NÃO utilizar** | Classe farmacológica em abstrato (→ Farmacologia). Contenção em PS geral (→ Urgência). Política RAPS em abstrato (→ Legislação do SUS). |

---

### D23 — Segurança do Paciente

| Campo | Valor |
|---|---|
| **Nome** | Segurança do Paciente |
| **Slug** | `seguranca-do-paciente` |
| **Descrição** | Metas internacionais, PNSP, cultura de segurança e gestão de risco assistencial. |
| **Quando utilizar** | 6 metas internacionais, NSP, notificação de eventos adversos, acreditação ONA, identificação segura. |
| **Quando NÃO utilizar** | Técnica de punção ou curativo sem referência a protocolo de segurança (→ Fundamentos). IRAS/vigilância (→ Biossegurança). |

---

### D24 — Sistematização da Assistência de Enfermagem (SAE)

| Campo | Valor |
|---|---|
| **Nome** | Sistematização da Assistência de Enfermagem (SAE) |
| **Slug** | `sistematizacao-da-assistencia-de-enfermagem-sae` |
| **Descrição** | Processo de Enfermagem, Res. 358/2009, NANDA-NOC-NIC, registro e documentação. |
| **Quando utilizar** | 5 etapas, diagnóstico NANDA, prescrição de enfermagem, taxonomias NNN, CIPE. |
| **Quando NÃO utilizar** | Diagnóstico médico (CID) (→ especialidade clínica). Res. 358 citada como norma COFEN genérica (→ D08). Tópico duplicado dentro de Fundamentos — **usar sempre esta disciplina**. |

---

### D25 — Terapia Intensiva (UTI)

| Campo | Valor |
|---|---|
| **Nome** | Terapia Intensiva (UTI) |
| **Slug** | `terapia-intensiva-uti` |
| **Descrição** | Monitorização, suporte ventilatório e hemodinâmico do paciente crítico. |
| **Quando utilizar** | VM, PEEP, drogas vasoativas em infusão contínua, escores de gravidade, PAV, delirium em UTI. |
| **Quando NÃO utilizar** | RCP inicial no PS (→ Urgência). Cuidado clínico não crítico (→ Médico-Cirúrgica). |

---

### D26 — Urgência e Emergência

| Campo | Valor |
|---|---|
| **Nome** | Urgência e Emergência |
| **Slug** | `urgencia-e-emergencia` |
| **Descrição** | Classificação de risco, suporte de vida, emergências clínicas e traumáticas. |
| **Quando utilizar** | Manchester, RCP, sepse aguda, AVC agudo, politrauma, SAMU, anafilaxia, intoxicação. |
| **Quando NÃO utilizar** | Cuidado crônico ambulatorial (→ Médico-Cirúrgica). Monitorização prolongada em UTI (→ UTI). |

---

## Disciplinas inativas ou legado (não classificar como primárias)

| ID/Nome | Slug legado | Destino V1.1 |
|---|---|---|
| D02 Anatomia e Fisiologia | `anatomia-fisiologia` | `MATERIAL_DE_APOIO` — classificar na disciplina clínica aplicada |
| D05 Controle de Infecção Hospitalar | `controle-de-infeccao-hospitalar` | Mesclado em D03 Biossegurança |
| D11 Imunização | `imunizacao` | Assuntos reparentados para D17 Saúde Coletiva |
| D14 Políticas Públicas de Saúde | `politicas-publicas-de-saude` | Mesclado em D13 Legislação do SUS |
| D20 Saúde do Adulto | `saude-do-adulto` | Mesclado em D07 Médico-Cirúrgica |

## Disciplinas exam-specific (seed only — usar só quando edital exigir)

| Nome | Slug | Quando utilizar |
|---|---|---|
| Legislação Aplicada à EBSERH | `legislacao-aplicada-a-ebserh` | Provas EBSERH com bloco específico |
| Legislação Municipal e Institucional | `legislacao-municipal-e-institucional` | Provas municipais/estaduais com bloco jurídico local |
| Conhecimentos Gerais sobre o Distrito Federal | `conhecimentos-gerais-sobre-o-distrito-federal` | Provas SES-DF / cargo DF |

**Regra:** preferir disciplina V1.1 sempre que possível. Exam-specific só com evidência no edital da prova.
