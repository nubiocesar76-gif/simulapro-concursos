import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Pencil, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { EDITORIAL_ENGINE_VERSION, EDITORIAL_SCOPE } from "@/lib/editorial/constants";
import {
  architectureStatusLabel,
  formatEditorialError,
  slugifyEditorial,
  useEditorialContext,
  type EditorialArchitecture,
} from "./shared";

export function ArchitecturesSection() {
  const { scope, architectureId, setArchitectureId } = useEditorialContext();
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<EditorialArchitecture | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<EditorialArchitecture | null>(null);

  useEffect(() => {
    if (!dialogOpen) return;
    if (editing) {
      setName(editing.name);
      setSlug(editing.slug);
      setDescription(editing.description ?? "");
    } else {
      setName(`${scope.courseName} — ${scope.positionName}`);
      setSlug(slugifyEditorial(`${EDITORIAL_SCOPE.courseSlug}-${EDITORIAL_SCOPE.positionSlug}`));
      setDescription("Arquitetura editorial V2 Lite para classificação sem IA.");
    }
  }, [dialogOpen, editing, scope]);

  const query = useQuery({
    queryKey: ["editorial", "architectures", scope.courseId, scope.positionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("editorial_architectures")
        .select("*")
        .eq("course_id", scope.courseId)
        .eq("position_id", scope.positionId)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  useEffect(() => {
    if (!architectureId && query.data?.length) {
      const active = query.data.find((item) => item.is_active) ?? query.data[0];
      if (active) setArchitectureId(active.id);
    }
  }, [architectureId, query.data, setArchitectureId]);

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        course_id: scope.courseId,
        position_id: scope.positionId,
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim() || null,
        engine_version: EDITORIAL_ENGINE_VERSION,
      };
      if (!payload.name || !payload.slug) {
        throw new Error("Nome e slug são obrigatórios.");
      }
      if (editing) {
        const { error } = await supabase
          .from("editorial_architectures")
          .update(payload)
          .eq("id", editing.id);
        if (error) throw error;
        return editing.id;
      }
      const { data, error } = await supabase
        .from("editorial_architectures")
        .insert({ ...payload, status: "PROPOSTO" })
        .select("id")
        .single();
      if (error) throw error;
      return data.id;
    },
    onSuccess: (id) => {
      toast.success(editing ? "Arquitetura atualizada." : "Arquitetura criada.");
      setDialogOpen(false);
      setEditing(null);
      setArchitectureId(id);
      void qc.invalidateQueries({ queryKey: ["editorial", "architectures"] });
    },
    onError: (error) => toast.error(formatEditorialError(error)),
  });

  const approve = useMutation({
    mutationFn: async (arch: EditorialArchitecture) => {
      await supabase
        .from("editorial_architectures")
        .update({ is_active: false })
        .eq("course_id", scope.courseId)
        .eq("position_id", scope.positionId);
      const { error } = await supabase
        .from("editorial_architectures")
        .update({ status: "APROVADO", is_active: true })
        .eq("id", arch.id);
      if (error) throw error;
      return arch.id;
    },
    onSuccess: (id) => {
      toast.success("Arquitetura aprovada e ativada.");
      setArchitectureId(id);
      void qc.invalidateQueries({ queryKey: ["editorial", "architectures"] });
    },
    onError: (error) => toast.error(formatEditorialError(error)),
  });

  const remove = useMutation({
    mutationFn: async (arch: EditorialArchitecture) => {
      const { error } = await supabase
        .from("editorial_architectures")
        .delete()
        .eq("id", arch.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Arquitetura removida.");
      setDeleteTarget(null);
      if (deleteTarget?.id === architectureId) setArchitectureId(null);
      void qc.invalidateQueries({ queryKey: ["editorial"] });
    },
    onError: (error) => toast.error(formatEditorialError(error)),
  });

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button
          size="sm"
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Nova arquitetura
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Versão</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ativa</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AdminTableBody
              colSpan={6}
              isLoading={query.isLoading}
              isError={query.isError}
              isEmpty={(query.data?.length ?? 0) === 0}
              emptyMessage="Nenhuma arquitetura cadastrada para este escopo."
            >
              {(query.data ?? []).map((arch) => (
                <TableRow
                  key={arch.id}
                  className={arch.id === architectureId ? "bg-muted/40" : undefined}
                  onClick={() => setArchitectureId(arch.id)}
                >
                  <TableCell className="font-medium">{arch.name}</TableCell>
                  <TableCell className="font-mono text-xs">{arch.slug}</TableCell>
                  <TableCell className="font-mono text-xs">{arch.engine_version}</TableCell>
                  <TableCell>{architectureStatusLabel(arch.status)}</TableCell>
                  <TableCell>{arch.is_active ? "Sim" : "Não"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {!arch.is_active && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(event) => {
                            event.stopPropagation();
                            approve.mutate(arch);
                          }}
                        >
                          <CheckCircle2 className="mr-1 h-4 w-4" />
                          Aprovar
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(event) => {
                          event.stopPropagation();
                          setEditing(arch);
                          setDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(event) => {
                          event.stopPropagation();
                          setDeleteTarget(arch);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </AdminTableBody>
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar arquitetura" : "Nova arquitetura"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-2">
              <Label htmlFor="arch-name">Nome</Label>
              <Input
                id="arch-name"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  if (!editing) setSlug(slugifyEditorial(event.target.value));
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="arch-slug">Slug</Label>
              <Input id="arch-slug" value={slug} onChange={(event) => setSlug(event.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="arch-desc">Descrição</Label>
              <Textarea
                id="arch-desc"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => save.mutate()} disabled={save.isPending}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover arquitetura?</AlertDialogTitle>
            <AlertDialogDescription>
              Todos os registros vinculados (disciplinas, assuntos, regras etc.) serão removidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteTarget && remove.mutate(deleteTarget)}>
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
