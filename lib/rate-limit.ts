const requestCounts = new Map<string, { count: number; date: string }>();

export function checkRateLimit(ip: string, maxRequests = 5): boolean {
  const today = new Date().toISOString().split('T')[0];
  const entry = requestCounts.get(ip);

  if (!entry || entry.date !== today) {
    requestCounts.set(ip, { count: 1, date: today });
    return true;
  }

  if (entry.count >= maxRequests) {
    return false;
  }

  entry.count++;
  return true;
}
