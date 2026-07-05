import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { QuestionAlternative } from "@/lib/questions";

type QuestionOptionsProps = {
  alternatives: QuestionAlternative[];
  value: string | null;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function QuestionOptions({
  alternatives,
  value,
  onChange,
  disabled = false,
}: QuestionOptionsProps) {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Alternativas</Label>
      <RadioGroup
        value={value ?? undefined}
        onValueChange={onChange}
        className="grid gap-2"
        disabled={disabled}
      >
        {alternatives.map((alternative) => (
          <label
            key={alternative.letter}
            className={`flex items-start gap-3 rounded-lg border p-3 ${
              disabled ? "opacity-70 cursor-default" : "cursor-pointer hover:border-primary/40"
            }`}
          >
            <RadioGroupItem
              value={alternative.letter}
              className="mt-0.5"
              disabled={disabled}
            />
            <span className="text-sm leading-relaxed">
              <span className="font-medium">{alternative.letter})</span> {alternative.text}
            </span>
          </label>
        ))}
      </RadioGroup>
    </div>
  );
}
