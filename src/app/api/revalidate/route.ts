import { NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';

/**
 * On-demand cache revalidation endpoint
 * Called by backend mutations or administrative actions to invalidate Next.js ISR tags
 */
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const secret = process.env.REVALIDATE_SECRET;

    if (secret && authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const tag = body.tag || 'products';
    const path = body.path;

    if (tag) {
      revalidateTag(tag, 'max');
    }
    if (path) {
      revalidatePath(path);
    }

    return NextResponse.json({
      success: true,
      revalidated: true,
      tag,
      path,
      now: Date.now(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Revalidation failed' },
      { status: 500 }
    );
  }
}
