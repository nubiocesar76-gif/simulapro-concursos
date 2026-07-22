/**
 * Ponto único de entrada público do novo Design System
 * (DS-002A/DS-002B/DS-002C/DS-003A/DS-003B/DS-004). Nenhuma tela importa
 * este barrel automaticamente — consumo é opt-in, a partir da sprint que
 * decidir migrar um componente específico.
 */

export { Button, buttonVariants, type ButtonProps } from "./button";
export { Card, CardHeader, CardContent, CardFooter, cardVariants, type CardProps } from "./card";
export { Badge, badgeVariants, type BadgeProps } from "./badge";
export { Input, type InputProps } from "./input";
export { Textarea, type TextareaProps } from "./textarea";
export { Select, type SelectProps } from "./select";
export { Avatar, avatarVariants, type AvatarProps, type AvatarSize } from "./avatar";
export { Skeleton, type SkeletonProps, type SkeletonRadius } from "./skeleton";
export { Divider, dividerVariants, type DividerProps } from "./divider";
export { Tooltip, type TooltipProps, type TooltipSide } from "./tooltip";
export { AppShell, type AppShellProps } from "./app-shell";
export { Sidebar, type SidebarProps } from "./sidebar";
export { Header, type HeaderProps } from "./header";
export { Container, containerVariants, type ContainerProps } from "./container";
export { Page, type PageProps } from "./page";
export { Section, type SectionProps, type SectionSpacing } from "./section";
export { SidebarItem, sidebarItemVariants, type SidebarItemProps } from "./sidebar-item";
export { SidebarGroup, type SidebarGroupProps } from "./sidebar-group";
export { PageHeader, type PageHeaderProps } from "./page-header";
export { Breadcrumb, type BreadcrumbProps, type BreadcrumbItem } from "./breadcrumb";
export { UserMenu, type UserMenuProps } from "./user-menu";
export { TopActions, type TopActionsProps } from "./top-actions";
export {
  MetricCard,
  type MetricCardProps,
  type MetricTrend,
  type MetricTrendDirection,
} from "./metric-card";
export { ProgressCard, type ProgressCardProps } from "./progress-card";
export { EmptyState, type EmptyStateProps, type EmptyStateAction } from "./empty-state";
export { LoadingState, type LoadingStateProps } from "./loading-state";
export { StatusBadge, type StatusBadgeProps, type StatusBadgeStatus } from "./status-badge";
export { Logo, type LogoProps, type LogoOrientation, type LogoTheme } from "./logo";
