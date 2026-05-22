function cleanParams(params: Record<string, any>): Record<string, any> {
  const cleaned: Record<string, any> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== '' && value !== undefined && value !== null) {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

export async function fetchFromGameApi(params: Record<string, string> = {}) {
  const baseUrl = process.env.GAME_API_URL;
  const secret = process.env.GAME_SECRET;
  if (!baseUrl || !secret) {
    throw new Error('Game API or Secret is not configured');
  }

  const queryParams = new URLSearchParams(cleanParams({ ...params, secret })).toString();
  const url = `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}${queryParams}`;

  const response = await fetch(url, {
    method: 'GET',
    cache: 'no-store',
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`Game API status: ${response.status}. ${text.substring(0, 100)}`);
  }

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error('Game API JSON Parse Error. Response text:', text.substring(0, 500));
    throw new Error('Failed to parse Game API response as JSON. The script might be returning an HTML error page.');
  }
}

export async function postToGameApi(action: string, data: Record<string, any> = {}) {
  const url = process.env.GAME_API_URL;
  const secret = process.env.GAME_SECRET;

  if (!url || !secret) {
    throw new Error('Game API or Secret is not configured');
  }

  const cleanData = cleanParams(data);
  const payload = {
    ...cleanData,
    action,
    secret,
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`Game API status: ${response.status}. ${text.substring(0, 100)}`);
  }

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error('Game API JSON Parse Error. Response text:', text.substring(0, 500));
    throw new Error('Failed to parse Game API response as JSON. The script might be returning an HTML error page.');
  }
}
