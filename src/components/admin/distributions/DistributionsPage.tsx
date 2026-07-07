import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Power, PowerOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { logEvent } from "@/lib/log";
import {
  DISTRIBUTION_STATUS_EDITABLE,
  DISTRIBUTION_STATUS_LABELS,
  formatDistributionError,
  validateDistributionDates,
  validateDistributionDescription,
  validateDistributionName,
  type DistributionStatus,
  type DistributionStatusEditable,
} from "@/lib/distributions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
  formatDate,
  useDebouncedSearch,
  TaxonomySearch,
  TaxonomyPagination,
} from "@/components/admin/taxonomy/shared";
import { AdminTableBody } from "@/components/admin/shared/AdminTableBody";
import { AdminFiltersCard } from "@/components/admin/shared/AdminFiltersCard";

type DistributionRow = Tables<"content_distributions"> & {
  package_versions: {
    version_number: string;
    name: string;
    package_id: string;
    packages: { name: string; course_id: string; courses: { name: string } | null } | null;
  } | null;
};

type PublishedVersion = {
  id: string;
  version_number: string;
  name: string;
  package_id: string;
  packages: { name: string; course_id: string } | null;
};

function statusBadgeVariant(status: DistributionStatus): "default" | "secondary" | "outline" {
  if (status === "ACTIVE") return "default";
  if (status === "INACTIVE") return "secondary";
  return "outline";
}

function formatOptionalDate(iso: string | null) {
  if (!iso) return "—";
  return formatDate(iso);
}

export function DistributionsPage() {
  const qc = useQueryClient();
  const { search, setSearch, debouncedSearch, page, setPage } = useDebouncedSearch();
  const [courseFilter, setCourseFilter] = useState("all");
  const [packageFilter, setPackageFilter] = useState("all");
  const [versionFilter, setVersionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<DistributionRow | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [packageVersionId, setPackageVersionId] = useState("");
  const [status, setStatus] = useState<DistributionStatusEditable>("ACTIVE");
  const [availableFrom, setAvailableFrom] = useState("");
  const [availableUntil, setAvailableUntil] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<DistributionRow | null>(null);
  const [toggleTarget, setToggleTarget] = useState<DistributionRow | null>(null);

  const { data: courses = [] } = useQuery({
    queryKey: ["courses", "options"],
    queryFn: async () => {
      const { data, error } = await supabase.from("courses").select("id,name").order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: packages = [] } = useQuery({
    queryKey: ["packages", "options", courseFilter],
    queryFn: async () => {
      let q = supabase.from("packages").select("id,name,course_id").order("name");
      if (courseFilter !== "all") q = q.eq("course_id", courseFilter);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: publishedVersions = [] } = useQuery({
    queryKey: ["package_versions", "published", courseFilter, packageFilter],
    queryFn: async () => {
      let q = supabase
        .from("package_versions")
        .select("id, version_number, name, package_id, packages!inner(name, course_id)")
        .eq("status", "PUBLISHED")
        .order("version_number");
      if (courseFilter !== "all") q = q.eq("packages.course_id", courseFilter);
      if (packageFilter !== "all") q = q.eq("package_id", packageFilter);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as PublishedVersion[];
    },
  });

  useEffect(() => {
    if (!dialogOpen) return;
    if (editing) {
      setName(editing.name);
      setDescription(editing.description ?? "");
      setPackageVersionId(editing.package_version_id);
      setStatus(editing.status === "INACTIVE" ? "INACTIVE" : "ACTIVE");
      setAvailableFrom(editing.available_from ? editing.available_from.slice(0, 16) : "");
      setAvailableUntil(editing.available_until ? editing.available_until.slice(0, 16) : "");
    } else {
      setName("");
      setDescription("");
      setPackageVersionId(versionFilter !== "all" ? versionFilter : "");
      setStatus("ACTIVE");
      setAvailableFrom("");
      setAvailableUntil("");
    }
  }, [dialogOpen, editing, versionFilter]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["content_distributions", debouncedSearch, page, courseFilter, packageFilter, versionFilter, statusFilter],
    queryFn: async () => {
      const from = page * TAXONOMY_PAGE_SIZE;
      const to = from + TAXONOMY_PAGE_SIZE - 1;
      let q = supabase
        .from("content_distributions")
        .select(
          "*, package_versions!inner(version_number, name, package_id, packages!inner(name, course_id, courses(name)))",
          { count: "exact" },
        )
        .order("name", { ascending: true })
        .range(from, to);

      if (courseFilter !== "all") q = q.eq("package_versions.packages.course_id", courseFilter);
      if (packageFilter !== "all") q = q.eq("package_versions.package_id", packageFilter);
      if (versionFilter !== "all") q = q.eq("package_version_id", versionFilter);
      if (statusFilter !== "all") q = q.eq("status", statusFilter as DistributionStatus);

      if (debouncedSearch) {
        const term = `%${debouncedSearch}%`;
        q = q.or(`name.ilike.${term},description.ilike.${term}`);
      }

      const { data: rows, error: qError, count } = await q;
      if (qError) throw qError;
      return { rows: (rows ?? []) as DistributionRow[], total: count ?? 0 };
    },
  });

  const rows = data?.rows ?? [];
  const total = data?.total ?? 0;
  const hasActiveFilters =
    !!debouncedSearch ||
    courseFilter !== "all" ||
    packageFilter !== "all" ||
    versionFilter !== "all" ||
    statusFilter !== "all";

  const save = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const dates = validateDistributionDates(availableFrom, availableUntil);
      const payload = {
        name: validateDistributionName(name),
        description: validateDistributionDescription(description),
        package_version_id: packageVersionId,
        status,
        ...dates,
      };
      if (!payload.package_version_id) throw new Error("Versão é obrigatória.");

      const { data: version, error: versionError } = await supabase
        .from("package_versions")
        .select("id, status")
        .eq("id", payload.package_version_id)
        .maybeSingle();
      if (versionError) throw versionError;
      if (!version || version.status !== "PUBLISHED") {
        throw new Error("Somente versões publicadas podem ser distribuídas.");
      }

      if (editing?.id) {
        const { error: updateError } = await supabase
          .from("content_distributions")
          .update({ ...payload, updated_by: user?.id ?? null })
          .eq("id", editing.id);
        if (updateError) throw updateError;
        await logEvent("distribution.update", "content_distributions", editing.id, { name: payload.name });
        return;
      }

      const { data: created, error: insertError } = await supabase
        .from("content_distributions")
        .insert({
          ...payload,
          created_by: user?.id ?? null,
          updated_by: user?.id ?? null,
        })
        .select("id")
        .single();
      if (insertError) throw insertError;
      await logEvent("distribution.create", "content_distributions", created.id, { name: payload.name });
    },
    onSuccess: () => {
      toast.success(editing ? "Distribuição atualizada." : "Distribuição criada.");
      qc.invalidateQueries({ queryKey: ["content_distributions"] });
      setDialogOpen(false);
      setEditing(null);
    },
    onError: (e: Error) => toast.error(formatDistributionError(e.message)),
  });

  const toggleStatus = useMutation({
    mutationFn: async (row: DistributionRow) => {
      const { data: { user } } = await supabase.auth.getUser();
      const nextStatus: DistributionStatusEditable = row.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      const { error: updateError } = await supabase
        .from("content_distributions")
        .update({ status: nextStatus, updated_by: user?.id ?? null })
        .eq("id", row.id);
      if (updateError) throw updateError;
      await logEvent(
        nextStatus === "ACTIVE" ? "distribution.activate" : "distribution.deactivate",
        "content_distributions",
        row.id,
        { name: row.name },
      );
    },
    onSuccess: (_, row) => {
      toast.success(row.status === "ACTIVE" ? "Distribuição desativada." : "Distribuição ativada.");
      qc.invalidateQueries({ queryKey: ["content_distributions"] });
      setToggleTarget(null);
    },
    onError: (e: Error) => toast.error(formatDistributionError(e.message)),
  });

  const remove = useMutation({
    mutationFn: async (row: DistributionRow) => {
      const { error: deleteError } = await supabase.from("content_distributions").delete().eq("id", row.id);
      if (deleteError) throw deleteError;
      await logEvent("distribution.delete", "content_distributions", row.id, { name: row.name });
    },
    onSuccess: () => {
      toast.success("Distribuição excluída.");
      qc.invalidateQueries({ queryKey: ["content_distributions"] });
      setDeleteTarget(null);
      if (page > 0 && rows.length === 1) setPage((p) => p - 1);
    },
    onError: (e: Error) => toast.error(formatDistributionError(e.message)),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Distribuições</h1>
          <p className="text-sm text-muted-foreground">
            Cadastro de versões publicadas disponíveis para distribuição futura via assinaturas.
          </p>
        </div>
        <Button className="shrink-0" onClick={() => { setEditing(null); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
          Nova distribuição
        </Button>
      </div>

      <AdminFiltersCard>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <TaxonomySearch value={search} onChange={setSearch} placeholder="Buscar por nome..." />
          <Select value={courseFilter} onValueChange={(v) => { setCourseFilter(v); setPackageFilter("all"); setVersionFilter("all"); setPage(0); }}>
            <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="Curso" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os cursos</SelectItem>
              {courses.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={packageFilter} onValueChange={(v) => { setPackageFilter(v); setVersionFilter("all"); setPage(0); }}>
            <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="Pacote" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os pacotes</SelectItem>
              {packages.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={versionFilter} onValueChange={(v) => { setVersionFilter(v); setPage(0); }}>
            <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="Versão" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as versões</SelectItem>
              {publishedVersions.map((v) => (
                <SelectItem key={v.id} value={v.id}>
                  {v.packages?.name} — {v.version_number}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(0); }}>
            <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {DISTRIBUTION_STATUS_EDITABLE.map((s) => (
                <SelectItem key={s} value={s}>{DISTRIBUTION_STATUS_LABELS[s]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </AdminFiltersCard>

      <div className="overflow-x-auto rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="sticky left-0 z-20 min-w-[10rem] bg-card">Nome</TableHead>
              <TableHead className="min-w-[5rem]">Versão</TableHead>
              <TableHead className="min-w-[8rem]">Pacote</TableHead>
              <TableHead className="min-w-[8rem]">Curso</TableHead>
              <TableHead className="sticky right-[8rem] z-10 min-w-[6rem] bg-card">Status</TableHead>
              <TableHead className="min-w-[7rem]">Disponível de</TableHead>
              <TableHead className="min-w-[7rem]">Disponível até</TableHead>
              <TableHead className="sticky right-0 z-20 min-w-[8rem] bg-card text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AdminTableBody
              colSpan={8}
              isLoading={isLoading}
              isError={isError}
              error={error as Error}
              isEmpty={rows.length === 0}
              emptyMessage="Nenhuma distribuição cadastrada."
              filteredEmptyMessage="Nenhuma distribuição encontrada."
              hasActiveFilters={hasActiveFilters}
              formatError={formatDistributionError}
            >
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="sticky left-0 z-20 max-w-[12rem] truncate bg-card font-medium">
                    {row.name}
                  </TableCell>
                  <TableCell className="font-mono text-sm">{row.package_versions?.version_number}</TableCell>
                  <TableCell className="max-w-[10rem] truncate text-sm">{row.package_versions?.packages?.name ?? "—"}</TableCell>
                  <TableCell className="max-w-[10rem] truncate text-sm">{row.package_versions?.packages?.courses?.name ?? "—"}</TableCell>
                  <TableCell className="sticky right-[8rem] z-10 bg-card">
                    <Badge variant={statusBadgeVariant(row.status as DistributionStatus)}>
                      {DISTRIBUTION_STATUS_LABELS[row.status as DistributionStatus]}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                    {formatOptionalDate(row.available_from)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                    {formatOptionalDate(row.available_until)}
                  </TableCell>
                  <TableCell className="sticky right-0 z-20 bg-card text-right">
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label={`Editar ${row.name}`}
                      onClick={() => { setEditing(row); setDialogOpen(true); }}
                    >
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    {(row.status === "ACTIVE" || row.status === "INACTIVE") && (
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label={row.status === "ACTIVE" ? `Desativar ${row.name}` : `Ativar ${row.name}`}
                        onClick={() => setToggleTarget(row)}
                      >
                        {row.status === "ACTIVE" ? (
                          <PowerOff className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <Power className="h-4 w-4" aria-hidden="true" />
                        )}
                      </Button>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label={`Excluir ${row.name}`}
                      onClick={() => setDeleteTarget(row)}
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

      <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) setEditing(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar distribuição" : "Nova distribuição"}</DialogTitle>
            <DialogDescription>
              Vincule uma versão publicada. Múltiplas distribuições podem apontar para a mesma versão.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div>
              <Label>Versão publicada *</Label>
              <Select value={packageVersionId} onValueChange={setPackageVersionId} disabled={!!editing}>
                <SelectTrigger><SelectValue placeholder="Selecione a versão" /></SelectTrigger>
                <SelectContent>
                  {publishedVersions.length === 0 ? (
                    <SelectItem value="_none" disabled>Nenhuma versão publicada</SelectItem>
                  ) : publishedVersions.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.packages?.name} — {v.version_number} ({v.name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Nome *</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Lançamento PF 2026" />
            </div>
            <div>
              <Label>Descrição</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as DistributionStatusEditable)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DISTRIBUTION_STATUS_EDITABLE.map((s) => (
                    <SelectItem key={s} value={s}>{DISTRIBUTION_STATUS_LABELS[s]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Disponível de</Label>
                <Input type="datetime-local" value={availableFrom} onChange={(e) => setAvailableFrom(e.target.value)} />
              </div>
              <div>
                <Label>Disponível até</Label>
                <Input type="datetime-local" value={availableUntil} onChange={(e) => setAvailableUntil(e.target.value)} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={() => save.mutate()} disabled={save.isPending || publishedVersions.length === 0}>
              {save.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir distribuição?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir <strong>{deleteTarget?.name}</strong>? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteTarget && remove.mutate(deleteTarget)} disabled={remove.isPending}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!toggleTarget} onOpenChange={(o) => { if (!o) setToggleTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {toggleTarget?.status === "ACTIVE" ? "Desativar distribuição?" : "Ativar distribuição?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {toggleTarget?.status === "ACTIVE"
                ? `A distribuição "${toggleTarget?.name}" ficará inativa e não estará disponível para assinaturas futuras.`
                : `A distribuição "${toggleTarget?.name}" será reativada.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => toggleTarget && toggleStatus.mutate(toggleTarget)} disabled={toggleStatus.isPending}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
