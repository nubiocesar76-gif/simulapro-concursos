import { createFileRoute } from "@tanstack/react-router";
import { EditorialImportPage } from "@/components/admin/editorial/EditorialImportPage";

export const Route = createFileRoute("/_authenticated/admin/acervo/editorial/import")({
  component: EditorialImportPage,
});
