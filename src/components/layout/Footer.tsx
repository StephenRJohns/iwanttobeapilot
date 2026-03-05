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
            <img src="/images/IWTBAP_logo.png" alt="I Want To Be A Pilot" className="h-12 w-auto mb-3" />
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
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
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
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
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
                <Link href="/help" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Help & FAQ
                </Link>
              </li>
              <li>
                <a href="mailto:support@iwanttobeapilot.online" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  support@iwanttobeapilot.online
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-4 text-xs text-muted-foreground text-center sm:text-left">
          <span>&copy; {copyrightYear} JJJJJ Enterprises, LLC. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
