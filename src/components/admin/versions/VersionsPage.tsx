import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Rocket } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { logEvent } from "@/lib/log";
import {
  formatVersionError,
  validateReleaseNotes,
  validateVersionDescription,
  validateVersionName,
  validateVersionNumber,
  VERSION_STATUS_EDITABLE,
  VERSION_STATUS_LABELS,
  type VersionStatus,
  type VersionStatusEditable,
} from "@/lib/versions";
import { formatPublishError, publishPackageVersion } from "@/lib/publish";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
import { toast } from "sonner";
import {
  TAXONOMY_PAGE_SIZE,
  formatDate,
  useDebouncedSearch,
  TaxonomySearch,
  TaxonomyPagination,
  type DeleteDep,
  hasDeleteDeps,
} from "@/components/admin/taxonomy/shared";

type VersionRow = Tables<"package_versions"> & {
  packages: { name: string; course_id: string; courses: { name: string } | null } | null;
  publisher: { full_name: string | null; email: string | null } | null;
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function fetchVersionDeps(versionId: string): Promise<DeleteDep[]> {
  const [questions, batches] = await Promise.all([
    supabase.from("questions").select("*", { count: "exact", head: true }).eq("package_version_id", versionId),
    supabase.from("import_batches").select("*", { count: "exact", head: true }).eq("package_version_id", versionId),
  ]);
  return [
    { label: "questão(ões) vinculada(s)", count: questions.count ?? 0 },
    { label: "lote(s) de importação vinculado(s)", count: batches.count ?? 0 },
  ];
}

function statusBadgeVariant(status: VersionStatus): "default" | "secondary" | "outline" | "destructive" {
  if (status === "PUBLISHED") return "default";
  if (status === "READY") return "secondary";
  if (status === "ARCHIVED") return "outline";
  return "outline";
}

export function VersionsPage() {
  const qc = useQueryClient();
  const { search, setSearch, debouncedSearch, page, setPage } = useDebouncedSearch();
  const [courseFilter, setCourseFilter] = useState("all");
  const [packageFilter, setPackageFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<VersionRow | null>(null);
  const [packageId, setPackageId] = useState("");
  const [versionNumber, setVersionNumber] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [releaseNotes, setReleaseNotes] = useState("");
  const [status, setStatus] = useState<VersionStatusEditable>("DRAFT");
  const [deleteTarget, setDeleteTarget] = useState<VersionRow | null>(null);
  const [deleteDeps, setDeleteDeps] = useState<DeleteDep[] | null>(null);
  const [publishTarget, setPublishTarget] = useState<VersionRow | null>(null);

  const { data: courses = [] } = useQuery({
    queryKey: ["courses", "options"],
    queryFn: async () => {
      const { data, error } = await supabase.from("courses").select("id,name").order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: packages = [] } = useQuery({
    queryKey: ["packages", "options", courseFilter],
    queryFn: async () => {
      let q = supabase.from("packages").select("id,name,course_id").order("name");
      if (courseFilter !== "all") q = q.eq("course_id", courseFilter);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });

  useEffect(() => {
    if (!dialogOpen) return;
    if (editing) {
      setPackageId(editing.package_id);
      setVersionNumber(editing.version_number);
      setName(editing.name);
      setDescription(editing.description ?? "");
      setReleaseNotes(editing.release_notes ?? "");
      const current = editing.status as VersionStatus;
      setStatus(current === "READY" ? "READY" : "DRAFT");
    } else {
      setPackageId(packageFilter !== "all" ? packageFilter : "");
      setVersionNumber("");
      setName("");
      setDescription("");
      setReleaseNotes("");
      setStatus("DRAFT");
    }
  }, [dialogOpen, editing, packageFilter]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["package_versions", debouncedSearch, page, courseFilter, packageFilter, statusFilter],
    queryFn: async () => {
      const from = page * TAXONOMY_PAGE_SIZE;
      const to = from + TAXONOMY_PAGE_SIZE - 1;
      let q = supabase
        .from("package_versions")
        .select("*, packages!inner(name, course_id, courses(name))", { count: "exact" })
        .order("version_number", { ascending: true })
        .range(from, to);

      if (courseFilter !== "all") q = q.eq("packages.course_id", courseFilter);
      if (packageFilter !== "all") q = q.eq("package_id", packageFilter);
      if (statusFilter !== "all") q = q.eq("status", statusFilter as VersionStatus);

      if (debouncedSearch) {
        const term = `%${debouncedSearch}%`;
        q = q.or(`name.ilike.${term},version_number.ilike.${term},description.ilike.${term}`);
      }

      const { data: rows, error: qError, count } = await q;
      if (qError) throw qError;

      const publisherIds = [
        ...new Set((rows ?? []).map((r) => r.published_by).filter((id): id is string => !!id)),
      ];
      const publisherById = new Map<string, { full_name: string | null; email: string | null }>();
      if (publisherIds.length) {
        const { data: publishers, error: publisherError } = await supabase
          .from("profiles")
          .select("id, full_name, email")
          .in("id", publisherIds);
        if (publisherError) throw publisherError;
        for (const profile of publishers ?? []) {
          publisherById.set(profile.id, {
            full_name: profile.full_name,
            email: profile.email,
          });
        }
      }

      const enrichedRows: VersionRow[] = (rows ?? []).map((row) => ({
        ...row,
        publisher: row.published_by ? publisherById.get(row.published_by) ?? null : null,
      }));

      return { rows: enrichedRows, total: count ?? 0 };
    },
  });

  const rows = data?.rows ?? [];
  const total = data?.total ?? 0;
  const isPublishedLocked = editing?.status === "PUBLISHED" || editing?.status === "ARCHIVED";

  const save = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const payload = {
        package_id: packageId,
        version_number: validateVersionNumber(versionNumber),
        name: validateVersionName(name),
        description: validateVersionDescription(description),
        release_notes: validateReleaseNotes(releaseNotes),
        status: isPublishedLocked ? (editing!.status as VersionStatus) : status,
        version: validateVersionNumber(versionNumber),
        notes: validateReleaseNotes(releaseNotes),
      };
      if (!payload.package_id) throw new Error("Pacote é obrigatório.");

      const dupQuery = supabase
        .from("package_versions")
        .select("id")
        .eq("package_id", payload.package_id)
        .ilike("version_number", payload.version_number)
        .limit(1);
      const { data: existing } = editing?.id
        ? await dupQuery.neq("id", editing.id)
        : await dupQuery;
      if (existing?.length) throw new Error("Já existe uma versão com este número neste pacote.");

      if (editing?.id) {
        const { error: updateError } = await supabase
          .from("package_versions")
          .update({ ...payload, updated_by: user?.id ?? null })
          .eq("id", editing.id);
        if (updateError) throw updateError;
        await logEvent("version.update", "package_versions", editing.id, {
          version_number: payload.version_number,
          name: payload.name,
        });
        return;
      }

      const { data: created, error: insertError } = await supabase
        .from("package_versions")
        .insert({
          ...payload,
          published: false,
          created_by: user?.id ?? null,
          updated_by: user?.id ?? null,
        })
        .select("id")
        .single();
      if (insertError) throw insertError;
      await logEvent("version.create", "package_versions", created.id, {
        version_number: payload.version_number,
        name: payload.name,
      });
    },
    onSuccess: () => {
      toast.success(editing ? "Versão atualizada." : "Versão criada.");
      qc.invalidateQueries({ queryKey: ["package_versions"] });
      setDialogOpen(false);
      setEditing(null);
    },
    onError: (e: Error) => toast.error(formatVersionError(e.message)),
  });

  const publish = useMutation({
    mutationFn: (row: VersionRow) => publishPackageVersion(row.id),
    onSuccess: () => {
      toast.success("Versão publicada com sucesso.");
      qc.invalidateQueries({ queryKey: ["package_versions"] });
      setPublishTarget(null);
    },
    onError: (e: unknown) => toast.error(formatPublishError(e)),
  });

  const remove = useMutation({
    mutationFn: async (row: VersionRow) => {
      if (row.status === "PUBLISHED") {
        throw new Error("Versões publicadas não podem ser excluídas nesta etapa.");
      }
      const deps = await fetchVersionDeps(row.id);
      if (hasDeleteDeps(deps)) {
        throw new Error("Não é possível excluir: remova questões e lotes de importação vinculados primeiro.");
      }
      const { error: deleteError } = await supabase.from("package_versions").delete().eq("id", row.id);
      if (deleteError) throw deleteError;
      await logEvent("version.delete", "package_versions", row.id, {
        version_number: row.version_number,
        name: row.name,
      });
    },
    onSuccess: () => {
      toast.success("Versão excluída.");
      qc.invalidateQueries({ queryKey: ["package_versions"] });
      setDeleteTarget(null);
      setDeleteDeps(null);
      if (page > 0 && rows.length === 1) setPage((p) => p - 1);
    },
    onError: (e: Error) => toast.error(formatVersionError(e.message)),
  });

  const deleteBlocked = deleteDeps ? hasDeleteDeps(deleteDeps) : false;

  async function openDeleteDialog(row: VersionRow) {
    setDeleteDeps(await fetchVersionDeps(row.id));
    setDeleteTarget(row);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Versões</h1>
          <p className="text-sm text-muted-foreground">
            Edições congeladas de um pacote. Versões Prontas podem ser publicadas para distribuição.
          </p>
        </div>
        <Button onClick={() => { setEditing(null); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Nova versão
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <TaxonomySearch
          value={search}
          onChange={setSearch}
          placeholder="Buscar por nome ou número da versão..."
        />
        <Select value={courseFilter} onValueChange={(v) => { setCourseFilter(v); setPackageFilter("all"); setPage(0); }}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Curso" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os cursos</SelectItem>
            {courses.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={packageFilter} onValueChange={(v) => { setPackageFilter(v); setPage(0); }}>
          <SelectTrigger className="w-full sm:w-52">
            <SelectValue placeholder="Pacote" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os pacotes</SelectItem>
            {packages.map((p) => (
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(0); }}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            {VERSION_STATUS_EDITABLE.map((s) => (
              <SelectItem key={s} value={s}>{VERSION_STATUS_LABELS[s]}</SelectItem>
            ))}
            <SelectItem value="PUBLISHED">{VERSION_STATUS_LABELS.PUBLISHED}</SelectItem>
            <SelectItem value="ARCHIVED">{VERSION_STATUS_LABELS.ARCHIVED}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Versão</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Pacote</TableHead>
              <TableHead>Curso</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-36">Publicado em</TableHead>
              <TableHead className="w-32">Publicado por</TableHead>
              <TableHead className="w-28">Criado em</TableHead>
              <TableHead className="w-32 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="py-8 text-center text-muted-foreground">Carregando...</TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={9} className="py-8 text-center text-destructive">
                  {(error as Error)?.message ?? "Erro ao carregar versões."}
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="py-8 text-center text-muted-foreground">
                  Nenhuma versão encontrada.
                </TableCell>
              </TableRow>
            ) : rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-mono font-medium">{row.version_number}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell className="text-sm">{row.packages?.name ?? "—"}</TableCell>
                <TableCell className="text-sm">{row.packages?.courses?.name ?? "—"}</TableCell>
                <TableCell>
                  <Badge variant={statusBadgeVariant((row.status as VersionStatus) ?? "DRAFT")}>
                    {VERSION_STATUS_LABELS[(row.status as VersionStatus) ?? "DRAFT"]}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {row.published_at ? formatDateTime(row.published_at) : "—"}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {row.publisher?.full_name ?? row.publisher?.email ?? "—"}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{formatDate(row.created_at)}</TableCell>
                <TableCell className="text-right space-x-1">
                  {row.status === "READY" && (
                    <Button size="sm" variant="outline" onClick={() => setPublishTarget(row)}>
                      <Rocket className="h-3.5 w-3.5 mr-1" /> Publicar
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => { setEditing(row); setDialogOpen(true); }}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openDeleteDialog(row)}
                    disabled={row.status === "PUBLISHED"}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <TaxonomyPagination page={page} total={total} onPageChange={setPage} />

      <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) setEditing(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar versão" : "Nova versão"}</DialogTitle>
            <DialogDescription>
              Número semântico manual (ex.: 1.0, 1.1, 2026.1). Único por pacote.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div>
              <Label>Pacote *</Label>
              <Select value={packageId} onValueChange={setPackageId} disabled={!!editing}>
                <SelectTrigger><SelectValue placeholder="Selecione o pacote" /></SelectTrigger>
                <SelectContent>
                  {packages.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Número da versão *</Label>
                <Input
                  value={versionNumber}
                  onChange={(e) => setVersionNumber(e.target.value)}
                  placeholder="Ex.: 1.0"
                  disabled={!!editing}
                />
              </div>
              <div>
                <Label>Status</Label>
                {isPublishedLocked ? (
                  <p className="text-sm py-2">
                    {VERSION_STATUS_LABELS[editing!.status as VersionStatus]}
                  </p>
                ) : (
                  <Select value={status} onValueChange={(v) => setStatus(v as VersionStatusEditable)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {VERSION_STATUS_EDITABLE.map((s) => (
                        <SelectItem key={s} value={s}>{VERSION_STATUS_LABELS[s]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
            <div>
              <Label>Nome *</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Edição inicial 2026" />
            </div>
            <div>
              <Label>Descrição</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
            </div>
            <div>
              <Label>Notas de release</Label>
              <Textarea value={releaseNotes} onChange={(e) => setReleaseNotes(e.target.value)} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={() => save.mutate()} disabled={save.isPending}>
              {save.isPending ? "Salvando..." : editing ? "Salvar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => { if (!o) { setDeleteTarget(null); setDeleteDeps(null); } }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {deleteTarget?.status === "PUBLISHED"
                ? "Exclusão bloqueada"
                : deleteBlocked
                  ? "Exclusão bloqueada"
                  : "Excluir versão?"}
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2 text-sm">
                {deleteTarget?.status === "PUBLISHED" ? (
                  <p>Versões publicadas não podem ser excluídas.</p>
                ) : deleteBlocked ? (
                  <>
                    <p>
                      A versão <strong>{deleteTarget?.version_number}</strong> possui vínculos:
                    </p>
                    <ul className="list-disc pl-5">
                      {deleteDeps?.filter((d) => d.count > 0).map((d) => (
                        <li key={d.label}>{d.count} {d.label}</li>
                      ))}
                    </ul>
                    <p>Remova os vínculos antes de excluir.</p>
                  </>
                ) : (
                  <p>
                    Tem certeza que deseja excluir a versão <strong>{deleteTarget?.version_number}</strong> ({deleteTarget?.name})?
                  </p>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Fechar</AlertDialogCancel>
            {!deleteBlocked && deleteTarget?.status !== "PUBLISHED" && (
              <AlertDialogAction
                onClick={() => deleteTarget && remove.mutate(deleteTarget)}
                disabled={remove.isPending}
              >
                Excluir
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!publishTarget} onOpenChange={(o) => { if (!o) setPublishTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Publicar versão {publishTarget?.version_number}?</AlertDialogTitle>
            <AlertDialogDescription>
              Após a publicação esta versão ficará disponível para distribuição e não poderá ser publicada novamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => publishTarget && publish.mutate(publishTarget)}
              disabled={publish.isPending}
            >
              <Rocket className="h-4 w-4 mr-2" /> Confirmar publicação
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
