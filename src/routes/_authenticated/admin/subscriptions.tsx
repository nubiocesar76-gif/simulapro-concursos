import { createFileRoute } from "@tanstack/react-router";
import { SubscriptionsPage } from "@/components/admin/subscriptions/SubscriptionsPage";

export const Route = createFileRoute("/_authenticated/admin/subscriptions")({
  component: SubscriptionsPage,
});
