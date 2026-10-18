import type { Check, Extracted, RegistryRecord, Verdict, VerifyResponse } from '@/lib/types';

// One fake answer per verdict. The frontend uses these until /api/verify is live.
// Open any page with ?mock=<verdict> (for example /result?mock=mismatch) to load one.

const record: RegistryRecord = {
  name: 'Wellora Paracetamol',
  strength: '500mg',
  manufacturer: 'Wellora Pharma Ltd',
  nafdac_no: 'A4-5821',
  status: 'active',
};

const pack: Extracted = {
  name: 'Wellora Paracetamol',
  strength: '500 mg',
  manufacturer: 'Wellora Pharma Ltd',
  nafdac_no: 'A4-5821',
  expiry: '12/2027',
  batch: 'WP2311',
};

function checksFor(p: Extracted, r: RegistryRecord | null, overrides: Partial<Record<Check['field'], boolean | null>> = {}): Check[] {
  const base: Check[] = [
    { field: 'name', pack: p.name, registry: r?.name ?? null, ok: r ? true : null },
    { field: 'strength', pack: p.strength, registry: r?.strength ?? null, ok: r ? true : null },
    { field: 'manufacturer', pack: p.manufacturer, registry: r?.manufacturer ?? null, ok: r ? true : null },
    { field: 'nafdac_no', pack: p.nafdac_no, registry: r?.nafdac_no ?? null, ok: r ? true : null },
    { field: 'registration_status', pack: null, registry: r?.status ?? null, ok: r ? r.status === 'active' : null },
    { field: 'expiry', pack: p.expiry, registry: null, ok: p.expiry ? true : null },
  ];
  return base.map((c) => (c.field in overrides ? { ...c, ok: overrides[c.field] ?? null } : c));
}

const mismatchPack: Extracted = { ...pack, manufacturer: 'Luma Care Ltd' };
const notFoundPack: Extracted = { ...pack, nafdac_no: 'A4-9999' };
const expiredPack: Extracted = { ...pack, expiry: '08/2025' };
const unreadablePack: Extracted = {
  name: null, strength: null, manufacturer: null, nafdac_no: null, expiry: null, batch: null,
};

export const mockResponses: Record<Verdict, VerifyResponse> = {
  no_red_flags: {
    verdict: 'no_red_flags',
    extracted: pack,
    registry: record,
    checks: checksFor(pack, record),
    explanation: {
      en: "The readable details match NAFDAC's record. This is not a guarantee of authenticity.",
      pcm: 'The details wey we fit read match NAFDAC record. But e no be guarantee say the drug dey original.',
    },
  },
  mismatch: {
    verdict: 'mismatch',
    extracted: mismatchPack,
    registry: record,
    checks: checksFor(mismatchPack, record, { manufacturer: false }),
    explanation: {
      en: "The manufacturer on this pack doesn't match NAFDAC's record. Take a closer look.",
      pcm: 'The manufacturer for this pack no match NAFDAC record. Look am well.',
    },
  },
  not_found: {
    verdict: 'not_found',
    extracted: notFoundPack,
    registry: null,
    checks: checksFor(notFoundPack, null),
    explanation: {
      en: "This number isn't in NAFDAC's records. That alone doesn't prove the medicine is fake.",
      pcm: 'This number no dey NAFDAC record. But that one alone no prove say the drug dey fake.',
    },
  },
  expired: {
    verdict: 'expired',
    extracted: expiredPack,
    registry: record,
    checks: checksFor(expiredPack, record, { expiry: false }),
    explanation: {
      en: 'The pack reads August 2025, which has already passed.',
      pcm: 'The pack talk August 2025, and that date don pass.',
    },
  },
  unreadable: {
    verdict: 'unreadable',
    extracted: unreadablePack,
    registry: null,
    checks: checksFor(unreadablePack, null),
    explanation: {
      en: "The photo isn't clear enough to read the details. No record comparison was made.",
      pcm: 'The photo no clear reach to read the details. We no compare am with any record.',
    },
  },
};
