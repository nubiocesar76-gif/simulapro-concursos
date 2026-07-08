# 05 — Casos Ambíguos e Regras de Classificação (Master)

Este arquivo consolida os casos ambíguos já detalhados em cada dossiê
(`02a`–`02l`) em uma **árvore de decisão única**, para uso direto pelo
revisor humano ou pelo classificador automático do Motor Editorial. Onde a
ambiguidade já foi tratada em profundidade em um dossiê específico, este
arquivo referencia a seção em vez de repetir o texto.

## 1. Princípio geral de desempate

Quando uma questão pode pertencer a duas disciplinas, aplique nesta ordem:

1. **Verbo/comando da questão**: o que a questão pede — "identifique a
   técnica" aponta para a disciplina processual (Fundamentos); "explique o
   mecanismo" aponta para a disciplina de base científica (Farmacologia,
   Anatomia e Fisiologia); "cite a norma" aponta para a disciplina
   normativa (Ética e Legislação, Legislação do SUS).
2. **Fonte normativa citada literalmente**: se o enunciado cita número de
   lei/portaria/resolução, use a tabela em `04-leis-portarias-*.md` para
   identificar a disciplina "dona" daquela norma.
3. **Sujeito da ação clínica**: quem é o alvo do cuidado (mãe vs.
   recém-nascido; paciente psiquiátrico vs. paciente clínico geral) define
   o ciclo de vida/cenário.
4. **Cenário assistencial**: ambulatorial/crônico vs. agudo/emergencial vs.
   perioperatório vs. terapia intensiva.
5. Se, mesmo após 1–4, a questão realmente pertencer a duas disciplinas de
   forma equilibrada, ela pode receber **dupla tag** no banco (primária +
   secundária) — o modelo de dados deve permitir isso; não force uma
   classificação única artificial quando a prova real mistura dois eixos
   deliberadamente (comum em bancas que fazem "estudo de caso").

## 2. Índice de ambiguidades por par de disciplinas

| Par de disciplinas | Critério resumido | Detalhe completo |
|---|---|---|
| Fundamentos ↔ Farmacologia | Técnica/via/cálculo vs. mecanismo/classe/interação | `02a` §1.6 / `02i` §6 |
| Fundamentos ↔ Controle de Infecção | Tipo de cobertura/técnica vs. prevenção de ISC | `02a` §1.6 |
| Fundamentos ↔ Urgência e Emergência | Rotina vs. escore de alerta precoce | `02a` §1.6 |
| Biossegurança ↔ Controle de Infecção Hospitalar | Proteção do profissional vs. proteção do paciente/vigilância | `02a` §2.6 |
| Segurança do Paciente ↔ Fundamentos | Cita PNSP/Meta/NSP vs. técnica pura | `02a` §3.6 |
| Segurança do Paciente ↔ Controle de Infecção | Indicador institucional (Meta 5) vs. vigilância técnica de IRAS | `02a` §3.6 |
| Ética e Legislação ↔ Legislação do SUS | Norma do COFEN vs. norma do sistema SUS | `02b` §1.6 |
| Ética e Legislação ↔ SAE | Citação da Res. 358/2009 como norma vs. como processo | `02b` §1.6 / `02k` §6 |
| Ética e Legislação ↔ Administração (dimensionamento) | Cálculo/fórmula vs. redação normativa | `02b` §1.6 / §2.6 |
| Administração ↔ Políticas Públicas de Saúde | Gestão do serviço vs. gestão do sistema | `02b` §2.6 |
| Administração ↔ Segurança do Paciente (Acreditação) | Certificação/ONA vs. meta/protocolo específico | `02b` §2.6 |
| Legislação do SUS ↔ Políticas Públicas de Saúde | Estrutura do sistema vs. programa/política específica | `02b` §3.6 |
| Saúde Coletiva ↔ Doenças Transmissíveis | Sistema de vigilância vs. clínica da doença | `02c` §1.6 / §3.6 |
| Imunização ↔ Saúde da Criança/Mulher | Técnica/rede de frio vs. acompanhamento do ciclo de vida | `02c` §2.6 |
| Imunização ↔ Doenças Transmissíveis | Prevenção via vacina vs. manejo clínico do caso | `02c` §2.6 |
| Doenças Transmissíveis ↔ Saúde da Mulher | Doença em si vs. caso obstétrico | `02c` §3.6 |
| Doenças Transmissíveis ↔ Controle de Infecção Hospitalar | Diagnóstico/tratamento vs. isolamento hospitalar | `02c` §3.6 |
| Saúde da Mulher ↔ Saúde da Criança | Sujeito mãe vs. sujeito recém-nascido | `02d` §1.6 |
| Saúde da Mulher ↔ Saúde Mental | Rastreio obstétrico vs. manejo psiquiátrico (depressão pós-parto) | `02d` §1.6 |
| Saúde do Adulto ↔ Urgência e Emergência | Ambulatorial/crônico vs. protocolo agudo/tempo-dependente | `02e` §1.6 |
| Saúde do Adulto ↔ Saúde do Idoso | Regra etária + especificidade geriátrica | `02e` (regra mestra) |
| Saúde do Adulto ↔ Médico-Cirúrgica | Doença de base vs. preparo cirúrgico | `02e` §1.6 |
| Saúde do Idoso ↔ Segurança do Paciente (quedas) | Síndrome geriátrica vs. protocolo institucional | `02e` §2.6 |
| Médico-Cirúrgica ↔ Centro Cirúrgico e CME | Cuidado clínico ao paciente vs. processo/ambiente | `02e` §3.6 |
| Médico-Cirúrgica ↔ UTI | Cuidado por especialidade vs. monitorização intensiva | `02e` §3.6 |
| Saúde Mental ↔ Políticas Públicas de Saúde | Conteúdo clínico do serviço vs. política em abstrato | `02f` §6 |
| Saúde Mental ↔ Urgência e Emergência | Manejo terapêutico psiquiátrico vs. contenção em cenário geral | `02f` §6 |
| Urgência ↔ UTI | Estabilização inicial vs. manutenção contínua | `02g` (regra mestra) |
| Urgência ↔ Controle de Infecção (sepse) | Bundle terapêutico vs. vigilância de origem IRAS | `02g` §1.6 |
| UTI ↔ Controle de Infecção (PAV, ICS) | Cuidado direto/parâmetro vs. indicador de vigilância | `02g` §2.6 |
| Centro Cirúrgico/CME ↔ Biossegurança | Etapas de reprocessamento vs. proteção do trabalhador | `02h` §1.6 |
| Centro Cirúrgico/CME ↔ Controle de Infecção | Processo técnico vs. monitoramento epidemiológico de falha | `02h` §1.6 |
| Farmacologia ↔ Controle de Infecção (antibioticoterapia) | Classe/mecanismo vs. estratégia institucional de uso racional | `02i` §6 |
| Farmacologia ↔ Saúde Mental (psicofármacos) | Classe/mecanismo vs. manejo clínico do transtorno | `02i` §6 |
| Farmacologia ↔ UTI (drogas vasoativas) | Classe/mecanismo vs. cuidado de infusão/monitorização | `02i` §6 |
| Anatomia e Fisiologia ↔ qualquer disciplina clínica | Estrutura/função normal vs. alteração patológica/cuidado | `02j` §6 |
| SAE ↔ diagnóstico médico | Estrutura de diagnóstico NANDA vs. patologia | `02k` §6 |
| SAE ↔ Administração | Técnica de elaborar etapa vs. política institucional de adesão | `02k` §6 |

## 3. Casos ambíguos "estruturais" (fora do par disciplina-a-disciplina)

- **Sigla com dois significados** (PNI, AVC, PE, SAE, RAM, IG — ver
  `03-dicionario-editorial-*.md` §2): tratar sempre por contexto textual
  antes de aplicar qualquer regra de disciplina.
- **Duplicidade de "SAE" no `taxonomy.json`** (topic dentro de Fundamentos +
  subject isolado): resolvida em `02k` §0 — decisão é manter como
  disciplina própria e remover o topic duplicado.
- **Questões de estudo de caso multi-eixo** (comum em FGV e Cebraspe): uma
  única questão pode narrar um caso clínico que atravessa 3–4 disciplinas
  (ex.: gestante com HAS crônica que descompensa e vai para UTI). Regra:
  classificar pelo **desfecho perguntado no comando da questão**, não pelo
  cenário inteiro — se a pergunta final é sobre conduta em UTI, classifique
  em UTI mesmo que o enunciado narre pré-natal.

## 4. Regra de governança

Toda nova ambiguidade identificada durante a revisão de uma prova real
(`docs/work/<prova>/review.json`) deve:
1. Ser adicionada à tabela da seção 2 (ou a uma nova seção, se for um par de
   disciplinas ainda não coberto);
2. Ter a regra de desempate escrita de forma objetiva (não "depende do
   contexto" sem explicar qual contexto);
3. Ser replicada, quando aplicável, na seção correspondente do dossiê
   `02*-*.md` de origem, para manter as duas fontes sincronizadas.
