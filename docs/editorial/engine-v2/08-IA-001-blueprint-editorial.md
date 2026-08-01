# 08 — Blueprint Editorial (Sprint IA-001)

**Fase:** IA Editorial  
**Sprint:** IA-001 — Blueprint Editorial  
**Escopo desta sprint:** somente a definição do Blueprint Editorial. Sem código, sem banco, sem API, sem telas, sem integração com provedor de IA.

---

## 1. Decisão de localização deste documento

Este blueprint foi integrado a `docs/editorial/engine-v2/` como **arquivo 08**, sequência natural do `07-postgresql-supabase-ia-motor-editorial.md`, que já descreve papéis conceituais da IA e o motor editorial.

**Por que não criar `docs/editorial/ia/`:**

- A raiz `docs/editorial/` (00–08) é reservada à **taxonomia e engenharia de classificação de Enfermagem** — outro domínio.
- `docs/metodologia/` está **congelada** (Método Editorial V1, Dossiês) — não recebe documentos operacionais de fase.
- A Fase IA Editorial **estende** a Engine V2 (conceitos de entidades, evidências, papéis de IA), não inaugura um silo paralelo.
- Um diretório `ia/` isolado fragmentaria a trilha 01→08 já estabelecida e duplicaria o escopo parcialmente coberto pelo arquivo 07.

**Referências normativas (somente leitura — não alteradas nesta sprint):**

| Documento | Papel |
|---|---|
| `docs/metodologia/METODO_EDITORIAL_DE_PRODUCAO_DE_QUESTOES_V1.md` | Constituição editorial: missão, anatomia da questão (Cap. 2), processo em 13 etapas (Cap. 3), molde de Dossiê (Cap. 4) |
| `docs/metodologia/DOSSIE_*_V1.md` | DNA observado de cada banca — insumo de estilo |
| `docs/editorial/engine-v2/01`–`07` | Arquitetura genérica da Engine, evidências, módulos, destinos técnicos conceituais |
| `docs/editorial/` (Fases 1–2) | Primeira Course Configuration (Enfermagem) |

---

## 2. O que é o Blueprint Editorial

O **Blueprint Editorial** é o **contrato normativo** que define como a Fase IA Editorial produz **questões inéditas** no SimulaPro — o que entra, o que sai, em que ordem, com quais limites, e onde a IA atua versus onde a revisão humana é obrigatória.

Ele **não é**:

- um prompt (isso é IA-002);
- uma integração com provedor de IA (IA-003);
- um parser de resposta (IA-004);
- um validador automatizado (IA-005);
- uma tela ou fluxo de UI (IA-006+);
- uma migration ou schema de banco.

Ele **é** a planta baixa editorial que todas as sprints IA-002…IA-010 devem implementar **sem contradizer** o Método Editorial V1.

---

## 3. Missão (herdada — inviolável)

Reproduzir, para questões **inéditas**, o rigor, a forma e a exigência cognitiva de uma questão real da banca de referência — **sem jamais ser uma questão real** e **sem jamais nascer de uma questão existente**.

Fonte: Método Editorial, Cap. 1. Os sete princípios do Cap. 1.6 aplicam-se integralmente a qualquer artefato gerado ou assistido por IA nesta fase.

---

## 4. Insumos oficiais do Blueprint (o que entra)

Todo ciclo de produção assistida por IA **deve** declarar explicitamente estes insumos antes de qualquer geração de texto definitivo. Ausência de insumo obrigatório **bloqueia** o ciclo (equivalente editorial às Etapas 1–4 do processo canônico).

### 4.1 Insumos de conhecimento (não variam por banca)

| ID | Insumo | Origem no projeto | Obrigatório |
|---|---|---|---|
| I-01 | **Conceito de origem** | Modelo de Conhecimento / taxonomia (`docs/editorial/`, Engine V2: `Discipline` → `Topic` → `Subtopic`) | Sim |
| I-02 | **Definição canônica do Conceito** | Registro editorial do subassunto + referências normativas quando aplicável | Sim |
| I-03 | **Referências bibliográficas de suporte** | `EditorialReference`, leis/portarias/protocolos (`docs/editorial/04`, módulos editoriais) | Sim (quando o Conceito exige lastro normativo) |

### 4.2 Insumos de estilo (variáveis por banca)

| ID | Insumo | Origem no projeto | Obrigatório |
|---|---|---|---|
| I-04 | **Banca de referência** | `ExamBoard` / `boards` + perfil (`BoardCourseProfile`, `docs/editorial/normalized/14-perfil-bancas.json`) | Sim |
| I-05 | **Dossiê da banca** | `docs/metodologia/DOSSIE_<BANCA>_V1.md` (ou sucessor homologado) | Sim |
| I-06 | **Parâmetros de estilo extraídos do Dossiê** | Formato de alternativas, densidade de contexto, lógica de distrator, tom — conforme Etapa 4 do processo canônico | Sim |

### 4.3 Insumos de decisão editorial (declarados por ciclo)

| ID | Insumo | Descrição | Obrigatório |
|---|---|---|---|
| I-07 | **Objetivo cognitivo** | Reconhecimento, aplicação ou análise — coerente com o Conceito (Método, Cap. 2.3.2) | Sim |
| I-08 | **Estratégia da questão** | Plano de cobrança: ângulo, tipo de erro nos distratores, presença/ausência de Contexto (Etapa 5) | Sim |
| I-09 | **Curso e cargo** | Escopo pedagógico (ex.: Enfermagem / Enfermeiro) — alinha metadados e perfil de banca por curso | Sim |

### 4.4 Insumos de contexto operacional (Engine V2)

| ID | Insumo | Origem | Obrigatório |
|---|---|---|---|
| I-10 | **Regras de classificação ativas** | `classification_rules` do curso | Quando classificação automática participar do ciclo |
| I-11 | **Dicionário editorial do curso** | Sinônimos, siglas, palavras-chave (`docs/editorial/03`, normalized) | Recomendado |
| I-12 | **Casos ambíguos conhecidos** | `docs/editorial/05`, normalized/12 | Quando o Conceito toca fronteira entre disciplinas |

**Regra:** a IA **consome** taxonomia e referências; **não cria** Conceito, **não altera** fronteira canônica, **não publica** taxonomia nova sem passar por revisão humana (alinhado a `07` §3.1, papel "Gerador").

---

## 5. Produto oficial do Blueprint (o que sai)

A saída de um ciclo completo é uma **questão editorialmente completa** conforme o Método Editorial, Cap. 2 — anatomia **editorial**, não representação técnica em banco.

### 5.1 Elementos obrigatórios da saída

| # | Elemento | Descrição resumida | Variável por banca? |
|---|---|---|---|
| E-01 | Conceito de origem | ID/rastreio ao Conceito escolhido | Não |
| E-02 | Objetivo cognitivo | Declaração explícita | Não |
| E-03 | Enunciado | Texto unívoco da pergunta/afirmação | Sim (estilo) |
| E-04 | Contexto | Cenário situado, quando exigido | Sim (presença/densidade) |
| E-05 | Alternativas | Conjunto completo incluindo a correta | Sim (quantidade/formato) |
| E-06 | Distratores | Cada alternativa incorreta, com erro plausível | Sim (lógica de armadilha) |
| E-07 | Gabarito | Identificação inequívoca da correta | Não (defensibilidade) |
| E-08 | Justificativa técnica | Por que cada alternativa está certa/errada | Não (lastro no Conceito) |
| E-09 | Referência bibliográfica | Fonte externa verificável | Não |
| E-10 | Metadados editoriais | Banca, curso, disciplina/assunto, rastreabilidade do ciclo | Parcial |

**Contexto (E-04):** condicional — obrigatório quando I-07 ou I-06 exigirem; ausência deliberada quando objetivo é reconhecimento direto e a banca não pressupõe cenário (Método, Cap. 2.4).

### 5.2 Estados de maturidade da saída (antes da publicação)

| Estado | Significado | Quem pode avançar |
|---|---|---|
| `RASCUNHO_IA` | Texto gerado ou assistido por IA; insumos declarados; **não auditado** | Ninguém publica |
| `EM_REVISAO` | Submetido à revisão editorial humana (IA-006+) | Revisor humano |
| `APROVADO_EDITORIAL` | Passou auditoria equivalente às Etapas 12–13 do processo canônico | Homologador |
| `REPROVADO` | Falha em critério editorial; retorna à etapa corretiva indicada | Produtor/revisor |

Estes estados são **editoriais** neste blueprint. Representação técnica em banco/tabelas é decisão de sprints futuras — não definida em IA-001.

---

## 6. Fluxo editorial canônico (13 etapas → Blueprint)

O processo do Método Editorial, Cap. 3, permanece a **ordem fixa**. O Blueprint mapeia **onde a IA pode assistir** versus **onde só humano decide**, sem reordenar etapas.

| Etapa | Nome (processo canônico) | Papel da IA (máximo permitido) | Decisão humana obrigatória |
|---|---|---|---|
| 1 | Seleção do Conceito | Sugerir candidatos a partir de lacunas de cobertura | **Confirmar** o Conceito escolhido |
| 2 | Definição da banca | Nenhum (lista fechada de bancas com Dossiê) | **Escolher** a banca |
| 3 | Objetivo cognitivo | Propor opções compatíveis com o Conceito | **Declarar** o objetivo |
| 4 | Consulta ao Dossiê | Resumir parâmetros de estilo do Dossiê (leitura assistida) | **Validar** parâmetros extraídos |
| 5 | Estratégia da questão | Propor plano de cobrança alinhado a I-01…I-06 | **Aprovar** a estratégia |
| 6 | Redação do enunciado | **Gerar rascunho** conforme estratégia aprovada | **Revisar/editar** |
| 7 | Construção das alternativas | **Gerar rascunho** do conjunto | **Revisar/editar** |
| 8 | Construção dos distratores | **Gerar rascunho** com erro plausível | **Revisar/editar** |
| 9 | Definição do gabarito | Propor gabarito coerente com enunciado | **Confirmar** gabarito |
| 10 | Justificativa técnica | **Gerar rascunho** por alternativa | **Validar** lastro no Conceito |
| 11 | Inclusão das referências | Sugerir referências existentes no acervo editorial | **Confirmar** referências |
| 12 | Auditoria editorial | Checklist automatizado **preliminar** (IA-005) | **Auditar** de forma independente |
| 13 | Homologação | Nenhum | **Homologar** |

**Regra de ouro:** etapas 6–11 produzem no máximo `RASCUNHO_IA`. Só após Etapa 12–13 humanas a saída pode ser considerada `APROVADO_EDITORIAL`.

---

## 7. Papéis da IA no Blueprint (subset operacional)

Alinhado a `07` §3.1, o Blueprint desta fase foca o papel **Gerador de questões inéditas**. Os demais papéis (classificador, extrator, detector de duplicidade) pertencem ao pipeline de **questões reais importadas** e coexistem, mas **não são escopo de implementação** em IA-001.

### 7.1 Gerador de questões inéditas (escopo central IA-002…IA-007)

| Campo | Definição |
|---|---|
| **Entrada mínima** | I-01 a I-09 completos |
| **Saída** | E-01 a E-10 em estado `RASCUNHO_IA` |
| **Restrições** | Não escreve em taxonomia; não publica; não altera Dossiê; não copia item real |
| **Proveniência** | Toda saída carrega trilha de origem `SUGESTAO_IA` quando aplicável (conceito já previsto em `04-evidencias-confianca-evolucao.md`) |

### 7.2 O que a IA nunca faz (lista fechada)

1. Inventar ou expandir a definição canônica de um Conceito.
2. Publicar questão diretamente no acervo aluno (sem homologação humana).
3. Copiar, parafrasear ou derivar de questão real identificável.
4. Alterar gabarito após homologação sem novo ciclo completo.
5. Substituir auditoria editorial humana (Etapas 12–13).
6. Criar disciplina/assunto/subassunto como fato consumado (`PUBLICADO`).

---

## 8. Mapa de sprints IA-001…IA-010 (fronteiras apenas)

| Sprint | Nome | O que define / entrega | Fora de escopo desta sprint |
|---|---|---|---|
| **IA-001** | **Blueprint Editorial** | **Este documento** — contrato insumo/saída, fluxo, papéis, limites | Tudo abaixo |
| IA-002 | Prompt Builder | Templates e composição de prompts a partir dos insumos I-01…I-12 | Integração, execução |
| IA-003 | Integração com IA | Provedor, autenticação, chamada, retry, custo | UI, validação final |
| IA-004 | Tratamento da Resposta | Parse, normalização, mapeamento resposta → E-01…E-10 | Publicação |
| IA-005 | Validação | Checklist automatizado pré-auditoria (Etapa 12 assistida) | Revisão humana |
| IA-006 | Revisão Editorial | Fluxo e artefatos de revisão humana | Publicação em produção |
| IA-007 | Publicação | Integração da questão homologada ao acervo/pacote | Lote em escala |
| IA-008 | Geração em Lote | Orquestração de múltiplos ciclos com controle de qualidade | Otimização contínua |
| IA-009 | Otimização | Métricas, refinamento de prompts, custo/latência | Operação 24/7 |
| IA-010 | Operação Contínua | Runbooks, monitoramento, governança de produção | — |

**Ordem fixa:** nenhuma sprint posterior pode ser iniciada antes da anterior estar homologada pelo time.

---

## 9. Relação com o pipeline existente (questões reais)

O SimulaPro já possui pipeline operacional para **questões reais**:

`exam_catalog` → extração/import → `questions` → pacote/versão → distribuição → aluno.

A Fase IA Editorial produz **questões inéditas** por caminho **paralelo**, que **converge** apenas na etapa de publicação (IA-007), após homologação. Até lá:

- Não altera importador legado (`/admin/import`).
- Não altera seed (`npm run seed:questions`).
- Não altera fluxo de PDF/transcrição (`docs/work/`).
- Reutiliza taxonomia, Dossiês e Engine V2 como **insumo**, não como destino de escrita automática.

---

## 10. Critérios de aceite da Sprint IA-001

- Insumos I-01…I-12 catalogados com origem no projeto.
- Saída E-01…E-10 alinhada ao Método Editorial Cap. 2.
- Fluxo de 13 etapas mapeado com limites IA vs. humano.
- Papéis e proibições da IA explícitos.
- Fronteiras IA-002…IA-010 declaradas sem antecipar implementação.
- Documento integrado à trilha `engine-v2/` sem novo diretório fragmentado.

---

## 11. Explicitamente fora de escopo (IA-001 e herdado por IA-002 até decisão contrária)

- Código em `src/`
- Migrations / DDL / alteração de schema Supabase
- Chamadas a API de provedor de IA (OpenAI, Anthropic, etc.)
- Telas Admin ou Portal
- Prompts concretos, few-shot examples, JSON Schema de resposta
- Mapeamento técnico E-01…E-10 → colunas da tabela `questions`
- Alteração de `docs/metodologia/*` (documentos congelados)
- Alteração de `ROADMAP.md`, `PRODUCT_BACKLOG.md`, `PROJECT_STATUS.md`

---

## 12. Próxima sprint (não iniciada)

**IA-002 — Prompt Builder:** construir, a partir deste Blueprint, a especificação dos templates de prompt que montam I-01…I-12 como contexto de geração, ainda **sem** integração ou execução.

Aguardar revisão e homologação deste documento antes de iniciar IA-002.
