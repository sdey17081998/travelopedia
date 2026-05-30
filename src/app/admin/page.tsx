import React from "react";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/tours";

export const dynamic = "force-dynamic";

function fmtDate(d: Date): string {
  return new Date(d).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function AdminPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: { transactions: true },
  });
  const txnCount = bookings.reduce((n, b) => n + b.transactions.length, 0);

  return (
    <div className="relative min-h-dvh font-sans text-zinc-900 dark:text-zinc-50">
      <SiteNav />
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Bookings &amp; transactions
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {bookings.length} booking{bookings.length === 1 ? "" : "s"} ·{" "}
              {txnCount} transaction{txnCount === 1 ? "" : "s"} logged in the
              database.
            </p>
          </div>
          <Link
            href="/tours"
            className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-white/5"
          >
            Back to tours
          </Link>
        </div>

        {bookings.length === 0 ? (
          <p className="mt-10 rounded-2xl border border-dashed border-zinc-300 p-10 text-center text-zinc-500 dark:border-zinc-700">
            No bookings yet. Complete a booking to see it logged here.
          </p>
        ) : (
          <div className="mt-6 space-y-4">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="rounded-2xl border border-zinc-200/70 bg-white/70 p-5 backdrop-blur dark:border-zinc-800/70 dark:bg-black/20"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-bold">{b.tourTitle}</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {b.destination}
                      {b.state ? `, ${b.state}` : ""} · {b.travelers} traveler
                      {b.travelers === 1 ? "" : "s"} · {b.departure}
                    </p>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                      {b.name} · {b.email} · {b.phone}
                    </p>
                    {b.addOns && (
                      <p className="mt-1 text-xs text-zinc-400">
                        Add-ons: {b.addOns}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm font-semibold">
                      {b.reference}
                    </p>
                    <p className="text-lg font-extrabold text-gradient-animated">
                      {formatPrice(b.total)}
                    </p>
                    <span
                      className={
                        "inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold " +
                        (b.status === "confirmed"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300")
                      }
                    >
                      {b.status}
                    </span>
                    <p className="mt-1 text-xs text-zinc-400">
                      {fmtDate(b.createdAt)}
                    </p>
                  </div>
                </div>

                {b.transactions.length > 0 && (
                  <div className="mt-4 border-t border-zinc-200 pt-3 dark:border-zinc-800">
                    <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                      Transactions
                    </p>
                    <ul className="mt-2 space-y-1">
                      {b.transactions.map((t) => (
                        <li
                          key={t.id}
                          className="flex flex-wrap items-center justify-between gap-2 text-sm"
                        >
                          <span className="text-zinc-600 dark:text-zinc-300">
                            {t.method} · {t.upiApp} · {t.upiId}
                          </span>
                          <span className="flex items-center gap-3">
                            <span className="font-semibold">
                              {formatPrice(t.amount)}
                            </span>
                            <span
                              className={
                                "rounded-full px-2 py-0.5 text-xs font-semibold " +
                                (t.status === "success"
                                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                                  : "bg-zinc-100 text-zinc-600 dark:bg-white/10 dark:text-zinc-300")
                              }
                            >
                              {t.status}
                            </span>
                            <span className="text-xs text-zinc-400">
                              {fmtDate(t.createdAt)}
                            </span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
