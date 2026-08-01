# TEMPLATE OFICIAL DE PRODUÇÃO — SimulaPro

**Versão:** 1.0
**Status:** Congelado — uso obrigatório em todas as provas futuras
**Origem:** Consolidação do processo executado em EBSERH Nacional 2016 — Enfermeiro Saúde Mental — Instituto AOCP (SPRINT P-001, P-002 e auditoria de checklist)
**Escopo:** Pipeline humano de transcrição de provas reais (edital → prova → gabarito → banco de questões). Não se aplica ao Engine Editorial IA.

---

## 1. Pré-Produção

Nenhuma prova entra em produção sem este checklist 100% resolvido (aprovado ou formalmente justificado).

```
□ edital localizado
□ prova localizada
□ gabarito localizado
□ gabarito definitivo confirmado
   ou
□ justificativa documental (ver Nível de Validação)
□ retificações verificadas
□ anulações verificadas
□ classificação do nível de validação (A/B/C)
```

### Classificação do Nível de Validação

| Nível | Critério | Ação |
|---|---|---|
| **A** | Gabarito definitivo localizado e conteúdo integralmente obtido | Produção segue sem ressalva |
| **B** | Existência do gabarito definitivo confirmada por fonte oficial, mas conteúdo específico irrecuperável nas fontes acessíveis (ex.: site da banca fora do ar, Wayback Machine bloqueado) | Produção autorizada com o gabarito preliminar como base; pendência registrada para reconciliação futura |
| **C** | Apenas gabarito preliminar localizado, sem confirmação oficial de que um gabarito definitivo tenha existido | Produção autorizada apenas após auditoria técnica reforçada (Seção 3) não encontrar nenhuma inconsistência interna |

Referência de caso real — EBSERH 2016/Enfermeiro-Saúde Mental: **Nível B** (Edital nº 30 – EBSERH – Área Assistencial, 04/03/2016, Art. 2º, confirma a existência do Gabarito Definitivo; o arquivo em si nunca foi arquivado fora do site da banca, hoje fora do ar).

### Ordem obrigatória de busca por documentação oficial/arquivada

1. Wayback Machine
2. Diário Oficial da União
3. Portal oficial do órgão/empresa (ex.: `gov.br/<orgao>`)
4. Portal da unidade/hospital/instituição específica
5. Comunicados oficiais da banca organizadora
6. Resultado definitivo do concurso

---

## 2. Produção

A extração é sempre dividida em blocos de 10 questões.

```
Bloco N
Questões (N*10-9)–(N*10)
   ↓
Extração
   ↓
Classificação
   ↓
Revisão
   ↓
CSV
   ↓
Homologação
   ↓
Publicado
```

Repetir a sequência completa para cada bloco até cobrir 100% da prova. Nenhum bloco avança para o próximo enquanto o anterior não estiver homologado.

---

## 3. Auditoria

Checklist obrigatório, aplicado a cada questão antes da homologação do bloco.

```
□ alternativa correta
□ fundamentação técnica
□ legislação vigente
□ classificação editorial
□ imagens
□ tabelas
□ notas editoriais
```

Notas de execução:
- **Alternativa correta**: validação deve ser feita por conhecimento técnico independente do gabarito, não apenas por cópia — o gabarito é ponto de partida, não autoridade final.
- **Legislação vigente**: toda base legal citada na questão deve ser conferida quanto a revogação ou consolidação posterior. Se a lei/portaria citada foi consolidada mas o conteúdo permanece idêntico, registrar nota editorial em vez de alterar a questão.
- **Imagens**: toda questão com dependência gráfica (foto, tirinha, gráfico, tabela como imagem) deve ter o arquivo de imagem extraído e vinculado antes da homologação.
- **Notas editoriais**: qualquer achado que não bloqueia a homologação, mas merece registro (ex.: citação de lei desatualizada, ambiguidade defensável), deve ser documentado aqui — não deve virar bloqueio nem ser descartado silenciosamente.

---

## 4. Homologação

| Decisão | Critério |
|---|---|
| **Aprovar** | Todos os 7 itens do checklist de auditoria (Seção 3) passaram sem ressalva bloqueante |
| **Reprovar** | Questão tecnicamente incorreta, gabarito indefensável, ou conteúdo inutilizável (ex.: enunciado incompleto, imagem irrecuperável essencial ao sentido) |
| **Reenviar para revisão** | Achado que exige correção pontual mas não descarte (ex.: erro de classificação editorial, nota de legislação a ajustar, imagem pendente de extração) |

---

## 5. Publicação

Critérios para uma questão/prova entrar no banco de produção:

- Bloco correspondente 100% homologado
- CSV validado pela Matriz de Validação editorial
- Nenhuma pendência de "Reenviar para revisão" em aberto

### Fluxo de status

```
EM PRODUÇÃO
   ↓
EM REVISÃO
   ↓
HOMOLOGADA
   ↓
PUBLICADA
```

Uma prova só avança de status na ordem acima. Não há publicação parcial de prova com blocos ainda em produção.

---

## 6. Registro Histórico

Modelo único, preenchido para toda prova processada.

```
Prova
   ↓
Banca
   ↓
Ano
   ↓
Cargo
   ↓
Questões
   ↓
Questões aproveitadas
   ↓
Questões descartadas
   ↓
Tempo gasto
   ↓
Problemas encontrados
   ↓
Lições aprendidas
   ↓
Responsável
```

### Exemplo de referência (EBSERH Nacional 2016 — Enfermeiro Saúde Mental)

```
Prova: Concurso Público 09/2015 – EBSERH/Concurso Nacional, Edital nº 03 – Área Assistencial
Banca: Instituto AOCP
Ano: 2016
Cargo: Enfermeiro - Saúde Mental
Questões: 50
Questões aproveitadas: 50
Questões descartadas: 0
Tempo gasto: [preencher ao concluir produção]
Problemas encontrados:
  - Fonte oficial da banca (institutoaocp.org.br) fora do ar
  - Wayback Machine inacessível pela ferramenta de pesquisa
  - Gabarito definitivo confirmado oficialmente, mas conteúdo específico irrecuperável (Nível B)
Lições aprendidas:
  - Portal oficial do órgão (gov.br/<orgao>) pode preservar resultado/homologação mesmo quando o site da banca cai
  - Sempre reindexar manualmente o gabarito posição a posição antes de fechar auditoria (erro de indexação já gerou 2 falsos alarmes nesta prova)
  - Citação de legislação consolidada não é erro de conteúdo — registrar como nota editorial, não como bloqueio
Responsável: [preencher]
```

---

## 7. Indicadores

Métricas a manter atualizadas por prova processada:

- Tempo médio por prova
- Tempo médio por bloco
- Tempo médio por questão
- Questões descartadas (total e % sobre o total processado)
- Questões homologadas (total e % sobre o total processado)
- Taxa de retrabalho (questões que voltaram de "Reenviar para revisão" mais de uma vez)
