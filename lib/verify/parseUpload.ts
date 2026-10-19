import type { Upload } from "@/lib/types";
import { VerifyError } from "@/lib/errors";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 4 * 1024 * 1024; // Vercel's request limit is about 4.5 MB
const TAG = /^(T(0[1-9]|1[0-9]|20)|demo)$/;

/** Owner: Fortunatus. Reads `image` and `tag` from the form. Tests: C1-C3 */
export async function parseUpload(req: Request): Promise<Upload> {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    throw new VerifyError("no_image");
  }

  const file = form.get("image");
  if (!(file instanceof Blob) || file.size === 0)
    throw new VerifyError("no_image");
  if (!ALLOWED.has(file.type)) throw new VerifyError("bad_file_type");
  if (file.size > MAX_BYTES) throw new VerifyError("file_too_large");

  const rawTag = form.get("tag");
  const tag = typeof rawTag === "string" && TAG.test(rawTag) ? rawTag : null;

  return {
    image: Buffer.from(await file.arrayBuffer()),
    mimeType: file.type,
    tag,
  };
}
