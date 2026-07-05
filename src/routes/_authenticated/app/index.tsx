import { createFileRoute } from "@tanstack/react-router";
import { StudentDashboardPage } from "@/components/app/dashboard/StudentDashboardPage";

export const Route = createFileRoute("/_authenticated/app/")({
  component: StudentDashboardPage,
});
