# HOMOLOGAÇÃO — Gestão de Usuários (Admin > Usuários) — V1

Escopo: correção mínima aprovada após auditoria do fluxo de exclusão de usuários. Adiciona
coluna Status (derivada de `subscriptions`), coluna Ações (Editar/Excluir) e uma função de
servidor dedicada para exclusão definitiva de usuário, com proteção contra autoexclusão e
contra exclusão do último administrador. Nenhuma alteração de schema, migration, RLS,
arquitetura ou pipeline editorial.

## Auditoria prévia (resumo)

- Excluir uma `subscription` hoje **nunca** apagou o usuário — decisão arquitetural implícita,
  já correta, não uma correção.
- Não existia nenhuma função de exclusão de usuário, nem cascade acionado pela aplicação —
  o cascade em `ON DELETE CASCADE` (profiles, user_roles, subscriptions, study_sessions →
  study_session_questions, question_attempts, favorites, statistics) só é disparado ao apagar
  a linha em `auth.users`, e isso só é possível via Admin API (`service_role`).
- `question_attempts`/`favorites`/`statistics` são o schema legado (Sprint pré-6A), hoje com
  0 linhas em produção — ainda referenciados só como checagem de dependência ao excluir
  questão/disciplina no admin; não afetam esta correção.
- O enum `subscription_status` só tem `ACTIVE`/`INACTIVE` — não existe um terceiro estado
  "cancelada" rastreado separadamente. Status na tela deriva só do dado existente.
- Risco identificado (nunca exercido em produção): a RLS `"Admins manage profiles"`/`"Admins
  manage roles"` tecnicamente permite `DELETE` direto nessas tabelas via client SDK, o que
  deixaria um `auth.users` órfão sem perfil. A implementação evita esse caminho por completo —
  a única forma de exclusão é `supabaseAdmin.auth.admin.deleteUser(userId)`.

## Arquivos alterados

| Arquivo | Mudança |
|---|---|
| `src/lib/admin-users.functions.ts` (novo) | `createServerFn` `deleteUser` — autentica via `requireSupabaseAuth`, confirma papel admin do solicitante consultando `user_roles`, bloqueia autoexclusão, bloqueia exclusão do último admin (contagem de `role = 'admin'`), exclui só via `supabaseAdmin.auth.admin.deleteUser`, registra em `logs` (`action: "user.delete"`). |
| `src/routes/_authenticated/admin/users.tsx` | Query estendida com `subscriptions` (status/vigência); coluna **Status** (Assinatura ativa / Assinatura inativa / Sem assinatura, mesmo critério de `isCurrentlyActive`); coluna **Ações** com Editar (Dialog, só `full_name`) e Excluir (AlertDialog, lista de dependências removidas, ação irreversível); botão Excluir desabilitado na própria linha do admin logado. |

## Testes executados (dados reais, usuários temporários — todos removidos ao final)

| Cenário | Resultado |
|---|---|
| Status "Assinatura ativa" | OK — usuário com subscription `ACTIVE` dentro da vigência |
| Status "Assinatura inativa" | OK — usuário com subscription `INACTIVE` |
| Status "Sem assinatura" | OK — usuário sem nenhuma linha em `subscriptions` |
| Coerência com dados reais pré-existentes | OK — os 11 usuários reais já cadastrados bateram exatamente com o status esperado (incluindo o admin real, com assinatura `INACTIVE`) |
| Editar nome | OK — `full_name` atualizado e persistido, sem alterar email/senha/papel |
| Excluir usuário comum | OK — via UI completa (Editar → Excluir → confirmação) |
| Cascata completa | OK — confirmado por consulta direta ao banco após a exclusão: `auth.users`, `profiles`, `user_roles`, `subscriptions` todos removidos; **zero registros órfãos** |
| Log de auditoria | OK — linha criada em `logs` com `action: "user.delete"`, `entity_id` do alvo e metadata (email/nome no momento da exclusão) |
| Autoexclusão do admin logado | OK — bloqueada em duas camadas: botão desabilitado na UI e, testado à parte com o botão forçado via chamada direta ao endpoint do server function, rejeitada no servidor (erro, conta preservada) |
| Exclusão do último administrador | Ver nota abaixo — logicamente idêntica ao teste de autoexclusão nas condições reais do sistema |
| Não-admin sem acesso | OK — usuário autenticado sem role admin chamou o mesmo endpoint diretamente (fora da UI, que já nem exibe a tela para não-admin) tentando excluir outro usuário; servidor rejeitou (erro 500 com mensagem de acesso negado) e o alvo permaneceu intacto |
| Admin excluindo outro admin (não é o último) | OK — com 2 administradores de teste ativos, um excluiu o outro sem bloqueio; após a exclusão restaram os administradores esperados |
| TypeScript (`tsc --noEmit`) | OK — 0 erros |
| ESLint | OK — 0 erros (2 avisos de formatação corrigidos automaticamente) |
| Regressão em Usuários | OK — nenhuma quebra nas colunas pré-existentes (Nome/Email/Perfil/Cadastro) |
| Regressão em Assinaturas | Não alterado nesta correção — nenhum código de `SubscriptionsPage.tsx` foi tocado |

### Nota sobre "último administrador" vs. "autoexclusão"

A validação de banco real mostrou que o sistema hoje tem **exatamente 1 administrador**
(`nubiocesar76@gmail.com`). Como só um administrador pode chamar `deleteUser` (checagem
obrigatória no próprio handler), sempre que o alvo é "o último admin restante" o solicitante
só pode ser esse mesmo admin — ou seja, nas condições reais de hoje, "excluir o último admin"
e "autoexclusão" são o mesmo evento. Os dois guards existem como código independente (um
compara `userId`, o outro conta `role = 'admin'`) e ambos foram exercidos: o guard de
autoexclusão foi disparado diretamente contra o servidor (fora da UI); o guard de contagem foi
validado com dois administradores de teste, confirmando que excluir um admin **não-último**
é permitido e que a contagem usada pelo guard reflete o estado real do banco. Nenhum teste
tocou ou colocou em risco o acesso do administrador real de produção.

## Proteções confirmadas

1. Autenticação obrigatória (`requireSupabaseAuth`).
2. Papel admin confirmado explicitamente dentro do handler (a middleware sozinha não valida
   papel).
3. Exclusão exclusivamente via `supabaseAdmin.auth.admin.deleteUser` — nunca `DELETE` direto
   em `profiles`/`user_roles`.
4. Bloqueio de autoexclusão.
5. Bloqueio de exclusão do último administrador.
6. Log de auditoria da exclusão.
7. Confirmação explícita (`AlertDialog`) listando o que será removido, com aviso de ação
   irreversível.

## Resultado final

**HOMOLOGADO.** Nenhum registro órfão, nenhum risco de perda de acesso administrativo
observado. Nenhuma alteração de schema, migration, RLS, `subscriptions`, fluxo de
autenticação, arquitetura ou pipeline editorial.
