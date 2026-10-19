import { z } from "zod";
import type { Extracted } from "@/lib/types";
import { VerifyError } from "@/lib/errors";
import { ClaudeKeyError, readPackWithClaude } from "@/lib/ai/claude";

export const EXTRACTION_PROMPT = `You read medicine packaging from a photo. Copy only what is printed on the pack.
Return JSON with exactly these keys: name, strength, manufacturer, nafdac_no, expiry, batch.
- name: the brand and generic name as printed, for example "Emzor Paracetamol".
- strength: as printed, for example "500 mg" or "250 mg/5 ml".
- manufacturer: the company that made the product (look for "Manufactured by"), not a distributor.
- nafdac_no: the NAFDAC registration number as printed, for example "A4-1234" or "04-5678".
- expiry: the expiry date written as MM/YYYY.
- batch: the batch or lot number as printed.
Use null for anything you can't read clearly. Never guess, complete or correct a value.
If the photo is not a medicine pack, return null for every key. Never describe any person in the photo.`;

const MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";
// The phone gives up after 20 seconds, so all attempts together must finish well before that.
const TOTAL_BUDGET_MS = 17_000;
// Gemini often answers "high demand" (503) within ~2 seconds; a retry usually succeeds.
const MIN_RETRY_MS = 4_000;
const RETRY_PAUSE_MS = 500;

const field = z.string().trim().min(1).nullable().optional().catch(null);
const schema = z.object({
  name: field,
  strength: field,
  manufacturer: field,
  nafdac_no: field,
  expiry: field,
  batch: field,
});

const EMPTY: Extracted = {
  name: null,
  strength: null,
  manufacturer: null,
  nafdac_no: null,
  expiry: null,
  batch: null,
};

/** Owner: Fortunatus. Checks the AI's JSON with zod; anything invalid becomes null. Tests: B3, B5 */
export function parseExtraction(raw: string): Extracted {
  try {
    const cleaned = raw
      .trim()
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "");
    const parsed = schema.safeParse(JSON.parse(cleaned));
    if (!parsed.success) return { ...EMPTY };
    const d = parsed.data;
    return {
      name: d.name ?? null,
      strength: d.strength ?? null,
      manufacturer: d.manufacturer ?? null,
      nafdac_no: d.nafdac_no ?? null,
      expiry: d.expiry ?? null,
      batch: d.batch ?? null,
    };
  } catch {
    return { ...EMPTY };
  }
}

/** Owner: Fortunatus. Sends the photo and EXTRACTION_PROMPT to Gemini. Tests: B1-B8, C4, C5 */
export async function extractPackDetails(
  image: Buffer,
  mimeType: string,
): Promise<Extracted> {
  // Claude reads the pack when its key is set; otherwise Gemini does.
  const claudeKey = process.env.ANTHROPIC_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!claudeKey && !geminiKey)
    throw new VerifyError("ai_unavailable", "Neither ANTHROPIC_API_KEY nor GEMINI_API_KEY is set");
  let useClaude = Boolean(claudeKey);
  const readOnce = (timeoutMs: number) =>
    useClaude
      ? readPackWithClaude(image, mimeType, EXTRACTION_PROMPT, timeoutMs).then(parseExtraction)
      : requestOnce(image, mimeType, geminiKey!, timeoutMs);

  const deadline = Date.now() + TOTAL_BUDGET_MS;
  for (;;) {
    try {
      return await readOnce(deadline - Date.now());
    } catch (err) {
      // A rejected Claude key never recovers: hand over to Gemini if it's set up, else stop.
      if (err instanceof ClaudeKeyError) {
        if (!geminiKey) throw err;
        console.warn(`[verify] ${err.message}; using Gemini instead`);
        useClaude = false;
        continue;
      }
      const provider = useClaude ? "Claude" : "Gemini";
      const retryable = err instanceof VerifyError && err.code === "ai_unavailable";
      if (!retryable || deadline - Date.now() < MIN_RETRY_MS + RETRY_PAUSE_MS) throw err;
      console.warn(`[verify] retrying ${provider}: ${err.message.slice(0, 120)}`);
      await new Promise((r) => setTimeout(r, RETRY_PAUSE_MS));
    }
  }
}

/** One Gemini call, given the time left. Throws VerifyError on any failure. */
async function requestOnce(
  image: Buffer,
  mimeType: string,
  key: string,
  timeoutMs: number,
): Promise<Extracted> {
  let res: Response;
  try {
    res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": key },
        signal: AbortSignal.timeout(timeoutMs),
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: EXTRACTION_PROMPT },
                {
                  inline_data: {
                    mime_type: mimeType,
                    data: image.toString("base64"),
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0,
            responseMimeType: "application/json",
          },
        }),
      },
    );
  } catch (err) {
    throw new VerifyError(
      "ai_unavailable",
      `Gemini request failed: ${String(err)}`,
    );
  }

  if (res.status === 429) throw new VerifyError("rate_limited");
  if (!res.ok)
    throw new VerifyError(
      "ai_unavailable",
      `Gemini HTTP ${res.status}: ${await res.text().catch(() => "")}`,
    );

  const body = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text =
    body.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ??
    "";
  return parseExtraction(text);
}
