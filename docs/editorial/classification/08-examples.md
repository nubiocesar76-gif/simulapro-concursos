# 08 — Exemplos Completos de Classificação

Cinco exemplos reais de formato, cobrindo disciplinas distintas. Cada um segue o fluxo:

```
Questão → Disciplina → Assunto → Keywords → Dificuldade → Explicação
```

---

## Exemplo 1 — Fundamentos (IBFC)

### Questão

**Enunciado:** Ao medir a pressão arterial de um adulto em repouso, o enfermeiro obtém 140 mmHg × 90 mmHg. Considerando os parâmetros normais, essa aferição indica:

- A) Hipotensão arterial.
- B) Normotensão.
- C) Hipertensão arterial estágio 1.
- D) Crise hipertensiva.

**Gabarito:** C

### Classificação

| Campo | Valor |
|---|---|
| **Disciplina** | Fundamentos de Enfermagem (D10) — slug: `fundamentos-de-enfermagem` |
| **Assunto** | D10-A02 — Exame Físico e Avaliação |
| **Keywords** | `pressão arterial`; `sinais vitais`; `hipertensão arterial`; `aferição de pa`; `exame físico` |
| **Dificuldade** | Média — D1=2, D2=3, D3=2 → score 2,35 |
| **Explicação** | PA 140×90 mmHg em adulto corresponde a Hipertensão Arterial Estágio 1 (≥140 e/ou ≥90, <180 e/ou <120). Hipotensão e normotensão estão ab abixo desses limites. Crise hipertensiva exige PA ≥180×120 mmHg com ou sem lesão de órgão-alvo. Referência: Diretrizes Brasileiras de Hipertensão Arterial (SBC, 2020). |

**Regras aplicadas:** R-001, R-009 (técnica de aferição → Fundamentos), R-015 (não Farmacologia).

---

## Exemplo 2 — Legislação do SUS (VUNESP)

### Questão

**Enunciado:** De acordo com a Lei nº 8.080/1990, assinale a alternativa correta sobre os princípios do SUS:

- A) A universalidade garante atendimento apenas a contribuintes da previdência.
- B) A equidade significa tratar todos de forma idêntica.
- C) A integralidade abrange ações de promoção, prevenção, tratamento e reabilitação.
- D) A regionalização exclui a participação municipal.
- E) A descentralização concentra decisões no Ministério da Saúde.

**Gabarito:** C

### Classificação

| Campo | Valor |
|---|---|
| **Disciplina** | Legislação do SUS (D13) — slug: `legislacao-do-sus` |
| **Assunto** | D13-A02 — Princípios e Diretrizes do SUS |
| **Keywords** | `lei 8080/1990`; `princípios do sus`; `integralidade`; `universalidade`; `equidade` |
| **Dificuldade** | Fácil — citação literal, 1 distrator absurdo por alternativa → score 1,85 |
| **Explicação** | A integralidade (art. 7º, Lei 8.080/1990) compreende conjunto integrado de ações de promoção, prevenção, tratamento e reabilitação. Universalidade não se restringe a contribuintes. Equidade implica tratar desigualmente os desiguais. Referência: Lei nº 8.080/1990, art. 7º. |

**Regras aplicadas:** R-010, R-028, R-017.

---

## Exemplo 3 — SAE (IDECAN)

### Questão

**Enunciado:** Na fase de diagnóstico de enfermagem, o enfermeiro identifica o problema "Risco de infecção". Essa classificação pertence à taxonomia:

- A) CIPE
- B) NANDA-I
- C) NOC
- D) NIC
- E) CID-11

**Gabarito:** B

### Classificação

| Campo | Valor |
|---|---|
| **Disciplina** | SAE (D24) — slug: `sistematizacao-da-assistencia-de-enfermagem-sae` |
| **Assunto** | D24-A03 — Taxonomias e Sistemas de Classificação |
| **Keywords** | `nanda-i`; `diagnóstico de enfermagem`; `risco de infecção`; `taxonomia nnn`; `processo de enfermagem` |
| **Dificuldade** | Média — alternativas plausíveis (NIC/NOC confundíveis) → score 2,65 |
| **Explicação** | Diagnósticos de enfermagem como "Risco de infecção" pertencem à taxonomia NANDA-I. NOC classifica resultados; NIC classifica intervenções; CIPE é classificação internacional de prática; CID-11 é diagnóstico médico. Referência: Resolução COFEN nº 358/2009; NANDA-I. |

**Regras aplicadas:** R-019, R-043.

---

## Exemplo 4 — Urgência e Emergência (FGV — estudo de caso)

### Questão

**Enunciado:** Paciente de 58 anos, tabagista, chega ao PS com dor torácica há 30 minutos, sudorese e irradiação para MSE. PA 90×60 mmHg, FC 110 bpm. Após ECG com supra de ST em V1–V4, o enfermeiro deve prioritariamente:

- A) Administrar nitrato sublingual e aguardar troponina.
- B) Acionar protocolo de IAM com reperfusão e monitorizar ritmo.
- C) Encaminhar para tomografia de tórax.
- D) Posicionar em Trendelenburg e expandir com cristaloide.
- E) Solicitar D-dímero para investigar TEP.

**Gabarito:** B

### Classificação

| Campo | Valor |
|---|---|
| **Disciplina** | Urgência e Emergência (D26) — slug: `urgencia-e-emergencia` |
| **Assunto** | D26-A03 — Emergências Clínicas |
| **Keywords** | `iam`; `supra de st`; `dor torácica`; `protocolo de reperfusão`; `emergência cardiovascular`; `monitorização cardíaca` |
| **Dificuldade** | Difícil — estudo de caso, 5 alternativas plausíveis → score 3,55 |
| **Explicação** | Supra de ST em V1–V4 com dor torácica e instabilidade hemodinâmica configura IAMCSST — prioridade é acionar protocolo de reperfusão e monitorização cardíaca contínua. Nitrato isolado não substitui reperfusão. Trendelenburg piora IAM. D-dímero é investigação de TEP, não primeira linha com supra ST típico. Referência: Protocolo de Síndrome Coronariana Aguda — Ministério da Saúde. |

**Regras aplicadas:** R-013 (desfecho = conduta aguda), R-018, R-047.

---

## Exemplo 5 — Biossegurança (Cebraspe — Certo/Errado)

### Questão

**Enunciado:** Julgue: A higienização das mãos com solução alcoólica é dispensável quando o profissional utiliza luvas de procedimento para tocar o paciente.

**Gabarito:** Errado

### Classificação

| Campo | Valor |
|---|---|
| **Disciplina** | Biossegurança (D03) — slug: `biosseguranca` |
| **Assunto** | D05-A04 — Medidas de Prevenção |
| **Keywords** | `higienização das mãos`; `solução alcoólica`; `luvas de procedimento`; `precauções padrão`; `5 momentos oms` |
| **Dificuldade** | Muito Difícil — Certo/Errado com pegadinha em termo único → D2=5, score 4,15 |
| **Explicação** | Errado. Luvas não substituem higienização das mãos — luvas podem falhar e não eliminam a necessidade de HH antes e após uso. OMS define 5 momentos para higienização independentemente de luvas. Referência: OMS — Guidelines on Hand Hygiene in Health Care; RDC ANVISA boas práticas. |

**Regras aplicadas:** R-016, R-050.

---

## Template vazio para novas questões

```json
{
  "question": 0,
  "board": "",
  "contest": "",
  "position": "Enfermeiro",
  "subject": "",
  "topic": "",
  "year": "",
  "difficulty": "",
  "keywords": [],
  "explanation": ""
}
```

Preencher consultando `01-boards.md` → `02-subjects.md` → `03-topics.md` → `04-keywords.md` → `05-difficulty.md` → `06-explanation.md`, validando com `07-rules.md`.
