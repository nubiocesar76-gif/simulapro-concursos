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
  type EditorialDiscipline,
} from "./shared";
import { RequireArchitecture } from "./RequireArchitecture";

export function DisciplinesSection() {
  const { architectureId } = useEditorialContext();
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<EditorialDiscipline | null>(null);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState("");
  const [priority, setPriority] = useState<"ALTA" | "MEDIA" | "BAIXA" | "">("");
  const [notes, setNotes] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<EditorialDiscipline | null>(null);

  useEffect(() => {
    if (!dialogOpen) return;
    if (editing) {
      setCode(editing.code ?? "");
      setName(editing.name);
      setSlug(editing.slug);
      setDescription(editing.description ?? "");
      setFrequency(editing.frequency_percent?.toString() ?? "");
      setPriority(editing.priority ?? "");
      setNotes(editing.notes ?? "");
    } else {
      setCode("");
      setName("");
      setSlug("");
      setDescription("");
      setFrequency("");
      setPriority("MEDIA");
      setNotes("");
    }
  }, [dialogOpen, editing]);

  const query = useQuery({
    queryKey: ["editorial", "disciplines", architectureId],
    enabled: !!architectureId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("editorial_disciplines")
        .select("*")
        .eq("architecture_id", architectureId!)
        .order("sort_order")
        .order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      if (!architectureId) throw new Error("Arquitetura não selecionada.");
      const payload = {
        architecture_id: architectureId,
        code: code.trim() || null,
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim() || null,
        frequency_percent: frequency ? Number(frequency) : null,
        priority: priority || null,
        notes: notes.trim() || null,
      };
      if (!payload.name || !payload.slug) throw new Error("Nome e slug são obrigatórios.");
      if (editing) {
        const { error } = await supabase
          .from("editorial_disciplines")
          .update(payload)
          .eq("id", editing.id);
        if (error) throw error;
        return;
      }
      const { error } = await supabase.from("editorial_disciplines").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(editing ? "Disciplina atualizada." : "Disciplina criada.");
      setDialogOpen(false);
      setEditing(null);
      void qc.invalidateQueries({ queryKey: ["editorial", "disciplines"] });
    },
    onError: (error) => toast.error(formatEditorialError(error)),
  });

  const remove = useMutation({
    mutationFn: async (row: EditorialDiscipline) => {
      const { error } = await supabase.from("editorial_disciplines").delete().eq("id", row.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Disciplina removida.");
      setDeleteTarget(null);
      void qc.invalidateQueries({ queryKey: ["editorial"] });
    },
    onError: (error) => toast.error(formatEditorialError(error)),
  });

  return (
    <RequireArchitecture>
      <div className="mb-4 flex justify-end">
        <Button size="sm" onClick={() => { setEditing(null); setDialogOpen(true); }}>
          <Plus className="mr-1.5 h-4 w-4" />
          Nova disciplina
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Freq. %</TableHead>
              <TableHead>Prioridade</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AdminTableBody
              colSpan={5}
              isLoading={query.isLoading}
              isError={query.isError}
              isEmpty={(query.data?.length ?? 0) === 0}
              emptyMessage="Nenhuma disciplina cadastrada."
            >
              {(query.data ?? []).map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-mono text-xs">{row.code ?? "—"}</TableCell>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell>{row.frequency_percent ?? "—"}</TableCell>
                  <TableCell>{row.priority ?? "—"}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => { setEditing(row); setDialogOpen(true); }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(row)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </AdminTableBody>
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar disciplina" : "Nova disciplina"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Código</Label>
              <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="D10" />
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label>Nome</Label>
              <Input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!editing) setSlug(slugifyEditorial(e.target.value));
                }}
              />
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label>Slug</Label>
              <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label>Descrição</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>Frequência %</Label>
              <Input type="number" min={0} max={100} value={frequency} onChange={(e) => setFrequency(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>Prioridade</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as typeof priority)}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALTA">Alta</SelectItem>
                  <SelectItem value="MEDIA">Média</SelectItem>
                  <SelectItem value="BAIXA">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label>Observações</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={() => save.mutate()} disabled={save.isPending}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover disciplina?</AlertDialogTitle>
            <AlertDialogDescription>Assuntos e registros vinculados serão removidos em cascata.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteTarget && remove.mutate(deleteTarget)}>Remover</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </RequireArchitecture>
  );
}
