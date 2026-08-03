import { GraduationCap } from "lucide-react";
import type { DashboardDistribution } from "@/lib/student-dashboard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ActiveCargoHeaderProps = {
  distributions: DashboardDistribution[];
  activeDistributionId: string;
  onChangeActiveDistribution: (distributionId: string) => void;
};

/**
 * Cabeçalho "Área/Cargo ativos" + seletor "Trocar Cargo", exibido só quando o aluno tem
 * assinatura ativa. Puramente de exibição: reaproveita `distribution_id` (mecanismo de
 * isolamento já homologado) só para rotular qual cargo está em foco no topo da página —
 * não recorta as estatísticas agregadas do Dashboard (essas continuam somando todas as
 * distribuições ativas, decisão de produto já registrada como "Perfil Ativo" futuro).
 */
export function ActiveCargoHeader({
  distributions,
  activeDistributionId,
  onChangeActiveDistribution,
}: ActiveCargoHeaderProps) {
  const active =
    distributions.find((d) => d.distribution_id === activeDistributionId) ?? distributions[0];
  if (!active) return null;

  const distinctCargoCount = new Set(distributions.map((d) => d.positionName ?? d.distribution_id))
    .size;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--ds-radius-lg)] border border-[color:var(--ds-color-border)] bg-[color:var(--ds-color-surface)] px-4 py-3">
      <div className="flex items-center gap-2 text-sm">
        <GraduationCap
          className="h-4 w-4 shrink-0 text-[color:var(--ds-color-action)]"
          aria-hidden="true"
        />
        <span className="text-[color:var(--ds-color-text-secondary)]">Área</span>
        <span className="font-medium text-[color:var(--ds-color-text-primary)]">
          {active.course_name}
        </span>
        <span className="text-[color:var(--ds-color-text-secondary)]">·</span>
        <span className="text-[color:var(--ds-color-text-secondary)]">Cargo</span>
        <span className="font-medium text-[color:var(--ds-color-text-primary)]">
          {active.positionName ?? "—"}
        </span>
      </div>

      {distinctCargoCount > 1 && (
        <Select value={active.distribution_id} onValueChange={onChangeActiveDistribution}>
          <SelectTrigger className="w-auto min-w-[10rem]" aria-label="Trocar cargo">
            <SelectValue placeholder="Trocar cargo" />
          </SelectTrigger>
          <SelectContent>
            {distributions.map((d) => (
              <SelectItem key={d.distribution_id} value={d.distribution_id}>
                {d.positionName ?? d.distribution_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
