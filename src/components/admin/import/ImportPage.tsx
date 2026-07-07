import { useMemo, useState, type ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Copy,
  Eye,
  FileText,
  PlayCircle,
  Upload as UploadIcon,
  type LucideIcon,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { logEvent } from "@/lib/log";
import {
  applyImportBatch,
  IMPORT_COLUMN_HELP,
  validateImportFile,
  type ImportReport,
} from "@/lib/import";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AdminTableBody } from "@/components/admin/shared/AdminTableBody";
import { toast } from "sonner";

const PREVIEW_ROWS = 5;
const IMPORT_STEPS = 7;
const IMPORT_BATCH_LIMIT = 30;
const pageShellClass = "mx-auto space-y-8 2xl:max-w-[1600px]";

const WARNING_BADGE_CLASS =
  "border-warning/50 bg-warning/5 font-medium text-warning hover:bg-warning/5";

type ImportBatchRow = {
  id: string;
  filename: string;
  status: string;
  created_at: string;
  report?: {
    counts?: {
      total?: number;
      valid?: number;
      invalid?: number;
      duplicates?: number;
      warnings?: number;
    };
    analysis_ms?: number;
    invalid?: ImportReport["invalid"];
    duplicates?: ImportReport["duplicates"];
    warnings?: ImportReport["warnings"];
    rows?: ImportReport["valid"];
  };
  packages?: { name?: string } | null;
  package_versions?: { version?: string } | null;
  profiles?: { full_name?: string; email?: string } | null;
};

type StatCounts = {
  total: number;
  valid: number;
  invalid: number;
  duplicates: number;
  warnings: number;
  ms: number;
};

function computeImportStep(
  courseId: string,
  pkg: string,
  ver: string,
  file: File | null,
  report: ImportReport | null,
): number {
  if (!courseId) return 1;
  if (!pkg) return 2;
  if (!ver) return 3;
  if (!file) return 4;
  if (!report) return 5;
  if (report.valid.length > 0) return 7;
  return 6;
}

export function ImportPage() {
  const qc = useQueryClient();
  const [courseId, setCourseId] = useState("");
  const [pkg, setPkg] = useState("");
  const [ver, setVer] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [report, setReport] = useState<ImportReport | null>(null);
  const [busy, setBusy] = useState(false);
  const [reportBatch, setReportBatch] = useState<ImportBatchRow | null>(null);
  const [applyBatch, setApplyBatch] = useState<ImportBatchRow | null>(null);

  const selectionReady = !!courseId && !!pkg && !!ver;
  const currentStep = computeImportStep(courseId, pkg, ver, file, report);
  const progressValue = Math.round((currentStep / IMPORT_STEPS) * 100);

  const {
    data: courses = [],
    isError: coursesError,
    isLoading: coursesLoading,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase.from("courses").select("id,name").order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

  const {
    data: packages = [],
    isError: packagesError,
    isLoading: packagesLoading,
  } = useQuery({
    queryKey: ["packages", courseId],
    enabled: !!courseId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("packages")
        .select("id,name")
        .eq("course_id", courseId)
        .order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

  const {
    data: versions = [],
    isError: versionsError,
    isLoading: versionsLoading,
  } = useQuery({
    queryKey: ["package_versions", pkg],
    enabled: !!pkg,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("package_versions")
        .select("id,version")
        .eq("package_id", pkg)
        .order("version");
      if (error) throw error;
      return data ?? [];
    },
  });

  const {
    data: batches,
    isLoading: batchesLoading,
    isError: batchesError,
    error: batchesQueryError,
  } = useQuery({
    queryKey: ["import_batches"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("import_batches")
        .select("*, packages(name), package_versions(version)")
        .order("created_at", { ascending: false })
        .limit(IMPORT_BATCH_LIMIT);
      if (error) throw error;
      if (!data?.length) return [];

      const userIds = [...new Set(data.map((b) => b.created_by).filter(Boolean))] as string[];
      if (!userIds.length) return data;

      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", userIds);

      const profileById = new Map((profiles ?? []).map((p) => [p.id, p]));
      return data.map((b) => ({
        ...b,
        profiles: b.created_by ? profileById.get(b.created_by) ?? null : null,
      }));
    },
  });

  const counts = useMemo<StatCounts>(
    () => ({
      total: report?.counts.total ?? 0,
      valid: report?.counts.valid ?? 0,
      invalid: report?.counts.invalid ?? 0,
      duplicates: report?.counts.duplicates ?? 0,
      warnings: report?.counts.warnings ?? 0,
      ms: report?.analysisMs ?? 0,
    }),
    [report],
  );

  const selectionQueryError = coursesError || packagesError || versionsError;

  async function handleValidate() {
    if (!selectionReady) return toast.error("Selecione curso, pacote e versão antes de validar.");
    if (!file) return toast.error("Selecione um arquivo.");
    setBusy(true);
    try {
      const result = await validateImportFile(file);
      setReport(result);
      if (result.missingColumns.length) {
        toast.error(`Colunas obrigatórias ausentes: ${result.missingColumns.join(", ")}`);
      } else {
        toast.success(`Analisadas ${result.totalLines} linhas em ${result.analysisMs} ms`);
      }
      await logEvent("import.validate", "import_batches", null, {
        filename: file.name,
        counts: result.counts,
      });
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Erro na validação.");
    } finally {
      setBusy(false);
    }
  }

  async function handleSave() {
    if (!selectionReady || !file || !report) {
      return toast.error("Preencha curso, pacote, versão, arquivo e valide antes de salvar.");
    }
    if (report.missingColumns.length) {
      return toast.error("Corrija as colunas obrigatórias antes de salvar.");
    }
    if (!report.valid.length) {
      return toast.error("Nenhuma linha válida para salvar.");
    }
    setBusy(true);
    const { data: user } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("import_batches")
      .insert({
        package_id: pkg,
        package_version_id: ver,
        filename: file.name,
        file_type: file.name.split(".").pop() ?? "",
        status: "pending",
        created_by: user.user?.id ?? null,
        report: {
          counts: report.counts,
          analysis_ms: report.analysisMs,
          course_id: courseId,
          rows: report.valid,
          invalid: report.invalid,
          duplicates: report.duplicates,
          warnings: report.warnings,
        },
      })
      .select("id")
      .single();
    setBusy(false);
    if (error) return toast.error(error.message);
    await logEvent("import.save", "import_batches", data.id, {
      filename: file.name,
      counts: report.counts,
    });
    toast.success("Lote salvo para revisão");
    qc.invalidateQueries({ queryKey: ["import_batches"] });
    setReport(null);
    setFile(null);
  }

  const apply = useMutation({
    mutationFn: async (batchId: string) => {
      const result = await applyImportBatch(batchId);
      await logEvent("import.apply", "import_batches", batchId, { count: result.count });
      return result.count;
    },
    onSuccess: (n) => {
      toast.success(`${n} questões aplicadas`);
      setApplyBatch(null);
      qc.invalidateQueries({ queryKey: ["import_batches"] });
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Erro ao aplicar."),
  });

  const cancel = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("import_batches").update({ status: "cancelled" }).eq("id", id);
      if (error) throw error;
      await logEvent("import.cancel", "import_batches", id);
    },
    onSuccess: () => {
      toast.success("Lote cancelado");
      qc.invalidateQueries({ queryKey: ["import_batches"] });
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Erro ao cancelar."),
  });

  return (
    <div className={pageShellClass}>
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Importação</h1>
        <p className="text-sm text-muted-foreground">
          Curso → Pacote → Versão → Arquivo → Validar → Relatório → Salvar lote → Aplicar ao banco.
        </p>
      </header>

      <section className="space-y-2" aria-label="Progresso da importação">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Etapa {currentStep} de {IMPORT_STEPS}</span>
          <span className="text-muted-foreground tabular-nums">{progressValue}%</span>
        </div>
        <Progress value={progressValue} aria-label={`Etapa ${currentStep} de ${IMPORT_STEPS}`} />
      </section>

      <section className="space-y-6" aria-label="Seleção do destino">
        <Card>
          <CardHeader>
            <CardTitle>Seleção</CardTitle>
            <CardDescription>Escolha curso, pacote e versão de destino.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectionQueryError && (
              <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
                <span>Não foi possível carregar as opções de seleção.</span>
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Curso</Label>
                <Select
                  value={courseId}
                  onValueChange={(v) => {
                    setCourseId(v);
                    setPkg("");
                    setVer("");
                    setReport(null);
                  }}
                  disabled={coursesLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Pacote</Label>
                <Select
                  value={pkg}
                  onValueChange={(v) => {
                    setPkg(v);
                    setVer("");
                    setReport(null);
                  }}
                  disabled={!courseId || packagesLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {packages.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Versão</Label>
                <Select
                  value={ver}
                  onValueChange={(v) => {
                    setVer(v);
                    setReport(null);
                  }}
                  disabled={!pkg || versionsLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {versions.map((v) => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.version}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section aria-label="Arquivo">
        <Card>
          <CardHeader>
            <CardTitle>Arquivo</CardTitle>
            <CardDescription>Envie um arquivo CSV, XLSX ou JSON para validação.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Label htmlFor="import-file">Arquivo (CSV / XLSX / JSON)</Label>
            <Input
              id="import-file"
              type="file"
              accept=".csv,.xlsx,.xls,.json"
              onChange={(e) => {
                setFile(e.target.files?.[0] ?? null);
                setReport(null);
              }}
            />
            <p className="text-xs text-muted-foreground">{IMPORT_COLUMN_HELP}</p>
          </CardContent>
        </Card>
      </section>

      <section className="flex flex-wrap gap-2" aria-label="Ações de validação">
        <Button
          variant="secondary"
          onClick={handleValidate}
          disabled={!file || !selectionReady || busy}
          aria-busy={busy}
        >
          <UploadIcon className="h-4 w-4 mr-2" aria-hidden="true" />
          {busy ? "Validando..." : "Validar"}
        </Button>
        <Button
          onClick={handleSave}
          disabled={
            !report || !report.valid.length || report.missingColumns.length > 0 || busy
          }
          aria-busy={busy}
        >
          {busy ? "Salvando..." : "Salvar lote"}
        </Button>
      </section>

      {report && (
        <section className="space-y-6" aria-label="Relatório e preview">
          <ImportReportSection report={report} counts={counts} />
          {report.valid.length > 0 && (
            <PreviewSection rows={report.valid.slice(0, PREVIEW_ROWS)} total={report.valid.length} />
          )}
        </section>
      )}

      <ImportHistorySection
        batches={batches as ImportBatchRow[] | undefined}
        batchesLoading={batchesLoading}
        batchesError={batchesError}
        batchesQueryError={batchesQueryError as Error | null}
        onViewReport={setReportBatch}
        onApply={setApplyBatch}
        onCancel={(id) => cancel.mutate(id)}
        applyPending={apply.isPending}
        cancelPending={cancel.isPending}
      />

      <BatchReportDialog batch={reportBatch} onClose={() => setReportBatch(null)} />

      <AlertDialog
        open={!!applyBatch}
        onOpenChange={(o) => {
          if (!o) setApplyBatch(null);
        }}
      >
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Aplicar lote ao banco?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3 text-sm">
                <p>
                  O lote <strong>{applyBatch?.filename}</strong> irá inserir{" "}
                  <strong>{applyBatch?.report?.counts?.valid ?? 0}</strong> questões no banco.
                  Taxonomia ausente será criada automaticamente.
                </p>
                {applyBatch?.report?.rows && applyBatch.report.rows.length > 0 && (
                  <PreviewSection
                    rows={applyBatch.report.rows.slice(0, PREVIEW_ROWS)}
                    total={applyBatch.report.rows.length}
                    compact
                  />
                )}
                <p className="text-muted-foreground">
                  Em caso de falha durante a aplicação, as questões já inseridas serão revertidas.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => applyBatch && apply.mutate(applyBatch.id)}
              disabled={apply.isPending}
            >
              Confirmar aplicação
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ImportStatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: ReactNode;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-lg border bg-card p-5 shadow">
      <div className="flex items-start justify-between gap-2">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </div>
      </div>
      <div className="mt-3 text-2xl font-semibold tabular-nums tracking-tight">{value}</div>
    </div>
  );
}

function ImportStatGrid({ counts }: { counts: StatCounts }) {
  return (
    <div className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <ImportStatCard icon={FileText} label="Linhas" value={counts.total} />
      <ImportStatCard icon={CheckCircle2} label="Válidas" value={counts.valid} />
      <ImportStatCard icon={Copy} label="Duplicadas" value={counts.duplicates} />
      <ImportStatCard icon={AlertCircle} label="Inválidas" value={counts.invalid} />
      <ImportStatCard icon={AlertTriangle} label="Avisos" value={counts.warnings} />
      <ImportStatCard icon={Clock} label="Tempo" value={`${counts.ms} ms`} />
    </div>
  );
}

function ImportIssueDetails({
  invalid = [],
  duplicates = [],
  warnings = [],
}: {
  invalid?: ImportReport["invalid"];
  duplicates?: ImportReport["duplicates"];
  warnings?: ImportReport["warnings"];
}) {
  const hasIssues = invalid.length > 0 || duplicates.length > 0 || warnings.length > 0;
  if (!hasIssues) {
    return (
      <p className="text-sm text-muted-foreground">Sem erros, duplicatas ou avisos registrados.</p>
    );
  }

  return (
    <div className="rounded-lg border">
      <div className="border-b p-3 text-sm font-medium">Detalhes (erros, duplicatas e avisos)</div>
      <div className="max-h-80 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[4rem]">Linha</TableHead>
              <TableHead className="min-w-[6rem]">Tipo</TableHead>
              <TableHead className="min-w-[8rem]">Campo</TableHead>
              <TableHead>Descrição</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invalid.flatMap((r) =>
              r.errors.map((e, i) => (
                <TableRow key={`err-${r.line}-${i}`}>
                  <TableCell className="tabular-nums">{r.line}</TableCell>
                  <TableCell>
                    <Badge variant="destructive">Erro</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{e.field}</TableCell>
                  <TableCell>{e.message}</TableCell>
                </TableRow>
              )),
            )}
            {duplicates.map((d) => (
              <TableRow key={`dup-${d.line}`}>
                <TableCell className="tabular-nums">{d.line}</TableCell>
                <TableCell>
                  <Badge variant="secondary">Duplicata</Badge>
                </TableCell>
                <TableCell className="font-mono text-xs">statement</TableCell>
                <TableCell>{d.reason}</TableCell>
              </TableRow>
            ))}
            {warnings.map((w, i) => (
              <TableRow key={`warn-${w.line}-${i}`}>
                <TableCell className="tabular-nums">{w.line}</TableCell>
                <TableCell>
                  <Badge className={WARNING_BADGE_CLASS}>Aviso</Badge>
                </TableCell>
                <TableCell className="font-mono text-xs">{w.field}</TableCell>
                <TableCell>{w.message}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function ImportReportSection({
  report,
  counts,
}: {
  report: ImportReport;
  counts: StatCounts;
}) {
  const hasIssues =
    report.missingColumns.length > 0 ||
    report.invalid.length > 0 ||
    report.duplicates.length > 0 ||
    report.warnings.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Relatório completo</CardTitle>
        <CardDescription>Resultado da validação do arquivo enviado.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {report.missingColumns.length > 0 && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-3 text-sm">
            <p className="font-medium text-destructive">Colunas obrigatórias ausentes:</p>
            <p className="mt-1 font-mono text-xs">{report.missingColumns.join(", ")}</p>
          </div>
        )}

        <ImportStatGrid counts={counts} />

        {hasIssues && !report.missingColumns.length && (
          <ImportIssueDetails
            invalid={report.invalid}
            duplicates={report.duplicates}
            warnings={report.warnings}
          />
        )}
      </CardContent>
    </Card>
  );
}

function PreviewSection({
  rows,
  total,
  compact = false,
}: {
  rows: ImportReport["valid"];
  total: number;
  compact?: boolean;
}) {
  return (
    <Card className={compact ? "border shadow-none" : undefined}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Eye className="h-4 w-4" aria-hidden="true" />
          Preview — {rows.length} de {total} linhas válidas
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[3rem]">#</TableHead>
                <TableHead className="min-w-[12rem]">Enunciado</TableHead>
                <TableHead className="min-w-[5rem]">Gabarito</TableHead>
                <TableHead className="min-w-[8rem]">Disciplina</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.__line}>
                  <TableCell className="tabular-nums">{r.__line}</TableCell>
                  <TableCell className="max-w-md truncate text-sm">{r.statement}</TableCell>
                  <TableCell className="font-mono tabular-nums">{r.correct_answer}</TableCell>
                  <TableCell className="truncate text-sm">{r.subject}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function BatchReportDialog({
  batch,
  onClose,
}: {
  batch: ImportBatchRow | null;
  onClose: () => void;
}) {
  const counts: StatCounts = {
    total: batch?.report?.counts?.total ?? 0,
    valid: batch?.report?.counts?.valid ?? 0,
    invalid: batch?.report?.counts?.invalid ?? 0,
    duplicates: batch?.report?.counts?.duplicates ?? 0,
    warnings: batch?.report?.counts?.warnings ?? 0,
    ms: batch?.report?.analysis_ms ?? 0,
  };

  return (
    <Dialog
      open={!!batch}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Relatório — {batch?.filename}</DialogTitle>
          <DialogDescription>Detalhamento completo do lote salvo.</DialogDescription>
        </DialogHeader>
        {batch && (
          <div className="max-h-[70vh] space-y-4 overflow-auto">
            <ImportStatGrid counts={counts} />

            {batch.report?.rows && batch.report.rows.length > 0 && (
              <PreviewSection
                rows={batch.report.rows.slice(0, PREVIEW_ROWS)}
                total={batch.report.rows.length}
                compact
              />
            )}

            <ImportIssueDetails
              invalid={batch.report?.invalid}
              duplicates={batch.report?.duplicates}
              warnings={batch.report?.warnings}
            />
          </div>
        )}
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ImportHistorySection({
  batches,
  batchesLoading,
  batchesError,
  batchesQueryError,
  onViewReport,
  onApply,
  onCancel,
  applyPending,
  cancelPending,
}: {
  batches?: ImportBatchRow[];
  batchesLoading: boolean;
  batchesError: boolean;
  batchesQueryError: Error | null;
  onViewReport: (batch: ImportBatchRow) => void;
  onApply: (batch: ImportBatchRow) => void;
  onCancel: (id: string) => void;
  applyPending: boolean;
  cancelPending: boolean;
}) {
  const showsLimitNotice =
    !batchesLoading && !batchesError && batches?.length === IMPORT_BATCH_LIMIT;

  return (
    <section aria-label="Histórico de importações">
      <Card>
        <CardHeader>
          <CardTitle>Histórico de importações</CardTitle>
          <CardDescription>Lotes salvos e ações de revisão ou aplicação.</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky left-0 z-20 min-w-[10rem] bg-card">
                    Arquivo
                  </TableHead>
                  <TableHead className="min-w-[9rem]">Pacote / Versão</TableHead>
                  <TableHead className="min-w-[8rem]">Administrador</TableHead>
                  <TableHead className="min-w-[4rem]">Total</TableHead>
                  <TableHead className="min-w-[4rem]">Válidas</TableHead>
                  <TableHead className="min-w-[4rem]">Dupl.</TableHead>
                  <TableHead className="min-w-[4rem]">Inv.</TableHead>
                  <TableHead className="min-w-[4rem]">Avisos</TableHead>
                  <TableHead className="sticky right-[12rem] z-10 min-w-[6rem] bg-card">
                    Status
                  </TableHead>
                  <TableHead className="min-w-[8rem]">Data</TableHead>
                  <TableHead className="sticky right-0 z-20 min-w-[12rem] bg-card text-right">
                    Ações
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AdminTableBody
                  colSpan={11}
                  isLoading={batchesLoading}
                  isError={batchesError}
                  error={batchesQueryError}
                  isEmpty={!batches?.length}
                  emptyMessage="Nenhum lote registrado."
                  formatError={() => "Não foi possível carregar os lotes de importação."}
                >
                  {batches?.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell className="sticky left-0 z-20 max-w-[220px] truncate bg-card font-medium">
                        {b.filename}
                      </TableCell>
                      <TableCell className="max-w-[12rem] truncate text-xs">
                        {b.packages?.name ?? "—"} / {b.package_versions?.version ?? "—"}
                      </TableCell>
                      <TableCell className="max-w-[10rem] truncate text-xs">
                        {b.profiles?.full_name ?? b.profiles?.email ?? "—"}
                      </TableCell>
                      <TableCell className="tabular-nums">
                        {b.report?.counts?.total ?? "—"}
                      </TableCell>
                      <TableCell className="tabular-nums">
                        {b.report?.counts?.valid ?? "—"}
                      </TableCell>
                      <TableCell className="tabular-nums">
                        {b.report?.counts?.duplicates ?? "—"}
                      </TableCell>
                      <TableCell className="tabular-nums">
                        {b.report?.counts?.invalid ?? "—"}
                      </TableCell>
                      <TableCell className="tabular-nums">
                        {b.report?.counts?.warnings ?? "—"}
                      </TableCell>
                      <TableCell className="sticky right-[12rem] z-10 bg-card">
                        <Badge
                          variant={
                            b.status === "applied"
                              ? "default"
                              : b.status === "cancelled"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {b.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-xs tabular-nums">
                        {new Date(b.created_at).toLocaleString("pt-BR")}
                      </TableCell>
                      <TableCell className="sticky right-0 z-20 bg-card text-right">
                        <div className="flex flex-wrap justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onViewReport(b)}
                          >
                            <Eye className="h-4 w-4 mr-1" aria-hidden="true" />
                            Relatório
                          </Button>
                          {b.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => onApply(b)}
                                disabled={applyPending}
                              >
                                <PlayCircle className="h-4 w-4 mr-1" aria-hidden="true" />
                                Aplicar
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => onCancel(b.id)}
                                disabled={cancelPending}
                              >
                                Cancelar
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </AdminTableBody>
              </TableBody>
            </Table>
          </div>
          {showsLimitNotice && (
            <p className="mt-3 text-xs text-muted-foreground" role="note">
              Mostrando os {IMPORT_BATCH_LIMIT} lotes mais recentes.
            </p>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
