import { createFileRoute } from "@tanstack/react-router";
import { BoardsPage } from "@/components/admin/taxonomy/BoardsPage";

export const Route = createFileRoute("/_authenticated/admin/boards")({
  component: BoardsPage,
});
