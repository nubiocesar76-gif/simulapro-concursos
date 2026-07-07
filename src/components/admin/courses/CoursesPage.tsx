import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2 } from "lucide-react";
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
import {
  TAXONOMY_PAGE_SIZE,
  formatTaxonomyError,
  formatDate,
  validateName,
  validateDescription,
  slugFromTaxonomyName,
  useDebouncedSearch,
  TaxonomySearch,
  TaxonomyPagination,
  type DeleteDep,
  hasDeleteDeps,
} from "@/components/admin/taxonomy/shared";

type Course = Tables<"courses">;

async function fetchCourseDeps(courseId: string): Promise<DeleteDep[]> {
  const [positions, subscriptions, packages] = await Promise.all([
    supabase.from("positions").select("*", { count: "exact", head: true }).eq("course_id", courseId),
    supabase.from("subscriptions").select("*", { count: "exact", head: true }).eq("course_id", courseId),
    supabase.from("packages").select("*", { count: "exact", head: true }).eq("course_id", courseId),
  ]);

  return [
    { label: "cargo(s) vinculado(s)", count: positions.count ?? 0 },
    { label: "assinatura(s) vinculada(s)", count: subscriptions.count ?? 0 },
    { label: "pacote(s) vinculado(s)", count: packages.count ?? 0 },
  ];
}

export function CoursesPage() {
  const qc = useQueryClient();
  const { search, setSearch, debouncedSearch, page, setPage } = useDebouncedSearch();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Course | null>(null);
  const [deleteDeps, setDeleteDeps] = useState<DeleteDep[] | null>(null);

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
      const from = page * TAXONOMY_PAGE_SIZE;
      const to = from + TAXONOMY_PAGE_SIZE - 1;

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

  const save = useMutation({
    mutationFn: async () => {
      const validatedName = validateName(name);
      const payload = {
        name: validatedName,
        description: validateDescription(description),
        slug: slugFromTaxonomyName(validatedName, "curso"),
      };

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
    onError: (e: Error) => toast.error(formatTaxonomyError(e.message, "curso")),
  });

  const remove = useMutation({
    mutationFn: async (course: Course) => {
      const deps = await fetchCourseDeps(course.id);
      if (hasDeleteDeps(deps)) {
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
    onError: (e: Error) => toast.error(formatTaxonomyError(e.message, "curso")),
  });

  async function openDeleteDialog(course: Course) {
    setDeleteDeps(await fetchCourseDeps(course.id));
    setDeleteTarget(course);
  }

  const deleteBlocked = deleteDeps ? hasDeleteDeps(deleteDeps) : false;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Cursos</h1>
          <p className="text-sm text-muted-foreground">
            Cadastro de cursos oferecidos. Cursos vinculam cargos, pacotes e assinaturas.
          </p>
        </div>
        <Button
          className="shrink-0"
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
          Novo curso
        </Button>
      </div>

      <TaxonomySearch value={search} onChange={setSearch} placeholder="Buscar por nome ou descrição..." />

      <div className="overflow-x-auto rounded-lg border bg-card">
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
              formatError={(message) => formatTaxonomyError(message, "curso")}
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
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label={`Excluir ${course.name}`}
                      onClick={() => openDeleteDialog(course)}
                    >
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
                    <ul className="list-disc pl-5">
                      {deleteDeps?.filter((d) => d.count > 0).map((d) => (
                        <li key={d.label}>{d.count} {d.label}.</li>
                      ))}
                    </ul>
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
