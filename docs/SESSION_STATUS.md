# SESSION STATUS

**Data:** 2026-07-13

---

# STATUS GERAL

- Arquitetura congelada.
- Pipeline homologado para provas A–D e A–E.
- Cebraspe (Certo/Errado) permanece para V2.
- Nenhuma alteração estrutural pendente.

---

# ACERVO

**Total atual:** 879 questões oficiais.

**Última prova concluída:**

- SES-RS 2013 (Fundatec)

**Última prova cancelada:**

- Prefeitura de Belo Horizonte 2014
  - Motivo: prova oficial indisponível.

---

# PONTO CRÍTICO

A produção está **PAUSADA**.

Foi encontrada uma inconsistência no concurso:

**SEMSA Manaus 002/2021 (FGV)**

Resumo da investigação:

- Existiam 67 questões já cadastradas.
- Nesta sessão foram inseridas mais 41.
- Total atual do exame: 108 questões.
- Ambos pertencem ao Tipo 1 Branca.
- Existem colisões por hash exato.
- Existem possíveis duplicatas conceituais.
- Pelo menos 4 questões antigas de Língua Portuguesa não correspondem ao PDF oficial armazenado em `docs/work/semsa-manaus-2022/prova.pdf`.
- Nenhuma exclusão foi realizada.
- Nenhuma alteração corretiva foi feita no banco.

---

# PRÓXIMA SPRINT

**NÃO** produzir novas provas.

Primeiro executar uma auditoria completa do exame **SEMSA Manaus 002/2021**.

**Objetivo:**

- comparar banco × PDF oficial;
- identificar questões inexistentes;
- identificar duplicatas;
- gerar relatório técnico;
- não excluir nenhuma questão;
- não alterar banco;
- não alterar pipeline.

Somente após concluir essa auditoria decidir como proceder.

---

# META

Após resolver a auditoria:

- retomar a produção do acervo;
- atingir mais de 1.000 questões oficiais;
- depois iniciar homologação geral e preparação para o lançamento da V1.
