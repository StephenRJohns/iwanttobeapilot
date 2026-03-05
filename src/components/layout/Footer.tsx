"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth/");

  if (isAuthPage) return null;

  const currentYear = new Date().getFullYear();
  const startYear = 2026;
  const copyrightYear = currentYear > startYear ? `${startYear}–${currentYear}` : `${startYear}`;

  return (
    <footer className="border-t border-border mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/IWTBAP_logo.png" alt="I Want To Be A Pilot" className="h-8 w-auto mb-3" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your complete guide to becoming a pilot — from first flight to airline captain.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/70 mb-3">Product</h4>
            <ul className="space-y-2">
              {[
                { href: "/schools", label: "Flight Schools" },
                { href: "/resources", label: "Resources" },
                { href: "/costs", label: "Costs & Timelines" },
                { href: "/equipment", label: "Equipment" },
                { href: "/pricing", label: "Pricing" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/70 mb-3">Legal</h4>
            <ul className="space-y-2">
              {[
                { href: "/terms", label: "Terms of Service" },
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/disclaimer", label: "Aviation Disclaimer" },
                { href: "/about", label: "About" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/70 mb-3">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Help & FAQ
                </Link>
              </li>
              <li>
                <a href="mailto:support@iwanttobeapilot.online" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  support@iwanttobeapilot.online
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>&copy; {copyrightYear} JJJJJ Enterprises, LLC. All rights reserved.</span>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/70 border border-border/50 rounded px-2 py-1">
            <svg viewBox="0 0 24 24" className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            HTTPS Secure
          </div>
        </div>
      </div>
    </footer>
  );
}
