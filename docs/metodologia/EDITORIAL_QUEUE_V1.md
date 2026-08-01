# EDITORIAL QUEUE V1

## Objetivo e status

Fila de produção editorial do SimulaPro. Não cria nenhuma questão, não altera nenhum documento existente. Sua função é puramente **computacional/organizacional**: a partir do estado real de cobertura de uma disciplina (medido conforme `EDITORIAL_CONTROLLER_V1.md`), determinar automaticamente **o que produzir a seguir, quanto produzir, e quando parar** — eliminando a necessidade de decisão manual a cada lote, como ainda ocorreu, com análise humana explícita, nas Fases 3.1 a 3.3.

Este documento é **consumido pelo Editorial Controller** (que define os estados, metas, faixas de confiança e regras gerais) — o Queue não redefine nenhuma dessas regras, apenas as aplica de forma mecânica para gerar filas ordenadas e acionáveis.

---

# SEÇÃO 1 — FILA DE PRIORIDADES

Cinco níveis obrigatórios, calculados **por subassunto**, com base exclusivamente na quantidade de questões no estado **CONSOLIDADO** (Editorial Controller, Seção 3) daquele subassunto — questões ainda em produção, revisão ou validação **não contam** para este cálculo, porque ainda não resolveram a lacuna de cobertura real do acervo:

| Nível | Critério (questões CONSOLIDADAS) | Corresponde a (Editorial Controller, Seção 4) |
|---|---|---|
| **PRIORIDADE CRÍTICA** | 0 | Abaixo do Nível 1 |
| **PRIORIDADE ALTA** | 1 | Nível 1 atingido, abaixo do Nível 2 |
| **PRIORIDADE MÉDIA** | 2 ou 3 | Entre o Nível 1 e o Nível 2 (3) |
| **PRIORIDADE BAIXA** | 4 ou 5 | Entre o Nível 2 (3) e o Nível 3 (5) |
| **CONSOLIDADO** | 6 ou mais (acima da meta de cobertura recomendada) | Nível 3 (5) já superado |

Um subassunto com 5 questões em EM PRODUÇÃO mas 0 CONSOLIDADAS continua **PRIORIDADE CRÍTICA** — a fila reflete o que está realmente no acervo, não o que está sendo trabalhado.

---

# SEÇÃO 2 — REGRAS DA FILA

Ordem obrigatória de avanço, **nunca invertida**, aplicada **de forma independente a cada disciplina** (ver nota de escala na Seção 10):

1. Cobrir **todos** os subassuntos da disciplina até ao menos 1 questão CONSOLIDADA (eliminar toda PRIORIDADE CRÍTICA).
2. Só então elevar todos os subassuntos a 3 questões (eliminar toda PRIORIDADE ALTA e MÉDIA).
3. Só então elevar todos os subassuntos a 5 questões (eliminar toda PRIORIDADE BAIXA).
4. Só então elevar os subassuntos a 10 questões (avançar rumo a CONSOLIDADO em profundidade).

Esta regra generaliza, para todas as transições de patamar (não só a transição inicial 0→1), o princípio já fixado no Editorial Controller, Seção 1: nenhum subassunto avança de patamar enquanto outro da mesma disciplina ainda não atingiu o patamar anterior.

---

# SEÇÃO 3 — LIMITES

**Enquanto existir qualquer subassunto em PRIORIDADE CRÍTICA na disciplina, nenhum lote pode produzir questões para subassuntos CONSOLIDADOS daquela mesma disciplina.**

Este limite é um portão binário (bloqueia ou libera), avaliado a cada novo ciclo, nunca uma preferência flexível. A única exceção admitida é decisão editorial humana explícita e documentada (mesma exceção já prevista no Editorial Controller, Seção 5, item 5) — nunca uma exceção silenciosa por conveniência de produção.

---

# SEÇÃO 4 — BALANCEAMENTO

Para cada subassunto que entra em produção, a fila calcula um **vetor de lacuna de diversidade**, cobrindo as dimensões já definidas no Editorial Controller (Seção 6): banca, dificuldade, tipo de raciocínio (conceito, aplicação prática, caso clínico, interpretação normativa), e — nova nesta fase — **integração** (questões que cruzam dois ou mais assuntos, como já produzido na Fase 3.2, Questão 10).

O vetor identifica, para aquele subassunto, quais valores de cada dimensão **ainda não foram usados** ou estão sub-representados frente às regras de dominância já fixadas (Editorial Controller, Seção 6 — ex.: nenhuma banca acima de 50% das questões do subassunto a partir do Nível 2). A fila prioriza, dentro do próprio subassunto, gerar exatamente a combinação mais ausente — não uma combinação aleatória.

**Importante quanto a escala:** balanceamento não exige cobertura combinatorial completa (banca × dificuldade × tipo × caso clínico × integração não precisam aparecer em todas as combinações possíveis) — exige apenas que nenhum valor isolado domine. Um subassunto maduro (Nível 4, 10 questões) tem espaço de sobra para variar as dimensões sem esgotar combinações; não há necessidade, nem seria viável, de gerar uma questão para cada combinação teoricamente possível.

---

# SEÇÃO 5 — FILA DE REVISÃO

Toda questão produzida está, a qualquer momento, em exatamente uma destas cinco sub-filas:

- **Aprovadas** — Índice de Confiança Editorial ≥ 95% (Editorial Controller, Seção 7); seguem automaticamente para a Fila de Importação (Seção 6).
- **Em revisão** — Índice entre 90% e 94%; aguardam decisão humana explícita antes de avançar ou retroceder.
- **Rejeitadas** — Índice < 90%; retornam ao subassunto de origem como pendência de nova geração (ver Seção 7 — Fila de Substituição).
- **Substituídas** — questão que foi rejeitada e teve uma nova versão aprovada em seu lugar; a versão antiga permanece registrada (nunca apagada), marcada como substituída, para rastreabilidade — nunca conta para a cobertura (Seção 1).
- **Arquivadas** — questão que já esteve CONSOLIDADA (no acervo real) e foi retirada de circulação por motivo posterior à aprovação original (ex.: a norma usada como fundamento do gabarito foi revogada depois da importação — cenário já mapeado como risco real na Auditoria Normativa desta série). Diferente de "rejeitada": rejeição é sobre qualidade no momento da revisão; arquivamento é sobre obsolescência descoberta depois. Uma questão arquivada **decrementa** a contagem de CONSOLIDADAS do seu subassunto, podendo derrubá-lo de volta a um nível de prioridade mais alto (ex.: de CONSOLIDADO para PRIORIDADE BAIXA, se questões suficientes forem arquivadas).

---

# SEÇÃO 6 — FILA DE IMPORTAÇÃO

Só entram nesta fila questões que atendam **simultaneamente** a todos os critérios abaixo — nenhum isoladamente é suficiente:

- ✓ Índice de Confiança Editorial ≥ 95%.
- ✓ Revisão concluída (não apenas iniciada — a questão precisa ter passado pelo estado EM REVISÃO por completo, conforme Editorial Controller, Seção 3).
- ✓ Sem duplicidade (checagem contra todas as questões já existentes do mesmo subassunto, conforme Editorial Controller, Seção 8 — nunca apenas contra o lote mais recente).
- ✓ Referência normativa validada (norma vigente confirmada, nunca revogada como fundamento do gabarito, conforme Auditoria Normativa e Dossiê Mestre da disciplina).
- ✓ Prontas para produção — checagem final consolidando as quatro anteriores; se qualquer uma falhar, a questão nunca chega a esta fila, retornando à Fila de Revisão (Seção 5).

Passar pela Fila de Importação é o evento que muda o estado da questão para CONSOLIDADO e recalcula, em tempo real, a Fila de Prioridades (Seção 1) do subassunto correspondente.

---

# SEÇÃO 7 — FILA DE SUBSTITUIÇÃO

Sempre que uma questão é **rejeitada** (Seção 5) ou **arquivada** (Seção 5), o sistema deve, automaticamente e sem intervenção manual:

1. **Remover da cobertura** — decrementar a contagem de questões CONSOLIDADAS daquele subassunto (se a questão já havia sido importada) e recalcular seu nível na Fila de Prioridades (Seção 1); questões apenas rejeitadas antes de importação não afetam cobertura, pois nunca chegaram a contar.
2. **Devolver o subassunto para a fila** — se o recálculo do passo 1 fizer o subassunto cair de nível (ex.: de CONSOLIDADO para PRIORIDADE BAIXA), ele reentra imediatamente na fila de produção ativa, respeitando a Seção 3 (se isso reabrir uma PRIORIDADE CRÍTICA em uma disciplina que já não tinha nenhuma, os limites da Seção 3 voltam a valer para toda aquela disciplina).
3. **Priorizar nova geração** — o subassunto afetado entra no topo da fila dentro do seu novo nível de prioridade (não no fim), garantindo que a lacuna reaberta seja fechada antes de lacunas já conhecidas e não atendidas de mesmo nível.

---

# SEÇÃO 8 — RELATÓRIOS

Após cada lote, a fila informa automaticamente (mesmo formato-base do Editorial Controller, Seção 10, com os campos de fila detalhados abaixo):

- **Cobertura anterior** e **Cobertura atual** — percentual de subassuntos com ao menos 1 questão CONSOLIDADA, antes e depois do lote.
- **Subassuntos completos** — quantos mudaram de nível na Fila de Prioridades (Seção 1) neste lote.
- **Subassuntos críticos** — lista atual de PRIORIDADE CRÍTICA, ordenada por peso em concursos (critério de desempate do Editorial Controller, Seção 5).
- **Fila de produção seguinte** — próximos subassuntos a produzir, na ordem definida pela Seção 2 desta fila, já considerando os limites da Seção 3.
- **Fila de revisão** — contagem por sub-fila da Seção 5 (Aprovadas / Em revisão / Rejeitadas / Substituídas / Arquivadas).
- **Fila de importação** — quantas questões atendem, neste momento, a todos os 5 critérios da Seção 6 e estão prontas para entrar no acervo real.
- **Fila de substituição** — quantos subassuntos foram reabertos neste lote por rejeição ou arquivamento (Seção 7), e para qual nível de prioridade retornaram.

---

# SEÇÃO 9 — EXPANSÃO FUTURA

O Queue opera **exclusivamente** sobre estes sete campos, válidos para qualquer disciplina do SimulaPro, sem nenhuma regra específica de Processo de Enfermagem embutida na lógica:

`Disciplina` · `Macrotema` · `Assunto` · `Subassunto` · `Quantidade` (de questões CONSOLIDADAS) · `Estado` (Editorial Controller, Seção 3) · `Prioridade` (Seção 1 deste documento).

Toda referência a Processo de Enfermagem, Resolução COFEN, IBFC/FGV ou qualquer outro conteúdo desta série ao longo deste documento é **exemplo ilustrativo**, nunca regra — a mesma ressalva já aplicada no Editorial Controller, Seção "Validação — genericidade".

---

# SEÇÃO 10 — VALIDAÇÃO DE ESCALA

Verificação de que o Queue funciona, sem gargalo, para 10 disciplinas, 500 assuntos, 5.000 subassuntos e 50.000 questões (média de maturidade: 10 questões/subassunto — exatamente o Nível 4 do Editorial Controller, o que confirma que os números da simulação são internamente consistentes com as metas já definidas).

**Gargalo 1 identificado — regra de avanço por patamar (Seção 2) aplicada globalmente.** Se a regra "nunca inverter a ordem" fosse interpretada como um único portão global entre as 10 disciplinas, a produção inteira do SimulaPro travaria esperando o último subassunto CRÍTICO de qualquer disciplina, mesmo que as outras 9 já estivessem maduras — um gargalo real e grave nesta escala. **Correção:** a Seção 2 já foi redigida acima como aplicada **independentemente por disciplina** (explicitado no próprio título da seção) — cada disciplina tem sua própria fila e seu próprio avanço por patamar; disciplinas nunca se bloqueiam mutuamente. Esta correção está incorporada ao texto final, não é uma pendência.

**Gargalo 2 identificado — checagem de duplicidade crescendo com o total do acervo.** Se a checagem de duplicidade (Seção 6) comparasse cada questão nova contra as 50.000 já existentes, o custo cresceria com o tamanho total do banco. **Correção/confirmação:** a checagem de duplicidade é e sempre foi escopada ao **mesmo subassunto** (Editorial Controller, Seção 8) — e nenhum subassunto, pelas próprias metas do sistema, ultrapassa a dezena a poucas dezenas de questões (Nível 4 = 10; Nível 5 = 20+, sem teto superior definido, mas sem expectativa de crescer para milhares). O custo de checagem por questão nova é, portanto, limitado a um conjunto pequeno e estável, **independente do tamanho total do acervo** — 50.000 questões no total não tornam a checagem de uma questão nova mais cara do que seria com 500.

**Gargalo 3 identificado — fila como estrutura própria versus fila como consulta.** Se a "fila" fosse mantida como uma lista separada, persistida e sincronizada manualmente a cada mudança de estado, ela divergiria da realidade em escala (5.000 subassuntos mudando de estado o tempo todo tornariam a sincronização propensa a erro). **Correção:** o Queue é, por definição, **sempre recalculado a partir do estado real** (contagem de questões CONSOLIDADAS por subassunto, Seção 1) — nunca uma lista mantida à parte que possa dessincronizar. Isso é uma decisão de design deste documento, não uma correção de código (fora de escopo aqui), mas precisa estar explícita para que qualquer implementação futura não introduza uma fila persistida redundante.

**Gargalo 4 identificado — desempate ambíguo com muitos subassuntos simultaneamente críticos.** Em estágio inicial, com até milhares de subassuntos em PRIORIDADE CRÍTICA ao mesmo tempo (ex.: 10 disciplinas novas, nenhuma com nenhuma questão ainda), a fila precisa de uma ordem determinística, não arbitrária. **Correção/confirmação:** o desempate por peso em concursos (Editorial Controller, Seção 5) já é suficiente e não é redefinido aqui — herdado sem duplicação de lógica, evitando que Queue e Controller divirjam sobre como desempatar.

**Gargalo 5 identificado — balanceamento (Seção 4) interpretado como exigência combinatorial.** Já tratado diretamente no corpo da Seção 4 acima: a exigência é "nenhum valor domina", não "toda combinação deve existir" — evitando uma explosão combinatorial que seria inviável mesmo na maturidade máxima (Nível 5) de qualquer subassunto.

**Conclusão da validação:** com as cinco correções acima já incorporadas ao texto das seções correspondentes (nenhuma pendente), o Queue opera com custo por operação (checar 1 subassunto, gerar 1 fila, decidir 1 próximo lote) **independente do tamanho total do sistema** — a mesma lógica que funciona para 1 disciplina com 65 subassuntos (o caso real desta série, Processo de Enfermagem) funciona sem alteração para 10 disciplinas com 5.000.

## Encerramento

Arquivo criado: `docs/metodologia/EDITORIAL_QUEUE_V1.md`. Nenhum documento anterior alterado. Nenhuma questão gerada. Parando aqui, conforme solicitado.
