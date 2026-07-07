import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type AdminFiltersCardProps = {
  children: React.ReactNode;
};

export function AdminFiltersCard({ children }: AdminFiltersCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtros</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}
