let lastIndex: number | null = null;

export function pickMessage(name: string, pool: string[]): string {
  if (!pool.length) throw new Error('No messages configured');

  let idx = Math.floor(Math.random() * pool.length);
  if (pool.length > 1 && idx === lastIndex) idx = (idx + 1) % pool.length;
  lastIndex = idx;

  const who = process.env.TARGET_NAME || name;
  return pool[idx].replaceAll('{name}', who);
}
