import { createFileRoute } from "@tanstack/react-router";
import { PackagesPage } from "@/components/admin/packages/PackagesPage";

export const Route = createFileRoute("/_authenticated/admin/packages")({
  component: PackagesPage,
});
