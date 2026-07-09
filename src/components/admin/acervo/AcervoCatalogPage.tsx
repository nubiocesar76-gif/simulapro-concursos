import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Eye, Archive, CheckCircle2, FileQuestion, Library, Upload } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listAcervoCatalog, importAcervoCatalogCsvFn } from "@/lib/acervo/acervo.functions";
import { toast } from "sonner";
import {
  useDebouncedSearch,
  TaxonomySearch,
  TaxonomyPagination,
  TAXONOMY_PAGE_SIZE,
} from "@/components/admin/taxonomy/shared";
import { AdminTableBody } from "@/components/admin/shared/AdminTableBody";
import { AcervoPageShell, CatalogStatusBadge } from "./shared";

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card>
      <CardContent className="flex h-full flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 text-sm text-muted-foreground">{title}</div>
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </div>
        </div>
        <div className="mt-auto pt-3 text-2xl font-semibold tabular-nums tracking-tight">
          {value}
        </div>
      </CardContent>
    </Card>
  );
}

export function AcervoCatalogPage() {
  const queryClient = useQueryClient();
  const catalogQuery = useQuery({
    queryKey: ["acervo", "catalog"],
    queryFn: () => listAcervoCatalog(),
  });

  const importMutation = useMutation({
    mutationFn: () => importAcervoCatalogCsvFn(),
    onSuccess: (result) => {
      const summary = `${result.inserted} inseridas, ${result.updated} atualizadas`;
      if (result.errors.length > 0) {
        toast.warning(`${summary}. ${result.skipped} ignoradas.`);
      } else {
        toast.success(`Catálogo importado: ${summary}.`);
      }
      void queryClient.invalidateQueries({ queryKey: ["acervo", "catalog"] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Falha ao importar catálogo.");
    },
  });

  const exams = catalogQuery.data?.exams ?? [];
  const stats = catalogQuery.data?.stats ?? {
    totalExams: 0,
    publishedExams: 0,
    importedQuestions: 0,
    reviewedQuestions: 0,
  };
  const { search, setSearch, debouncedSearch, page, setPage } = useDebouncedSearch();

  const filtered = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    if (!q) return exams;
    return exams.filter((exam) =>
      [
        exam.id,
        exam.organization,
        exam.contest,
        exam.board,
        exam.position,
        String(exam.year),
        exam.status,
      ].some((field) => field.toLowerCase().includes(q)),
    );
  }, [exams, debouncedSearch]);

  const pageItems = filtered.slice(page * TAXONOMY_PAGE_SIZE, (page + 1) * TAXONOMY_PAGE_SIZE);

  return (
    <AcervoPageShell>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Acervo</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Centro de Produção Editorial — catálogo oficial de provas (Enfermagem)
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => importMutation.mutate()}
          disabled={importMutation.isPending}
        >
          <Upload className="mr-1.5 h-4 w-4" aria-hidden="true" />
          {importMutation.isPending ? "Importando…" : "Importar Catálogo CSV"}
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total de provas" value={stats.totalExams} icon={Archive} />
        <StatCard title="Provas publicadas" value={stats.publishedExams} icon={CheckCircle2} />
        <StatCard title="Questões importadas" value={stats.importedQuestions} icon={Library} />
        <StatCard title="Questões revisadas" value={stats.reviewedQuestions} icon={FileQuestion} />
      </div>

      <Card>
        <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base">Catálogo de Provas</CardTitle>
          <TaxonomySearch value={search} onChange={setSearch} placeholder="Buscar prova..." />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Órgão</TableHead>
                  <TableHead>Concurso</TableHead>
                  <TableHead>Ano</TableHead>
                  <TableHead>Banca</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead className="text-right">Questões</TableHead>
                  <TableHead className="text-right">Revisadas</TableHead>
                  <TableHead className="text-right">Publicadas</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AdminTableBody
                  colSpan={10}
                  isLoading={catalogQuery.isLoading}
                  isError={catalogQuery.isError}
                  error={catalogQuery.error}
                  isEmpty={pageItems.length === 0}
                  emptyMessage="Nenhuma prova cadastrada no catálogo."
                  filteredEmptyMessage="Nenhuma prova encontrada para a busca."
                  hasActiveFilters={!!debouncedSearch}
                >
                  {pageItems.map((exam) => (
                    <TableRow key={exam.id}>
                      <TableCell>
                        <CatalogStatusBadge status={exam.status} />
                      </TableCell>
                      <TableCell className="font-medium">{exam.organization}</TableCell>
                      <TableCell>{exam.contest}</TableCell>
                      <TableCell>{exam.year || "—"}</TableCell>
                      <TableCell>{exam.board}</TableCell>
                      <TableCell>{exam.position}</TableCell>
                      <TableCell className="text-right tabular-nums">{exam.questions}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {exam.reviewed ? exam.questions : 0}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {exam.status === "PUBLISHED" ? exam.questions : 0}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to="/admin/acervo/$examId" params={{ examId: exam.id }}>
                            <Eye className="mr-1.5 h-4 w-4" aria-hidden="true" />
                            Ver
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </AdminTableBody>
              </TableBody>
            </Table>
          </div>

          <TaxonomyPagination page={page} total={filtered.length} onPageChange={setPage} />
        </CardContent>
      </Card>
    </AcervoPageShell>
  );
}
