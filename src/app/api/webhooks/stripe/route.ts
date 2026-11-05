import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import Stripe from "stripe";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || "sk_test_mock_secret_key_for_testing",
  {
    apiVersion: "2024-12-18.acacia" as any,
  }
);

export async function POST(req: Request) {
  const body = await req.text();
  const headerList = await headers();
  const signature = headerList.get("stripe-signature");

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      // In local dev without active Stripe CLI tunnel, parse body
      event = JSON.parse(body);
    }
  } catch (err: any) {
    console.error("Stripe Webhook Signature Verification Failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const transactionId = paymentIntent.id;

        // Idempotently update payment and order
        const payment = await prisma.payment.findUnique({
          where: { transactionId },
          include: { order: true },
        });

        if (payment && payment.order) {
          await prisma.$transaction([
            prisma.payment.update({
              where: { id: payment.id },
              data: { status: "COMPLETED", rawPayload: paymentIntent as any },
            }),
            prisma.order.update({
              where: { id: payment.order.id },
              data: { status: "PAID" },
            }),
          ]);
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const transactionId = paymentIntent.id;

        await prisma.payment.updateMany({
          where: { transactionId },
          data: { status: "FAILED" },
        });
        break;
      }

      default:
        // Ignore unhandled event types
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook handling error:", err);
    return NextResponse.json({ error: "Webhook processing error" }, { status: 500 });
  }
}
