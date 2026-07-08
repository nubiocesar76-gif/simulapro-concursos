import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
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
import { formatEditorialError, useEditorialContext, type EditorialKeyword } from "./shared";
import { RequireArchitecture } from "./RequireArchitecture";

export function KeywordsSection() {
  const { architectureId } = useEditorialContext();
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<EditorialKeyword | null>(null);
  const [topicId, setTopicId] = useState("");
  const [term, setTerm] = useState("");
  const [weight, setWeight] = useState("5");
  const [keywordType, setKeywordType] = useState<"PRINCIPAL" | "SECUNDARIA" | "FRACA">("SECUNDARIA");
  const [deleteTarget, setDeleteTarget] = useState<EditorialKeyword | null>(null);

  const topicsQuery = useQuery({
    queryKey: ["editorial", "topics", architectureId, "options"],
    enabled: !!architectureId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("editorial_topics")
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
      setTopicId(editing.topic_id);
      setTerm(editing.term);
      setWeight(String(editing.weight));
      setKeywordType(editing.keyword_type);
    } else {
      setTopicId(topicsQuery.data?.[0]?.id ?? "");
      setTerm("");
      setWeight("5");
      setKeywordType("SECUNDARIA");
    }
  }, [dialogOpen, editing, topicsQuery.data]);

  const query = useQuery({
    queryKey: ["editorial", "keywords", architectureId],
    enabled: !!architectureId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("editorial_keywords")
        .select("*, editorial_topics(name, code)")
        .eq("architecture_id", architectureId!)
        .order("term");
      if (error) throw error;
      return data ?? [];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      if (!architectureId || !topicId) throw new Error("Assunto obrigatório.");
      const payload = {
        architecture_id: architectureId,
        topic_id: topicId,
        term: term.trim(),
        weight: Number(weight) || 5,
        keyword_type: keywordType,
      };
      if (!payload.term) throw new Error("Termo obrigatório.");
      if (editing) {
        const { error } = await supabase.from("editorial_keywords").update(payload).eq("id", editing.id);
        if (error) throw error;
        return;
      }
      const { error } = await supabase.from("editorial_keywords").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(editing ? "Palavra-chave atualizada." : "Palavra-chave criada.");
      setDialogOpen(false);
      setEditing(null);
      void qc.invalidateQueries({ queryKey: ["editorial", "keywords"] });
    },
    onError: (error) => toast.error(formatEditorialError(error)),
  });

  const remove = useMutation({
    mutationFn: async (row: EditorialKeyword) => {
      const { error } = await supabase.from("editorial_keywords").delete().eq("id", row.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Palavra-chave removida.");
      setDeleteTarget(null);
      void qc.invalidateQueries({ queryKey: ["editorial", "keywords"] });
    },
    onError: (error) => toast.error(formatEditorialError(error)),
  });

  return (
    <RequireArchitecture>
      <div className="mb-4 flex justify-end">
        <Button size="sm" onClick={() => { setEditing(null); setDialogOpen(true); }} disabled={!topicsQuery.data?.length}>
          <Plus className="mr-1.5 h-4 w-4" />Nova palavra-chave
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Termo</TableHead>
              <TableHead>Assunto</TableHead>
              <TableHead>Peso</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AdminTableBody colSpan={5} isLoading={query.isLoading} isError={query.isError} isEmpty={(query.data?.length ?? 0) === 0} emptyMessage="Nenhuma palavra-chave cadastrada.">
              {(query.data ?? []).map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.term}</TableCell>
                  <TableCell>{row.editorial_topics?.name ?? "—"}</TableCell>
                  <TableCell>{row.weight}</TableCell>
                  <TableCell>{row.keyword_type}</TableCell>
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
          <DialogHeader><DialogTitle>{editing ? "Editar palavra-chave" : "Nova palavra-chave"}</DialogTitle></DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-2">
              <Label>Assunto</Label>
              <Select value={topicId} onValueChange={setTopicId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(topicsQuery.data ?? []).map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.code ? `${t.code} — ` : ""}{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2"><Label>Termo</Label><Input value={term} onChange={(e) => setTerm(e.target.value)} /></div>
            <div className="grid gap-2"><Label>Peso (0–10)</Label><Input type="number" min={0} max={10} value={weight} onChange={(e) => setWeight(e.target.value)} /></div>
            <div className="grid gap-2">
              <Label>Tipo</Label>
              <Select value={keywordType} onValueChange={(v) => setKeywordType(v as typeof keywordType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="PRINCIPAL">Principal</SelectItem>
                  <SelectItem value="SECUNDARIA">Secundária</SelectItem>
                  <SelectItem value="FRACA">Fraca</SelectItem>
                </SelectContent>
              </Select>
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
          <AlertDialogHeader><AlertDialogTitle>Remover palavra-chave?</AlertDialogTitle></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteTarget && remove.mutate(deleteTarget)}>Remover</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </RequireArchitecture>
  );
}
