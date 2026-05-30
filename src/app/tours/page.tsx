"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SiteNav from "@/components/SiteNav";
import TourCard from "@/components/TourCard";
import Reveal from "@/components/Reveal";
import {
  CATEGORIES,
  CATEGORY_EMOJI,
  DESTINATIONS,
  formatPrice,
  PRICE_BOUNDS,
  TOURS,
  type TourCategory,
} from "@/lib/tours";

type SortKey = "popular" | "price-asc" | "price-desc" | "rating" | "duration";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "popular", label: "Most popular" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Highest rated" },
  { value: "duration", label: "Duration" },
];

function ToursExplorer() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = React.useState(searchParams.get("q") ?? "");
  const [category, setCategory] = React.useState<TourCategory | "all">(
    (searchParams.get("category") as TourCategory | null) ?? "all",
  );
  const [destination, setDestination] = React.useState<string>(
    searchParams.get("destination") ?? "all",
  );
  const [maxPrice, setMaxPrice] = React.useState<number>(PRICE_BOUNDS.max);
  const [maxDuration, setMaxDuration] = React.useState<number>(0); // 0 = any
  const [sort, setSort] = React.useState<SortKey>("popular");

  // Keep the URL query string in sync so results are shareable.
  React.useEffect(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (category !== "all") params.set("category", category);
    if (destination !== "all") params.set("destination", destination);
    const qs = params.toString();
    router.replace(`/tours${qs ? `?${qs}` : ""}`, { scroll: false });
  }, [query, category, destination, router]);

  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = TOURS.filter((t) => {
      const matchesQuery =
        !q ||
        t.title.toLowerCase().includes(q) ||
        t.destination.toLowerCase().includes(q) ||
        t.state.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.summary.toLowerCase().includes(q);
      const matchesCategory = category === "all" || t.category === category;
      const matchesDestination =
        destination === "all" || t.destination === destination;
      const matchesPrice = t.price <= maxPrice;
      const matchesDuration = maxDuration === 0 || t.durationDays <= maxDuration;
      return (
        matchesQuery &&
        matchesCategory &&
        matchesDestination &&
        matchesPrice &&
        matchesDuration
      );
    });

    const sorted = [...filtered];
    switch (sort) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "duration":
        sorted.sort((a, b) => a.durationDays - b.durationDays);
        break;
      default:
        sorted.sort((a, b) => b.reviews - a.reviews);
    }
    return sorted;
  }, [query, category, destination, maxPrice, maxDuration, sort]);

  const resetFilters = () => {
    setQuery("");
    setCategory("all");
    setDestination("all");
    setMaxPrice(PRICE_BOUNDS.max);
    setMaxDuration(0);
    setSort("popular");
  };

  const activeFilters =
    (query.trim() ? 1 : 0) +
    (category !== "all" ? 1 : 0) +
    (destination !== "all" ? 1 : 0) +
    (maxPrice < PRICE_BOUNDS.max ? 1 : 0) +
    (maxDuration !== 0 ? 1 : 0);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="card-sheen relative mb-6 overflow-hidden rounded-3xl border border-zinc-200/70 bg-white/60 p-6 backdrop-blur dark:border-zinc-800/70 dark:bg-black/20 sm:p-8">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Explore <span className="text-gradient-animated">all tours</span>
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-300">
          Search and filter {TOURS.length} curated trips across India to find
          your perfect match.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Filters */}
        <aside className="h-max rounded-2xl border border-zinc-200/70 bg-white/70 p-5 backdrop-blur dark:border-zinc-800/70 dark:bg-black/20 lg:sticky lg:top-24">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Filters {activeFilters > 0 && `(${activeFilters})`}
            </h2>
            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-indigo-600 hover:underline dark:text-cyan-400"
            >
              Reset
            </button>
          </div>

          <label className="mt-4 block text-xs font-semibold text-zinc-600 dark:text-zinc-300">
            Search
          </label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Keyword…"
            aria-label="Search keyword"
            className="mt-1 w-full rounded-xl border border-zinc-200 bg-white/80 px-3 py-2 text-sm outline-none focus:border-indigo-400 dark:border-zinc-700 dark:bg-black/30"
          />

          <label className="mt-4 block text-xs font-semibold text-zinc-600 dark:text-zinc-300">
            Category
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              onClick={() => setCategory("all")}
              className={
                "rounded-full px-3 py-1.5 text-xs font-semibold transition " +
                (category === "all"
                  ? "bg-indigo-500 text-white"
                  : "border border-zinc-200 bg-white/70 text-zinc-700 dark:border-zinc-700 dark:bg-black/20 dark:text-zinc-200")
              }
            >
              All
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={
                  "rounded-full px-3 py-1.5 text-xs font-semibold transition " +
                  (category === c
                    ? "bg-indigo-500 text-white"
                    : "border border-zinc-200 bg-white/70 text-zinc-700 dark:border-zinc-700 dark:bg-black/20 dark:text-zinc-200")
                }
              >
                {CATEGORY_EMOJI[c]} {c}
              </button>
            ))}
          </div>

          <label
            htmlFor="destination"
            className="mt-4 block text-xs font-semibold text-zinc-600 dark:text-zinc-300"
          >
            Destination
          </label>
          <select
            id="destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="mt-1 w-full rounded-xl border border-zinc-200 bg-white/80 px-3 py-2 text-sm outline-none focus:border-indigo-400 dark:border-zinc-700 dark:bg-black/30"
          >
            <option value="all">All destinations</option>
            {DESTINATIONS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <label
            htmlFor="maxPrice"
            className="mt-4 block text-xs font-semibold text-zinc-600 dark:text-zinc-300"
          >
            Max price: {formatPrice(maxPrice)}
          </label>
          <input
            id="maxPrice"
            type="range"
            min={PRICE_BOUNDS.min}
            max={PRICE_BOUNDS.max}
            step={500}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="mt-2 w-full accent-indigo-500"
          />

          <label
            htmlFor="maxDuration"
            className="mt-4 block text-xs font-semibold text-zinc-600 dark:text-zinc-300"
          >
            Max duration
          </label>
          <select
            id="maxDuration"
            value={maxDuration}
            onChange={(e) => setMaxDuration(Number(e.target.value))}
            className="mt-1 w-full rounded-xl border border-zinc-200 bg-white/80 px-3 py-2 text-sm outline-none focus:border-indigo-400 dark:border-zinc-700 dark:bg-black/30"
          >
            <option value={0}>Any length</option>
            <option value={3}>Up to 3 days</option>
            <option value={5}>Up to 5 days</option>
            <option value={7}>Up to 7 days</option>
          </select>
        </aside>

        {/* Results */}
        <section>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              <span className="font-bold text-zinc-900 dark:text-zinc-50">
                {results.length}
              </span>{" "}
              {results.length === 1 ? "tour" : "tours"} found
            </p>
            <div className="flex items-center gap-2">
              <label
                htmlFor="sort"
                className="text-sm text-zinc-500 dark:text-zinc-400"
              >
                Sort by
              </label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="rounded-xl border border-zinc-200 bg-white/80 px-3 py-2 text-sm outline-none focus:border-indigo-400 dark:border-zinc-700 dark:bg-black/30"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {results.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-white/60 p-12 text-center dark:border-zinc-700 dark:bg-black/20">
              <p className="text-4xl">🧭</p>
              <p className="mt-3 font-semibold">No tours match your filters</p>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Try widening your price range or clearing some filters.
              </p>
              <button
                onClick={resetFilters}
                className="lift mt-4 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 px-5 py-2 text-sm font-semibold text-white"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((tour, i) => (
                <Reveal key={tour.slug} direction="up" delayMs={(i % 3) * 70}>
                  <TourCard tour={tour} />
                </Reveal>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default function ToursPage() {
  return (
    <div className="relative min-h-dvh font-sans text-zinc-900 dark:text-zinc-50">
      <SiteNav />
      <Suspense
        fallback={
          <div className="mx-auto w-full max-w-6xl px-4 py-16 text-center text-zinc-500">
            Loading tours…
          </div>
        }
      >
        <ToursExplorer />
      </Suspense>
    </div>
  );
}
