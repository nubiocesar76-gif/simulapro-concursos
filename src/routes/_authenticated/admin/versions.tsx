import { createFileRoute } from "@tanstack/react-router";
import { VersionsPage } from "@/components/admin/versions/VersionsPage";

export const Route = createFileRoute("/_authenticated/admin/versions")({
  component: VersionsPage,
});
