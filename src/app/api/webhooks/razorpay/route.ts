import { NextResponse } from "next/server";
import { headers } from "next/headers";
import crypto from "crypto";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.text();
  const headerList = await headers();
  const signature = headerList.get("x-razorpay-signature");

  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (secret && signature) {
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Invalid Razorpay signature" }, { status: 400 });
    }
  }

  try {
    const payload = JSON.parse(body);
    const event = payload.event;

    if (event === "payment.captured") {
      const paymentEntity = payload.payload.payment.entity;
      const transactionId = paymentEntity.id;

      const payment = await prisma.payment.findUnique({
        where: { transactionId },
        include: { order: true },
      });

      if (payment && payment.order) {
        await prisma.$transaction([
          prisma.payment.update({
            where: { id: payment.id },
            data: { status: "COMPLETED", rawPayload: paymentEntity },
          }),
          prisma.order.update({
            where: { id: payment.order.id },
            data: { status: "PAID" },
          }),
        ]);
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error("Razorpay webhook error:", err);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
