import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TopicsPage } from "@/components/admin/taxonomy/TopicsPage";
import { PageErrorState } from "@/components/shared/PageErrorState";

export const Route = createFileRoute("/_authenticated/admin/subjects/$subjectId")({
  component: SubjectTopicsRoute,
});

function SubjectTopicsRoute() {
  const { subjectId } = Route.useParams();

  const { data: subject, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["subjects", subjectId],
    queryFn: async () => {
      const { data, error: qError } = await supabase
        .from("subjects")
        .select("id,name")
        .eq("id", subjectId)
        .maybeSingle();
      if (qError) throw qError;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-4 w-72 animate-pulse rounded bg-muted" />
      </div>
    );
  }

  if (isError) {
    return (
      <PageErrorState
        message={(error as Error).message}
        onRetry={() => refetch()}
      />
    );
  }

  if (!subject) {
    return (
      <PageErrorState
        title="Disciplina não encontrada"
        message="A disciplina solicitada não existe ou foi removida."
      />
    );
  }

  return <TopicsPage lockedSubject={subject} />;
}
