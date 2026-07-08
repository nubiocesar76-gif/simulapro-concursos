import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const ACERVO_BUCKET = "acervo";

const EXAM_ID_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function assertValidExamId(examId: string) {
  if (!EXAM_ID_REGEX.test(examId)) {
    throw new Error("ID da prova inválido.");
  }
}

export function acervoObjectPath(examId: string, fileName: string) {
  assertValidExamId(examId);
  return `${examId}/${fileName}`;
}

export function formatAcervoStoragePath(examId: string, fileName: string) {
  return `${ACERVO_BUCKET}/${acervoObjectPath(examId, fileName)}`;
}

let bucketReady = false;

export async function ensureAcervoBucket() {
  if (bucketReady) return;

  const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();
  if (listError) {
    throw new Error(`Falha ao listar buckets do Storage: ${listError.message}`);
  }

  const exists = buckets?.some((bucket) => bucket.name === ACERVO_BUCKET);
  if (!exists) {
    const { error: createError } = await supabaseAdmin.storage.createBucket(ACERVO_BUCKET, {
      public: false,
      fileSizeLimit: 80 * 1024 * 1024,
    });
    if (createError) {
      throw new Error(
        `Bucket "${ACERVO_BUCKET}" não encontrado e não foi possível criá-lo: ${createError.message}`,
      );
    }
  }

  bucketReady = true;
}

export async function listExamFileNames(examId: string): Promise<string[]> {
  await ensureAcervoBucket();
  const { data, error } = await supabaseAdmin.storage.from(ACERVO_BUCKET).list(examId, {
    limit: 100,
    sortBy: { column: "name", order: "asc" },
  });
  if (error) {
    throw new Error(`Falha ao listar arquivos do acervo: ${error.message}`);
  }
  return (data ?? []).map((item) => item.name).filter(Boolean);
}

export async function storageFileExists(examId: string, fileName: string): Promise<boolean> {
  const names = await listExamFileNames(examId);
  return names.includes(fileName);
}

export async function uploadStorageBuffer(
  examId: string,
  fileName: string,
  buffer: Buffer,
  contentType: string,
) {
  await ensureAcervoBucket();
  const { error } = await supabaseAdmin.storage
    .from(ACERVO_BUCKET)
    .upload(acervoObjectPath(examId, fileName), buffer, {
      upsert: true,
      contentType,
    });
  if (error) {
    throw new Error(`Falha ao enviar ${fileName} para o Storage: ${error.message}`);
  }
}

export async function uploadStorageText(
  examId: string,
  fileName: string,
  content: string,
  contentType: string,
) {
  await uploadStorageBuffer(examId, fileName, Buffer.from(content, "utf8"), contentType);
}

export async function readStorageJson<T>(examId: string, fileName: string): Promise<T | null> {
  await ensureAcervoBucket();
  const { data, error } = await supabaseAdmin.storage
    .from(ACERVO_BUCKET)
    .download(acervoObjectPath(examId, fileName));
  if (error || !data) return null;
  const text = await data.text();
  return JSON.parse(text) as T;
}
