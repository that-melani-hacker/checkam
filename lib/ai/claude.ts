import Anthropic from "@anthropic-ai/sdk";
import { VerifyError } from "@/lib/errors";

const MODEL = process.env.CLAUDE_MODEL || "claude-opus-5-5";

// Claude's answer must be exactly these six keys, each a string or null.
const nullableString = { type: ["string", "null"] };
const EXTRACTION_SCHEMA = {
  type: "object",
  properties: {
    name: nullableString,
    strength: nullableString,
    manufacturer: nullableString,
    nafdac_no: nullableString,
    expiry: nullableString,
    batch: nullableString,
  },
  required: ["name", "strength", "manufacturer", "nafdac_no", "expiry", "batch"],
  additionalProperties: false,
};

type ImageType = "image/jpeg" | "image/png" | "image/webp";

let client: Anthropic | null = null;

/** Thrown when Anthropic rejects the key: retrying can't help, but Gemini can take over. */
export class ClaudeKeyError extends VerifyError {
  constructor(detail: string) {
    super("ai_unavailable", detail);
  }
}

/**
 * Reads the pack photo with Claude and returns the raw JSON text for parseExtraction().
 * Reading printed text is a simple job, so effort is low to keep the check fast.
 * Throws VerifyError('rate_limited' | 'ai_unavailable') like the Gemini reader.
 */
export async function readPackWithClaude(
  image: Buffer,
  mimeType: string,
  prompt: string,
  timeoutMs: number,
): Promise<string> {
  // maxRetries 0: extract.ts retries itself, inside the phone's time limit.
  client ??= new Anthropic({ maxRetries: 0 });

  try {
    const response = await client.beta.messages.create(
      {
        model: MODEL,
        max_tokens: 2000,
        // If a safety check declines the photo, the API retries on another model in the same call.
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default",
        output_config: {
          effort: "low",
          format: { type: "json_schema", schema: EXTRACTION_SCHEMA },
        },
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: { type: "base64", media_type: mimeType as ImageType, data: image.toString("base64") },
              },
              { type: "text", text: prompt },
            ],
          },
        ],
      },
      { timeout: timeoutMs },
    );

    // Declined even after the fallback: treat the photo as unreadable rather than an error.
    if (response.stop_reason === "refusal") return "{}";

    return response.content
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("");
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) throw new VerifyError("rate_limited");
    if (err instanceof Anthropic.AuthenticationError || err instanceof Anthropic.PermissionDeniedError) {
      throw new ClaudeKeyError(`Claude key rejected (${err.status}): check ANTHROPIC_API_KEY`);
    }
    if (err instanceof Anthropic.APIError) {
      throw new VerifyError("ai_unavailable", `Claude error ${err.status ?? ""}: ${err.message}`);
    }
    throw new VerifyError("ai_unavailable", `Claude request failed: ${String(err)}`);
  }
}
