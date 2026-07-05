import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
import {
  CheckCircle2,
  AlertCircle,
  Copy,
  Upload as UploadIcon,
  PlayCircle,
  FileText,
  Clock,
  AlertTriangle,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

const PREVIEW_ROWS = 5;

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
    invalid?: ImportReport["invalid"];
    duplicates?: ImportReport["duplicates"];
    warnings?: ImportReport["warnings"];
    rows?: ImportReport["valid"];
  };
  packages?: { name?: string } | null;
  package_versions?: { version?: string } | null;
  profiles?: { full_name?: string; email?: string } | null;
};

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

  const { data: courses = [] } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => (await supabase.from("courses").select("id,name").order("name")).data ?? [],
  });
  const { data: packages = [] } = useQuery({
    queryKey: ["packages", courseId],
    enabled: !!courseId,
    queryFn: async () => (await supabase.from("packages").select("id,name").eq("course_id", courseId).order("name")).data ?? [],
  });
  const { data: versions = [] } = useQuery({
    queryKey: ["package_versions", pkg],
    enabled: !!pkg,
    queryFn: async () => (await supabase.from("package_versions").select("id,version").eq("package_id", pkg).order("version")).data ?? [],
  });
  const { data: batches = [] } = useQuery({
    queryKey: ["import_batches"],
    queryFn: async () => (await supabase
      .from("import_batches")
      .select("*, packages(name), package_versions(version), profiles:created_by(full_name,email)")
      .order("created_at", { ascending: false }).limit(30)).data ?? [],
  });

  const counts = useMemo(() => ({
    total: report?.counts.total ?? 0,
    valid: report?.counts.valid ?? 0,
    invalid: report?.counts.invalid ?? 0,
    duplicates: report?.counts.duplicates ?? 0,
    warnings: report?.counts.warnings ?? 0,
    ms: report?.analysisMs ?? 0,
  }), [report]);

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
    const { data, error } = await supabase.from("import_batches").insert({
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
    }).select("id").single();
    setBusy(false);
    if (error) return toast.error(error.message);
    await logEvent("import.save", "import_batches", data.id, { filename: file.name, counts: report.counts });
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Importação</h1>
        <p className="text-sm text-muted-foreground">
          Curso → Pacote → Versão → Arquivo → Validar → Relatório → Salvar lote → Aplicar ao banco.
        </p>
      </div>

      <div className="rounded-xl border bg-card p-6 space-y-4 max-w-4xl">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label>1. Curso</Label>
            <Select value={courseId} onValueChange={(v) => { setCourseId(v); setPkg(""); setVer(""); setReport(null); }}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {courses.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>2. Pacote</Label>
            <Select value={pkg} onValueChange={(v) => { setPkg(v); setVer(""); setReport(null); }} disabled={!courseId}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {packages.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>3. Versão</Label>
            <Select value={ver} onValueChange={(v) => { setVer(v); setReport(null); }} disabled={!pkg}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {versions.map((v) => <SelectItem key={v.id} value={v.id}>{v.version}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>4. Arquivo (CSV / XLSX / JSON)</Label>
          <Input
            type="file"
            accept=".csv,.xlsx,.xls,.json"
            onChange={(e) => { setFile(e.target.files?.[0] ?? null); setReport(null); }}
          />
          <p className="text-xs text-muted-foreground mt-1">{IMPORT_COLUMN_HELP}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={handleValidate} disabled={!file || !selectionReady || busy} aria-busy={busy}>
            <UploadIcon className="h-4 w-4 mr-2" />
            {busy ? "Validando..." : "5. Validar"}
          </Button>
          <Button onClick={handleSave} disabled={!report || !report.valid.length || report.missingColumns.length > 0 || busy} aria-busy={busy}>
            {busy ? "Salvando..." : "7. Salvar lote"}
          </Button>
        </div>

        {report && (
          <>
            <ImportReportSection report={report} counts={counts} />

            {report.valid.length > 0 && (
              <PreviewSection rows={report.valid.slice(0, PREVIEW_ROWS)} total={report.valid.length} />
            )}
          </>
        )}
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Histórico de importações</h2>
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Arquivo</TableHead>
                <TableHead>Pacote / Versão</TableHead>
                <TableHead>Administrador</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Válidas</TableHead>
                <TableHead>Dupl.</TableHead>
                <TableHead>Inv.</TableHead>
                <TableHead>Avisos</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batches.length === 0 ? (
                <TableRow><TableCell colSpan={11} className="text-center py-6 text-muted-foreground">Nenhum lote</TableCell></TableRow>
              ) : (batches as ImportBatchRow[]).map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="max-w-[220px] truncate">{b.filename}</TableCell>
                  <TableCell className="text-xs">{b.packages?.name ?? "—"} / {b.package_versions?.version ?? "—"}</TableCell>
                  <TableCell className="text-xs">{b.profiles?.full_name ?? b.profiles?.email ?? "—"}</TableCell>
                  <TableCell>{b.report?.counts?.total ?? "—"}</TableCell>
                  <TableCell>{b.report?.counts?.valid ?? "—"}</TableCell>
                  <TableCell>{b.report?.counts?.duplicates ?? "—"}</TableCell>
                  <TableCell>{b.report?.counts?.invalid ?? "—"}</TableCell>
                  <TableCell>{b.report?.counts?.warnings ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant={b.status === "applied" ? "default" : b.status === "cancelled" ? "destructive" : "secondary"}>
                      {b.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">{new Date(b.created_at).toLocaleString("pt-BR")}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button size="sm" variant="ghost" onClick={() => setReportBatch(b)}>
                      <Eye className="h-3.5 w-3.5 mr-1" /> Relatório
                    </Button>
                    {b.status === "pending" && (
                      <>
                        <Button size="sm" onClick={() => setApplyBatch(b)} disabled={apply.isPending}>
                          <PlayCircle className="h-3.5 w-3.5 mr-1" /> 8. Aplicar
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => cancel.mutate(b.id)} disabled={cancel.isPending}>
                          Cancelar
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <BatchReportDialog batch={reportBatch} onClose={() => setReportBatch(null)} />

      <AlertDialog open={!!applyBatch} onOpenChange={(o) => { if (!o) setApplyBatch(null); }}>
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

function ImportReportSection({
  report,
  counts,
}: {
  report: ImportReport;
  counts: { total: number; valid: number; invalid: number; duplicates: number; warnings: number; ms: number };
}) {
  const hasIssues = report.missingColumns.length > 0
    || report.invalid.length > 0
    || report.duplicates.length > 0
    || report.warnings.length > 0;

  return (
    <div className="space-y-3 pt-2">
      <p className="text-sm font-medium">6. Relatório completo</p>

      {report.missingColumns.length > 0 && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-3 text-sm">
          <p className="font-medium text-destructive">Colunas obrigatórias ausentes:</p>
          <p className="font-mono text-xs mt-1">{report.missingColumns.join(", ")}</p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <Stat icon={<FileText className="h-4 w-4" />} label="Linhas" value={counts.total} />
        <Stat icon={<CheckCircle2 className="h-4 w-4 text-primary" />} label="Válidas" value={counts.valid} />
        <Stat icon={<Copy className="h-4 w-4 text-muted-foreground" />} label="Duplicadas" value={counts.duplicates} />
        <Stat icon={<AlertCircle className="h-4 w-4 text-destructive" />} label="Inválidas" value={counts.invalid} />
        <Stat icon={<AlertTriangle className="h-4 w-4 text-amber-500" />} label="Avisos" value={counts.warnings} />
        <Stat icon={<Clock className="h-4 w-4" />} label="Tempo" value={`${counts.ms} ms`} />
      </div>

      {hasIssues && !report.missingColumns.length && (
        <div className="rounded-lg border">
          <div className="p-3 text-sm font-medium border-b">Detalhes (erros, duplicatas e avisos)</div>
          <div className="max-h-80 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Linha</TableHead>
                  <TableHead className="w-24">Tipo</TableHead>
                  <TableHead className="w-32">Campo</TableHead>
                  <TableHead>Descrição</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {report.invalid.flatMap((r) => r.errors.map((e, i) => (
                  <TableRow key={`err-${r.line}-${i}`}>
                    <TableCell>{r.line}</TableCell>
                    <TableCell><Badge variant="destructive">Erro</Badge></TableCell>
                    <TableCell className="font-mono text-xs">{e.field}</TableCell>
                    <TableCell>{e.message}</TableCell>
                  </TableRow>
                )))}
                {report.duplicates.map((d) => (
                  <TableRow key={`dup-${d.line}`}>
                    <TableCell>{d.line}</TableCell>
                    <TableCell><Badge variant="secondary">Duplicata</Badge></TableCell>
                    <TableCell className="font-mono text-xs">statement</TableCell>
                    <TableCell>{d.reason}</TableCell>
                  </TableRow>
                ))}
                {report.warnings.map((w, i) => (
                  <TableRow key={`warn-${w.line}-${i}`}>
                    <TableCell>{w.line}</TableCell>
                    <TableCell><Badge className="bg-amber-500/15 text-amber-700 hover:bg-amber-500/15">Aviso</Badge></TableCell>
                    <TableCell className="font-mono text-xs">{w.field}</TableCell>
                    <TableCell>{w.message}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
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
    <div className={`rounded-lg border ${compact ? "" : "bg-muted/30"}`}>
      <div className="p-3 text-sm font-medium border-b flex items-center gap-2">
        <Eye className="h-4 w-4" />
        Preview — {rows.length} de {total} linhas válidas
      </div>
      <div className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Enunciado</TableHead>
              <TableHead className="w-24">Gabarito</TableHead>
              <TableHead className="w-32">Disciplina</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.__line}>
                <TableCell>{r.__line}</TableCell>
                <TableCell className="max-w-md truncate text-xs">{r.statement}</TableCell>
                <TableCell className="font-mono">{r.correct_answer}</TableCell>
                <TableCell className="text-xs">{r.subject}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function BatchReportDialog({ batch, onClose }: { batch: ImportBatchRow | null; onClose: () => void }) {
  const counts = batch?.report?.counts;

  return (
    <Dialog open={!!batch} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Relatório — {batch?.filename}</DialogTitle>
          <DialogDescription>Detalhamento completo do lote salvo.</DialogDescription>
        </DialogHeader>
        {batch && (
          <div className="space-y-3 max-h-[70vh] overflow-auto">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <Stat label="Linhas" value={counts?.total ?? 0} />
              <Stat label="Válidas" value={counts?.valid ?? 0} />
              <Stat label="Duplicadas" value={counts?.duplicates ?? 0} />
              <Stat label="Inválidas" value={counts?.invalid ?? 0} />
              <Stat label="Avisos" value={counts?.warnings ?? 0} />
            </div>

            {batch.report?.rows && batch.report.rows.length > 0 && (
              <PreviewSection rows={batch.report.rows.slice(0, PREVIEW_ROWS)} total={batch.report.rows.length} compact />
            )}

            {(batch.report?.invalid?.length || batch.report?.duplicates?.length || batch.report?.warnings?.length) ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Linha</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Campo</TableHead>
                    <TableHead>Descrição</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(batch.report?.invalid ?? []).flatMap((r) => r.errors.map((e, i) => (
                    <TableRow key={`ri-${r.line}-${i}`}>
                      <TableCell>{r.line}</TableCell>
                      <TableCell><Badge variant="destructive">Erro</Badge></TableCell>
                      <TableCell className="font-mono text-xs">{e.field}</TableCell>
                      <TableCell>{e.message}</TableCell>
                    </TableRow>
                  )))}
                  {(batch.report?.duplicates ?? []).map((d) => (
                    <TableRow key={`rd-${d.line}`}>
                      <TableCell>{d.line}</TableCell>
                      <TableCell><Badge variant="secondary">Duplicata</Badge></TableCell>
                      <TableCell className="font-mono text-xs">statement</TableCell>
                      <TableCell>{d.reason}</TableCell>
                    </TableRow>
                  ))}
                  {(batch.report?.warnings ?? []).map((w, i) => (
                    <TableRow key={`rw-${w.line}-${i}`}>
                      <TableCell>{w.line}</TableCell>
                      <TableCell><Badge className="bg-amber-500/15 text-amber-700 hover:bg-amber-500/15">Aviso</Badge></TableCell>
                      <TableCell className="font-mono text-xs">{w.field}</TableCell>
                      <TableCell>{w.message}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground">Sem erros, duplicatas ou avisos registrados.</p>
            )}
          </div>
        )}
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Stat({ label, value, icon }: { label: string; value: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-background p-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">{icon}{label}</div>
      <div className="text-xl font-semibold mt-1">{value}</div>
    </div>
  );
}
