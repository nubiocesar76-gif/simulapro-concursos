import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  importEditorialArchitecture,
  listEditorialImportLogs,
  listEditorialPackages,
  previewEditorialImport,
  validateEditorialPackageByPath,
} from "./editorial-import.server";

export const listEditorialPackagesFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async () => listEditorialPackages());

export const validateEditorialPackageFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { packagePath: string }) => data)
  .handler(async ({ data }) => validateEditorialPackageByPath(data.packagePath));

export const previewEditorialImportFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { packagePath: string }) => data)
  .handler(async ({ data }) => previewEditorialImport(data.packagePath));

export const importEditorialArchitectureFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { packagePath: string }) => data)
  .handler(async ({ context, data }) =>
    importEditorialArchitecture(data.packagePath, context.userId),
  );

export const listEditorialImportLogsFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async () => listEditorialImportLogs());
