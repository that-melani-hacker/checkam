import type { Check, Explanation, Verdict } from "@/lib/types";

const WORD: Record<string, { en: string; pcm: string }> = {
  name: { en: "name", pcm: "name" },
  strength: { en: "strength", pcm: "strength" },
  manufacturer: { en: "manufacturer", pcm: "manufacturer" },
};

function list(words: string[]): string {
  return words.length > 1
    ? `${words.slice(0, -1).join(", ")} and ${words[words.length - 1]}`
    : words[0];
}

/** Owner: Fortunatus. Fills the English and Pidgin templates. Never says safe, genuine or verified. Test: D7 */
export function buildExplanation(
  verdict: Verdict,
  checks: Check[],
): Explanation {
  switch (verdict) {
    case "no_red_flags":
      return {
        en: "The readable details match NAFDAC's record. This is not a guarantee of authenticity.",
        pcm: "The details wey we fit read match NAFDAC record. But e no be guarantee say the drug dey original.",
      };
    case "mismatch": {
      const failed = checks
        .filter((c) => c.ok === false && c.field in WORD)
        .map((c) => c.field);
      const en = list(failed.map((f) => WORD[f].en));
      const pcm = list(failed.map((f) => WORD[f].pcm));
      return {
        en: `The ${en} on this pack ${failed.length > 1 ? "don't" : "doesn't"} match NAFDAC's record. Take a closer look.`,
        pcm: `The ${pcm} for this pack no match NAFDAC record. Look am well.`,
      };
    }
    case "not_found":
      return {
        en: "This number isn't in NAFDAC's records. That alone doesn't prove the medicine is fake.",
        pcm: "This number no dey NAFDAC record. But that one alone no prove say the drug dey fake.",
      };
    case "expired": {
      const exp = checks.find((c) => c.field === "expiry");
      if (exp?.ok === false && exp.pack) {
        return {
          en: `The pack reads ${exp.pack}, which has already passed.`,
          pcm: `The pack talk ${exp.pack}, and that date don pass.`,
        };
      }
      return {
        en: "This product's NAFDAC registration is not active.",
        pcm: "The NAFDAC registration for this drug no dey active.",
      };
    }
    case "unreadable":
      return {
        en: "The photo isn't clear enough to read the details. No record comparison was made.",
        pcm: "The photo no clear reach to read the details. We no compare am with any record.",
      };
  }
}
