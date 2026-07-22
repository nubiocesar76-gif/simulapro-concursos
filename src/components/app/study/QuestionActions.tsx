import { ChevronRight, Pin, Star } from "lucide-react";
import { Button } from "@/components/design-system";

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
    <div className="flex flex-col gap-[var(--ds-space-3)] sm:flex-row sm:flex-wrap sm:items-center">
      <div className="flex flex-wrap gap-[var(--ds-space-2)]">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={
            favorite
              ? "border-[color:var(--ds-color-action)]/40 text-[color:var(--ds-color-action)]"
              : "text-[color:var(--ds-color-text-secondary)]"
          }
          onClick={onToggleFavorite}
          disabled={disabled || isUpdating}
          aria-pressed={favorite}
          aria-label={favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          leftIcon={<Star className={favorite ? "fill-current" : ""} />}
        >
          {isUpdating ? "Salvando..." : favorite ? "Favoritada" : "Favoritar"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={
            reviewLater
              ? "border-[color:var(--ds-color-action)]/40 text-[color:var(--ds-color-action)]"
              : "text-[color:var(--ds-color-text-secondary)]"
          }
          onClick={onToggleReviewLater}
          disabled={disabled || isUpdating}
          aria-pressed={reviewLater}
          aria-label={reviewLater ? "Remover da lista de revisão" : "Marcar para revisar depois"}
          leftIcon={<Pin className={reviewLater ? "fill-current" : ""} />}
        >
          {isUpdating ? "Salvando..." : reviewLater ? "Marcada p/ revisão" : "Revisar depois"}
        </Button>
      </div>

      {showNext && onNext && (
        <Button
          type="button"
          className="w-full sm:ml-auto sm:w-auto"
          onClick={onNext}
          disabled={isNavigating || isUpdating}
          rightIcon={<ChevronRight />}
        >
          {isNavigating ? "Avançando..." : "Próxima questão"}
        </Button>
      )}
    </div>
  );
}
