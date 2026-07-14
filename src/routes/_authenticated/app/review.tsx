import { createFileRoute } from "@tanstack/react-router";
import { ReviewCenterPage } from "@/components/app/review/ReviewCenterPage";

export const Route = createFileRoute("/_authenticated/app/review")({
  component: ReviewCenterPage,
});
