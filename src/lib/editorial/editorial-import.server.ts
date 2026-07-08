import { listEditorialPackages, readEditorialPackage } from "./import/reader";
import { buildImportPreview } from "./import/preview";
import { executeEditorialImport } from "./import/executor";
import { validateEditorialPackage } from "./import/validator";
import type { ImportPreview, ImportResult } from "./import/types";

export { listEditorialPackages };

export async function validateEditorialPackageByPath(packagePath: string) {
  const pkg = readEditorialPackage(packagePath);
  return {
    package: pkg,
    validation: validateEditorialPackage(pkg),
  };
}

export async function previewEditorialImport(packagePath: string): Promise<ImportPreview> {
  const pkg = readEditorialPackage(packagePath);
  return buildImportPreview(pkg);
}

export async function importEditorialArchitecture(
  packagePath: string,
  userId: string,
): Promise<ImportResult> {
  const pkg = readEditorialPackage(packagePath);
  return executeEditorialImport(pkg, userId);
}

import { supabaseAdmin } from "@/integrations/supabase/client.server";

export async function listEditorialImportLogs(limit = 20) {
  const { data, error } = await supabaseAdmin
    .from("editorial_import_logs")
    .select(
      "id, package_path, engine_version, architecture_version, imported_files, duration_ms, record_counts, status, error_message, created_at, architecture_id",
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return data ?? [];
}
