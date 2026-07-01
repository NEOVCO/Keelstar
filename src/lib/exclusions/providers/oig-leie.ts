import { getOigDataSourceUrl } from "../constants";

export type LeieRecord = {
  lastName: string;
  firstName: string;
  midName: string;
  busName: string;
  general: string;
  specialty: string;
  upin: string;
  npi: string;
  dob: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  exclType: string;
  exclDate: string;
  reinDate: string;
  waiverDate: string;
  wvrState: string;
};

export type LeieCache = {
  loadedAt: string;
  sourceUrl: string;
  recordCount: number;
  records: LeieRecord[];
};

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const FETCH_TIMEOUT_MS = 60_000;

let cache: LeieCache | null = null;
let loadPromise: Promise<LeieCache> | null = null;

export function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

export function parseLeieCsv(csv: string): LeieRecord[] {
  const lines = csv.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) return [];

  const records: LeieRecord[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    if (cols.length < 18) continue;

    records.push({
      lastName: cols[0] ?? "",
      firstName: cols[1] ?? "",
      midName: cols[2] ?? "",
      busName: cols[3] ?? "",
      general: cols[4] ?? "",
      specialty: cols[5] ?? "",
      upin: cols[6] ?? "",
      npi: cols[7] ?? "",
      dob: cols[8] ?? "",
      address: cols[9] ?? "",
      city: cols[10] ?? "",
      state: cols[11] ?? "",
      zip: cols[12] ?? "",
      exclType: cols[13] ?? "",
      exclDate: cols[14] ?? "",
      reinDate: cols[15] ?? "",
      waiverDate: cols[16] ?? "",
      wvrState: cols[17] ?? "",
    });
  }

  return records;
}

function cacheIsFresh(entry: LeieCache): boolean {
  const age = Date.now() - new Date(entry.loadedAt).getTime();
  return age < CACHE_TTL_MS;
}

async function fetchLeieDatabase(sourceUrl: string): Promise<LeieCache> {
  const res = await fetch(sourceUrl, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    headers: {
      Accept: "text/csv",
      "User-Agent": "Keelstar/1.0 (exclusion screening; +https://www.keelstar.com)",
    },
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    throw new Error(`OIG LEIE download failed: HTTP ${res.status}`);
  }

  const csv = await res.text();
  const records = parseLeieCsv(csv);

  if (!records.length) {
    throw new Error("OIG LEIE CSV parsed zero records");
  }

  return {
    loadedAt: new Date().toISOString(),
    sourceUrl,
    recordCount: records.length,
    records,
  };
}

export async function loadLeieCache(force = false): Promise<LeieCache> {
  const sourceUrl = getOigDataSourceUrl();

  if (!force && cache && cache.sourceUrl === sourceUrl && cacheIsFresh(cache)) {
    return cache;
  }

  if (!force && loadPromise) {
    return loadPromise;
  }

  loadPromise = fetchLeieDatabase(sourceUrl)
    .then((entry) => {
      cache = entry;
      return entry;
    })
    .finally(() => {
      loadPromise = null;
    });

  return loadPromise;
}

export function clearLeieCacheForTests(): void {
  cache = null;
  loadPromise = null;
}

export function getLeieCacheMetadata(): Pick<LeieCache, "loadedAt" | "sourceUrl" | "recordCount"> | null {
  if (!cache) return null;
  return {
    loadedAt: cache.loadedAt,
    sourceUrl: cache.sourceUrl,
    recordCount: cache.recordCount,
  };
}
