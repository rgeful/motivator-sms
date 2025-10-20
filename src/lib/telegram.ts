export async function sendTelegram(body: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN!;
  const chatId = process.env.TELEGRAM_CHAT_ID!;
  if (!token || !chatId) throw new Error('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID');

  const resp = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: body })
  });

  if (!resp.ok) {
    throw new Error(`Telegram send failed: ${resp.status} ${await resp.text()}`);
  }
}
