import { supabase } from "@/integrations/supabase/client";
import { EDITORIAL_SCOPE } from "./constants";

export type EditorialScope = {
  courseId: string;
  positionId: string;
  courseName: string;
  positionName: string;
};

export async function resolveEditorialScope(): Promise<EditorialScope> {
  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("id, name")
    .eq("slug", EDITORIAL_SCOPE.courseSlug)
    .maybeSingle();

  if (courseError) {
    throw new Error(`Falha ao resolver curso: ${courseError.message}`);
  }
  if (!course) {
    throw new Error(`Curso "${EDITORIAL_SCOPE.courseName}" não encontrado na taxonomia.`);
  }

  const { data: position, error: positionError } = await supabase
    .from("positions")
    .select("id, name")
    .eq("course_id", course.id)
    .eq("slug", EDITORIAL_SCOPE.positionSlug)
    .maybeSingle();

  if (positionError) {
    throw new Error(`Falha ao resolver cargo: ${positionError.message}`);
  }
  if (!position) {
    throw new Error(`Cargo "${EDITORIAL_SCOPE.positionName}" não encontrado na taxonomia.`);
  }

  return {
    courseId: course.id,
    positionId: position.id,
    courseName: course.name,
    positionName: position.name,
  };
}
