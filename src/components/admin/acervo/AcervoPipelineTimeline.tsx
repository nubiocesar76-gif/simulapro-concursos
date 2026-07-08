import { ACERVO_PIPELINE_STAGES } from "@/lib/acervo/types";
import { PIPELINE_STAGE_LABELS } from "./shared";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import type { AcervoPipelineStage } from "@/lib/acervo/types";

type AcervoPipelineTimelineProps = {
  currentStage: AcervoPipelineStage;
};

export function AcervoPipelineTimeline({ currentStage }: AcervoPipelineTimelineProps) {
  const currentIndex = ACERVO_PIPELINE_STAGES.indexOf(currentStage);

  return (
    <ol className="space-y-0">
      {ACERVO_PIPELINE_STAGES.map((stage, index) => {
        const isComplete = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isUpcoming = index > currentIndex;

        return (
          <li key={stage} className="relative flex gap-4 pb-8 last:pb-0">
            {index < ACERVO_PIPELINE_STAGES.length - 1 && (
              <span
                className={cn(
                  "absolute left-4 top-8 h-[calc(100%-1rem)] w-px -translate-x-1/2",
                  isComplete ? "bg-primary" : "bg-border",
                )}
                aria-hidden="true"
              />
            )}
            <div
              className={cn(
                "relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border text-xs font-semibold",
                isComplete && "border-primary bg-primary text-primary-foreground",
                isCurrent && "border-primary bg-primary/10 text-primary ring-2 ring-primary/20",
                isUpcoming && "border-muted-foreground/30 bg-muted text-muted-foreground",
              )}
            >
              {isComplete ? <Check className="h-4 w-4" aria-hidden="true" /> : index + 1}
            </div>
            <div className="min-w-0 pt-1">
              <p
                className={cn(
                  "text-sm font-medium",
                  isCurrent && "text-primary",
                  isUpcoming && "text-muted-foreground",
                )}
              >
                {PIPELINE_STAGE_LABELS[stage]}
              </p>
              <p className="text-xs text-muted-foreground font-mono">{stage}</p>
              {isCurrent && (
                <p className="mt-1 text-xs text-primary">Estágio atual</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
