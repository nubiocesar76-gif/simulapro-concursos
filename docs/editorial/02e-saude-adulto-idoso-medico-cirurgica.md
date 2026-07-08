# 02e — Saúde do Adulto · Saúde do Idoso · Enfermagem Médico-Cirúrgica

Estas três disciplinas formam o maior bloco de sobreposição potencial do
curso: as três tratam de "doença no adulto", diferenciadas por **ciclo de
vida** (adulto vs. idoso) e por **cenário assistencial** (clínico geral vs.
perioperatório/cirúrgico). Regra mestra: **se o paciente tem 60 anos ou mais
e a questão explora especificidade geriátrica (polifarmácia, fragilidade,
síndromes geriátricas) → Saúde do Idoso; se o eixo é preparo/cuidado
cirúrgico independente da idade → Médico-Cirúrgica; caso contrário → Saúde
do Adulto.**

---

## 1. Saúde do Adulto (`saude-do-adulto`)

> **ERRATA V1.1**: disciplina MESCLADA — absorvida integralmente pela
> Enfermagem Médico-Cirúrgica (seção 3 deste arquivo, `D07`, **nome mantido
> inalterado** — não há aprovação explícita para renomear, apenas para
> remover esta disciplina). Auditoria H1: sobreposição quase total nas 10
> bancas de referência, que nunca separam "doença crônica do adulto" de
> "cuidado cirúrgico do adulto" como dois cabeçalhos distintos. `D20`
> deixa de ser disciplina ativa (`status = MESCLADA`, `supersededBy = D07`),
> preservada apenas para retrocompatibilidade de id. Todos os
> assuntos/subassuntos abaixo foram reparentados para D07 mantendo seus
> próprios IDs, sem perda de conteúdo e sem nenhum assunto novo criado. Ver
> `docs/editorial/auditoria/V1.1-arquitetura-corrigida.md`.

### 1.1 Sinônimos usados pelas bancas
"Enfermagem Clínica", "Enfermagem em Clínica Médica", "Assistência de
Enfermagem ao Adulto", "Doenças Crônicas Não Transmissíveis (DCNT)".

### 1.2 Palavras-chave centrais
hipertensão arterial sistêmica, diabetes mellitus, doença renal crônica,
DPOC, asma, insuficiência cardíaca, AVC, obesidade, dislipidemia, cuidado
crônico, linha de cuidado.

### 1.3 Siglas
HAS (Hipertensão Arterial Sistêmica), DM (Diabetes Mellitus), DPOC (Doença
Pulmonar Obstrutiva Crônica), DRC (Doença Renal Crônica), IC (Insuficiência
Cardíaca), AVC/AVE (Acidente Vascular Cerebral/Encefálico), IAM (Infarto
Agudo do Miocárdio — cruza com Urgência), DCNT (Doenças Crônicas Não
Transmissíveis), HGT (Hemoglicoteste).

### 1.4 Assuntos e subassuntos
**Assunto: Doenças Cardiovasculares**
- Hipertensão Arterial Sistêmica (`hipertensao-arterial-sistemica`)
- Insuficiência Cardíaca (`insuficiencia-cardiaca`)
- Doença Arterial Coronariana / Angina (`doenca-arterial-coronariana-angina`)
- Arritmias Cardíacas (crônicas, ambulatoriais) (`arritmias-cardiacas`)

**Assunto: Doenças Endócrino-metabólicas**
- Diabetes Mellitus (tipo 1, tipo 2, classificação, metas glicêmicas) (`diabetes-mellitus`)
- Complicações Crônicas do Diabetes (retinopatia, nefropatia, neuropatia,
  pé diabético) (`complicacoes-cronicas-do-diabetes`)
- Obesidade e Síndrome Metabólica (`obesidade-e-sindrome-metabolica`)
- Dislipidemias (`dislipidemias`)
- Distúrbios da Tireoide (`disturbios-da-tireoide`)

**Assunto: Doenças Respiratórias Crônicas**
- Doença Pulmonar Obstrutiva Crônica — DPOC (`dpoc`)
- Asma (`asma`)

**Assunto: Doenças Renais e Neurológicas Crônicas**
- Doença Renal Crônica e Terapia Renal Substitutiva (diálise peritoneal,
  hemodiálise) (`doenca-renal-cronica-e-trs`)
- Acidente Vascular Cerebral: fase crônica e reabilitação (`avc-fase-cronica-reabilitacao`)
- Epilepsia (`epilepsia`)

**Assunto: Cuidado Crônico e Linha de Cuidado**
- Linha de Cuidado das DCNT (`linha-de-cuidado-dcnt`)
- Automonitorização e Adesão ao Tratamento (`automonitorizacao-e-adesao-ao-tratamento`)
- Cuidados Paliativos (base — aprofundado também em Saúde do Idoso) (`cuidados-paliativos`)

### 1.5 Leis, protocolos, portarias, programas
- Caderno de Atenção Básica nº 36 e 37 (Diabetes Mellitus e Hipertensão
  Arterial — MS).
- Plano de Ações Estratégicas para o Enfrentamento das DCNT (MS, 2011–2022).
- Programa Nacional Academia da Saúde (interseção com Políticas Públicas).
- Diretrizes da Sociedade Brasileira de Cardiologia/Diabetes (quando citadas
  literalmente pela banca — mais comum em FGV e Cebraspe).

### 1.6 Casos ambíguos
- **Saúde do Adulto vs. Urgência e Emergência**: a mesma doença (ex.: IAM,
  AVC) pode ser cobrada em fase aguda/emergencial (Urgência) ou em fase
  crônica/ambulatorial (Saúde do Adulto). Regra: presença de termos como
  "sala de emergência", "protocolo de dor torácica", "trombólise", "código
  AVC" → Urgência; termos como "acompanhamento ambulatorial", "adesão ao
  tratamento", "prevenção secundária" → Saúde do Adulto.
- **Saúde do Adulto vs. Saúde do Idoso**: ver regra mestra no topo do
  arquivo.
- **Saúde do Adulto vs. Médico-Cirúrgica**: quando a doença crônica exige
  intervenção cirúrgica (ex.: paciente diabético em pré-operatório de
  amputação), a questão pode ser dividida — o preparo cirúrgico é
  Médico-Cirúrgica, o manejo da doença de base é Saúde do Adulto.

### 1.7 Assuntos que aparecem juntos
HAS + DM (comorbidade mais cobrada em conjunto do currículo inteiro);
DPOC + Asma (doenças obstrutivas, comparadas); DRC + Diálise + Complicações
do Diabetes (nefropatia diabética como ponte).

---

## 2. Saúde do Idoso (`saude-do-idoso`)

### 2.1 Sinônimos usados pelas bancas
"Enfermagem Gerontológica", "Enfermagem em Geriatria e Gerontologia",
"Saúde da Pessoa Idosa", "Assistência ao Idoso".

### 2.2 Palavras-chave centrais
envelhecimento, fragilidade, síndromes geriátricas, polifarmácia,
sarcopenia, delirium, incontinência, quedas em idosos, avaliação geriátrica
ampla, cuidados paliativos.

### 2.3 Siglas
AGA (Avaliação Geriátrica Ampla), IVCF-20 (Índice de Vulnerabilidade Clínico
Funcional), ILPI (Instituição de Longa Permanência para Idosos), SIAB/e-SUS
(quando citado no contexto do cadastro do idoso), EA (Estatuto do Idoso).

### 2.4 Assuntos e subassuntos
**Assunto: Bases da Gerontologia**
- Teorias do Envelhecimento (biológicas, psicossociais) (`teorias-do-envelhecimento`)
- Envelhecimento Populacional e Transição Demográfica (interseção com Saúde
  Coletiva) (`envelhecimento-populacional`)
- Avaliação Geriátrica Ampla — AGA (`avaliacao-geriatrica-ampla`)

**Assunto: Síndromes Geriátricas**
- Fragilidade e Sarcopenia (`fragilidade-e-sarcopenia`)
- Quedas no Idoso (interseção com Fundamentos/Segurança do Paciente) (`quedas-no-idoso`)
- Incontinência Urinária e Fecal (`incontinencia-urinaria-e-fecal`)
- Delirium (`delirium`)
- Demências (Alzheimer, Vascular, outras) (`demencias`)
- Imobilidade e Instabilidade Postural (`imobilidade-e-instabilidade-postural`)
- Iatrogenia e Polifarmácia (`iatrogenia-e-polifarmacia`)

**Assunto: Cuidado ao Idoso**
- Cuidados Paliativos no Idoso (`cuidados-paliativos-no-idoso`)
- Instituição de Longa Permanência para Idosos — ILPI (`ilpi`)
- Cuidador de Idosos (`cuidador-de-idosos`)
- Violência contra o Idoso (`violencia-contra-o-idoso`)

**Assunto: Direitos e Políticas**
- Estatuto do Idoso — Lei nº 10.741/2003 (`estatuto-do-idoso`)
- Política Nacional da Pessoa Idosa (interseção com Políticas Públicas) (`politica-nacional-pessoa-idosa`)
- Caderneta de Saúde da Pessoa Idosa (`caderneta-de-saude-da-pessoa-idosa`)

### 2.5 Leis, protocolos, portarias, programas
- Lei nº 10.741/2003 — Estatuto do Idoso.
- Lei nº 8.842/1994 — Política Nacional do Idoso (PNI, não confundir com
  Programa Nacional de Imunizações, mesma sigla — ver
  `05-casos-ambiguos-*.md`).
- Portaria MS/GM nº 2.528/2006 — Política Nacional de Saúde da Pessoa Idosa.
- Caderno de Atenção Básica nº 19 — Envelhecimento e Saúde da Pessoa Idosa.

### 2.6 Casos ambíguos
- **PNI = Política Nacional do Idoso vs. PNI = Programa Nacional de
  Imunizações**: mesma sigla, dois significados totalmente diferentes.
  Regra de desambiguação por contexto: se aparece junto de "Lei 8.842/1994"
  ou "pessoa idosa", é a Política; se aparece junto de "vacina/calendário",
  é o Programa (ver `03-dicionario-editorial-*.md`).
- Ver regra mestra do topo do arquivo para o limite com Saúde do Adulto.
- **Quedas no Idoso**: pode ser classificado em Saúde do Idoso (síndrome
  geriátrica) ou em Fundamentos/Segurança do Paciente (protocolo
  institucional de prevenção de queda). Regra: se o enunciado cita
  fisiopatologia/fatores de risco geriátricos → Saúde do Idoso; se cita a
  "Meta 6" ou o protocolo institucional → Segurança do Paciente.

### 2.7 Assuntos que aparecem juntos
AGA + Fragilidade + Polifarmácia (bloco de avaliação global do idoso);
Delirium + Demências (diagnóstico diferencial clássico); Estatuto do Idoso +
Violência contra o Idoso + Política Nacional da Pessoa Idosa.

---

## 3. Enfermagem Médico-Cirúrgica (`enfermagem-medico-cirurgica`)

> **ERRATA V1.1**: absorveu integralmente a seção 1 (Saúde do Adulto) —
> ver nota lá. Nome **mantido inalterado** (nenhuma renomeação aprovada
> além das fusões/remoções explicitamente listadas). `D07` agora cobre
> tanto doença crônica do adulto quanto cuidado cirúrgico do adulto.

### 3.1 Sinônimos usados pelas bancas
"Enfermagem Cirúrgica", "Assistência de Enfermagem em Clínica Cirúrgica",
"Enfermagem em Cirurgia", "Cuidados Perioperatórios" (quando a banca separa
do bloco Fundamentos).

### 3.2 Palavras-chave centrais
perioperatório, pós-operatório imediato/mediato/tardio, drenos, estomas,
feridas cirúrgicas, complicações cirúrgicas, cuidado por especialidade
cirúrgica (ortopedia, digestiva, urológica, oncológica).

### 3.3 Siglas
PO (Pós-operatório), SNG (cruza com Fundamentos), VMI (Ventilação Mecânica
Invasiva — cruza com UTI), TEP/TVP (Tromboembolismo Pulmonar/Trombose Venosa
Profunda), RTU (Ressecção Transuretral).

### 3.4 Assuntos e subassuntos
**Assunto: Cuidado Perioperatório**
- Avaliação Pré-operatória (interseção com Fundamentos) (`avaliacao-pre-operatoria-medico-cirurgica`)
- Complicações Pós-operatórias (hemorragia, infecção de sítio cirúrgico,
  deiscência, TVP/TEP) (`complicacoes-pos-operatorias`)
- Manejo de Drenos e Drenagens (`manejo-de-drenos-e-drenagens`)

**Assunto: Enfermagem em Especialidades Cirúrgicas**
- Cirurgia Ortopédica e Traumatológica (`cirurgia-ortopedica-e-traumatologica`)
- Cirurgia do Aparelho Digestivo (`cirurgia-do-aparelho-digestivo`)
- Cirurgia Urológica (`cirurgia-urologica`)
- Cirurgia Oncológica (`cirurgia-oncologica`)
- Neurocirurgia (cuidados básicos) (`neurocirurgia-cuidados-basicos`)
- Cirurgia Cardíaca (cuidados básicos, interseção com UTI) (`cirurgia-cardiaca-cuidados-basicos`)

**Assunto: Estomas e Feridas Complexas**
- Estomias (colostomia, ileostomia, urostomia) e Cuidados (`estomias-e-cuidados`)
- Feridas Cirúrgicas Complexas (`feridas-cirurgicas-complexas`)

**Assunto: Oncologia**
- Enfermagem Oncológica: quimioterapia, radioterapia (cuidados básicos) (`enfermagem-oncologica-basica`)
- Cuidados Paliativos Oncológicos (interseção com Saúde do Idoso) (`cuidados-paliativos-oncologicos`)

### 3.5 Leis, protocolos, portarias, programas
- Protocolo de Cirurgia Segura (interseção direta com Segurança do
  Paciente — Meta 4).
- RDC ANVISA nº 15/2012 (processamento de produtos para saúde — cruza com
  Centro Cirúrgico/CME).
- Política Nacional de Atenção Oncológica (Portaria MS/GM nº 2.439/2005).

### 3.6 Casos ambíguos
- Ver seção 1.6 (limite com Saúde do Adulto).
- **Médico-Cirúrgica vs. Centro Cirúrgico e CME**: Médico-Cirúrgica trata do
  **cuidado clínico ao paciente cirúrgico** (antes/depois, por
  especialidade); Centro Cirúrgico e CME trata do **ambiente e processo**
  (sala cirúrgica, instrumentação, esterilização). Regra: se o sujeito do
  enunciado é o paciente e sua recuperação → Médico-Cirúrgica; se é o
  processo/instrumental/sala → Centro Cirúrgico e CME.
- **Médico-Cirúrgica vs. UTI**: cuidados pós-operatórios de cirurgia de
  grande porte que exigem terapia intensiva (ex.: pós-operatório de cirurgia
  cardíaca em UTI) — classificar em UTI quando o enunciado enfatiza
  monitorização intensiva/ventilação mecânica; em Médico-Cirúrgica quando
  enfatiza cuidado cirúrgico específico da especialidade.

### 3.7 Assuntos que aparecem juntos
Avaliação Pré-operatória + Complicações Pós-operatórias + Cirurgia Segura;
Estomias + Feridas Cirúrgicas Complexas + Curativos (Fundamentos);
Cirurgia Oncológica + Enfermagem Oncológica + Cuidados Paliativos.
