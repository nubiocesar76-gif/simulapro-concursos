import { Star, Pin, XCircle } from "lucide-react";
import type { StudyFilterIndicators } from "@/lib/student-dashboard";

type StudyFilterIndicatorsProps = {
  indicators: StudyFilterIndicators;
};

export function StudyFilterIndicatorsBar({ indicators }: StudyFilterIndicatorsProps) {
  const items = [
    { label: "Favoritas", value: indicators.favoritesCount, icon: Star },
    { label: "Revisar depois", value: indicators.reviewLaterCount, icon: Pin },
    { label: "Pendentes de revisão", value: indicators.pendingReviewCount, icon: XCircle },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="inline-flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm"
          >
            <Icon className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">{item.label}</span>
            <span className="font-semibold">{item.value}</span>
          </div>
        );
      })}
    </div>
  );
}
