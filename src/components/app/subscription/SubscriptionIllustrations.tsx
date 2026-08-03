import { Check, Gift, ShieldCheck } from "lucide-react";

/**
 * Ilustrações puramente decorativas (SVG inline, sem dependências novas) para o
 * redesign premium da tela "Minha assinatura" — blob com gradiente + ícone. Nenhuma
 * lógica, só apresentação; reaproveitadas em SubscriptionPage.tsx e
 * SubscriptionOnboardingFlow.tsx.
 */

export function ActivePlanIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 160"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="active-plan-blob" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
      </defs>
      <circle cx="80" cy="80" r="72" fill="url(#active-plan-blob)" opacity="0.14" />
      <circle cx="80" cy="80" r="52" fill="url(#active-plan-blob)" opacity="0.22" />
      <circle cx="80" cy="80" r="34" fill="url(#active-plan-blob)" />
      <foreignObject x="62" y="62" width="36" height="36">
        <div className="flex h-full w-full items-center justify-center">
          <ShieldCheck className="h-5 w-5 text-white" aria-hidden="true" />
        </div>
      </foreignObject>
    </svg>
  );
}

export function FreePlanIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 160"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="free-plan-blob" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
      </defs>
      <circle cx="80" cy="80" r="72" fill="url(#free-plan-blob)" opacity="0.12" />
      <circle cx="80" cy="80" r="50" fill="url(#free-plan-blob)" opacity="0.2" />
      <circle cx="80" cy="80" r="32" fill="url(#free-plan-blob)" />
      <foreignObject x="64" y="64" width="32" height="32">
        <div className="flex h-full w-full items-center justify-center">
          <Gift className="h-5 w-5 text-white" aria-hidden="true" />
        </div>
      </foreignObject>
    </svg>
  );
}

export function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2 text-sm">
      <span
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
        style={{ background: "#DBEAFE" }}
      >
        <Check className="h-3 w-3" style={{ color: "#2563EB" }} aria-hidden="true" />
      </span>
      <span>{children}</span>
    </li>
  );
}
