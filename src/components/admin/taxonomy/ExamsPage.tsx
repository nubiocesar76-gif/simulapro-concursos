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
  useDebouncedSearch,
  TaxonomySearch,
  TaxonomyPagination,
  type DeleteDep,
  hasDeleteDeps,
} from "./shared";

type Exam = Tables<"exams"> & { boards: { name: string } | null };

function validateYear(value: string) {
  if (!value.trim()) return null;
  const year = Number(value);
  if (!Number.isInteger(year) || year < 1900 || year > 2100) {
    throw new Error("Ano deve ser um número entre 1900 e 2100.");
  }
  return year;
}

async function fetchExamDeps(examId: string): Promise<DeleteDep[]> {
  const { count } = await supabase
    .from("questions")
    .select("*", { count: "exact", head: true })
    .eq("exam_id", examId);
  return [{ label: "questão(ões) vinculada(s)", count: count ?? 0 }];
}

export function ExamsPage() {
  const qc = useQueryClient();
  const { search, setSearch, debouncedSearch, page, setPage } = useDebouncedSearch();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Exam | null>(null);
  const [name, setName] = useState("");
  const [boardId, setBoardId] = useState("");
  const [year, setYear] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Exam | null>(null);
  const [deleteDeps, setDeleteDeps] = useState<DeleteDep[] | null>(null);

  const { data: boards = [] } = useQuery({
    queryKey: ["boards", "options"],
    queryFn: async () => {
      const { data, error } = await supabase.from("boards").select("id,name").order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

  useEffect(() => {
    if (!dialogOpen) return;
    if (editing) {
      setName(editing.name);
      setBoardId(editing.board_id);
      setYear(editing.year != null ? String(editing.year) : "");
    } else {
      setName("");
      setBoardId("");
      setYear("");
    }
  }, [dialogOpen, editing]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["exams", debouncedSearch, page],
    queryFn: async () => {
      const from = page * TAXONOMY_PAGE_SIZE;
      const to = from + TAXONOMY_PAGE_SIZE - 1;
      let q = supabase
        .from("exams")
        .select("*, boards(name)", { count: "exact" })
        .order("name", { ascending: true })
        .range(from, to);
      if (debouncedSearch) {
        const term = `%${debouncedSearch}%`;
        q = q.or(`name.ilike.${term}`);
      }
      const { data: rows, error: qError, count } = await q;
      if (qError) throw qError;
      return { rows: (rows ?? []) as Exam[], total: count ?? 0 };
    },
  });

  const rows = data?.rows ?? [];
  const total = data?.total ?? 0;

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        name: validateName(name),
        board_id: boardId,
        year: validateYear(year),
      };
      if (!payload.board_id) throw new Error("Banca é obrigatória.");

      const dupQuery = supabase
        .from("exams")
        .select("id")
        .eq("board_id", payload.board_id)
        .ilike("name", payload.name)
        .limit(1);
      const { data: existing } = editing?.id
        ? await dupQuery.neq("id", editing.id)
        : await dupQuery;
      if (existing?.length) throw new Error("Já existe um concurso com este nome nesta banca.");

      if (editing?.id) {
        const { error: updateError } = await supabase.from("exams").update(payload).eq("id", editing.id);
        if (updateError) throw updateError;
        await logEvent("exam.update", "exams", editing.id, { name: payload.name });
        return;
      }

      const { data: created, error: insertError } = await supabase
        .from("exams")
        .insert(payload)
        .select("id")
        .single();
      if (insertError) throw insertError;
      await logEvent("exam.create", "exams", created.id, { name: payload.name });
    },
    onSuccess: () => {
      toast.success(editing ? "Concurso atualizado." : "Concurso criado.");
      qc.invalidateQueries({ queryKey: ["exams"] });
      setDialogOpen(false);
      setEditing(null);
    },
    onError: (e: Error) => toast.error(formatTaxonomyError(e.message, "concurso")),
  });

  const remove = useMutation({
    mutationFn: async (row: Exam) => {
      const deps = await fetchExamDeps(row.id);
      if (hasDeleteDeps(deps)) {
        throw new Error("Não é possível excluir: remova as questões vinculadas primeiro.");
      }
      const { error: deleteError } = await supabase.from("exams").delete().eq("id", row.id);
      if (deleteError) throw deleteError;
      await logEvent("exam.delete", "exams", row.id, { name: row.name });
    },
    onSuccess: () => {
      toast.success("Concurso excluído.");
      qc.invalidateQueries({ queryKey: ["exams"] });
      setDeleteTarget(null);
      setDeleteDeps(null);
      if (page > 0 && rows.length === 1) setPage((p) => p - 1);
    },
    onError: (e: Error) => toast.error(formatTaxonomyError(e.message, "concurso")),
  });

  const deleteBlocked = deleteDeps ? hasDeleteDeps(deleteDeps) : false;

  async function openDeleteDialog(row: Exam) {
    setDeleteDeps(await fetchExamDeps(row.id));
    setDeleteTarget(row);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Concursos</h1>
          <p className="text-sm text-muted-foreground">Concursos vinculados a bancas.</p>
        </div>
        <Button onClick={() => { setEditing(null); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Novo concurso
        </Button>
      </div>

      <TaxonomySearch value={search} onChange={setSearch} placeholder="Buscar por nome..." />

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Banca</TableHead>
              <TableHead className="w-20">Ano</TableHead>
              <TableHead className="w-28">Criado em</TableHead>
              <TableHead className="w-24 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">Carregando...</TableCell></TableRow>
            ) : isError ? (
              <TableRow><TableCell colSpan={5} className="py-8 text-center text-destructive">{formatTaxonomyError((error as Error).message, "concurso")}</TableCell></TableRow>
            ) : rows.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">{debouncedSearch ? "Nenhum concurso encontrado." : "Nenhum concurso cadastrado."}</TableCell></TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell>{row.boards?.name ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{row.year ?? "—"}</TableCell>
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
            <DialogTitle>{editing ? "Editar concurso" : "Novo concurso"}</DialogTitle>
            <DialogDescription>Cadastre o concurso. O nome deve ser único dentro da banca.</DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="space-y-3">
            <div>
              <Label htmlFor="exam-name">Nome *</Label>
              <Input id="exam-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={200} required />
            </div>
            <div>
              <Label>Banca *</Label>
              <Select value={boardId} onValueChange={setBoardId}>
                <SelectTrigger><SelectValue placeholder="Selecione a banca" /></SelectTrigger>
                <SelectContent>
                  {boards.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="exam-year">Ano</Label>
              <Input id="exam-year" type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="Ex.: 2025" min={1900} max={2100} />
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
            <AlertDialogTitle>{deleteBlocked ? "Exclusão bloqueada" : "Excluir concurso?"}</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2 text-sm text-muted-foreground">
                {deleteBlocked ? (
                  <>
                    <p>
                      O concurso <strong>{deleteTarget?.name}</strong> possui vínculos e não pode ser
                      excluído. Remova-os antes em Questões.
                    </p>
                    <ul className="list-disc pl-5">{deleteDeps?.filter((d) => d.count > 0).map((d) => <li key={d.label}>{d.count} {d.label}.</li>)}</ul>
                  </>
                ) : (
                  <p>
                    O concurso <strong>{deleteTarget?.name}</strong> será removido permanentemente.
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
