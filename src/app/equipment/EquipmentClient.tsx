"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Search, X, Star as StarIcon } from "lucide-react";
import {
  EQUIPMENT_ITEMS,
  EQUIPMENT_CATEGORIES,
  getAffiliateUrl,
  getVendorLabel,
  type EquipmentItem,
} from "@/data/equipment";
import { isPro } from "@/lib/tier";

function getCategoryIcon(category: string): { svg: React.ReactNode; color: string; label: string } {
  const icons: Record<string, { svg: React.ReactNode; color: string }> = {
    "Training Courses": {
      color: "text-indigo-500",
      svg: (
        <svg viewBox="0 0 24 24" className="w-12 h-12 opacity-60" fill="currentColor">
          <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
        </svg>
      ),
    },
    "Aviation Tools & Apps": {
      color: "text-sky-500",
      svg: (
        <svg viewBox="0 0 24 24" className="w-12 h-12 opacity-60" fill="currentColor">
          <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
        </svg>
      ),
    },
    "Headsets": {
      color: "text-violet-500",
      svg: (
        <svg viewBox="0 0 24 24" className="w-12 h-12 opacity-60" fill="currentColor">
          <path d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z"/>
        </svg>
      ),
    },
    "Flight Bags": {
      color: "text-amber-500",
      svg: (
        <svg viewBox="0 0 24 24" className="w-12 h-12 opacity-60" fill="currentColor">
          <path d="M20 7h-4V5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM10 5h4v2h-4V5z"/>
        </svg>
      ),
    },
    "Books & Study Materials": {
      color: "text-emerald-500",
      svg: (
        <svg viewBox="0 0 24 24" className="w-12 h-12 opacity-60" fill="currentColor">
          <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"/>
        </svg>
      ),
    },
    "Logbooks & Flashcards": {
      color: "text-teal-500",
      svg: (
        <svg viewBox="0 0 24 24" className="w-12 h-12 opacity-60" fill="currentColor">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2zm0-4H7V7h10v2z"/>
        </svg>
      ),
    },
    "Electronics & Tablets": {
      color: "text-blue-500",
      svg: (
        <svg viewBox="0 0 24 24" className="w-12 h-12 opacity-60" fill="currentColor">
          <path d="M18.5 0h-14C3.12 0 2 1.12 2 2.5v19C2 22.88 3.12 24 4.5 24h14c1.38 0 2.5-1.12 2.5-2.5v-19C21 1.12 19.88 0 18.5 0zm-7 23c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm7.5-4H4V3h15v16z"/>
        </svg>
      ),
    },
    "Tablet & Cockpit Accessories": {
      color: "text-slate-500",
      svg: (
        <svg viewBox="0 0 24 24" className="w-12 h-12 opacity-60" fill="currentColor">
          <path d="M3 3v8h8V3H3zm6 6H5V5h4v4zm-6 4v8h8v-8H3zm6 6H5v-4h4v4zm4-16v8h8V3h-8zm6 6h-4V5h4v4zm-6 4v8h8v-8h-8zm6 6h-4v-4h4v4z"/>
        </svg>
      ),
    },
    "Radios & Intercoms": {
      color: "text-orange-500",
      svg: (
        <svg viewBox="0 0 24 24" className="w-12 h-12 opacity-60" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
        </svg>
      ),
    },
    "Preflight & Safety": {
      color: "text-red-500",
      svg: (
        <svg viewBox="0 0 24 24" className="w-12 h-12 opacity-60" fill="currentColor">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
        </svg>
      ),
    },
    "Clothing & Sun Protection": {
      color: "text-yellow-500",
      svg: (
        <svg viewBox="0 0 24 24" className="w-12 h-12 opacity-60" fill="currentColor">
          <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"/>
        </svg>
      ),
    },
    "Calculators & Instruments": {
      color: "text-cyan-500",
      svg: (
        <svg viewBox="0 0 24 24" className="w-12 h-12 opacity-60" fill="currentColor">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7.5 4.5h5v2h-5v-2zM8 17.5H6v-2h2v2zm0-3H6v-2h2v2zm0-3H6v-2h2v2zm8.5 6h-5v-2h5v2zm0-3h-5v-2h5v2zm0-3h-5v-2h5v2z"/>
        </svg>
      ),
    },
  };

  const entry = icons[category];
  if (entry) return { ...entry, label: category };
  // Fallback: generic plane icon
  return {
    color: "text-muted-foreground",
    label: category,
    svg: (
      <svg viewBox="0 0 24 24" className="w-12 h-12 opacity-60" fill="currentColor">
        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
      </svg>
    ),
  };
}

function StarRating({
  itemId,
  isProUser,
}: {
  itemId: string;
  isProUser: boolean;
}) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  if (!isProUser) {
    return (
      <Link
        href="/pricing"
        className="group relative flex items-center gap-0.5"
        title="Pro feature"
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className="h-4 w-4 text-muted-foreground/20 group-hover:text-muted-foreground/40 transition-colors"
          />
        ))}
        <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-foreground text-background text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          Pro feature
        </span>
      </Link>
    );
  }

  if (submitted) {
    return <span className="text-xs text-primary">Thanks for rating!</span>;
  }

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={async () => {
            setRating(star);
            setSubmitted(true);
            await fetch("/api/ratings", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                targetType: "equipment",
                itemId,
                score: star,
                body: `Rated ${star}/5`,
              }),
            });
          }}
          className="transition-colors"
        >
          <StarIcon className={`h-4 w-4 ${star <= (hover || rating) ? "text-primary fill-primary" : "text-muted-foreground/30"}`} />
        </button>
      ))}
      <span className="text-xs text-muted-foreground ml-1">Rate</span>
    </div>
  );
}

function ItemCard({
  item,
  isProUser,
}: {
  item: EquipmentItem;
  isProUser: boolean;
}) {
  const url = getAffiliateUrl(item);
  const [imgFailed, setImgFailed] = useState(false);

  // Only use self-hosted or explicitly licensed imageUrl values.
  // Never hotlink third-party CDNs (Amazon, retailer CDNs, etc.) — TOS violation.
  const imgSrc = item.imageUrl ?? null;

  return (
    <div className="relative rounded-lg border border-border bg-card overflow-hidden hover:border-primary/40 hover:shadow-lg transition-all duration-200 flex flex-col">

      {/* Product image */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="relative block h-44 bg-muted flex items-center justify-center overflow-hidden"
      >
        {item.vendor === "sportys" && (
          <div className="absolute top-2 left-2 bg-blue-700/90 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded z-10">
            Sporty&apos;s
          </div>
        )}
        {imgSrc && !imgFailed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imgSrc}
            alt={item.name}
            className="h-full w-full object-contain p-3"
            onError={() => setImgFailed(true)}
          />
        ) : item.vendor === "sportys" ? (
          <div className="flex flex-col items-center gap-2 text-blue-700">
            <svg viewBox="0 0 24 24" className="w-12 h-12 opacity-60" fill="currentColor">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
            </svg>
            <span className="text-xs font-medium text-blue-700/70">Sporty&apos;s Pilot Shop</span>
          </div>
        ) : (() => {
          const icon = getCategoryIcon(item.category);
          return (
            <div className={`flex flex-col items-center gap-2 ${icon.color}`}>
              {icon.svg}
              <span className={`text-xs font-medium ${icon.color} opacity-70`}>{icon.label}</span>
            </div>
          );
        })()}
      </a>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-sm font-medium mb-1 leading-snug">{item.name}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed flex-1 mb-3">
          {item.description}
        </p>

        <div className="flex items-center justify-between gap-2 mt-auto">
          <StarRating itemId={item.id} isProUser={isProUser} />

          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            data-asin={item.asin}
            className={`shrink-0 text-xs rounded px-2.5 py-1.5 transition-colors ${
              item.vendor === "sportys"
                ? "bg-blue-700 text-white hover:bg-blue-800"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            {getVendorLabel(item)}
          </a>
        </div>
      </div>
    </div>
  );
}

function SuggestModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    await fetch("/api/equipment/suggest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, category, description, url }),
    });
    setStatus("done");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-xl">
        <h2 className="text-lg font-semibold mb-1">Suggest Equipment</h2>
        <p className="text-xs text-muted-foreground mb-4">
          Know a great piece of gear we&apos;re missing? Let us know.
        </p>

        {status === "done" ? (
          <div className="py-6 text-center">
            <p className="text-sm font-medium text-primary mb-1">Thanks for the suggestion!</p>
            <p className="text-xs text-muted-foreground mb-4">We&apos;ll review it and add it if it&apos;s a good fit.</p>
            <button onClick={onClose} className="text-xs rounded px-3 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1">Item name <span className="text-destructive">*</span></label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Garmin aera 760 GPS"
                className="w-full rounded border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">— select a category —</option>
                {EQUIPMENT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Why should we add it?</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Brief description of what it is and why pilots need it..."
                className="w-full rounded border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Link to product <span className="text-destructive">*</span></label>
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                type="url"
                required
                placeholder="https://..."
                className="w-full rounded border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="text-xs rounded px-3 py-1.5 border border-border text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={status === "submitting" || !name.trim() || !url.trim()}
                className="text-xs rounded px-3 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {status === "submitting" ? "Sending…" : "Submit Suggestion"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function EquipmentClient() {
  const { data: session } = useSession();
  const isProUser = isPro(session);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [showSuggest, setShowSuggest] = useState(false);

  const categories = ["All", ...EQUIPMENT_CATEGORIES];

  const filtered = EQUIPMENT_ITEMS.filter((item) => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = !search || item.name.toLowerCase().includes(search.toLowerCase()) || item.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {showSuggest && <SuggestModal onClose={() => setShowSuggest(false)} />}

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Pilot Equipment Guide</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Everything a pilot needs — from headsets to sunscreen
          </p>
        </div>
        <button
          onClick={() => setShowSuggest(true)}
          className="shrink-0 text-xs rounded px-3 py-1.5 border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors"
        >
          Suggest Equipment
        </button>
      </div>

      {/* Affiliate disclaimer */}
      <div className="mb-6 rounded-md bg-muted/30 border border-border p-3 text-xs text-muted-foreground">
        Some links are affiliate links (Amazon &amp; Sporty&apos;s Pilot Shop). We may earn a small
        commission at no extra cost to you. This helps support the site.
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search equipment..."
          className="w-full bg-background border border-border rounded-md pl-9 pr-8 py-2 text-sm outline-none focus:border-primary transition-colors"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              activeCategory === cat
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Result count */}
      <p className="text-xs text-muted-foreground mb-4">
        Showing {filtered.length} item{filtered.length !== 1 ? "s" : ""}
        {search && <> matching &ldquo;{search}&rdquo;</>}
        {activeCategory !== "All" && <> in {activeCategory}</>}
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((item) => (
          <ItemCard key={item.id} item={item} isProUser={isProUser} />
        ))}
      </div>
    </div>
  );
}
