import { test } from "node:test";
import assert from "node:assert/strict";
import type { Extracted, RegistryRecord } from "@/lib/types";
import { verifyPack } from "@/lib/match/verifyPack";
import { parseExtraction } from "@/lib/ai/extract";

// Fixture records for tests only. Real data lives in data/greenbook-sample.json.
const records: RegistryRecord[] = [
  {
    name: "Wellora Paracetamol Tablets 500mg",
    strength: "500mg",
    manufacturer: "Wellora Pharmaceuticals Ltd",
    nafdac_no: "A4-5821",
    status: "active",
  },
  {
    name: "Oldpharm Amoxicillin Capsules",
    strength: "250mg",
    manufacturer: "Oldpharm Nigeria Plc",
    nafdac_no: "04-1111",
    status: "inactive",
  },
];
const today = new Date(2026, 9, 21); // 21 Oct 2026

const good: Extracted = {
  name: "Wellora Paracetamol",
  strength: "500 mg",
  manufacturer: "Wellora Pharma Ltd",
  nafdac_no: "A4-5821",
  expiry: "12/2027",
  batch: "WP2311",
};
const run = (e: Partial<Extracted>) =>
  verifyPack({ ...good, ...e }, today, records);
const ok = (r: ReturnType<typeof run>, field: string) =>
  r.checks.find((c) => c.field === field)?.ok;

test("A1 every field matches -> no_red_flags", () => {
  const r = run({});
  assert.equal(r.verdict, "no_red_flags");
  assert.equal(r.checks.length, 6);
  assert.ok(r.checks.every((c) => c.ok === true));
});
test("A2 manufacturer differs -> mismatch", () => {
  const r = run({ manufacturer: "Luma Care Ltd" });
  assert.equal(r.verdict, "mismatch");
  assert.equal(ok(r, "manufacturer"), false);
});
test("A3 strength differs -> mismatch", () => {
  const r = run({ strength: "1000 mg" });
  assert.equal(r.verdict, "mismatch");
  assert.equal(ok(r, "strength"), false);
});
test("A4 name differs -> mismatch", () => {
  const r = run({ name: "Coartem" });
  assert.equal(r.verdict, "mismatch");
  assert.equal(ok(r, "name"), false);
});
test("A5 two fields differ -> mismatch, both listed", () => {
  const r = run({ manufacturer: "Luma Care Ltd", strength: "1000 mg" });
  assert.equal(r.verdict, "mismatch");
  assert.equal(ok(r, "manufacturer"), false);
  assert.equal(ok(r, "strength"), false);
});
test("A6 number not in sample -> not_found", () => {
  const r = run({ nafdac_no: "A4-9999" });
  assert.equal(r.verdict, "not_found");
  assert.equal(r.registry, null);
});
test("A7 pack expiry passed -> expired", () => {
  const r = run({ expiry: "08/2025" });
  assert.equal(r.verdict, "expired");
  assert.equal(ok(r, "expiry"), false);
});
test("A8 registration inactive -> expired", () => {
  const r = run({
    name: "Oldpharm Amoxicillin",
    strength: "250mg",
    manufacturer: "Oldpharm Nigeria Plc",
    nafdac_no: "04-1111",
  });
  assert.equal(r.verdict, "expired");
  assert.equal(ok(r, "registration_status"), false);
});
test("A9 expired and wrong manufacturer -> expired, both fail", () => {
  const r = run({ expiry: "08/2025", manufacturer: "Luma Care Ltd" });
  assert.equal(r.verdict, "expired");
  assert.equal(ok(r, "expiry"), false);
  assert.equal(ok(r, "manufacturer"), false);
});
test("A10 no NAFDAC number -> unreadable", () => {
  assert.equal(run({ nafdac_no: null }).verdict, "unreadable");
});
test("A11 most fields null -> unreadable", () => {
  const r = verifyPack(
    {
      name: null,
      strength: null,
      manufacturer: null,
      nafdac_no: "A4-5821",
      expiry: null,
      batch: null,
    },
    today,
    records,
  );
  assert.equal(r.verdict, "unreadable");
});
test("A12 number spacing and letter O still match", () => {
  assert.equal(run({ nafdac_no: "A4 - 5821" }).verdict, "no_red_flags");
  assert.equal(run({ nafdac_no: "a4-582l" }).verdict, "no_red_flags");
  assert.equal(
    run({ nafdac_no: "NAFDAC REG NO: A4-5821" }).verdict,
    "no_red_flags",
  );
});
test("A13 small reading typo in name still matches", () => {
  assert.equal(run({ name: "Wellora Paracetamoi" }).verdict, "no_red_flags");
});
test('A14 "500 mg" vs "500mg" matches', () => {
  assert.equal(ok(run({ strength: "500 MG" }), "strength"), true);
});
test("A15 expiry unreadable, rest matches -> no_red_flags with expiry null", () => {
  const r = run({ expiry: null });
  assert.equal(r.verdict, "no_red_flags");
  assert.equal(ok(r, "expiry"), null);
});
test("explanations never say safe, genuine or verified", () => {
  for (const e of [
    {},
    { manufacturer: "Luma" },
    { nafdac_no: "A4-9999" },
    { expiry: "08/2025" },
    { nafdac_no: null },
  ]) {
    const r = run(e);
    assert.doesNotMatch(
      r.explanation.en + r.explanation.pcm,
      /\b(safe|genuine|verified)\b/i,
    );
  }
});
test("B3/B5 parseExtraction turns bad AI output into nulls", () => {
  assert.equal(parseExtraction("not json").nafdac_no, null);
  assert.equal(
    parseExtraction('```json\n{"name":"X","strength":5,"nafdac_no":"  "}\n```')
      .strength,
    null,
  );
  assert.equal(
    parseExtraction('```json\n{"name":"X","nafdac_no":"A4-1"}\n```').name,
    "X",
  );
});
