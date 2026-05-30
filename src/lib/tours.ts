export type TourCategory =
  | "Hill Station"
  | "Beach"
  | "Spiritual"
  | "Wildlife"
  | "Heritage"
  | "Adventure";

export type ItineraryDay = {
  day: number;
  title: string;
  description: string;
};

export type Tour = {
  slug: string;
  title: string;
  destination: string;
  /** Indian state / union territory. */
  state: string;
  category: TourCategory;
  /** Price per person, in INR. */
  price: number;
  /** Trip length in days. */
  durationDays: number;
  rating: number;
  reviews: number;
  groupSize: number;
  /** Tailwind gradient classes used for the banner. */
  gradient: string;
  emoji: string;
  summary: string;
  highlights: string[];
  included: string[];
  itinerary: ItineraryDay[];
  featured?: boolean;
};

export const CATEGORIES: TourCategory[] = [
  "Hill Station",
  "Beach",
  "Spiritual",
  "Wildlife",
  "Heritage",
  "Adventure",
];

export const CATEGORY_EMOJI: Record<TourCategory, string> = {
  "Hill Station": "🏔️",
  Beach: "🏖️",
  Spiritual: "🛕",
  Wildlife: "🐯",
  Heritage: "🏰",
  Adventure: "🧗",
};

export const TOURS: Tour[] = [
  {
    slug: "darjeeling-queen-of-hills",
    title: "Darjeeling — Queen of the Hills",
    destination: "Darjeeling",
    state: "West Bengal",
    category: "Hill Station",
    price: 18500,
    durationDays: 5,
    rating: 4.8,
    reviews: 624,
    groupSize: 14,
    gradient: "from-emerald-400 via-teal-400 to-cyan-500",
    emoji: "⛰️",
    summary:
      "Toy-train rides, sunrise over Kangchenjunga and endless emerald tea gardens.",
    highlights: [
      "Tiger Hill sunrise over Kangchenjunga",
      "Darjeeling Himalayan toy train",
      "Happy Valley tea estate tour",
      "Batasia Loop & Peace Pagoda",
    ],
    included: [
      "4 nights hill-view hotel",
      "Daily breakfast",
      "All transfers in private cab",
      "Permits & sightseeing",
    ],
    itinerary: [
      { day: 1, title: "Arrival at NJP / Bagdogra", description: "Scenic drive up to Darjeeling and evening at the Mall Road." },
      { day: 2, title: "Tiger Hill Sunrise", description: "Early drive to Tiger Hill, then Ghoom Monastery and Batasia Loop." },
      { day: 3, title: "Tea & Toy Train", description: "Happy Valley tea garden and a joy ride on the heritage toy train." },
      { day: 4, title: "Local Sightseeing", description: "Peace Pagoda, Himalayan Zoo and Tenzing Rock." },
      { day: 5, title: "Departure", description: "Leisure morning and transfer to the plains." },
    ],
    featured: true,
  },
  {
    slug: "digha-seaside-getaway",
    title: "Digha Seaside Getaway",
    destination: "Digha",
    state: "West Bengal",
    category: "Beach",
    price: 7900,
    durationDays: 3,
    rating: 4.3,
    reviews: 489,
    groupSize: 20,
    gradient: "from-sky-400 via-blue-400 to-indigo-500",
    emoji: "🏖️",
    summary:
      "Bengal's favourite weekend beach — golden sands, sea breeze and fresh seafood.",
    highlights: [
      "Old & New Digha beaches",
      "Marine Aquarium & Science Centre",
      "Sunset at Udaipur beach",
      "Fresh seafood shacks",
    ],
    included: [
      "2 nights beach-side hotel",
      "Daily breakfast",
      "Bus / cab transfers",
      "Local sightseeing",
    ],
    itinerary: [
      { day: 1, title: "Arrival in Digha", description: "Check in and unwind on New Digha beach at sunset." },
      { day: 2, title: "Beach Hopping", description: "Marine Aquarium, Amaravati Park and Udaipur beach." },
      { day: 3, title: "Departure", description: "Morning by the sea and return journey." },
    ],
    featured: true,
  },
  {
    slug: "purulia-ajodhya-hills-trek",
    title: "Purulia & Ajodhya Hills Trek",
    destination: "Purulia",
    state: "West Bengal",
    category: "Adventure",
    price: 9500,
    durationDays: 3,
    rating: 4.5,
    reviews: 213,
    groupSize: 12,
    gradient: "from-orange-400 via-amber-500 to-rose-500",
    emoji: "🥾",
    summary:
      "Rugged plateau country — Ajodhya Hills, waterfalls and the flame of Palash blooms.",
    highlights: [
      "Ajodhya Hills sunrise point",
      "Bamni & Turga waterfalls",
      "Charida Chhau mask village",
      "Murguma dam & reservoir",
    ],
    included: [
      "2 nights resort stay",
      "Daily breakfast & dinner",
      "Off-road hill transfers",
      "Local trekking guide",
    ],
    itinerary: [
      { day: 1, title: "Arrival & Ajodhya Hills", description: "Drive into the plateau and settle at the hilltop resort." },
      { day: 2, title: "Waterfalls & Masks", description: "Bamni and Turga falls, Marble Lake and Charida mask village." },
      { day: 3, title: "Departure", description: "Sunrise point visit and return." },
    ],
    featured: true,
  },
  {
    slug: "benaras-spiritual-sojourn",
    title: "Benaras Spiritual Sojourn",
    destination: "Varanasi",
    state: "Uttar Pradesh",
    category: "Spiritual",
    price: 14200,
    durationDays: 4,
    rating: 4.9,
    reviews: 712,
    groupSize: 16,
    gradient: "from-amber-500 via-orange-600 to-rose-600",
    emoji: "🪔",
    summary:
      "The world's oldest living city — Ganga aarti, ancient ghats and timeless rituals.",
    highlights: [
      "Dashashwamedh Ganga aarti",
      "Sunrise boat ride on the Ganga",
      "Kashi Vishwanath Temple",
      "Sarnath Buddhist site",
    ],
    included: [
      "3 nights riverside hotel",
      "Daily breakfast",
      "Boat ride & aarti seating",
      "Guided heritage walk",
    ],
    itinerary: [
      { day: 1, title: "Arrival in Kashi", description: "Check in and evening Ganga aarti at Dashashwamedh Ghat." },
      { day: 2, title: "Sunrise on the Ganga", description: "Dawn boat ride along the ghats and temple darshan." },
      { day: 3, title: "Sarnath Excursion", description: "Day trip to Sarnath and the old-city silk lanes." },
      { day: 4, title: "Departure", description: "Final blessings and transfer out." },
    ],
    featured: true,
  },
  {
    slug: "puri-jagannath-dham",
    title: "Puri Jagannath Dham",
    destination: "Puri",
    state: "Odisha",
    category: "Spiritual",
    price: 12800,
    durationDays: 4,
    rating: 4.7,
    reviews: 538,
    groupSize: 18,
    gradient: "from-yellow-400 via-amber-500 to-orange-500",
    emoji: "🛕",
    summary:
      "Sacred Jagannath temple, the golden beach and the sun temple of Konark.",
    highlights: [
      "Jagannath Temple darshan",
      "Golden Puri sea beach",
      "Konark Sun Temple (UNESCO)",
      "Chilika Lake dolphins",
    ],
    included: [
      "3 nights sea-view hotel",
      "Daily breakfast",
      "Konark & Chilika transfers",
      "Temple guide assistance",
    ],
    itinerary: [
      { day: 1, title: "Arrival in Puri", description: "Check in and evening at the Puri beach." },
      { day: 2, title: "Temple & Town", description: "Jagannath darshan and local artisan markets." },
      { day: 3, title: "Konark & Chilika", description: "Sun Temple and dolphin spotting at Chilika Lake." },
      { day: 4, title: "Departure", description: "Sunrise on the beach and return." },
    ],
    featured: true,
  },
  {
    slug: "sikkim-gangtok-explorer",
    title: "Sikkim & Gangtok Explorer",
    destination: "Gangtok",
    state: "Sikkim",
    category: "Hill Station",
    price: 24900,
    durationDays: 6,
    rating: 4.9,
    reviews: 461,
    groupSize: 12,
    gradient: "from-cyan-400 via-sky-500 to-indigo-500",
    emoji: "🏔️",
    summary:
      "Himalayan monasteries, alpine lakes and the snow road to Nathula Pass.",
    highlights: [
      "Tsomgo Lake & Baba Mandir",
      "Nathula Pass (permit days)",
      "MG Marg & Rumtek Monastery",
      "Day trip to Lachung & Yumthang",
    ],
    included: [
      "5 nights hotels (Gangtok & Lachung)",
      "Daily breakfast & dinner",
      "Inner-line permits",
      "Private mountain transport",
    ],
    itinerary: [
      { day: 1, title: "Arrival in Gangtok", description: "Drive from NJP and evening at MG Marg." },
      { day: 2, title: "Tsomgo & Nathula", description: "Glacial lake, Baba Mandir and the Indo-China border pass." },
      { day: 3, title: "Gangtok to Lachung", description: "Scenic North Sikkim drive past waterfalls." },
      { day: 4, title: "Yumthang Valley", description: "Valley of Flowers and Zero Point snow fields." },
      { day: 5, title: "Monasteries", description: "Return to Gangtok via Rumtek and Ranka monasteries." },
      { day: 6, title: "Departure", description: "Transfer back to the plains." },
    ],
    featured: true,
  },
  {
    slug: "jaipur-pink-city-heritage",
    title: "Jaipur Pink City Heritage",
    destination: "Jaipur",
    state: "Rajasthan",
    category: "Heritage",
    price: 16500,
    durationDays: 4,
    rating: 4.6,
    reviews: 587,
    groupSize: 16,
    gradient: "from-rose-400 via-pink-500 to-fuchsia-500",
    emoji: "🏰",
    summary:
      "Majestic forts, royal palaces and vibrant bazaars of Rajasthan's capital.",
    highlights: [
      "Amber Fort & elephant gate",
      "Hawa Mahal & City Palace",
      "Jantar Mantar observatory",
      "Bapu Bazaar shopping",
    ],
    included: [
      "3 nights heritage hotel",
      "Daily breakfast",
      "AC car for sightseeing",
      "Monument guide",
    ],
    itinerary: [
      { day: 1, title: "Arrival in Jaipur", description: "Check in and evening at Chokhi Dhani." },
      { day: 2, title: "Forts of Amber", description: "Amber Fort, Jal Mahal and Jaigarh." },
      { day: 3, title: "City Palaces", description: "City Palace, Hawa Mahal and Jantar Mantar." },
      { day: 4, title: "Departure", description: "Bazaar shopping and transfer out." },
    ],
  },
  {
    slug: "goa-coastal-carnival",
    title: "Goa Coastal Carnival",
    destination: "Goa",
    state: "Goa",
    category: "Beach",
    price: 22000,
    durationDays: 5,
    rating: 4.5,
    reviews: 903,
    groupSize: 18,
    gradient: "from-amber-400 via-orange-400 to-red-500",
    emoji: "🌴",
    summary:
      "Sun, sand and susegad — North & South Goa beaches, forts and Portuguese charm.",
    highlights: [
      "Baga & Calangute beaches",
      "Aguada Fort sunset",
      "Old Goa churches",
      "Mandovi river cruise",
    ],
    included: [
      "4 nights beach resort",
      "Daily breakfast",
      "Airport transfers",
      "North & South Goa tours",
    ],
    itinerary: [
      { day: 1, title: "Arrival in Goa", description: "Check in and relax on the beach." },
      { day: 2, title: "North Goa", description: "Baga, Calangute, Aguada Fort and a river cruise." },
      { day: 3, title: "South Goa", description: "Colva, Old Goa churches and spice plantation." },
      { day: 4, title: "Free Day", description: "Water sports or a leisurely beach day." },
      { day: 5, title: "Departure", description: "Final swim and transfer to the airport." },
    ],
  },
  {
    slug: "sundarbans-tiger-trail",
    title: "Sundarbans Tiger Trail",
    destination: "Sundarbans",
    state: "West Bengal",
    category: "Wildlife",
    price: 13500,
    durationDays: 3,
    rating: 4.6,
    reviews: 276,
    groupSize: 12,
    gradient: "from-green-500 via-emerald-600 to-teal-700",
    emoji: "🐯",
    summary:
      "Cruise the world's largest mangrove delta in search of the Royal Bengal tiger.",
    highlights: [
      "Royal Bengal tiger habitat",
      "Mangrove launch cruise",
      "Sajnekhali watchtower",
      "Local Bonbibi folk culture",
    ],
    included: [
      "2 nights on launch / lodge",
      "All meals on tour",
      "Forest permits & fees",
      "Naturalist guide",
    ],
    itinerary: [
      { day: 1, title: "Godkhali to Delta", description: "Board the launch and cruise into the mangroves." },
      { day: 2, title: "Core Wildlife Zone", description: "Sajnekhali, Sudhanyakhali and Dobanki watchtowers." },
      { day: 3, title: "Return", description: "Morning cruise and journey back to Kolkata." },
    ],
  },
  {
    slug: "munnar-tea-country",
    title: "Munnar Tea Country",
    destination: "Munnar",
    state: "Kerala",
    category: "Hill Station",
    price: 27500,
    durationDays: 6,
    rating: 4.8,
    reviews: 418,
    groupSize: 14,
    gradient: "from-lime-400 via-green-500 to-emerald-600",
    emoji: "🍃",
    summary:
      "Rolling tea estates, misty peaks and spice gardens in God's Own Country.",
    highlights: [
      "Tea plantations & museum",
      "Eravikulam National Park",
      "Mattupetty dam & echo point",
      "Spice garden walk",
    ],
    included: [
      "5 nights hill resort",
      "Daily breakfast",
      "Cab for all transfers",
      "Sightseeing entries",
    ],
    itinerary: [
      { day: 1, title: "Arrival in Munnar", description: "Scenic drive through the Western Ghats." },
      { day: 2, title: "Tea Estates", description: "Tea museum, plantations and Photo Point." },
      { day: 3, title: "Eravikulam", description: "Nilgiri tahr park and Mattupetty dam." },
      { day: 4, title: "Top Station", description: "Panoramic views and Kundala Lake." },
      { day: 5, title: "Spice & Leisure", description: "Spice garden visit and free afternoon." },
      { day: 6, title: "Departure", description: "Transfer to Cochin." },
    ],
  },
  {
    slug: "leh-ladakh-expedition",
    title: "Leh-Ladakh High Desert Expedition",
    destination: "Leh",
    state: "Ladakh",
    category: "Adventure",
    price: 38900,
    durationDays: 7,
    rating: 4.9,
    reviews: 352,
    groupSize: 10,
    gradient: "from-indigo-500 via-violet-500 to-purple-600",
    emoji: "🏍️",
    summary:
      "Moonscapes, the world's highest passes and the surreal blue of Pangong Lake.",
    highlights: [
      "Pangong Tso lake",
      "Khardung La — top of the world",
      "Nubra Valley dunes & camels",
      "Thiksey & Hemis monasteries",
    ],
    included: [
      "6 nights hotels & camp",
      "Daily breakfast & dinner",
      "Inner-line permits",
      "Oxygen support & SUV",
    ],
    itinerary: [
      { day: 1, title: "Arrive in Leh", description: "Rest and acclimatise to the altitude." },
      { day: 2, title: "Leh Sightseeing", description: "Shanti Stupa, Leh Palace and local monasteries." },
      { day: 3, title: "Nubra Valley", description: "Drive over Khardung La to the Nubra dunes." },
      { day: 4, title: "Nubra to Pangong", description: "Shyok river route to the famous lake." },
      { day: 5, title: "Pangong Tso", description: "Sunrise by the lake and return to Leh." },
      { day: 6, title: "Monastery Trail", description: "Thiksey, Hemis and the magnetic hill." },
      { day: 7, title: "Departure", description: "Transfer to Leh airport." },
    ],
  },
  {
    slug: "andaman-island-voyage",
    title: "Andaman Island Voyage",
    destination: "Havelock",
    state: "Andaman & Nicobar",
    category: "Beach",
    price: 42000,
    durationDays: 6,
    rating: 4.8,
    reviews: 389,
    groupSize: 14,
    gradient: "from-teal-400 via-cyan-500 to-blue-500",
    emoji: "🏝️",
    summary:
      "Turquoise lagoons, coral reefs and the powder-white sands of Radhanagar beach.",
    highlights: [
      "Radhanagar beach (Asia's best)",
      "Scuba & snorkeling at Elephant beach",
      "Cellular Jail light & sound show",
      "Ross & North Bay islands",
    ],
    included: [
      "5 nights island hotels",
      "Daily breakfast",
      "Ferry & island transfers",
      "Snorkeling session",
    ],
    itinerary: [
      { day: 1, title: "Arrive in Port Blair", description: "Cellular Jail and the evening light & sound show." },
      { day: 2, title: "Ross & North Bay", description: "Island hopping and water sports." },
      { day: 3, title: "Ferry to Havelock", description: "Relax on the famed Radhanagar beach." },
      { day: 4, title: "Elephant Beach", description: "Snorkeling and coral reef exploration." },
      { day: 5, title: "Back to Port Blair", description: "Chidiya Tapu sunset point." },
      { day: 6, title: "Departure", description: "Transfer to the airport." },
    ],
  },
];

export const DESTINATIONS: string[] = Array.from(
  new Set(TOURS.map((t) => t.destination)),
).sort();

export function getTour(slug: string): Tour | undefined {
  return TOURS.find((t) => t.slug === slug);
}

export function getFeaturedTours(): Tour[] {
  return TOURS.filter((t) => t.featured);
}

export const PRICE_BOUNDS = {
  min: Math.min(...TOURS.map((t) => t.price)),
  max: Math.max(...TOURS.map((t) => t.price)),
};

export function formatPrice(value: number): string {
  return value.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
}
