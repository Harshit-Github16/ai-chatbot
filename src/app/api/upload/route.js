import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'Content-Type must be multipart/form-data' }, { status: 400 });
    }

    const formData = await request.formData();
    const file = formData.get('file');
    if (!file) return NextResponse.json({ error: 'file is required' }, { status: 400 });

    // For demo: store in-memory and return a blob URL-like path. In production, upload to S3/Cloudinary.
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Simple in-memory base64 data URL response (not persisted across server restarts)
    const base64 = buffer.toString('base64');
    const mime = file.type || 'image/png';
    const dataUrl = `data:${mime};base64,${base64}`;

    return NextResponse.json({ ok: true, url: dataUrl, name: file.name, size: file.size, type: mime });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}


