import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { QuestionFeedback } from "@/lib/study-engine";
import { CheckCircle2, XCircle } from "lucide-react";

type QuestionCardProps = {
  statement: string;
  feedback?: QuestionFeedback | null;
};

export function QuestionCard({ statement, feedback }: QuestionCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium leading-relaxed">Enunciado</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-base leading-relaxed whitespace-pre-wrap">{statement}</p>

        {feedback && (
          <Alert
            className={
              feedback.isCorrect
                ? "border-success/50 bg-success/5 text-success"
                : undefined
            }
            variant={feedback.isCorrect ? "default" : "destructive"}
          >
            {feedback.isCorrect ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            <AlertTitle>{feedback.isCorrect ? "Resposta correta" : "Resposta incorreta"}</AlertTitle>
            <AlertDescription className="space-y-2 text-sm">
              <p>Gabarito: {feedback.correctAnswer}</p>
              {feedback.explanation && <p>{feedback.explanation}</p>}
              {feedback.bibliography && (
                <p>
                  <span className="font-medium">Bibliografia:</span> {feedback.bibliography}
                </p>
              )}
              {feedback.legalReference && (
                <p>
                  <span className="font-medium">Referência legal:</span> {feedback.legalReference}
                </p>
              )}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
