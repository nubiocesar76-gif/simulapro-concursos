import { createFileRoute } from "@tanstack/react-router";
import { EditorialEnginePage } from "@/components/admin/editorial/EditorialEnginePage";

export const Route = createFileRoute("/_authenticated/admin/acervo/editorial")({
  component: EditorialEnginePage,
});
