# Segurança de Variáveis de Ambiente

**Sprint:** 5.1B — Correção de Segurança Pré-Deploy
**Motivação:** o arquivo `.env` estava versionado no Git (commit `c4a208c`, já presente em `origin/main`), sem entrada correspondente no `.gitignore`. Este documento fixa o inventário de variáveis, onde cada uma é configurada, e a política de resposta a essa exposição.

---

## 1. Quais variáveis existem

| Variável | Onde é lida | Exposta no bundle do cliente? | Natureza |
|---|---|---|---|
| `VITE_SUPABASE_URL` | `src/integrations/supabase/client.ts`, `client.server.ts` | Sim (prefixo `VITE_`) | Pública por design — URL do projeto Supabase |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `src/integrations/supabase/client.ts` | Sim (prefixo `VITE_`) | Pública por design — chave `sb_publishable_*`, equivalente à antiga `anon key`, protegida por RLS |
| `SUPABASE_PROJECT_ID` | `.env` (metadado, não referenciado em código de runtime) | Não | Baixa sensibilidade — identificador do projeto |
| `SUPABASE_SERVICE_ROLE_KEY` | `src/integrations/supabase/client.server.ts` | **Não — nunca** | **Secreta.** Ignora RLS. Uso exclusivo em `.server.ts` |
| `ASAAS_API_KEY` | `src/integrations/asaas/config.server.ts` | **Não — nunca** | **Secreta.** Autentica todas as chamadas à API do Asaas |
| `ASAAS_ENVIRONMENT` | `src/integrations/asaas/config.server.ts` (`sandbox` \| `production`) | Não | Configuração, não secreto |
| `ASAAS_WEBHOOK_SECRET` | `src/integrations/asaas/config.server.ts`, validado em `src/lib/asaas-webhook.server.ts` | **Não — nunca** | **Secreta.** Comparada via `timingSafeEqual` contra o header `asaas-access-token` |
| `APP_URL` | `src/integrations/asaas/config.server.ts` | Não | Configuração. **Achado (herdado da Sprint 5.1A):** validada como obrigatória mas não consumida em nenhum outro ponto do código — dead config, não é um risco de segurança, mas deve ser revisada antes do Go Live (usar para montar a URL do webhook, ou remover a exigência) |

Confirmado nesta sprint (busca em todo `src/`): nenhuma variável secreta aparece hardcoded em código-fonte. As únicas ocorrências de `sb_publishable_`/`sb_secret_` são checagens de prefixo (`value.startsWith(...)`), não chaves reais. As URLs `sandbox.asaas.com`/`api.asaas.com` hardcoded em `config.server.ts` são endpoints públicos da API, não segredos.

## 2. Onde configurar — hospedagem da aplicação

O projeto é gerado a partir de `@lovable.dev/vite-tanstack-config` (ver `vite.config.ts`), com build via Nitro usando **Cloudflare como target padrão** (`.output/server/wrangler.json` é gerado a cada `vite build`; existe diretório local `.wrangler/`). Não há `vercel.json` nem `wrangler.toml` no repositório, e o único script de build é `vite build`.

**Divergência a registrar:** a Sprint 5.1B solicitou instruções para configurar variáveis "onde configurar (Vercel)", mas nada nesta base de código indica Vercel como plataforma de deploy — a evidência aponta para publicação via **Lovable Cloud / Cloudflare**. Para não documentar um caminho que não existe de fato:

- Se o deploy real for feito pelo painel de publicação do **Lovable Cloud**, as variáveis de servidor (`SUPABASE_SERVICE_ROLE_KEY`, `ASAAS_API_KEY`, `ASAAS_ENVIRONMENT`, `ASAAS_WEBHOOK_SECRET`, `APP_URL`) devem ser cadastradas nas configurações de ambiente/secrets desse painel — não em um projeto Vercel.
- Se em algum momento a equipe migrar o deploy para a Vercel de fato, todas as variáveis marcadas como "Secreta" na tabela acima devem ser cadastradas em **Project Settings → Environment Variables**, com escopo Production (e Preview separado, se sandbox for testado por lá), nunca commitadas.
- Em qualquer plataforma: variáveis sem prefixo `VITE_` nunca devem ser expostas como build-time public env — são lidas só em `process.env` dentro de código `.server.ts`.

## 3. Onde configurar — Supabase

Painel do projeto em `supabase.com/dashboard/project/ddgpkijytvagmabtttor` → **Project Settings → API**:

- `VITE_SUPABASE_URL` = "Project URL"
- `VITE_SUPABASE_PUBLISHABLE_KEY` = chave `publishable` (nova nomenclatura Supabase, substitui a `anon key`)
- `SUPABASE_SERVICE_ROLE_KEY` = chave `service_role` (aba "API keys", seção secreta) — nunca colar em `VITE_*`, nunca colar em código, nunca compartilhar fora do cofre de secrets da plataforma de deploy

Como o projeto foi criado via Lovable ("Connect Supabase in Lovable Cloud", mensagem de erro presente em `client.ts`/`client.server.ts`), a conexão inicial entre app e projeto Supabase é tipicamente gerenciada pela integração Lovable Cloud — o painel Supabase continua sendo a fonte de verdade para rotacionar/consultar as chaves em si.

## 4. Onde configurar — Asaas

Painel do Asaas (sandbox: `sandbox.asaas.com`; produção: `www.asaas.com`), ambientes **totalmente separados** com chaves próprias:

- `ASAAS_API_KEY` → **Configurações → Integrações → API** — gerar/copiar a chave do ambiente correspondente (sandbox ou produção). Nunca reutilizar a mesma chave nos dois ambientes.
- `ASAAS_ENVIRONMENT` → definido no lado da aplicação (`sandbox` ou `production`), não no painel Asaas — precisa corresponder à chave usada em `ASAAS_API_KEY`.
- `ASAAS_WEBHOOK_SECRET` → **Configurações → Integrações → Webhooks** — ao cadastrar a URL `https://{APP_URL}/api/webhooks/asaas`, o Asaas permite definir um token de autenticação; esse valor precisa ser **idêntico** ao configurado como `ASAAS_WEBHOOK_SECRET` no servidor (é o que `isAuthenticWebhookRequest` compara via `timingSafeEqual`).
- `APP_URL` → domínio público onde a aplicação está publicada, usado para montar a URL do webhook cadastrada no painel Asaas.

## 5. Boas práticas

- `.env` nunca é commitado — a partir desta sprint, `.env`, `.env.local`, `.env.development` e `.env.production` estão no `.gitignore` (ver seção 7).
- Segredos de servidor (`SUPABASE_SERVICE_ROLE_KEY`, `ASAAS_API_KEY`, `ASAAS_WEBHOOK_SECRET`) só existem como variável de ambiente da plataforma de deploy — nunca em código, nunca em `VITE_*`, nunca em log (`recordAsaasLog` em `asaas-webhook.server.ts` já foi auditado na Sprint 4.2E para nunca gravar esses valores).
- Sandbox e produção usam credenciais Asaas distintas — nunca testar em sandbox com a chave de produção nem vice-versa.
- Antes de cada deploy de produção, repetir a verificação já usada nas Sprints 4.2E/5.1A: rodar `vite build` e inspecionar `.output/public/**/*.js` em busca do nome de qualquer variável secreta ou de chamadas diretas à API do Asaas fora de `*.server.ts`.
- Acesso às chaves de produção (painel Supabase, painel Asaas, secrets da plataforma de deploy) restrito a quem realmente precisa — sem compartilhar por chat, e-mail ou arquivos fora de um cofre de senhas.

## 6. Política de rotação de chaves

**Rotação programada** (preventiva, sem incidente):
- `SUPABASE_SERVICE_ROLE_KEY`, `ASAAS_API_KEY`, `ASAAS_WEBHOOK_SECRET`: revisar a cada 6 meses ou na troca de qualquer pessoa com acesso a elas.
- Trocar a chave no painel de origem (Supabase/Asaas) primeiro, atualizar a variável na plataforma de deploy em seguida, validar com uma chamada de teste, só então invalidar a chave antiga (quando o provedor permitir revogação manual).

**Rotação imediata** (obrigatória, evento de exposição confirmada ou suspeita):
- Gerar nova chave no painel de origem.
- Atualizar a variável de ambiente na plataforma de deploy.
- Revogar/expirar a chave antiga no painel de origem assim que a nova estiver validada em produção.
- Registrar a rotação (data, motivo, quem executou) fora do repositório de código.

**Caso concreto desta sprint — `.env` exposto em `origin/main`:**
`SUPABASE_PROJECT_ID`, `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` são os únicos valores que estavam no `.env` versionado. Os dois primeiros são identificadores públicos por natureza (a URL do projeto e o `publishable key` já são enviados ao navegador em todo carregamento da aplicação — são protegidos por RLS, não por sigilo). Não há indício de que `SUPABASE_SERVICE_ROLE_KEY`, `ASAAS_API_KEY` ou `ASAAS_WEBHOOK_SECRET` tenham chegado a estar nesse arquivo. Ainda assim, como o repositório remoto não foi confirmado como privado (achado em aberto desde a Sprint 5.1A), recomenda-se por precaução:
- Rotacionar `VITE_SUPABASE_PUBLISHABLE_KEY` no painel Supabase, mesmo sendo uma chave "pública por design", encerrando definitivamente qualquer vínculo entre a chave em uso e o valor que ficou no histórico do Git.
- Confirmar a visibilidade (público/privado) do repositório no GitHub — decisão pendente, fora do escopo técnico desta sprint.

**Sobre o histórico do Git:** remover `.env` do rastreamento (`git rm --cached`, feito nesta sprint) impede que o arquivo continue mudando em commits futuros, mas **não apaga** o conteúdo já presente nos commits antigos (`c4a208c` em diante) nem no que já foi enviado a `origin/main`. Apagar esse histórico exigiria reescrita de histórico (`git filter-repo`/`BFG` + force-push) — uma operação destrutiva para todos os colaboradores do repositório, que não foi executada nesta sprint por estar fora do escopo autorizado ("não alterar código de negócio, não alterar banco, não criar migrations") e por exigir combinação prévia com o time antes de qualquer force-push. Como nenhuma credencial secreta (service role, Asaas) esteve nesse arquivo, o risco residual do histórico antigo é baixo — mas a decisão de reescrever o histórico do repositório fica registrada aqui como pendência, não como ação já tomada.

## 7. Ação técnica realizada nesta sprint

- `.gitignore` passou a ignorar `.env`, `.env.local`, `.env.development` e `.env.production`.
- `.env` foi removido do índice do Git (`git rm --cached .env`) — o arquivo continua no disco local, intacto, e continua funcionando para desenvolvimento; deixou apenas de ser rastreado/versionado a partir de agora.
- Nenhum commit foi criado por esta sprint — a remoção do rastreamento está apenas preparada (staged), para o time revisar e decidir quando commitar/enviar ao remoto.
