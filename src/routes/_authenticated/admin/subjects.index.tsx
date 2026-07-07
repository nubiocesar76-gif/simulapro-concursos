import { createFileRoute } from "@tanstack/react-router";
import { SubjectsPage } from "@/components/admin/taxonomy/SubjectsPage";

export const Route = createFileRoute("/_authenticated/admin/subjects/")({
  component: SubjectsPage,
});
