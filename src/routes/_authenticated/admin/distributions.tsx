import { createFileRoute } from "@tanstack/react-router";
import { DistributionsPage } from "@/components/admin/distributions/DistributionsPage";

export const Route = createFileRoute("/_authenticated/admin/distributions")({
  component: DistributionsPage,
});
