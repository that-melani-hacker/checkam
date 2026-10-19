// CheckAm shared contract. Agree once; changes need Fortunatus and Melani.

export type Nullable<T> = T | null;
export type Lang = 'en' | 'pcm';
export type Explanation = { en: string; pcm: string };

export type Verdict = 'no_red_flags' | 'mismatch' | 'not_found' | 'expired' | 'unreadable';

export type Field =
  | 'name'
  | 'strength'
  | 'manufacturer'
  | 'nafdac_no'
  | 'registration_status'
  | 'expiry';

export interface Extracted {
  name: string | null;
  strength: string | null;
  manufacturer: string | null;
  nafdac_no: string | null;
  expiry: string | null; // 'MM/YYYY'
  batch: string | null;
}

export interface RegistryRecord {
  name: string;
  strength: string;
  manufacturer: string;
  nafdac_no: string;
  status: 'active' | 'inactive';
}

export interface Check {
  field: Field;
  pack: string | null;
  registry: string | null;
  ok: boolean | null; // null = not assessed
}

export interface VerifyResponse {
  verdict: Verdict;
  extracted: Extracted;
  registry: RegistryRecord | null; // null when not_found or unreadable
  checks: Check[]; // always six rows, in FIELD_ORDER
  explanation: Explanation;
}

export const FIELD_ORDER: Field[] = [
  'name',
  'strength',
  'manufacturer',
  'nafdac_no',
  'registration_status',
  'expiry',
];

export type ErrorCode =
  | 'no_image'
  | 'bad_file_type'
  | 'file_too_large'
  | 'rate_limited'
  | 'ai_unavailable'
  | 'server_error';

export interface ErrorBody {
  error: { code: ErrorCode; message: string };
}

export interface UploadImage {
  data: Buffer;
  mimeType: string;
}

export interface Upload {
  image: Buffer; // the first photo (kept for code that only needs one)
  mimeType: string;
  images: UploadImage[]; // every photo, 1 to MAX_PHOTOS, different sides of the same pack
  tag: Nullable<string>;
}

/** Most photos one check accepts (front, back, sides). */
export const MAX_PHOTOS = 4;

export interface CheckLog {
  id: string; // uuid
  created_at: string; // timestamp
  verdict: Verdict;
  nafdac_no: string | null; // as read from the pack
  product_name: string | null; // as read from the pack
  failed_fields: Field[];
  tag: string | null; // 'T01'-'T20', 'demo' or null
}

// Frontend
export type ClientErrorCode = ErrorCode | 'timeout' | 'offline';

export interface VerifyState {
  result: Nullable<VerifyResponse>;
  photoUrl: Nullable<string>;
  lang: Lang;
  setResult: (result: VerifyResponse, photoUrl: string) => void;
  setLang: (lang: Lang) => void;
  reset: () => void;
}
