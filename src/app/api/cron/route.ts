export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { sendTelegram } from '../../../lib/telegram';
import { pickMessage } from '../../../lib/pick';
import { MESSAGES } from '../../../lib/messages';

export async function GET() {
  try {
    const name = process.env.TARGET_NAME || 'friend';
    const text = pickMessage(name, MESSAGES);
    await sendTelegram(text);
    return NextResponse.json({ ok: true, text });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}