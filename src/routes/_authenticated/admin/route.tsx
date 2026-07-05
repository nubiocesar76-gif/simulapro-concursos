import { createFileRoute } from "@tanstack/react-router";
import {
  LayoutDashboard, BookOpen, Briefcase, Building2, ClipboardList,
  Library, Layers, HelpCircle, Upload, Download, Package, GitBranch,
  Users, KeyRound, Share2,
} from "lucide-react";
import { AppShell, type NavGroup } from "@/components/AppShell";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

const groups: NavGroup[] = [
  {
    label: "Geral",
    items: [{ title: "Dashboard", url: "/admin", icon: LayoutDashboard }],
  },
  {
    label: "Conteúdo",
    items: [
      { title: "Cursos", url: "/admin/courses", icon: BookOpen },
      { title: "Cargos", url: "/admin/positions", icon: Briefcase },
      { title: "Bancas", url: "/admin/boards", icon: Building2 },
      { title: "Concursos", url: "/admin/exams", icon: ClipboardList },
      { title: "Disciplinas", url: "/admin/subjects", icon: Library },
      { title: "Assuntos", url: "/admin/topics", icon: Layers },
      { title: "Questões", url: "/admin/questions", icon: HelpCircle },
    ],
  },
  {
    label: "Dados",
    items: [
      { title: "Importação", url: "/admin/import", icon: Upload },
      { title: "Pacotes", url: "/admin/packages", icon: Package },
      { title: "Versões", url: "/admin/versions", icon: GitBranch },
      { title: "Distribuições", url: "/admin/distributions", icon: Share2 },
      { title: "Exportação", url: "/admin/export", icon: Download },
    ],
  },
  {
    label: "Gestão",
    items: [
      { title: "Usuários", url: "/admin/users", icon: Users },
      { title: "Assinaturas", url: "/admin/subscriptions", icon: KeyRound },
    ],
  },
];

function AdminLayout() {
  return <AppShell brand="SimulaPro Admin" requireRole="admin" groups={groups} />;
}
