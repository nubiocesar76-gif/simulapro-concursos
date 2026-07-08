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
import { EDITORIAL_ENGINE_VERSION } from "@/lib/editorial/constants";
import { formatEditorialError, useEditorialContext, type EditorialRule } from "./shared";
import { RequireArchitecture } from "./RequireArchitecture";

export function RulesSection() {
  const { architectureId } = useEditorialContext();
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<EditorialRule | null>(null);
  const [code, setCode] = useState("");
  const [disciplineId, setDisciplineId] = useState("");
  const [topicId, setTopicId] = useState("");
  const [triggerTerms, setTriggerTerms] = useState("");
  const [confidence, setConfidence] = useState("80");
  const [notes, setNotes] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<EditorialRule | null>(null);

  const disciplinesQuery = useQuery({
    queryKey: ["editorial", "disciplines", architectureId, "rule-options"],
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

  const topicsQuery = useQuery({
    queryKey: ["editorial", "topics", architectureId, disciplineId, "rule-options"],
    enabled: !!architectureId && !!disciplineId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("editorial_topics")
        .select("id, name, code")
        .eq("architecture_id", architectureId!)
        .eq("discipline_id", disciplineId)
        .order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

  useEffect(() => {
    if (!dialogOpen) return;
    if (editing) {
      setCode(editing.code ?? "");
      setDisciplineId(editing.discipline_id ?? "");
      setTopicId(editing.topic_id ?? "");
      setTriggerTerms((editing.trigger_terms ?? []).join(", "));
      setConfidence(String(editing.confidence_percent));
      setNotes(editing.notes ?? "");
    } else {
      setCode("");
      setDisciplineId(disciplinesQuery.data?.[0]?.id ?? "");
      setTopicId("");
      setTriggerTerms("");
      setConfidence("80");
      setNotes("");
    }
  }, [dialogOpen, editing, disciplinesQuery.data]);

  const query = useQuery({
    queryKey: ["editorial", "rules", architectureId],
    enabled: !!architectureId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("editorial_rules")
        .select("*, editorial_disciplines(name), editorial_topics(name)")
        .eq("architecture_id", architectureId!)
        .order("code");
      if (error) throw error;
      return data ?? [];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      if (!architectureId) throw new Error("Arquitetura não selecionada.");
      const terms = triggerTerms
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      if (!terms.length) throw new Error("Informe ao menos um termo-gatilho.");
      const payload = {
        architecture_id: architectureId,
        code: code.trim() || null,
        discipline_id: disciplineId || null,
        topic_id: topicId || null,
        trigger_terms: terms,
        confidence_percent: Number(confidence) || 0,
        notes: notes.trim() || null,
        engine_version: EDITORIAL_ENGINE_VERSION,
      };
      if (editing) {
        const { error } = await supabase.from("editorial_rules").update(payload).eq("id", editing.id);
        if (error) throw error;
        return;
      }
      const { error } = await supabase.from("editorial_rules").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(editing ? "Regra atualizada." : "Regra criada.");
      setDialogOpen(false);
      setEditing(null);
      void qc.invalidateQueries({ queryKey: ["editorial", "rules"] });
    },
    onError: (error) => toast.error(formatEditorialError(error)),
  });

  const remove = useMutation({
    mutationFn: async (row: EditorialRule) => {
      const { error } = await supabase.from("editorial_rules").delete().eq("id", row.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Regra removida.");
      setDeleteTarget(null);
      void qc.invalidateQueries({ queryKey: ["editorial", "rules"] });
    },
    onError: (error) => toast.error(formatEditorialError(error)),
  });

  return (
    <RequireArchitecture>
      <div className="mb-4 flex justify-end">
        <Button size="sm" onClick={() => { setEditing(null); setDialogOpen(true); }}>
          <Plus className="mr-1.5 h-4 w-4" />Nova regra
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Gatilhos</TableHead>
              <TableHead>Destino</TableHead>
              <TableHead>Conf. %</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AdminTableBody colSpan={5} isLoading={query.isLoading} isError={query.isError} isEmpty={(query.data?.length ?? 0) === 0} emptyMessage="Nenhuma regra cadastrada.">
              {(query.data ?? []).map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-mono text-xs">{row.code ?? "—"}</TableCell>
                  <TableCell className="max-w-xs truncate text-sm">{(row.trigger_terms ?? []).join(", ")}</TableCell>
                  <TableCell className="text-sm">
                    {row.editorial_disciplines?.name ?? "—"}
                    {row.editorial_topics?.name ? ` / ${row.editorial_topics.name}` : ""}
                  </TableCell>
                  <TableCell>{row.confidence_percent}</TableCell>
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
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? "Editar regra" : "Nova regra"}</DialogTitle></DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-2"><Label>Código</Label><Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="R001" /></div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Disciplina</Label>
                <Select value={disciplineId || "__none"} onValueChange={(v) => { setDisciplineId(v === "__none" ? "" : v); setTopicId(""); }}>
                  <SelectTrigger><SelectValue placeholder="Opcional" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none">—</SelectItem>
                    {(disciplinesQuery.data ?? []).map((d) => (
                      <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Assunto</Label>
                <Select value={topicId || "__none"} onValueChange={(v) => setTopicId(v === "__none" ? "" : v)} disabled={!disciplineId}>
                  <SelectTrigger><SelectValue placeholder="Opcional" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none">—</SelectItem>
                    {(topicsQuery.data ?? []).map((t) => (
                      <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Se encontrar (termos separados por vírgula)</Label>
              <Textarea value={triggerTerms} onChange={(e) => setTriggerTerms(e.target.value)} placeholder="PA, FC, sinais vitais" />
            </div>
            <div className="grid gap-2"><Label>Confiança %</Label><Input type="number" min={0} max={100} value={confidence} onChange={(e) => setConfidence(e.target.value)} /></div>
            <div className="grid gap-2"><Label>Notas</Label><Textarea value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={() => save.mutate()} disabled={save.isPending}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Remover regra?</AlertDialogTitle><AlertDialogDescription>A regra deixará de ser usada na classificação futura.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteTarget && remove.mutate(deleteTarget)}>Remover</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </RequireArchitecture>
  );
}
