# 02h — Centro Cirúrgico e CME · Controle de Infecção Hospitalar

## 1. Centro Cirúrgico e CME (`centro-cirurgico-e-cme`)

### 1.1 Sinônimos usados pelas bancas
"Enfermagem em Centro Cirúrgico", "Bloco Cirúrgico", "Central de Material e
Esterilização (CME)", "Instrumentação Cirúrgica", "Recuperação
Pós-Anestésica (RPA/SRPA)".

### 1.2 Palavras-chave centrais
paramentação cirúrgica, campo estéril, instrumentação, tempo cirúrgico,
esterilização, desinfecção, autoclave, indicador biológico/químico,
rastreabilidade de materiais.

### 1.3 Siglas
CME (Central de Material e Esterilização), RPA/SRPA (Recuperação
Pós-Anestésica/Sala de Recuperação Pós-Anestésica), SCIH (cruza com
Controle de Infecção), CCIH, TSC (Técnico em Saúde/instrumentador), ATP
(indicador de limpeza, quando citado), ETO (Óxido de Etileno).

### 1.4 Assuntos e subassuntos
**Assunto: Estrutura e Organização do Centro Cirúrgico**
- Planta Física e Fluxos do Centro Cirúrgico (`planta-fisica-centro-cirurgico`)
- Zoneamento (área não restrita, semirrestrita, restrita) (`zoneamento-centro-cirurgico`)
- Equipe Cirúrgica: papéis e funções (`equipe-cirurgica-papeis`)

**Assunto: Paramentação e Assepsia**
- Paramentação Cirúrgica (`paramentacao-cirurgica`)
- Escovação Cirúrgica das Mãos (`escovacao-cirurgica-das-maos`)
- Técnica Asséptica e Campo Estéril (`tecnica-assepticacampo-esteril`)

**Assunto: Instrumentação Cirúrgica**
- Instrumental Cirúrgico Básico (`instrumental-cirurgico-basico`)
- Posicionamento Cirúrgico do Paciente (`posicionamento-cirurgico-do-paciente`)
- Contagem de Compressas e Instrumentais (`contagem-de-compressas-e-instrumentais`)

**Assunto: Recuperação Pós-Anestésica**
- Sala de Recuperação Pós-Anestésica — SRPA (`sala-de-recuperacao-pos-anestesica`)
- Escala de Aldrete e Kroulik (critérios de alta da SRPA) (`escala-de-aldrete-kroulik`)
- Complicações Anestésicas Imediatas (`complicacoes-anestesicas-imediatas`)

**Assunto: Central de Material e Esterilização**
- Fluxo do Material na CME (recepção, limpeza, preparo, esterilização,
  distribuição) (`fluxo-do-material-na-cme`)
- Métodos de Limpeza e Desinfecção (`metodos-de-limpeza-e-desinfeccao`)
- Métodos de Esterilização (autoclave a vapor, óxido de etileno, plasma de
  peróxido de hidrogênio) (`metodos-de-esterilizacao`)
- Indicadores de Esterilização (biológico, químico, físico) (`indicadores-de-esterilizacao`)
- Rastreabilidade de Materiais Esterilizados (`rastreabilidade-de-materiais`)
- Embalagem e Armazenamento de Materiais Estéreis (`embalagem-e-armazenamento-de-materiais-esteris`)

### 1.5 Leis, protocolos, portarias, programas
- RDC ANVISA nº 15/2012 — Requisitos de boas práticas para o processamento
  de produtos para saúde (norma central da CME).
- RDC ANVISA nº 50/2002 — Regulamento técnico para planejamento,
  programação, elaboração e avaliação de projetos físicos de
  estabelecimentos de saúde (zoneamento do centro cirúrgico).
- Protocolo de Cirurgia Segura (interseção com Segurança do Paciente).
- Manual de Processamento de Produtos para a Saúde (ANVISA/SOBECC).

### 1.6 Casos ambíguos
- Ver `02e` seção 3.6 (limite com Médico-Cirúrgica).
- **CME vs. Biossegurança**: uso de EPI durante o processamento de material
  contaminado é comum às duas; regra: se o enunciado enfatiza *etapas do
  reprocessamento* (limpeza → desinfecção → esterilização), CME; se
  enfatiza *proteção do trabalhador durante o manuseio*, Biossegurança.
- **CME vs. Controle de Infecção Hospitalar**: indicadores de esterilização
  e validação de processo podem ser cobrados nas duas — regra: processo
  técnico da CME em si → Centro Cirúrgico e CME; monitoramento
  epidemiológico de falhas de esterilização como causa de infecção →
  Controle de Infecção.

### 1.7 Assuntos que aparecem juntos
Paramentação + Escovação Cirúrgica + Técnica Asséptica; Fluxo da CME +
Métodos de Esterilização + Indicadores de Esterilização (sequência lógica,
cobrada como "ordene as etapas"); SRPA + Escala de Aldrete + Complicações
Anestésicas Imediatas.

---

## 2. Controle de Infecção Hospitalar (`controle-de-infeccao-hospitalar`)

> **ERRATA V1.1**: disciplina MESCLADA — absorvida por Biossegurança
> (`02a`, `D03`), que permanece com o nome original (não foi renomeada).
> `D05` deixa de ser disciplina ativa (`status = MESCLADA`,
> `supersededBy = D03`), preservada apenas para retrocompatibilidade de
> id. Os 4 assuntos abaixo foram reparentados para D03 mantendo seus IDs
> — nenhum assunto novo foi criado. Ver
> `docs/editorial/auditoria/V1.1-arquitetura-corrigida.md`.

### 2.1 Sinônimos usados pelas bancas
"Prevenção e Controle de Infecção Relacionada à Assistência à Saúde
(IRAS)", "Comissão de Controle de Infecção Hospitalar (CCIH)",
"Epidemiologia Hospitalar", "Infecção Hospitalar" (termo antigo, ainda usado
por bancas mais tradicionais como IBFC e FAFIPA).

### 2.2 Palavras-chave centrais
IRAS, infecção de sítio cirúrgico, infecção do trato urinário associada a
cateter, infecção de corrente sanguínea associada a cateter, precaução de
contato/gotículas/aerossóis, vigilância epidemiológica hospitalar,
bactéria multirresistente.

### 2.3 Siglas
IRAS (Infecção Relacionada à Assistência à Saúde — substituiu "IH"/"infecção
hospitalar" na nomenclatura oficial), CCIH (Comissão de Controle de Infecção
Hospitalar), ISC (Infecção de Sítio Cirúrgico), ITU-AC (Infecção do Trato
Urinário Associada a Cateter), ICS-CVC (Infecção de Corrente Sanguínea
associada a Cateter Venoso Central), MRSA (*Staphylococcus aureus*
resistente à meticilina), KPC (*Klebsiella pneumoniae* produtora de
carbapenemase), CCIRAS (nomenclatura recente para o núcleo/serviço de
controle de infecção em algumas normativas).

### 2.4 Assuntos e subassuntos
**Assunto: Estrutura da Vigilância de IRAS**
- Comissão de Controle de Infecção Hospitalar — CCIH: composição e
  competências (`ccih-composicao-e-competencias`)
- Serviço de Controle de Infecção Hospitalar — SCIH (`scih`)
- Indicadores Epidemiológicos de IRAS (densidade de incidência, taxa de
  infecção) (`indicadores-epidemiologicos-de-iras`)
- Notificação de IRAS à ANVISA (`notificacao-de-iras-anvisa`)

**Assunto: Infecções Relacionadas a Dispositivos**
- Infecção de Corrente Sanguínea associada a Cateter Venoso Central (`icscvc`)
- Infecção do Trato Urinário associada a Cateter Vesical (`itu-associada-a-cateter`)
- Pneumonia Associada à Ventilação Mecânica (interseção com UTI) (`pav-controle-de-infeccao`)
- Infecção de Sítio Cirúrgico (interseção com Médico-Cirúrgica/CME) (`infeccao-de-sitio-cirurgico`)

**Assunto: Microrganismos Multirresistentes**
- Bactérias Multirresistentes (MRSA, VRE, KPC, Acinetobacter) (`bacterias-multirresistentes`)
- Uso Racional de Antimicrobianos / Antimicrobial Stewardship (interseção
  com Farmacologia) (`uso-racional-de-antimicrobianos`)

**Assunto: Medidas de Prevenção**
- Precauções Padrão e Específicas (aprofundamento clínico — interseção com
  Biossegurança) (`precaucoes-controle-de-infeccao`)
- Higienização das Mãos — os "5 momentos" da OMS (`5-momentos-higienizacao-das-maos`)
- Bundles de Prevenção (ICS, ITU, PAV, ISC) (`bundles-de-prevencao`)
- Limpeza e Desinfecção de Superfícies Hospitalares (`limpeza-e-desinfeccao-de-superficies`)

### 2.5 Leis, protocolos, portarias, programas
- RDC ANVISA nº 63/2011 — Boas Práticas de Funcionamento para os Serviços
  de Saúde.
- Portaria MS/GM nº 2.616/1998 — Programa de Controle de Infecção
  Hospitalar (histórica, ainda citada como marco regulatório da CCIH).
- Lei nº 9.431/1997 — obrigatoriedade de manter Programa de Controle de
  Infecção Hospitalar.
- Manual "Higienização das Mãos em Serviços de Saúde" (ANVISA, baseado no
  guia da OMS "5 momentos").
- Medidas de Prevenção de Infecção Relacionada à Assistência à Saúde
  (ANVISA, série de cadernos por tipo de infecção — ICS, ITU, PAV, ISC).

### 2.6 Casos ambíguos
Ver seções 1.6 acima e seção 2.6 de `02a` (Biossegurança) e `02g` (UTI/PAV,
Urgência/Sepse). Regra consolidada: **Controle de Infecção Hospitalar é
sempre o "dono" da vigilância epidemiológica e do indicador institucional de
infecção; as demais disciplinas são "donas" do cuidado clínico direto que
previne essa infecção.**

### 2.7 Assuntos que aparecem juntos
CCIH + SCIH + Indicadores Epidemiológicos; os 4 principais IRAS (ICS-CVC,
ITU-AC, PAV, ISC) costumam ser cobrados em bloco comparativo; Bactérias
Multirresistentes + Uso Racional de Antimicrobianos + Precauções de
Contato.
