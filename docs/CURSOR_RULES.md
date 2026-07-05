# SimulaPro Concursos — Regras Oficiais (Constituição do Projeto)

Documento obrigatório para qualquer agente, desenvolvedor ou assistente de IA que trabalhe neste repositório. Estas regras têm prioridade sobre improvisações e atalhos.

Para contexto de produto e arquitetura, consulte também [`00-VISAO-GERAL.md`](./00-VISAO-GERAL.md).

---

## Filosofia

Esta é a regra-mãe do SimulaPro Concursos. Toda decisão de código, produto e banco de dados deve respeitá-la.

> **Admin produz e publica conteúdo.**
>
> **Aluno apenas estuda o conteúdo comprado.**

Em termos práticos:

- O **Admin** cadastra taxonomia, importa questões, monta pacotes, publica versões e libera assinaturas.
- O **Aluno** consome exclusivamente o material da sua assinatura ativa. Não produz, não edita e não importa conteúdo.

---

## Regras Gerais

Regras que valem para **qualquer** tarefa no projeto.

| # | Regra |
|---|-------|
| 1 | **Ler toda a pasta `/docs` antes de responder** ou implementar qualquer coisa. |
| 2 | **Nunca alterar arquitetura sem autorização** explícita do responsável pelo projeto. |
| 3 | **Nunca criar funcionalidades fora do escopo** definido em `00-VISAO-GERAL.md` e neste documento. |
| 4 | **Corrigir antes de criar** — não adicionar código novo se o problema pode ser resolvido no existente. |
| 5 | **Sempre explicar o motivo da alteração** — toda mudança precisa de justificativa clara. |
| 6 | **Alterar o mínimo possível** — diff pequeno, focado, sem refatorações oportunistas. |
| 7 | **Manter compatibilidade com o projeto existente** — convenções, stack e padrões já adotados. |
| 8 | **Nunca apagar funcionalidades sem autorização** — remoções exigem confirmação explícita. |

---

## Prioridade

A ordem oficial de desenvolvimento do SimulaPro é:

1. **Documentação**
2. **Auditoria**
3. **Correções**
4. **Testes**
5. **Novas funcionalidades**
6. **Deploy**

**Nunca inverter essa ordem sem autorização.**

---

## Auditoria

Antes de alterar qualquer módulo, realizar uma auditoria do módulo verificando:

- rotas
- componentes
- services
- hooks
- banco de dados
- migrations
- policies
- types
- páginas relacionadas

**Somente após a auditoria propor alterações.**

---

## Desenvolvimento

Regras de execução para manter o ritmo e a qualidade do trabalho.

| # | Regra |
|---|-------|
| 1 | **Trabalhar um módulo por vez** — não misturar Admin, Aluno, importação e banco na mesma entrega. |
| 2 | **Um problema por vez** — resolver uma causa raiz antes de abrir outra frente. |
| 3 | **Uma alteração por vez** — evitar mudanças paralelas que dificultem revisão e rollback. |
| 4 | **Preferir pequenas mudanças** — entregas incrementais e revisáveis. |
| 5 | **Sempre indicar arquivos modificados** — listar explicitamente o que foi alterado ao concluir. |
| 6 | **Sempre sugerir testes após alterações** — descrever como validar o que foi feito. |

### Checklist ao concluir uma tarefa

- [ ] Escopo respeitado (sem funcionalidades extras)
- [ ] Diff mínimo e justificado
- [ ] Arquivos modificados listados
- [ ] Passos de teste sugeridos

---

## Banco de Dados

O Supabase é a fonte de verdade. Alterações no banco exigem disciplina.

### Regras obrigatórias

| # | Regra |
|---|-------|
| 1 | **Nunca alterar migrations antigas** — migrations já aplicadas são imutáveis. |
| 2 | **Criar novas migrations quando necessário** — toda mudança de schema vai em arquivo novo em `supabase/migrations/`. |

### Antes de alterar qualquer código que toque o banco, conferir sempre:

| Item | Onde verificar |
|------|----------------|
| **Schema** | `supabase/migrations/` |
| **Types** | `src/integrations/supabase/types.ts` |
| **Services** | Rotas, hooks e funções que consultam o Supabase |
| **Policies** | Políticas RLS nas migrations |
| **RLS** | Row Level Security habilitado e coerente com os perfis `admin` e `student` |

> Se schema, types, services e policies não estiverem alinhados, **corrija a inconsistência antes** de seguir com a feature.

---

## Importação

A importação é o **coração do sistema**. É o único caminho oficial para inserir questões no banco.

### Regra absoluta

**Nunca simplificar esse módulo.**

Não remover etapas, atalhar validações nem substituir o fluxo por cadastro manual.

### O que deve ser sempre preservado

| Capacidade | Descrição |
|------------|-----------|
| **CSV** | Suporte a arquivos `.csv` |
| **XLSX** | Suporte a planilhas Excel |
| **JSON** | Suporte a arrays JSON de questões |
| **Validações** | Enunciado, alternativas, gabarito, disciplina, duplicatas |
| **Staging** | Lotes salvos em `import_batches` antes de ir ao banco |
| **Aplicação do lote** | Etapa explícita de aplicar questões validadas |
| **Deduplicação** | Detecção de duplicatas no arquivo e no banco |
| **Criação automática da taxonomia** | Disciplinas, assuntos, bancas etc. criados na aplicação quando não existem |

### Fluxo sagrado (não encurtar)

```
Arquivo → Validação → Staging → Revisão → Aplicação → Banco
```

---

## Publicação

Regras de versionamento de pacotes. Refletem o trigger `enforce_single_published_version` no banco.

| # | Regra |
|---|-------|
| 1 | **Somente uma versão publicada por pacote** — nunca duas versões ativas simultaneamente no mesmo pacote. |
| 2 | **Publicar uma nova versão deve despublicar automaticamente a anterior** — comportamento garantido pelo banco, não opcional. |

O aluno sempre estuda a **versão publicada** do pacote vinculado à sua assinatura.

---

## Aluno

O portal do aluno (`/app`) é exclusivamente de **consumo**.

### O aluno nunca altera conteúdo

Proibido dar ao aluno capacidade de criar, editar, importar ou publicar questões, taxonomia ou pacotes.

### O aluno apenas:

| Ação | Descrição |
|------|-----------|
| **Acessa** | Entra na área de estudo com assinatura ativa |
| **Responde questões** | Resolve questões da versão publicada do seu pacote |
| **Consulta resultados** | Vê feedback da sessão, acertos, erros e histórico de tentativas |

---

## Commits

Regras para manter o histórico limpo e rastreável.

| # | Regra |
|---|-------|
| 1 | **Sempre pequenos** — um commit por unidade lógica de trabalho. |
| 2 | **Sempre descritivos** — mensagem clara sobre o *porquê*, não só o *o quê*. |
| 3 | **Nunca misturar vários assuntos** — importação e estudo do aluno não vão no mesmo commit. |

### Exemplos

```
✅ fix(import): corrigir validação de gabarito com letras minúsculas
✅ feat(versions): exibir confirmação antes de publicar versão
❌ ajustes gerais, correções e nova tela de stats
```

---

## Estilo

Como comunicar durante o trabalho no projeto.

| Princípio | Aplicação |
|-----------|-----------|
| **Explicações curtas** | Direto ao ponto, sem rodeios |
| **Sem teoria excessiva** | Só o contexto necessário para entender e agir |
| **Sênior + professor** | Decisões técnicas sólidas, explicadas de forma didática |

### Ao propor uma alteração

1. **O que** vai mudar (arquivos e trechos)
2. **Por que** é necessário
3. **Como testar** depois

### Ao recusar ou questionar algo

Explicar o conflito com esta constituição ou com `00-VISAO-GERAL.md` — não apenas dizer "não".

---

## Hierarquia de documentos

Quando houver dúvida, consultar nesta ordem:

1. **`docs/CURSOR_RULES.md`** (este arquivo) — regras obrigatórias
2. **`docs/00-VISAO-GERAL.md`** — visão de produto e escopo do MVP
3. **Código existente** — fonte de verdade da implementação atual
4. **Solicitação do usuário** — desde que não viole os itens acima

---

## Resumo em uma linha

> Ler `/docs`, respeitar a filosofia Admin/Aluno, não quebrar importação nem publicação, mudar o mínimo, explicar o porquê, commitar com disciplina.
