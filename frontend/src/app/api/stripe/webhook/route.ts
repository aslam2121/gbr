import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import type Stripe from "stripe";
import axios from "axios";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

/** Update user subscription_status in Strapi using admin API token or JWT */
async function updateUserSubscription(
  strapiUserId: string,
  status: "active" | "cancelled" | "free",
  stripeCustomerId?: string
) {
  // Use a Strapi API token for server-to-server updates
  const token = process.env.STRAPI_API_TOKEN;
  if (!token) {
    console.error("STRAPI_API_TOKEN not set — cannot update user subscription");
    return;
  }

  const updateData: Record<string, unknown> = { subscription_status: status };
  if (stripeCustomerId) {
    updateData.stripe_customer_id = stripeCustomerId;
  }

  await axios.put(
    `${STRAPI_URL}/api/users/${strapiUserId}`,
    updateData,
    { headers: { Authorization: `Bearer ${token}` } }
  );
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Missing signature or webhook secret" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const strapiUserId = session.metadata?.strapi_user_id;
        if (strapiUserId) {
          await updateUserSubscription(
            strapiUserId,
            "active",
            session.customer as string
          );
          console.log(`Subscription activated for user ${strapiUserId}`);
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const strapiUserId = subscription.metadata?.strapi_user_id;
        if (strapiUserId) {
          const status = subscription.status === "active" ? "active" : "cancelled";
          await updateUserSubscription(strapiUserId, status);
          console.log(`Subscription updated to ${status} for user ${strapiUserId}`);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const strapiUserId = subscription.metadata?.strapi_user_id;
        if (strapiUserId) {
          await updateUserSubscription(strapiUserId, "free");
          console.log(`Subscription cancelled for user ${strapiUserId}`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    console.error(`Error handling ${event.type}:`, err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
