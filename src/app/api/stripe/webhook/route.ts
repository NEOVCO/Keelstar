import { getStripe, handleStripeWebhook } from "@/lib/stripe";
import { apiError } from "@/lib/errors/api";
import { type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) return apiError("Missing signature", 400);

  try {
    const stripe = getStripe();
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    await handleStripeWebhook(event);
    return Response.json({ received: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook error";
    return apiError(message, 400);
  }
}
