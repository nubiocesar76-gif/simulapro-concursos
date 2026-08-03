import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { deleteUser } from "@/lib/admin-users.functions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { AdminTableBody } from "@/components/admin/shared/AdminTableBody";
import { formatAdminError } from "@/lib/admin-ui";

export const Route = createFileRoute("/_authenticated/admin/users")({
  component: UsersPage,
});

type SubscriptionStatusRow = {
  status: "ACTIVE" | "INACTIVE";
  starts_at: string;
  expires_at: string | null;
};

type UserRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  created_at: string;
  roles: string[];
  subscriptionStatus: "ativa" | "inativa" | "sem_assinatura";
};

// Mesmo critério já homologado em SubscriptionPage.tsx (isCurrentlyActive) — reimplementado
// aqui de propósito, sem extrair para um util compartilhado, para não fazer refatoração
// paralela fora do escopo desta correção.
function hasCurrentlyActiveSubscription(subs: SubscriptionStatusRow[]): boolean {
  const now = Date.now();
  return subs.some((s) => {
    if (s.status !== "ACTIVE") return false;
    if (new Date(s.starts_at).getTime() > now) return false;
    if (s.expires_at && new Date(s.expires_at).getTime() < now) return false;
    return true;
  });
}

function computeSubscriptionStatus(subs: SubscriptionStatusRow[]): UserRow["subscriptionStatus"] {
  if (subs.length === 0) return "sem_assinatura";
  return hasCurrentlyActiveSubscription(subs) ? "ativa" : "inativa";
}

const STATUS_LABELS: Record<UserRow["subscriptionStatus"], string> = {
  ativa: "Assinatura ativa",
  inativa: "Assinatura inativa",
  sem_assinatura: "Sem assinatura",
};

function statusBadgeVariant(
  status: UserRow["subscriptionStatus"],
): "default" | "secondary" | "outline" {
  if (status === "ativa") return "default";
  if (status === "inativa") return "secondary";
  return "outline";
}

function UsersPage() {
  const qc = useQueryClient();
  const { user: currentUser } = useAuth();
  const [editing, setEditing] = useState<UserRow | null>(null);
  const [editFullName, setEditFullName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<UserRow | null>(null);

  const {
    data = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["users-list"],
    queryFn: async () => {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (profilesError) throw profilesError;

      const { data: roles, error: rolesError } = await supabase.from("user_roles").select("*");
      if (rolesError) throw rolesError;

      const { data: subs, error: subsError } = await supabase
        .from("subscriptions")
        .select("user_id, status, starts_at, expires_at");
      if (subsError) throw subsError;

      return (profiles ?? []).map((p): UserRow => {
        const userSubs = (subs ?? []).filter((s) => s.user_id === p.id);
        return {
          id: p.id,
          full_name: p.full_name,
          email: p.email,
          created_at: p.created_at,
          roles: (roles ?? []).filter((r) => r.user_id === p.id).map((r) => r.role),
          subscriptionStatus: computeSubscriptionStatus(userSubs),
        };
      });
    },
  });

  const saveEdit = useMutation({
    mutationFn: async () => {
      if (!editing) return;
      const trimmed = editFullName.trim();
      if (!trimmed) throw new Error("Nome é obrigatório.");
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ full_name: trimmed })
        .eq("id", editing.id);
      if (updateError) throw updateError;
    },
    onSuccess: () => {
      toast.success("Nome atualizado.");
      qc.invalidateQueries({ queryKey: ["users-list"] });
      setEditing(null);
    },
    onError: (e: Error) => toast.error(formatAdminError(e.message)),
  });

  const remove = useMutation({
    mutationFn: async (row: UserRow) => {
      await deleteUser({ data: { userId: row.id } });
    },
    onSuccess: () => {
      toast.success("Usuário excluído.");
      qc.invalidateQueries({ queryKey: ["users-list"] });
      setDeleteTarget(null);
    },
    onError: (e: Error) => toast.error(formatAdminError(e.message)),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Usuários</h1>
        <p className="text-sm text-muted-foreground">Perfis: Administrador e Aluno.</p>
      </div>
      <div className="overflow-x-auto rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Perfil</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Cadastro</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AdminTableBody
              colSpan={6}
              isLoading={isLoading}
              isError={isError}
              error={error as Error}
              isEmpty={data.length === 0}
              emptyMessage="Nenhum usuário cadastrado."
              formatError={formatAdminError}
            >
              {data.map((u) => {
                const isSelf = currentUser?.id === u.id;
                return (
                  <TableRow key={u.id}>
                    <TableCell>{u.full_name ?? "—"}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      {u.roles.length === 0
                        ? "—"
                        : u.roles.map((r) => (
                            <Badge
                              key={r}
                              variant={r === "admin" ? "default" : "secondary"}
                              className="mr-1"
                            >
                              {r}
                            </Badge>
                          ))}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusBadgeVariant(u.subscriptionStatus)}>
                        {STATUS_LABELS[u.subscriptionStatus]}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(u.created_at).toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label={`Editar ${u.full_name ?? u.email}`}
                        onClick={() => {
                          setEditing(u);
                          setEditFullName(u.full_name ?? "");
                        }}
                      >
                        <Pencil className="h-4 w-4" aria-hidden="true" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label={`Excluir ${u.full_name ?? u.email}`}
                        disabled={isSelf}
                        title={isSelf ? "Você não pode excluir sua própria conta." : undefined}
                        onClick={() => setDeleteTarget(u)}
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

      <Dialog
        open={!!editing}
        onOpenChange={(o) => {
          if (!o) setEditing(null);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar usuário</DialogTitle>
            <DialogDescription>
              Nesta versão só é possível alterar o nome. E-mail, senha e papel não podem ser
              alterados aqui.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div>
              <Label>Nome completo *</Label>
              <Input value={editFullName} onChange={(e) => setEditFullName(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setEditing(null)}>
              Cancelar
            </Button>
            <Button onClick={() => saveEdit.mutate()} disabled={saveEdit.isPending}>
              {saveEdit.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => {
          if (!o) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir usuário?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2">
                <p>
                  Esta ação é <strong>irreversível</strong> e vai remover definitivamente{" "}
                  <strong>{deleteTarget?.full_name ?? deleteTarget?.email}</strong> e tudo que está
                  vinculado à conta:
                </p>
                <ul className="list-disc pl-5 text-sm">
                  <li>conta e perfil</li>
                  <li>papéis (admin/aluno)</li>
                  <li>assinaturas</li>
                  <li>sessões de estudo e histórico</li>
                  <li>favoritos e itens marcados para revisão</li>
                  <li>estatísticas relacionadas</li>
                </ul>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget && remove.mutate(deleteTarget)}
              disabled={remove.isPending}
            >
              {remove.isPending ? "Excluindo..." : "Excluir definitivamente"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
