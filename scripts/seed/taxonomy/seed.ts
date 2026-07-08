import type { TaxonomySeedFile } from "./schema.ts";
import type { SeedDb } from "./entities.ts";
import {
  resolveCourse,
  resolvePosition,
  resolveSubject,
  resolveTopic,
  resolveBoard,
  resolveContest,
  ignore,
} from "./entities.ts";
import type { SeedReport } from "../core/report.ts";

/**
 * status e order existem no JSON como contrato do seed (versionamento / futuro).
 * O banco atual não possui essas colunas nas tabelas de taxonomia — não são persistidas.
 */
export async function seedTaxonomy(db: SeedDb, file: TaxonomySeedFile, report: SeedReport) {
  const courseIds = new Map<string, string>();
  const subjectIds = new Map<string, string>();
  const boardIds = new Map<string, string>();

  const sortedCourses = [...file.courses].sort((a, b) => a.order - b.order);
  for (const course of sortedCourses) {
    const existingCourse = await resolveCourse(db, course.slug, course.name);
    let courseId: string;
    if (existingCourse) {
      courseId = existingCourse.id;
      ignore(report, `curso:${course.slug}`);
    } else {
      const { data, error } = await db
        .from("courses")
        .insert({
          name: course.name,
          slug: course.slug,
          description: course.description ?? null,
        })
        .select("id")
        .single();
      if (error) throw error;
      courseId = data.id;
      report.coursesCreated += 1;
    }
    courseIds.set(course.slug, courseId);

    const sortedPositions = [...course.positions].sort((a, b) => a.order - b.order);
    for (const position of sortedPositions) {
      const existingPosition = await resolvePosition(db, courseId, position.slug, position.name);
      if (existingPosition) {
        ignore(report, `cargo:${course.slug}/${position.slug}`);
        continue;
      }

      const { error } = await db.from("positions").insert({
        name: position.name,
        slug: position.slug,
        course_id: courseId,
        description: position.description ?? null,
      });
      if (error) throw error;
      report.positionsCreated += 1;
    }

    const sortedSubjects = [...course.subjects].sort((a, b) => a.order - b.order);
    for (const subject of sortedSubjects) {
      let subjectId = subjectIds.get(subject.slug);
      if (!subjectId) {
        const existingSubject = await resolveSubject(db, subject.slug, subject.name);
        if (existingSubject) {
          subjectId = existingSubject.id;
          subjectIds.set(subject.slug, subjectId);
          ignore(report, `disciplina:${subject.slug}`);
        } else {
          const { data, error } = await db
            .from("subjects")
            .insert({ name: subject.name, slug: subject.slug })
            .select("id")
            .single();
          if (error) throw error;
          subjectId = data.id;
          subjectIds.set(subject.slug, subjectId);
          report.subjectsCreated += 1;
        }
      } else {
        ignore(report, `disciplina:${subject.slug}`);
      }

      const sortedTopics = [...subject.topics].sort((a, b) => a.order - b.order);
      for (const topic of sortedTopics) {
        const existingTopic = await resolveTopic(db, subjectId, topic.slug, topic.name);
        if (existingTopic) {
          ignore(report, `assunto:${subject.slug}/${topic.slug}`);
          continue;
        }

        const { error } = await db.from("topics").insert({
          name: topic.name,
          slug: topic.slug,
          subject_id: subjectId,
        });
        if (error) throw error;
        report.topicsCreated += 1;
      }
    }
  }

  const sortedBoards = [...file.boards].sort((a, b) => a.order - b.order);
  for (const board of sortedBoards) {
    const existingBoard = await resolveBoard(db, board.slug, board.name);
    if (existingBoard) {
      boardIds.set(board.slug, existingBoard.id);
      ignore(report, `banca:${board.slug}`);
      continue;
    }

    const { data, error } = await db
      .from("boards")
      .insert({ name: board.name, acronym: board.acronym ?? null })
      .select("id")
      .single();
    if (error) throw error;
    boardIds.set(board.slug, data.id);
    report.boardsCreated += 1;
  }

  const sortedContests = [...file.contests].sort((a, b) => a.order - b.order);
  for (const contest of sortedContests) {
    const boardId = boardIds.get(contest.boardSlug);
    if (!boardId) {
      throw new Error(`Concurso "${contest.slug}": banca "${contest.boardSlug}" não encontrada.`);
    }

    const existingContest = await resolveContest(db, boardId, contest.slug, contest.name);
    if (existingContest) {
      ignore(report, `concurso:${contest.boardSlug}/${contest.slug}`);
      continue;
    }

    const { error } = await db.from("exams").insert({
      name: contest.name,
      board_id: boardId,
      year: contest.year ?? null,
    });
    if (error) throw error;
    report.contestsCreated += 1;
  }
}
