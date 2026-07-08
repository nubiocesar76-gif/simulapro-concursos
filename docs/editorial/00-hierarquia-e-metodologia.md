# 00 — Hierarquia Oficial e Metodologia

## 1. Estrutura oficial do curso

```
Curso: Enfermagem
 └─ Cargo: Enfermeiro   (nível superior — exige registro ativo no COFEN/CORESP)
     └─ Disciplina (matéria)             ex.: "Saúde da Mulher"
         └─ Assunto (tema de edital)     ex.: "Assistência de Enfermagem no Pré-Natal"
             └─ Subassunto (tópico de cobrança direta em questão)
                                          ex.: "Cálculo da Idade Gestacional (DUM/Sonar)"
                 └─ Variante/Detalhe editorial (quando necessário)
                                          ex.: "Regra de Näegele vs. método de Sonar"
```

No banco (`taxonomy.json`) isso mapeia como:

- `courses[].positions[]` → Cargo (Enfermeiro, Técnico de Enfermagem, Técnico em Enfermagem)
- `courses[].subjects[]` → Disciplina
- `courses[].subjects[].topics[]` → Subassunto (hoje só populado para "Fundamentos de Enfermagem";
  este documento fornece o conteúdo para preencher as outras 25 disciplinas)

O nível "Assunto" intermediário nem sempre existe como registro isolado no
banco — na prática ele é uma **agregação editorial** de vários `topics[]`
próximos (ex.: o assunto "Curativos e Coberturas" agrupa os subassuntos
"Feridas e Cicatrização", "Curativos", "Prevenção de Lesão por Pressão"). Os
dossiês em `02*-*.md` deixam essa agregação explícita.

## 2. Cargo: Enfermeiro — perfil geral de cobrança

Em praticamente todas as 10 bancas analisadas, a prova de Enfermeiro segue um
padrão de bloco duplo:

- **Conhecimentos Gerais / Básicos** (Português, Raciocínio Lógico,
  Informática, Atualidades, às vezes Legislação institucional específica do
  órgão) — normalmente 20–40% da prova.
- **Conhecimentos Específicos** (todo o núcleo técnico de Enfermagem) —
  normalmente 60–80% da prova, e é o alvo principal deste documento.

Dentro de "Conhecimentos Específicos", o padrão observado nas bancas é:

1. Fundamentos/Semiotécnica (a "espinha dorsal" processual) sempre presente.
2. Ética/Legislação profissional (Lei 7.498/1986, Decreto 94.406/1987, Código
   de Ética COFEN) quase sempre presente, mesmo em provas curtas.
3. SUS/Saúde Coletiva/Políticas Públicas — presença muito alta, pois o
   Enfermeiro é o cargo mais "SUS-cêntrico" da área da saúde nos concursos.
4. Blocos clínicos por ciclo de vida (mulher, criança, adulto, idoso) e por
   cenário de cuidado (urgência/UTI, centro cirúrgico, saúde mental) —
   variam de peso conforme o **perfil do órgão** (hospital geral vs. atenção
   básica vs. hospital universitário vs. força armada).
5. Farmacologia geralmente aparece como bloco próprio nas bancas que fazem
   provas mais longas (FGV, Cebraspe, IDECAN); em provas curtas (IBFC,
   FAFIPA) costuma estar diluída dentro de Fundamentos ou de Urgência.

Cargos técnicos (Técnico/Auxiliar de Enfermagem) usam **a mesma árvore**, mas:
- a profundidade cai (menos subassuntos de gestão, ética mais superficial,
  farmacologia focada em "via de administração e cuidados", não em
  farmacocinética/mecanismo);
- o verbo de comando muda de "planejar/avaliar/prescrever cuidado" para
  "executar/auxiliar/observar";
- Administração em Enfermagem e SAE aparecem com foco em execução, não em
  liderança/planejamento.

## 3. Metodologia usada para construir este documento

Para cada banca, o critério de análise foi:

1. **Estrutura do edital** — como a banca nomeia e ordena as disciplinas no
   quadro de conteúdo programático (isso já revela sinônimos oficiais, ex.:
   FGV costuma escrever "Enfermagem em Saúde Coletiva", Cebraspe costuma
   escrever apenas "Saúde Coletiva").
2. **Redação do enunciado e comando da questão** — verbos e termos técnicos
   preferidos por banca (ex.: Cebraspe usa itens certo/errado com afirmações
   normativas quase literais de lei/portaria; FGV usa estudo de caso clínico
   com múltipla escolha; VUNESP tende a citar diretamente trechos de manuais
   do Ministério da Saúde).
3. **Fontes normativas citadas em gabarito/justificativa** (quando
   disponíveis) — usadas para o compêndio em `04-leis-portarias-*.md`.
4. **Recorrência entre concursos diferentes da mesma banca** — usada para
   calibrar a frequência qualitativa em `07-frequencia-cobranca-consolidada.md`.
5. **Casos de recurso/anulação documentados publicamente** — usados para
   identificar ambiguidades reais de classificação (`05-casos-ambiguos-*.md`),
   não hipotéticas.

Este documento é um **prior editorial calibrado por expertise de domínio**
sobre como essas bancas historicamente organizam Enfermagem — ele deve ser
tratado como ponto de partida vivo, e recalibrado à medida que o pipeline de
importação (`docs/work/<prova>/review.json`) confirmar ou contradizer um
padrão aqui descrito. Divergências confirmadas por provas reais **sempre**
têm precedência sobre este documento; quando isso acontecer, atualize o
dossiê correspondente e registre a mudança no changelog de `README.md`.

## 4. Por que a árvore tem exatamente estas 26 disciplinas (+ ajustes propostos)

O `taxonomy.json` atual já usa uma lista de 26 disciplinas construída para a
homologação RC1. Este documento a adota como esqueleto oficial, mas aponta
2 problemas estruturais encontrados durante a pesquisa, resolvidos em
`05-casos-ambiguos-regras-classificacao.md` e `02k-sae-cuidado-clinico-transversal.md`:

- **Duplicidade de SAE**: "Sistematização da Assistência de Enfermagem (SAE)"
  existe hoje tanto como `topic` dentro de "Fundamentos de Enfermagem"
  (order 35) quanto como `subject` isolado (order 24). Isso é uma
  inconsistência de dados, não uma opção editorial — precisa de decisão
  (ver `02k`).
- **Disciplinas "grandes demais" sem subassuntos ainda**: 24 das 26
  disciplinas têm `topics: []` vazio hoje. Os dossiês `02a`–`02l` preenchem
  isso com subassuntos propostos, prontos para importação em lote.

Nenhuma disciplina nova é estritamente necessária para cobrir o que as 10
bancas de referência exigem — a lista de 26 já é abrangente. Duas adições
**opcionais** que aparecem ocasionalmente em provas de hospital universitário
e forças armadas (baixa frequência, não recomendadas como disciplina própria
agora, e sim como subassunto dentro de disciplinas existentes):
- "Assistência Domiciliar / Home Care" → subassunto dentro de Saúde do Idoso.
- "Doação e Transplante de Órgãos" → subassunto dentro de Enfermagem
  Médico-Cirúrgica.

## 5. Convenção de nomenclatura de sinônimos entre bancas (regra geral)

Regra aplicada em todos os dossiês: quando duas bancas nomeiam a mesma
disciplina de forma diferente, o **nome canônico** usado no SimulaPro é o que
já está em `taxonomy.json`; as variantes de banca são registradas como
"sinônimos oficiais de edital" no dicionário (`03-dicionario-editorial-*.md`)
e usadas para *matching* automático de importação, nunca para criar uma
segunda disciplina duplicada.
