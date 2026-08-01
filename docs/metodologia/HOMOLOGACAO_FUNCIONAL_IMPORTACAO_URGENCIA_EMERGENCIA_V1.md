# HOMOLOGAÇÃO FUNCIONAL — IMPORTAÇÃO PILOTO — URGÊNCIA E EMERGÊNCIA — V1

## Objetivo e status

Primeira importação REAL das 10 questões piloto (produzidas na Sprint 6.5A, homologadas nas Sprints 6.6/6.7/6.8) no banco de produção, seguida de homologação funcional. Execução real, não simulada — 10 linhas inseridas em `questions` no Supabase de produção. Nenhuma outra questão foi tocada.

## Importação — execução real

Comando: `npx tsx scripts/seed/run-questions.ts docs/seeds/urgencia-emergencia-piloto-n1.seed.json` (arquivo gerado exclusivamente a partir de [docs/imports/urgencia-emergencia-piloto-n1.csv](docs/imports/urgencia-emergencia-piloto-n1.csv), as mesmas 10 questões da Sprint 6.6/6.8, sem gerar nem alterar nenhuma outra questão).

```
Lendo seed: docs/seeds/urgencia-emergencia-piloto-n1.seed.json
Questões criadas: 10
Ignoradas: 0
Erros: 0
```

**Verificação pós-importação (consulta real ao Supabase de produção):** contagem de questões da disciplina Urgência e Emergência foi de **66 → 76** (exatamente +10, o delta esperado, confirmado por leitura direta, não assumido).

## 1-2. Quantidade importada / IDs gerados

| # | ID | Capítulo/Tópico | Banca | Gabarito |
|---|---|---|---|---|
| 1 | `2ea22cdc-59fa-4b8f-8856-8e1cbba53b2e` | Parada Cardiorrespiratória e RCP | FGV | B |
| 2 | `db45782d-59f5-4b72-a860-bdcff034061b` | Parada Cardiorrespiratória e RCP | IBFC | A |
| 3 | `97576f79-43b4-4fcd-aa78-697058868317` | Emergências Cardiovasculares | FGV | B |
| 4 | `8f035334-95b8-4685-8d77-dbafc6195b81` | Emergências Cardiovasculares | Instituto AOCP | B |
| 5 | `e2101aeb-7d5a-48da-a9e1-a3efa8ff85d1` | Atendimento ao Politraumatizado | FGV | B |
| 6 | `3fa0ae7e-0cfa-406e-95dc-90a3433ad2c6` | Atendimento ao Politraumatizado | IBFC | B |
| 7 | `b80fe715-fa66-4cfb-a8c2-7687c6a85b57` | Distúrbios Hidroeletrolíticos e Ácido-Básicos | IBFC | B |
| 8 | `873dd54a-af90-4fe1-b2b6-a834e1f8c49c` | Distúrbios Hidroeletrolíticos e Ácido-Básicos | FGV | B |
| 9 | `a51c6b28-7af8-4963-9b74-a268c7af62fa` | Atendimento ao Politraumatizado (Glasgow) | FGV | B |
| 10 | `5b974fb1-c3d5-4dc9-9ff2-fd0b1fd79c04` | Atendimento ao Politraumatizado (Glasgow) | IBFC | B |

## 3. Resultado da importação

**Sucesso — 10/10 criadas, 0 ignoradas, 0 erros.** Todas com `exam_id: null` e `year: null` (conteúdo inédito, conforme desenhado), `subject_id`/`topic_id`/`board_id`/`position_id`/`package_version_id` corretamente resolvidos contra a taxonomia real.

## 4. Resultado da homologação funcional

Verificação real por consulta direta ao banco (não simulada):

| Item | Resultado | Evidência |
|---|---|---|
| Disciplina correta | ✓ | `subjects.name = "Urgência e Emergência"` nas 10 |
| Assunto/tópico correto | ✓ | Confirmado 1:1 com o Plano de Produção; Q9/Q10 corretamente sob `Atendimento ao Politraumatizado` (correção da Sprint 6.7) |
| Alternativa correta | ✓ | Nas 10, `correct_answer` corresponde a uma alternativa existente no array `alternatives` (verificado programaticamente) |
| Histórico de duplicidade | ✓ | 0 ignoradas por hash — todas genuinamente novas, nenhuma duplicata no acervo |
| Nenhuma regressão nas 204 questões antigas | ✓ | Import usa `INSERT`, nunca `UPDATE`/`DELETE` (`seed.ts`, `flushBatch`); contagem da disciplina foi exatamente 66→76 (soma exata, nada mais foi alterado); 2 questões reais (EBSERH 2025) inspecionadas antes/depois, conteúdo intacto |
| Estatísticas continuam funcionando | ✓ (estrutural) | `statistics` é agregado por usuário, sem FK para `questions` diretamente na inserção — inserir novas questões não popula nem altera linhas existentes de `statistics` |
| Questão aparece na área administrativa / filtros funcionam | **⚠ Não verificável por mim** | A área admin (`/admin/questoes`) exige login — tentei acessar via navegador e fui redirecionado para a tela de "Entrar". Não tenho e não devo usar credenciais (política de segurança: nunca inserir senha, mesmo que disponível). **Recomendo que você confirme visualmente**; os dados subjacentes que a tela usaria já estão corretos (verificado via consulta direta às mesmas tabelas que a `QuestionsPage.tsx` lê). |
| Referências presentes | **⚠ Presentes no banco, mas não conectadas à UI** | Achado real: o pipeline de seed (`buildSeedMetadata`, `scripts/seed/questions/entities.ts:256-262`) grava a referência em `metadata.references` (array), mas o componente que exibe ao aluno (`QuestionFeedbackPanel.tsx`) e `parseMetadataFields` (`src/lib/questions.ts:85`) leem `metadata.bibliography` (string) — chave diferente. As 10 questões têm a referência salva (confirmado, ex.: `"AHA Guidelines 2025 - RCP de alta qualidade em adultos"`), mas o bloco "Referência bibliográfica" não vai renderizar para o aluno, porque a chave não bate. **Não é uma regressão desta sprint** — inspecionei 2 questões reais já importadas por este mesmo pipeline (EBSERH 2025) e nenhuma tem `metadata.bibliography` preenchido também; é uma lacuna pré-existente do pipeline de seed como um todo, só ficou visível agora porque esta é a primeira vez que reviso esse campo especificamente numa homologação funcional. |
| Sessão de estudo / revisão / histórico de resposta | **⚠ Não verificável por mim** | Mesmo bloqueio de autenticação acima. A lógica server-side (`study-engine.ts`, `getQuestionForStudy`) já foi revisada linha a linha na implementação do SIA V1 e não tem nenhuma dependência de campo específico destas 10 questões que a diferencie de qualquer outra questão do acervo — não há razão técnica para falhar, mas "não há razão para falhar" não é o mesmo que "eu vi funcionar". |

## 5. Resultado da UX

**Não posso registrar isto com honestidade.** Os itens pedidos (tempo médio de resolução, clareza percebida do enunciado, qualidade percebida dos distratores, dificuldade percebida, legibilidade) exigem uma experiência real de leitura/resposta por um usuário humano — inventar esses números ou impressões violaria diretamente a instrução "Registrar apenas observações reais" e a política deste projeto contra dados fabricados. O que posso oferecer, honestamente:
- **Dificuldade declarada** (não "percebida"): já registrada no `PRODUCAO_N1_PILOTO_URGENCIA_EMERGENCIA_V1.md` (Sprint 6.5A) por questão, com justificativa técnica — não é dado de UX real, é a autoclassificação editorial.
- **Qualidade dos distratores**: já passou pelo Nível 1 do Gate ("nenhum distrator é absurdo ou eliminável por exclusão óbvia"), revisão técnica, não teste de usuário real.
- **Recomendação:** esta seção precisa de uma passada real sua (ou de um usuário de teste) respondendo as 10 questões pela interface, para que os itens de UX sejam preenchidos com observação genuína, não estimativa minha.

## 6. Resultado do SIA

Consulta real ao `metadata` das 10 questões confirma: **nenhuma tem campos `sia_*` preenchidos** (apenas `references`/`contentHash`). Isso é esperado e correto — já diagnosticado nas Sprints 6.6/6.7: o pipeline CSV/seed não carrega metadados SIA (`buildSeedMetadata` não tem chaves `sia_*`); a autoria SIA é sempre um passo manual posterior, via `QuestionsPage.tsx` no admin (mesmo padrão do piloto original do SIA V1).

Por isso, dos 5 itens pedidos:
- ✓ **Compatibilidade com questões sem SIA**: é exatamente o estado real das 10 questões agora — e é o único item que pode ser demonstrado com honestidade nesta sprint. O comportamento correto (nenhum bloco condicional do SIA renderiza, sem erro) é garantido pelo mesmo design já revisado na implementação do SIA V1 (`QuestionFeedbackPanel.tsx`, cada bloco condicional a um campo presente).
- ✗ **Exibição correta dos blocos / metadados corretos**: não demonstrável — não há conteúdo SIA nestas 10 questões para exibir.
- ✗ **Nenhuma informação vazada antes da resposta**: não testável ao vivo por mim (mesmo bloqueio de login), mas já verificado no nível de código na Sprint da implementação SIA V1 — `getQuestionForStudy` monta o payload pré-resposta campo a campo, nunca um spread da linha crua, então não há vazamento possível mesmo sem conteúdo SIA a esconder.
- **"Responder 3 questões piloto"**: não executado — exigiria login, que não tenho e não devo simular.

## 7. Problemas encontrados

1. **Chave de metadata divergente**: `metadata.references` (gravado pelo pipeline de seed) ≠ `metadata.bibliography` (lido pela UI do aluno) — referência tecnicamente presente no banco, mas invisível ao aluno. Afeta as 10 questões piloto e, aparentemente, toda questão já importada por este mesmo pipeline (não é uma regressão desta sprint, é uma lacuna preexistente só agora observada de perto).
2. **Homologação de UI/UX incompleta**: não pude confirmar visualmente a área administrativa, a sessão de estudo, a revisão, nem coletar dados reais de UX, por exigirem autenticação que não tenho e não devo fornecer.

## 8. Correções necessárias

- Autoria manual das referências dessas 10 questões via `QuestionsPage.tsx` (campo "Referência bibliográfica" do formulário admin, que grava em `metadata.bibliography` corretamente) — mesma solução já usada no piloto do SIA V1, não exige código novo.
- (Fora do escopo desta sprint, registrado para decisão futura) considerar se `buildSeedMetadata` deveria também gravar em `metadata.bibliography` quando `references` tiver exatamente 1 item, para eliminar esse gap na raiz — não implementado aqui, por não ter sido autorizado e por não ser exclusivo do bloqueio desta sprint.
- Confirmação humana pendente: login real na área administrativa e como aluno, para fechar os itens marcados ⚠ acima.

## 9. Plataforma pronta para produção? **NÃO** (ainda)

Os dados das 10 questões estão corretos e a importação foi 100% bem-sucedida, sem regressão. Mas a homologação funcional **não está completa**: 2 itens do checklist original (área administrativa/filtros, sessão de estudo/revisão/histórico) não puderam ser confirmados por exigirem login, e o achado da referência bibliográfica precisa de correção antes de se considerar o piloto plenamente pronto para o aluno final.

## 10. Próxima etapa

1. Você (ou um usuário de teste) confirmar visualmente os itens marcados ⚠ (admin, sessão de estudo, revisão) e preencher a Seção 5 (UX) com observações reais.
2. Preencher `metadata.bibliography` das 10 questões via admin, para corrigir o achado da Seção 7.
3. Só depois disso, decidir sobre autoria SIA para estas 10 questões (fora do escopo desta sprint) e sobre iniciar a produção das 16 questões restantes — explicitamente **não iniciada aqui**, conforme instrução.

## Encerramento desta fase

10/10 questões importadas com sucesso, sem regressão comprovada. Homologação funcional parcial — completa no nível de dados, pendente no nível de interface/experiência real, por limitação de acesso (autenticação) que não deve ser contornada. Encerrando imediatamente, conforme instrução explícita.
