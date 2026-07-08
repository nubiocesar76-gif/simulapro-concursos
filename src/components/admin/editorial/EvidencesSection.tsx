import { useEffect, useMemo, useState } from "react";
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
import { formatEditorialError, useEditorialContext, type EditorialEvidence } from "./shared";
import { RequireArchitecture } from "./RequireArchitecture";

type EntityOption = { id: string; label: string };

export function EvidencesSection() {
  const { architectureId } = useEditorialContext();
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<EditorialEvidence | null>(null);
  const [entityType, setEntityType] = useState<"DISCIPLINE" | "TOPIC" | "KEYWORD" | "RULE">("RULE");
  const [entityId, setEntityId] = useState("");
  const [evidenceType, setEvidenceType] = useState<"CONFIRMACAO" | "CONTRADICAO" | "REVISAO_HUMANA" | "SUGESTAO_IA">("REVISAO_HUMANA");
  const [sourceRef, setSourceRef] = useState("");
  const [description, setDescription] = useState("");
  const [weight, setWeight] = useState("1");
  const [deleteTarget, setDeleteTarget] = useState<EditorialEvidence | null>(null);

  const disciplinesQuery = useQuery({
    queryKey: ["editorial", "disciplines", architectureId],
    enabled: !!architectureId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("editorial_disciplines")
        .select("id, name, code")
        .eq("architecture_id", architectureId!);
      if (error) throw error;
      return data ?? [];
    },
  });

  const topicsQuery = useQuery({
    queryKey: ["editorial", "topics", architectureId],
    enabled: !!architectureId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("editorial_topics")
        .select("id, name, code")
        .eq("architecture_id", architectureId!);
      if (error) throw error;
      return data ?? [];
    },
  });

  const keywordsQuery = useQuery({
    queryKey: ["editorial", "keywords", architectureId],
    enabled: !!architectureId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("editorial_keywords")
        .select("id, term")
        .eq("architecture_id", architectureId!);
      if (error) throw error;
      return data ?? [];
    },
  });

  const rulesQuery = useQuery({
    queryKey: ["editorial", "rules", architectureId],
    enabled: !!architectureId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("editorial_rules")
        .select("id, code, trigger_terms")
        .eq("architecture_id", architectureId!);
      if (error) throw error;
      return data ?? [];
    },
  });

  const entityOptions = useMemo((): EntityOption[] => {
    switch (entityType) {
      case "DISCIPLINE":
        return (disciplinesQuery.data ?? []).map((d) => ({
          id: d.id,
          label: d.code ? `${d.code} — ${d.name}` : d.name,
        }));
      case "TOPIC":
        return (topicsQuery.data ?? []).map((t) => ({
          id: t.id,
          label: t.code ? `${t.code} — ${t.name}` : t.name,
        }));
      case "KEYWORD":
        return (keywordsQuery.data ?? []).map((k) => ({ id: k.id, label: k.term }));
      case "RULE":
        return (rulesQuery.data ?? []).map((r) => ({
          id: r.id,
          label: r.code ? `${r.code}` : (r.trigger_terms?.[0] ?? r.id),
        }));
      default:
        return [];
    }
  }, [entityType, disciplinesQuery.data, topicsQuery.data, keywordsQuery.data, rulesQuery.data]);

  useEffect(() => {
    if (!dialogOpen) return;
    if (editing) {
      setEntityType(editing.entity_type);
      setEntityId(editing.entity_id);
      setEvidenceType(editing.evidence_type);
      setSourceRef(editing.source_ref ?? "");
      setDescription(editing.description ?? "");
      setWeight(String(editing.weight));
    } else {
      setEntityType("RULE");
      setEntityId("");
      setEvidenceType("REVISAO_HUMANA");
      setSourceRef("");
      setDescription("");
      setWeight("1");
    }
  }, [dialogOpen, editing]);

  useEffect(() => {
    if (!entityOptions.some((o) => o.id === entityId)) {
      setEntityId(entityOptions[0]?.id ?? "");
    }
  }, [entityType, entityOptions, entityId]);

  const query = useQuery({
    queryKey: ["editorial", "evidence", architectureId],
    enabled: !!architectureId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("editorial_evidence")
        .select("*")
        .eq("architecture_id", architectureId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const entityLabelMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const option of [
      ...(disciplinesQuery.data ?? []).map((d) => ({ id: d.id, label: d.name })),
      ...(topicsQuery.data ?? []).map((t) => ({ id: t.id, label: t.name })),
      ...(keywordsQuery.data ?? []).map((k) => ({ id: k.id, label: k.term })),
      ...(rulesQuery.data ?? []).map((r) => ({ id: r.id, label: r.code ?? r.trigger_terms?.[0] ?? r.id })),
    ]) {
      map.set(option.id, option.label);
    }
    return map;
  }, [disciplinesQuery.data, topicsQuery.data, keywordsQuery.data, rulesQuery.data]);

  const save = useMutation({
    mutationFn: async () => {
      if (!architectureId || !entityId) throw new Error("Entidade obrigatória.");
      const payload = {
        architecture_id: architectureId,
        entity_type: entityType,
        entity_id: entityId,
        evidence_type: evidenceType,
        source_ref: sourceRef.trim() || null,
        description: description.trim() || null,
        weight: Number(weight) || 1,
      };
      if (editing) {
        const { error } = await supabase.from("editorial_evidence").update(payload).eq("id", editing.id);
        if (error) throw error;
        return;
      }
      const { error } = await supabase.from("editorial_evidence").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(editing ? "Evidência atualizada." : "Evidência registrada.");
      setDialogOpen(false);
      setEditing(null);
      void qc.invalidateQueries({ queryKey: ["editorial", "evidence"] });
    },
    onError: (error) => toast.error(formatEditorialError(error)),
  });

  const remove = useMutation({
    mutationFn: async (row: EditorialEvidence) => {
      const { error } = await supabase.from("editorial_evidence").delete().eq("id", row.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Evidência removida.");
      setDeleteTarget(null);
      void qc.invalidateQueries({ queryKey: ["editorial", "evidence"] });
    },
    onError: (error) => toast.error(formatEditorialError(error)),
  });

  return (
    <RequireArchitecture>
      <div className="mb-4 flex justify-end">
        <Button size="sm" onClick={() => { setEditing(null); setDialogOpen(true); }} disabled={!entityOptions.length}>
          <Plus className="mr-1.5 h-4 w-4" />Nova evidência
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo entidade</TableHead>
              <TableHead>Entidade</TableHead>
              <TableHead>Evidência</TableHead>
              <TableHead>Fonte</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AdminTableBody colSpan={5} isLoading={query.isLoading} isError={query.isError} isEmpty={(query.data?.length ?? 0) === 0} emptyMessage="Nenhuma evidência registrada.">
              {(query.data ?? []).map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.entity_type}</TableCell>
                  <TableCell>{entityLabelMap.get(row.entity_id) ?? row.entity_id.slice(0, 8)}</TableCell>
                  <TableCell>{row.evidence_type}</TableCell>
                  <TableCell className="max-w-xs truncate text-sm">{row.source_ref ?? row.description ?? "—"}</TableCell>
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
          <DialogHeader><DialogTitle>{editing ? "Editar evidência" : "Nova evidência"}</DialogTitle></DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Tipo de entidade</Label>
                <Select value={entityType} onValueChange={(v) => setEntityType(v as typeof entityType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DISCIPLINE">Disciplina</SelectItem>
                    <SelectItem value="TOPIC">Assunto</SelectItem>
                    <SelectItem value="KEYWORD">Palavra-chave</SelectItem>
                    <SelectItem value="RULE">Regra</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Entidade</Label>
                <Select value={entityId} onValueChange={setEntityId}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {entityOptions.map((o) => (
                      <SelectItem key={o.id} value={o.id}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Tipo de evidência</Label>
              <Select value={evidenceType} onValueChange={(v) => setEvidenceType(v as typeof evidenceType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="CONFIRMACAO">Confirmação</SelectItem>
                  <SelectItem value="CONTRADICAO">Contradição</SelectItem>
                  <SelectItem value="REVISAO_HUMANA">Revisão humana</SelectItem>
                  <SelectItem value="SUGESTAO_IA">Sugestão IA</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2"><Label>Referência da fonte</Label><Input value={sourceRef} onChange={(e) => setSourceRef(e.target.value)} placeholder="ebserh-2025 / revisor" /></div>
            <div className="grid gap-2"><Label>Descrição</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} /></div>
            <div className="grid gap-2"><Label>Peso</Label><Input type="number" min={1} value={weight} onChange={(e) => setWeight(e.target.value)} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={() => save.mutate()} disabled={save.isPending}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Remover evidência?</AlertDialogTitle><AlertDialogDescription>O histórico de confiança pode ser afetado.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteTarget && remove.mutate(deleteTarget)}>Remover</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </RequireArchitecture>
  );
}
