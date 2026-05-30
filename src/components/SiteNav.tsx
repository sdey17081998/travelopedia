"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/tours", label: "Tours" },
  { href: "/#destinations", label: "Destinations" },
  { href: "/#contact", label: "Contact" },
];

export default function SiteNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="sticky top-0 z-50">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div
          className={
            "mt-3 flex items-center justify-between rounded-2xl border px-4 py-3 backdrop-blur transition-all duration-300 " +
            (scrolled
              ? "border-zinc-200/80 bg-white/80 shadow-lg dark:border-zinc-800/80 dark:bg-black/40"
              : "border-zinc-200/60 bg-white/50 dark:border-zinc-800/60 dark:bg-black/20")
          }
        >
          <Link href="/" className="group flex items-center gap-3">
            <div className="animate-pulse-glow flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/30 via-cyan-400/20 to-emerald-500/20 ring-1 ring-indigo-500/30 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
              <span className="text-lg">🌍</span>
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight">Travelopedia</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Tours &amp; Travel
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 sm:flex">
            {links.map((l) => {
              const active =
                l.href === pathname ||
                (l.href === "/tours" && pathname.startsWith("/tours"));
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={
                    "link-underline rounded-full px-4 py-2 text-sm font-semibold transition-colors " +
                    (active
                      ? "text-indigo-600 dark:text-cyan-400"
                      : "text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white")
                  }
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <Link
            href="/tours"
            className="lift rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:shadow-lg"
          >
            Book now
          </Link>
        </div>
      </div>
    </div>
  );
}
