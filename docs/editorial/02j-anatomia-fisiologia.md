# 02j — Anatomia e Fisiologia (`anatomia-fisiologia`)

> **ERRATA V1.1**: REMOVIDA como disciplina curricular própria (auditoria
> H1 — nenhuma das 10 bancas de referência testa isso como bloco isolado
> para o cargo Enfermeiro; exceção parcial: FUNDEP e UFPR/NC). Passa a ser
> **material de apoio transversal** (`status = MATERIAL_DE_APOIO`),
> referenciável por qualquer disciplina clínica, sem frequência de edital
> própria. Todo o conteúdo abaixo (7 assuntos / 23 subassuntos)
> permanece, apenas sem peso curricular independente. Ver
> `docs/editorial/auditoria/V1.1-arquitetura-corrigida.md`.

## 1. Sinônimos usados pelas bancas
"Anatomia Humana", "Fisiologia Humana", "Anatomofisiologia dos Sistemas",
"Bases Biológicas da Enfermagem" (nomenclatura mais rara, usada por bancas
universitárias como UFPR/NC).

## 2. Palavras-chave centrais
sistema cardiovascular, sistema respiratório, sistema digestório, sistema
nervoso, sistema urinário, sistema endócrino, homeostase, anatomia
topográfica.

## 3. Siglas
SNC/SNP (Sistema Nervoso Central/Periférico), SNA (Sistema Nervoso
Autônomo — simpático/parassimpático), TGI (Trato Gastrointestinal), FC/FR/PA
(cruzam com Fundamentos como parâmetros fisiológicos).

## 4. Assuntos e subassuntos

**Assunto: Sistema Cardiovascular**
- Anatomia do Coração e Grandes Vasos (`anatomia-do-coracao-e-grandes-vasos`)
- Ciclo Cardíaco e Sistema de Condução (`ciclo-cardiaco-e-sistema-de-conducao`)
- Circulação Sistêmica e Pulmonar (`circulacao-sistemica-e-pulmonar`)
- Sistema Cardiovascular *(já presente em taxonomy.json como topic)* (`sistema-cardiovascular`)

**Assunto: Sistema Respiratório**
- Anatomia das Vias Aéreas e Pulmões (`anatomia-das-vias-aereas-e-pulmoes`)
- Mecânica Ventilatória e Trocas Gasosas (`mecanica-ventilatoria-e-trocas-gasosas`)
- Controle da Respiração (`controle-da-respiracao`)

**Assunto: Sistema Digestório**
- Anatomia do Trato Gastrointestinal (`anatomia-do-trato-gastrointestinal`)
- Fígado, Vesícula Biliar e Pâncreas Exócrino (`figado-vesicula-biliar-pancreas-exocrino`)
- Fisiologia da Digestão e Absorção (`fisiologia-da-digestao-e-absorcao`)

**Assunto: Sistema Nervoso**
- Sistema Nervoso Central (encéfalo, medula) (`sistema-nervoso-central`)
- Sistema Nervoso Periférico e Nervos Cranianos (`sistema-nervoso-periferico-e-nervos-cranianos`)
- Sistema Nervoso Autônomo (Simpático/Parassimpático) (`sistema-nervoso-autonomo`)

**Assunto: Sistema Urinário e Renal**
- Anatomia do Rim e Vias Urinárias (`anatomia-do-rim-e-vias-urinarias`)
- Fisiologia da Filtração Glomerular (`fisiologia-da-filtracao-glomerular`)
- Equilíbrio Hidroeletrolítico e Ácido-Base (`equilibrio-hidroeletrolitico-e-acido-base`)

**Assunto: Sistema Endócrino**
- Glândulas Endócrinas e Hormônios (`glandulas-endocrinas-e-hormonios`)
- Eixo Hipotálamo-Hipófise (`eixo-hipotalamo-hipofise`)
- Pâncreas Endócrino (`pancreas-endocrino`)

**Assunto: Outros Sistemas**
- Sistema Musculoesquelético (`sistema-musculoesqueletico`)
- Sistema Tegumentar (Pele e Anexos) (`sistema-tegumentar`)
- Sistema Reprodutor Feminino e Masculino (`sistema-reprodutor`)
- Sistema Hematológico e Imunológico (`sistema-hematologico-e-imunologico`)

## 5. Leis, protocolos, portarias, programas
Não se aplica diretamente (disciplina de ciência básica, sem normativa
própria). Referências bibliográficas clássicas citadas por banca: Guyton &
Hall (Fisiologia), Tortora (Anatomia e Fisiologia), Moore (Anatomia
Orientada para a Clínica).

## 6. Casos ambíguos
- **Anatomia e Fisiologia é a disciplina mais "usada como pano de fundo" por
  outras** — praticamente toda questão clínica pressupõe conhecimento
  anatomofisiológico. Regra do SimulaPro: **só classificar em Anatomia e
  Fisiologia quando a pergunta em si for sobre estrutura/função normal**
  (ex.: "qual estrutura é responsável por..."); se a pergunta envolve
  alteração patológica, tratamento ou cuidado de enfermagem, classificar na
  disciplina clínica correspondente (Saúde do Adulto, Médico-Cirúrgica etc.),
  mesmo que a "pegadinha" exija saber anatomia.
- **Equilíbrio Hidroeletrolítico e Ácido-Base**: pode aparecer em Anatomia e
  Fisiologia (mecanismo normal) ou em Saúde do Adulto/UTI (distúrbio
  hidroeletrolítico como condição clínica) — regra: mecanismo normal de
  regulação → Anatomia e Fisiologia; distúrbio (hipo/hipercalemia etc.) e
  sua correção → disciplina clínica.

## 7. Assuntos que aparecem juntos
Sistema Cardiovascular + Sistema Respiratório (fisiologia integrada
cardiorrespiratória, tema clássico); Sistema Nervoso Autônomo + Sistema
Cardiovascular (mecanismos de FC/PA); Sistema Renal + Equilíbrio
Hidroeletrolítico (base para distúrbios cobrados em Saúde do Adulto/UTI).
