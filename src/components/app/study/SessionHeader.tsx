import { STUDY_MODE_LABELS, type StudyMode } from "@/lib/study-session";
import { Badge } from "@/components/ui/badge";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type SessionHeaderProps = {
  title: string;
  subtitle: string;
  mode: StudyMode;
};

export function SessionHeader({ title, subtitle, mode }: SessionHeaderProps) {
  return (
    <CardHeader>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{subtitle}</CardDescription>
        </div>
        <Badge variant="secondary">{STUDY_MODE_LABELS[mode]}</Badge>
      </div>
    </CardHeader>
  );
}
