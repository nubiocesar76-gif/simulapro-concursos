import { Link } from "@tanstack/react-router";
import { History, LayoutDashboard, PlusCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

type SessionResultsActionsProps = {
  wrongCount: number;
  isCreatingReview: boolean;
  onReviewErrors: () => void;
};

export function SessionResultsActions({
  wrongCount,
  isCreatingReview,
  onReviewErrors,
}: SessionResultsActionsProps) {
  return (
    <section
      aria-label="Ações"
      aria-busy={isCreatingReview}
      className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4"
    >
      <Button asChild className="w-full">
        <Link to="/app/study">
          <PlusCircle className="h-4 w-4 mr-2" />
          Nova sessão
        </Link>
      </Button>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={onReviewErrors}
        disabled={wrongCount === 0 || isCreatingReview}
        aria-label={
          wrongCount === 0 ? "Revisar erros — nenhuma questão errada nesta sessão" : "Revisar erros"
        }
      >
        <RotateCcw className="h-4 w-4 mr-2" />
        {isCreatingReview ? "Criando..." : "Revisar erros"}
      </Button>

      <Button asChild variant="outline" className="w-full">
        <Link to="/app/history">
          <History className="h-4 w-4 mr-2" />
          Ver histórico
        </Link>
      </Button>

      <Button asChild variant="outline" className="w-full">
        <Link to="/app">
          <LayoutDashboard className="h-4 w-4 mr-2" />
          Dashboard
        </Link>
      </Button>
    </section>
  );
}
