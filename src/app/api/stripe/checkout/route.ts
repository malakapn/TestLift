import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST() {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Missing STRIPE_SECRET_KEY" },
        { status: 500 }
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            product_data: { name: "TestLift Pro Credits" },
            unit_amount: 1900,
          },
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://testlift.dev"}/stage1?checkout=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://testlift.dev"}/stage1?checkout=cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Stripe error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
