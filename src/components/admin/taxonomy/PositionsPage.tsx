import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { logEvent } from "@/lib/log";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  formatTaxonomyError,
  formatDate,
  validateName,
  slugFromTaxonomyName,
  validateDescription,
  useDebouncedSearch,
  TaxonomySearch,
  TaxonomyPagination,
  type DeleteDep,
  hasDeleteDeps,
} from "./shared";
import { AdminTableBody } from "@/components/admin/shared/AdminTableBody";
import { AdminFiltersCard } from "@/components/admin/shared/AdminFiltersCard";

type Position = Tables<"positions"> & { courses: { name: string } | null };

async function fetchPositionDeps(positionId: string): Promise<DeleteDep[]> {
  const { count } = await supabase
    .from("questions")
    .select("*", { count: "exact", head: true })
    .eq("position_id", positionId);
  return [{ label: "questão(ões) vinculada(s)", count: count ?? 0 }];
}

export function PositionsPage() {
  const qc = useQueryClient();
  const { search, setSearch, debouncedSearch, page, setPage } = useDebouncedSearch();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Position | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [courseId, setCourseId] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Position | null>(null);
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
      setCourseId(editing.course_id);
    } else {
      setName("");
      setDescription("");
      setCourseId("");
    }
  }, [dialogOpen, editing]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["positions", debouncedSearch, page],
    queryFn: async () => {
      const from = page * TAXONOMY_PAGE_SIZE;
      const to = from + TAXONOMY_PAGE_SIZE - 1;
      let q = supabase
        .from("positions")
        .select("*, courses(name)", { count: "exact" })
        .order("name", { ascending: true })
        .range(from, to);
      if (debouncedSearch) {
        const term = `%${debouncedSearch}%`;
        q = q.or(`name.ilike.${term},description.ilike.${term}`);
      }
      const { data: rows, error: qError, count } = await q;
      if (qError) throw qError;
      return { rows: (rows ?? []) as Position[], total: count ?? 0 };
    },
  });

  const rows = data?.rows ?? [];
  const total = data?.total ?? 0;

  const save = useMutation({
    mutationFn: async () => {
      const validatedName = validateName(name);
      const payload = {
        name: validatedName,
        slug: slugFromTaxonomyName(validatedName, "cargo"),
        description: validateDescription(description),
        course_id: courseId,
      };
      if (!payload.course_id) throw new Error("Curso é obrigatório.");

      const dupQuery = supabase
        .from("positions")
        .select("id")
        .eq("course_id", payload.course_id)
        .ilike("name", payload.name)
        .limit(1);
      const { data: existing } = editing?.id
        ? await dupQuery.neq("id", editing.id)
        : await dupQuery;
      if (existing?.length) throw new Error("Já existe um cargo com este nome neste curso.");

      if (editing?.id) {
        const { error: updateError } = await supabase
          .from("positions")
          .update(payload)
          .eq("id", editing.id);
        if (updateError) throw updateError;
        await logEvent("position.update", "positions", editing.id, { name: payload.name });
        return;
      }

      const { data: created, error: insertError } = await supabase
        .from("positions")
        .insert(payload)
        .select("id")
        .single();
      if (insertError) throw insertError;
      await logEvent("position.create", "positions", created.id, { name: payload.name });
    },
    onSuccess: () => {
      toast.success(editing ? "Cargo atualizado." : "Cargo criado.");
      qc.invalidateQueries({ queryKey: ["positions"] });
      setDialogOpen(false);
      setEditing(null);
    },
    onError: (e: Error) => toast.error(formatTaxonomyError(e.message, "cargo")),
  });

  const remove = useMutation({
    mutationFn: async (row: Position) => {
      const deps = await fetchPositionDeps(row.id);
      if (hasDeleteDeps(deps)) {
        throw new Error("Não é possível excluir: remova as questões vinculadas primeiro.");
      }
      const { error: deleteError } = await supabase.from("positions").delete().eq("id", row.id);
      if (deleteError) throw deleteError;
      await logEvent("position.delete", "positions", row.id, { name: row.name });
    },
    onSuccess: () => {
      toast.success("Cargo excluído.");
      qc.invalidateQueries({ queryKey: ["positions"] });
      setDeleteTarget(null);
      setDeleteDeps(null);
      if (page > 0 && rows.length === 1) setPage((p) => p - 1);
    },
    onError: (e: Error) => toast.error(formatTaxonomyError(e.message, "cargo")),
  });

  const deleteBlocked = deleteDeps ? hasDeleteDeps(deleteDeps) : false;

  async function openDeleteDialog(row: Position) {
    setDeleteDeps(await fetchPositionDeps(row.id));
    setDeleteTarget(row);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Cargos</h1>
          <p className="text-sm text-muted-foreground">Cargos vinculados a cursos.</p>
        </div>
        <Button className="shrink-0" onClick={() => { setEditing(null); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
          Novo cargo
        </Button>
      </div>

      <AdminFiltersCard>
        <TaxonomySearch value={search} onChange={setSearch} placeholder="Buscar por nome ou descrição..." />
      </AdminFiltersCard>

      <div className="overflow-x-auto rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Curso</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="w-28">Criado em</TableHead>
              <TableHead className="w-24 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AdminTableBody
              colSpan={5}
              isLoading={isLoading}
              isError={isError}
              error={error as Error}
              isEmpty={rows.length === 0}
              emptyMessage="Nenhum cargo cadastrado."
              filteredEmptyMessage="Nenhum cargo encontrado."
              hasActiveFilters={!!debouncedSearch}
              formatError={(message) => formatTaxonomyError(message, "cargo")}
            >
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell>{row.courses?.name ?? "—"}</TableCell>
                  <TableCell className="max-w-md truncate text-muted-foreground">{row.description ?? "—"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(row.created_at)}</TableCell>
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

      <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) setEditing(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar cargo" : "Novo cargo"}</DialogTitle>
            <DialogDescription>Preencha os dados do cargo. O nome deve ser único dentro do curso.</DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="space-y-3">
            <div>
              <Label htmlFor="position-name">Nome *</Label>
              <Input id="position-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={200} required />
            </div>
            <div>
              <Label>Curso *</Label>
              <Select value={courseId} onValueChange={setCourseId}>
                <SelectTrigger><SelectValue placeholder="Selecione o curso" /></SelectTrigger>
                <SelectContent>
                  {courses.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="position-description">Descrição</Label>
              <Textarea id="position-description" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={2000} rows={3} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={save.isPending}>{save.isPending ? "Salvando..." : "Salvar"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) { setDeleteTarget(null); setDeleteDeps(null); } }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{deleteBlocked ? "Exclusão bloqueada" : "Excluir cargo?"}</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2 text-sm text-muted-foreground">
                {deleteBlocked ? (
                  <>
                    <p>
                      O cargo <strong>{deleteTarget?.name}</strong> possui vínculos e não pode ser
                      excluído. Remova-os antes em Questões.
                    </p>
                    <ul className="list-disc pl-5">{deleteDeps?.filter((d) => d.count > 0).map((d) => <li key={d.label}>{d.count} {d.label}.</li>)}</ul>
                  </>
                ) : (
                  <p>
                    O cargo <strong>{deleteTarget?.name}</strong> será removido permanentemente.
                    Esta ação não pode ser desfeita.
                  </p>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {deleteBlocked ? (
              <AlertDialogCancel>Entendi</AlertDialogCancel>
            ) : (
              <>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={remove.isPending} onClick={(e) => { e.preventDefault(); if (deleteTarget) remove.mutate(deleteTarget); }}>
                  {remove.isPending ? "Excluindo..." : "Excluir"}
                </AlertDialogAction>
              </>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
