import { createClient } from "@/lib/supabase/server";
import { passwordResetRedirectUrl } from "@/lib/auth/urls";
import { apiSuccess, apiError } from "@/lib/errors/api";

export async function POST(request: Request) {
  const { email } = await request.json();
  if (!email || typeof email !== "string") {
    return apiError("Email is required", 400);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: passwordResetRedirectUrl(),
  });

  if (error) return apiError(error.message, 400);
  return apiSuccess({ sent: true });
}
