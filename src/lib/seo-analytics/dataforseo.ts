const BASE = "https://api.dataforseo.com/v3";

function authHeader(): string {
  const login = process.env.DATAFORSEO_LOGIN?.trim();
  const password = process.env.DATAFORSEO_PASSWORD?.trim();
  if (!login || !password) {
    throw new Error("DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD required");
  }
  return `Basic ${Buffer.from(`${login}:${password}`).toString("base64")}`;
}

export async function dataForSeoPost<T>(path: string, body: unknown[]): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`DataForSEO ${res.status}: ${text.slice(0, 500)}`);
  }
  return res.json() as Promise<T>;
}

export async function getKeywordSearchVolume(keywords: string[], locationCode = 2840) {
  return dataForSeoPost("/keywords_data/google_ads/search_volume/live", [
    {
      keywords,
      location_code: locationCode,
      language_code: "en",
    },
  ]);
}

export async function getSerpOrganic(keyword: string, locationCode = 2840) {
  return dataForSeoPost("/serp/google/organic/live/regular", [
    {
      keyword,
      location_code: locationCode,
      language_code: "en",
      device: "desktop",
      depth: 20,
    },
  ]);
}
