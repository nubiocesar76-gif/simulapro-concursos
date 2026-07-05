import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { logEvent } from "@/lib/log";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  useDebouncedSearch,
  TaxonomySearch,
  TaxonomyPagination,
  type DeleteDep,
  hasDeleteDeps,
} from "./shared";

type Subject = Tables<"subjects">;

async function fetchSubjectDeps(subjectId: string): Promise<DeleteDep[]> {
  const [topics, questions, statistics] = await Promise.all([
    supabase.from("topics").select("*", { count: "exact", head: true }).eq("subject_id", subjectId),
    supabase.from("questions").select("*", { count: "exact", head: true }).eq("subject_id", subjectId),
    supabase.from("statistics").select("*", { count: "exact", head: true }).eq("subject_id", subjectId),
  ]);
  return [
    { label: "assunto(s) vinculado(s)", count: topics.count ?? 0 },
    { label: "questão(ões) vinculada(s)", count: questions.count ?? 0 },
    { label: "registro(s) de estatística vinculado(s)", count: statistics.count ?? 0 },
  ];
}

export function SubjectsPage() {
  const qc = useQueryClient();
  const { search, setSearch, debouncedSearch, page, setPage } = useDebouncedSearch();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Subject | null>(null);
  const [name, setName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Subject | null>(null);
  const [deleteDeps, setDeleteDeps] = useState<DeleteDep[] | null>(null);

  useEffect(() => {
    if (!dialogOpen) return;
    if (editing) {
      setName(editing.name);
    } else {
      setName("");
    }
  }, [dialogOpen, editing]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["subjects", debouncedSearch, page],
    queryFn: async () => {
      const from = page * TAXONOMY_PAGE_SIZE;
      const to = from + TAXONOMY_PAGE_SIZE - 1;
      let q = supabase
        .from("subjects")
        .select("*", { count: "exact" })
        .order("name", { ascending: true })
        .range(from, to);
      if (debouncedSearch) {
        const term = `%${debouncedSearch}%`;
        q = q.ilike("name", term);
      }
      const { data: rows, error: qError, count } = await q;
      if (qError) throw qError;
      return { rows: (rows ?? []) as Subject[], total: count ?? 0 };
    },
  });

  const rows = data?.rows ?? [];
  const total = data?.total ?? 0;

  const save = useMutation({
    mutationFn: async () => {
      const validatedName = validateName(name);
      const payload = {
        name: validatedName,
        slug: slugFromTaxonomyName(validatedName, "disciplina"),
      };

      const dupQuery = supabase.from("subjects").select("id").ilike("name", payload.name).limit(1);
      const { data: existing } = editing?.id
        ? await dupQuery.neq("id", editing.id)
        : await dupQuery;
      if (existing?.length) throw new Error("Já existe uma disciplina com este nome.");

      if (editing?.id) {
        const { error: updateError } = await supabase.from("subjects").update(payload).eq("id", editing.id);
        if (updateError) throw updateError;
        await logEvent("subject.update", "subjects", editing.id, { name: payload.name });
        return;
      }

      const { data: created, error: insertError } = await supabase
        .from("subjects")
        .insert(payload)
        .select("id")
        .single();
      if (insertError) throw insertError;
      await logEvent("subject.create", "subjects", created.id, { name: payload.name });
    },
    onSuccess: () => {
      toast.success(editing ? "Disciplina atualizada." : "Disciplina criada.");
      qc.invalidateQueries({ queryKey: ["subjects"] });
      setDialogOpen(false);
      setEditing(null);
    },
    onError: (e: Error) => toast.error(formatTaxonomyError(e.message, "disciplina")),
  });

  const remove = useMutation({
    mutationFn: async (row: Subject) => {
      const deps = await fetchSubjectDeps(row.id);
      if (hasDeleteDeps(deps)) {
        throw new Error("Não é possível excluir: remova assuntos, questões e estatísticas vinculados primeiro.");
      }
      const { error: deleteError } = await supabase.from("subjects").delete().eq("id", row.id);
      if (deleteError) throw deleteError;
      await logEvent("subject.delete", "subjects", row.id, { name: row.name });
    },
    onSuccess: () => {
      toast.success("Disciplina excluída.");
      qc.invalidateQueries({ queryKey: ["subjects"] });
      setDeleteTarget(null);
      setDeleteDeps(null);
      if (page > 0 && rows.length === 1) setPage((p) => p - 1);
    },
    onError: (e: Error) => toast.error(formatTaxonomyError(e.message, "disciplina")),
  });

  const deleteBlocked = deleteDeps ? hasDeleteDeps(deleteDeps) : false;

  async function openDeleteDialog(row: Subject) {
    setDeleteDeps(await fetchSubjectDeps(row.id));
    setDeleteTarget(row);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Disciplinas</h1>
          <p className="text-sm text-muted-foreground">Disciplinas do banco de questões.</p>
        </div>
        <Button onClick={() => { setEditing(null); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Nova disciplina
        </Button>
      </div>

      <TaxonomySearch value={search} onChange={setSearch} placeholder="Buscar por nome..." />

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead className="w-28">Criado em</TableHead>
              <TableHead className="w-24 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={3} className="py-8 text-center text-muted-foreground">Carregando...</TableCell></TableRow>
            ) : isError ? (
              <TableRow><TableCell colSpan={3} className="py-8 text-center text-destructive">{formatTaxonomyError((error as Error).message, "disciplina")}</TableCell></TableRow>
            ) : rows.length === 0 ? (
              <TableRow><TableCell colSpan={3} className="py-8 text-center text-muted-foreground">{debouncedSearch ? "Nenhuma disciplina encontrada." : "Nenhuma disciplina cadastrada."}</TableCell></TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(row.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost" aria-label={`Editar ${row.name}`} onClick={() => { setEditing(row); setDialogOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" aria-label={`Excluir ${row.name}`} onClick={() => openDeleteDialog(row)}><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <TaxonomyPagination page={page} total={total} onPageChange={setPage} />

      <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) setEditing(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar disciplina" : "Nova disciplina"}</DialogTitle>
            <DialogDescription>Cadastre a disciplina. O nome deve ser único.</DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="space-y-3">
            <div>
              <Label htmlFor="subject-name">Nome *</Label>
              <Input id="subject-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={200} required />
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
            <AlertDialogTitle>{deleteBlocked ? "Exclusão bloqueada" : "Excluir disciplina?"}</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2 text-sm text-muted-foreground">
                {deleteBlocked ? (
                  <>
                    <p>
                      A disciplina <strong>{deleteTarget?.name}</strong> possui vínculos e não pode ser
                      excluída. Remova-os antes em Assuntos e Questões.
                    </p>
                    <ul className="list-disc pl-5">{deleteDeps?.filter((d) => d.count > 0).map((d) => <li key={d.label}>{d.count} {d.label}.</li>)}</ul>
                  </>
                ) : (
                  <p>
                    A disciplina <strong>{deleteTarget?.name}</strong> será removida permanentemente.
                    Esta ação não pode ser desfeita.
                  </p>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {deleteBlocked ? <AlertDialogCancel>Entendi</AlertDialogCancel> : (
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
