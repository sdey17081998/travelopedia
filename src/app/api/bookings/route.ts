import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

type BookingBody = {
  reference?: string;
  tourSlug?: string;
  tourTitle?: string;
  destination?: string;
  state?: string;
  departure?: string;
  travelers?: number;
  addOns?: string[];
  baseTotal?: number;
  addOnsTotal?: number;
  total?: number;
  name?: string;
  email?: string;
  phone?: string;
  notes?: string;
};

export async function POST(request: Request) {
  let body: BookingBody;
  try {
    body = (await request.json()) as BookingBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const required: (keyof BookingBody)[] = [
    "reference",
    "tourSlug",
    "tourTitle",
    "name",
    "email",
    "total",
  ];
  const missing = required.filter((k) => body[k] === undefined || body[k] === "");
  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Missing required fields: ${missing.join(", ")}` },
      { status: 400 },
    );
  }

  try {
    const booking = await prisma.booking.create({
      data: {
        reference: body.reference!,
        tourSlug: body.tourSlug!,
        tourTitle: body.tourTitle!,
        destination: body.destination ?? "",
        state: body.state ?? "",
        departure: body.departure ?? "",
        travelers: body.travelers ?? 1,
        addOns: (body.addOns ?? []).join(", "),
        baseTotal: body.baseTotal ?? 0,
        addOnsTotal: body.addOnsTotal ?? 0,
        total: body.total!,
        name: body.name!,
        email: body.email!,
        phone: body.phone ?? "",
        notes: body.notes ?? "",
        status: "pending",
      },
    });
    return NextResponse.json(
      { id: booking.id, reference: booking.reference },
      { status: 201 },
    );
  } catch (err) {
    console.error("Failed to create booking:", err);
    return NextResponse.json(
      { error: "Failed to save booking." },
      { status: 500 },
    );
  }
}

export async function GET() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: { transactions: true },
  });
  return NextResponse.json({ bookings });
}
