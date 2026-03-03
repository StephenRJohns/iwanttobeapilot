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
        <div className="font-medium">I Want To Be A Pilot</div>
        <div className="flex items-center gap-4">
          <span>Your path to the cockpit.</span>
          <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
          <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
          <Link href="/disclaimer" className="hover:text-foreground transition-colors">Disclaimer</Link>
        </div>
        <div>&copy; {copyrightYear} All rights reserved.</div>
      </div>
    </footer>
  );
}
