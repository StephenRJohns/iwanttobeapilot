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
        className="text-xs text-muted-foreground hover:text-primary transition-colors"
      >
        Rate this item (Pro)
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
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground/40">
            <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <path d="m21 15-5-5L5 21"/>
            </svg>
            <span className="text-xs font-medium">No Image Available</span>
          </div>
        )}
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
