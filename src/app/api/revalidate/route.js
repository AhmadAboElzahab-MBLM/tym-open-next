import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { path, paths, tag, tags } = body;

    const revalidated = [];

    // Revalidate single path
    if (path) {
      revalidatePath(path);
      revalidated.push({ type: 'path', value: path });
    }

    // Revalidate multiple paths
    if (paths && Array.isArray(paths)) {
      paths.forEach((p) => {
        revalidatePath(p);
        revalidated.push({ type: 'path', value: p });
      });
    }

    // Revalidate single tag
    if (tag) {
      revalidateTag(tag);
      revalidated.push({ type: 'tag', value: tag });
    }

    // Revalidate multiple tags
    if (tags && Array.isArray(tags)) {
      tags.forEach((t) => {
        revalidateTag(t);
        revalidated.push({ type: 'tag', value: t });
      });
    }

    if (revalidated.length === 0) {
      return NextResponse.json(
        { message: 'No path or tag provided for revalidation' },
        { status: 400 },
      );
    }

    return NextResponse.json({
      revalidated: true,
      timestamp: new Date().toISOString(),
      items: revalidated,
    });
  } catch (err) {
    console.error('Revalidation error:', err);
    return NextResponse.json(
      { message: 'Error revalidating', error: err.message },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Revalidation API is active',
    usage: 'Send POST request with { path } or { tag }',
  });
}
