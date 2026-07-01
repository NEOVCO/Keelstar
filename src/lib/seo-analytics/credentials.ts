import { readFileSync } from "fs";
import { resolve } from "path";
import { JWT } from "google-auth-library";

const SCOPES = [
  "https://www.googleapis.com/auth/webmasters.readonly",
  "https://www.googleapis.com/auth/analytics.readonly",
];

function fromServiceAccountInfo(info: {
  client_email: string;
  private_key: string;
}): JWT {
  return new JWT({
    email: info.client_email,
    key: info.private_key,
    scopes: SCOPES,
  });
}

export function loadGoogleCredentials(): JWT {
  const jsonInline = (process.env.GOOGLE_SERVICE_ACCOUNT_JSON ?? "").trim();
  if (jsonInline) {
    return fromServiceAccountInfo(JSON.parse(jsonInline));
  }

  const filePath =
    (process.env.GOOGLE_SERVICE_ACCOUNT_JSON_FILE ?? "").trim() ||
    (process.env.GOOGLE_APPLICATION_CREDENTIALS ?? "").trim();

  if (filePath) {
    const abs = resolve(process.cwd(), filePath);
    const info = JSON.parse(readFileSync(abs, "utf8"));
    return fromServiceAccountInfo(info);
  }

  throw new Error(
    "No Google credentials: set GOOGLE_SERVICE_ACCOUNT_JSON_FILE or GOOGLE_APPLICATION_CREDENTIALS"
  );
}
