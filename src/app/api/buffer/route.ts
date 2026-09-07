import { NextResponse } from 'next/server';
import { scheduleBufferPost, BufferPostPayload } from '@/lib/buffer';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const secret = process.env.CRON_SECRET || process.env.BUFFER_WEBHOOK_SECRET;

    // Optional webhook/cron secret verification if configured
    if (secret && authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: BufferPostPayload = await req.json();

    if (!body.text) {
      return NextResponse.json(
        { error: 'Missing required field: text is required for Buffer post' },
        { status: 400 }
      );
    }

    const result = await scheduleBufferPost(body);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, updates: result.updates });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
