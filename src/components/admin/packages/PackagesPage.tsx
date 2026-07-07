import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { logEvent } from "@/lib/log";
import {
  formatPackageError,
  generatePackageSlug,
  PACKAGE_STATUS_LABELS,
  PACKAGE_STATUS_OPTIONS,
  validatePackageDescription,
  validatePackageName,
  type PackageStatus,
} from "@/lib/packages";
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
import { AdminTableBody } from "@/components/admin/shared/AdminTableBody";
import { AdminFiltersCard } from "@/components/admin/shared/AdminFiltersCard";

type PackageRow = Tables<"packages"> & { courses: { name: string } | null };

async function fetchPackageDeps(packageId: string): Promise<DeleteDep[]> {
  const [versions, questions, subscriptions, batches] = await Promise.all([
    supabase.from("package_versions").select("*", { count: "exact", head: true }).eq("package_id", packageId),
    supabase.from("questions").select("*", { count: "exact", head: true }).eq("package_id", packageId),
    supabase.from("subscriptions").select("*", { count: "exact", head: true }).eq("package_id", packageId),
    supabase.from("import_batches").select("*", { count: "exact", head: true }).eq("package_id", packageId),
  ]);
  return [
    { label: "versão(ões) vinculada(s)", count: versions.count ?? 0 },
    { label: "questão(ões) vinculada(s)", count: questions.count ?? 0 },
    { label: "assinatura(s) vinculada(s)", count: subscriptions.count ?? 0 },
    { label: "lote(s) de importação vinculado(s)", count: batches.count ?? 0 },
  ];
}

function statusBadgeVariant(status: PackageStatus): "default" | "secondary" | "outline" {
  if (status === "ACTIVE") return "default";
  if (status === "INACTIVE") return "secondary";
  return "outline";
}

export function PackagesPage() {
  const qc = useQueryClient();
  const { search, setSearch, debouncedSearch, page, setPage } = useDebouncedSearch();
  const [courseFilter, setCourseFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<PackageRow | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [courseId, setCourseId] = useState("");
  const [status, setStatus] = useState<PackageStatus>("ACTIVE");
  const [deleteTarget, setDeleteTarget] = useState<PackageRow | null>(null);
  const [deleteDeps, setDeleteDeps] = useState<DeleteDep[] | null>(null);

  const { data: courses = [] } = useQuery({
    queryKey: ["courses", "options"],
    queryFn: async () => {
      const { data, error } = await supabase.from("courses").select("id,name").order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

  useEffect(() => {
    if (!dialogOpen) return;
    if (editing) {
      setName(editing.name);
      setDescription(editing.description ?? "");
      setCourseId(editing.course_id ?? "");
      setStatus((editing.status as PackageStatus) ?? "ACTIVE");
    } else {
      setName("");
      setDescription("");
      setCourseId("");
      setStatus("ACTIVE");
    }
  }, [dialogOpen, editing]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["packages", debouncedSearch, page, courseFilter, statusFilter],
    queryFn: async () => {
      const from = page * TAXONOMY_PAGE_SIZE;
      const to = from + TAXONOMY_PAGE_SIZE - 1;
      let q = supabase
        .from("packages")
        .select("*, courses(name)", { count: "exact" })
        .order("name", { ascending: true })
        .range(from, to);

      if (courseFilter !== "all") q = q.eq("course_id", courseFilter);
      if (statusFilter !== "all") q = q.eq("status", statusFilter as PackageStatus);

      if (debouncedSearch) {
        const term = `%${debouncedSearch}%`;
        q = q.or(`name.ilike.${term},description.ilike.${term},slug.ilike.${term}`);
      }

      const { data: rows, error: qError, count } = await q;
      if (qError) throw qError;
      return { rows: (rows ?? []) as PackageRow[], total: count ?? 0 };
    },
  });

  const rows = data?.rows ?? [];
  const total = data?.total ?? 0;

  const save = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const payload = {
        name: validatePackageName(name),
        description: validatePackageDescription(description),
        course_id: courseId,
        slug: generatePackageSlug(name),
        status,
      };
      if (!payload.course_id) throw new Error("Curso é obrigatório.");

      const dupQuery = supabase
        .from("packages")
        .select("id")
        .eq("course_id", payload.course_id)
        .ilike("name", payload.name)
        .limit(1);
      const { data: existing } = editing?.id
        ? await dupQuery.neq("id", editing.id)
        : await dupQuery;
      if (existing?.length) throw new Error("Já existe um pacote com este nome neste curso.");

      if (editing?.id) {
        const { error: updateError } = await supabase
          .from("packages")
          .update({ ...payload, updated_by: user?.id ?? null })
          .eq("id", editing.id);
        if (updateError) throw updateError;
        await logEvent("package.update", "packages", editing.id, { name: payload.name });
        return;
      }

      const { data: created, error: insertError } = await supabase
        .from("packages")
        .insert({ ...payload, created_by: user?.id ?? null, updated_by: user?.id ?? null })
        .select("id")
        .single();
      if (insertError) throw insertError;
      await logEvent("package.create", "packages", created.id, { name: payload.name });
    },
    onSuccess: () => {
      toast.success(editing ? "Pacote atualizado." : "Pacote criado.");
      qc.invalidateQueries({ queryKey: ["packages"] });
      setDialogOpen(false);
      setEditing(null);
    },
    onError: (e: Error) => toast.error(formatPackageError(e.message)),
  });

  const remove = useMutation({
    mutationFn: async (row: PackageRow) => {
      const deps = await fetchPackageDeps(row.id);
      if (hasDeleteDeps(deps)) {
        throw new Error("Não é possível excluir: remova versões, questões, assinaturas e lotes vinculados primeiro.");
      }
      const { error: deleteError } = await supabase.from("packages").delete().eq("id", row.id);
      if (deleteError) throw deleteError;
      await logEvent("package.delete", "packages", row.id, { name: row.name });
    },
    onSuccess: () => {
      toast.success("Pacote excluído.");
      qc.invalidateQueries({ queryKey: ["packages"] });
      setDeleteTarget(null);
      setDeleteDeps(null);
      if (page > 0 && rows.length === 1) setPage((p) => p - 1);
    },
    onError: (e: Error) => toast.error(formatPackageError(e.message)),
  });

  const deleteBlocked = deleteDeps ? hasDeleteDeps(deleteDeps) : false;

  async function openDeleteDialog(row: PackageRow) {
    setDeleteDeps(await fetchPackageDeps(row.id));
    setDeleteTarget(row);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pacotes</h1>
          <p className="text-sm text-muted-foreground">
            Conjuntos organizados de questões por curso. Base do pipeline de publicação.
          </p>
        </div>
        <Button className="shrink-0" onClick={() => { setEditing(null); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
          Novo pacote
        </Button>
      </div>

      <AdminFiltersCard>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <TaxonomySearch value={search} onChange={setSearch} placeholder="Buscar por nome, slug ou descrição..." />
          <Select value={courseFilter} onValueChange={(v) => { setCourseFilter(v); setPage(0); }}>
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
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(0); }}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              {PACKAGE_STATUS_OPTIONS.map((s) => (
                <SelectItem key={s} value={s}>{PACKAGE_STATUS_LABELS[s]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </AdminFiltersCard>

      <div className="overflow-x-auto rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Curso</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-28">Criado em</TableHead>
              <TableHead className="w-24 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AdminTableBody
              colSpan={6}
              isLoading={isLoading}
              isError={isError}
              error={error as Error}
              isEmpty={rows.length === 0}
              emptyMessage="Nenhum pacote cadastrado."
              filteredEmptyMessage="Nenhum pacote encontrado."
              hasActiveFilters={!!debouncedSearch || courseFilter !== "all" || statusFilter !== "all"}
              formatError={formatPackageError}
            >
              {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.name}</TableCell>
                <TableCell className="text-sm">{row.courses?.name ?? "—"}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{row.slug}</TableCell>
                <TableCell>
                  <Badge variant={statusBadgeVariant((row.status as PackageStatus) ?? "ACTIVE")}>
                    {PACKAGE_STATUS_LABELS[(row.status as PackageStatus) ?? "ACTIVE"]}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{formatDate(row.created_at)}</TableCell>
                <TableCell className="text-right">
                  <Button size="icon" variant="ghost" aria-label={`Editar ${row.name}`} onClick={() => { setEditing(row); setDialogOpen(true); }}>
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                  </Button>
                  <Button size="icon" variant="ghost" aria-label={`Excluir ${row.name}`} onClick={() => openDeleteDialog(row)}>
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </TableCell>
              </TableRow>
              ))}
            </AdminTableBody>
          </TableBody>
        </Table>
      </div>

      <TaxonomyPagination page={page} total={total} onPageChange={setPage} />

      <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) setEditing(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar pacote" : "Novo pacote"}</DialogTitle>
            <DialogDescription>
              O slug é gerado automaticamente a partir do nome. Nome único por curso.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              save.mutate();
            }}
            className="space-y-4"
          >
            <div>
              <Label>Curso *</Label>
              <Select value={courseId} onValueChange={setCourseId}>
                <SelectTrigger><SelectValue placeholder="Selecione o curso" /></SelectTrigger>
                <SelectContent>
                  {courses.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Nome *</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Polícia Federal - Português" />
              {name.trim() && (
                <p className="text-xs text-muted-foreground mt-1">
                  Slug: <span className="font-mono">{generatePackageSlug(name)}</span>
                </p>
              )}
            </div>
            <div>
              <Label>Descrição</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as PackageStatus)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PACKAGE_STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>{PACKAGE_STATUS_LABELS[s]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={save.isPending}>
                {save.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => { if (!o) { setDeleteTarget(null); setDeleteDeps(null); } }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{deleteBlocked ? "Exclusão bloqueada" : "Excluir pacote?"}</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2 text-sm">
                {deleteBlocked ? (
                  <>
                    <p>O pacote <strong>{deleteTarget?.name}</strong> possui vínculos:</p>
                    <ul className="list-disc pl-5">
                      {deleteDeps?.filter((d) => d.count > 0).map((d) => (
                        <li key={d.label}>{d.count} {d.label}</li>
                      ))}
                    </ul>
                    <p>Remova os vínculos antes de excluir.</p>
                  </>
                ) : (
                  <p>
                    Tem certeza que deseja excluir <strong>{deleteTarget?.name}</strong>? Esta ação não pode ser desfeita.
                  </p>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Fechar</AlertDialogCancel>
            {!deleteBlocked && (
              <AlertDialogAction onClick={() => deleteTarget && remove.mutate(deleteTarget)} disabled={remove.isPending}>
                Excluir
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
