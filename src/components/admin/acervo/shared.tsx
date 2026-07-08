import { cn } from "@/lib/utils";
import type { AcervoPipelineStage, CatalogExamStatus } from "@/lib/acervo/types";

const pageShellClass = "mx-auto space-y-8 2xl:max-w-[1600px]";

export function AcervoPageShell({ children }: { children: React.ReactNode }) {
  return <div className={pageShellClass}>{children}</div>;
}

const STATUS_LABELS: Record<CatalogExamStatus, string> = {
  PLANNED: "Planejada",
  DOWNLOADED: "Baixada",
  PROCESSING: "Processando",
  REVIEW: "Em revisão",
  APPROVED: "Aprovada",
  IMPORTED: "Importada",
  PUBLISHED: "Publicada",
};

const STATUS_VARIANT: Record<CatalogExamStatus, "default" | "secondary" | "outline"> = {
  PLANNED: "outline",
  DOWNLOADED: "secondary",
  PROCESSING: "secondary",
  REVIEW: "secondary",
  APPROVED: "default",
  IMPORTED: "default",
  PUBLISHED: "default",
};

export function catalogStatusLabel(status: CatalogExamStatus) {
  return STATUS_LABELS[status] ?? status;
}

export function CatalogStatusBadge({
  status,
  className,
}: {
  status: CatalogExamStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        STATUS_VARIANT[status] === "default" && "border-transparent bg-primary text-primary-foreground",
        STATUS_VARIANT[status] === "secondary" && "border-transparent bg-secondary text-secondary-foreground",
        STATUS_VARIANT[status] === "outline" && "text-foreground",
        className,
      )}
    >
      {catalogStatusLabel(status)}
    </span>
  );
}

export const PIPELINE_STAGE_LABELS: Record<AcervoPipelineStage, string> = {
  PLANNED: "Planejada",
  VERIFIED: "Verificada",
  DOWNLOADED: "Baixada",
  TEXT_EXTRACTED: "Texto extraído",
  QUESTIONS_GENERATED: "Questões geradas",
  REVIEW: "Revisão",
  APPROVED: "Aprovada",
  IMPORTED: "Importada",
  PUBLISHED: "Publicada",
};
