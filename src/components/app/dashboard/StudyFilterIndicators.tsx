import { Star, Pin, XCircle, Loader2 } from "lucide-react";
import type { StudyFilterIndicators } from "@/lib/student-dashboard";
import type { FilterStudyMode } from "@/lib/study-session";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
    <div className="flex flex-wrap gap-3">
      {items.map((item) => {
        const Icon = item.icon;
        const isLoading = loadingShortcut === item.mode;
        const isDisabled = item.value === 0 || isLoading;

        if (onShortcutClick) {
          return (
            <Button
              key={item.mode}
              type="button"
              variant="outline"
              className="h-9 gap-2"
              onClick={() => onShortcutClick(item.mode)}
              disabled={isDisabled}
              aria-busy={isLoading}
              aria-label={
                isDisabled && item.value === 0
                  ? `${item.label}: nenhuma questão disponível`
                  : `Iniciar sessão de ${item.label.toLowerCase()}`
              }
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden="true" />
              ) : (
                <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
              )}
              <span>{item.label}</span>
              <Badge variant="secondary" className="tabular-nums">
                {item.value}
              </Badge>
            </Button>
          );
        }

        return (
          <Button key={item.mode} type="button" variant="outline" className="h-9 gap-2" disabled>
            <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
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
