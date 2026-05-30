"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SiteNav from "@/components/SiteNav";
import TourCard from "@/components/TourCard";
import Reveal from "@/components/Reveal";
import Counter from "@/components/Counter";
import {
  CATEGORIES,
  CATEGORY_EMOJI,
  DESTINATIONS,
  getFeaturedTours,
  TOURS,
} from "@/lib/tours";

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const featured = getFeaturedTours();

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    router.push(`/tours${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <div className="relative min-h-dvh font-sans text-zinc-900 dark:text-zinc-50">
      <SiteNav />

      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Hero */}
        <header className="card-sheen relative overflow-hidden rounded-3xl border border-zinc-200/70 bg-white/60 p-6 backdrop-blur dark:border-zinc-800/70 dark:bg-black/20 sm:p-12">
          <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-indigo-400/15 blur-2xl animate-floaty" />
          <div className="pointer-events-none absolute -right-24 -top-10 h-64 w-64 rounded-full bg-cyan-400/15 blur-2xl animate-floaty" />

          <div className="relative max-w-3xl">
            <Reveal direction="left">
              <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200/70 bg-white/70 px-3 py-1 text-sm font-medium text-zinc-700 shadow-sm dark:border-zinc-800 dark:bg-black/20 dark:text-zinc-200">
                ✈️ {TOURS.length} curated trips across incredible India
              </span>
            </Reveal>
            <Reveal direction="left" delayMs={80}>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-6xl">
                Find your next{" "}
                <span className="text-gradient-animated">adventure</span>
              </h1>
            </Reveal>
            <Reveal direction="left" delayMs={160}>
              <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-300">
                Hand-crafted tours with expert local guides. Search, compare and
                book your dream getaway in minutes.
              </p>
            </Reveal>

            <Reveal direction="up" delayMs={240}>
              <form
                onSubmit={search}
                className="mt-6 flex flex-col gap-2 rounded-2xl border border-zinc-200/70 bg-white/80 p-2 shadow-lg dark:border-zinc-800/70 dark:bg-black/30 sm:flex-row"
              >
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search destinations, e.g. Darjeeling, Puri, Sikkim…"
                  aria-label="Search tours"
                  className="flex-1 rounded-xl bg-transparent px-4 py-3 text-sm outline-none placeholder:text-zinc-400"
                />
                <button
                  type="submit"
                  className="lift rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-md hover:shadow-lg"
                >
                  Search tours
                </button>
              </form>
            </Reveal>

            <div className="mt-4 flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <Link
                  key={c}
                  href={`/tours?category=${encodeURIComponent(c)}`}
                  className="lift rounded-full border border-zinc-200 bg-white/70 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:shadow-md dark:border-zinc-800 dark:bg-black/20 dark:text-zinc-200"
                >
                  {CATEGORY_EMOJI[c]} {c}
                </Link>
              ))}
            </div>
          </div>
        </header>

        {/* Stats */}
        <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Destinations", value: DESTINATIONS.length, suffix: "+" },
            { label: "Happy travelers", value: 12000, suffix: "+" },
            { label: "Avg. rating", value: 0, suffix: "", literal: "4.8/5" },
            { label: "Years of trips", value: 14, suffix: "" },
          ].map((s, i) => (
            <Reveal key={s.label} direction="up" delayMs={i * 70}>
              <div className="rounded-2xl border border-zinc-200/70 bg-white/60 p-5 text-center backdrop-blur dark:border-zinc-800/70 dark:bg-black/20">
                <p className="text-3xl font-extrabold text-gradient-animated">
                  {s.literal ?? (
                    <>
                      <Counter to={s.value} />
                      {s.suffix}
                    </>
                  )}
                </p>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {s.label}
                </p>
              </div>
            </Reveal>
          ))}
        </section>

        {/* Featured tours */}
        <section className="mt-12">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Featured tours
              </h2>
              <p className="mt-1 text-zinc-600 dark:text-zinc-300">
                Our travelers&apos; most-loved escapes.
              </p>
            </div>
            <Link
              href="/tours"
              className="link-underline hidden text-sm font-semibold text-indigo-600 dark:text-cyan-400 sm:block"
            >
              View all tours →
            </Link>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((tour, i) => (
              <Reveal key={tour.slug} direction="up" delayMs={i * 80}>
                <TourCard tour={tour} />
              </Reveal>
            ))}
          </div>
        </section>

        {/* Destinations */}
        <section id="destinations" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Popular destinations
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TOURS.map((tour, i) => (
              <Reveal key={tour.slug} direction="up" delayMs={i * 40}>
                <Link
                  href={`/tours/${tour.slug}`}
                  className={`lift card-sheen flex items-center gap-4 overflow-hidden rounded-2xl border border-zinc-200/70 bg-gradient-to-r ${tour.gradient} p-4 text-white shadow-md`}
                >
                  <span className="text-4xl">{tour.emoji}</span>
                  <div>
                    <p className="font-bold">{tour.destination}</p>
                    <p className="text-sm text-white/85">{tour.state}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Contact / CTA */}
        <section
          id="contact"
          className="mt-14 scroll-mt-24 overflow-hidden rounded-3xl border border-zinc-200/70 bg-white/60 p-8 text-center backdrop-blur dark:border-zinc-800/70 dark:bg-black/20 sm:p-12"
        >
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Ready to pack your bags?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-zinc-600 dark:text-zinc-300">
            Browse the full catalogue and lock in your spot today. Free
            cancellation up to 30 days before departure.
          </p>
          <Link
            href="/tours"
            className="lift mt-6 inline-block rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 px-8 py-3 text-sm font-semibold text-white shadow-md hover:shadow-lg"
          >
            Explore all tours
          </Link>
        </section>

        <footer className="mt-12 border-t border-zinc-200/70 py-8 text-center text-sm text-zinc-500 dark:border-zinc-800/70 dark:text-zinc-400">
          🌍 Travelopedia — Tours &amp; Travel. Built with Next.js.
        </footer>
      </div>
    </div>
  );
}
