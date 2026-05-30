"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CATEGORY_EMOJI, formatPrice, tourImage, type Tour } from "@/lib/tours";
import TiltCard from "@/components/TiltCard";

export default function TourCard({ tour }: { tour: Tour }) {
  return (
    <TiltCard className="card-sheen spotlight group h-full overflow-hidden rounded-2xl border border-zinc-200/70 bg-white/70 backdrop-blur hover:shadow-2xl hover:shadow-indigo-500/10 dark:border-zinc-800/70 dark:bg-black/20">
      <Link href={`/tours/${tour.slug}`} className="flex h-full flex-col">
        <div
          className={`relative flex h-44 items-center justify-center overflow-hidden bg-gradient-to-br ${tour.gradient}`}
        >
          <Image
            src={tourImage(tour)}
            alt={`${tour.destination}, ${tour.state}`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
            {CATEGORY_EMOJI[tour.category]} {tour.category}
          </span>
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-amber-600 shadow">
            ★ {tour.rating.toFixed(1)}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            📍 {tour.destination}, {tour.state}
          </p>
          <h3 className="mt-1 text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {tour.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-300">
            {tour.summary}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
            <span>🗓️ {tour.durationDays} days</span>
            <span>👥 max {tour.groupSize}</span>
            <span>💬 {tour.reviews} reviews</span>
          </div>

          <div className="mt-auto flex items-end justify-between pt-4">
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">from</p>
              <p className="text-xl font-extrabold text-gradient-animated">
                {formatPrice(tour.price)}
              </p>
            </div>
            <span className="rounded-full border border-indigo-500/40 px-3 py-1.5 text-sm font-semibold text-indigo-600 dark:text-cyan-400">
              View details →
            </span>
          </div>
        </div>
      </Link>
    </TiltCard>
  );
}
