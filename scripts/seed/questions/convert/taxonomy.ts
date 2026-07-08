import type { TaxonomySeedFile } from "../../taxonomy/schema.ts";

export type TaxonomySets = {
  positions: Set<string>;
  subjects: Set<string>;
  topics: Set<string>;
  boards: Set<string>;
  contests: Set<string>;
};

function topicKey(subjectSlug: string, topicSlug: string) {
  return `${subjectSlug}/${topicSlug}`;
}

function contestKey(boardSlug: string, contestSlug: string) {
  return `${boardSlug}/${contestSlug}`;
}

export function loadTaxonomySets(taxonomy: TaxonomySeedFile): TaxonomySets {
  const positions = new Set<string>();
  const subjects = new Set<string>();
  const topics = new Set<string>();
  const boards = new Set<string>();
  const contests = new Set<string>();

  for (const course of taxonomy.courses) {
    for (const position of course.positions) positions.add(position.slug);
    for (const subject of course.subjects) {
      subjects.add(subject.slug);
      for (const topic of subject.topics) topics.add(topicKey(subject.slug, topic.slug));
    }
  }

  for (const board of taxonomy.boards) boards.add(board.slug);
  for (const contest of taxonomy.contests) contests.add(contestKey(contest.boardSlug, contest.slug));

  return { positions, subjects, topics, boards, contests };
}

export function hasTopic(sets: TaxonomySets, subject: string, topic: string) {
  return sets.topics.has(topicKey(subject, topic));
}

export function hasContest(sets: TaxonomySets, board: string, contest: string) {
  return sets.contests.has(contestKey(board, contest));
}
