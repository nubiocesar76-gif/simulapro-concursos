import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  getAcervoCatalogSnapshot,
  getWorkManifestForExam,
  registerAcervoFiles,
  importCatalogFromCsv,
  type RegisterAcervoFilesInput,
} from "./acervo.server";
import { supabaseCatalogRepository } from "./supabase-catalog.repository.server";

export const listAcervoCatalog = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    try {
      return await getAcervoCatalogSnapshot();
    } catch (error) {
      // Garante que sempre cruze a fronteira RPC como um Error simples e serializável,
      // independentemente do formato original da exceção (ex.: erro do Supabase/PostgREST).
      const message = error instanceof Error ? error.message : String(error);
      console.error("[listAcervoCatalog]", error);
      throw new Error(message);
    }
  });

export const getAcervoExamDetail = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((data: { examId: string }) => data)
  .handler(async ({ data }) => {
    const exam = await supabaseCatalogRepository.getBySlug(data.examId);
    if (!exam) return null;
    return {
      exam,
      manifest: await getWorkManifestForExam(exam),
    };
  });

export const registerAcervoFilesFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: RegisterAcervoFilesInput) => data)
  .handler(async ({ data }) => registerAcervoFiles(data));

export const importAcervoCatalogCsvFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async () => importCatalogFromCsv());
