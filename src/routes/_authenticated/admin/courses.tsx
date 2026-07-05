import { createFileRoute } from "@tanstack/react-router";
import { CoursesPage } from "@/components/admin/courses/CoursesPage";

export const Route = createFileRoute("/_authenticated/admin/courses")({
  component: CoursesPage,
});
