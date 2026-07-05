import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AdminTableBody } from "@/components/admin/shared/AdminTableBody";
import { formatAdminError } from "@/lib/admin-ui";

export const Route = createFileRoute("/_authenticated/admin/users")({
  component: UsersPage,
});

function UsersPage() {
  const { data = [], isLoading, isError, error } = useQuery({
    queryKey: ["users-list"],
    queryFn: async () => {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (profilesError) throw profilesError;

      const { data: roles, error: rolesError } = await supabase.from("user_roles").select("*");
      if (rolesError) throw rolesError;

      return (profiles ?? []).map((p) => ({
        ...p,
        roles: (roles ?? []).filter((r) => r.user_id === p.id).map((r) => r.role),
      }));
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Usuários</h1>
        <p className="text-sm text-muted-foreground">Perfis: Administrador e Aluno.</p>
      </div>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Perfil</TableHead>
              <TableHead>Cadastro</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AdminTableBody
              colSpan={4}
              isLoading={isLoading}
              isError={isError}
              error={error as Error}
              isEmpty={data.length === 0}
              emptyMessage="Nenhum usuário cadastrado."
              formatError={formatAdminError}
            >
              {data.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.full_name ?? "—"}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    {u.roles.length === 0
                      ? "—"
                      : u.roles.map((r: string) => (
                          <Badge
                            key={r}
                            variant={r === "admin" ? "default" : "secondary"}
                            className="mr-1"
                          >
                            {r}
                          </Badge>
                        ))}
                  </TableCell>
                  <TableCell>{new Date(u.created_at).toLocaleDateString("pt-BR")}</TableCell>
                </TableRow>
              ))}
            </AdminTableBody>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
