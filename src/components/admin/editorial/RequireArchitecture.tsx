import { Card, CardContent } from "@/components/ui/card";
import { useEditorialContext } from "./shared";

export function RequireArchitecture({ children }: { children: React.ReactNode }) {
  const { architectureId } = useEditorialContext();
  if (!architectureId) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          Selecione ou crie uma arquitetura na aba &quot;Arquiteturas&quot; para editar este
          conteúdo.
        </CardContent>
      </Card>
    );
  }
  return <>{children}</>;
}
