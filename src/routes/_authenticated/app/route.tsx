import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard, BookOpen, CreditCard, BookOpenCheck, History } from "lucide-react";
import { AppShell, type NavGroup } from "@/components/AppShell";

export const Route = createFileRoute("/_authenticated/app")({
  component: StudentLayout,
});

const groups: NavGroup[] = [
  {
    label: "Meu Estudo",
    items: [
      { title: "Dashboard", url: "/app", icon: LayoutDashboard },
      { title: "Estudo", url: "/app/study", icon: BookOpen },
      { title: "Revisão", url: "/app/review", icon: BookOpenCheck },
      { title: "Histórico", url: "/app/history", icon: History },
      { title: "Assinatura", url: "/app/subscription", icon: CreditCard },
    ],
  },
];

function StudentLayout() {
  return <AppShell brand="SimulaPro" groups={groups} />;
}
