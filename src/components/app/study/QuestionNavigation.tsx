import { ChevronLeft, ChevronRight, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";

type QuestionNavigationProps = {
  canGoPrevious: boolean;
  canGoNext: boolean;
  canAnswer: boolean;
  canFinish: boolean;
  isAnswering?: boolean;
  isNavigating?: boolean;
  isFinishing?: boolean;
  onPrevious: () => void;
  onAnswer: () => void;
  onNext: () => void;
  onFinish: () => void;
};

export function QuestionNavigation({
  canGoPrevious,
  canGoNext,
  canAnswer,
  canFinish,
  isAnswering = false,
  isNavigating = false,
  isFinishing = false,
  onPrevious,
  onAnswer,
  onNext,
  onFinish,
}: QuestionNavigationProps) {
  const isBusy = isAnswering || isNavigating || isFinishing;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={!canGoPrevious || isBusy}
        className="order-2 w-full sm:order-1 sm:w-auto"
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Anterior
      </Button>

      <div className="order-1 w-full sm:order-2 sm:w-auto sm:min-w-[11rem]">
        {canAnswer && (
          <Button
            type="button"
            onClick={onAnswer}
            disabled={isBusy}
            className="w-full transition-colors"
          >
            {isAnswering ? "Salvando..." : "Responder"}
          </Button>
        )}

        {canGoNext && (
          <Button
            type="button"
            onClick={onNext}
            disabled={isBusy}
            className="w-full transition-colors"
          >
            {isNavigating ? "Avançando..." : "Próxima"}
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        )}

        {canFinish && (
          <Button
            type="button"
            onClick={onFinish}
            disabled={isBusy}
            className="w-full transition-colors"
          >
            <Flag className="h-4 w-4 mr-2" />
            {isFinishing ? "Finalizando..." : "Finalizar Sessão"}
          </Button>
        )}
      </div>
    </div>
  );
}
