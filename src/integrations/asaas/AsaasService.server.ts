// Server-only. Central service for the Asaas integration.
// Sprint 4.2C: methods call the real Asaas API via `asaasFetch`. No business rule or
// access-control logic lives here — only the HTTP shape of each Asaas resource.

import { asaasFetch } from "./client.server";

export type AsaasCustomerInput = {
  name: string;
  email: string;
  cpfCnpj?: string;
  externalReference?: string;
};

export type AsaasCustomer = {
  id: string;
};

export type AsaasSubscriptionCycle = "MONTHLY" | "YEARLY";
export type AsaasBillingType = "BOLETO" | "CREDIT_CARD" | "PIX" | "UNDEFINED";

export type AsaasSubscriptionInput = {
  customerId: string;
  billingType: AsaasBillingType;
  value: number;
  /** "YYYY-MM-DD" */
  nextDueDate: string;
  cycle: AsaasSubscriptionCycle;
  externalReference?: string;
};

export type AsaasSubscription = {
  id: string;
  status: string;
  nextDueDate?: string;
  customer?: string;
  externalReference?: string;
  billingType?: AsaasBillingType;
};

export type AsaasPayment = {
  id: string;
  subscription?: string;
  status: string;
  invoiceUrl?: string;
  dueDate?: string;
};

type AsaasListResponse<T> = {
  data: T[];
  totalCount: number;
};

export const AsaasService = {
  async criarCliente(input: AsaasCustomerInput): Promise<AsaasCustomer> {
    return asaasFetch<AsaasCustomer>({
      method: "POST",
      path: "/customers",
      body: {
        name: input.name,
        email: input.email,
        cpfCnpj: input.cpfCnpj,
        externalReference: input.externalReference,
      },
    });
  },

  async criarAssinatura(input: AsaasSubscriptionInput): Promise<AsaasSubscription> {
    return asaasFetch<AsaasSubscription>({
      method: "POST",
      path: "/subscriptions",
      body: {
        customer: input.customerId,
        billingType: input.billingType,
        value: input.value,
        nextDueDate: input.nextDueDate,
        cycle: input.cycle,
        externalReference: input.externalReference,
      },
    });
  },

  async cancelarAssinatura(subscriptionId: string): Promise<void> {
    await asaasFetch<{ deleted: boolean; id: string }>({
      method: "DELETE",
      path: `/subscriptions/${subscriptionId}`,
    });
  },

  async consultarAssinatura(subscriptionId: string): Promise<AsaasSubscription> {
    return asaasFetch<AsaasSubscription>({
      method: "GET",
      path: `/subscriptions/${subscriptionId}`,
    });
  },

  // Busca por externalReference evita criar um cliente duplicado no Asaas para o
  // mesmo aluno, sem precisar guardar o ID do cliente no nosso banco.
  async buscarClientePorExternalReference(
    externalReference: string,
  ): Promise<AsaasCustomer | null> {
    const result = await asaasFetch<AsaasListResponse<AsaasCustomer>>({
      method: "GET",
      path: `/customers?externalReference=${encodeURIComponent(externalReference)}`,
    });
    return result.data[0] ?? null;
  },

  // Mesma lógica para assinatura: permite reconsultar o status ao vivo a partir só
  // do (user_id, distribution_id) locais, sem guardar o ID da assinatura no Asaas.
  async buscarAssinaturaPorExternalReference(
    externalReference: string,
  ): Promise<AsaasSubscription | null> {
    const result = await asaasFetch<AsaasListResponse<AsaasSubscription>>({
      method: "GET",
      path: `/subscriptions?externalReference=${encodeURIComponent(externalReference)}`,
    });
    return result.data[0] ?? null;
  },

  async buscarCobrancaMaisRecente(subscriptionId: string): Promise<AsaasPayment | null> {
    const result = await asaasFetch<AsaasListResponse<AsaasPayment>>({
      method: "GET",
      path: `/payments?subscription=${encodeURIComponent(subscriptionId)}&limit=1`,
    });
    return result.data[0] ?? null;
  },
};
