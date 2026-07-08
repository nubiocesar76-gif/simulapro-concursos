import { createFileRoute } from "@tanstack/react-router";
import { AcervoExamDetailPage } from "@/components/admin/acervo/AcervoExamDetailPage";

export const Route = createFileRoute("/_authenticated/admin/acervo/$examId")({
  component: AcervoExamDetailRoute,
});

function AcervoExamDetailRoute() {
  const { examId } = Route.useParams();
  return <AcervoExamDetailPage examId={examId} />;
}
