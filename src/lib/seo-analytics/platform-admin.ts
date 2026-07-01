import { createClient } from "@/lib/supabase/server";
import { getAdminEmails, isSeoAnalyticsEnabled } from "./config";

export class SeoAdminError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
  }
}

export async function requireSeoAdmin() {
  if (!isSeoAnalyticsEnabled()) {
    throw new SeoAdminError("SEO analytics disabled (set ENABLE_SEO_ANALYTICS=true)", 503);
  }

  const allowed = getAdminEmails();
  if (!allowed.size) {
    throw new SeoAdminError("ADMIN_EMAILS not configured", 503);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    throw new SeoAdminError("Authentication required", 401);
  }

  if (!allowed.has(user.email.toLowerCase())) {
    throw new SeoAdminError("Admin access required", 403);
  }

  return user;
}
