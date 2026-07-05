import { createFileRoute } from "@tanstack/react-router";
import { StudyPage } from "@/components/app/study/StudyPage";

export const Route = createFileRoute("/_authenticated/app/study")({
  component: StudyPage,
});
