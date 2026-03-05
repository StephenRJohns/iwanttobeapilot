"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Loader2, GraduationCap, MapPin, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

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
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    setSearched(true);
    setPage(0);

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

  async function handleSearchHere({ lat, lng }: { lat: number; lng: number }) {
    setError("");
    setLoading(true);
    setSearched(true);
    setPage(0);

    try {
      const res = await fetch(`/api/schools?lat=${lat}&lng=${lng}&radius=${radius}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Search failed. Please try again.");
        setSchools([]);
        setCenter(null);
      } else {
        setSchools(data.schools);
        setCenter({ lat, lng });
      }
    } catch {
      setError("Search failed. Please check your connection and try again.");
    }

    setLoading(false);
  }

  const totalPages = Math.ceil(schools.length / pageSize);
  const pageRows = schools.slice(page * pageSize, (page + 1) * pageSize);

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

      {/* Loading skeleton */}
      {searched && loading && (
        <div className="space-y-3">
          <Skeleton className="h-[400px] w-full rounded-lg" />
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      )}

      {/* Map */}
      {searched && !loading && center && schools.length > 0 && (
        <div className="rounded-lg border border-border overflow-hidden mb-6" style={{ height: "400px" }}>
          <SchoolsMap schools={schools} center={center} onSearchHere={handleSearchHere} loading={loading} />
        </div>
      )}

      {/* Results table */}
      {searched && !loading && (
        <>
          {schools.length === 0 ? (
            <EmptyState
              icon={<GraduationCap className="h-12 w-12" />}
              title="No flight schools found"
              description={`No schools found within ${radius} miles of ${zip}. Try expanding your search radius.`}
            />
          ) : (
            <>
              {/* Pagination controls — above table */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                <p className="text-sm text-muted-foreground">
                  Found <span className="text-foreground font-medium">{schools.length}</span> school{schools.length !== 1 ? "s" : ""} within {radius} miles
                  {totalPages > 1 && (
                    <span className="ml-1">— page {page + 1} of {totalPages}</span>
                  )}
                </p>

                <div className="flex items-center gap-2">
                  {/* Page size selector */}
                  <select
                    value={pageSize}
                    onChange={(e) => { setPageSize(Number(e.target.value)); setPage(0); }}
                    className="bg-background border border-border rounded-md px-2 py-1 text-xs outline-none focus:border-primary transition-colors"
                  >
                    {[10, 25, 50, 100].map((n) => (
                      <option key={n} value={n}>{n} per page</option>
                    ))}
                  </select>

                  {/* Nav buttons */}
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={() => setPage(0)}
                      disabled={page === 0}
                      className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      title="First page"
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setPage((p) => p - 1)}
                      disabled={page === 0}
                      className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Previous page"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setPage((p) => p + 1)}
                      disabled={page >= totalPages - 1}
                      className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Next page"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setPage(totalPages - 1)}
                      disabled={page >= totalPages - 1}
                      className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Last page"
                    >
                      <ChevronsRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-card">
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Address</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Phone</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Website</th>
                      <th className="text-right px-4 py-3 font-medium text-muted-foreground">Distance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageRows.map((school, i) => (
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
        <EmptyState
          icon={<MapPin className="h-12 w-12" />}
          title="Find flight schools near you"
          description="Enter your zip code above to search for FAA-certified flight schools in your area."
        />
      )}
    </div>
  );
}
