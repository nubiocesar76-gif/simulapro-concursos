# 04 — Sistema de Evidências, Sistema de Confiança e Sistema de Evolução

Estes três sistemas são o núcleo que transforma a Engine de "planilha
inteligente" em "motor que aprende com dados reais". Eles são desenhados
para funcionar de forma idêntica não importa o curso.

## 1. Sistema de Evidências

### 1.1 O que conta como evidência

Uma evidência é qualquer fato observável que confirma (ou contradiz) uma
classificação. No SimulaPro, a fonte primária de evidência é a questão real
de prova, já modelada no pipeline existente: `docs/work/<prova>/
questions.raw.json` → revisão humana → `docs/work/<prova>/review.json` →
importação (`exam_catalog.imported_questions` /
`approved_questions` / `published_questions`, já presentes na migration).

### 1.2 Estrutura conceitual de uma Evidência

| Campo | Descrição |
|---|---|
| id | Identificador da evidência |
| entity_type | O que está sendo confirmado: `discipline` \| `topic` \| `subtopic` \| `classification_rule` \| `ambiguous_case` |
| entity_id | Registro confirmado |
| tipo | CONFIRMACAO (questão real classificada bate com a regra) \| CONTRADICAO (questão real classificada diverge do previsto) \| REVISAO_HUMANA (um revisor validou manualmente sem uma questão nova) \| SUGESTAO_IA (um classificador de IA propôs, ainda não confirmado por humano) |
| fonte | Referência à origem: `exam_catalog_id` + `question_id`, ou `reviewer_id`, ou `model_id + model_version` |
| peso | Nem toda evidência vale o mesmo (ver 2.3) |
| timestamp | Quando essa evidência foi registrada |

### 1.3 `evidenceCount` como agregado

`evidenceCount` no registro de Discipline/Topic/Subtopic/Rule **não é** um
campo editado manualmente — é um contador derivado, recalculado toda vez
que uma nova Evidência é anexada (ou removida, no caso raro de uma prova
ser invalidada/despublicada). Isso garante que o número sempre reflita a
realidade do banco de evidências, e nunca fique dessincronizado por edição
manual esquecida.

## 2. Sistema de Confiança

### 2.1 Por que confiança não é um número fixo atribuído por humano

No V1, se um humano dissesse "essa regra tem 95% de confiança", esse número
ficava congelado para sempre. Em V2, `confidence` é **recalculado**
conforme evidências chegam — é uma nota viva, não uma opinião fixada.

### 2.2 Fórmula conceitual (não é código, é o racional)

```
confidence(registro) =
    peso_prior_editorial   × confianca_do_curador_humano
  + peso_evidencia_real    × (confirmacoes / (confirmacoes + contradicoes))
  + peso_recencia          × fator_decaimento(dias_desde_ultima_validacao)
  + peso_autoridade_fonte  × media(peso_da_fonte de cada evidência)
```

Onde:
- **peso_prior_editorial** é alto quando `evidenceCount = 0` (é só o que um
  curador humano/dossiê disse deveria ser — como tudo que veio das Fases
  1–2 para Enfermagem) e cai proporcionalmente conforme evidência real
  aumenta;
- **fator_decaimento** reduz lentamente a confiança de registros que não
  são revalidados há muito tempo, forçando revisão periódica mesmo sem
  evidência contraditória nova (evita que "confiança alta de 2026" fique
  carimbada para sempre em 2031 sem checagem);
- **peso_autoridade_fonte** dá mais peso a uma confirmação de revisor
  humano do que a uma sugestão de IA não revisada, e mais peso a uma prova
  homologada (`verified = true` em `exam_catalog`) do que a uma prova ainda
  em rascunho.

### 2.3 Peso por tipo de fonte (ordem de autoridade, maior → menor)

1. Revisão humana especializada confirmada em prova homologada
   (`exam_catalog.verified = true`).
2. Revisão humana em prova não homologada.
3. Extração automática de prova real ainda não revisada por humano.
4. Sugestão de classificador de IA com alta confiança do próprio modelo.
5. Prior puramente editorial (dossiê de pesquisa, sem nenhuma prova real
   ainda) — é o estado de tudo que foi produzido nas Fases 1 e 2.

### 2.4 Limiares de ação (o que a Engine faz com o número)

| Faixa de confidence | Ação da Engine |
|---|---|
| ≥ 90 | Classificação automática aceita sem revisão |
| 70–89 | Aceita, mas marcada para amostragem de auditoria periódica |
| 40–69 | Vai para fila `EM_REVISAO` antes de publicar |
| < 40 | Bloqueada para uso em produção; tratada como hipótese, não fato |

## 3. Sistema de Evolução

### 3.1 O problema que resolve

Conteúdo editorial puramente curado (como os 26 dossiês de Enfermagem)
começa **correto na intenção, mas não calibrado por realidade**. O Sistema
de Evolução é o mecanismo formal pelo qual esse prior editorial vai sendo
substituído por conhecimento calibrado por evidência, sem nunca perder
rastreabilidade (ver versionamento, arquivo 03).

### 3.2 Gatilhos de evolução

| Gatilho | Efeito |
|---|---|
| Nova prova importada e revisada | Gera Evidências → recalcula `confidence`/`evidenceCount` das regras/tópicos tocados |
| Contradição acumulada (≥ N confirmações discordantes de uma regra) | Abre um `AmbiguousCase` automaticamente, mesmo que nenhum humano tenha notado o conflito ainda |
| Confiança cai abaixo do limiar por decaimento | Reabre o registro para `EM_REVISAO` |
| Duas entidades quase-idênticas detectadas (ex.: a duplicidade de SAE da Fase 1) | Sugestão automática de merge, com `supersededBy` proposto, aguardando confirmação humana |
| Curador humano confirma/rejeita uma sugestão de IA | Vira Evidência tipo `REVISAO_HUMANA`, ajusta confiança do modelo de IA responsável (meta-evolução: a Engine também aprende a confiar mais ou menos em cada fonte de IA ao longo do tempo) |

### 3.3 Detecção de duplicidade/conflito estrutural (generalização de um bug real já encontrado)

Na Fase 1, a pesquisa encontrou "Sistematização da Assistência de
Enfermagem (SAE)" duplicada em `taxonomy.json` (como `topic` dentro de
Fundamentos e como `subject` isolado). Isso não foi um evento único de
Enfermagem — é uma classe de problema que **vai se repetir em qualquer
curso** conforme o conteúdo cresce organicamente. V2 formaliza a detecção
como uma rotina de evolução, não como um achado manual de auditoria:

- comparar nomes/slugs muito similares entre registros do mesmo curso;
- comparar conjuntos de `Keyword` com alta sobreposição entre dois
  `Subtopic` diferentes;
- sinalizar candidatos a merge com uma pontuação de similaridade, sempre
  como sugestão — o merge automático nunca é aplicado sem confirmação
  humana (`status` fica `PROPOSTO`, nunca pula direto para `MESCLADO`).

### 3.4 O dataset de Enfermagem, hoje, no vocabulário do Sistema de Evolução

Todo conteúdo produzido nas Fases 1–2 (26 disciplinas, ~114 assuntos, ~456
subassuntos, 62 regras, 38 casos ambíguos) entra na Engine V2 com:

- `origin = EDITORIAL_PRIOR`
- `confidence` inicial moderada (prior editorial bem pesquisado, mas sem
  evidência real ainda — sugestão: 60–75, nunca 90+, porque 90+ deveria
  ser reservado para o que já foi confirmado por prova real)
- `evidenceCount = 0` em quase tudo, exceto o que já foi cruzado com a
  única prova homologada do Acervo até o momento (`ebserh-2025`,
  `verified = true` em `exam_catalog`)
- `createdFrom` apontando para os dossiês de origem (ex.: `"docs/editorial/
  02a-fundamentos-biosseguranca-seguranca-paciente.md"`)

Isso é o estado esperado e correto para o primeiro curso carregado — a
expectativa explícita é que `confidence` suba organicamente conforme mais
provas de Enfermagem forem processadas pelo pipeline de `docs/work/`.
