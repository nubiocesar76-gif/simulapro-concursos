import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  GitBranch,
  HelpCircle,
  KeyRound,
  Package,
  Rocket,
  Upload,
  Users,
  type LucideIcon,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminDashboard,
});

const pageShellClass = "mx-auto space-y-8 2xl:max-w-[1600px]";

type StatCardProps = {
  title: string;
  value?: string;
  icon: LucideIcon;
  to?: string;
  isLoading?: boolean;
  isError?: boolean;
  highlighted?: boolean;
  compactValue?: boolean;
};

function StatCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-5 shadow">
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-9 w-9 rounded-lg" />
      </div>
      <Skeleton className="mt-3 h-8 w-20" />
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  to,
  isLoading = false,
  isError = false,
  highlighted = false,
  compactValue = false,
}: StatCardProps) {
  if (isLoading) {
    return <StatCardSkeleton />;
  }

  const className = cn(
    "flex h-full flex-col rounded-lg border bg-card p-5 shadow transition-colors",
    to && "hover:border-primary/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
    highlighted && "border-warning/40 bg-warning/5",
  );

  const content = (
    <>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 text-sm text-muted-foreground">{title}</div>
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </div>
      </div>
      {isError ? (
        <div className="mt-3 flex items-start gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
          <span>Não foi possível carregar</span>
        </div>
      ) : (
        <div
          className={cn(
            "mt-auto pt-3 truncate",
            compactValue
              ? "text-sm font-medium"
              : "text-2xl font-semibold tabular-nums tracking-tight",
          )}
        >
          {value}
        </div>
      )}
    </>
  );

  if (to && !isError) {
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}

type CountCardProps = {
  title: string;
  table: string;
  icon: LucideIcon;
  to: string;
  filter?: (query: any) => any;
};

function CountCard({ title, table, icon, to, filter }: CountCardProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["count", table, filter?.toString() ?? ""],
    queryFn: async () => {
      let query = supabase.from(table as "courses").select("*", { count: "exact", head: true });
      if (filter) query = filter(query);
      const { count, error } = await query;
      if (error) throw error;
      return count ?? 0;
    },
  });

  return (
    <StatCard
      title={title}
      value={String(data ?? 0)}
      icon={icon}
      to={to}
      isLoading={isLoading}
      isError={isError}
    />
  );
}

function AdminDashboard() {
  const { data: publishedCount, isLoading: isPublishedLoading, isError: isPublishedError } =
    useQuery({
      queryKey: ["questions-published"],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("package_versions")
          .select("id")
          .eq("published", true);
        if (error) throw error;
        const ids = (data ?? []).map((row) => row.id);
        if (!ids.length) return 0;
        const { count, error: countError } = await supabase
          .from("questions")
          .select("*", { count: "exact", head: true })
          .in("package_version_id", ids);
        if (countError) throw countError;
        return count ?? 0;
      },
    });

  const { data: reviewCount, isLoading: isReviewLoading, isError: isReviewError } = useQuery({
    queryKey: ["questions-in-review"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("import_batches")
        .select("report")
        .eq("status", "pending");
      if (error) throw error;
      return (data ?? []).reduce(
        (acc, batch) => acc + ((batch.report as { counts?: { valid?: number } } | null)?.counts?.valid ?? 0),
        0,
      );
    },
  });

  const { data: lastImport, isLoading: isImportLoading, isError: isImportError } = useQuery({
    queryKey: ["last-import"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("import_batches")
        .select("filename, created_at, status")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: lastPublish, isLoading: isPublishLoading, isError: isPublishError } = useQuery({
    queryKey: ["last-publish"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("package_versions")
        .select("version, updated_at, packages(name)")
        .eq("published", true)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data as {
        version: string;
        updated_at: string;
        packages: { name: string } | null;
      } | null;
    },
  });

  const lastImportValue = lastImport
    ? `${lastImport.filename} (${new Date(lastImport.created_at).toLocaleDateString("pt-BR")})`
    : "—";

  const lastPublishValue = lastPublish
    ? `${lastPublish.packages?.name ?? ""} v${lastPublish.version}`
    : "—";

  const reviewPending = (reviewCount ?? 0) > 0;
  const importPending = lastImport?.status === "pending";

  return (
    <div className={pageShellClass}>
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Visão geral do sistema.</p>
      </header>

      <section className="space-y-4" aria-label="Conteúdo">
        <div>
          <h2 className="text-lg font-semibold">Conteúdo</h2>
          <p className="text-sm text-muted-foreground">Cadastro e estrutura do acervo.</p>
        </div>
        <div className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <CountCard title="Cursos" table="courses" icon={BookOpen} to="/admin/courses" />
          <CountCard title="Pacotes" table="packages" icon={Package} to="/admin/packages" />
          <CountCard title="Versões" table="package_versions" icon={GitBranch} to="/admin/versions" />
          <CountCard title="Questões cadastradas" table="questions" icon={HelpCircle} to="/admin/questions" />
        </div>
      </section>

      <section className="space-y-4" aria-label="Pipeline">
        <div>
          <h2 className="text-lg font-semibold">Pipeline</h2>
          <p className="text-sm text-muted-foreground">Publicação, importação e pendências.</p>
        </div>
        <div className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Questões publicadas"
            value={String(publishedCount ?? 0)}
            icon={CheckCircle2}
            to="/admin/versions"
            isLoading={isPublishedLoading}
            isError={isPublishedError}
          />
          <StatCard
            title="Questões em revisão"
            value={String(reviewCount ?? 0)}
            icon={ClipboardList}
            to="/admin/import"
            isLoading={isReviewLoading}
            isError={isReviewError}
            highlighted={reviewPending}
          />
          <StatCard
            title="Última importação"
            value={lastImportValue}
            icon={Upload}
            to="/admin/import"
            isLoading={isImportLoading}
            isError={isImportError}
            highlighted={importPending}
            compactValue
          />
          <StatCard
            title="Última publicação"
            value={lastPublishValue}
            icon={Rocket}
            to="/admin/versions"
            isLoading={isPublishLoading}
            isError={isPublishError}
            compactValue
          />
        </div>
      </section>

      <section className="space-y-4" aria-label="Gestão">
        <div>
          <h2 className="text-lg font-semibold">Gestão</h2>
          <p className="text-sm text-muted-foreground">Usuários e assinaturas ativas.</p>
        </div>
        <div className="grid items-stretch gap-4 sm:grid-cols-2 lg:max-w-2xl lg:grid-cols-2">
          <CountCard title="Usuários" table="profiles" icon={Users} to="/admin/users" />
          <CountCard
            title="Assinaturas (ativas)"
            table="subscriptions"
            icon={KeyRound}
            to="/admin/subscriptions"
            filter={(query) => query.eq("status", "ACTIVE")}
          />
        </div>
      </section>
    </div>
  );
}
