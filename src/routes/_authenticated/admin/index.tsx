import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, HelpCircle, Users, Package, GitBranch, KeyRound, Upload, Rocket, CheckCircle2, ClipboardList } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const cards = [
    { title: "Cursos", table: "courses", icon: BookOpen },
    { title: "Pacotes", table: "packages", icon: Package },
    { title: "Versões", table: "package_versions", icon: GitBranch },
    { title: "Questões cadastradas", table: "questions", icon: HelpCircle },
    { title: "Usuários", table: "profiles", icon: Users },
    { title: "Assinaturas", table: "subscriptions", icon: KeyRound, filter: (q: any) => q.eq("status", "ACTIVE") },
  ];

  const { data: publishedCount = 0 } = useQuery({
    queryKey: ["questions-published"],
    queryFn: async () => {
      const { data } = await supabase.from("package_versions").select("id").eq("published", true);
      const ids = (data ?? []).map((r: any) => r.id);
      if (!ids.length) return 0;
      const { count } = await supabase.from("questions").select("*", { count: "exact", head: true }).in("package_version_id", ids);
      return count ?? 0;
    },
  });

  const { data: reviewCount = 0 } = useQuery({
    queryKey: ["questions-in-review"],
    queryFn: async () => {
      const { data } = await supabase.from("import_batches").select("report").eq("status", "pending");
      return (data ?? []).reduce((acc: number, b: any) => acc + (b.report?.counts?.valid ?? 0), 0);
    },
  });

  const { data: lastImport } = useQuery({
    queryKey: ["last-import"],
    queryFn: async () => (await supabase.from("import_batches").select("filename, created_at, status").order("created_at", { ascending: false }).limit(1).maybeSingle()).data,
  });

  const { data: lastPublish } = useQuery({
    queryKey: ["last-publish"],
    queryFn: async () => {
      const { data } = await supabase
        .from("package_versions")
        .select("version, updated_at, packages(name)")
        .eq("published", true)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      return data as { version: string; updated_at: string; packages: { name: string } | null } | null;
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Visão geral do sistema.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cards.map((c) => <CountCard key={c.title} {...c} />)}
        <StatCard title="Questões publicadas" value={String(publishedCount)} icon={CheckCircle2} />
        <StatCard title="Questões em revisão" value={String(reviewCount)} icon={ClipboardList} />
        <StatCard
          title="Última importação"
          value={lastImport ? `${lastImport.filename} (${new Date(lastImport.created_at).toLocaleDateString("pt-BR")})` : "—"}
          icon={Upload}
        />
        <StatCard
          title="Última publicação"
          value={lastPublish ? `${lastPublish.packages?.name ?? ""} v${lastPublish.version}` : "—"}
          icon={Rocket}
        />
      </div>
    </div>
  );
}

function CountCard({ title, table, icon: Icon, filter }: { title: string; table: string; icon: any; filter?: (q: any) => any }) {
  const { data, isLoading } = useQuery({
    queryKey: ["count", table, filter?.toString() ?? ""],
    queryFn: async () => {
      let q = supabase.from(table as any).select("*", { count: "exact", head: true });
      if (filter) q = filter(q);
      const { count, error } = await q;
      if (error) throw error;
      return count ?? 0;
    },
  });
  return <StatCard title={title} value={isLoading ? "…" : String(data)} icon={Icon} />;
}

function StatCard({ title, value, icon: Icon }: { title: string; value: string; icon: any }) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">{title}</div>
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-3 text-xl font-semibold truncate">{value}</div>
    </div>
  );
}
