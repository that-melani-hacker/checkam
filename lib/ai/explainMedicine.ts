import type { MedicineInfo, MedicineText } from "@/lib/types";
import { getClaude } from "@/lib/ai/claude";

const MODEL = process.env.CLAUDE_MODEL || "claude-opus-5-5";
const TIMEOUT_MS = 15_000;

const PROMPT = `You write the "About this medicine" card in CheckAm, a Nigerian app that checks drug packs against NAFDAC's register.
The pack's registered product is given below, with the name as printed on the pack when it was readable.
Explain it for an everyday reader, in plain English and in Nigerian Pidgin.

Rules:
- Work out the active ingredient(s) from the names. The name on the pack often includes the generic name under the brand
  (for example "Krisdrex - Paracetamol + Caffeine"); a widely known brand name (for example "Panadol Extra") is enough on its own.
  Use the strength only to confirm what the names tell you, never to guess the ingredients from the numbers.
  If the names don't tell you which medicine this is, set known to false.
- Give only general, well-established information about what the medicine is and what it is commonly used for.
- Never give doses, amounts, how often to take it, or who should or shouldn't take it beyond "ask a pharmacist".
- Never diagnose, and never suggest the reader's condition.
- Never say or imply this particular pack is authentic, real, or fine to use. Never use the words "safe", "safely", "genuine" or "verified".
- summary: one or two short sentences saying what kind of medicine it is.
- uses: 2 to 4 short items, what it is commonly used for.
- tips: 2 or 3 short general care points, for example to follow the leaflet's directions, not to take more than the leaflet says, and to ask a pharmacist or doctor about other medicines or health conditions.
- The Pidgin text says the same things as the English, in natural Nigerian Pidgin.`;

const text = {
  type: "object",
  properties: {
    summary: { type: "string" },
    uses: { type: "array", items: { type: "string" } },
    tips: { type: "array", items: { type: "string" } },
  },
  required: ["summary", "uses", "tips"],
  additionalProperties: false,
};
const SCHEMA = {
  type: "object",
  properties: { known: { type: "boolean" }, en: text, pcm: text },
  required: ["known", "en", "pcm"],
  additionalProperties: false,
};

// D12: the app never says these words. Anything that slips through is dropped.
const BANNED = /\b(safe|safely|safety|genuine|verified)\b/i;

function clean(t: MedicineText): MedicineText | null {
  if (!t?.summary || BANNED.test(t.summary)) return null;
  const keep = (items: unknown) =>
    (Array.isArray(items) ? items : []).filter((s): s is string => typeof s === "string" && !!s.trim() && !BANNED.test(s)).slice(0, 4);
  const uses = keep(t.uses);
  if (uses.length === 0) return null;
  return { summary: t.summary.trim(), uses, tips: keep(t.tips) };
}

// The same medicine is explained once per server instance; this also saves Anthropic credit.
const cache = new Map<string, MedicineInfo>();
const CACHE_LIMIT = 300;

/**
 * Owner: Melani. Plain-language, general information about a registered product, in English and Pidgin.
 * Returns { known: false } when Claude isn't sure what the medicine is or the answer breaks a rule.
 * Throws when Claude is unreachable; the caller hides the card.
 */
export async function explainMedicine(
  name: string,
  strength: string | null,
  packName: string | null = null,
): Promise<MedicineInfo> {
  const key = `${name}|${strength ?? ""}|${packName ?? ""}`.toLowerCase();
  const hit = cache.get(key);
  if (hit) return hit;

  const response = await getClaude().beta.messages.create(
    {
      model: MODEL,
      max_tokens: 2000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "low", format: { type: "json_schema", schema: SCHEMA } },
      system: PROMPT,
      messages: [
        {
          role: "user",
          content: [
            `Registered product: ${name}`,
            strength && `Strength: ${strength}`,
            packName && packName.toLowerCase() !== name.toLowerCase() && `Name as printed on the pack: ${packName}`,
          ]
            .filter(Boolean)
            .join("\n"),
        },
      ],
    },
    { timeout: TIMEOUT_MS },
  );

  let info: MedicineInfo = { known: false };
  if (response.stop_reason !== "refusal") {
    const raw = response.content.map((b) => (b.type === "text" ? b.text : "")).join("");
    try {
      const parsed = JSON.parse(raw) as { known?: boolean; en: MedicineText; pcm: MedicineText };
      const en = parsed.known ? clean(parsed.en) : null;
      const pcm = parsed.known ? clean(parsed.pcm) : null;
      if (en && pcm) info = { known: true, en, pcm };
    } catch {
      // Not valid JSON: show nothing rather than something half-formed.
    }
  }

  if (cache.size >= CACHE_LIMIT) cache.delete(cache.keys().next().value!);
  cache.set(key, info);
  return info;
}

