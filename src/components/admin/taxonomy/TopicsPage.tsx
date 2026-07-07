import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { logEvent } from "@/lib/log";
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
import { AdminTableBody } from "@/components/admin/shared/AdminTableBody";
import { AdminFiltersCard } from "@/components/admin/shared/AdminFiltersCard";

type Topic = Tables<"topics"> & { subjects: { name: string } | null };

export type LockedSubject = { id: string; name: string };

type TopicsPageProps = {
  lockedSubject?: LockedSubject;
};

async function fetchTopicDeps(topicId: string): Promise<DeleteDep[]> {
  const { count } = await supabase
    .from("questions")
    .select("*", { count: "exact", head: true })
    .eq("topic_id", topicId);
  return [{ label: "questão(ões) vinculada(s)", count: count ?? 0 }];
}

export function TopicsPage({ lockedSubject }: TopicsPageProps) {
  const qc = useQueryClient();
  const { search, setSearch, debouncedSearch, page, setPage } = useDebouncedSearch();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Topic | null>(null);
  const [name, setName] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Topic | null>(null);
  const [deleteDeps, setDeleteDeps] = useState<DeleteDep[] | null>(null);

  const { data: subjects = [] } = useQuery({
    queryKey: ["subjects", "options"],
    queryFn: async () => {
      const { data, error } = await supabase.from("subjects").select("id,name").order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

  useEffect(() => {
    if (!dialogOpen) return;
    if (editing) {
      setName(editing.name);
      setSubjectId(lockedSubject?.id ?? editing.subject_id);
    } else {
      setName("");
      setSubjectId(lockedSubject?.id ?? "");
    }
  }, [dialogOpen, editing, lockedSubject]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["topics", debouncedSearch, page, lockedSubject?.id],
    queryFn: async () => {
      const from = page * TAXONOMY_PAGE_SIZE;
      const to = from + TAXONOMY_PAGE_SIZE - 1;
      let q = supabase
        .from("topics")
        .select("*, subjects(name)", { count: "exact" })
        .order("name", { ascending: true })
        .range(from, to);
      if (lockedSubject) {
        q = q.eq("subject_id", lockedSubject.id);
      }
      if (debouncedSearch) {
        const term = `%${debouncedSearch}%`;
        q = q.or(`name.ilike.${term}`);
      }
      const { data: rows, error: qError, count } = await q;
      if (qError) throw qError;
      return { rows: (rows ?? []) as Topic[], total: count ?? 0 };
    },
  });

  const rows = data?.rows ?? [];
  const total = data?.total ?? 0;

  const save = useMutation({
    mutationFn: async () => {
      const validatedName = validateName(name);
      const payload = {
        name: validatedName,
        slug: slugFromTaxonomyName(validatedName, "assunto"),
        subject_id: subjectId,
      };
      if (!payload.subject_id) throw new Error("Disciplina é obrigatória.");

      const dupQuery = supabase
        .from("topics")
        .select("id")
        .eq("subject_id", payload.subject_id)
        .ilike("name", payload.name)
        .limit(1);
      const { data: existing } = editing?.id
        ? await dupQuery.neq("id", editing.id)
        : await dupQuery;
      if (existing?.length) throw new Error("Já existe um assunto com este nome nesta disciplina.");

      if (editing?.id) {
        const { error: updateError } = await supabase.from("topics").update(payload).eq("id", editing.id);
        if (updateError) throw updateError;
        await logEvent("topic.update", "topics", editing.id, { name: payload.name });
        return;
      }

      const { data: created, error: insertError } = await supabase
        .from("topics")
        .insert(payload)
        .select("id")
        .single();
      if (insertError) throw insertError;
      await logEvent("topic.create", "topics", created.id, { name: payload.name });
    },
    onSuccess: () => {
      toast.success(editing ? "Assunto atualizado." : "Assunto criado.");
      qc.invalidateQueries({ queryKey: ["topics"] });
      setDialogOpen(false);
      setEditing(null);
    },
    onError: (e: Error) => toast.error(formatTaxonomyError(e.message, "assunto")),
  });

  const remove = useMutation({
    mutationFn: async (row: Topic) => {
      const deps = await fetchTopicDeps(row.id);
      if (hasDeleteDeps(deps)) {
        throw new Error("Não é possível excluir: remova as questões vinculadas primeiro.");
      }
      const { error: deleteError } = await supabase.from("topics").delete().eq("id", row.id);
      if (deleteError) throw deleteError;
      await logEvent("topic.delete", "topics", row.id, { name: row.name });
    },
    onSuccess: () => {
      toast.success("Assunto excluído.");
      qc.invalidateQueries({ queryKey: ["topics"] });
      setDeleteTarget(null);
      setDeleteDeps(null);
      if (page > 0 && rows.length === 1) setPage((p) => p - 1);
    },
    onError: (e: Error) => toast.error(formatTaxonomyError(e.message, "assunto")),
  });

  const deleteBlocked = deleteDeps ? hasDeleteDeps(deleteDeps) : false;

  async function openDeleteDialog(row: Topic) {
    setDeleteDeps(await fetchTopicDeps(row.id));
    setDeleteTarget(row);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {lockedSubject && (
            <Button variant="ghost" size="sm" className="-ml-2 mb-1 h-8 px-2" asChild>
              <Link to="/admin/subjects">
                <ArrowLeft className="h-4 w-4 mr-1" aria-hidden="true" />
                Disciplinas
              </Link>
            </Button>
          )}
          <h1 className="text-2xl font-bold tracking-tight">Assuntos</h1>
          <p className="text-sm text-muted-foreground">
            {lockedSubject
              ? `Assuntos da disciplina ${lockedSubject.name}.`
              : "Assuntos vinculados a disciplinas."}
          </p>
        </div>
        <Button className="shrink-0" onClick={() => { setEditing(null); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
          Novo assunto
        </Button>
      </div>

      <AdminFiltersCard>
        <TaxonomySearch value={search} onChange={setSearch} placeholder="Buscar por nome..." />
      </AdminFiltersCard>

      <div className="overflow-x-auto rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              {!lockedSubject && <TableHead>Disciplina</TableHead>}
              <TableHead className="w-28">Criado em</TableHead>
              <TableHead className="w-24 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AdminTableBody
              colSpan={lockedSubject ? 3 : 4}
              isLoading={isLoading}
              isError={isError}
              error={error as Error}
              isEmpty={rows.length === 0}
              emptyMessage="Nenhum assunto cadastrado."
              filteredEmptyMessage="Nenhum assunto encontrado."
              hasActiveFilters={!!debouncedSearch}
              formatError={(message) => formatTaxonomyError(message, "assunto")}
            >
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  {!lockedSubject && <TableCell>{row.subjects?.name ?? "—"}</TableCell>}
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
            <DialogTitle>{editing ? "Editar assunto" : "Novo assunto"}</DialogTitle>
            {lockedSubject && (
              <div className="space-y-0.5 pt-1">
                <p className="text-xs font-medium text-muted-foreground">Disciplina</p>
                <p className="text-sm font-semibold">{lockedSubject.name}</p>
              </div>
            )}
            <DialogDescription>Cadastre o assunto. O nome deve ser único dentro da disciplina.</DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="space-y-3">
            <div>
              <Label htmlFor="topic-name">Nome *</Label>
              <Input id="topic-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={200} required />
            </div>
            <div>
              <Label>Disciplina *</Label>
              <Select
                value={subjectId}
                onValueChange={setSubjectId}
                disabled={!!lockedSubject}
              >
                <SelectTrigger><SelectValue placeholder="Selecione a disciplina" /></SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
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
            <AlertDialogTitle>{deleteBlocked ? "Exclusão bloqueada" : "Excluir assunto?"}</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2 text-sm text-muted-foreground">
                {deleteBlocked ? (
                  <>
                    <p>
                      O assunto <strong>{deleteTarget?.name}</strong> possui vínculos e não pode ser
                      excluído. Remova-os antes em Questões.
                    </p>
                    <ul className="list-disc pl-5">{deleteDeps?.filter((d) => d.count > 0).map((d) => <li key={d.label}>{d.count} {d.label}.</li>)}</ul>
                  </>
                ) : (
                  <p>
                    O assunto <strong>{deleteTarget?.name}</strong> será removido permanentemente.
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
