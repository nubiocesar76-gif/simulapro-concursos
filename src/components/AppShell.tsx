import { Link, Navigate, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { type LucideIcon } from "lucide-react";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/design-system";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar";

export type NavItem = { title: string; url: string; icon: LucideIcon };
export type NavGroup = { label: string; items: NavItem[] };

type Props = {
  brand: string;
  requireRole?: "admin" | "student";
  groups: NavGroup[];
};

export function AppShell({ brand, requireRole, groups }: Props) {
  const { user, role, loading } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const qc = useQueryClient();
  const isAdminPortal = brand.toLowerCase().includes("admin");

  if (loading || (requireRole && user && role === null)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <Logo orientation="vertical" theme="light" className="h-20 w-auto" />
        <p className="text-sm text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (requireRole === "admin" && role === "student") {
    return <Navigate to="/app" replace />;
  }

  async function handleLogout() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <div className="flex items-center gap-2 px-2 py-1.5">
              <Logo
                orientation="mark"
                theme="dark"
                className="hidden h-7 w-7 shrink-0 group-data-[collapsible=icon]:block"
              />
              <div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
                <Logo orientation="horizontal" theme="dark" className="h-7 w-auto" />
                {isAdminPortal ? (
                  <span className="shrink-0 rounded-full bg-sidebar-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sidebar-accent-foreground">
                    Admin
                  </span>
                ) : null}
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            {groups.map((g) => (
              <SidebarGroup key={g.label}>
                <SidebarGroupLabel>{g.label}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {g.items.map((it) => {
                      const active = pathname === it.url;
                      return (
                        <SidebarMenuItem key={it.url}>
                          <SidebarMenuButton asChild isActive={active}>
                            <Link to={it.url}>
                              <it.icon className="h-4 w-4" />
                              <span>{it.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>
          <SidebarFooter>
            <div className="px-2 py-2 text-xs text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden truncate">
              {user.email}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="justify-start text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <LogOut className="h-4 w-4" />
              <span className="group-data-[collapsible=icon]:hidden">Sair</span>
            </Button>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b bg-card px-4 gap-2.5">
            <SidebarTrigger />
            <Logo orientation="horizontal" theme="light" className="h-5 w-auto" />
            {isAdminPortal ? (
              <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Admin
              </span>
            ) : null}
          </header>
          <main className="flex-1 bg-background p-6 xl:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
