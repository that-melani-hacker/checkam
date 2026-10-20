import { NextResponse } from 'next/server';
import { parseUpload } from '@/lib/verify/parseUpload';
import { getDemoResponse } from '@/lib/demo/fallback';
import { extractPackDetails } from '@/lib/ai/extract';
import { verifyPack } from '@/lib/match/verifyPack';
import { saveCheckLog } from '@/lib/log/checkLog';
import { errorResponse } from '@/lib/errors';

/** Owner: Fortunatus. Runs the pipeline in call-flow order. Tests: C1-C6, E1-E4 */
export async function POST(req: Request): Promise<Response> {
  try {
    const upload = await parseUpload(req);
    const response =
      getDemoResponse(upload.image) ??
      verifyPack(await extractPackDetails(upload.images));
    await saveCheckLog(response, upload.tag); // never throws
    return NextResponse.json(response);
  } catch (err) {
    return errorResponse(err);
  }
}
