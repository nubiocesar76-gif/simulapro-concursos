import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { catalogStatusToPipelineStage } from "@/lib/acervo/catalog";
import { getAcervoExamDetail } from "@/lib/acervo/acervo.functions";
import { AcervoFilesSection } from "./AcervoFilesSection";
import { AcervoPipelineTimeline } from "./AcervoPipelineTimeline";
import { AcervoProductionSection } from "./AcervoProductionSection";
import { AcervoPageShell, CatalogStatusBadge } from "./shared";

type AcervoExamDetailPageProps = {
  examId: string;
};

export function AcervoExamDetailPage({ examId }: AcervoExamDetailPageProps) {
  const queryClient = useQueryClient();
  const detailQuery = useQuery({
    queryKey: ["acervo", "exam", examId],
    queryFn: () => getAcervoExamDetail({ data: { examId } }),
  });

  if (detailQuery.isLoading) {
    return (
      <AcervoPageShell>
        <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          Carregando prova…
        </div>
      </AcervoPageShell>
    );
  }

  if (detailQuery.isError) {
    return (
      <AcervoPageShell>
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            Não foi possível carregar os dados da prova.
          </CardContent>
        </Card>
      </AcervoPageShell>
    );
  }

  const exam = detailQuery.data?.exam;
  const manifest = detailQuery.data?.manifest ?? null;

  if (!exam) {
    return (
      <AcervoPageShell>
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            Prova não encontrada no catálogo.
          </CardContent>
        </Card>
      </AcervoPageShell>
    );
  }

  const pipelineStage = catalogStatusToPipelineStage(exam, manifest?.pipelineStage);

  function handleRegistered() {
    void queryClient.invalidateQueries({ queryKey: ["acervo", "exam", examId] });
    void queryClient.invalidateQueries({ queryKey: ["acervo", "catalog"] });
  }

  return (
    <AcervoPageShell>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <Button variant="ghost" size="sm" asChild className="-ml-2">
            <Link to="/admin/acervo">
              <ArrowLeft className="mr-1.5 h-4 w-4" aria-hidden="true" />
              Voltar ao catálogo
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {exam.organization} — {exam.year}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {exam.contest} · {exam.board} · {exam.position}
            </p>
          </div>
        </div>
        <CatalogStatusBadge status={exam.status} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Resumo</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <p className="text-muted-foreground">ID</p>
              <p className="font-mono font-medium">{exam.id}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Órgão</p>
              <p className="font-medium">{exam.organization}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Concurso</p>
              <p className="font-medium">{exam.contest}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Ano</p>
              <p className="font-medium">{exam.year || "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Banca</p>
              <p className="font-medium">{exam.board}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Cargo</p>
              <p className="font-medium">{exam.position}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Questões</p>
              <p className="font-medium tabular-nums">{exam.questions}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Verificada</p>
              <p className="font-medium">{exam.verified ? "Sim" : "Não"}</p>
            </div>
            {exam.observations && (
              <div className="sm:col-span-2">
                <p className="text-muted-foreground">Observações</p>
                <p>{exam.observations}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <AcervoPipelineTimeline currentStage={pipelineStage} />
          </CardContent>
        </Card>

        <AcervoFilesSection storageFolder={exam.storageFolder} manifest={manifest} />
        <AcervoProductionSection examId={examId} onRegistered={handleRegistered} />
      </div>
    </AcervoPageShell>
  );
}
