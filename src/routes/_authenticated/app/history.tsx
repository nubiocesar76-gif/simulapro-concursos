import { createFileRoute } from "@tanstack/react-router";
import { StudyHistoryPage } from "@/components/app/history/StudyHistoryPage";

export const Route = createFileRoute("/_authenticated/app/history")({
  component: StudyHistoryPage,
});
