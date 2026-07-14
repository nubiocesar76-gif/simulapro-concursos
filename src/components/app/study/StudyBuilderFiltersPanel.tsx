import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { StudyBuilderFilters, StudyBuilderOption } from "@/lib/study-builder";
import { ALL_FILTER } from "@/lib/study-builder";

type FilterSelectProps = {
  label: string;
  value: string;
  options: StudyBuilderOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  allLabel?: string;
};

function FilterSelect({
  label,
  value,
  options,
  onChange,
  disabled = false,
  placeholder = "Todos",
  allLabel = "Todos",
}: FilterSelectProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_FILTER}>{allLabel}</SelectItem>
          {options.map((option) => (
            <SelectItem key={option.id} value={option.id}>
              {option.label} ({option.count})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

type StudyBuilderFiltersPanelProps = {
  filters: StudyBuilderFilters;
  boardOptions: StudyBuilderOption[];
  subjectOptions: StudyBuilderOption[];
  topicOptions: StudyBuilderOption[];
  yearOptions: StudyBuilderOption[];
  onChange: (filters: StudyBuilderFilters) => void;
  disabled?: boolean;
};

export function StudyBuilderFiltersPanel({
  filters,
  boardOptions,
  subjectOptions,
  topicOptions,
  yearOptions,
  onChange,
  disabled = false,
}: StudyBuilderFiltersPanelProps) {
  function patch(partial: Partial<StudyBuilderFilters>) {
    onChange({ ...filters, ...partial });
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-sm font-semibold tracking-tight">Filtrar questões</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Refine o acervo usando a taxonomia oficial. O contador atualiza automaticamente.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FilterSelect
          label="Banca"
          value={filters.boardId}
          options={boardOptions}
          onChange={(boardId) => patch({ boardId })}
          disabled={disabled}
        />
        <FilterSelect
          label="Disciplina"
          value={filters.subjectId}
          options={subjectOptions}
          onChange={(subjectId) => patch({ subjectId, topicId: ALL_FILTER })}
          disabled={disabled}
        />
        <FilterSelect
          label="Assunto"
          value={filters.topicId}
          options={topicOptions}
          onChange={(topicId) => patch({ topicId })}
          disabled={disabled || filters.subjectId === ALL_FILTER}
          placeholder={filters.subjectId === ALL_FILTER ? "Selecione uma disciplina" : "Todos"}
        />
        <FilterSelect
          label="Ano"
          value={filters.year}
          options={yearOptions}
          onChange={(year) => patch({ year })}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
