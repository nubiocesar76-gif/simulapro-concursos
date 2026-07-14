import { ChevronLeft, ChevronRight, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  className?: string;
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
  className,
}: QuestionNavigationProps) {
  const isBusy = isAnswering || isNavigating || isFinishing;

  return (
    <nav
      className={cn(
        "sticky bottom-0 z-20 -mx-6 border-t border-border/80 bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/90 sm:px-6 xl:-mx-8",
        className,
      )}
      aria-label="Navegação da questão"
      aria-busy={isBusy}
    >
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-2 sm:flex sm:items-center sm:justify-between sm:gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          disabled={!canGoPrevious || isBusy}
          className="col-span-2 w-full sm:col-span-1 sm:w-auto"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Anterior
        </Button>

        <Button
          type="button"
          variant={canAnswer ? "default" : "secondary"}
          onClick={onAnswer}
          disabled={!canAnswer || isBusy}
          className="w-full"
        >
          {isAnswering ? "Salvando..." : "Responder"}
        </Button>

        <Button
          type="button"
          variant={canGoNext ? "default" : "secondary"}
          onClick={onNext}
          disabled={!canGoNext || isBusy}
          className="w-full"
        >
          {isNavigating ? "Avançando..." : "Próxima"}
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>

        <Button
          type="button"
          variant={canFinish ? "default" : "secondary"}
          onClick={onFinish}
          disabled={!canFinish || isBusy}
          className="col-span-2 w-full sm:col-span-1 sm:w-auto"
        >
          <Flag className="h-4 w-4 mr-2" />
          {isFinishing ? "Finalizando..." : "Finalizar"}
        </Button>
      </div>
    </nav>
  );
}
