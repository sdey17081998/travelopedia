# Travelopedia 🌍

A tour & travel web app for **Indian tourism**, built with **Next.js 16**, **React 19** and
**Tailwind CSS v4**. Browse curated trips across India, search & filter them, view rich tour
detail pages and complete a multi-step booking flow. All prices are in **INR (₹)**.

## Features

- **Landing page** — hero with instant search, category shortcuts, featured tours, popular
  destinations and stats.
- **Tour catalogue** (`/tours`) — live **search**, filter by **category / destination /
  max price / duration**, and **sort** by popularity, price, rating or duration. Filter state
  is reflected in the URL so results are shareable.
- **Tour detail** (`/tours/[slug]`) — highlights, day-by-day itinerary, what's included and a
  sticky booking card.
- **Booking flow** (`/book/[slug]`) — 3 steps (trip details → traveler info → review) plus a
  confirmation screen with a generated booking reference and a live price breakdown
  (travelers + add-ons).

Sample destinations include Darjeeling, Digha, Purulia, Varanasi (Benaras), Puri, Sikkim,
Jaipur, Goa, Sundarbans, Munnar, Leh-Ladakh and the Andamans.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command         | Description                  |
| --------------- | ---------------------------- |
| `npm run dev`   | Start the dev server         |
| `npm run build` | Production build             |
| `npm run start` | Run the production build      |
| `npm run lint`  | Lint with ESLint             |

## Project structure

```
src/
  app/
    page.tsx              # Landing page
    tours/page.tsx        # Catalogue with search/filter/sort
    tours/[slug]/page.tsx # Tour detail
    book/[slug]/page.tsx  # Booking flow + confirmation
  components/             # SiteNav, TourCard, Reveal, TiltCard, Counter
  lib/tours.ts            # Tour data model, sample tours, helpers (INR)
```

> Note: this is a front-end demo — bookings are simulated client-side and no payment is taken.
