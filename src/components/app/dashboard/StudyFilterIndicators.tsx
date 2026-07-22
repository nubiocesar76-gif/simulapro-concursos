import { Star, Pin, XCircle } from "lucide-react";
import type { StudyFilterIndicators } from "@/lib/student-dashboard";
import type { FilterStudyMode } from "@/lib/study-session";
import { Badge, Button } from "@/components/design-system";
import { dsFontSize } from "@/styles/design-system/tokens";

type StudyFilterIndicatorsProps = {
  indicators: StudyFilterIndicators;
  onShortcutClick?: (mode: FilterStudyMode) => void;
  loadingShortcut?: FilterStudyMode | null;
};

export function StudyFilterIndicatorsBar({
  indicators,
  onShortcutClick,
  loadingShortcut = null,
}: StudyFilterIndicatorsProps) {
  const items: {
    label: string;
    value: number;
    icon: typeof Star;
    mode: FilterStudyMode;
  }[] = [
    { label: "Favoritas", value: indicators.favoritesCount, icon: Star, mode: "FAVORITES" },
    { label: "Revisar depois", value: indicators.reviewLaterCount, icon: Pin, mode: "REVIEW" },
    { label: "Erradas", value: indicators.pendingReviewCount, icon: XCircle, mode: "WRONG_ONLY" },
  ];

  return (
    <div className="flex flex-wrap gap-[var(--ds-space-3)]">
      {items.map((item) => {
        const Icon = item.icon;
        const isLoading = loadingShortcut === item.mode;
        const isDisabled = item.value === 0 || isLoading;
        const iconEl = (
          <Icon
            className="text-[color:var(--ds-color-action)]"
            aria-hidden="true"
            style={{ width: dsFontSize.base, height: dsFontSize.base }}
          />
        );

        return (
          <Button
            key={item.mode}
            type="button"
            variant="outline"
            loading={onShortcutClick ? isLoading : false}
            leftIcon={iconEl}
            onClick={onShortcutClick ? () => onShortcutClick(item.mode) : undefined}
            disabled={onShortcutClick ? isDisabled : true}
            aria-label={
              onShortcutClick && isDisabled && item.value === 0
                ? `${item.label}: nenhuma questão disponível`
                : onShortcutClick
                  ? `Iniciar sessão de ${item.label.toLowerCase()}`
                  : undefined
            }
          >
            <span>{item.label}</span>
            <Badge variant="secondary" className="tabular-nums">
              {item.value}
            </Badge>
          </Button>
        );
      })}
    </div>
  );
}
