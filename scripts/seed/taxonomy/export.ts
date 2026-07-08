import { generatePackageSlug } from "../../../src/lib/packages.ts";
import type { TaxonomyMetadata, TaxonomySeedFile } from "./schema.ts";
import type { SeedDb } from "./entities.ts";
import {
  DEFAULT_TAXONOMY_DESCRIPTION,
  DEFAULT_TAXONOMY_VERSION,
  SEED_ENGINE_NAME,
  sortByName,
  type SeedEnvironment,
} from "./metadata.ts";

function slugFromName(name: string) {
  return generatePackageSlug(name);
}

function assignOrder<T>(items: T[]): Array<T & { order: number }> {
  return items.map((item, index) => ({ ...item, order: index + 1 }));
}

export type ExportTaxonomyOptions = {
  version?: string;
  description?: string;
  environment: SeedEnvironment;
};

/**
 * Disciplinas e assuntos são globais no banco (sem course_id).
 * Na exportação determinística, aninhamos sob o primeiro curso em ordem alfabética.
 */
export async function exportTaxonomy(
  db: SeedDb,
  options: ExportTaxonomyOptions,
): Promise<TaxonomySeedFile> {
  const [{ data: courses, error: coursesError }, { data: boards, error: boardsError }, { data: subjects, error: subjectsError }, { data: topics, error: topicsError }, { data: positions, error: positionsError }, { data: exams, error: examsError }] =
    await Promise.all([
      db.from("courses").select("id,name,slug,description"),
      db.from("boards").select("id,name,acronym"),
      db.from("subjects").select("id,name,slug"),
      db.from("topics").select("id,name,slug,subject_id"),
      db.from("positions").select("id,name,slug,description,course_id"),
      db.from("exams").select("id,name,year,board_id"),
    ]);

  if (coursesError) throw coursesError;
  if (boardsError) throw boardsError;
  if (subjectsError) throw subjectsError;
  if (topicsError) throw topicsError;
  if (positionsError) throw positionsError;
  if (examsError) throw examsError;

  const sortedCourses = sortByName(courses ?? []);
  const sortedBoards = sortByName(boards ?? []);
  const sortedSubjects = sortByName(subjects ?? []);
  const sortedExams = sortByName(exams ?? []);

  const boardById = new Map(sortedBoards.map((b) => [b.id, b]));
  const boardSlugById = new Map(sortedBoards.map((b) => [b.id, slugFromName(b.name)] as const));

  const topicsBySubject = new Map<string, NonNullable<typeof topics>>();
  for (const topic of topics ?? []) {
    const list = topicsBySubject.get(topic.subject_id) ?? [];
    list.push(topic);
    topicsBySubject.set(topic.subject_id, list);
  }

  const primaryCourseSlug = sortedCourses[0]?.slug ?? null;

  const exportedCourses = assignOrder(
    sortedCourses.map((course) => {
      const coursePositions = sortByName((positions ?? []).filter((p) => p.course_id === course.id));
      const isPrimaryCourse = course.slug === primaryCourseSlug;

      return {
        name: course.name,
        slug: course.slug,
        status: "ACTIVE" as const,
        description: course.description,
        positions: assignOrder(
          coursePositions.map((position) => ({
            name: position.name,
            slug: position.slug,
            status: "ACTIVE" as const,
            description: position.description,
          })),
        ),
        subjects: isPrimaryCourse
          ? assignOrder(
              sortedSubjects.map((subject) => {
                const subjectTopics = sortByName(topicsBySubject.get(subject.id) ?? []);
                return {
                  name: subject.name,
                  slug: subject.slug,
                  status: "ACTIVE" as const,
                  topics: assignOrder(
                    subjectTopics.map((topic) => ({
                      name: topic.name,
                      slug: topic.slug,
                      status: "ACTIVE" as const,
                    })),
                  ),
                };
              }),
            )
          : [],
      };
    }),
  );

  const exportedBoards = assignOrder(
    sortedBoards.map((board) => ({
      name: board.name,
      slug: slugFromName(board.name),
      status: "ACTIVE" as const,
      acronym: board.acronym,
    })),
  );

  const exportedContests = assignOrder(
    sortedExams.map((exam) => ({
      name: exam.name,
      slug: slugFromName(exam.name),
      status: "ACTIVE" as const,
      boardSlug: boardSlugById.get(exam.board_id) ?? slugFromName(boardById.get(exam.board_id)?.name ?? "banca"),
      year: exam.year,
    })),
  );

  const metadata: TaxonomyMetadata = {
    version: options.version ?? DEFAULT_TAXONOMY_VERSION,
    generatedAt: new Date().toISOString(),
    generatedBy: SEED_ENGINE_NAME,
    description: options.description ?? DEFAULT_TAXONOMY_DESCRIPTION,
    environment: options.environment,
  };

  return {
    metadata,
    courses: exportedCourses,
    boards: exportedBoards,
    contests: exportedContests,
  };
}
