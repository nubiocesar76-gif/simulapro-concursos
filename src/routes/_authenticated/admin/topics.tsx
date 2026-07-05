import { createFileRoute } from "@tanstack/react-router";
import { TopicsPage } from "@/components/admin/taxonomy/TopicsPage";

export const Route = createFileRoute("/_authenticated/admin/topics")({
  component: TopicsPage,
});
