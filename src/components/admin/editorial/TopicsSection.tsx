import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
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
import { AdminTableBody } from "@/components/admin/shared/AdminTableBody";
import {
  formatEditorialError,
  slugifyEditorial,
  useEditorialContext,
  type EditorialTopic,
} from "./shared";
import { RequireArchitecture } from "./RequireArchitecture";

export function TopicsSection() {
  const { architectureId } = useEditorialContext();
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<EditorialTopic | null>(null);
  const [disciplineId, setDisciplineId] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<EditorialTopic | null>(null);

  const disciplinesQuery = useQuery({
    queryKey: ["editorial", "disciplines", architectureId, "options"],
    enabled: !!architectureId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("editorial_disciplines")
        .select("id, name, code")
        .eq("architecture_id", architectureId!)
        .order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

  useEffect(() => {
    if (!dialogOpen) return;
    if (editing) {
      setDisciplineId(editing.discipline_id);
      setCode(editing.code ?? "");
      setName(editing.name);
      setSlug(editing.slug);
      setDescription(editing.description ?? "");
    } else {
      setDisciplineId(disciplinesQuery.data?.[0]?.id ?? "");
      setCode("");
      setName("");
      setSlug("");
      setDescription("");
    }
  }, [dialogOpen, editing, disciplinesQuery.data]);

  const query = useQuery({
    queryKey: ["editorial", "topics", architectureId],
    enabled: !!architectureId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("editorial_topics")
        .select("*, editorial_disciplines(name, code)")
        .eq("architecture_id", architectureId!)
        .order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      if (!architectureId) throw new Error("Arquitetura não selecionada.");
      if (!disciplineId) throw new Error("Selecione uma disciplina.");
      const payload = {
        architecture_id: architectureId,
        discipline_id: disciplineId,
        code: code.trim() || null,
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim() || null,
      };
      if (!payload.name || !payload.slug) throw new Error("Nome e slug são obrigatórios.");
      if (editing) {
        const { error } = await supabase.from("editorial_topics").update(payload).eq("id", editing.id);
        if (error) throw error;
        return;
      }
      const { error } = await supabase.from("editorial_topics").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(editing ? "Assunto atualizado." : "Assunto criado.");
      setDialogOpen(false);
      setEditing(null);
      void qc.invalidateQueries({ queryKey: ["editorial", "topics"] });
    },
    onError: (error) => toast.error(formatEditorialError(error)),
  });

  const remove = useMutation({
    mutationFn: async (row: EditorialTopic) => {
      const { error } = await supabase.from("editorial_topics").delete().eq("id", row.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Assunto removido.");
      setDeleteTarget(null);
      void qc.invalidateQueries({ queryKey: ["editorial"] });
    },
    onError: (error) => toast.error(formatEditorialError(error)),
  });

  return (
    <RequireArchitecture>
      <div className="mb-4 flex justify-end">
        <Button size="sm" onClick={() => { setEditing(null); setDialogOpen(true); }} disabled={!disciplinesQuery.data?.length}>
          <Plus className="mr-1.5 h-4 w-4" />
          Novo assunto
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Disciplina</TableHead>
              <TableHead>Assunto</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AdminTableBody colSpan={4} isLoading={query.isLoading} isError={query.isError} isEmpty={(query.data?.length ?? 0) === 0} emptyMessage="Nenhum assunto cadastrado.">
              {(query.data ?? []).map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-mono text-xs">{row.code ?? "—"}</TableCell>
                  <TableCell>{row.editorial_disciplines?.name ?? "—"}</TableCell>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => { setEditing(row); setDialogOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(row)}><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </AdminTableBody>
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Editar assunto" : "Novo assunto"}</DialogTitle></DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-2">
              <Label>Disciplina</Label>
              <Select value={disciplineId} onValueChange={setDisciplineId}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {(disciplinesQuery.data ?? []).map((d) => (
                    <SelectItem key={d.id} value={d.id}>{d.code ? `${d.code} — ` : ""}{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2"><Label>Código</Label><Input value={code} onChange={(e) => setCode(e.target.value)} /></div>
            <div className="grid gap-2">
              <Label>Nome</Label>
              <Input value={name} onChange={(e) => { setName(e.target.value); if (!editing) setSlug(slugifyEditorial(e.target.value)); }} />
            </div>
            <div className="grid gap-2"><Label>Slug</Label><Input value={slug} onChange={(e) => setSlug(e.target.value)} /></div>
            <div className="grid gap-2"><Label>Descrição</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={() => save.mutate()} disabled={save.isPending}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Remover assunto?</AlertDialogTitle><AlertDialogDescription>Palavras-chave e regras vinculadas podem ser afetadas.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteTarget && remove.mutate(deleteTarget)}>Remover</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </RequireArchitecture>
  );
}
