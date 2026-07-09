import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../../src/integrations/supabase/types.ts";
import { generatePackageSlug } from "../../../src/lib/packages.ts";
import type { SeedReport } from "../core/report.ts";

export type SeedDb = SupabaseClient<Database>;

export type ResolvedEntity = { id: string };

function namesMatch(a: string, b: string) {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

export async function resolveCourse(db: SeedDb, slug: string, name: string): Promise<ResolvedEntity | null> {
  const { data: bySlug, error: slugError } = await db
    .from("courses")
    .select("id")
    .eq("slug", slug)
    .limit(1)
    .maybeSingle();
  if (slugError) throw slugError;
  if (bySlug) return bySlug;

  const { data: byName, error: nameError } = await db
    .from("courses")
    .select("id")
    .ilike("name", name)
    .limit(1)
    .maybeSingle();
  if (nameError) throw nameError;
  return byName;
}

export async function resolvePosition(
  db: SeedDb,
  courseId: string,
  slug: string,
  name: string,
): Promise<ResolvedEntity | null> {
  const { data: bySlug, error: slugError } = await db
    .from("positions")
    .select("id")
    .eq("course_id", courseId)
    .eq("slug", slug)
    .limit(1)
    .maybeSingle();
  if (slugError) throw slugError;
  if (bySlug) return bySlug;

  const { data: byName, error: nameError } = await db
    .from("positions")
    .select("id")
    .eq("course_id", courseId)
    .ilike("name", name)
    .limit(1)
    .maybeSingle();
  if (nameError) throw nameError;
  return byName;
}

export async function resolveSubject(db: SeedDb, slug: string, name: string): Promise<ResolvedEntity | null> {
  const { data: bySlug, error: slugError } = await db
    .from("subjects")
    .select("id")
    .eq("slug", slug)
    .limit(1)
    .maybeSingle();
  if (slugError) throw slugError;
  if (bySlug) return bySlug;

  const { data: byName, error: nameError } = await db
    .from("subjects")
    .select("id")
    .ilike("name", name)
    .limit(1)
    .maybeSingle();
  if (nameError) throw nameError;
  return byName;
}

export async function resolveTopic(
  db: SeedDb,
  subjectId: string,
  slug: string,
  name: string,
): Promise<ResolvedEntity | null> {
  const { data: bySlug, error: slugError } = await db
    .from("topics")
    .select("id")
    .eq("subject_id", subjectId)
    .eq("slug", slug)
    .limit(1)
    .maybeSingle();
  if (slugError) throw slugError;
  if (bySlug) return bySlug;

  const { data: byName, error: nameError } = await db
    .from("topics")
    .select("id")
    .eq("subject_id", subjectId)
    .ilike("name", name)
    .limit(1)
    .maybeSingle();
  if (nameError) throw nameError;
  return byName;
}

/** Bancas não possuem coluna slug no banco — slug do JSON é comparado ao slug derivado do nome. */
export async function resolveBoard(db: SeedDb, slug: string, name: string): Promise<ResolvedEntity | null> {
  const { data: rows, error: listError } = await db.from("boards").select("id,name");
  if (listError) throw listError;

  const bySlug = rows?.find((row) => generatePackageSlug(row.name) === slug);
  if (bySlug) return { id: bySlug.id };

  const byName = rows?.find((row) => namesMatch(row.name, name));
  if (byName) return { id: byName.id };

  return null;
}

/** Concursos (exams) não possuem coluna slug — mesma estratégia das bancas, escopada por board. */
export async function resolveContest(
  db: SeedDb,
  boardId: string,
  slug: string,
  name: string,
): Promise<ResolvedEntity | null> {
  const { data: rows, error: listError } = await db
    .from("exams")
    .select("id,name")
    .eq("board_id", boardId);
  if (listError) throw listError;

  const bySlug = rows?.find((row) => generatePackageSlug(row.name) === slug);
  if (bySlug) return { id: bySlug.id };

  const byName = rows?.find((row) => namesMatch(row.name, name));
  if (byName) return { id: byName.id };

  return null;
}

/** Resolve uma versão de pacote publicável (package_versions) por slug do pacote + número da versão, escopado ao curso. */
export async function resolvePackageVersion(
  db: SeedDb,
  courseId: string,
  packageSlug: string,
  versionNumber: string,
): Promise<ResolvedEntity | null> {
  const { data: pkg, error: packageError } = await db
    .from("packages")
    .select("id")
    .eq("course_id", courseId)
    .eq("slug", packageSlug)
    .limit(1)
    .maybeSingle();
  if (packageError) throw packageError;
  if (!pkg) return null;

  const { data: version, error: versionError } = await db
    .from("package_versions")
    .select("id")
    .eq("package_id", pkg.id)
    .eq("version_number", versionNumber)
    .limit(1)
    .maybeSingle();
  if (versionError) throw versionError;
  return version;
}

export function ignore(report: SeedReport, label: string) {
  report.ignored += 1;
  if (process.env.SEED_VERBOSE === "1") console.log(`Ignorado: ${label}`);
}
