# DOSSIÊ MESTRE — BIOSSEGURANÇA — V1

## Objetivo

Base técnica oficial da disciplina "Biossegurança" do SimulaPro. Não gera questões, não resume para aluno. É a fonte editorial permanente para o Motor Editorial.

## Achado Editorial (obrigatório registrar — não silenciar)

**Achado 1 — fusão na taxonomia-sombra, parcialmente refletida na arquitetura real.** O documento de referência real (`docs/editorial/02a-fundamentos-biosseguranca-seguranca-paciente.md`, seção 2) traz uma ERRATA V1.1: **Biossegurança (`D03`) absorveu, na taxonomia-sombra, o conteúdo de Controle de Infecção Hospitalar (`D05`, `02h`)** — "os 4 assuntos de Controle de Infecção Hospitalar foram reparentados para D03". Diferente das fusões anteriores desta sessão (onde a tabela real `subjects` nunca aplicou a fusão), aqui há um reflexo parcial real: 3 dos 6 `topics` reais de Biossegurança ("Precauções e Isolamento", "CCIH e Prevenção de Infecção Hospitalar", "Reprocessamento de Produtos para Saúde") **não constam no assunto oficial de Biossegurança em `02a`** — são, na prática, os tópicos "herdados" da fusão com Controle de Infecção Hospitalar. Como já registrado no Dossiê Mestre de Controle de Infecção Hospitalar (sprint anterior desta sessão), a disciplina "Controle de Infecção Hospitalar" **também continua existindo como `subject` real e independente**, com os mesmos 3 nomes de tópico e conteúdo próprio. Ou seja: a fusão aconteceu (parcialmente) do lado de Biossegurança, mas nunca foi desfeita do lado de Controle de Infecção Hospitalar — resultando nos dois lados com os mesmos tópicos e conteúdo próprio, simultaneamente.

**Achado 2 — tópico indispensável ausente.** Nenhum `topic` real cobria "Exposição Ocupacional" — Acidentes com Material Perfurocortante, Profilaxia Pós-Exposição, Notificação de Acidente de Trabalho/CAT, NR-32 — apesar de ser exatamente o núcleo de identidade da disciplina segundo `02a` (seção 2.4, assunto "Exposição Ocupacional") e o conjunto de temas mais explicitamente priorizado pelo usuário nesta sprint. Conteúdo relacionado (NR-32, acidente com material biológico) existia apenas disperso sob os tópicos "EPI" e "CCIH e Prevenção de Infecção Hospitalar". Criado o `topic` **"Exposição Ocupacional e Acidentes com Material Biológico"** (slug `exposicao-ocupacional-e-acidentes-com-material-biologico`), vinculado à disciplina, taxonomia reexportada — único tópico novo desta sprint.

Ambos os achados foram registrados em `docs/editorial/auditoria/AUDITORIA_RECLASSIFICACAO_ACERVO.md`, conforme instrução explícita desta sprint (Fase 4) — **não corrigidos** (fora de escopo desta sprint de produção).

## Fonte real de base

Reaproveita `docs/editorial/02a-fundamentos-biosseguranca-seguranca-paciente.md`, seção 2 (`Biossegurança`, `biosseguranca`).

## Sinônimos, palavras-chave e siglas (herdados de 02a, seção 2)

Sinônimos: "Biossegurança Hospitalar", "Segurança Ocupacional em Saúde", "Precauções e Isolamento" (quando a banca funde com Controle de Infecção), "Equipamentos de Proteção Individual" (quando tratado como assunto isolado).

Palavras-chave centrais: EPI, precaução padrão, precaução de contato/gotículas/aerossóis, resíduos de serviços de saúde (RSS), acidente com perfurocortante, exposição ocupacional, imunização do trabalhador, NR-32.

Siglas: EPI, RSS, PGRSS (Plano de Gerenciamento de RSS), NR-32, CCIH, PEP/PPE (profilaxia pós-exposição), CAT (Comunicação de Acidente de Trabalho).

## Assuntos e subassuntos oficiais (herdados de 02a, seção 2.4 — núcleo real de identidade da disciplina)

**Proteção Individual e Coletiva:** EPI; Precauções Padrão e Específicas (contato, gotículas, aerossóis); Higienização das Mãos como medida de biossegurança (ângulo de proteção do trabalhador, distinto do ângulo de segurança do paciente já tratado em Controle de Infecção Hospitalar).

**Gestão de Resíduos:** Classificação dos RSS (Grupos A, B, C, D, E — RDC ANVISA nº 222/2018); PGRSS.

**Exposição Ocupacional:** Acidentes com Material Perfurocortante; Profilaxia Pós-Exposição a Material Biológico; Notificação de Acidente de Trabalho/CAT; NR-32 (Saúde e Segurança do Trabalhador de Enfermagem).

## Mapeamento aos 7 `topics` reais (6 pré-existentes + 1 novo)

- **Equipamentos de Proteção Individual** → assunto Proteção Individual e Coletiva (núcleo).
- **Gerenciamento de Resíduos de Serviços de Saúde** → assunto Gestão de Resíduos (núcleo).
- **Exposição Ocupacional e Acidentes com Material Biológico** (novo) → assunto Exposição Ocupacional (núcleo, antes disperso/ausente).
- **Precauções e Isolamento**, **CCIH e Prevenção de Infecção Hospitalar**, **Reprocessamento de Produtos para Saúde** → tópicos herdados da fusão com Controle de Infecção Hospitalar (Achado 1); produção nova nesses 3 tópicos é deliberadamente leve, priorizando o ângulo de proteção do trabalhador/EPI (que é o núcleo real de Biossegurança), evitando repetir o ângulo epidemiológico/institucional já coberto extensivamente em Controle de Infecção Hospitalar (32 questões produzidas em sprint anterior desta sessão) e o ângulo técnico-operacional já coberto em Centro Cirúrgico e CME (31 questões produzidas em sprint anterior).
- **Limpeza e Desinfecção de Equipamentos** → não consta em `02a`; tratado como tópico técnico-operacional específico (reprocessamento de equipamentos respiratórios/similares), com produção nova leve e sob o ângulo de segurança do trabalhador durante a limpeza (uso de EPI, riscos de produtos químicos).

## Leis, protocolos, portarias, programas

- **NR-32 (Portaria MTE nº 485/2005)** — norma central da disciplina.
- **RDC ANVISA nº 222/2018** — Regulamento Técnico para Gerenciamento de RSS (revoga a RDC nº 306/2004; já citada em questões reais do acervo).
- **RDC ANVISA nº 302/2005** — funcionamento de laboratórios (citada quando a prova mistura Biossegurança com coleta de material biológico).
- Portaria MS/SVS nº 485/2005 — mesma NR-32 (redação conjunta MTE/MS).

## Casos ambíguos (herdados de 02a — regra central desta disciplina)

- **Biossegurança vs. Controle de Infecção Hospitalar**: Biossegurança = proteção do profissional e do ambiente (EPI, resíduos, exposição ocupacional); Controle de Infecção Hospitalar = proteção do paciente (vigilância epidemiológica hospitalar, precaução para IRAS, CCIH como órgão colegiado). "Proteção do profissional" → aqui; "prevenção de infecção no paciente/taxa de infecção hospitalar" → Controle de Infecção.
- Precauções de contato/gotículas/aerossóis aparecem em ambas: a *lista de precauções e EPI necessário* é Biossegurança; a *aplicação clínica por doença específica* é Controle de Infecção/Doenças Transmissíveis.
- **Biossegurança vs. Centro Cirúrgico e CME**: proteção do trabalhador durante o manuseio de material contaminado → Biossegurança; etapas técnicas do reprocessamento em si → CME.
- **Biossegurança vs. Imunização**: imunização do próprio trabalhador de saúde (ex.: hepatite B) é mencionada como medida de biossegurança ocupacional aqui; o conteúdo técnico de vacina (esquema, via, cadeia de frio) pertence a Imunização.
- **Biossegurança vs. Segurança do Paciente**: verificado nesta sprint — 0 sobreposição real (nenhum `topic` de Segurança do Paciente trata de EPI/resíduos/NR-32).
- **Biossegurança vs. Enfermagem Médico-Cirúrgica**: verificado nesta sprint — 0 sobreposição real.

## Assuntos que aparecem juntos

EPI + Precaução Padrão + Higiene das Mãos; PGRSS + Classificação de Resíduos; Acidente Perfurocortante + Profilaxia Pós-Exposição + Doenças Transmissíveis (HIV/Hepatites).

## Nota metodológica

Mesma cautela já aplicada às disciplinas anteriores: conteúdo normativo descrito com precisão técnica, sem transcrição literal certificada; nenhuma norma revogada tratada como vigente.
