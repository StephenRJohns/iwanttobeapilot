"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const SchoolsMap = dynamic(() => import("./SchoolsMap"), { ssr: false });

interface School {
  id: string;
  name: string;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  identifier?: string | null;
  lat: number;
  lng: number;
  distance: number;
}

export default function SchoolsClient() {
  const [zip, setZip] = useState("");
  const [radius, setRadius] = useState("50");
  const [schools, setSchools] = useState<School[]>([]);
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    setSearched(true);

    try {
      const res = await fetch(`/api/schools?zip=${encodeURIComponent(zip)}&radius=${radius}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Search failed. Please try again.");
        setSchools([]);
        setCenter(null);
        setLoading(false);
        return;
      }

      setSchools(data.schools);
      setCenter(data.center);
    } catch {
      setError("Search failed. Please check your connection and try again.");
    }

    setLoading(false);
  }

  return (
    <div>
      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          inputMode="numeric"
          value={zip}
          onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
          onKeyDown={(e) => {
            if (e.key === "Enter" && zip.length === 5 && !loading) {
              e.preventDefault();
              e.currentTarget.form?.requestSubmit();
            }
          }}
          placeholder="Enter zip code"
          maxLength={5}
          className="flex-1 bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
          required
        />
        <select
          value={radius}
          onChange={(e) => setRadius(e.target.value)}
          className="w-full sm:w-36 bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
        >
          <option value="25">25 miles</option>
          <option value="50">50 miles</option>
          <option value="100">100 miles</option>
          <option value="200">200 miles</option>
        </select>
        <button
          type="submit"
          disabled={loading || zip.length < 5}
          className="sm:w-auto w-full bg-primary text-primary-foreground rounded-md px-5 py-2 text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && (
        <div className="mb-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded p-3">
          {error}
        </div>
      )}

      {/* Map — always full width on top when results exist */}
      {searched && !loading && center && schools.length > 0 && (
        <div className="rounded-lg border border-border overflow-hidden mb-6" style={{ height: "400px" }}>
          <SchoolsMap schools={schools} center={center} />
        </div>
      )}

      {/* Results table */}
      {searched && !loading && (
        <>
          {schools.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-sm">No flight schools found within {radius} miles of {zip}.</p>
              <p className="text-xs mt-1">Try expanding your search radius.</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-3">
                Found <span className="text-foreground font-medium">{schools.length}</span> flight school{schools.length !== 1 ? "s" : ""} within {radius} miles, sorted by distance
              </p>
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-card">
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Address</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Phone</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Email</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Website</th>
                      <th className="text-right px-4 py-3 font-medium text-muted-foreground">Distance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schools.map((school, i) => (
                      <tr
                        key={school.id}
                        className={`border-b border-border last:border-0 hover:bg-card/50 transition-colors ${i % 2 === 0 ? "" : "bg-card/20"}`}
                      >
                        <td className="px-4 py-3 font-medium">{school.name}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {[school.address, school.city, school.state, school.zipCode]
                            .filter(Boolean)
                            .join(", ") || "—"}
                        </td>
                        <td className="px-4 py-3">
                          {school.phone ? (
                            <a href={`tel:${school.phone}`} className="text-primary hover:underline whitespace-nowrap">
                              {school.phone}
                            </a>
                          ) : (
                            <span className="text-muted-foreground/50">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {school.email ? (
                            <a href={`mailto:${school.email}`} className="text-primary hover:underline">
                              {school.email}
                            </a>
                          ) : (
                            <span className="text-muted-foreground/50">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {school.website ? (
                            <a
                              href={school.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              {(() => {
                                try {
                                  return new URL(school.website).hostname.replace(/^www\./, "");
                                } catch {
                                  return school.website;
                                }
                              })()}
                            </a>
                          ) : (
                            <span className="text-muted-foreground/50">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right text-muted-foreground whitespace-nowrap">
                          {school.distance.toFixed(1)} mi
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}

      {!searched && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-sm">Enter your zip code to find flight schools near you</p>
        </div>
      )}
    </div>
  );
}
