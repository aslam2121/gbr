import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { strapiGet } from "@/lib/strapi";

interface SubscriptionPlan {
  id: number;
  documentId: string;
  name: string;
  stripe_price_id_monthly: string | null;
  stripe_price_id_yearly: string | null;
  price_monthly: number;
  price_yearly: number | null;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id || !session.jwt) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { plan_id, billing_period } = body as {
      plan_id: number;
      billing_period: "monthly" | "yearly";
    };

    if (!plan_id || !billing_period) {
      return NextResponse.json(
        { error: "plan_id and billing_period are required" },
        { status: 400 }
      );
    }

    // Fetch the plan from Strapi
    const planRes = await strapiGet<SubscriptionPlan>(
      `/subscription-plans/${plan_id}`,
      undefined,
      session.jwt
    );

    const plan = planRes.data;
    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    const priceId =
      billing_period === "yearly"
        ? plan.stripe_price_id_yearly
        : plan.stripe_price_id_monthly;

    if (!priceId) {
      return NextResponse.json(
        { error: `No Stripe price ID configured for ${billing_period} billing` },
        { status: 400 }
      );
    }

    // Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?subscription=success`,
      cancel_url: `${process.env.NEXTAUTH_URL}/pricing?subscription=cancelled`,
      client_reference_id: String(session.user.id),
      metadata: {
        strapi_user_id: String(session.user.id),
        plan_id: String(plan_id),
        plan_name: plan.name,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
