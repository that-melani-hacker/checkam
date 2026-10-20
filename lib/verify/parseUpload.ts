import { MAX_PHOTOS, type Upload, type UploadImage } from "@/lib/types";
import { VerifyError } from "@/lib/errors";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 4 * 1024 * 1024; // all photos together: Vercel's request limit is about 4.5 MB
const TAG = /^(T(0[1-9]|1[0-9]|20)|demo)$/;

/** Owner: Fortunatus. Reads `image` (repeated once per photo, up to MAX_PHOTOS) and `tag`. Tests: C1-C3 */
export async function parseUpload(req: Request): Promise<Upload> {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    throw new VerifyError("no_image");
  }

  const files = form
    .getAll("image")
    .filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) throw new VerifyError("no_image");
  if (files.length > MAX_PHOTOS) throw new VerifyError("file_too_large");
  if (files.some((f) => !ALLOWED.has(f.type))) throw new VerifyError("bad_file_type");
  if (files.reduce((sum, f) => sum + f.size, 0) > MAX_BYTES)
    throw new VerifyError("file_too_large");

  const images: UploadImage[] = await Promise.all(
    files.map(async (f) => ({ data: Buffer.from(await f.arrayBuffer()), mimeType: f.type })),
  );

  const rawTag = form.get("tag");
  const tag = typeof rawTag === "string" && TAG.test(rawTag) ? rawTag : null;

  return {
    image: images[0].data,
    mimeType: images[0].mimeType,
    images,
    tag,
  };
}
