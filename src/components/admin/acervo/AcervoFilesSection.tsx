import { CheckCircle2, CircleDashed } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WorkFileKey } from "@/lib/acervo/types";
import {
  formatAcervoDisplayPath,
  WORK_FILE_LABELS,
  WORK_FILE_PATHS,
} from "@/lib/acervo/work-manifest";
import type { WorkManifest } from "@/lib/acervo/types";
import { cn } from "@/lib/utils";

type AcervoFilesSectionProps = {
  storageFolder: string;
  manifest: WorkManifest | null;
};

const FILE_ORDER: WorkFileKey[] = [
  "prova",
  "gabarito",
  "edital",
  "rawMd",
  "questionsRaw",
  "questionsJson",
];

export function AcervoFilesSection({ storageFolder, manifest }: AcervoFilesSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Arquivos</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {FILE_ORDER.map((key) => {
            const exists = manifest?.files[key] ?? false;
            return (
              <li
                key={key}
                className="flex items-center justify-between gap-4 rounded-md border px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium">{WORK_FILE_LABELS[key]}</p>
                  <p className="truncate text-xs text-muted-foreground font-mono">
                    {formatAcervoDisplayPath(storageFolder, WORK_FILE_PATHS[key])}
                  </p>
                </div>
                <div
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 text-xs font-medium",
                    exists ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {exists ? (
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <CircleDashed className="h-4 w-4" aria-hidden="true" />
                  )}
                  {exists ? "Disponível" : "Ausente"}
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
