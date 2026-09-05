import Stripe from "stripe";
import { SIMPLEMAN_PRICES, computeCustomTotal } from "../prices.js";

const ORDER_NAMES = {
  simpleman1: "Simpleman 1",
  simpleman2: "Simpleman 2",
  custom: "Custom Meal",
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env.STRIPE_SECRET_KEY) {
    return json({ error: "Stripe is not configured on this deployment." }, 500);
  }

  const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    httpClient: Stripe.createFetchHttpClient(),
  });

  const body = await request.json().catch(() => ({}));
  const { type, selections } = body;

  let amount;
  if (type === "simpleman1" || type === "simpleman2") {
    amount = SIMPLEMAN_PRICES[type];
  } else if (type === "custom") {
    amount = computeCustomTotal(selections || {});
  }

  if (!amount) {
    return json({ error: "Invalid order type or empty custom selection." }, 400);
  }

  const origin = new URL(request.url).origin;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { name: ORDER_NAMES[type] || "Meal" },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/index.html?payment=success`,
      cancel_url: `${origin}/index.html?payment=cancelled`,
    });

    return json({ url: session.url });
  } catch (err) {
    return json({ error: err.message || "Could not create checkout session." }, 500);
  }
}
