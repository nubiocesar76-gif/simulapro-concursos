import { createFileRoute } from "@tanstack/react-router";
import { AcervoCatalogPage } from "@/components/admin/acervo/AcervoCatalogPage";

export const Route = createFileRoute("/_authenticated/admin/acervo/")({
  component: AcervoCatalogPage,
});
