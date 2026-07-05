/**
 * Pipeline de publicação de versões (Sprint 5B Etapa 3).
 * Centraliza validação, persistência e auditoria.
 */

import { supabase } from "@/integrations/supabase/client";
import { logEvent } from "@/lib/log";
import type { VersionStatus } from "@/lib/versions";

export type PublishVersionErrorCode =
  | "NOT_FOUND"
  | "NOT_READY"
  | "ALREADY_PUBLISHED"
  | "UNAUTHENTICATED"
  | "UPDATE_FAILED"
  | "UNKNOWN";

export class PublishVersionError extends Error {
  readonly code: PublishVersionErrorCode;

  constructor(message: string, code: PublishVersionErrorCode) {
    super(message);
    this.name = "PublishVersionError";
    this.code = code;
  }
}

export function formatPublishError(error: unknown): string {
  if (error instanceof PublishVersionError) return error.message;
  if (error instanceof Error) {
    if (error.message.includes("row-level security")) {
      return "Sem permissão para esta operação. Verifique se seu usuário possui role admin.";
    }
    return error.message;
  }
  return "Erro ao publicar versão.";
}

type VersionRecord = {
  id: string;
  package_id: string;
  version_number: string;
  name: string;
  status: VersionStatus;
  published: boolean;
  published_at: string | null;
};

function validatePublishable(version: VersionRecord | null): VersionRecord {
  if (!version) {
    throw new PublishVersionError("Versão não encontrada.", "NOT_FOUND");
  }
  if (version.status === "PUBLISHED" || version.published || version.published_at) {
    throw new PublishVersionError("Esta versão já foi publicada.", "ALREADY_PUBLISHED");
  }
  if (version.status === "ARCHIVED") {
    throw new PublishVersionError("Versões arquivadas não podem ser publicadas.", "NOT_READY");
  }
  if (version.status !== "READY") {
    throw new PublishVersionError("Somente versões com status Pronta (READY) podem ser publicadas.", "NOT_READY");
  }
  return version;
}

export async function publishPackageVersion(versionId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    const err = new PublishVersionError("Usuário não autenticado.", "UNAUTHENTICATED");
    await logEvent("version.publish.invalid", "package_versions", versionId, {
      code: err.code,
      message: err.message,
    });
    throw err;
  }

  try {
    const { data: version, error: fetchError } = await supabase
      .from("package_versions")
      .select("id, package_id, version_number, name, status, published, published_at")
      .eq("id", versionId)
      .maybeSingle();

    if (fetchError) throw fetchError;

    const record = validatePublishable(version as VersionRecord | null);

    const publishedAt = new Date().toISOString();
    const { data: updated, error: updateError } = await supabase
      .from("package_versions")
      .update({
        status: "PUBLISHED",
        published: true,
        published_at: publishedAt,
        published_by: user.id,
        updated_by: user.id,
      })
      .eq("id", versionId)
      .eq("status", "READY")
      .select("id, package_id, version_number, status, published_at")
      .maybeSingle();

    if (updateError) throw updateError;
    if (!updated || updated.status !== "PUBLISHED") {
      throw new PublishVersionError(
        "A versão não pôde ser publicada. Verifique se ainda está com status Pronta.",
        "UPDATE_FAILED",
      );
    }

    await logEvent("version.publish", "package_versions", versionId, {
      package_id: record.package_id,
      version_number: record.version_number,
      name: record.name,
      published_at: publishedAt,
      published_by: user.id,
    });

    return {
      id: updated.id,
      package_id: updated.package_id,
      version_number: updated.version_number,
      published_at: updated.published_at,
    };
  } catch (error) {
    if (error instanceof PublishVersionError) {
      await logEvent("version.publish.invalid", "package_versions", versionId, {
        code: error.code,
        message: error.message,
      });
      throw error;
    }

    const message = error instanceof Error ? error.message : "Erro desconhecido";
    await logEvent("version.publish.fail", "package_versions", versionId, { message });
    throw error;
  }
}
