import { StudyBuilderFiltersPanel } from "@/components/app/study/StudyBuilderFiltersPanel";
import type { StudyBuilderFilters, StudyBuilderOption } from "@/lib/study-builder";

type ReviewCenterFiltersProps = {
  filters: StudyBuilderFilters;
  boardOptions: StudyBuilderOption[];
  subjectOptions: StudyBuilderOption[];
  topicOptions: StudyBuilderOption[];
  yearOptions: StudyBuilderOption[];
  onChange: (filters: StudyBuilderFilters) => void;
  disabled?: boolean;
};

export function ReviewCenterFilters(props: ReviewCenterFiltersProps) {
  return <StudyBuilderFiltersPanel {...props} />;
}
