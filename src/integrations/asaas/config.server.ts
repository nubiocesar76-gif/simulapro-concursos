// Server-only. Centralizes and validates Asaas environment configuration.
// Load inside server handlers/services only — route files and *.functions.ts ship to the client bundle.

export type AsaasEnvironment = "sandbox" | "production";

export type AsaasConfig = {
  apiKey: string;
  environment: AsaasEnvironment;
  baseUrl: string;
  webhookSecret: string;
  appUrl: string;
};

const SANDBOX_BASE_URL = "https://sandbox.asaas.com/api/v3";
const PRODUCTION_BASE_URL = "https://api.asaas.com/v3";

function parseEnvironment(value: string | undefined): AsaasEnvironment {
  if (value === "production") return "production";
  if (value === "sandbox") return "sandbox";
  throw new Error(
    `Variável ASAAS_ENVIRONMENT inválida: "${value ?? ""}". Use "sandbox" ou "production".`,
  );
}

function loadAsaasConfig(): AsaasConfig {
  const apiKey = process.env.ASAAS_API_KEY;
  const environmentRaw = process.env.ASAAS_ENVIRONMENT;
  const webhookSecret = process.env.ASAAS_WEBHOOK_SECRET;
  // APP_URL is the official variable; aliases below are read-only fallbacks for legacy/production setups.
  const appUrl =
    process.env.APP_URL ??
    process.env.URL_DO_APLICATIVO ??
    process.env.VITE_APP_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.PUBLIC_APP_URL;

  const missing = [
    ...(!apiKey ? ["ASAAS_API_KEY"] : []),
    ...(!environmentRaw ? ["ASAAS_ENVIRONMENT"] : []),
    ...(!webhookSecret ? ["ASAAS_WEBHOOK_SECRET"] : []),
    ...(!appUrl ? ["APP_URL"] : []),
  ];
  if (missing.length) {
    throw new Error(`Variável(is) de ambiente Asaas ausente(s): ${missing.join(", ")}.`);
  }

  const environment = parseEnvironment(environmentRaw);

  return {
    apiKey: apiKey!,
    environment,
    baseUrl: environment === "production" ? PRODUCTION_BASE_URL : SANDBOX_BASE_URL,
    webhookSecret: webhookSecret!,
    appUrl: appUrl!,
  };
}

let _config: AsaasConfig | undefined;

// Lazy + validated on first access, so importing this module never crashes
// a build or dev server before the variables are actually needed.
export function getAsaasConfig(): AsaasConfig {
  if (!_config) _config = loadAsaasConfig();
  return _config;
}
