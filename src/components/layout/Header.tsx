"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  HelpCircle,
  CreditCard,
  GraduationCap,
  BookOpen,
  Wallet,
  Package,
  LayoutDashboard,
  ClipboardList,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  Shield,
  LifeBuoy,
  Send,
  Loader2,
  CheckCircle,
} from "lucide-react";
import HelpPanel from "@/components/help/HelpPanel";

const navLinks = [
  { href: "/schools", label: "Schools", icon: GraduationCap },
  { href: "/resources", label: "Resources", icon: BookOpen },
  { href: "/costs", label: "Costs", icon: Wallet },
  { href: "/equipment", label: "Equipment", icon: Package },
];

const authNavLinks = [
  { href: "/dpe-finder", label: "DPEs", icon: ClipboardList },
  { href: "/community/stories", label: "Stories", icon: FileText },
  { href: "/community/discussions", label: "Forums", icon: MessageSquare },
];

export default function Header() {
  const pathname = usePathname();
  const { status, data: sessionData } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  const isLoggedIn = status === "authenticated";
  const isAuthPage = pathname.startsWith("/auth/");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const u = sessionData?.user as any;
  const isAdminUser = u?.role === "admin";
  const isProUser = u?.tier === "pro" || u?.tier === "beta" || isAdminUser;
  const showPricing = !isProUser;

  const allNavLinks = isLoggedIn
    ? [
        { href: "/schools", label: "Schools", icon: GraduationCap },
        { href: "/resources", label: "Resources", icon: BookOpen },
        { href: "/costs", label: "Costs", icon: Wallet },
        { href: "/dashboard", label: "Progress", icon: LayoutDashboard },
        { href: "/equipment", label: "Equipment", icon: Package },
        ...authNavLinks,
      ]
    : navLinks;

  const pricingActive = pathname === "/pricing";

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">

          {/* ── LEFT: logo + nav links ── */}
          <div className="flex items-center gap-2">
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

            <Link href="/" className="shrink-0 flex items-center mr-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/IWTBAP_logo.png" alt="I Want To Be A Pilot" className="h-10 w-auto" />
            </Link>

            {/* Nav links — single horizontal row */}
            {!isAuthPage && (
              <nav className="hidden md:flex items-center gap-0.5">
                {showPricing && (
                  <Link
                    href="/pricing"
                    className={`flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                      pricingActive
                        ? "bg-primary/10 text-primary"
                        : "text-primary hover:bg-primary/10"
                    }`}
                  >
                    <CreditCard className="h-3.5 w-3.5" />
                    Pricing
                  </Link>
                )}

                {navLinks.map(({ href, label, icon: Icon }) => {
                  const isActive = pathname === href || pathname.startsWith(`${href}/`);
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {label}
                    </Link>
                  );
                })}
                {isLoggedIn && (
                  <>
                    <div className="w-px h-5 bg-white/30 mx-1" />
                    <span className="text-xs font-semibold text-white px-1">Pro:</span>
                    {[{ href: "/dashboard", label: "Progress", icon: LayoutDashboard }, ...authNavLinks].map(({ href, label, icon: Icon }) => {
                      const isActive = pathname === href || pathname.startsWith(`${href}/`);
                      return (
                        <Link
                          key={href}
                          href={href}
                          className={`flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                            isActive
                              ? "bg-white/10 text-white"
                              : "text-white/70 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          {label}
                        </Link>
                      );
                    })}
                  </>
                )}
              </nav>
            )}
          </div>

          {/* ── RIGHT: icon-only action buttons ── */}
          {!isAuthPage && (
            <div className="hidden md:flex items-center gap-0.5">
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => setHelpOpen(true)}
                    className="rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                    aria-label="Help"
                    title="Help"
                  >
                    <HelpCircle className="h-4.5 w-4.5" />
                  </button>
                  <Link
                    href="/settings"
                    className={`rounded-md p-2 transition-colors ${
                      pathname === "/settings"
                        ? "text-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                    aria-label="Settings"
                    title="Settings"
                  >
                    <Settings className="h-4.5 w-4.5" />
                  </Link>
                  {isAdminUser && (
                    <Link
                      href="/admin"
                      className={`rounded-md p-2 transition-colors ${
                        pathname.startsWith("/admin")
                          ? "bg-red-900/30 text-red-400"
                          : "text-red-500/70 hover:bg-red-900/20 hover:text-red-400"
                      }`}
                      aria-label="Admin"
                      title="Admin"
                    >
                      <Shield className="h-4.5 w-4.5" />
                    </Link>
                  )}
                  <button
                    onClick={() => setContactOpen(true)}
                    className="rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                    aria-label="Contact support"
                    title="Contact support"
                  >
                    <LifeBuoy className="h-4.5 w-4.5" />
                  </button>
                  <button
                    onClick={() => signOut({ callbackUrl: window.location.origin + "/" })}
                    className="rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                    aria-label="Sign out"
                    title="Sign out"
                  >
                    <LogOut className="h-4.5 w-4.5" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setHelpOpen(true)}
                    className="rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                    aria-label="Help"
                    title="Help"
                  >
                    <HelpCircle className="h-4.5 w-4.5" />
                  </button>
                  <Link
                    href="/auth/signin"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    className="rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-xs font-medium hover:bg-primary/90 transition-colors active:scale-[0.97]"
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
            className="fixed inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <nav className="fixed top-16 left-0 bottom-0 w-64 bg-card border-r border-border p-4 space-y-1 overflow-y-auto">
            {showPricing && (
              <Link
                href="/pricing"
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition-colors ${
                  pricingActive
                    ? "bg-primary/10 text-primary"
                    : "text-primary hover:bg-primary/10"
                }`}
              >
                <CreditCard className="h-5 w-5" />
                Pricing
              </Link>
            )}

            {allNavLinks.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
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
                      className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                        pathname.startsWith("/admin")
                          ? "bg-red-900/30 text-red-400"
                          : "text-red-500/70 hover:bg-red-900/20 hover:text-red-400"
                      }`}
                    >
                      <Shield className="h-5 w-5" />
                      Admin
                    </Link>
                  )}
                  <Link
                    href="/settings"
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                      pathname === "/settings"
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <Settings className="h-5 w-5" />
                    Settings
                  </Link>
                  <button
                    onClick={() => { setMobileOpen(false); setHelpOpen(true); }}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                  >
                    <HelpCircle className="h-5 w-5" />
                    Help
                  </button>
                  <button
                    onClick={() => { setMobileOpen(false); setContactOpen(true); }}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                  >
                    <LifeBuoy className="h-5 w-5" />
                    Contact Support
                  </button>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      signOut({ callbackUrl: window.location.origin + "/" });
                    }}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { setMobileOpen(false); setHelpOpen(true); }}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                  >
                    <HelpCircle className="h-5 w-5" />
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

      {/* Contact support modal */}
      {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}
    </>
  );
}

function ContactModal({ onClose }: { onClose: () => void }) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send message");
      }
      setSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send message. Try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <LifeBuoy className="h-5 w-5 text-primary" />
          <h2 className="text-sm font-semibold">Contact Support</h2>
        </div>

        {sent ? (
          <div className="text-center py-4">
            <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <p className="text-sm font-medium">Message sent!</p>
            <p className="text-xs text-muted-foreground mt-1">We&apos;ll get back to you as soon as possible.</p>
            <button onClick={onClose} className="mt-4 text-xs px-3 py-1.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium block mb-1">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="What do you need help with?"
                required
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium block mb-1">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your issue or question..."
                rows={4}
                required
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-primary transition-colors resize-none"
              />
            </div>
            {error && (
              <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded p-2">{error}</p>
            )}
            <div className="flex gap-2 justify-end pt-1">
              <button type="button" onClick={onClose} className="text-xs px-3 py-1.5 border border-border rounded-md text-muted-foreground hover:text-foreground transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={sending} className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors">
                {sending ? <><Loader2 className="h-3 w-3 animate-spin" /> Sending…</> : <><Send className="h-3 w-3" /> Send Message</>}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
