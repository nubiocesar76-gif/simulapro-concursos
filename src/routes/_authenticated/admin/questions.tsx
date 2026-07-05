import { createFileRoute } from "@tanstack/react-router";
import { QuestionsPage } from "@/components/admin/questions/QuestionsPage";

export const Route = createFileRoute("/_authenticated/admin/questions")({
  component: QuestionsPage,
});
