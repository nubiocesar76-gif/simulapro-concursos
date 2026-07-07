import { Pin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

type QuestionActionsProps = {
  favorite: boolean;
  reviewLater: boolean;
  disabled?: boolean;
  isUpdating?: boolean;
  onToggleFavorite: () => void;
  onToggleReviewLater: () => void;
};

export function QuestionActions({
  favorite,
  reviewLater,
  disabled = false,
  isUpdating = false,
  onToggleFavorite,
  onToggleReviewLater,
}: QuestionActionsProps) {
  return (
    <div className="flex flex-wrap gap-1">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={`h-8 px-2 text-muted-foreground hover:text-foreground ${
          favorite ? "text-primary hover:text-primary" : ""
        }`}
        onClick={onToggleFavorite}
        disabled={disabled || isUpdating}
      >
        <Star className={`h-4 w-4 mr-1.5 ${favorite ? "fill-current" : ""}`} />
        {isUpdating ? "Salvando..." : favorite ? "Remover favorito" : "Favoritar"}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={`h-8 px-2 text-muted-foreground hover:text-foreground ${
          reviewLater ? "text-primary hover:text-primary" : ""
        }`}
        onClick={onToggleReviewLater}
        disabled={disabled || isUpdating}
      >
        <Pin className={`h-4 w-4 mr-1.5 ${reviewLater ? "fill-current" : ""}`} />
        {isUpdating ? "Salvando..." : reviewLater ? "Remover revisão" : "Revisar depois"}
      </Button>
    </div>
  );
}
