# PRODUCTION PIPELINE V1

## Objetivo e status

Documento que **conecta** toda a arquitetura editorial construída até aqui em um único fluxo operacional. Não cria nenhuma questão, não altera nenhum dos sete documentos anteriores, não cria nenhum componente novo — é o **manual de operação**, para produtor humano ou para o Motor Editorial, de como os sete documentos já existentes trabalham juntos, na ordem certa, do começo ao fim de um lote.

Documentos conectados por este pipeline, cada um mantendo integralmente seu papel já definido, nenhum redefinido aqui: `DOSSIE_MESTRE_PROCESSO_ENFERMAGEM_V2.md` (e o correspondente de qualquer outra disciplina), `DOSSIE_MESTRE_SAE_INTELIGENCIA_EDITORIAL_V1.md`, `DOSSIE_MESTRE_SAE_AUDITORIA_NORMATIVA_V1.md`, `PLANO_PRODUCAO_PROCESSO_ENFERMAGEM_V1.md`, `EDITORIAL_CONTROLLER_V1.md`, `EDITORIAL_QUEUE_V1.md`, `QUESTION_SPEC_V1.md`.

---

# SEÇÃO 1 — VISÃO GERAL

```
Backlog
   ↓
Editorial Queue        (decide O QUÊ produzir a seguir — EDITORIAL_QUEUE_V1, Seções 1-3)
   ↓
Geração                 (produz a questão — Seção 3 deste documento)
   ↓
Validação               (checklist técnico — Seção 4 deste documento)
   ↓
Revisão                 (calcula/confirma o Índice de Confiança — Seção 5 deste documento)
   ↓
Aprovação                (decisão de avanço com base no índice — gate humano ou automatizado, nunca silencioso)
   ↓
Importação              (entra no acervo real — Seção 6 deste documento)
   ↓
Atualização da Cobertura (recalcula estado/fila/backlog/métricas — Seção 7 deste documento)
   ↓
Próximo Lote             (retorna ao Backlog, já atualizado)
```

Cada seta é uma transição de estado da questão (`QUESTION_SPEC_V1.md`, Seção 8: Rascunho → Em revisão → Aprovada → Importada) ou do subassunto (`EDITORIAL_CONTROLLER_V1.md`, Seção 3: SEM QUESTÃO → EM PRODUÇÃO → EM REVISÃO → VALIDADO → CONSOLIDADO) — nenhuma etapa deste pipeline inventa um estado novo; todas reaproveitam os já definidos.

**Backlog**, novo nesta fase, é definido como: o conjunto de todos os subassuntos de todas as disciplinas ainda abaixo da meta de cobertura vigente naquele momento (`EDITORIAL_CONTROLLER_V1.md`, Seção 4). O Backlog **nunca é uma lista mantida à parte** — é sempre recalculado a partir do estado real (mesmo princípio de design já fixado no `EDITORIAL_QUEUE_V1.md`, Seção 10, Gargalo 3: fila como consulta, nunca como estrutura própria sincronizada manualmente). A Editorial Queue consome o Backlog e devolve a ordem de produção.

---

# SEÇÃO 2 — ENTRADAS

Cada lote é alimentado, obrigatoriamente e nesta ordem de consulta, por:

1. **Dossiê Mestre** da disciplina — fonte do conteúdo técnico-normativo (o que é tecnicamente correto dizer).
2. **Plano de Produção** da disciplina — fonte do inventário (macrotema/assunto/subassunto), prioridade e peso.
3. **Editorial Controller** — fonte dos Estados, Metas e regras gerais de governança (o que pode e o que não pode avançar).
4. **Editorial Queue** — fonte da ordem exata de produção para este lote específico.
5. **Question Spec** — fonte da estrutura exata que cada questão deve ter.

**Nunca utilizar fontes externas sem validação.** Quando o conteúdo do Dossiê Mestre precisar de verificação contra uma fonte externa (ex.: confirmar se uma norma continua vigente), essa verificação segue exclusivamente o mesmo padrão já usado na `DOSSIE_MESTRE_SAE_AUDITORIA_NORMATIVA_V1.md`: consulta direta a fonte oficial primária, citação explícita da fonte, e — quando a verificação alterar o conteúdo técnico — produção de um novo documento normativo próprio (como o `DOSSIE_MESTRE_PROCESSO_ENFERMAGEM_V2.md` foi produzido a partir daquela auditoria), nunca uma alteração silenciosa de bastidores dentro de uma questão isolada.

---

# SEÇÃO 3 — GERAÇÃO

Toda geração de questão obedece, simultaneamente e sem exceção, a:

- **Question Spec** — toda questão nasce já na estrutura completa da Seção 1 a 8 daquele documento (identidade, estrutura pedagógica, estrutura da questão, classificações, distratores, qualidade), nunca preenchida parcialmente "para completar depois".
- **Editorial Controller** — a questão só pode ser gerada para um subassunto que o Controller autoriza a receber produção agora (respeitando a regra de que nenhum assunto cresce enquanto outro permanece descoberto, Seção 1 daquele documento).
- **Editorial Queue** — a questão é gerada para o subassunto e na combinação (banca/dificuldade/tipo) que a Queue apontou como lacuna de diversidade (Seção 4 daquele documento) — nunca uma combinação escolhida livremente pelo produtor.
- **Plano de Produção** — o conteúdo técnico específico (qual conceito, qual referência normativa, qual peso) vem do inventário e da matriz de produção daquele plano, nunca inventado fora dele.

Se qualquer uma das quatro fontes acima estiver ausente ou desatualizada para a disciplina em questão, a geração não deve prosseguir até a lacuna documental ser resolvida — gerar sem uma das quatro bases é, por definição, sair do escopo deste pipeline.

---

# SEÇÃO 4 — VALIDAÇÃO

Checklist obrigatório antes de a questão avançar de Rascunho para Em revisão:

| Item | Verificado contra |
|---|---|
| ✓ Sem duplicidade | `EDITORIAL_CONTROLLER_V1.md` Seção 8 + `EDITORIAL_QUEUE_V1.md` Seção 6 + `QUESTION_SPEC_V1.md` Seção 5 (mesmo raciocínio, mesmo distrator, mesmo caso clínico, mesma referência repetida) |
| ✓ Referência válida | Dossiê Mestre da disciplina + Auditoria Normativa correspondente (norma vigente confirmada, nunca revogada como fundamento) |
| ✓ Banca correta | Inteligência Editorial da disciplina (perfil real observado) ou, na ausência de evidência real, declaração explícita de estilo genérico (nunca banca atribuída sem justificativa, mesma regra já seguida desde a Fase 3.1) |
| ✓ Dificuldade coerente | Matriz de Dificuldade do Plano de Produção da disciplina (Parte 4), incluindo os desvios justificados de 40/40/20 já registrados naquele plano |
| ✓ Distratores adequados | `QUESTION_SPEC_V1.md` Seção 5 (tipo declarado por alternativa) + catálogo de pegadinhas da Inteligência Editorial da disciplina (Parte 3), quando existente |
| ✓ Índice de confiança calculado | `QUESTION_SPEC_V1.md` Seção 7 / `EDITORIAL_CONTROLLER_V1.md` Seção 7 — nunca uma questão avança sem o índice explicitamente calculado, mesmo que o resultado seja alto |

Nenhum item é opcional; uma questão que falhe em qualquer um retorna a Rascunho para correção antes de qualquer tentativa de avanço.

---

# SEÇÃO 5 — REVISÃO

Mesmas três faixas já fixadas no `EDITORIAL_CONTROLLER_V1.md` (Seção 7) e no `QUESTION_SPEC_V1.md` (Seção 7) — não redefinidas aqui, apenas confirmadas como o único critério de decisão nesta etapa do pipeline:

**95-100%** → Aprovada, segue para Importação. **90-94%** → Correção (revisão humana obrigatória antes de qualquer nova tentativa de avanço; nunca importada nesta faixa). **< 90%** → Reescrever (nova Versão, a anterior vira Substituída, `QUESTION_SPEC_V1.md` Seção 8).

---

# SEÇÃO 6 — IMPORTAÇÃO

Só entra no acervo real a questão que for, simultaneamente:

✓ **Aprovada** (Seção 5) · ✓ **Sem duplicidade** (Seção 4, reconfirmada nesta etapa, não apenas na Validação) · ✓ **Com ID definitivo** (padrão `QUESTION_SPEC_V1.md`/`EDITORIAL_CONTROLLER_V1.md` Seção 9, nunca reaproveitado) · ✓ **Compatível com `questions.csv`** · ✓ **Compatível com `questions.json`**.

Os dois últimos critérios já foram **verificados estruturalmente** (não apenas presumidos) no `QUESTION_SPEC_V1.md`, Seção 9 — cada campo do contrato tem mapeamento confirmado para as colunas reais do CSV e do JSON, incluindo as duas lacunas encontradas e já mitigadas (Macrotema e Dificuldade). "Compatível" aqui significa que a estrutura de dados da questão é **expressável** em ambos os formatos, não que toda questão inédita literalmente passa pelos arquivos `questions.csv`/`questions.json` — o Motor Editorial já possui, desde a Sprint 7.1A, um caminho de importação direto ao banco real (`src/lib/editorial-ai/publish/convergence.server.ts`), que insere na tabela `questions` sem transitar por CSV/JSON; esses dois arquivos permanecem o caminho real de importação em massa de provas históricas (via `scripts/seed/questions/convert`). O critério de compatibilidade garante que a mesma questão poderia, se necessário, seguir qualquer um dos dois caminhos reais sem perda de informação — não impõe qual caminho é usado.

---

# SEÇÃO 7 — ATUALIZAÇÃO

Imediatamente após cada importação:

1. **Atualizar cobertura** — recalcular o nível de Prioridade do subassunto (`EDITORIAL_QUEUE_V1.md`, Seção 1), com base na nova contagem de questões Importadas.
2. **Atualizar fila** — recomputar a Fila de Produção Seguinte (`EDITORIAL_QUEUE_V1.md`, Seção 8); se o subassunto mudou de nível, ele sai ou entra das filas correspondentes automaticamente, sem edição manual.
3. **Atualizar backlog** — o Backlog (Seção 1 deste documento) reflete a nova cobertura assim que recalculado; nenhuma ação manual adicional, pois o Backlog nunca é uma lista persistida à parte.
4. **Atualizar métricas** — ver Seção 8.

---

# SEÇÃO 8 — MÉTRICAS

Registradas ao final de cada lote:

| Métrica | Fonte de cálculo |
|---|---|
| Questões produzidas | Contagem de questões que passaram por Geração (Seção 3) neste lote, independentemente do resultado final. |
| Questões aprovadas | Contagem com Índice ≥ 95% (Seção 5) neste lote. |
| Questões rejeitadas | Contagem com Índice < 90% (Seção 5) neste lote, que retornaram para reescrita. |
| Cobertura da disciplina | Percentual de subassuntos com ao menos 1 questão Importada, antes e depois do lote (`EDITORIAL_QUEUE_V1.md`, Seção 8). |
| Tempo médio de produção | Média de (`Última revisão` − `Data de criação`) das questões que saíram de Rascunho neste lote — ambos os campos já existem no contrato (`QUESTION_SPEC_V1.md`, Seção 1); nenhum campo novo é necessário para esta métrica. |
| Tempo médio de revisão | Média do intervalo entre a entrada em Em revisão e a saída para Aprovada/Reescrever — mesmo mecanismo de timestamp acima, sem campo novo. |

---

# SEÇÃO 9 — ESCALABILIDADE

Validação para **50 disciplinas, 1.000 assuntos, 10.000 subassuntos, 100.000 questões** — o dobro da escala já validada sem gargalo no `EDITORIAL_QUEUE_V1.md` (Seção 10: 10/500/5.000/50.000).

Nenhuma alteração estrutural é necessária, pelo mesmo motivo já estabelecido naquela validação: toda operação deste pipeline (gerar 1 questão, validar 1 questão, revisar 1 questão, importar 1 questão, atualizar 1 subassunto) tem custo dependente apenas do **subassunto e da disciplina envolvidos**, nunca do tamanho total do sistema — confirmado nesta fase para os três elementos que este documento acrescenta à arquitetura (Backlog, Métricas, e o encadeamento das 9 etapas):

- **Backlog em escala 5x maior:** como já é uma consulta recalculada (Seção 1 deste documento), e não uma lista sincronizada, seu custo de recálculo é uma função do número de subassuntos que mudaram de estado desde o último cálculo — não do total acumulado de 10.000 subassuntos. Nenhum gargalo novo.
- **Métricas em escala 5x maior:** cada métrica da Seção 8 é uma agregação **por lote**, não uma reconsolidação de todo o histórico do acervo a cada cálculo — 100.000 questões acumuladas não tornam o cálculo das métricas de um lote de 10 mais caro do que seria com 1.000 questões no acervo.
- **50 disciplinas simultâneas:** cada uma opera sua própria Editorial Queue de forma independente (correção já registrada no `EDITORIAL_QUEUE_V1.md`, Seção 10, Gargalo 1) — o Backlog global deste documento é a **união** dos 50 backlogs independentes, nunca um portão único que force uma disciplina a esperar por outra.

**Nenhuma alteração estrutural identificada como necessária.** A arquitetura definida nos sete documentos anteriores já foi desenhada, desde o `EDITORIAL_QUEUE_V1.md`, para custo por operação independente do tamanho total do sistema — este documento herda essa propriedade sem precisar reintroduzi-la.

---

# SEÇÃO 10 — ENCERRAMENTO

**A fase de arquitetura editorial do SimulaPro está oficialmente encerrada com este documento.**

Os oito documentos que a compõem, todos consistentes entre si e verificados nesta fase quanto à conexão operacional completa:

1. `DOSSIE_MESTRE_PROCESSO_ENFERMAGEM_V2.md` (e equivalente por disciplina)
2. `DOSSIE_MESTRE_SAE_INTELIGENCIA_EDITORIAL_V1.md` (e equivalente por disciplina)
3. `DOSSIE_MESTRE_SAE_AUDITORIA_NORMATIVA_V1.md` (e equivalente por disciplina)
4. `PLANO_PRODUCAO_PROCESSO_ENFERMAGEM_V1.md` (e equivalente por disciplina)
5. `EDITORIAL_CONTROLLER_V1.md`
6. `EDITORIAL_QUEUE_V1.md`
7. `QUESTION_SPEC_V1.md`
8. `PRODUCTION_PIPELINE_V1.md` (este documento)

**A partir de agora, novas alterações metodológicas nesta arquitetura só podem ocorrer mediante identificação de falha operacional comprovada** — ou seja, um problema real observado durante a produção efetiva de questões (ex.: um gargalo não previsto pela Seção 9, uma lacuna de compatibilidade não coberta pela Seção 9 do Question Spec, uma regra de priorização que produza resultado indesejado na prática), sempre documentado com evidência concreta antes de qualquer revisão. Preferência estilística, dúvida hipotética sem caso real observado, ou uma forma alternativa de organizar o que já funciona **não** justificam reabrir esta arquitetura — critério explícito para não deixar o processo de melhoria contínua degenerar em retrabalho sem causa real, o mesmo padrão de rigor que sustentou toda esta série desde o Dossiê Mestre original.

## Encerramento deste documento

Arquivo criado: `docs/metodologia/PRODUCTION_PIPELINE_V1.md`. Nenhum dos sete documentos anteriores foi alterado. Nenhum componente novo foi criado. Nenhuma questão foi gerada. Parando aqui, conforme solicitado.
