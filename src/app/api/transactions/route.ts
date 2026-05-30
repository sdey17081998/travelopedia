import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

type TransactionBody = {
  bookingId?: string;
  reference?: string;
  amount?: number;
  upiId?: string;
  upiApp?: string;
  status?: string;
};

export async function POST(request: Request) {
  let body: TransactionBody;
  try {
    body = (await request.json()) as TransactionBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body.bookingId || body.amount === undefined || !body.upiId) {
    return NextResponse.json(
      { error: "Missing required fields: bookingId, amount, upiId." },
      { status: 400 },
    );
  }

  const booking = await prisma.booking.findUnique({
    where: { id: body.bookingId },
  });
  if (!booking) {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }

  try {
    const status = body.status ?? "success";
    const transaction = await prisma.transaction.create({
      data: {
        bookingId: body.bookingId,
        reference: body.reference ?? booking.reference,
        amount: body.amount,
        upiId: body.upiId,
        upiApp: body.upiApp ?? "UPI",
        status,
      },
    });

    // Mark the booking confirmed once a successful payment is logged.
    if (status === "success") {
      await prisma.booking.update({
        where: { id: body.bookingId },
        data: { status: "confirmed" },
      });
    }

    return NextResponse.json({ id: transaction.id, status }, { status: 201 });
  } catch (err) {
    console.error("Failed to create transaction:", err);
    return NextResponse.json(
      { error: "Failed to save transaction." },
      { status: 500 },
    );
  }
}

export async function GET() {
  const transactions = await prisma.transaction.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ transactions });
}
