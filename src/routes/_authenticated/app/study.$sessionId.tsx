import { createFileRoute } from "@tanstack/react-router";
import { StudySessionPage } from "@/components/app/study/StudySessionPage";

export const Route = createFileRoute("/_authenticated/app/study/$sessionId")({
  component: () => {
    const { sessionId } = Route.useParams();
    return <StudySessionPage sessionId={sessionId} />;
  },
});
