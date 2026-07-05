import { createFileRoute } from "@tanstack/react-router";
import { ExamsPage } from "@/components/admin/taxonomy/ExamsPage";

export const Route = createFileRoute("/_authenticated/admin/exams")({
  component: ExamsPage,
});
