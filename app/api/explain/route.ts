import { NextResponse } from "next/server";
import { z } from "zod";
import { explainMedicine } from "@/lib/ai/explainMedicine";

const Body = z.object({
  name: z.string().trim().min(2).max(160),
  strength: z.string().trim().max(80).nullable().optional(),
  packName: z.string().trim().max(160).nullable().optional(),
});

/**
 * Owner: Melani. "About this medicine" for the Result screen: POST { name, strength, packName? } -> MedicineInfo.
 * Optional extra: any failure returns an error and the screen simply hides the card.
 */
export async function POST(req: Request): Promise<Response> {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "bad_request" }, { status: 400 });
  if (!process.env.ANTHROPIC_API_KEY) return NextResponse.json({ error: "unavailable" }, { status: 503 });

  try {
    const { name, strength, packName } = parsed.data;
    return NextResponse.json(await explainMedicine(name, strength ?? null, packName ?? null));
  } catch (err) {
    console.error("[explain] failed", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }
}
