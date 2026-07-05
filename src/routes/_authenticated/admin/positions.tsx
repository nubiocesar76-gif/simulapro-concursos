import { createFileRoute } from "@tanstack/react-router";
import { PositionsPage } from "@/components/admin/taxonomy/PositionsPage";

export const Route = createFileRoute("/_authenticated/admin/positions")({
  component: PositionsPage,
});
