import { Select } from "@/components/design-system";
import { dsFontSize, dsFontWeight } from "@/styles/design-system/tokens";
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
  placeholder,
  allLabel = "Todos",
}: FilterSelectProps) {
  return (
    <Select
      label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      placeholder={placeholder}
    >
      <option value={ALL_FILTER}>{allLabel}</option>
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.label} ({option.count})
        </option>
      ))}
    </Select>
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
    <div className="flex flex-col gap-[var(--ds-space-5)]">
      <div>
        <h2
          className="tracking-tight text-[color:var(--ds-color-text-primary)]"
          style={{ fontSize: dsFontSize.sm, fontWeight: dsFontWeight.semibold }}
        >
          Filtrar questões
        </h2>
        <p
          className="mt-1 text-[color:var(--ds-color-text-secondary)]"
          style={{ fontSize: dsFontSize.xs }}
        >
          Refine o acervo usando a taxonomia oficial. O contador atualiza automaticamente.
        </p>
      </div>

      <div className="grid gap-[var(--ds-space-4)] sm:grid-cols-2">
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
