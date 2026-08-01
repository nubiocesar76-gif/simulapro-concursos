# GATE DE QUALIDADE EDITORIAL — V1

## Objetivo e status

Última verificação de uma questão antes da importação real ao acervo (`convergence.server.ts`), aplicável a **qualquer disciplina** que já tenha completado Dossiê Mestre, Inteligência Editorial, Auditoria Normativa, Plano de Produção e um lote de cobertura (Nível 1, 2 ou 3). Este documento **não substitui nenhuma etapa existente** — não é um Dossiê, não é uma Auditoria, não é o Plano de Produção, não é o Validator nem o Auditor Editorial já existentes no Motor Editorial. É a camada final, comum a todas as disciplinas, entre o estágio "Aprovada" e o estágio "Importada" já definidos no `QUESTION_SPEC_V1.md` (Seção 8).

## Onde este Gate se encaixa — sem duplicar nada que já existe

O Motor Editorial já tem duas camadas de verificação de qualidade, cada uma com escopo próprio, nenhuma delas alterada por este documento:

1. **Índice de Confiança** (`QUESTION_SPEC_V1.md`, Seções 7-8): autoavaliação em 7 dimensões feita durante a redação, com bandas 95-100% (Aprovada) / 90-94% (Revisão obrigatória) / <90% (Reescrever) — é o portão de entrada no estágio "Aprovada", um número agregado.
2. **Auditor Editorial** (`src/lib/editorial-ai/audit/*`, `docs/editorial/engine-v2/implementacao/07-IT-007-auditoria-editorial.md`): sistema em código que audita ciclos gerados pelo **pipeline automático de IA** (`editorial_ai_cycles`), reaproveitando os sinais do Validator.

Este Gate cobre uma lacuna real que nenhuma das duas camadas acima resolve sozinha: as questões produzidas pela **trilha metodológica** (Dossiê → Inteligência → Auditoria → Plano → Lote, o processo usado em Processo de Enfermagem, Terapia Intensiva e Saúde Coletiva) são redigidas diretamente em texto, sem passar pelo `editorial_ai_cycles`/Validator/Auditor Editorial — não existia, até este documento, uma verificação final estruturada e padronizada antes de uma dessas questões ser importada. O Gate resolve isso substituindo um número único (Índice de Confiança) por **4 dimensões explícitas e diagnósticas**, permitindo saber exatamente qual tipo de problema bloqueou uma questão, não apenas que ela ficou abaixo de um limiar.

**Nenhum estado novo é criado no banco.** APROVADA/REVISÃO/REPROVADA (Seção "Classificação Final") são um resultado de documentação/relatório, aplicado sobre questões que já estão no estágio "Aprovada" do Question Spec — nunca uma coluna, enum ou tabela nova. A transição real para "Importada" continua sendo, como já era, uma decisão humana seguida da execução de `convergence.server.ts`.

---

# NÍVEL 1 — QUALIDADE TÉCNICA

Defeitos objetivos, verificáveis sem julgamento editorial. **Qualquer reprovação neste nível é suficiente para reprovar a questão inteira** (ver Classificação Final) — não é uma falha que revisão superficial resolva.

| Item | Critério de aprovação |
|---|---|
| Gabarito | A alternativa marcada como correta é, de fato, a única defensável tecnicamente, sem ambiguidade. |
| Coerência | Enunciado, alternativas e gabarito não se contradizem entre si nem com o conceito testado. |
| Inexistência de duas respostas corretas | Nenhuma alternativa além do gabarito pode ser defendida como correta sob leitura razoável. |
| Inexistência de conflito lógico | Nenhuma alternativa é logicamente incompatível com a premissa do enunciado (ex.: alternativa que nega um dado já afirmado no comando). |
| Clareza do enunciado | Compreensível numa única leitura, sem ambiguidade sintática ou lacuna de informação necessária à resposta. |
| Qualidade dos distratores | Nenhum distrator é absurdo ou eliminável por exclusão óbvia; todos exigem conhecimento real para descartar. |

---

# NÍVEL 2 — QUALIDADE EDITORIAL

Aderência da questão aos 4 documentos de entrada da disciplina. **Falha em "inexistência de duplicidade" reprova a questão** (não é corrigível por edição, exige nova questão); falha nos demais itens deste nível encaminha para revisão (ver Classificação Final).

| Item | Critério de aprovação |
|---|---|
| Aderência ao Dossiê Mestre | O conceito, a definição e a terminologia usados na questão correspondem exatamente ao capítulo correspondente do Dossiê Mestre — nenhuma informação contradiz o que o Dossiê registra. |
| Aderência à Inteligência Editorial | Banca, estilo e nível de dificuldade escolhidos são compatíveis com o perfil real (ou a "evidência insuficiente" declarada) descrito na Parte 2 da Inteligência Editorial; se a questão explora uma pegadinha, ela corresponde a uma das já catalogadas na Parte 3, ou é justificada como nova achado técnico. |
| Aderência ao Plano de Produção | O subassunto, a prioridade e a ordem de produção da questão correspondem à Tabela A/B do Plano; a competência cognitiva e o perfil predominante declarados no Plano foram respeitados. |
| Cobertura correta do subassunto | A questão testa efetivamente o subassunto ao qual foi atribuída — não um subassunto vizinho por proximidade temática. |
| Inexistência de duplicidade | A questão não repete raciocínio, distratores, estrutura ou cenário de nenhuma outra questão já existente (real ou já aprovada nesta disciplina) para o mesmo subassunto. |

---

# NÍVEL 3 — QUALIDADE NORMATIVA

Verificação contra a Auditoria Normativa da disciplina. **Qualquer reprovação neste nível é suficiente para reprovar a questão inteira** (ver Classificação Final) — usar norma revogada ou referência desatualizada é o mesmo tipo de defeito objetivo do Nível 1, não uma questão de estilo.

| Item | Critério de aprovação |
|---|---|
| Normas vigentes | Toda norma citada na questão (lei, decreto, portaria, resolução) está classificada como "Vigente" na Matriz de Confiança da Auditoria Normativa da disciplina. |
| Referências atualizadas | Onde a Auditoria identificou uma edição/versão vigente específica (ex.: "6ª edição, 2024" de um guia técnico), a questão usa essa versão, não uma anterior. |
| Ausência de norma revogada | Nenhuma norma marcada "Revogada" (expressamente ou por consolidação) na Auditoria Normativa é citada como se estivesse em vigor. |
| Compatibilidade com a Auditoria Normativa | Onde a Auditoria registrou "REVISÃO FUTURA RECOMENDADA" para um subassunto, a questão usa a citação corrigida indicada na própria Auditoria (não a citação original, potencialmente desatualizada, do Dossiê Mestre). |

---

# NÍVEL 4 — QUALIDADE COMERCIAL

Valor do item para o usuário final e para o negócio. Nenhum item deste nível reprova sozinho a questão — reprovações aqui encaminham para revisão (ver Classificação Final), nunca para reescrita total, pois o conteúdo já está tecnicamente e normativamente correto.

| Item | Critério de aprovação |
|---|---|
| Dificuldade adequada | O nível declarado (Fácil/Médio/Difícil) corresponde à exigência cognitiva real da questão, não a uma autoclassificação otimista. |
| Estilo compatível com a banca | Formato (A-E, Certo/Errado, julgamento de afirmativas, caso clínico nomeado) e tom coerentes com o perfil real da banca-alvo já descrito na Inteligência Editorial. |
| Valor pedagógico | A questão ensina algo ao ser respondida (mesmo quando errada) — feedback/justificativa esperados são informativos, não apenas "está errado". |
| Potencial de aprendizagem | Prioriza raciocínio clínico, interpretação, integração entre conceitos ou aplicação prática sobre memorização pura, conforme já instruído nas fases de produção. |
| Ausência de memorização desnecessária | A questão não exige decorar um número ou dado que se desatualiza (ex.: valor exato de indicador, composição fechada de lista/calendário) sem contextualizá-lo — dado variável deve ser fornecido no enunciado, não exigido de memória. |

---

# CLASSIFICAÇÃO FINAL

Cada questão recebe **exatamente um** dos três status abaixo — nunca mais de um, nunca combinação.

## Regra de decisão (determinística, sem ambiguidade de aplicação)

```
SE qualquer item do Nível 1 falhar           → REPROVADA
SE qualquer item do Nível 3 falhar           → REPROVADA
SE "inexistência de duplicidade" (Nível 2) falhar → REPROVADA
SENÃO SE qualquer outro item do Nível 2 falhar    → REVISÃO
SENÃO SE qualquer item do Nível 4 falhar          → REVISÃO
SENÃO                                              → APROVADA
```

## Regras de fluxo

- **APROVADA** — passou nos 4 níveis sem nenhuma falha. Pode ser importada (`convergence.server.ts`), respeitando o fluxo humano de homologação já existente — este Gate não elimina a decisão humana final, apenas a padroniza.
- **REVISÃO** — falha isolada em item de Nível 2 (exceto duplicidade) ou de Nível 4. Permanece **fora da importação** até a correção pontual do item apontado; não retorna ao início da produção, pois a base técnica e normativa já está correta.
- **REPROVADA** — falha em Nível 1, em Nível 3, ou em duplicidade (Nível 2). Retorna ao fluxo de produção (nova redação a partir do mesmo subassunto/Plano de Produção), pois o defeito não é corrigível por ajuste pontual.

## Registro do resultado

O resultado do Gate é registrado **apenas como relatório/documentação** (mesmo padrão já usado pelos relatórios do Auditor Editorial em `docs/editorial-ai/audit-reports/`), nunca como escrita em `editorial_ai_cycles`, `editorial_ai_decisions` ou qualquer outra tabela — nenhuma alteração de schema, nenhuma coluna nova, nenhum estado novo no banco, conforme restrição explícita desta fase.

---

## Encerramento desta fase

Documento único, aplicável a todas as disciplinas futuras que completem o ciclo Dossiê → Inteligência → Auditoria → Plano → Lote. Nenhuma metodologia, Controller, Queue, Question Spec ou Pipeline foi alterado — o Gate referencia esses documentos, nunca os reescreve. Nenhum estado novo foi criado no banco. Nenhuma questão foi produzida ou reavaliada nesta fase — a aplicação retroativa deste Gate ao lote de 30 questões de Saúde Coletiva (Fase 5.0) não foi executada aqui, por não ter sido solicitada nesta fase, e fica disponível como próximo passo natural, não automático.
