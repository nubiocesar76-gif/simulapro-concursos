import type { SessionResultItem, SessionResults } from "@/lib/study-engine";

export type PerformanceGroup = {
  key: string;
  label: string;
  total: number;
  correct: number;
  wrong: number;
  percent: number;
};

export type SessionRecommendation = {
  key: string;
  label: string;
  kind: "topic" | "subject";
  percent: number;
  wrong: number;
  total: number;
};

function answeredItems(items: SessionResultItem[]): SessionResultItem[] {
  return items.filter((item) => item.isAnswered);
}

function aggregateByLabel(
  items: SessionResultItem[],
  pickLabel: (item: SessionResultItem) => string | null,
  pickKey: (item: SessionResultItem) => string,
): PerformanceGroup[] {
  const groups = new Map<string, PerformanceGroup>();

  for (const item of answeredItems(items)) {
    const label = pickLabel(item);
    if (!label) continue;

    const key = pickKey(item);
    const current = groups.get(key) ?? {
      key,
      label,
      total: 0,
      correct: 0,
      wrong: 0,
      percent: 0,
    };

    current.total += 1;
    if (item.isCorrect === true) current.correct += 1;
    if (item.isCorrect === false) current.wrong += 1;
    groups.set(key, current);
  }

  return [...groups.values()].map((group) => ({
    ...group,
    percent: group.total > 0 ? Math.round((group.correct / group.total) * 100) : 0,
  }));
}

function sortWorstFirst(groups: PerformanceGroup[]): PerformanceGroup[] {
  return [...groups].sort((a, b) => {
    if (a.percent !== b.percent) return a.percent - b.percent;
    if (a.wrong !== b.wrong) return b.wrong - a.wrong;
    return b.total - a.total;
  });
}

export function computeSubjectPerformance(items: SessionResultItem[]): PerformanceGroup[] {
  return sortWorstFirst(
    aggregateByLabel(
      items,
      (item) => item.subjectName,
      (item) => `subject:${item.subjectName ?? "unknown"}`,
    ),
  );
}

export function computeTopicPerformance(items: SessionResultItem[]): PerformanceGroup[] {
  return sortWorstFirst(
    aggregateByLabel(
      items,
      (item) => item.topicName,
      (item) => `topic:${item.topicName ?? "unknown"}`,
    ),
  );
}

export function computeBoardPerformance(items: SessionResultItem[]): PerformanceGroup[] {
  return sortWorstFirst(
    aggregateByLabel(
      items,
      (item) => item.boardName,
      (item) => `board:${item.boardName ?? "unknown"}`,
    ),
  );
}

export function computeRecommendations(
  items: SessionResultItem[],
  limit = 6,
): SessionRecommendation[] {
  const topicGroups = computeTopicPerformance(items).filter((group) => group.wrong > 0);
  const subjectGroups = computeSubjectPerformance(items).filter((group) => group.wrong > 0);

  const candidates: SessionRecommendation[] = [
    ...topicGroups.map((group) => ({
      key: group.key,
      label: group.label,
      kind: "topic" as const,
      percent: group.percent,
      wrong: group.wrong,
      total: group.total,
    })),
    ...subjectGroups.map((group) => ({
      key: group.key,
      label: group.label,
      kind: "subject" as const,
      percent: group.percent,
      wrong: group.wrong,
      total: group.total,
    })),
  ];

  const seen = new Set<string>();
  const unique = candidates.filter((item) => {
    const normalized = item.label.toLowerCase();
    if (seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });

  return unique
    .sort((a, b) => {
      if (a.percent !== b.percent) return a.percent - b.percent;
      if (a.wrong !== b.wrong) return b.wrong - a.wrong;
      return b.total - a.total;
    })
    .slice(0, limit);
}

export function buildSessionResultsAnalytics(results: SessionResults) {
  const { items, summary } = results;

  return {
    summary,
    subjects: computeSubjectPerformance(items),
    topics: computeTopicPerformance(items),
    boards: computeBoardPerformance(items),
    recommendations: computeRecommendations(items),
  };
}
