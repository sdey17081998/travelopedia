"use client";

import React from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import SiteNav from "@/components/SiteNav";
import Reveal from "@/components/Reveal";
import TourCard from "@/components/TourCard";
import {
  CATEGORY_EMOJI,
  formatPrice,
  getTour,
  TOURS,
  type Tour,
} from "@/lib/tours";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-200/70 bg-white/70 px-4 py-3 text-center backdrop-blur dark:border-zinc-800/70 dark:bg-black/20">
      <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
        {value}
      </p>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">{label}</p>
    </div>
  );
}

export default function TourDetailPage() {
  const params = useParams<{ slug: string }>();
  const tour: Tour | undefined = getTour(params.slug);

  if (!tour) {
    notFound();
  }

  const related = TOURS.filter(
    (t) => t.category === tour.category && t.slug !== tour.slug,
  ).slice(0, 3);

  return (
    <div className="relative min-h-dvh font-sans text-zinc-900 dark:text-zinc-50">
      <SiteNav />

      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
          <Link href="/" className="hover:underline">
            Home
          </Link>{" "}
          /{" "}
          <Link href="/tours" className="hover:underline">
            Tours
          </Link>{" "}
          / <span className="text-zinc-800 dark:text-zinc-200">{tour.title}</span>
        </nav>

        {/* Banner */}
        <div
          className={`card-sheen relative flex h-56 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br ${tour.gradient} sm:h-72`}
        >
          <span className="text-8xl drop-shadow-xl">{tour.emoji}</span>
          <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-black/30 px-3 py-1 text-sm font-semibold text-white backdrop-blur">
            {CATEGORY_EMOJI[tour.category]} {tour.category}
          </span>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* Main content */}
          <div>
            <Reveal direction="up">
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                📍 {tour.destination}, {tour.state}
              </p>
              <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">
                {tour.title}
              </h1>
              <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-300">
                {tour.summary}
              </p>
            </Reveal>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat label="Duration" value={`${tour.durationDays} days`} />
              <Stat label="Rating" value={`★ ${tour.rating.toFixed(1)}`} />
              <Stat label="Group size" value={`${tour.groupSize} max`} />
              <Stat label="Reviews" value={`${tour.reviews}`} />
            </div>

            {/* Highlights */}
            <section className="mt-8">
              <h2 className="text-xl font-bold tracking-tight">Highlights</h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {tour.highlights.map((h) => (
                  <li
                    key={h}
                    className="flex items-start gap-2 text-zinc-700 dark:text-zinc-200"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Itinerary */}
            <section className="mt-8">
              <h2 className="text-xl font-bold tracking-tight">Itinerary</h2>
              <ol className="mt-4 space-y-4">
                {tour.itinerary.map((d, i) => (
                  <Reveal key={d.day} direction="left" delayMs={i * 50}>
                    <li className="flex gap-4 rounded-2xl border border-zinc-200/70 bg-white/60 p-4 backdrop-blur dark:border-zinc-800/70 dark:bg-black/20">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 text-sm font-bold text-white">
                        {d.day}
                      </div>
                      <div>
                        <p className="font-semibold">{d.title}</p>
                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                          {d.description}
                        </p>
                      </div>
                    </li>
                  </Reveal>
                ))}
              </ol>
            </section>

            {/* What's included */}
            <section className="mt-8">
              <h2 className="text-xl font-bold tracking-tight">
                What&apos;s included
              </h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {tour.included.map((inc) => (
                  <li
                    key={inc}
                    className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-200"
                  >
                    <span className="text-emerald-500">✓</span> {inc}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Booking sidebar */}
          <aside className="h-max lg:sticky lg:top-24">
            <div className="card-sheen rounded-3xl border border-zinc-200/70 bg-white/70 p-6 backdrop-blur dark:border-zinc-800/70 dark:bg-black/20">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                From, per person
              </p>
              <p className="text-4xl font-extrabold text-gradient-animated">
                {formatPrice(tour.price)}
              </p>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {tour.durationDays} days · {tour.category} tour
              </p>

              <Link
                href={`/book/${tour.slug}`}
                className="lift mt-5 block rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 px-6 py-3 text-center text-sm font-semibold text-white shadow-md hover:shadow-lg"
              >
                Book this tour
              </Link>
              <Link
                href="/tours"
                className="mt-3 block rounded-full border border-zinc-200 px-6 py-3 text-center text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-white/5"
              >
                Back to all tours
              </Link>

              <p className="mt-4 text-center text-xs text-zinc-400">
                Free cancellation up to 30 days before departure.
              </p>
            </div>
          </aside>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="text-2xl font-bold tracking-tight">
              Similar {tour.category.toLowerCase()} tours
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((t, i) => (
                <Reveal key={t.slug} direction="up" delayMs={i * 70}>
                  <TourCard tour={t} />
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
