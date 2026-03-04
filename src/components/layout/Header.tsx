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
  { href: "/costs", label: "Costs" },
  { href: "/equipment", label: "Equipment" },
];

const authNavLinks = [
  { href: "/dpe-finder", label: "DPEs" },
  { href: "/community/stories", label: "Stories" },
  { href: "/community/discussions", label: "Forums" },
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
    ? [
        { href: "/schools", label: "Schools" },
        { href: "/resources", label: "Resources" },
        { href: "/costs", label: "Costs" },
        { href: "/dashboard", label: "Progress" },
        { href: "/equipment", label: "Equipment" },
        ...authNavLinks,
      ]
    : navLinks;

  const pricingActive = pathname === "/pricing";

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex h-44 max-w-7xl items-center justify-between px-4 sm:px-6">

          {/* ── LEFT: logo + nav links ── */}
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

            <Link href="/" className="shrink-0 flex items-center mr-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/IWTBAP_logo.png" alt="I Want To Be A Pilot" className="h-40 w-auto" />
            </Link>

            {/* Nav links start immediately to the right of the logo */}
            {!isAuthPage && (
              <nav className="hidden md:flex items-center gap-0.5">
                <Link
                  href="/pricing"
                  className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
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
          </div>

          {/* ── RIGHT: auth buttons ── */}
          {!isAuthPage && (
            <div className="hidden md:flex items-center gap-1">
              {isLoggedIn ? (
                <>
                  {isAdminUser && (
                    <Link
                      href="/admin"
                      className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                        pathname.startsWith("/admin")
                          ? "bg-red-900/30 text-red-400"
                          : "text-red-500/70 hover:bg-red-900/20 hover:text-red-400"
                      }`}
                    >
                      Admin
                    </Link>
                  )}
                  <Link
                    href="/settings"
                    className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      pathname === "/settings"
                        ? "bg-amber-400/15 text-amber-400"
                        : "text-amber-400/70 hover:bg-amber-400/10 hover:text-amber-400"
                    }`}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => setHelpOpen(true)}
                    className="rounded-md p-2 text-amber-400/70 hover:bg-amber-400/10 hover:text-amber-400 transition-colors"
                    aria-label="Help"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => signOut({ callbackUrl: window.location.origin + "/" })}
                    className="rounded-md px-3 py-2 text-sm font-medium text-amber-400/70 hover:bg-amber-400/10 hover:text-amber-400 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setHelpOpen(true)}
                    className="rounded-md p-2 text-amber-400/70 hover:bg-amber-400/10 hover:text-amber-400 transition-colors"
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
                  {isAdminUser && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileOpen(false)}
                      className={`block rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                        pathname.startsWith("/admin")
                          ? "bg-red-900/30 text-red-400"
                          : "text-red-500/70 hover:bg-red-900/20 hover:text-red-400"
                      }`}
                    >
                      Admin
                    </Link>
                  )}
                  <Link
                    href="/settings"
                    onClick={() => setMobileOpen(false)}
                    className={`block rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                      pathname === "/settings"
                        ? "bg-amber-400/15 text-amber-400"
                        : "text-amber-400/70 hover:bg-amber-400/10 hover:text-amber-400"
                    }`}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => { setMobileOpen(false); setHelpOpen(true); }}
                    className="block w-full text-left rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                  >
                    Help
                  </button>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      signOut({ callbackUrl: window.location.origin + "/" });
                    }}
                    className="block w-full text-left rounded-md px-3 py-2.5 text-sm font-medium text-amber-400/70 hover:bg-amber-400/10 hover:text-amber-400 transition-colors"
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
