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
    <footer className="border-t border-border py-6 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <div className="flex flex-col gap-1">
          <span className="font-medium">I Want To Be A Pilot</span>
          <a href="mailto:support@iwanttobeapilot.online" className="hover:text-foreground transition-colors">
            support@iwanttobeapilot.online
          </a>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/disclaimer" className="hover:text-foreground transition-colors">Disclaimer</Link>
          </div>
          <p className="text-muted-foreground/60 text-[11px]">
            Use of this site constitutes acceptance of our{" "}
            <Link href="/terms" className="hover:text-foreground transition-colors underline underline-offset-2">Terms</Link>
            ,{" "}
            <Link href="/privacy" className="hover:text-foreground transition-colors underline underline-offset-2">Privacy Policy</Link>
            , and{" "}
            <Link href="/disclaimer" className="hover:text-foreground transition-colors underline underline-offset-2">Aviation Disclaimer</Link>
            .
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/70 border border-border/50 rounded px-2 py-1">
            <svg viewBox="0 0 24 24" className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            HTTPS Secure
          </div>
          <span>&copy; {copyrightYear} All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
