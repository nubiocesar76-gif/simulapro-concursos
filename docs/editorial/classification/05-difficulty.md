# 05 — Dificuldade (Difficulty)

Escala oficial: **Muito Fácil**, **Fácil**, **Média**, **Difícil**, **Muito Difícil**.

**Princípio:** critérios mensuráveis. Proibido usar opinião subjetiva ("achei difícil", "banca difícil").

Valores aceitos no `classification.template.json`: exatamente uma das cinco strings acima.

---

## Dimensões de mensuração

Toda classificação de dificuldade deve considerar **três dimensões objetivas**:

| Dimensão | Peso | O que medir |
|---|---|---|
| **D1 — Pré-requisito de conhecimento** | 40% | Quantos conceitos distintos são necessários |
| **D2 — Distância entre alternativas** | 35% | Quão parecidas são as alternativas incorretas |
| **D3 — Tipo de comando** | 25% | Reconhecimento vs aplicação vs análise |

---

## D1 — Pré-requisito de conhecimento

| Nível D1 | Critério mensurável |
|---|---|
| 1 | 1 conceito único, definível em 1 frase |
| 2 | 2 conceitos ou 1 conceito + 1 dado numérico |
| 3 | 3+ conceitos ou integração de 2 domínios |
| 4 | Estudo de caso com 4+ variáveis clínicas/normativas |
| 5 | Integração de 3+ domínios + dado numérico + norma |

---

## D2 — Distância entre alternativas

| Nível D2 | Critério mensurável |
|---|---|
| 1 | 3+ alternativas claramente absurdas; 1 óbvia |
| 2 | 2 alternativas claramente erradas; 2 plausíveis |
| 3 | 4 alternativas plausíveis; diferença de 1 termo técnico |
| 4 | 4–5 alternativas muito próximas; exige detalhe normativo/clínico |
| 5 | Certo/Errado ou múltipla escolha com pegadinha em termo único (Cebraspe/IDECAN) |

---

## D3 — Tipo de comando

| Nível D3 | Verbos típicos |
|---|---|
| 1 | "É definido como", "Significa", "Consiste em" |
| 2 | "Está correto afirmar", "De acordo com [norma]" (literal) |
| 3 | "A conduta adequada é", "O procedimento correto" |
| 4 | "Considerando o caso, assinale", "Diante do exposto" |
| 5 | "Assinale a alternativa **incorreta**", "Exceto", "NÃO se aplica" |

---

## Matriz final — classificação

Calcular score ponderado: `Score = (D1×0,4) + (D2×0,35) + (D3×0,25)`

| Score | Dificuldade |
|---|---|
| ≤ 1,4 | **Muito Fácil** |
| 1,5 – 2,2 | **Fácil** |
| 2,3 – 3,2 | **Média** |
| 3,3 – 4,0 | **Difícil** |
| ≥ 4,1 | **Muito Difícil** |

**Arredondamento:** usar duas casas decimais; limite exato cai no nível inferior.

---

## Atalhos objetivos (quando aplicável sem cálculo)

| Situação | Dificuldade mínima |
|---|---|
| Decoreba literal de número de artigo sem contexto | Fácil |
| Estudo de caso FGV 5 alternativas com 4 variáveis clínicas | Difícil |
| Cebraspe Certo/Errado com termo técnico trocado | Muito Difícil |
| Definição direta IBFC 4 alternativas com 1 absurda | Muito Fácil |
| Cálculo de dimensionamento com fórmula explícita no enunciado | Média |
| Questão anulada ou gabarito contestado conhecido | Não classificar — marcar REVIEW |

---

## Proibições

1. Não usar perfil da banca como único critério ("FGV é difícil" → inválido).
2. Não usar taxa de erro histórica sem dado documentado no acervo.
3. Não deixar campo vazio — obrigatório antes do merge.
4. Não usar escala numérica (1–5) no template — apenas as cinco strings oficiais.

---

## Registro

A dificuldade é serializada em `keywords` como `difficulty:<valor>` pelo merge do pipeline.
O valor canônico permanece no campo `difficulty` do template.
