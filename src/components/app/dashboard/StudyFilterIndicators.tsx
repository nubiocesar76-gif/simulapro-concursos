import { Star, Pin, XCircle, Loader2 } from "lucide-react";
import type { StudyFilterIndicators } from "@/lib/student-dashboard";
import type { FilterStudyMode } from "@/lib/study-session";

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
    {
      label: "Pendentes de revisão",
      value: indicators.pendingReviewCount,
      icon: XCircle,
      mode: "WRONG_ONLY",
    },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {items.map((item) => {
        const Icon = item.icon;
        const isLoading = loadingShortcut === item.mode;
        const className =
          "inline-flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm" +
          (onShortcutClick
            ? " cursor-pointer transition-colors hover:border-primary/40 hover:bg-primary/5"
            : "");

        const content = (
          <>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            ) : (
              <Icon className="h-4 w-4 text-primary" />
            )}
            <span className="text-muted-foreground">{item.label}</span>
            <span className="font-semibold">{item.value}</span>
          </>
        );

        if (onShortcutClick) {
          return (
            <button
              key={item.mode}
              type="button"
              className={className}
              onClick={() => onShortcutClick(item.mode)}
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {content}
            </button>
          );
        }

        return (
          <div key={item.mode} className={className}>
            {content}
          </div>
        );
      })}
    </div>
  );
}
