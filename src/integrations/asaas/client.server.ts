// Server-only HTTP client for the Asaas API.
// Base URL and auth header are resolved from AsaasConfig (sandbox vs. production).
// Sprint 4.2A: infrastructure only — no caller invokes this yet.

import { getAsaasConfig } from "./config.server";

export type AsaasRequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  body?: unknown;
};

export async function asaasFetch<T>({
  method = "GET",
  path,
  body,
}: AsaasRequestOptions): Promise<T> {
  const config = getAsaasConfig();

  const response = await fetch(`${config.baseUrl}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      access_token: config.apiKey,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Asaas API respondeu ${response.status}: ${text || response.statusText}`);
  }

  return (await response.json()) as T;
}
