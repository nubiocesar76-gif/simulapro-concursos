# DOSSIÊ MESTRE — SAE — INTELIGÊNCIA EDITORIAL V1

## Objetivo

Este documento **complementa** — e não substitui, reescreve ou resume — o `DOSSIE_MESTRE_SAE_V1.md`. Seu único consumidor pretendido é o Motor Editorial: incidência histórica por assunto, perfil de banca, pegadinhas conhecidas, matriz de cobertura, relações entre assuntos e checklist de aprovação. Nenhuma questão, alternativa ou simulado é produzido aqui.

## Nota metodológica desta pesquisa

Toda a Parte 1 e a Parte 2 foram construídas a partir de **dados reais do banco de produção do SimulaPro** (tabela `questions`, disciplina "Sistematização da Assistência de Enfermagem (SAE)" — 8 questões — mais o tópico "Processo de Enfermagem", hoje registrado sob a disciplina "Fundamentos de Enfermagem" por divergência de taxonomia já documentada em `docs/work/motor-editorial-sprint-7.1/` — 16 questões; total de **24 questões reais** examinadas diretamente, enunciado e alternativas completos, não amostra por resumo). Onde a evidência é insuficiente para uma banca solicitada, isso é declarado explicitamente, conforme exigido — nenhuma característica de banca foi inventada.

Esta é uma amostra real, mas **pequena**. As classificações de frequência (Parte 1) e os perfis de banca (Parte 2) devem ser lidos como o retrato inicial mais honesto possível a partir do que existe hoje no acervo — não como estatística consolidada de grande amostra. Any novo lote de questões homologadas para esta disciplina deve alimentar uma revisão futura deste documento.

---

# PARTE 1 — INCIDÊNCIA EM CONCURSOS

Classificação por assunto, combinando três fontes: (a) contagem real de questões no acervo do SimulaPro por assunto; (b) o indicador `frequency_percent`/`priority` já atribuído pelo Motor Editorial à disciplina SAE em `editorial_disciplines` (56% / ALTA); (c) relevância estrutural do assunto dentro do Processo de Enfermagem, conforme o Dossiê Mestre.

| Assunto | Classificação | Justificativa |
|---|---|---|
| As 5 Etapas do Processo de Enfermagem (Coleta, Diagnóstico, Planejamento, Implementação, Avaliação) | **Muito Alta** | É o núcleo estrutural de toda a disciplina (Capítulos 3-9 do Dossiê Mestre); concentra a maior parte da evidência real (5 das 8 questões da disciplina SAE + as 16 questões do tópico correlato "Processo de Enfermagem"), com todas as 5 bancas observadas cobrando este tema. |
| Base Normativa e Conceitual (SAE × Processo de Enfermagem × Resolução COFEN 358/2009) | **Muito Alta** | Presente em praticamente toda questão observada, mesmo quando o foco nominal é outro assunto — as bancas costumam ancorar a questão citando a Resolução 358/2009 diretamente no enunciado (Centro de Seleção UFG, IBFC), tornando este assunto transversal, não isolado. |
| Taxonomias e Sistemas de Classificação (NANDA-I, NIC, NOC — relação entre as três) | **Alta** | Evidência real direta (CEBRASPE, 2 questões) mais o indicador estrutural do Dossiê Mestre (Capítulos 10-13); é onde bancas mais exploram pegadinha conceitual (ver Parte 3). |
| Diagnóstico de Enfermagem (formulação, tipos, distinção do diagnóstico médico) | **Alta** | Evidência real direta (AOCP, caso clínico aplicado; COSEAC, 2 questões); é o único ato entre os cinco privativo do Enfermeiro por lei, o que historicamente aumenta seu peso editorial em provas de Enfermeiro. |
| NIC — Classificação de Intervenções | **Média** | 1 questão real direta (FGV, 2024) mais presença indireta dentro de "Taxonomias". Amostra pequena, mas tema estruturalmente relevante (Capítulo 12 do Dossiê Mestre). |
| Registro e Documentação de Enfermagem | **Média** | Zero questões diretas no acervo atual (tópico com 0 no levantamento de conteúdo anterior), mas o tema é normativamente obrigatório (Resolução 429/2012) e recorrente na literatura técnica — classificado Média, não Baixa, por relevância normativa apesar da ausência de evidência direta no acervo. |
| Responsabilidade Profissional (competências privativas do Enfermeiro vs. Técnico/Auxiliar) | **Média** | Nenhuma questão do acervo atual está tipificada isoladamente neste assunto, mas é tema clássico de prova de Enfermeiro em geral (fora desta disciplina especificamente) e aparece embutido em questões de diagnóstico (ver AOCP). |
| NOC — Classificação de Resultados | **Média** | Evidência real indireta (VUNESP: "avaliação de processo" na 5ª etapa, tangencia NOC sem citá-lo nominalmente). Nenhuma questão do acervo cita "NOC" explicitamente — classificado Média por relevância estrutural, não por volume observado. |
| CIPE / ICNP | **Baixa** | Nenhuma evidência real no acervo atual; o próprio Dossiê Mestre (Capítulo 14) já registra que a NANDA-I é mais difundida que a CIPE nas provas de concurso observadas neste projeto. |
| Aspectos Éticos aplicados especificamente à SAE (infração por não realização/registro fraudulento) | **Baixa** | Nenhuma evidência direta no acervo atual sob esta disciplina; o tema ético geral (CEPE) é mais tipicamente cobrado como disciplina própria ("Ética e Legislação em Enfermagem") do que dentro de SAE — ver Parte 5 quanto à relação entre disciplinas. |

**Achado editorial prioritário desta parte:** duas questões reais de 2025 (FGV, concurso EBSERH Assistencial Edital 3/2024) citam explicitamente a **Resolução COFEN nº 736/2024** para as etapas de Planejamento e Avaliação/Evolução de Enfermagem — uma norma posterior ao fechamento do Dossiê Mestre, cuja existência o Capítulo 21 daquele documento já havia sinalizado como incerteza deliberada, sem cravar número. Esta é agora uma evidência real e direta, não uma suposição: **recomenda-se verificação prioritária desta resolução no portal do COFEN antes de qualquer produção em escala sobre Planejamento (Cap. 7) e Avaliação (Cap. 9)**, já que ela pode ter atualizado a redação/escopo dessas etapas em relação ao texto de 2009 descrito no Dossiê Mestre. Esta observação não altera o Dossiê Mestre (fora do escopo desta fase) — é registrada aqui como achado editorial acionável.

---

# PARTE 2 — PERFIL DAS BANCAS

Para cada banca solicitada: evidência real observada nesta disciplina (quando existente) e, quando aplicável, referência cruzada aos Dossiês de Banca já congelados deste projeto (`DOSSIE_FGV_V1.md`, `DOSSIE_IBFC_V1.md`) para traços gerais de estilo não específicos desta disciplina.

### IBFC
- **Evidência real nesta disciplina:** 2 questões (2013, 2019), ambas sobre as 5 etapas do Processo de Enfermagem.
- **Assuntos preferidos:** Processo de Enfermagem / Resolução COFEN 358/2009, citada nominalmente no enunciado nas duas ocorrências observadas.
- **Estilo de cobrança:** julgamento composto de afirmativas numeradas (I, II, III, IV) com alternativas de combinação ("Apenas as afirmativas I e II estão corretas" etc.) e, na ocorrência de 2013, comando invertido ("assinale a alternativa **incorreta**"). Ambos os padrões são consistentes com o repertório de estratégias já catalogado no Motor Editorial para esta banca (`content-selector.server.ts`).
- **Nível médio de dificuldade:** não é possível classificar com confiança a partir de apenas 2 questões (campo `difficulty` não preenchido em nenhuma delas no acervo) — evidência insuficiente.
- **Predominância conceitual/prática/clínica:** conceitual/normativa nas duas ocorrências observadas (cobrança direta do texto da Resolução 358/2009).
- **Erros recorrentes explorados:** comando negativo ("incorreta") como armadilha de leitura — ver Parte 3.
- **Diferenças em relação às demais:** ao contrário de FGV e do Centro de Seleção da UFG (que também citam a resolução nominalmente), o IBFC observado usa julgamento de afirmativas compostas em vez de completar uma frase única — traço já registrado de forma geral no `DOSSIE_IBFC_V1.md` (banca institucionalmente conhecida por instruções detalhadas e formato de 5 alternativas).

### FGV
- **Evidência real nesta disciplina:** a banca com maior volume observado — 11 questões (9 sob "Processo de Enfermagem"/Fundamentos + 2 sob SAE), anos 2023-2025.
- **Assuntos preferidos:** Processo de Enfermagem em geral, com destaque real para Planejamento e Avaliação/Evolução (as duas questões de 2025 que citam a Resolução 736/2024) e Intervenções de Enfermagem (NIC).
- **Estilo de cobrança:** completar uma afirmação com base em enunciado técnico/normativo direto ("De acordo com a Resolução Cofen nº 736/2024, [...] é"), sem necessariamente usar julgamento de afirmativas em lista — estilo mais direto que o do IBFC nas ocorrências observadas.
- **Nível médio de dificuldade:** não preenchido no acervo (`difficulty` nulo em todas as ocorrências) — evidência insuficiente para classificação numérica; qualitativamente, a cobrança direta de número de resolução recente (736/2024) sugere exigência de atualização normativa fina, não apenas conceito geral.
- **Predominância conceitual/prática/clínica:** predominantemente normativa/conceitual nas ocorrências observadas nesta disciplina — diferente do padrão mais aplicado/clínico que a FGV demonstra em outras disciplinas (ver `DOSSIE_FGV_V1.md` para o perfil geral da banca, não específico de SAE).
- **Erros recorrentes explorados:** cobrança de norma muito recente (736/2024) é, por si, um mecanismo de seleção de candidatos desatualizados — ver Parte 3.
- **Diferenças em relação às demais:** é a única banca, entre as observadas, com evidência real de citar uma resolução de 2024 — indício de atualização normativa mais agressiva que as demais bancas observadas nesta amostra.

### CEBRASPE
- **Evidência real nesta disciplina:** 2 questões, ambas do mesmo concurso (EBSERH Assistencial Edital 3/2018), sobre Taxonomias e sobre Etapas do Processo de Enfermagem.
- **Assuntos preferidos:** relação entre NANDA-I/NIC/NOC; raciocínio diagnóstico (erros de raciocínio do enfermeiro).
- **Estilo de cobrança:** formato de item julgável isolado (Certo/Errado), consistente com o formato institucionalmente conhecido da banca — nas duas ocorrências observadas, o enunciado é uma afirmação autocontida a ser julgada, não uma pergunta de múltipla escolha com 5 alternativas.
- **Nível médio de dificuldade:** não preenchido no acervo — evidência insuficiente.
- **Predominância conceitual/prática/clínica:** conceitual nas duas ocorrências observadas.
- **Erros recorrentes explorados:** afirmação plausível, mas tecnicamente errada por generalização indevida — a questão real observada afirma que NANDA/NIC/NOC "foram planejadas para serem utilizadas apenas individualmente", quando a lógica técnica correta é a interligação (NNN Linkage, Dossiê Mestre Cap. 11-13); é um exemplo direto e real de pegadinha por inversão conceitual (ver Parte 3).
- **Diferenças em relação às demais:** único formato Certo/Errado entre as bancas com evidência real nesta disciplina; as demais (IBFC, FGV, VUNESP, AOCP) usam alternativas de A a E.

### VUNESP
- **Evidência real nesta disciplina:** 1 questão (2023), sobre a 5ª etapa (Avaliação).
- **Assuntos preferidos:** Avaliação de Enfermagem, especificamente a distinção entre "avaliação de processo" e "avaliação de resultado" — refinamento conceitual que o próprio Dossiê Mestre (Capítulo 9) não detalha explicitamente; registrado aqui como observação para eventual revisão futura do Dossiê Mestre, fora do escopo desta fase.
- **Estilo de cobrança:** completar frase técnica com 5 alternativas (A-E), cada uma descrevendo um cenário distinto a ser classificado corretamente segundo a definição técnica.
- **Nível médio de dificuldade:** evidência insuficiente (n=1, `difficulty` nulo).
- **Predominância conceitual/prática/clínica:** conceitual, mas com granularidade fina (subdistinção dentro de uma única etapa) — sugere, com uma única observação, um estilo potencialmente mais detalhista que o das demais bancas nesta disciplina; **classificado como hipótese, não conclusão**, por amostra de 1 questão.
- **Erros recorrentes explorados:** confundir avaliação de processo (meios/recursos empregados) com avaliação de resultado (mudança obtida no paciente) — ver Parte 3.
- **Diferenças em relação às demais:** é a única banca, na amostra observada, cuja questão exige subclassificação dentro de uma etapa em vez de reconhecimento da etapa como um todo.

### AOCP (Instituto AOCP)
- **Evidência real nesta disciplina:** 1 questão (2020), caso clínico de Diagnóstico de Enfermagem.
- **Assuntos preferidos:** Diagnóstico de Enfermagem aplicado a caso clínico (DPOC), pedindo classificação de foco/domínio de intervenção associado a um diagnóstico dado.
- **Estilo de cobrança:** cenário clínico completo (paciente, idade, quadro, diagnóstico de enfermagem já formulado no enunciado) seguido de pergunta de classificação técnica — a única, entre as ocorrências observadas nesta disciplina, ancorada em caso clínico completo em vez de definição normativa direta.
- **Nível médio de dificuldade:** evidência insuficiente (n=1, `difficulty` nulo); qualitativamente, exige aplicação clínica, não só memorização — indício de dificuldade mais alta que itens puramente conceituais, mas não confirmável com uma única observação.
- **Predominância conceitual/prática/clínica:** **clínica/aplicada** — única banca, na amostra observada nesta disciplina, com esse padrão.
- **Erros recorrentes explorados:** confundir o domínio/classe de intervenção correspondente ao diagnóstico apresentado — ver Parte 3.
- **Diferenças em relação às demais:** é a única com estilo clínico-aplicado nesta disciplina; todas as demais bancas observadas usam formulação normativa/conceitual direta.

### IDECAN, CONSULPLAN (Instituto Consulplan), FUNDEP, AVÁLIA, FAFIPA
**Evidência insuficiente — declaração explícita.** Nenhuma questão desta disciplina (SAE ou o tópico correlato "Processo de Enfermagem") está registrada no acervo real do SimulaPro para nenhuma destas cinco bancas. IDECAN e Fundação FAFIPA sequer têm qualquer questão em **qualquer disciplina** no acervo atual (confirmado em auditoria de conteúdo anterior). Instituto Consulplan tem presença no acervo (47 questões em outras disciplinas), mas nenhuma nesta. Não há registro de "FUNDEP" nem "AVÁLIA" como bancas cadastradas no acervo do SimulaPro sob esses nomes exatos. **Nenhuma característica de estilo é atribuída a estas cinco bancas nesta disciplina** — qualquer perfil futuro para elas exige aquisição de provas reais (mesmo processo já usado para construir os Dossiês IBFC/FGV existentes), não inferência.

---

# PARTE 3 — PEGADINHAS

### Conceitos frequentemente confundidos
- **SAE × Processo de Enfermagem** — tratar como sinônimos (Dossiê Mestre, Cap. 2 e 20).
- **Diagnóstico de enfermagem × diagnóstico médico** — redigir "diagnóstico" que é, na verdade, uma condição clínica médica (Dossiê Mestre, Cap. 6, 11, 20; evidência real: caso AOCP exige justamente essa distinção).
- **Avaliação de processo × avaliação de resultado** — dentro da 5ª etapa, confundir "os meios empregados garantiram qualidade" (processo) com "o paciente mudou de estado" (resultado) — achado real desta parte, evidência VUNESP (Parte 2).
- **NANDA-I/NIC/NOC usadas isoladamente × interligadas (NNN Linkage)** — erro real e documentado: uma questão CEBRASPE observada afirma que as três "foram planejadas para serem utilizadas apenas individualmente", contrariando a lógica de interligação diagnóstico→intervenção→resultado (Dossiê Mestre, Cap. 11-13).

### Inversões de etapas
- Apresentar a sequência das 5 etapas fora de ordem ou com etapa faltante/trocada (ex.: questão COSEAC observada usa alternativas com sequências alternativas de etapas, testando se o candidato reconhece a sequência oficial: Coleta → Diagnóstico → Planejamento → Implementação → Avaliação).
- Nomear a etapa de Implementação como "Execução" ou "Prescrição" isoladamente sem reconhecer que a nomenclatura oficial COFEN é "Implementação" (Dossiê Mestre, Cap. 8).
- Tratar a sequência como estritamente linear/final, ignorando o caráter cíclico e retroalimentador (Dossiê Mestre, Cap. 3 e 9).

### Terminologias semelhantes
- **"Avaliação" (5ª etapa do PE)** × **"avaliação" no sentido de exame físico** (que pertence à Coleta de Dados) — ambiguidade de linguagem natural já registrada no Dossiê Mestre (Cap. 9).
- **"Histórico de Enfermagem"** × **"Coleta de Dados"** — são o mesmo conceito com dois nomes (Dossiê Mestre, Cap. 5); tratar como etapas distintas é erro.
- **"Implementação"** × **"Intervenção" (NIC)** — a Implementação é a etapa do PE (Cap. 8); "Intervenção" é o rótulo padronizado do sistema NIC (Cap. 12) executado dentro dela — proximidade lexical que gera confusão.
- **"Diagnóstico de Enfermagem"** × **"Diagnóstico médico"** × **"Diagnóstico de Enfermagem do tipo Risco"** × **"...do tipo Síndrome"** — os quatro tipos formais NANDA-I (Real/Problema, Risco, Promoção da Saúde, Síndrome) são frequentemente confundidos entre si, sobretudo Risco × Síndrome.

### Erros clássicos de interpretação
- Comando negativo em enunciado ("assinale a alternativa **incorreta**") ignorado por leitura apressada — padrão real observado no IBFC (Parte 2).
- Presumir que uma taxonomia (tipicamente NANDA-I) é obrigatória por norma brasileira, quando a escolha do sistema é discricionária (Dossiê Mestre, Cap. 10 e 20).
- Presumir que SAE é exigência exclusivamente hospitalar (desatualizado desde a Resolução 358/2009 — Dossiê Mestre, Cap. 1).
- Ignorar atualização normativa recente (Resolução COFEN nº 736/2024, achado real da Parte 1) e responder com base apenas no texto de 2009.

### Alternativas incorretas frequentemente utilizadas pelas bancas (padrões observados)
- Trocar a ordem ou o nome de uma das cinco etapas dentro de uma alternativa que, à primeira leitura, parece completa e correta.
- Atribuir a uma categoria profissional não habilitada (Técnico/Auxiliar) a prerrogativa de diagnosticar ou planejar (Dossiê Mestre, Cap. 16) — alternativa plausível para quem não domina a distinção de competências.
- Definição de uma etapa do PE emprestando, de forma sutilmente errada, a definição de outra etapa (ex.: descrever "Avaliação" usando linguagem que na verdade define "Coleta de Dados").
- Afirmar isolamento entre NANDA/NIC/NOC (padrão CEBRASPE real, documentado acima) em vez da interligação correta.

---

# PARTE 4 — MATRIZ DE COBERTURA

Prioridade e peso relativo derivados diretamente da classificação de incidência da Parte 1. Quantidade inicial sugerida segue o mesmo padrão de lote já validado operacionalmente neste projeto (lotes de 10 questões, Sprint 7.1/7.2) distribuído proporcionalmente ao peso.

| Macrotema | Assunto | Prioridade | Qtd. inicial sugerida | Peso relativo |
|---|---|---|---|---|
| Processo de Enfermagem | As 5 Etapas (Coleta, Diagnóstico, Planejamento, Implementação, Avaliação) | Muito Alta | 10 | 25% |
| Processo de Enfermagem | Base Normativa e Conceitual (SAE, Resolução 358/2009 e atualizações — inclui verificação da Resolução 736/2024) | Muito Alta | 8 | 20% |
| Linguagens Padronizadas | Taxonomias e Sistemas de Classificação (relação NANDA-NIC-NOC) | Alta | 6 | 15% |
| Processo de Enfermagem | Diagnóstico de Enfermagem (formulação, tipos, distinção do diagnóstico médico) | Alta | 6 | 15% |
| Linguagens Padronizadas | NIC — Classificação de Intervenções | Média | 4 | 10% |
| Registro e Responsabilidade | Registro e Documentação de Enfermagem | Média | 3 | 7,5% |
| Registro e Responsabilidade | Responsabilidade Profissional (competências privativas) | Média | 2 | 5% |
| Linguagens Padronizadas | NOC — Classificação de Resultados | Média | 2 | 5% |
| Linguagens Padronizadas | CIPE / ICNP | Baixa | 1 | 2,5% |
| **Total** | | | **42** | **100%** |

Nota: a soma (42) não é um lote único — é a base de cobertura completa recomendada para a disciplina ao longo de múltiplos ciclos do Motor Editorial, não uma meta de um único batch.

---

# PARTE 5 — RELAÇÕES ENTRE ASSUNTOS

Cadeia estrutural principal (a mesma lógica do Dossiê Mestre, Capítulos 3-17, mapeada para uso editorial):

```
Base Normativa (SAE / Resolução COFEN 358/2009 [+ verificar 736/2024])
        ↓
Processo de Enfermagem (visão geral, natureza cíclica)
        ↓
Coleta de Dados  →  Diagnóstico de Enfermagem  →  NANDA-I
        ↓                                              ↓
   (retroalimenta)                              Planejamento  →  NIC
        ↑                                              ↓
   Avaliação  ←────────────────────────────────  Implementação
        ↓
      NOC (mensuração do resultado avaliado)
        ↓
  Registro e Documentação
        ↓
  Responsabilidade Profissional  →  Aspectos Éticos
        ↓
  Segurança do Paciente (disciplina correlata, fora do escopo direto deste dossiê)
```

**Assuntos que costumam aparecer juntos na mesma questão (evidência real observada):**
- **Base Normativa + Etapas do PE**, quase sempre juntos — a citação da Resolução COFEN (358/2009 ou 736/2024) aparece no mesmo enunciado que descreve ou testa uma etapa específica (padrão observado em FGV e Centro de Seleção UFG).
- **Diagnóstico de Enfermagem + NIC/NOC**, via caso clínico — o diagnóstico é dado ou pedido, e a pergunta real recai sobre a intervenção/classificação associada (padrão observado em AOCP).
- **Taxonomias (NANDA/NIC/NOC) entre si**, testando a relação de interligação (NNN Linkage) como bloco único, não cada taxonomia isoladamente (padrão observado em CEBRASPE).
- **Etapa do PE + subclassificação interna da etapa** (ex.: tipo de avaliação dentro da Avaliação) — padrão observado em VUNESP, indicando que bancas podem testar granularidade abaixo do nível de etapa.

**Relações mapeadas por dedução estrutural do Dossiê Mestre, sem evidência direta ainda no acervo** (registradas para uso futuro, não para tratamento como padrão confirmado):
- Registro de Enfermagem + Aspectos Éticos (infração por ausência/fraude de registro).
- Responsabilidade Profissional + Implementação (quem pode executar o quê).
- CIPE + Saúde Coletiva/Atenção Primária (ligação histórica via CIPESC, Dossiê Mestre Cap. 14).

---

# PARTE 6 — CHECKLIST EDITORIAL

Checklist a ser aplicado antes da aprovação definitiva (homologação humana) de qualquer questão produzida para esta disciplina. Não substitui o Validator nem o Auditor Editorial já existentes no Motor Editorial — é um checklist de conteúdo específico da disciplina, complementar aos critérios mecânicos e editoriais já em produção.

1. **Atualização normativa** — a questão reflete o texto vigente mais recente conhecido? Se a questão trata de Planejamento ou Avaliação/Evolução, a Resolução COFEN nº 736/2024 (achado da Parte 1) foi verificada e considerada, e não apenas a Resolução 358/2009?
2. **Coerência técnica** — a questão respeita a distinção SAE × Processo de Enfermagem × teoria de enfermagem (Dossiê Mestre, Cap. 2)? Nenhuma etapa do PE está definida com linguagem de outra etapa?
3. **Aderência às referências oficiais** — toda afirmação normativa citada na questão (número de lei, decreto ou resolução) corresponde exatamente ao que consta no Dossiê Mestre ou foi verificada diretamente na fonte primária (COFEN, Ministério da Saúde) quando não coberta pelo Dossiê Mestre?
4. **Existência de apenas uma alternativa correta** — todas as demais alternativas são objetivamente incorretas, sem ambiguidade nem sobreposição parcial de correção?
5. **Compatibilidade com o perfil da banca-alvo** — o formato (A-E, Certo/Errado, julgamento de afirmativas), o nível de citação normativa direta e o estilo (conceitual vs. aplicado/clínico) são compatíveis com o perfil real da banca descrito na Parte 2? Se a banca não tem perfil suficiente estabelecido (IDECAN, Consulplan, FUNDEP, AVÁLIA, FAFIPA), isso foi levado em conta com maior cautela editorial?
6. **Clareza textual** — o enunciado é compreensível numa única leitura, sem duplo sentido não intencional?
7. **Ausência de ambiguidades** — nenhum termo técnico (ex.: "avaliação", "implementação", "diagnóstico") é usado de forma que possa ser lido em mais de um sentido válido dentro da disciplina (ver Parte 3, terminologias semelhantes)?
8. **Nível de dificuldade adequado** — o nível declarado (Fácil/Média/Difícil) corresponde de fato à exigência cognitiva real da questão (mera recordação vs. aplicação vs. julgamento composto)?
9. **Inexistência de conflito entre normas** — se a questão referencia mais de uma norma (ex.: 358/2009 e 429/2012, ou 358/2009 e uma futura atualização de 2024), as normas citadas não se contradizem entre si na forma como foram usadas no enunciado?
10. **Verificação de pegadinha intencional vs. erro editorial não intencional** — se a questão usa uma inversão, comando negativo ou confusão terminológica proposital (Parte 3), isso está claramente sustentado por uma diferença técnica real — não por ambiguidade genuína do próprio enunciado, o que seria falha editorial, não pegadinha legítima.

---

## Encerramento desta fase

Este documento cobre as 6 partes solicitadas, fundamentadas em 24 questões reais do acervo do SimulaPro (não em suposição), com declaração explícita de evidência insuficiente para 5 das 10 bancas solicitadas. Nenhuma questão, alternativa, simulado ou material didático foi produzido. O achado sobre a Resolução COFEN nº 736/2024 é o ponto de atenção prioritário para qualquer produção editorial futura desta disciplina.
