# 09 — Checklist de Qualidade (Revisão Humana)

Checklist obrigatório antes de aprovar uma questão para `convert:questions` e `seed:questions`.

Marcar cada item. **Qualquer item crítico (🔴) reprovado bloqueia a publicação.**

---

## 1. Disciplina

- [ ] 🔴 Disciplina correta conforme `02-subjects.md`
- [ ] 🔴 Apenas **uma** disciplina primária (R-001)
- [ ] Disciplina não mesclada/inativa (D05, D11, D14, D20, D02)
- [ ] Tag secundária documentada em keywords, se aplicável (R-005)
- [ ] Regra de desempate citada quando houve dúvida (R-009 a R-020)

---

## 2. Assunto

- [ ] 🔴 Assunto correto conforme `03-topics.md`
- [ ] 🔴 Assunto pertence à disciplina escolhida (R-002)
- [ ] Assunto existente reutilizado — não criado ad hoc (R-021)
- [ ] ID reparentado V1.1 correto (D05-*, D11-*, D14-*, D20-*)

---

## 3. Palavras-chave

- [ ] 🔴 Entre 3 e 8 keywords (`04-keywords.md`)
- [ ] Formato padronizado (minúsculas, siglas corretas)
- [ ] Sem duplicata ou sinônimo redundante
- [ ] Norma citada incluída quando questão é normativa
- [ ] Ordem específico → genérico

---

## 4. Dificuldade

- [ ] 🔴 Valor oficial: Muito Fácil / Fácil / Média / Difícil / Muito Difícil
- [ ] 🔴 Critério objetivo aplicado (D1, D2, D3 ou atalho `05-difficulty.md`)
- [ ] Não baseada em opinião ou perfil genérico da banca
- [ ] Score calculado ou atalho documentado na revisão

---

## 5. Gabarito

- [ ] 🔴 Gabarito confere com gabarito oficial da prova
- [ ] 🔴 Alternativa marcada existe no enunciado extraído
- [ ] Questão anulada **excluída** do CSV (status ANULADA)
- [ ] REVIEW_REQUIRED revisada ou mantida INACTIVE deliberadamente
- [ ] Cebraspe: Certo/Errado coerente com explicação

---

## 6. Explicação

- [ ] 🔴 Campo preenchido (obrigatório para merge)
- [ ] Estrutura: resposta + fundamento + distratores + referência
- [ ] Tamanho dentro do intervalo (`06-explanation.md`)
- [ ] Tom didático, sem opinião
- [ ] Referência presente quando questão normativa
- [ ] Sem contradição com gabarito oficial

---

## 7. Referências

- [ ] Norma citada existe e vigência conferida
- [ ] Redação histórica sinalizada se prova anterior à alteração (R-032)
- [ ] Fonte não oficial ausente (blog, Wikipedia)
- [ ] Artigo/inciso não inventado

---

## 8. Duplicidade

- [ ] 🔴 Questão não duplicada no mesmo concurso/pacote
- [ ] Enunciado não duplica questão já existente no acervo (>85% similaridade)
- [ ] Numeração única no lote importado

---

## 9. Qualidade geral

- [ ] Banca (`board`) e concurso (`contest`) corretos (`01-boards.md`)
- [ ] Ano (`year`) corresponde ao edital
- [ ] Cargo (`position`) = Enfermeiro (salvo exceção documentada)
- [ ] Extração mecânica (enunciado/alternativas) revisada
- [ ] Classificação rastreável a regra R-0XX (`07-rules.md`)

---

## 10. Aprovação

| Campo | Valor |
|---|---|
| Revisor | |
| Data | |
| Prova/concurso | |
| Questão nº | |
| Resultado | ☐ Aprovada  ☐ Reprovada  ☐ Pendente |
| Itens reprovados | |
| Regras citadas | |

**Regra:** questão só avança para `docs/imports/questions.csv` com **todos os itens 🔴 aprovados** e revisão registrada.

---

## Resumo rápido (9 itens)

| # | Item |
|---|---|
| □ | Disciplina correta |
| □ | Assunto correto |
| □ | Palavras-chave |
| □ | Dificuldade |
| □ | Gabarito |
| □ | Explicação |
| □ | Referências |
| □ | Duplicidade |
| □ | Qualidade geral |
