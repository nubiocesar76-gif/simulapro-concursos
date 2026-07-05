import { createFileRoute } from "@tanstack/react-router";
import { ImportPage } from "@/components/admin/import/ImportPage";

export const Route = createFileRoute("/_authenticated/admin/import")({
  component: ImportPage,
});
