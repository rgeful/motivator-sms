export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { sendTelegram } from "../../../lib/telegram";
import { pickMessage } from "../../../lib/pick";
import { MESSAGES } from "../../../lib/messages";

import { kv } from "@vercel/kv";

// Target hours in PST
const WINDOWS = [
  { key: "morning",   hour: 9  }, // 09:00
  { key: "afternoon", hour: 13 }, // 13:00
  { key: "evening",   hour: 19 }, // 19:00
];

// How close (in minutes) to the target hour we allow a send.
// Match this to your cron frequency (e.g., */15).
const WINDOW_MINUTES = 15;

function nowInTZ(tz: string) {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  const parts = Object.fromEntries(
    fmt.formatToParts(new Date()).map((p) => [p.type, p.value])
  );
  const y = Number(parts.year),
    m = Number(parts.month),
    d = Number(parts.day),
    hh = Number(parts.hour),
    mm = Number(parts.minute);
  const dateKey = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const minutesOfDay = hh * 60 + mm;
  return { dateKey, minutesOfDay };
}

function inWindow(targetHour: number, minutesOfDay: number, windowMinutes: number) {
  const target = targetHour * 60;
  return Math.abs(minutesOfDay - target) <= windowMinutes;
}

export async function GET() {
  try {
    const { dateKey, minutesOfDay } = nowInTZ("America/Los_Angeles");
    const name = process.env.TARGET_NAME || "friend";
    const results: Record<string, string> = {};

    for (const w of WINDOWS) {
      const sentKey = `sent:${dateKey}:${w.key}`;
      const already = await kv.get<string | null>(sentKey);

      if (!already && inWindow(w.hour, minutesOfDay, WINDOW_MINUTES)) {
        const text = pickMessage(name, MESSAGES);
        await sendTelegram(text);

        // prevent duplicates for the rest of the day
        await kv.set(sentKey, "1", { ex: 60 * 60 * 24 });

        results[w.key] = "sent";
      } else {
        results[w.key] = already
          ? "skipped (already sent)"
          : "skipped (outside window)";
      }
    }

    return NextResponse.json({ ok: true, results });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
