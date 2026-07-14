import { ChevronRight, Pin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

type QuestionActionsProps = {
  favorite: boolean;
  reviewLater: boolean;
  disabled?: boolean;
  isUpdating?: boolean;
  showNext?: boolean;
  isNavigating?: boolean;
  onToggleFavorite: () => void;
  onToggleReviewLater: () => void;
  onNext?: () => void;
};

export function QuestionActions({
  favorite,
  reviewLater,
  disabled = false,
  isUpdating = false,
  showNext = false,
  isNavigating = false,
  onToggleFavorite,
  onToggleReviewLater,
  onNext,
}: QuestionActionsProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={favorite ? "border-primary/40 text-primary" : "text-muted-foreground"}
          onClick={onToggleFavorite}
          disabled={disabled || isUpdating}
          aria-pressed={favorite}
          aria-label={favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
          <Star className={`h-4 w-4 mr-1.5 ${favorite ? "fill-current" : ""}`} />
          {isUpdating ? "Salvando..." : favorite ? "Favoritada" : "Favoritar"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={reviewLater ? "border-primary/40 text-primary" : "text-muted-foreground"}
          onClick={onToggleReviewLater}
          disabled={disabled || isUpdating}
          aria-pressed={reviewLater}
          aria-label={reviewLater ? "Remover da lista de revisão" : "Marcar para revisar depois"}
        >
          <Pin className={`h-4 w-4 mr-1.5 ${reviewLater ? "fill-current" : ""}`} />
          {isUpdating ? "Salvando..." : reviewLater ? "Marcada p/ revisão" : "Revisar depois"}
        </Button>
      </div>

      {showNext && onNext && (
        <Button
          type="button"
          className="w-full sm:ml-auto sm:w-auto"
          onClick={onNext}
          disabled={isNavigating || isUpdating}
        >
          {isNavigating ? "Avançando..." : "Próxima questão"}
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      )}
    </div>
  );
}
