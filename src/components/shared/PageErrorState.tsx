import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type PageErrorStateProps = {
  title?: string;
  message: string;
  onRetry?: () => void;
  action?: React.ReactNode;
};

export function PageErrorState({
  title = "Não foi possível carregar",
  message,
  onRetry,
  action,
}: PageErrorStateProps) {
  return (
    <div className="space-y-4 max-w-lg" role="alert" aria-live="assertive">
      <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
        <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <h2 className="font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground mt-1">{message}</p>
        </div>
      </div>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} aria-label="Tentar carregar novamente">
          Tentar novamente
        </Button>
      )}
      {action}
    </div>
  );
}
