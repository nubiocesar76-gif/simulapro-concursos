# Bootstrap — Primeiro Administrador

Procedimento oficial para criar o **primeiro** (ou qualquer) administrador no SimulaPro Concursos.

Para regras de trabalho, ver [`CURSOR_RULES.md`](./CURSOR_RULES.md). Para status do projeto, ver [`PROJECT_STATUS.md`](./PROJECT_STATUS.md).

---

## Por que este procedimento existe

- O cadastro em `/auth` cria automaticamente role `student` via trigger `handle_new_user`.
- Não há UI para promover usuários a admin.
- Escritas no portal Admin dependem de `has_role(auth.uid(), 'admin')` nas policies RLS.
- O **primeiro** admin só pode ser criado via **SQL Editor** (role `postgres`) ou **service role** — não há admin pré-existente para delegar via app.

---

## Pré-requisitos

1. Usuário já cadastrado no Supabase Auth (login em `/auth` ou Dashboard → Authentication).
2. Migration `20260704161000_grant_has_role_execute.sql` aplicada no projeto remoto (`db push` ou SQL Editor).
3. Acesso ao **SQL Editor** do projeto `snbhstgvsfjfyfbwxdae`.

---

## Passo 1 — Localizar o usuário

Substitua o e-mail e execute no SQL Editor:

```sql
SELECT
  u.id          AS user_id,
  u.email,
  p.full_name,
  ur.role
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
LEFT JOIN public.user_roles ur ON ur.user_id = u.id
WHERE u.email = 'SEU-EMAIL@exemplo.com';
```

Guarde o `user_id` (UUID). Confirme que ainda **não** existe linha com `role = 'admin'`.

---

## Passo 2 — Promover a admin

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('UUID-DO-USUARIO', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
```

> O usuário pode manter **ambos** os roles (`student` e `admin`). O hook `useAuth` prioriza `admin` se existir.

---

## Passo 3 — Validar

```sql
SELECT
  u.email,
  public.has_role(u.id, 'admin'::public.app_role) AS eh_admin,
  has_function_privilege(
    'authenticated',
    'public.has_role(uuid, public.app_role)',
    'EXECUTE'
  ) AS authenticated_pode_executar_has_role
FROM auth.users u
WHERE u.email = 'SEU-EMAIL@exemplo.com';
```

Resultado esperado:

| Coluna | Valor |
|--------|-------|
| `eh_admin` | `true` |
| `authenticated_pode_executar_has_role` | `true` |

---

## Passo 4 — Teste funcional (manual)

1. Faça login em `/auth` com o usuário promovido.
2. Acesse `/admin/courses`.
3. Cadastre um curso de teste.
4. Se falhar com RLS, volte ao Passo 3 e confirme que a migration de `GRANT EXECUTE` foi aplicada.

---

## Promover administradores adicionais

Após existir pelo menos um admin com acesso ao SQL Editor, o procedimento é o mesmo (Passos 1–3).

Futuramente, admins poderão gerenciar roles pela UI (`/admin/users`) — hoje a tela é somente leitura; a policy `"Admins manage roles"` em `user_roles` já permite INSERT/UPDATE/DELETE para quem tem role `admin`.

---

## Segurança

| Regra | Motivo |
|-------|--------|
| Não conceder `EXECUTE` em `has_role` para `anon` | Visitantes não devem avaliar roles |
| Não conceder `EXECUTE` em `handle_new_user` para `authenticated` | Função só deve rodar via trigger em `auth.users` |
| Promover admin apenas para contas confiáveis | Admin tem escrita em todo o conteúdo e gestão de assinaturas |

---

## Referências

| Item | Local |
|------|-------|
| Função `has_role` | `supabase/migrations/20260702152648_*.sql` |
| REVOKE original | `supabase/migrations/20260702152657_*.sql` |
| GRANT corretivo | `supabase/migrations/20260704161000_grant_has_role_execute.sql` |
| Trigger novo usuário | `handle_new_user` → role `student` automático |
