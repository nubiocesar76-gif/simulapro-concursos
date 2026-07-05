import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { logEvent } from "@/lib/log";
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
import { AdminTableBody } from "@/components/admin/shared/AdminTableBody";
import { slugFromTaxonomyName } from "@/components/admin/taxonomy/shared";

type Course = Tables<"courses">;

const PAGE_SIZE = 10;

function formatError(message: string) {
  if (message.includes("row-level security")) {
    return "Sem permissão para esta operação. Verifique se seu usuário possui role admin.";
  }
  if (message.includes("duplicate key") || message.includes("unique")) {
    return "Já existe um curso com este nome.";
  }
  return message;
}

function validateCourse(name: string, description: string) {
  const trimmedName = name.trim();
  const trimmedDesc = description.trim();

  if (!trimmedName) throw new Error("Nome é obrigatório.");
  if (trimmedName.length < 2) throw new Error("Nome deve ter pelo menos 2 caracteres.");
  if (trimmedName.length > 200) throw new Error("Nome deve ter no máximo 200 caracteres.");
  if (trimmedDesc.length > 2000) throw new Error("Descrição deve ter no máximo 2000 caracteres.");

  return {
    name: trimmedName,
    description: trimmedDesc || null,
    slug: slugFromTaxonomyName(trimmedName, "curso"),
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

type CourseDeps = { positions: number; subscriptions: number; packages: number };

async function fetchCourseDeps(courseId: string): Promise<CourseDeps> {
  const [positions, subscriptions, packages] = await Promise.all([
    supabase.from("positions").select("*", { count: "exact", head: true }).eq("course_id", courseId),
    supabase.from("subscriptions").select("*", { count: "exact", head: true }).eq("course_id", courseId),
    supabase.from("packages").select("*", { count: "exact", head: true }).eq("course_id", courseId),
  ]);

  return {
    positions: positions.count ?? 0,
    subscriptions: subscriptions.count ?? 0,
    packages: packages.count ?? 0,
  };
}

function hasCourseDeps(deps: CourseDeps) {
  return deps.positions > 0 || deps.subscriptions > 0 || deps.packages > 0;
}

export function CoursesPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Course | null>(null);
  const [deleteDeps, setDeleteDeps] = useState<CourseDeps | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(0);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    if (!dialogOpen) return;
    if (editing) {
      setName(editing.name);
      setDescription(editing.description ?? "");
    } else {
      setName("");
      setDescription("");
    }
  }, [dialogOpen, editing]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["courses", debouncedSearch, page],
    queryFn: async () => {
      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let q = supabase
        .from("courses")
        .select("*", { count: "exact" })
        .order("name", { ascending: true })
        .range(from, to);

      if (debouncedSearch) {
        const term = `%${debouncedSearch}%`;
        q = q.or(`name.ilike.${term},description.ilike.${term}`);
      }

      const { data: rows, error: qError, count } = await q;
      if (qError) throw qError;
      return { rows: rows ?? [], total: count ?? 0 };
    },
  });

  const courses = data?.rows ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const save = useMutation({
    mutationFn: async () => {
      const payload = validateCourse(name, description);

      const dupQuery = supabase
        .from("courses")
        .select("id")
        .ilike("name", payload.name)
        .limit(1);

      const { data: existing } = editing?.id
        ? await dupQuery.neq("id", editing.id)
        : await dupQuery;
      if (existing?.length) throw new Error("Já existe um curso com este nome.");

      if (editing?.id) {
        const { error: updateError } = await supabase
          .from("courses")
          .update(payload)
          .eq("id", editing.id);
        if (updateError) throw updateError;
        await logEvent("course.update", "courses", editing.id, { name: payload.name });
        return editing.id;
      }

      const { data: created, error: insertError } = await supabase
        .from("courses")
        .insert(payload)
        .select("id")
        .single();
      if (insertError) throw insertError;
      await logEvent("course.create", "courses", created.id, { name: payload.name });
      return created.id;
    },
    onSuccess: () => {
      toast.success(editing ? "Curso atualizado." : "Curso criado.");
      qc.invalidateQueries({ queryKey: ["courses"] });
      setDialogOpen(false);
      setEditing(null);
    },
    onError: (e: Error) => toast.error(formatError(e.message)),
  });

  const remove = useMutation({
    mutationFn: async (course: Course) => {
      const deps = await fetchCourseDeps(course.id);
      if (hasCourseDeps(deps)) {
        throw new Error(
          "Não é possível excluir: remova cargos, assinaturas e pacotes vinculados primeiro.",
        );
      }

      const { error: deleteError } = await supabase.from("courses").delete().eq("id", course.id);
      if (deleteError) throw deleteError;
      await logEvent("course.delete", "courses", course.id, { name: course.name });
    },
    onSuccess: () => {
      toast.success("Curso excluído.");
      qc.invalidateQueries({ queryKey: ["courses"] });
      setDeleteTarget(null);
      setDeleteDeps(null);
      if (page > 0 && courses.length === 1) setPage((p) => p - 1);
    },
    onError: (e: Error) => toast.error(formatError(e.message)),
  });

  async function openDeleteDialog(course: Course) {
    setDeleteDeps(await fetchCourseDeps(course.id));
    setDeleteTarget(course);
  }

  const deleteBlocked = deleteDeps ? hasCourseDeps(deleteDeps) : false;

  const pageLabel = useMemo(() => {
    if (total === 0) return "Nenhum registro";
    const from = page * PAGE_SIZE + 1;
    const to = Math.min((page + 1) * PAGE_SIZE, total);
    return `${from}–${to} de ${total}`;
  }, [page, total]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Cursos</h1>
          <p className="text-sm text-muted-foreground">
            Cadastro de cursos oferecidos. Cursos vinculam cargos, pacotes e assinaturas.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo curso
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Buscar por nome ou descrição..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
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
              isEmpty={courses.length === 0}
              emptyMessage="Nenhum curso cadastrado."
              filteredEmptyMessage="Nenhum curso encontrado."
              hasActiveFilters={!!debouncedSearch}
              formatError={formatError}
            >
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.name}</TableCell>
                  <TableCell className="max-w-md truncate text-muted-foreground">
                    {course.description ?? "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDate(course.created_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label={`Editar ${course.name}`}
                      onClick={() => {
                        setEditing(course);
                        setDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label={`Excluir ${course.name}`}
                      onClick={() => openDeleteDialog(course)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </AdminTableBody>
          </TableBody>
        </Table>
      </div>

      {total > 0 && (
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">{pageLabel}</p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              Página {page + 1} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditing(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar curso" : "Novo curso"}</DialogTitle>
            <DialogDescription>
              {editing
                ? "Altere os dados do curso. O nome deve ser único."
                : "Preencha os dados para cadastrar um novo curso."}
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              save.mutate();
            }}
            className="space-y-3"
          >
            <div>
              <Label htmlFor="course-name">Nome *</Label>
              <Input
                id="course-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex.: Polícia Federal"
                maxLength={200}
                required
              />
            </div>
            <div>
              <Label htmlFor="course-description">Descrição</Label>
              <Textarea
                id="course-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descrição opcional do curso"
                maxLength={2000}
                rows={3}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={save.isPending}>
                {save.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
            setDeleteDeps(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {deleteBlocked ? "Exclusão bloqueada" : "Excluir curso?"}
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2 text-sm text-muted-foreground">
                {deleteBlocked ? (
                  <>
                    <p>
                      O curso <strong>{deleteTarget?.name}</strong> possui vínculos e não pode ser
                      excluído. Remova-os antes em Cargos, Assinaturas e Pacotes.
                    </p>
                    {deleteDeps && (
                      <ul className="list-disc pl-5 space-y-1">
                        {deleteDeps.positions > 0 && (
                          <li>{deleteDeps.positions} cargo(s) vinculado(s).</li>
                        )}
                        {deleteDeps.subscriptions > 0 && (
                          <li>{deleteDeps.subscriptions} assinatura(s) vinculada(s).</li>
                        )}
                        {deleteDeps.packages > 0 && (
                          <li>{deleteDeps.packages} pacote(s) vinculado(s).</li>
                        )}
                      </ul>
                    )}
                  </>
                ) : (
                  <p>
                    O curso <strong>{deleteTarget?.name}</strong> será removido permanentemente.
                    Esta ação não pode ser desfeita.
                  </p>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {deleteBlocked ? (
              <AlertDialogCancel>Entendi</AlertDialogCancel>
            ) : (
              <>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={remove.isPending}
                  onClick={(e) => {
                    e.preventDefault();
                    if (deleteTarget) remove.mutate(deleteTarget);
                  }}
                >
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
