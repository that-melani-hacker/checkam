import type { ErrorCode } from "@/lib/types";

const STATUS: Record<ErrorCode, number> = {
  no_image: 400,
  bad_file_type: 400,
  file_too_large: 413,
  rate_limited: 429,
  ai_unavailable: 503,
  server_error: 500,
};

const MESSAGE: Record<ErrorCode, string> = {
  no_image: "Add a photo of the drug pack.",
  bad_file_type: "Use a JPEG, PNG or WebP photo of the pack.",
  file_too_large: "The photo is too large. Try again.",
  rate_limited: "Too many checks right now. Try again in a minute.",
  ai_unavailable: "The reading service is unavailable. Try again.",
  server_error: "Something went wrong. Try again.",
};

/** Owner: Fortunatus. Error class carrying a contract error code and its HTTP status. Tests: C1-C5 */
export class VerifyError extends Error {
  readonly status: number;
  constructor(
    public readonly code: ErrorCode,
    detail?: string,
  ) {
    super(detail ?? MESSAGE[code]);
    this.name = "VerifyError";
    this.status = STATUS[code];
  }
}

/** Owner: Fortunatus. Turns any error into the contract's error JSON. Tests: C1-C5 */
export function errorResponse(err: unknown): Response {
  if (err instanceof VerifyError) {
    if (err.code === "ai_unavailable" || err.code === "server_error")
      console.error("[verify]", err.code, err.message);
    return Response.json(
      { error: { code: err.code, message: MESSAGE[err.code] } },
      { status: err.status },
    );
  }
  console.error("[verify] unexpected error", err);
  return Response.json(
    { error: { code: "server_error", message: MESSAGE.server_error } },
    { status: 500 },
  );
}
