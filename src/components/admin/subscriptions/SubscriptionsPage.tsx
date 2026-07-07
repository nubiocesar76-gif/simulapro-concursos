import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Power, PowerOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { logEvent } from "@/lib/log";
import {
  formatSubscriptionError,
  SUBSCRIPTION_STATUS_LABELS,
  SUBSCRIPTION_STATUS_OPTIONS,
  validateSubscriptionDates,
  type SubscriptionStatus,
} from "@/lib/subscriptions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

type SubscriptionRow = Tables<"subscriptions"> & {
  profiles: { full_name: string | null; email: string | null } | null;
  content_distributions: {
    name: string;
    package_versions: {
      version_number: string;
      packages: { name: string; courses: { name: string } | null } | null;
    } | null;
  } | null;
};

function statusBadgeVariant(status: SubscriptionStatus): "default" | "secondary" {
  return status === "ACTIVE" ? "default" : "secondary";
}

function formatOptionalDate(iso: string | null) {
  if (!iso) return "—";
  return formatDate(iso);
}

export function SubscriptionsPage() {
  const qc = useQueryClient();
  const { search, setSearch, debouncedSearch, page, setPage } = useDebouncedSearch();
  const [userFilter, setUserFilter] = useState("all");
  const [distributionFilter, setDistributionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<SubscriptionRow | null>(null);
  const [userId, setUserId] = useState("");
  const [distributionId, setDistributionId] = useState("");
  const [status, setStatus] = useState<SubscriptionStatus>("ACTIVE");
  const [startsAt, setStartsAt] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<SubscriptionRow | null>(null);
  const [toggleTarget, setToggleTarget] = useState<SubscriptionRow | null>(null);

  const { data: users = [] } = useQuery({
    queryKey: ["profiles", "subscription-options"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .order("full_name");
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: distributions = [] } = useQuery({
    queryKey: ["content_distributions", "subscription-options"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_distributions")
        .select("id, name, status, package_versions(version_number, packages(name, courses(name)))")
        .eq("status", "ACTIVE")
        .order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

  useEffect(() => {
    if (!dialogOpen) return;
    if (editing) {
      setUserId(editing.user_id);
      setDistributionId(editing.distribution_id ?? "");
      setStatus((editing.status as SubscriptionStatus) ?? "ACTIVE");
      setStartsAt(editing.starts_at ? editing.starts_at.slice(0, 16) : "");
      setExpiresAt(editing.expires_at ? editing.expires_at.slice(0, 16) : "");
    } else {
      setUserId(userFilter !== "all" ? userFilter : "");
      setDistributionId(distributionFilter !== "all" ? distributionFilter : "");
      setStatus("ACTIVE");
      setStartsAt("");
      setExpiresAt("");
    }
  }, [dialogOpen, editing, userFilter, distributionFilter]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["subscriptions", debouncedSearch, page, userFilter, distributionFilter, statusFilter],
    queryFn: async () => {
      let userIds: string[] | null = null;
      if (debouncedSearch) {
        const term = `%${debouncedSearch}%`;
        const { data: matched } = await supabase
          .from("profiles")
          .select("id")
          .or(`full_name.ilike.${term},email.ilike.${term}`);
        userIds = (matched ?? []).map((u) => u.id);
        if (!userIds.length) return { rows: [] as SubscriptionRow[], total: 0 };
      }

      const from = page * TAXONOMY_PAGE_SIZE;
      const to = from + TAXONOMY_PAGE_SIZE - 1;
      let q = supabase
        .from("subscriptions")
        .select(
          "*, content_distributions(name, package_versions(version_number, packages(name, courses(name))))",
          { count: "exact" },
        )
        .not("distribution_id", "is", null)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (userFilter !== "all") q = q.eq("user_id", userFilter);
      if (distributionFilter !== "all") q = q.eq("distribution_id", distributionFilter);
      if (statusFilter !== "all") q = q.eq("status", statusFilter as SubscriptionStatus);
      if (userIds) q = q.in("user_id", userIds);

      const { data: rows, error: qError, count } = await q;
      if (qError) throw qError;

      const subscriptionRows = rows ?? [];
      const profileUserIds = [...new Set(subscriptionRows.map((r) => r.user_id).filter(Boolean))];
      let profileById = new Map<string, { full_name: string | null; email: string | null }>();
      if (profileUserIds.length) {
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("id, full_name, email")
          .in("id", profileUserIds);
        if (profilesError) throw profilesError;
        profileById = new Map((profiles ?? []).map((p) => [p.id, p]));
      }

      return {
        rows: subscriptionRows.map((r) => ({
          ...r,
          profiles: profileById.get(r.user_id) ?? null,
        })) as SubscriptionRow[],
        total: count ?? 0,
      };
    },
  });

  const rows = data?.rows ?? [];
  const total = data?.total ?? 0;
  const hasActiveFilters =
    !!debouncedSearch ||
    userFilter !== "all" ||
    distributionFilter !== "all" ||
    statusFilter !== "all";

  const save = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!userId) throw new Error("Usuário é obrigatório.");
      if (!distributionId) throw new Error("Distribuição é obrigatória.");

      const dates = validateSubscriptionDates(startsAt, expiresAt);
      const payload = {
        user_id: userId,
        distribution_id: distributionId,
        status,
        ...dates,
      };

      const dupQuery = supabase
        .from("subscriptions")
        .select("id")
        .eq("user_id", userId)
        .eq("distribution_id", distributionId)
        .limit(1);
      const { data: existing } = editing?.id
        ? await dupQuery.neq("id", editing.id)
        : await dupQuery;
      if (existing?.length) throw new Error("Este usuário já possui assinatura para esta distribuição.");

      if (editing?.id) {
        const { error: updateError } = await supabase
          .from("subscriptions")
          .update({ ...payload, updated_by: user?.id ?? null })
          .eq("id", editing.id);
        if (updateError) throw updateError;
        await logEvent("subscription.update", "subscriptions", editing.id, { user_id: userId, distribution_id: distributionId });
        return;
      }

      const { data: created, error: insertError } = await supabase
        .from("subscriptions")
        .insert({
          ...payload,
          created_by: user?.id ?? null,
          updated_by: user?.id ?? null,
        })
        .select("id")
        .single();
      if (insertError) throw insertError;
      await logEvent("subscription.create", "subscriptions", created.id, { user_id: userId, distribution_id: distributionId });
    },
    onSuccess: () => {
      toast.success(editing ? "Assinatura atualizada." : "Assinatura criada.");
      qc.invalidateQueries({ queryKey: ["subscriptions"] });
      setDialogOpen(false);
      setEditing(null);
    },
    onError: (e: Error) => toast.error(formatSubscriptionError(e.message)),
  });

  const toggleStatus = useMutation({
    mutationFn: async (row: SubscriptionRow) => {
      const { data: { user } } = await supabase.auth.getUser();
      const nextStatus: SubscriptionStatus = row.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      const { error: updateError } = await supabase
        .from("subscriptions")
        .update({ status: nextStatus, updated_by: user?.id ?? null })
        .eq("id", row.id);
      if (updateError) throw updateError;
      await logEvent(
        nextStatus === "ACTIVE" ? "subscription.activate" : "subscription.deactivate",
        "subscriptions",
        row.id,
        { user_id: row.user_id, distribution_id: row.distribution_id },
      );
    },
    onSuccess: (_, row) => {
      toast.success(row.status === "ACTIVE" ? "Assinatura desativada." : "Assinatura ativada.");
      qc.invalidateQueries({ queryKey: ["subscriptions"] });
      setToggleTarget(null);
    },
    onError: (e: Error) => toast.error(formatSubscriptionError(e.message)),
  });

  const remove = useMutation({
    mutationFn: async (row: SubscriptionRow) => {
      const { error: deleteError } = await supabase.from("subscriptions").delete().eq("id", row.id);
      if (deleteError) throw deleteError;
      await logEvent("subscription.delete", "subscriptions", row.id, {
        user_id: row.user_id,
        distribution_id: row.distribution_id,
      });
    },
    onSuccess: () => {
      toast.success("Assinatura excluída.");
      qc.invalidateQueries({ queryKey: ["subscriptions"] });
      setDeleteTarget(null);
      if (page > 0 && rows.length === 1) setPage((p) => p - 1);
    },
    onError: (e: Error) => toast.error(formatSubscriptionError(e.message)),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Assinaturas</h1>
          <p className="text-sm text-muted-foreground">
            Vínculo entre usuários e distribuições de conteúdo publicado.
          </p>
        </div>
        <Button className="shrink-0" onClick={() => { setEditing(null); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
          Nova assinatura
        </Button>
      </div>

      <AdminFiltersCard>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <TaxonomySearch value={search} onChange={setSearch} placeholder="Buscar por nome ou e-mail..." />
          <Select value={userFilter} onValueChange={(v) => { setUserFilter(v); setPage(0); }}>
            <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="Usuário" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os usuários</SelectItem>
              {users.map((u) => (
                <SelectItem key={u.id} value={u.id}>{u.full_name || u.email}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={distributionFilter} onValueChange={(v) => { setDistributionFilter(v); setPage(0); }}>
            <SelectTrigger className="w-full sm:w-52"><SelectValue placeholder="Distribuição" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as distribuições</SelectItem>
              {distributions.map((d) => (
                <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(0); }}>
            <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {SUBSCRIPTION_STATUS_OPTIONS.map((s) => (
                <SelectItem key={s} value={s}>{SUBSCRIPTION_STATUS_LABELS[s]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </AdminFiltersCard>

      <div className="overflow-x-auto rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="sticky left-0 z-20 min-w-[10rem] bg-card">Usuário</TableHead>
              <TableHead className="sticky left-[10rem] z-20 min-w-[9rem] bg-card">Distribuição</TableHead>
              <TableHead className="min-w-[10rem]">Curso / Pacote</TableHead>
              <TableHead className="sticky right-[8rem] z-10 min-w-[6rem] bg-card">Status</TableHead>
              <TableHead className="min-w-[7rem]">Início</TableHead>
              <TableHead className="min-w-[7rem]">Expira em</TableHead>
              <TableHead className="sticky right-0 z-20 min-w-[8rem] bg-card text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AdminTableBody
              colSpan={7}
              isLoading={isLoading}
              isError={isError}
              error={error as Error}
              isEmpty={rows.length === 0}
              emptyMessage="Nenhuma assinatura cadastrada."
              filteredEmptyMessage="Nenhuma assinatura encontrada."
              hasActiveFilters={hasActiveFilters}
              formatError={formatSubscriptionError}
            >
              {rows.map((row) => {
                const userLabel = row.profiles?.full_name ?? row.profiles?.email ?? "usuário";
                return (
                  <TableRow key={row.id}>
                    <TableCell className="sticky left-0 z-20 bg-card">
                      <div className="max-w-[12rem] truncate font-medium">{row.profiles?.full_name ?? "—"}</div>
                      <div className="max-w-[12rem] truncate text-xs text-muted-foreground">{row.profiles?.email}</div>
                    </TableCell>
                    <TableCell className="sticky left-[10rem] z-20 max-w-[11rem] truncate bg-card text-sm">
                      {row.content_distributions?.name ?? "—"}
                    </TableCell>
                    <TableCell className="max-w-[12rem] truncate text-xs text-muted-foreground">
                      {row.content_distributions?.package_versions?.packages?.courses?.name ?? "—"}
                      {" / "}
                      {row.content_distributions?.package_versions?.packages?.name ?? "—"}
                      {" · v"}
                      {row.content_distributions?.package_versions?.version_number ?? "—"}
                    </TableCell>
                    <TableCell className="sticky right-[8rem] z-10 bg-card">
                      <Badge variant={statusBadgeVariant((row.status as SubscriptionStatus) ?? "ACTIVE")}>
                        {SUBSCRIPTION_STATUS_LABELS[(row.status as SubscriptionStatus) ?? "ACTIVE"]}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                      {formatOptionalDate(row.starts_at)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                      {formatOptionalDate(row.expires_at)}
                    </TableCell>
                    <TableCell className="sticky right-0 z-20 bg-card text-right">
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label={`Editar assinatura de ${userLabel}`}
                        onClick={() => { setEditing(row); setDialogOpen(true); }}
                      >
                        <Pencil className="h-4 w-4" aria-hidden="true" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label={row.status === "ACTIVE" ? `Desativar assinatura de ${userLabel}` : `Ativar assinatura de ${userLabel}`}
                        onClick={() => setToggleTarget(row)}
                      >
                        {row.status === "ACTIVE" ? (
                          <PowerOff className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <Power className="h-4 w-4" aria-hidden="true" />
                        )}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label={`Excluir assinatura de ${userLabel}`}
                        onClick={() => setDeleteTarget(row)}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </AdminTableBody>
          </TableBody>
        </Table>
      </div>

      <TaxonomyPagination page={page} total={total} onPageChange={setPage} />

      <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) setEditing(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar assinatura" : "Nova assinatura"}</DialogTitle>
            <DialogDescription>
              Vincule um usuário a uma distribuição ativa. Sem duplicidade por par usuário/distribuição.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div>
              <Label>Usuário *</Label>
              <Select value={userId} onValueChange={setUserId} disabled={!!editing}>
                <SelectTrigger><SelectValue placeholder="Selecione o usuário" /></SelectTrigger>
                <SelectContent>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={u.id}>{u.full_name || u.email}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Distribuição *</Label>
              <Select value={distributionId} onValueChange={setDistributionId} disabled={!!editing}>
                <SelectTrigger><SelectValue placeholder="Selecione a distribuição" /></SelectTrigger>
                <SelectContent>
                  {distributions.length === 0 ? (
                    <SelectItem value="_empty" disabled>Nenhuma distribuição ativa</SelectItem>
                  ) : distributions.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name} — {d.package_versions?.packages?.name} v{d.package_versions?.version_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as SubscriptionStatus)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SUBSCRIPTION_STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>{SUBSCRIPTION_STATUS_LABELS[s]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Início</Label>
                <Input type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} />
              </div>
              <div>
                <Label>Expira em (opcional)</Label>
                <Input type="datetime-local" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={() => save.mutate()} disabled={save.isPending || distributions.length === 0}>
              {save.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir assinatura?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a assinatura de <strong>{deleteTarget?.profiles?.full_name ?? deleteTarget?.profiles?.email}</strong>?
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
              {toggleTarget?.status === "ACTIVE" ? "Desativar assinatura?" : "Ativar assinatura?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {toggleTarget?.status === "ACTIVE"
                ? "O usuário perderá acesso ativo a esta distribuição."
                : "O usuário voltará a ter acesso ativo a esta distribuição."}
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
