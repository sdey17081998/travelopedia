"use client";

import React from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import SiteNav from "@/components/SiteNav";
import { formatPrice, getTour, type Tour } from "@/lib/tours";

/** Demo merchant UPI handle — no real money is collected. */
const MERCHANT_UPI = "travelopedia@okaxis";
const MERCHANT_NAME = "Travelopedia";

type AddOns = {
  insurance: boolean;
  privateGuide: boolean;
  airportTransfer: boolean;
};

const ADD_ON_PRICES = {
  insurance: 1200,
  privateGuide: 4500,
  airportTransfer: 900,
};

const STEPS = [
  "Trip details",
  "Traveler info",
  "Review",
  "Payment",
  "Confirmed",
] as const;

function todayPlus(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function makeReference(): string {
  return "TRP-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

export default function BookingPage() {
  const params = useParams<{ slug: string }>();
  const tour: Tour | undefined = getTour(params.slug);

  const [step, setStep] = React.useState(0);
  const [date, setDate] = React.useState(todayPlus(30));
  const [travelers, setTravelers] = React.useState(2);
  const [addOns, setAddOns] = React.useState<AddOns>({
    insurance: true,
    privateGuide: false,
    airportTransfer: true,
  });
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [reference] = React.useState(makeReference);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [upiApp, setUpiApp] = React.useState("GPay");
  const [copied, setCopied] = React.useState(false);
  const [bookingId, setBookingId] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState("");

  if (!tour) {
    notFound();
  }

  const addOnsTotal =
    (addOns.insurance ? ADD_ON_PRICES.insurance : 0) +
    (addOns.privateGuide ? ADD_ON_PRICES.privateGuide : 0) +
    (addOns.airportTransfer ? ADD_ON_PRICES.airportTransfer : 0);

  const baseTotal = tour.price * travelers;
  const total = baseTotal + addOnsTotal * travelers;

  const selectedAddOns = [
    addOns.insurance && "Travel insurance",
    addOns.privateGuide && "Private guide",
    addOns.airportTransfer && "Airport transfer",
  ].filter(Boolean) as string[];

  // UPI deep link encoded into the QR — scannable by any UPI app.
  const upiUri =
    `upi://pay?pa=${encodeURIComponent(MERCHANT_UPI)}` +
    `&pn=${encodeURIComponent(MERCHANT_NAME)}` +
    `&am=${total}&cu=INR` +
    `&tn=${encodeURIComponent(`Travelopedia ${reference}`)}`;

  const copyUpi = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(MERCHANT_UPI).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const validateTravelerInfo = () => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "Please enter a valid email address.";
    if (phone.replace(/\D/g, "").length < 7)
      next.phone = "Please enter a valid phone number.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const saveBooking = async (): Promise<string> => {
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reference,
        tourSlug: tour.slug,
        tourTitle: tour.title,
        destination: tour.destination,
        state: tour.state,
        departure: date,
        travelers,
        addOns: selectedAddOns,
        baseTotal,
        addOnsTotal: addOnsTotal * travelers,
        total,
        name,
        email,
        phone,
        notes,
      }),
    });
    if (!res.ok) throw new Error("Failed to save booking");
    const data = (await res.json()) as { id: string };
    return data.id;
  };

  const saveTransaction = async (id: string): Promise<void> => {
    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookingId: id,
        reference,
        amount: total,
        upiId: MERCHANT_UPI,
        upiApp,
        status: "success",
      }),
    });
    if (!res.ok) throw new Error("Failed to record transaction");
  };

  const goNext = async () => {
    if (step === 1 && !validateTravelerInfo()) return;
    setSubmitError("");

    // Persist the booking when proceeding to payment.
    if (step === 2 && !bookingId) {
      setSubmitting(true);
      try {
        const id = await saveBooking();
        setBookingId(id);
      } catch {
        setSubmitting(false);
        setSubmitError("Couldn't save your booking. Please try again.");
        return;
      }
      setSubmitting(false);
    }

    // Log the UPI transaction when paying.
    if (step === 3) {
      setSubmitting(true);
      try {
        if (bookingId) await saveTransaction(bookingId);
      } catch {
        setSubmitting(false);
        setSubmitError("Payment could not be recorded. Please try again.");
        return;
      }
      setSubmitting(false);
    }

    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  };
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div className="relative min-h-dvh font-sans text-zinc-900 dark:text-zinc-50">
      <SiteNav />

      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
          <Link href="/tours" className="hover:underline">
            Tours
          </Link>{" "}
          /{" "}
          <Link href={`/tours/${tour.slug}`} className="hover:underline">
            {tour.title}
          </Link>{" "}
          / <span className="text-zinc-800 dark:text-zinc-200">Book</span>
        </nav>

        {/* Stepper */}
        <ol className="mb-8 flex items-center gap-2">
          {STEPS.map((label, i) => (
            <li key={label} className="flex flex-1 items-center gap-2">
              <div
                className={
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition " +
                  (i <= step
                    ? "bg-gradient-to-br from-indigo-500 to-cyan-500 text-white"
                    : "border border-zinc-300 text-zinc-400 dark:border-zinc-700")
                }
              >
                {i < step ? "✓" : i + 1}
              </div>
              <span
                className={
                  "hidden text-sm font-medium sm:block " +
                  (i <= step
                    ? "text-zinc-900 dark:text-zinc-50"
                    : "text-zinc-400")
                }
              >
                {label}
              </span>
              {i < STEPS.length - 1 && (
                <span className="mx-1 hidden h-px flex-1 bg-zinc-200 dark:bg-zinc-700 sm:block" />
              )}
            </li>
          ))}
        </ol>

        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          {/* Step content */}
          <div className="card-sheen rounded-3xl border border-zinc-200/70 bg-white/70 p-6 backdrop-blur dark:border-zinc-800/70 dark:bg-black/20">
            {step === 0 && (
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Trip details
                </h1>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  Choose your departure date, party size and any extras.
                </p>

                <label
                  htmlFor="date"
                  className="mt-6 block text-sm font-semibold"
                >
                  Departure date
                </label>
                <input
                  id="date"
                  type="date"
                  value={date}
                  min={todayPlus(1)}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-zinc-200 bg-white/80 px-3 py-2 text-sm outline-none focus:border-indigo-400 dark:border-zinc-700 dark:bg-black/30"
                />

                <label className="mt-4 block text-sm font-semibold">
                  Travelers
                </label>
                <div className="mt-1 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setTravelers((t) => Math.max(1, t - 1))}
                    className="h-9 w-9 rounded-full border border-zinc-300 text-lg font-bold dark:border-zinc-700"
                    aria-label="Decrease travelers"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-lg font-bold">
                    {travelers}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setTravelers((t) => Math.min(tour.groupSize, t + 1))
                    }
                    className="h-9 w-9 rounded-full border border-zinc-300 text-lg font-bold dark:border-zinc-700"
                    aria-label="Increase travelers"
                  >
                    +
                  </button>
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    max {tour.groupSize}
                  </span>
                </div>

                <p className="mt-6 text-sm font-semibold">Add-ons (per person)</p>
                <div className="mt-2 space-y-2">
                  {(
                    [
                      ["insurance", "Travel insurance"],
                      ["privateGuide", "Private guide"],
                      ["airportTransfer", "Airport transfer"],
                    ] as const
                  ).map(([key, label]) => (
                    <label
                      key={key}
                      className="flex cursor-pointer items-center justify-between rounded-xl border border-zinc-200 bg-white/60 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-black/20"
                    >
                      <span className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={addOns[key]}
                          onChange={(e) =>
                            setAddOns((a) => ({
                              ...a,
                              [key]: e.target.checked,
                            }))
                          }
                          className="h-4 w-4 accent-indigo-500"
                        />
                        {label}
                      </span>
                      <span className="font-semibold">
                        +{formatPrice(ADD_ON_PRICES[key])}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Traveler info
                </h1>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  We&apos;ll send your confirmation and trip pack here.
                </p>

                <label
                  htmlFor="name"
                  className="mt-6 block text-sm font-semibold"
                >
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Traveler"
                  className="mt-1 w-full rounded-xl border border-zinc-200 bg-white/80 px-3 py-2 text-sm outline-none focus:border-indigo-400 dark:border-zinc-700 dark:bg-black/30"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-rose-500">{errors.name}</p>
                )}

                <label
                  htmlFor="email"
                  className="mt-4 block text-sm font-semibold"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@example.com"
                  className="mt-1 w-full rounded-xl border border-zinc-200 bg-white/80 px-3 py-2 text-sm outline-none focus:border-indigo-400 dark:border-zinc-700 dark:bg-black/30"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-rose-500">{errors.email}</p>
                )}

                <label
                  htmlFor="phone"
                  className="mt-4 block text-sm font-semibold"
                >
                  Phone
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 555 123 4567"
                  className="mt-1 w-full rounded-xl border border-zinc-200 bg-white/80 px-3 py-2 text-sm outline-none focus:border-indigo-400 dark:border-zinc-700 dark:bg-black/30"
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-rose-500">{errors.phone}</p>
                )}

                <label
                  htmlFor="notes"
                  className="mt-4 block text-sm font-semibold"
                >
                  Special requests <span className="text-zinc-400">(optional)</span>
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Dietary needs, accessibility, celebrations…"
                  className="mt-1 w-full rounded-xl border border-zinc-200 bg-white/80 px-3 py-2 text-sm outline-none focus:border-indigo-400 dark:border-zinc-700 dark:bg-black/30"
                />
              </div>
            )}

            {step === 2 && (
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Review &amp; confirm
                </h1>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  Double-check everything before you confirm.
                </p>

                <dl className="mt-6 divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
                  {[
                    ["Tour", tour.title],
                    ["Destination", `${tour.destination}, ${tour.state}`],
                    ["Departure", date],
                    ["Travelers", String(travelers)],
                    ["Lead traveler", name],
                    ["Email", email],
                    ["Phone", phone],
                    [
                      "Add-ons",
                      [
                        addOns.insurance && "Insurance",
                        addOns.privateGuide && "Private guide",
                        addOns.airportTransfer && "Airport transfer",
                      ]
                        .filter(Boolean)
                        .join(", ") || "None",
                    ],
                    ["Special requests", notes.trim() || "None"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4 py-2">
                      <dt className="text-zinc-500 dark:text-zinc-400">{k}</dt>
                      <dd className="text-right font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {step === 3 && (
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Payment</h1>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  Pay securely with UPI. Scan the QR or use the UPI ID below.
                </p>

                <div className="mt-6 grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
                  {/* QR code */}
                  <div className="mx-auto rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700">
                    <QRCodeSVG
                      value={upiUri}
                      size={188}
                      level="M"
                      marginSize={1}
                    />
                    <p className="mt-2 text-center text-xs font-medium text-zinc-500">
                      Scan to pay {formatPrice(total)}
                    </p>
                  </div>

                  {/* UPI details */}
                  <div>
                    <p className="text-sm font-semibold">Pay to UPI ID</p>
                    <div className="mt-1 flex items-center gap-2">
                      <code className="flex-1 rounded-xl border border-zinc-200 bg-white/70 px-3 py-2 text-sm font-semibold dark:border-zinc-700 dark:bg-black/30">
                        {MERCHANT_UPI}
                      </code>
                      <button
                        type="button"
                        onClick={copyUpi}
                        className="rounded-xl border border-indigo-500/40 px-3 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50 dark:text-cyan-400 dark:hover:bg-white/5"
                      >
                        {copied ? "Copied!" : "Copy"}
                      </button>
                    </div>

                    <p className="mt-4 text-sm font-semibold">Pay using</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {["GPay", "PhonePe", "Paytm", "BHIM"].map((app) => (
                        <button
                          key={app}
                          type="button"
                          onClick={() => setUpiApp(app)}
                          className={
                            "rounded-full border px-3 py-1.5 text-sm font-medium transition " +
                            (upiApp === app
                              ? "border-transparent bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow"
                              : "border-zinc-200 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-white/5")
                          }
                        >
                          {app}
                        </button>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center justify-between rounded-xl border border-zinc-200 bg-white/60 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-black/20">
                      <span className="text-zinc-500 dark:text-zinc-400">
                        Amount payable
                      </span>
                      <span className="text-lg font-extrabold text-gradient-animated">
                        {formatPrice(total)}
                      </span>
                    </div>
                    <p className="mt-3 text-xs text-zinc-400">
                      Demo only — no real payment is processed. Reference{" "}
                      {reference}.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 text-3xl text-white shadow-lg">
                  ✓
                </div>
                <h1 className="mt-4 text-2xl font-bold tracking-tight">
                  Booking confirmed!
                </h1>
                <p className="mt-2 text-zinc-600 dark:text-zinc-300">
                  Thanks {name.split(" ")[0] || "traveler"} — your{" "}
                  {tour.title} adventure is reserved and your UPI payment of{" "}
                  <span className="font-semibold">{formatPrice(total)}</span> is
                  received. A confirmation has been sent to{" "}
                  <span className="font-semibold">{email}</span>.
                </p>
                <div className="mx-auto mt-5 inline-block rounded-2xl border border-zinc-200/70 bg-white/70 px-6 py-4 dark:border-zinc-800/70 dark:bg-black/20">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Booking reference
                  </p>
                  <p className="text-2xl font-extrabold tracking-widest text-gradient-animated">
                    {reference}
                  </p>
                </div>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Link
                    href="/tours"
                    className="lift rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-md"
                  >
                    Browse more tours
                  </Link>
                  <Link
                    href="/"
                    className="rounded-full border border-zinc-200 px-6 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-white/5"
                  >
                    Back home
                  </Link>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            {step < 4 && submitError && (
              <p className="mt-6 rounded-xl border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 dark:border-red-500/40 dark:bg-red-500/10">
                {submitError}
              </p>
            )}
            {step < 4 && (
              <div className="mt-8 flex items-center justify-between">
                <button
                  type="button"
                  onClick={goBack}
                  disabled={step === 0}
                  className="rounded-full border border-zinc-200 px-5 py-2.5 text-sm font-semibold text-zinc-700 transition enabled:hover:bg-zinc-50 disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-200 dark:enabled:hover:bg-white/5"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  disabled={submitting}
                  className="lift rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting
                    ? "Processing…"
                    : step === 2
                      ? "Proceed to payment"
                      : step === 3
                        ? `Pay ${formatPrice(total)} via ${upiApp}`
                        : "Continue"}
                </button>
              </div>
            )}
          </div>

          {/* Price summary */}
          <aside className="h-max lg:sticky lg:top-24">
            <div className="rounded-3xl border border-zinc-200/70 bg-white/70 p-6 backdrop-blur dark:border-zinc-800/70 dark:bg-black/20">
              <div
                className={`mb-4 flex items-center gap-3 rounded-2xl bg-gradient-to-br ${tour.gradient} p-3 text-white`}
              >
                <span className="text-3xl">{tour.emoji}</span>
                <div>
                  <p className="text-sm font-bold leading-tight">{tour.title}</p>
                  <p className="text-xs text-white/85">
                    {tour.durationDays} days
                  </p>
                </div>
              </div>

              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-zinc-500 dark:text-zinc-400">
                    {formatPrice(tour.price)} × {travelers}
                  </dt>
                  <dd className="font-medium">{formatPrice(baseTotal)}</dd>
                </div>
                {addOnsTotal > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-zinc-500 dark:text-zinc-400">
                      Add-ons × {travelers}
                    </dt>
                    <dd className="font-medium">
                      {formatPrice(addOnsTotal * travelers)}
                    </dd>
                  </div>
                )}
                <div className="mt-2 flex justify-between border-t border-zinc-200 pt-3 dark:border-zinc-800">
                  <dt className="font-bold">Total</dt>
                  <dd className="text-lg font-extrabold text-gradient-animated">
                    {formatPrice(total)}
                  </dd>
                </div>
              </dl>
              <p className="mt-3 text-xs text-zinc-400">
                No payment is taken in this demo.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
