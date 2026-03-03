"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { HelpCircle } from "lucide-react";
import HelpPanel from "@/components/help/HelpPanel";

// Pricing is rendered separately, always pinned to the far left outside
// the centered nav group so it doesn't shift the other items.
const navLinks = [
  { href: "/schools", label: "Schools" },
  { href: "/resources", label: "Resources" },
  { href: "/equipment", label: "Equipment" },
  { href: "/costs", label: "Costs" },
];

const authNavLinks = [
  { href: "/dashboard", label: "Progress" },
  { href: "/dpe-finder", label: "DPE Finder" },
  { href: "/community/stories", label: "Stories" },
  { href: "/community/discussions", label: "Discussions" },
];

export default function Header() {
  const pathname = usePathname();
  const { status, data: sessionData } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const isLoggedIn = status === "authenticated";
  const isAuthPage = pathname.startsWith("/auth/");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isAdminUser = (sessionData?.user as any)?.role === "admin";

  const allNavLinks = isLoggedIn
    ? [...navLinks, ...authNavLinks]
    : navLinks;

  const pricingActive = pathname === "/pricing";

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">

          {/* ── LEFT: hamburger (mobile) + logo + Pricing ── */}
          <div className="flex items-center gap-1">
            {!isAuthPage && (
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Toggle menu"
              >
                {mobileOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                )}
              </button>
            )}

            <Link
              href="/"
              className="flex items-center gap-2 text-foreground transition-colors hover:text-primary font-bold text-base tracking-tight"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/favicon.svg" alt="" width={28} height={28} className="shrink-0" />
              I Want To Be A Pilot
            </Link>

            {/* Pricing — pinned left, outside the centered nav group */}
            {!isAuthPage && (
              <Link
                href="/pricing"
                className={`hidden md:inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold transition-colors ml-2 ${
                  pricingActive
                    ? "bg-amber-400/15 text-amber-400"
                    : "text-amber-400 hover:bg-amber-400/10"
                }`}
              >
                Pricing
              </Link>
            )}
          </div>

          {/* ── CENTER: main nav links ── */}
          {!isAuthPage && (
            <nav className="hidden md:flex items-center gap-0.5">
              {allNavLinks.map(({ href, label }) => {
                const isActive = pathname === href || pathname.startsWith(`${href}/`);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* ── RIGHT: auth buttons ── */}
          {!isAuthPage && (
            <div className="hidden md:flex items-center gap-1">
              {isLoggedIn ? (
                <>
                  <Link
                    href="/settings"
                    className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      pathname === "/settings"
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    Settings
                  </Link>
                  {isAdminUser && (
                    <Link
                      href="/admin"
                      className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                        pathname.startsWith("/admin")
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={() => setHelpOpen(true)}
                    className="rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                    aria-label="Help"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setHelpOpen(true)}
                    className="rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                    aria-label="Help"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                  <Link
                    href="/auth/signin"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    className="rounded-md bg-primary text-primary-foreground px-3 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </header>

      {/* ── Mobile drawer ── */}
      {!isAuthPage && mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <nav className="fixed top-14 left-0 bottom-0 w-64 bg-card border-r border-border p-4 space-y-1 overflow-y-auto">
            {/* Pricing first, amber styled */}
            <Link
              href="/pricing"
              onClick={() => setMobileOpen(false)}
              className={`block rounded-md px-3 py-2.5 text-sm font-semibold transition-colors ${
                pricingActive
                  ? "bg-amber-400/15 text-amber-400"
                  : "text-amber-400 hover:bg-amber-400/10"
              }`}
            >
              Pricing
            </Link>

            {allNavLinks.map(({ href, label }) => {
              const isActive = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`block rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
            <div className="border-t border-border pt-2 mt-2 space-y-1">
              {isLoggedIn ? (
                <>
                  <Link
                    href="/settings"
                    onClick={() => setMobileOpen(false)}
                    className={`block rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                      pathname === "/settings"
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    Settings
                  </Link>
                  {isAdminUser && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileOpen(false)}
                      className={`block rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                        pathname.startsWith("/admin")
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={() => { setMobileOpen(false); setHelpOpen(true); }}
                    className="block w-full text-left rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                  >
                    Help
                  </button>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="block w-full text-left rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { setMobileOpen(false); setHelpOpen(true); }}
                    className="block w-full text-left rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                  >
                    Help
                  </button>
                  <Link
                    href="/auth/signin"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-md bg-primary text-primary-foreground px-3 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}

      {/* Help panel */}
      <HelpPanel open={helpOpen} onClose={() => setHelpOpen(false)} />
    </>
  );
}
