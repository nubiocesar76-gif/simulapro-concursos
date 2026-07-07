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
  useDebouncedSearch,
  TaxonomySearch,
  TaxonomyPagination,
  type DeleteDep,
  hasDeleteDeps,
} from "./shared";
import { AdminTableBody } from "@/components/admin/shared/AdminTableBody";

type Board = Tables<"boards">;

async function fetchBoardDeps(boardId: string): Promise<DeleteDep[]> {
  const [exams, questions] = await Promise.all([
    supabase.from("exams").select("*", { count: "exact", head: true }).eq("board_id", boardId),
    supabase.from("questions").select("*", { count: "exact", head: true }).eq("board_id", boardId),
  ]);
  return [
    { label: "concurso(s) vinculado(s)", count: exams.count ?? 0 },
    { label: "questão(ões) vinculada(s)", count: questions.count ?? 0 },
  ];
}

export function BoardsPage() {
  const qc = useQueryClient();
  const { search, setSearch, debouncedSearch, page, setPage } = useDebouncedSearch();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Board | null>(null);
  const [name, setName] = useState("");
  const [acronym, setAcronym] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Board | null>(null);
  const [deleteDeps, setDeleteDeps] = useState<DeleteDep[] | null>(null);

  useEffect(() => {
    if (!dialogOpen) return;
    if (editing) {
      setName(editing.name);
      setAcronym(editing.acronym ?? "");
    } else {
      setName("");
      setAcronym("");
    }
  }, [dialogOpen, editing]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["boards", debouncedSearch, page],
    queryFn: async () => {
      const from = page * TAXONOMY_PAGE_SIZE;
      const to = from + TAXONOMY_PAGE_SIZE - 1;
      let q = supabase
        .from("boards")
        .select("*", { count: "exact" })
        .order("name", { ascending: true })
        .range(from, to);
      if (debouncedSearch) {
        const term = `%${debouncedSearch}%`;
        q = q.or(`name.ilike.${term},acronym.ilike.${term}`);
      }
      const { data: rows, error: qError, count } = await q;
      if (qError) throw qError;
      return { rows: (rows ?? []) as Board[], total: count ?? 0 };
    },
  });

  const rows = data?.rows ?? [];
  const total = data?.total ?? 0;

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        name: validateName(name),
        acronym: acronym.trim() || null,
      };
      if (payload.acronym && payload.acronym.length > 20) {
        throw new Error("Sigla deve ter no máximo 20 caracteres.");
      }

      const dupQuery = supabase.from("boards").select("id").ilike("name", payload.name).limit(1);
      const { data: existing } = editing?.id
        ? await dupQuery.neq("id", editing.id)
        : await dupQuery;
      if (existing?.length) throw new Error("Já existe uma banca com este nome.");

      if (editing?.id) {
        const { error: updateError } = await supabase.from("boards").update(payload).eq("id", editing.id);
        if (updateError) throw updateError;
        await logEvent("board.update", "boards", editing.id, { name: payload.name });
        return;
      }

      const { data: created, error: insertError } = await supabase
        .from("boards")
        .insert(payload)
        .select("id")
        .single();
      if (insertError) throw insertError;
      await logEvent("board.create", "boards", created.id, { name: payload.name });
    },
    onSuccess: () => {
      toast.success(editing ? "Banca atualizada." : "Banca criada.");
      qc.invalidateQueries({ queryKey: ["boards"] });
      setDialogOpen(false);
      setEditing(null);
    },
    onError: (e: Error) => toast.error(formatTaxonomyError(e.message, "banca")),
  });

  const remove = useMutation({
    mutationFn: async (row: Board) => {
      const deps = await fetchBoardDeps(row.id);
      if (hasDeleteDeps(deps)) {
        throw new Error("Não é possível excluir: remova concursos e questões vinculados primeiro.");
      }
      const { error: deleteError } = await supabase.from("boards").delete().eq("id", row.id);
      if (deleteError) throw deleteError;
      await logEvent("board.delete", "boards", row.id, { name: row.name });
    },
    onSuccess: () => {
      toast.success("Banca excluída.");
      qc.invalidateQueries({ queryKey: ["boards"] });
      setDeleteTarget(null);
      setDeleteDeps(null);
      if (page > 0 && rows.length === 1) setPage((p) => p - 1);
    },
    onError: (e: Error) => toast.error(formatTaxonomyError(e.message, "banca")),
  });

  const deleteBlocked = deleteDeps ? hasDeleteDeps(deleteDeps) : false;

  async function openDeleteDialog(row: Board) {
    setDeleteDeps(await fetchBoardDeps(row.id));
    setDeleteTarget(row);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bancas</h1>
          <p className="text-sm text-muted-foreground">Bancas organizadoras de concursos.</p>
        </div>
        <Button className="shrink-0" onClick={() => { setEditing(null); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
          Nova banca
        </Button>
      </div>

      <TaxonomySearch value={search} onChange={setSearch} placeholder="Buscar por nome ou sigla..." />

      <div className="overflow-x-auto rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Sigla</TableHead>
              <TableHead className="w-28">Criado em</TableHead>
              <TableHead className="w-24 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AdminTableBody
              colSpan={4}
              isLoading={isLoading}
              isError={isError}
              error={error as Error}
              isEmpty={rows.length === 0}
              emptyMessage="Nenhuma banca cadastrada."
              filteredEmptyMessage="Nenhuma banca encontrada."
              hasActiveFilters={!!debouncedSearch}
              formatError={(message) => formatTaxonomyError(message, "banca")}
            >
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell className="text-muted-foreground">{row.acronym ?? "—"}</TableCell>
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
            <DialogTitle>{editing ? "Editar banca" : "Nova banca"}</DialogTitle>
            <DialogDescription>Cadastre a banca organizadora. O nome deve ser único.</DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="space-y-3">
            <div>
              <Label htmlFor="board-name">Nome *</Label>
              <Input id="board-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={200} required />
            </div>
            <div>
              <Label htmlFor="board-acronym">Sigla</Label>
              <Input id="board-acronym" value={acronym} onChange={(e) => setAcronym(e.target.value)} maxLength={20} placeholder="Ex.: CEBRASPE" />
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
            <AlertDialogTitle>{deleteBlocked ? "Exclusão bloqueada" : "Excluir banca?"}</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2 text-sm text-muted-foreground">
                {deleteBlocked ? (
                  <>
                    <p>
                      A banca <strong>{deleteTarget?.name}</strong> possui vínculos e não pode ser
                      excluída. Remova-os antes em Concursos e Questões.
                    </p>
                    <ul className="list-disc pl-5">{deleteDeps?.filter((d) => d.count > 0).map((d) => <li key={d.label}>{d.count} {d.label}.</li>)}</ul>
                  </>
                ) : (
                  <p>
                    A banca <strong>{deleteTarget?.name}</strong> será removida permanentemente.
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
