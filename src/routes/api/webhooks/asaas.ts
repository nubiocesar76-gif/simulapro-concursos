import { createFileRoute } from "@tanstack/react-router";
import { isAuthenticWebhookRequest, processAsaasWebhookEvent } from "@/lib/asaas-webhook.server";

// Endpoint público de webhook do Asaas. Sem tela, sem layout autenticado —
// autenticidade é garantida pelo header `asaas-access-token` (ASAAS_WEBHOOK_SECRET),
// não por sessão de usuário.
export const Route = createFileRoute("/api/webhooks/asaas")({
  server: {
    handlers: {
      // Sem um handler para os demais métodos, o TanStack Start deixa a requisição
      // cair no pipeline normal de SSR de página (esta rota não define `component`),
      // servindo o shell React e quebrando no cliente com "Invariant failed". `ANY`
      // é a chave reconhecida pelo framework para pegar qualquer método não listado
      // explicitamente (ver `handlers[requestMethod] ?? handlers["ANY"]` em
      // node_modules/@tanstack/start-server-core/dist/esm/createStartHandler.js) —
      // aqui ela intercepta GET/HEAD/PUT/etc. antes de chegarem ao renderizador de
      // página, sem afetar o handler de POST abaixo.
      ANY: () => new Response(null, { status: 405, headers: { Allow: "POST" } }),
      POST: async ({ request }) => {
        const contentType = request.headers.get("content-type") ?? "";
        if (!contentType.includes("application/json")) {
          return Response.json(
            { error: "Content-Type deve ser application/json." },
            { status: 415 },
          );
        }

        let isAuthentic: boolean;
        try {
          isAuthentic = isAuthenticWebhookRequest(request);
        } catch {
          // Variável de ambiente obrigatória ausente no servidor (ex.: ASAAS_WEBHOOK_SECRET).
          return Response.json({ error: "Webhook não configurado." }, { status: 503 });
        }
        if (!isAuthentic) {
          return Response.json({ error: "Requisição não autenticada." }, { status: 401 });
        }

        let payload: unknown;
        try {
          payload = await request.json();
        } catch {
          return Response.json(
            { error: "Corpo da requisição não é um JSON válido." },
            { status: 400 },
          );
        }

        if (
          typeof payload !== "object" ||
          payload === null ||
          typeof (payload as { event?: unknown }).event !== "string"
        ) {
          return Response.json({ error: "Payload sem campo 'event' válido." }, { status: 400 });
        }

        try {
          await processAsaasWebhookEvent(payload as Parameters<typeof processAsaasWebhookEvent>[0]);
        } catch (error) {
          console.error("[asaas webhook] erro ao processar evento", error);
          return Response.json({ error: "Erro ao processar evento." }, { status: 500 });
        }

        return Response.json({ received: true });
      },
    },
  },
});
