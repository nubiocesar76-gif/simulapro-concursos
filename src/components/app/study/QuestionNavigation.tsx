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
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={!canGoPrevious || isNavigating || isAnswering || isFinishing}
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Anterior
      </Button>

      <Button
        type="button"
        onClick={onAnswer}
        disabled={!canAnswer || isAnswering || isNavigating || isFinishing}
        className="sm:flex-1"
      >
        {isAnswering ? "Salvando..." : "Responder"}
      </Button>

      <Button
        type="button"
        variant="outline"
        onClick={onNext}
        disabled={!canGoNext || isNavigating || isAnswering || isFinishing}
      >
        Próxima
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>

      <Button
        type="button"
        variant="secondary"
        onClick={onFinish}
        disabled={!canFinish || isFinishing || isAnswering || isNavigating}
        className="sm:ml-auto"
      >
        <Flag className="h-4 w-4 mr-2" />
        {isFinishing ? "Finalizando..." : "Finalizar Sessão"}
      </Button>
    </div>
  );
}
