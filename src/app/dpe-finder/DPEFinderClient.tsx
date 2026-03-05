"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Loader2, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, ClipboardList } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useSession } from "next-auth/react";
import { isPro } from "@/lib/tier";
import { PILOT_LEVELS } from "@/data/pilot-levels";

const DPEMap = dynamic(() => import("./DPEMap"), { ssr: false });

interface DPERecord {
  id: string;
  designeeNumber: string | null;
  name: string;
  state: string | null;
  city: string | null;
  phone: string | null;
  email: string | null;
  certificateTypes: string | null;
  lat: number | null;
  lng: number | null;
  distance: number;
  avgRating: number | null;
  ratingCount: number;
}

interface PassRateRow {
  year: number;
  certificateType: string;
  examinerType: string;
  taken: number;
  passed: number;
  passRate: string; // formatted by MCP as "85.0%"
}

export default function DPEFinderClient({ directoryDisabled = false }: { directoryDisabled?: boolean }) {
  const { data: session } = useSession();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const s = session as any;
  const pro = session ? (isPro(s) || s?.user?.role === "admin") : false;

  const [zip, setZip] = useState("");
  const [radius, setRadius] = useState("50");
  const [certType, setCertType] = useState("");
  const [dpes, setDpes] = useState<DPERecord[]>([]);
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const [passRates, setPassRates] = useState<PassRateRow[]>([]);
  const [rateFilter, setRateFilter] = useState("");
  const [certTypes, setCertTypes] = useState<string[]>([]);
  const [loadingRates, setLoadingRates] = useState(false);
  const [ratePage, setRatePage] = useState(0);
  const [ratePageSize, setRatePageSize] = useState(10);

  const [dpePage, setDpePage] = useState(0);
  const [dpePageSize, setDpePageSize] = useState(10);

  const [ratingTarget, setRatingTarget] = useState<string | null>(null);
  const [ratingScore, setRatingScore] = useState(5);
  const [submittingRating, setSubmittingRating] = useState(false);

  useEffect(() => {
    if (!pro) return;
    fetch("/api/dpe/pass-rates?typesOnly=true")
      .then((r) => r.json())
      .then((d) => setCertTypes(d.certificateTypes || []));
  }, [pro]);

  useEffect(() => {
    if (!pro) return;
    setLoadingRates(true);
    setRatePage(0);
    const params = new URLSearchParams();
    if (rateFilter) params.set("certificateType", rateFilter);
    fetch(`/api/dpe/pass-rates?${params}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) console.error("Pass rates API error:", d.error);
        setPassRates(d.records || []);
      })
      .finally(() => setLoadingRates(false));
  }, [pro, rateFilter]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!zip.trim()) return;
    setSearching(true);
    setSearchError("");
    try {
      const params = new URLSearchParams({ zip: zip.trim(), radius });
      if (certType) params.set("certificateType", certType);
      const res = await fetch(`/api/dpe/search?${params}`);
      const data = await res.json();
      if (!res.ok) {
        setSearchError(data.error || "Search failed");
        return;
      }
      setDpes(data.dpes || []);
      setCenter(data.center || null);
      setDpePage(0);
    } catch {
      setSearchError("Search failed");
    } finally {
      setSearching(false);
    }
  }

  async function submitRating() {
    if (!ratingTarget) return;
    setSubmittingRating(true);
    await fetch("/api/ratings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetType: "dpe", targetId: ratingTarget, score: ratingScore }),
    });
    setSubmittingRating(false);
    setRatingTarget(null);
    // Refresh search to get updated ratings
    handleSearch(new Event("submit") as unknown as React.FormEvent);
  }

  const certTypeOptions = Array.from(
    new Set(PILOT_LEVELS.map((l) => l.certificateType).filter(Boolean))
  );

  return (
    <div className="space-y-6">
      {/* Search panel */}
      <div className={`rounded-lg border border-border bg-card p-4 ${directoryDisabled ? "hidden" : ""}`}>
        <form onSubmit={handleSearch} className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[140px]">
            <label className="text-xs text-muted-foreground block mb-1">Zip Code</label>
            <input
              type="text"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              placeholder="e.g. 90210"
              maxLength={10}
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Radius</label>
            <select
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              className="bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
            >
              <option value="25">25 mi</option>
              <option value="50">50 mi</option>
              <option value="100">100 mi</option>
              <option value="200">200 mi</option>
            </select>
          </div>
          <div className="flex-1 min-w-[160px]">
            <label className="text-xs text-muted-foreground block mb-1">Certificate Type</label>
            <select
              value={certType}
              onChange={(e) => setCertType(e.target.value)}
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
            >
              <option value="">All types</option>
              {certTypeOptions.map((t) => (
                <option key={t} value={t!}>{t}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={searching}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {searching && <Loader2 className="w-3 h-3 animate-spin" />}
            Search
          </button>
        </form>
        {searchError && (
          <p className="text-xs text-red-400 mt-2">{searchError}</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Results + Map */}
        <div className="space-y-4">
          {directoryDisabled ? (
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
              <p className="font-medium mb-0.5">DPE directory data is temporarily unavailable</p>
              <p className="text-amber-300/80 text-xs leading-relaxed">
                We&apos;re waiting on an FAA data release to populate the examiner directory. The search
                and map are disabled until real data is available. FAA aggregate pass rates (right) are
                unaffected.
              </p>
            </div>
          ) : null}
          {!directoryDisabled && dpes.length > 0 && center && (
            <div className="h-64 rounded-lg overflow-hidden border border-border">
              <DPEMap dpes={dpes} center={center} />
            </div>
          )}

          {!directoryDisabled && dpes.length === 0 && !searching && zip && (
            <EmptyState
              icon={<ClipboardList className="h-12 w-12" />}
              title="No DPEs found"
              description="Try expanding your search radius or changing the certificate type."
            />
          )}

          {!directoryDisabled && dpes.length > 0 && (() => {
            const dpeTotalPages = Math.ceil(dpes.length / dpePageSize);
            const dpePageRows = dpes.slice(dpePage * dpePageSize, (dpePage + 1) * dpePageSize);
            return (
              <div className="rounded-lg border border-border bg-card p-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground">
                        <th className="text-left py-2 pr-3 font-medium">Name</th>
                        <th className="text-left py-2 pr-3 font-medium">Location</th>
                        <th className="text-left py-2 pr-3 font-medium hidden sm:table-cell">Certificates</th>
                        <th className="text-left py-2 pr-3 font-medium hidden md:table-cell">Contact</th>
                        <th className="text-right py-2 pr-3 font-medium">Dist</th>
                        <th className="text-right py-2 font-medium">Rating</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dpePageRows.map((dpe) => (
                        <>
                          <tr key={dpe.id} className="border-b border-border/50 hover:bg-muted/20">
                            <td className="py-1.5 pr-3 font-medium">{dpe.name}</td>
                            <td className="py-1.5 pr-3 text-muted-foreground">
                              {[dpe.city, dpe.state].filter(Boolean).join(", ") || "—"}
                            </td>
                            <td className="py-1.5 pr-3 text-muted-foreground max-w-[150px] truncate hidden sm:table-cell">
                              {dpe.certificateTypes || "—"}
                            </td>
                            <td className="py-1.5 pr-3 hidden md:table-cell">
                              <div className="flex flex-col gap-0.5">
                                {dpe.phone && (
                                  <a href={`tel:${dpe.phone}`} className="text-primary hover:underline">{dpe.phone}</a>
                                )}
                                {dpe.email && (
                                  <a href={`mailto:${dpe.email}`} className="text-primary hover:underline truncate max-w-[140px] block">{dpe.email}</a>
                                )}
                              </div>
                            </td>
                            <td className="py-1.5 pr-3 text-right">{dpe.distance.toFixed(1)} mi</td>
                            <td className="py-1.5 text-right">
                              {dpe.ratingCount > 0 ? (
                                <span className="text-amber-400">★ {dpe.avgRating?.toFixed(1)}</span>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                              {pro && (
                                <button
                                  onClick={() => setRatingTarget(ratingTarget === dpe.id ? null : dpe.id)}
                                  className="block ml-auto text-primary hover:underline mt-0.5"
                                >
                                  Rate
                                </button>
                              )}
                            </td>
                          </tr>
                          {ratingTarget === dpe.id && (
                            <tr key={`${dpe.id}-rating`} className="border-b border-border/50 bg-muted/10">
                              <td colSpan={6} className="py-2 px-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-muted-foreground">Your rating:</span>
                                  {[1, 2, 3, 4, 5].map((s) => (
                                    <button
                                      key={s}
                                      onClick={() => setRatingScore(s)}
                                      className={`text-lg transition-colors ${s <= ratingScore ? "text-primary" : "text-muted-foreground"}`}
                                    >
                                      ★
                                    </button>
                                  ))}
                                  <button
                                    onClick={submitRating}
                                    disabled={submittingRating}
                                    className="ml-2 text-xs px-3 py-1 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
                                  >
                                    {submittingRating ? "Saving..." : "Submit"}
                                  </button>
                                  <button
                                    onClick={() => setRatingTarget(null)}
                                    className="text-xs text-muted-foreground hover:text-foreground"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-between mt-3 gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground">Rows:</span>
                    <select
                      value={dpePageSize}
                      onChange={(e) => { setDpePageSize(Number(e.target.value)); setDpePage(0); }}
                      className="bg-background border border-border rounded px-1.5 py-0.5 text-xs outline-none focus:border-primary"
                    >
                      {[10, 25, 50].map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span>{dpePage * dpePageSize + 1}–{Math.min((dpePage + 1) * dpePageSize, dpes.length)} of {dpes.length}</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <button onClick={() => setDpePage(0)} disabled={dpePage === 0} className="p-1 rounded hover:bg-muted/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors" title="First page">
                      <ChevronsLeft className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setDpePage((p) => p - 1)} disabled={dpePage === 0} className="p-1 rounded hover:bg-muted/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors" title="Previous page">
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setDpePage((p) => p + 1)} disabled={dpePage >= dpeTotalPages - 1} className="p-1 rounded hover:bg-muted/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors" title="Next page">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setDpePage(dpeTotalPages - 1)} disabled={dpePage >= dpeTotalPages - 1} className="p-1 rounded hover:bg-muted/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors" title="Last page">
                      <ChevronsRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Right: FAA Pass Rates */}
        <div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 className="text-sm font-semibold">FAA Pass Rates</h2>
              {pro && (
                <select
                  value={rateFilter}
                  onChange={(e) => setRateFilter(e.target.value)}
                  className="bg-background border border-border rounded-md px-2 py-1 text-xs outline-none focus:border-primary transition-colors"
                >
                  <option value="">All certificates</option>
                  {certTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              )}
            </div>

            {!pro ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground mb-3">
                  FAA aggregate pass rate data is a Pro feature.
                </p>
                <a
                  href="/pricing"
                  className="text-sm text-primary hover:underline"
                >
                  Upgrade to Pro →
                </a>
              </div>
            ) : loadingRates ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            ) : passRates.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-8">No data available.</p>
            ) : (() => {
              const totalPages = Math.ceil(passRates.length / ratePageSize);
              const pageRows = passRates.slice(ratePage * ratePageSize, (ratePage + 1) * ratePageSize);
              return (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border text-muted-foreground">
                          <th className="text-left py-2 pr-3 font-medium">Year</th>
                          <th className="text-left py-2 pr-3 font-medium">Certificate</th>
                          <th className="text-left py-2 pr-3 font-medium">Examiner</th>
                          <th className="text-right py-2 pr-3 font-medium">Taken</th>
                          <th className="text-right py-2 pr-3 font-medium">Passed</th>
                          <th className="text-right py-2 font-medium">Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pageRows.map((row, i) => (
                          <tr key={`${row.year}-${row.certificateType}-${row.examinerType}-${i}`} className="border-b border-border/50 hover:bg-muted/20">
                            <td className="py-1.5 pr-3">{row.year}</td>
                            <td className="py-1.5 pr-3 max-w-[120px] truncate">{row.certificateType}</td>
                            <td className="py-1.5 pr-3">{row.examinerType}</td>
                            <td className="py-1.5 pr-3 text-right">{row.taken.toLocaleString()}</td>
                            <td className="py-1.5 pr-3 text-right">{row.passed.toLocaleString()}</td>
                            <td className={`py-1.5 text-right font-medium ${
                              parseFloat(row.passRate) >= 80 ? "text-green-400" :
                              parseFloat(row.passRate) >= 60 ? "text-amber-400" : "text-red-400"
                            }`}>
                              {row.passRate}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex items-center justify-between mt-3 gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-muted-foreground">Rows:</span>
                      <select
                        value={ratePageSize}
                        onChange={(e) => { setRatePageSize(Number(e.target.value)); setRatePage(0); }}
                        className="bg-background border border-border rounded px-1.5 py-0.5 text-xs outline-none focus:border-primary"
                      >
                        {[10, 25, 50, 100].map((n) => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <span>{ratePage * ratePageSize + 1}–{Math.min((ratePage + 1) * ratePageSize, passRates.length)} of {passRates.length}</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={() => setRatePage(0)}
                        disabled={ratePage === 0}
                        className="p-1 rounded hover:bg-muted/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="First page"
                      >
                        <ChevronsLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setRatePage((p) => p - 1)}
                        disabled={ratePage === 0}
                        className="p-1 rounded hover:bg-muted/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Previous page"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setRatePage((p) => p + 1)}
                        disabled={ratePage >= totalPages - 1}
                        className="p-1 rounded hover:bg-muted/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Next page"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setRatePage(totalPages - 1)}
                        disabled={ratePage >= totalPages - 1}
                        className="p-1 rounded hover:bg-muted/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Last page"
                      >
                        <ChevronsRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
