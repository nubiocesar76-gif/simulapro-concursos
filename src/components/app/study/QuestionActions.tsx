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
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        variant={favorite ? "default" : "outline"}
        size="sm"
        onClick={onToggleFavorite}
        disabled={disabled || isUpdating}
      >
        <Star className={`h-4 w-4 mr-2 ${favorite ? "fill-current" : ""}`} />
        {isUpdating ? "Salvando..." : favorite ? "Remover favorito" : "Favoritar"}
      </Button>
      <Button
        type="button"
        variant={reviewLater ? "secondary" : "outline"}
        size="sm"
        onClick={onToggleReviewLater}
        disabled={disabled || isUpdating}
      >
        <Pin className={`h-4 w-4 mr-2 ${reviewLater ? "fill-current" : ""}`} />
        {isUpdating ? "Salvando..." : reviewLater ? "Remover revisão" : "Revisar depois"}
      </Button>
    </div>
  );
}
