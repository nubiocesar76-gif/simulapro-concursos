import { createFileRoute } from "@tanstack/react-router";
import { SubscriptionPage } from "@/components/app/subscription/SubscriptionPage";

export const Route = createFileRoute("/_authenticated/app/subscription")({
  component: SubscriptionPage,
});
