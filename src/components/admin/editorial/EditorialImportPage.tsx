import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  FileJson,
  FolderOpen,
  Loader2,
  Upload,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { AcervoPageShell } from "@/components/admin/acervo/shared";
import {
  importEditorialArchitectureFn,
  listEditorialImportLogsFn,
  listEditorialPackagesFn,
  previewEditorialImportFn,
} from "@/lib/editorial/editorial.functions";
import type { EntityPreviewCounts } from "@/lib/editorial/import/types";

function PreviewRow({
  label,
  counts,
}: {
  label: string;
  counts: EntityPreviewCounts;
}) {
  return (
    <TableRow>
      <TableCell className="font-medium">{label}</TableCell>
      <TableCell className="text-right tabular-nums">{counts.total}</TableCell>
      <TableCell className="text-right tabular-nums text-emerald-600">{counts.new}</TableCell>
      <TableCell className="text-right tabular-nums text-amber-600">{counts.updated}</TableCell>
      <TableCell className="text-right tabular-nums text-rose-600">{counts.removed}</TableCell>
      <TableCell className="text-right tabular-nums text-muted-foreground">
        {counts.unchanged}
      </TableCell>
    </TableRow>
  );
}

export function EditorialImportPage() {
  const queryClient = useQueryClient();
  const [packagePath, setPackagePath] = useState<string>("");

  const packagesQuery = useQuery({
    queryKey: ["editorial", "import", "packages"],
    queryFn: () => listEditorialPackagesFn(),
  });

  const logsQuery = useQuery({
    queryKey: ["editorial", "import", "logs"],
    queryFn: () => listEditorialImportLogsFn(),
  });

  useEffect(() => {
    if (!packagePath && packagesQuery.data?.[0]) {
      setPackagePath(packagesQuery.data[0].path);
    }
  }, [packagePath, packagesQuery.data]);

  const previewQuery = useQuery({
    queryKey: ["editorial", "import", "preview", packagePath],
    enabled: !!packagePath,
    queryFn: () => previewEditorialImportFn({ data: { packagePath } }),
  });

  const importMutation = useMutation({
    mutationFn: () => importEditorialArchitectureFn({ data: { packagePath } }),
    onSuccess: (result) => {
      toast.success(
        `Arquitetura importada em ${(result.durationMs / 1000).toFixed(1)}s — ativa e pronta para uso.`,
      );
      void queryClient.invalidateQueries({ queryKey: ["editorial"] });
      void queryClient.invalidateQueries({ queryKey: ["editorial", "import", "logs"] });
      void previewQuery.refetch();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Falha ao importar arquitetura.");
    },
  });

  const preview = previewQuery.data;
  const selectedPackage = packagesQuery.data?.find((p) => p.path === packagePath);

  return (
    <AcervoPageShell>
      <div className="space-y-2">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link to="/admin/acervo/editorial">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Voltar à Editorial Engine
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Importar Arquitetura</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Importação automática a partir de <code className="text-xs">docs/editorial/</code>.
            O Claude é o arquiteto — o sistema apenas valida e importa.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FolderOpen className="h-4 w-4" />
            1. Selecionar pasta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {packagesQuery.isLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Carregando pacotes…
            </div>
          ) : packagesQuery.data?.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum pacote com manifest.json encontrado em docs/editorial/.
            </p>
          ) : (
            <div className="flex flex-wrap items-end gap-4">
              <div className="min-w-[280px] flex-1 space-y-2">
                <label className="text-sm font-medium">Pacote editorial</label>
                <Select value={packagePath} onValueChange={setPackagePath}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a pasta" />
                  </SelectTrigger>
                  <SelectContent>
                    {packagesQuery.data?.map((pkg) => (
                      <SelectItem key={pkg.path} value={pkg.path}>
                        {pkg.label} ({pkg.path})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedPackage && (
                <div className="text-sm text-muted-foreground">
                  <div>
                    Engine: <strong>{selectedPackage.manifest.engine_version}</strong>
                  </div>
                  <div>
                    Versão: <strong>{selectedPackage.manifest.architecture_version}</strong>
                  </div>
                  <div>
                    {selectedPackage.manifest.course_slug} / {selectedPackage.manifest.position_slug}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileJson className="h-4 w-4" />
            2. Validação
          </CardTitle>
        </CardHeader>
        <CardContent>
          {previewQuery.isLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Lendo arquivos e validando…
            </div>
          )}
          {previewQuery.isError && (
            <p className="text-sm text-destructive">
              {previewQuery.error instanceof Error
                ? previewQuery.error.message
                : "Erro ao validar pacote."}
            </p>
          )}
          {preview && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                {preview.validation.valid ? (
                  <Badge variant="default" className="gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Validação OK
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="gap-1">
                    <XCircle className="h-3 w-3" />
                    {preview.validation.errors.length} erro(s)
                  </Badge>
                )}
                {preview.validation.warnings.length > 0 && (
                  <Badge variant="secondary" className="gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {preview.validation.warnings.length} aviso(s)
                  </Badge>
                )}
                <span className="text-sm text-muted-foreground">
                  {preview.filesRead.length} arquivo(s) lidos
                </span>
              </div>

              {preview.validation.errors.length > 0 && (
                <ul className="max-h-48 space-y-1 overflow-y-auto rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm">
                  {preview.validation.errors.map((issue, i) => (
                    <li key={`e-${i}`} className="text-destructive">
                      {issue.message}
                    </li>
                  ))}
                </ul>
              )}

              {preview.validation.warnings.length > 0 && (
                <ul className="max-h-32 space-y-1 overflow-y-auto rounded-md border p-3 text-sm text-muted-foreground">
                  {preview.validation.warnings.map((issue, i) => (
                    <li key={`w-${i}`}>{issue.message}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">3. Preview</CardTitle>
        </CardHeader>
        <CardContent>
          {preview && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Entidade</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Novos</TableHead>
                  <TableHead className="text-right">Atualizados</TableHead>
                  <TableHead className="text-right">Removidos</TableHead>
                  <TableHead className="text-right">Inalterados</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <PreviewRow label="Arquiteturas" counts={preview.counts.architectures} />
                <PreviewRow label="Disciplinas" counts={preview.counts.disciplines} />
                <PreviewRow label="Assuntos" counts={preview.counts.topics} />
                <PreviewRow label="Subassuntos" counts={preview.counts.subtopics} />
                <PreviewRow label="Palavras-chave" counts={preview.counts.keywords} />
                <PreviewRow label="Regras" counts={preview.counts.rules} />
                <PreviewRow label="Evidências" counts={preview.counts.evidence} />
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">4. Importar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Upsert sem apagar registros. Itens ausentes no pacote serão marcados como
            depreciados. A arquitetura importada ficará ativa ao concluir.
          </p>
          <Button
            onClick={() => importMutation.mutate()}
            disabled={
              !packagePath ||
              !preview?.validation.valid ||
              importMutation.isPending ||
              previewQuery.isLoading
            }
          >
            {importMutation.isPending ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-1.5 h-4 w-4" />
            )}
            {importMutation.isPending ? "Importando…" : "Importar Arquitetura"}
          </Button>
        </CardContent>
      </Card>

      {logsQuery.data && logsQuery.data.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Histórico de importações</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Pacote</TableHead>
                  <TableHead>Versão</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Tempo</TableHead>
                  <TableHead className="text-right">Registros</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logsQuery.data.map((log) => {
                  const counts = (log.record_counts ?? {}) as Record<string, number>;
                  const total =
                    (counts.disciplines ?? 0) +
                    (counts.topics ?? 0) +
                    (counts.subtopics ?? 0) +
                    (counts.keywords ?? 0) +
                    (counts.rules ?? 0);
                  return (
                    <TableRow key={log.id}>
                      <TableCell className="whitespace-nowrap text-sm">
                        {new Date(log.created_at).toLocaleString("pt-BR")}
                      </TableCell>
                      <TableCell className="text-sm">{log.package_path}</TableCell>
                      <TableCell className="text-sm">{log.architecture_version}</TableCell>
                      <TableCell>
                        <Badge variant={log.status === "SUCCESS" ? "default" : "destructive"}>
                          {log.status === "SUCCESS" ? "Sucesso" : "Falha"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-sm tabular-nums">
                        {(log.duration_ms / 1000).toFixed(1)}s
                      </TableCell>
                      <TableCell className="text-right text-sm tabular-nums">{total}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </AcervoPageShell>
  );
}
