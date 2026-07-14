import type { EntityKind, TaxonomyIndex, TaxonomyRecord } from "./types.ts";
import { assertRecordKind } from "./validator.ts";

export interface FindTopicOptions {
  courseSlug?: string;
  subjectSlug: string;
  topicSlug: string;
}

export interface FindContestOptions {
  boardSlug: string;
  contestSlug: string;
}

export interface FindPositionOptions {
  courseSlug: string;
  positionSlug: string;
}

export interface FindSubjectOptions {
  courseSlug?: string;
  subjectSlug: string;
}

function firstMatch(records: TaxonomyRecord[] | undefined): TaxonomyRecord | undefined {
  return records?.[0];
}

export function findById(index: TaxonomyIndex, id: string): TaxonomyRecord | undefined {
  return index.byId.get(id);
}

export function findBySlug(index: TaxonomyIndex, slug: string, kind?: EntityKind): TaxonomyRecord[] {
  const matches = index.bySlug.get(slug) ?? [];
  if (!kind) return [...matches];
  return matches.filter((r) => r.kind === kind);
}

export function findBoard(index: TaxonomyIndex, query: { slug?: string; id?: string; name?: string }): TaxonomyRecord | undefined {
  if (query.id) {
    const byId = findById(index, query.id);
    return assertRecordKind(byId, "board") ? byId : undefined;
  }
  if (query.slug) {
    const match = firstMatch(findBySlug(index, query.slug, "board"));
    return assertRecordKind(match, "board") ? match : undefined;
  }
  if (query.name) {
    const normalized = query.name.trim().toLowerCase();
    return index.byKind.get("board")?.find((r) => r.name.toLowerCase() === normalized);
  }
  return undefined;
}

export function findContest(index: TaxonomyIndex, query: FindContestOptions | { id: string }): TaxonomyRecord | undefined {
  if ("id" in query) {
    const byId = findById(index, query.id);
    return assertRecordKind(byId, "contest") ? byId : undefined;
  }
  const id = `contest:${query.boardSlug}:${query.contestSlug}`;
  const byId = findById(index, id);
  if (byId) return byId;
  return index.byKind
    .get("contest")
    ?.find((r) => r.kind === "contest" && r.slug === query.contestSlug && r.boardSlug === query.boardSlug);
}

export function findPosition(index: TaxonomyIndex, query: FindPositionOptions | { id: string }): TaxonomyRecord | undefined {
  if ("id" in query) {
    const byId = findById(index, query.id);
    return assertRecordKind(byId, "position") ? byId : undefined;
  }
  const id = `position:${query.courseSlug}:${query.positionSlug}`;
  const byId = findById(index, id);
  if (byId) return byId;
  return index.byKind
    .get("position")
    ?.find((r) => r.kind === "position" && r.slug === query.positionSlug && r.courseSlug === query.courseSlug);
}

export function findSubject(index: TaxonomyIndex, query: FindSubjectOptions | { id: string }): TaxonomyRecord | undefined {
  if ("id" in query) {
    const byId = findById(index, query.id);
    return assertRecordKind(byId, "subject") ? byId : undefined;
  }
  if (query.courseSlug) {
    const id = `subject:${query.courseSlug}:${query.subjectSlug}`;
    const byId = findById(index, id);
    return assertRecordKind(byId, "subject") ? byId : undefined;
  }
  const match = firstMatch(findBySlug(index, query.subjectSlug, "subject"));
  return assertRecordKind(match, "subject") ? match : undefined;
}

export function findTopic(index: TaxonomyIndex, query: FindTopicOptions | { id: string }): TaxonomyRecord | undefined {
  if ("id" in query) {
    const byId = findById(index, query.id);
    return assertRecordKind(byId, "topic") ? byId : undefined;
  }
  if (query.courseSlug) {
    const id = `topic:${query.courseSlug}:${query.subjectSlug}:${query.topicSlug}`;
    const byId = findById(index, id);
    return assertRecordKind(byId, "topic") ? byId : undefined;
  }
  const match = index.byKind
    .get("topic")
    ?.find((r) => r.kind === "topic" && r.slug === query.topicSlug && r.subjectSlug === query.subjectSlug);
  return assertRecordKind(match, "topic") ? match : undefined;
}

export function findCourse(index: TaxonomyIndex, query: { slug?: string; id?: string; name?: string }): TaxonomyRecord | undefined {
  if (query.id) {
    const byId = findById(index, query.id);
    return assertRecordKind(byId, "course") ? byId : undefined;
  }
  if (query.slug) {
    const match = firstMatch(findBySlug(index, query.slug, "course"));
    return assertRecordKind(match, "course") ? match : undefined;
  }
  if (query.name) {
    const normalized = query.name.trim().toLowerCase();
    return index.byKind.get("course")?.find((r) => r.name.toLowerCase() === normalized);
  }
  return undefined;
}
