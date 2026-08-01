# DOSSIÊ MESTRE — CONTROLE DE INFECÇÃO HOSPITALAR (CCIH / IRAS) — V1

## Objetivo

Base técnica oficial da disciplina "Controle de Infecção Hospitalar" do SimulaPro. Não gera questões, não resume para aluno. É a fonte editorial permanente para o Motor Editorial.

## Achado Editorial (obrigatório registrar — não silenciar)

**Achado 1 — tensão com decisão arquitetural anterior.** O documento de referência real (`docs/editorial/02h-centro-cirurgico-cme-controle-infeccao.md`, seção 2) traz uma ERRATA V1.1 que classifica "Controle de Infecção Hospitalar" (`D05`) como **disciplina MESCLADA, absorvida por Biossegurança (`D03`, `02a`)** — `status = MESCLADA`, `supersededBy = D03`, preservada apenas para retrocompatibilidade de id. Exatamente como já observado em sprints anteriores desta sessão (Anatomia e Fisiologia/`MATERIAL_DE_APOIO`; Saúde do Adulto/Médico-Cirúrgica), essa fusão existe apenas na taxonomia-sombra `editorial_disciplines` — **a tabela real `subjects` nunca aplicou essa fusão**: "Controle de Infecção Hospitalar" (id `936a64a5-680e-48b9-a127-bff014b445c6`) e "Biossegurança" (id `c2bd7dd3-f42e-4283-895b-17b83e0e8966`) continuam sendo duas disciplinas reais, independentes e ativas no banco de produção, cada uma com acervo próprio (18 e 22 questões, respectivamente, antes desta sprint). O usuário instruiu esta sprint nomeando explicitamente "Controle de Infecção Hospitalar (CCIH / IRAS)" — instrução tratada como decisão editorial informada, prosseguindo com a produção nesta disciplina real e independente, sem reverter nem aplicar a fusão da taxonomia-sombra.

**Achado 2 — sobreposição real de tópicos entre as duas disciplinas.** Os `topics` reais desta disciplina (`CCIH e Prevenção de Infecção Hospitalar`, `Precauções e Isolamento`, `Reprocessamento de Produtos para Saúde`) **existem também, com os mesmos nomes/slugs, como `topics` reais de Biossegurança** (linhas distintas, `subject_id` diferente) — Biossegurança já possui 7 questões reais sob esses 3 nomes de tópico. Isso é consistente com o Achado 1 (fusão nunca aplicada à arquitetura real, mas o conteúdo já foi produzido nos dois lados). **Tratamento adotado:** a verificação de duplicidade desta sprint (Plano Editorial) inclui, além da checagem interna já padrão, uma checagem cruzada explícita contra as 7 questões reais de Biossegurança nesses mesmos tópicos — nenhuma questão nova desta sprint repete o recorte já coberto em nenhuma das duas disciplinas.

## Fonte real de base

Reaproveita `docs/editorial/02h-centro-cirurgico-cme-controle-infeccao.md`, seção 2 (`Controle de Infecção Hospitalar`, `D05`), sem reescrever do zero.

## Sinônimos, palavras-chave e siglas (herdados de 02h, seção 2)

Sinônimos: "Prevenção e Controle de Infecção Relacionada à Assistência à Saúde (IRAS)", "Comissão de Controle de Infecção Hospitalar (CCIH)", "Epidemiologia Hospitalar", "Infecção Hospitalar" (termo antigo, ainda usado por bancas mais tradicionais como IBFC e FAFIPA).

Palavras-chave centrais: IRAS, infecção de sítio cirúrgico, infecção do trato urinário associada a cateter, infecção de corrente sanguínea associada a cateter, precaução de contato/gotículas/aerossóis, vigilância epidemiológica hospitalar, bactéria multirresistente.

Siglas: IRAS (substituiu "IH"/"infecção hospitalar" na nomenclatura oficial), CCIH, ISC, ITU-AC, ICS-CVC, MRSA, KPC, CCIRAS (nomenclatura recente para o núcleo/serviço de controle de infecção em algumas normativas).

## Assuntos e subassuntos (herdados de 02h, seção 2.4 — usados como guia de conteúdo; ver Plano Editorial para o mapeamento aos 3 `topics` reais)

**Assunto: Estrutura da Vigilância de IRAS** — CCIH: composição e competências; SCIH; Indicadores Epidemiológicos de IRAS (densidade de incidência, taxa de infecção); Notificação de IRAS à ANVISA.

**Assunto: Infecções Relacionadas a Dispositivos** — ICS-CVC; ITU associada a Cateter Vesical; PAV (interseção com UTI); ISC (interseção com Médico-Cirúrgica/CME).

**Assunto: Microrganismos Multirresistentes** — Bactérias Multirresistentes (MRSA, VRE, KPC, Acinetobacter); Uso Racional de Antimicrobianos/Antimicrobial Stewardship (interseção com Farmacologia).

**Assunto: Medidas de Prevenção** — Precauções Padrão e Específicas (interseção com Biossegurança); Higienização das Mãos — os "5 momentos" da OMS; Bundles de Prevenção (ICS, ITU, PAV, ISC); Limpeza e Desinfecção de Superfícies Hospitalares.

## Leis, protocolos, portarias, programas

- RDC ANVISA nº 63/2011 — Boas Práticas de Funcionamento para os Serviços de Saúde.
- Portaria MS/GM nº 2.616/1998 — Programa de Controle de Infecção Hospitalar (histórica, ainda citada como marco regulatório da CCIH; já citada em questão real do acervo).
- Lei nº 9.431/1997 — obrigatoriedade de manter Programa de Controle de Infecção Hospitalar.
- Manual "Higienização das Mãos em Serviços de Saúde" (ANVISA, baseado no guia da OMS "5 momentos").
- Medidas de Prevenção de IRAS (ANVISA, série de cadernos por tipo de infecção — ICS, ITU, PAV, ISC).
- RDC ANVISA nº 15/2012 — reprocessamento de produtos para saúde (já citada em questões reais de ambas as disciplinas).

## Casos ambíguos (herdados de 02h)

- **CIH vs. CME**: processo técnico da CME em si (etapas do reprocessamento: limpeza → desinfecção → esterilização) → Centro Cirúrgico e CME (disciplina distinta, fora do escopo deste dossiê); monitoramento epidemiológico de falhas de esterilização como causa de infecção → Controle de Infecção Hospitalar. Aplicado rigorosamente às questões novas de "Reprocessamento de Produtos para Saúde" desta sprint — enquadradas sob o ângulo epidemiológico/de vigilância, não sob a técnica de reprocessamento em si.
- **CIH vs. Biossegurança**: regra consolidada da fonte — "Controle de Infecção Hospitalar é sempre o 'dono' da vigilância epidemiológica e do indicador institucional de infecção; as demais disciplinas são 'donas' do cuidado clínico direto que previne essa infecção." Aplicada nesta sprint como critério adicional de diferenciação de enunciado em relação às questões reais de Biossegurança.
- **CIH vs. UTI (PAV)** e **CIH vs. Médico-Cirúrgica/CME (ISC)**: quando o enunciado enfatiza vigilância/indicador/bundle institucional → CIH; quando enfatiza o cuidado clínico direto ao paciente → disciplina clínica correspondente.

## Assuntos que aparecem juntos

CCIH + SCIH + Indicadores Epidemiológicos; os 4 principais IRAS (ICS-CVC, ITU-AC, PAV, ISC) costumam ser cobrados em bloco comparativo; Bactérias Multirresistentes + Uso Racional de Antimicrobianos + Precauções de Contato.

## Nota metodológica

Mesma cautela já aplicada às disciplinas anteriores: conteúdo normativo descrito com precisão técnica, sem transcrição literal certificada; nenhuma norma recente presumida sem confiança suficiente.
