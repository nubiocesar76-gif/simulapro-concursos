# EDITORIAL CONTROLLER V1

## Objetivo e status

Controlador mestre da produção editorial do SimulaPro. Não gera nenhuma questão, não altera nenhum documento existente, não refaz nenhum plano — define exclusivamente a **governança**: como medir cobertura, priorizar lacunas, controlar qualidade e diversidade, evitar duplicidade, identificar univocamente cada questão e reportar progresso, de forma **repetível para qualquer disciplina do SimulaPro**, não apenas Processo de Enfermagem.

Este documento consolida o conhecimento já produzido — Dossiê Mestre, Inteligência Editorial, Auditoria Normativa, Plano de Produção, Lotes 1-3 de Processo de Enfermagem — como o **primeiro caso de uso real** do controlador, usado ao longo do texto como exemplo concreto, nunca como conteúdo exclusivo do documento.

---

# 1. FILOSOFIA EDITORIAL

- O objetivo **não é** produzir muitas questões. O objetivo é produzir um **banco equilibrado**.
- **Cobertura tem prioridade sobre quantidade**, sempre. Um subassunto sem nenhuma questão pesa mais na decisão de produção do que qualquer subassunto que já tenha alguma, por maior que seja a demanda aparente pelo segundo.
- **Nenhum assunto pode crescer descontroladamente enquanto outro permanece descoberto.** Um subassunto não pode ultrapassar a Meta Nível 3 (5 questões — cobertura recomendada, ver Seção 4) enquanto existir, na mesma disciplina, qualquer subassunto ainda no estado SEM QUESTÃO (ver Seção 3). Essa é a regra estrutural que teria evitado, se já existisse antes da Fase 3.1, a concentração observada no Lote 1 em atualização normativa — o controlador formaliza, como regra permanente, a correção que a Fase 3.2 precisou fazer manualmente.
- Toda decisão de produção deve ser rastreável a uma lacuna real, medida (Seção 5), não a uma preferência editorial não justificada.

---

# 2. CICLO OFICIAL

Fluxo obrigatório, sem etapas puladas, para qualquer disciplina:

```
Mapear cobertura
      ↓
Selecionar lacunas (Seção 5 — algoritmo de priorização)
      ↓
Gerar questões (respeitando Seção 6 — diversidade, e Seção 8 — duplicidade)
      ↓
Revisão técnica (Seção 7 — índice de confiança)
      ↓
Validação (aderência ao Dossiê Mestre da disciplina, normas vigentes, ausência de ambiguidade)
      ↓
Importação (atribuição de ID único — Seção 9 — e inserção no acervo)
      ↓
Atualizar cobertura (Seção 3 — reclassificar estado dos subassuntos afetados)
      ↓
(retorna ao topo do ciclo)
```

Nenhuma questão pode pular da etapa "Gerar" direto para "Importação" sem passar por Revisão e Validação. Nenhum lote pode ser produzido sem que a etapa "Mapear cobertura" tenha sido executada primeiro, mesmo que o produtor acredite já saber onde estão as lacunas — o mapeamento é o que torna a priorização auditável, não uma opinião.

---

# 3. ESTADOS DE CADA SUBASSUNTO

Todo subassunto de toda disciplina está, a qualquer momento, em exatamente um destes estados:

| Estado | Critério de entrada | Critério de saída |
|---|---|---|
| **SEM QUESTÃO** | Nenhuma questão produzida para este subassunto. | Ao entrar a 1ª questão em produção → EM PRODUÇÃO. |
| **EM PRODUÇÃO** | Ao menos uma questão foi redigida para o subassunto, ainda não passou por revisão. | Ao concluir a redação e enviar para revisão técnica → EM REVISÃO. |
| **EM REVISÃO** | Questão(ões) do subassunto aguardando ou em processo de cálculo do Índice de Confiança Editorial (Seção 7). | Índice ≥ 95% em todas as questões do subassunto → VALIDADO. Índice < 95% em qualquer questão → permanece EM REVISÃO até reescrita ou correção (nunca avança nem retrocede a SEM QUESTÃO). |
| **VALIDADO** | Todas as questões do subassunto têm Índice de Confiança ≥ 95% e passaram na Validação (Seção 2). Pronto para importação. | Após importação efetiva ao acervo real → CONSOLIDADO. |
| **CONSOLIDADO** | Subassunto com ao menos 1 questão já importada ao acervo real e atingindo, no mínimo, a Meta Nível 2 (3 questões — cobertura básica, Seção 4). | Não retrocede. Pode continuar recebendo novas questões (avançando de Nível 2 → 3 → 4 → 5), mas nunca volta a SEM QUESTÃO. |

Nenhum subassunto pula estado. Um subassunto com 1 questão aprovada mas não importada é VALIDADO, não CONSOLIDADO — a diferença entre os dois últimos estados é a existência real no banco de produção, não apenas a aprovação técnica.

---

# 4. METAS

| Nível | Quantidade | Rótulo |
|---|---|---|
| 1 | 1 questão | Cobertura mínima |
| 2 | 3 questões | Cobertura básica |
| 3 | 5 questões | Cobertura recomendada |
| 4 | 10 questões | Cobertura madura |
| 5 | 20+ questões | Cobertura excelente |

Essas metas são **por subassunto**, não por disciplina inteira — a meta agregada de uma disciplina é a soma das metas de todos os seus subassuntos, exatamente como já calculado no `PLANO_PRODUCAO_PROCESSO_ENFERMAGEM_V1.md` (colunas "Qtd. inicial" e "Qtd. ideal futura", que correspondem, respectivamente, a aproximações dos Níveis 1-2 e do Nível 4 daquele plano específico). A regra da Seção 1 (nenhum assunto cresce enquanto outro está descoberto) se aplica entre níveis: **nenhum subassunto pode avançar do Nível 3 para o Nível 4 enquanto qualquer outro subassunto da mesma disciplina estiver em SEM QUESTÃO** (Nível 0).

---

# 5. PRIORIZAÇÃO — algoritmo

Ordem de prioridade, da mais alta para a mais baixa, aplicada **dentro de uma mesma disciplina** a cada novo ciclo de produção:

1. **Subassunto SEM QUESTÃO** (Nível 0) — prioridade máxima, sempre.
2. **Subassunto com exatamente 1 questão** (Nível 1, abaixo da cobertura básica).
3. **Subassunto com menor diversidade** — medido pelo número de dimensões da Seção 6 (banca/dificuldade/tipo de raciocínio) ainda não representadas entre as questões já existentes daquele subassunto.
4. **Subassunto com menor variedade de bancas** especificamente — mesmo que a diversidade geral (item 3) já seja aceitável, um subassunto cujas questões existentes usam sempre a mesma banca simulada é priorizado sobre um com bancas variadas.
5. **Subassunto CONSOLIDADO** — menor prioridade; só recebe nova produção depois que todos os itens 1-4 de toda a disciplina estiverem resolvidos, ou por decisão editorial humana explícita e justificada (exceção documentada, nunca silenciosa).

Em caso de empate dentro do mesmo critério (ex.: dois subassuntos igualmente SEM QUESTÃO), o desempate é pelo **peso em concursos** já calculado no Plano de Produção da disciplina (coluna "Peso em concursos") — maior peso primeiro. Se a disciplina não tiver essa coluna calculada, o desempate é pela ordem de prioridade Muito Alta > Alta > Média > Baixa já definida no Plano.

---

# 6. DIVERSIDADE

Dimensões controladas automaticamente por subassunto, nenhuma podendo dominar:

- **Banca** (IBFC, FGV, VUNESP, AOCP, CEBRASPE e demais cadastradas) — nenhuma banca pode responder por mais de 50% das questões de um mesmo subassunto acima do Nível 2 (3 questões).
- **Dificuldade** (Fácil/Médio/Difícil) — nenhum subassunto no Nível 3 ou superior pode ter 100% das questões no mesmo nível de dificuldade.
- **Tipo de raciocínio** — conceitual, aplicação prática, estudo de caso, interpretação normativa. Regra já aplicada manualmente nas Fases 3.2/3.3 ("se já existe uma questão conceitual sobre determinado assunto, produzir agora caso clínico, aplicação prática ou interpretação normativa") — o controlador a formaliza como regra permanente do ciclo, não uma correção pontual.
- **Caso clínico × não caso clínico** — subassuntos clinicamente aplicáveis (etapas do processo assistencial, diagnóstico, implementação) devem ter ao menos 1 questão em formato de caso a partir do Nível 2; subassuntos puramente normativos/estruturais (ex.: hierarquia de normas, estrutura de taxonomia) são dispensados dessa exigência, mas não de tipo de raciocínio variado.
- **Referência normativa usada** — ver Seção 8 (controle de duplicidade), já que reutilizar sempre a mesma referência normativa como base de gabarito é, ao mesmo tempo, um problema de diversidade e de duplicidade.

"Nenhum padrão poderá dominar um subassunto" é operacionalizado como: a partir do Nível 3 (5 questões), nenhuma combinação banca+dificuldade+tipo pode se repetir mais de duas vezes dentro do mesmo subassunto.

---

# 7. REVISÃO — faixas do Índice de Confiança Editorial

| Faixa | Classificação | Ação |
|---|---|---|
| 95% – 100% | **Prontas** | Segue para Validação (Seção 2) e depois Importação. |
| 90% – 94% | **Revisão obrigatória** | Não avança para Validação sem revisão humana explícita que eleve o índice ou documente por que a questão é aceitável apesar do índice — nunca importada silenciosamente nessa faixa. |
| < 90% | **Reescrever** | Não é revisável em ajustes pontuais — a questão retorna ao estado EM PRODUÇÃO como se fosse nova, descartando a versão anterior. |

O Índice de Confiança Editorial (já usado nas Fases 3.2/3.3) é calculado considerando: aderência ao Dossiê Mestre da disciplina, aderência às normas vigentes, coerência técnica, fidelidade ao perfil da banca simulada, e clareza do enunciado — nenhum desses cinco fatores pode, sozinho, elevar artificialmente o índice se outro estiver comprometido (ex.: uma questão tecnicamente perfeita mas com fidelidade de banca forçada, como as adaptações de CEBRASPE para formato A-E já registradas nos Lotes 2 e 3, deve refletir essa limitação no índice, não ser arredondada para cima).

---

# 8. CONTROLE DE DUPLICIDADE

Regras que impedem, dentro do mesmo subassunto (e, quando aplicável, entre subassuntos próximos do mesmo assunto):

- **Mesmo raciocínio lógico de resolução** — duas questões que exigem exatamente o mesmo passo de dedução para chegar à resposta, mesmo com enunciados diferentes, contam como duplicidade.
- **Mesmo distrator** — um mesmo texto de alternativa incorreta (ou paráfrase próxima o suficiente para ser reconhecível) não pode reaparecer em duas questões do mesmo subassunto.
- **Mesmo caso clínico** — cenário clínico (paciente, quadro, contexto) não pode ser reaproveitado, nem com pequenas variações superficiais (troca de idade/sexo mantendo o resto idêntico não descaracteriza duplicidade).
- **Mesma resposta didaticamente exposta da mesma forma** — a alternativa correta não pode ser sistematicamente a mesma letra (A-E) nem seguir um padrão posicional previsível dentro do mesmo subassunto.
- **Mesma referência normativa usada como único fundamento repetidamente** — um subassunto no Nível 3 ou superior não pode ter todas as suas questões fundamentadas exclusivamente no mesmo artigo da mesma norma; se o subassunto legitimamente só é regido por um único artigo, isso deve ser documentado como exceção, não silenciado.

Antes de qualquer novo lote, o Ciclo Oficial (Seção 2) exige checagem de duplicidade contra **todas** as questões já existentes do subassunto-alvo, não apenas contra o lote imediatamente anterior — prática já seguida manualmente nas Fases 3.1-3.3 (cada lote novo conferiu os anteriores), agora formalizada como obrigação permanente.

---

# 9. IDENTIFICADOR ÚNICO

**Padrão:** `<CÓDIGO_DISCIPLINA>-<subassunto>-<sequencial de 3 dígitos>`

- `CÓDIGO_DISCIPLINA`: sigla de 2 a 5 letras maiúsculas, sem espaço, atribuída uma única vez por disciplina no momento em que ela recebe seu primeiro Plano de Produção, e nunca reaproveitada — mesmo que a disciplina seja descontinuada. Exemplos ilustrativos, não normativos: `PE` (Processo de Enfermagem), `POR` (Português), `LSUS` (Legislação do SUS), `RLM` (Raciocínio Lógico).
- `subassunto`: numeração exata do Plano de Produção daquela disciplina (ex.: `2.3.2`).
- `sequencial de 3 dígitos`: `001`, `002`, `003`... — contador exclusivo daquele par disciplina+subassunto, nunca reiniciado, nunca reaproveitado mesmo que uma questão anterior seja descartada (um ID descartado fica permanentemente vago, não é redistribuído).

**Exemplo real, aplicando o padrão retroativamente às 30 questões já produzidas** (Lotes 1-3 de Processo de Enfermagem, código `PE`): a primeira questão do Lote 1 (subassunto 1.1.1) seria `PE-1.1.1-001`; caso um subassunto já tivesse recebido questão em mais de um lote, o contador continuaria a partir do número já usado, nunca reiniciando por lote. Como nenhum subassunto foi repetido entre os Lotes 1, 2 e 3 (confirmado nas Fases 3.2 e 3.3), todas as 30 questões produzidas até aqui recebem `-001` como sequencial — este é, portanto, o momento correto para começar a aplicar o padrão de IDs de forma disciplinada, antes que a ausência de repetição deixe de ser garantida automaticamente pela sorte da seleção de subassuntos.

---

# 10. RELATÓRIOS

Ao final de cada lote, gerar automaticamente:

1. **Cobertura atual** — nº de subassuntos com ao menos 1 questão / total de subassuntos testáveis da disciplina, em percentual.
2. **Cobertura anterior** — mesmo cálculo, antes do lote, para permitir medir o incremento real.
3. **Questões produzidas** — total redigido no lote.
4. **Questões aprovadas** — quantas atingiram Índice ≥ 95% (Seção 7).
5. **Questões rejeitadas** — quantas ficaram abaixo de 90% e retornaram a EM PRODUÇÃO (Seção 7); questões na faixa 90-94% contam à parte, como "pendentes de revisão obrigatória", não como aprovadas nem rejeitadas.
6. **Subassuntos completos** — quantos atingiram, com este lote, um novo Nível de meta (Seção 4).
7. **Subassuntos críticos** — os que seguem em SEM QUESTÃO após o lote, especialmente os de prioridade Muito Alta/Alta do Plano de Produção da disciplina.
8. **Próxima fila de produção** — lista ordenada pelo algoritmo da Seção 5, pronta para o próximo ciclo, sem exigir remapeamento manual.

Os relatórios já entregues ao final das Fases 3.1, 3.2 e 3.3 já continham, de forma não padronizada, boa parte desses itens (cobertura percentual, subassuntos críticos, próxima fila) — este documento formaliza o formato para que se torne comparável lote a lote e entre disciplinas diferentes.

---

# 11. REGRAS GERAIS

- Nenhum documento existente (Dossiês, Auditoria, Plano de Produção, Lotes já entregues) pode ser alterado por este controlador ou em nome dele.
- Nenhuma questão é criada por este documento.
- Nenhum plano de produção existente é refeito — o controlador opera **sobre** os planos já existentes, não os substitui.
- Este documento define exclusivamente **governança**: como decidir o que produzir a seguir, como qualificar o que foi produzido, e como reportar o estado do banco — nunca o conteúdo técnico-normativo em si, que permanece de responsabilidade exclusiva do Dossiê Mestre de cada disciplina.

---

# VALIDAÇÃO — genericidade

Este documento foi desenhado para controlar **qualquer disciplina** do SimulaPro, não apenas Processo de Enfermagem:

- Nenhuma seção (Filosofia, Ciclo, Estados, Metas, Priorização, Diversidade, Revisão, Duplicidade, Identificador, Relatórios, Regras Gerais) faz referência a conteúdo normativo específico de Enfermagem como regra — todas as regras operam sobre estruturas genéricas já usadas em qualquer Plano de Produção do SimulaPro: macrotema/assunto/subassunto, prioridade, peso em concursos, quantidade inicial/ideal, banca, dificuldade.
- O único ponto de acoplamento à disciplina de origem é o Código de Disciplina (Seção 9) e os exemplos ilustrativos espalhados pelo texto — nenhum deles é normativo, todos estão marcados como exemplo.
- O pré-requisito de uso deste controlador para qualquer nova disciplina é a existência prévia de um **Plano de Produção** no mesmo formato do `PLANO_PRODUCAO_PROCESSO_ENFERMAGEM_V1.md` (inventário macrotema → assunto → subassunto, matriz de produção com prioridade/peso/quantidades) — sem isso, as Seções 3 a 5 não têm sobre o que operar.

## Adaptação para outras disciplinas

1. Garantir que a disciplina já possua um Dossiê Mestre e um Plano de Produção equivalentes aos desta série (mesmo nível de detalhe: macrotema/assunto/subassunto, prioridade, peso, metas inicial/ideal).
2. Atribuir um Código de Disciplina novo e definitivo (Seção 9), nunca reaproveitando um já usado.
3. Inicializar todos os subassuntos daquela disciplina no estado **SEM QUESTÃO** (Seção 3) — o ponto de partida é sempre 0% de cobertura, independentemente de a disciplina já ter questões no acervo real por outra via (ex.: importação histórica de provas reais, que segue uma lógica de proveniência diferente da produção editorial inédita governada por este documento e deve ser tratada como um mapeamento inicial de cobertura, não como produção já governada por este ciclo).
4. Aplicar o Ciclo Oficial (Seção 2) normalmente a partir daí — Mapear → Selecionar → Gerar → Revisar → Validar → Importar → Atualizar.
5. Nenhuma regra numérica (metas da Seção 4, faixas de confiança da Seção 7, limiares de diversidade da Seção 6) muda entre disciplinas — são constantes do controlador, não parâmetros por disciplina, para manter o banco do SimulaPro comparável entre si.

## Encerramento

Arquivo criado: `docs/metodologia/EDITORIAL_CONTROLLER_V1.md`. Nenhum documento anterior alterado. Nenhuma questão gerada. Nenhum plano refeito. Parando aqui, conforme solicitado.
