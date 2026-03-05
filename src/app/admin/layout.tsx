"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

const adminTabs = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/users", label: "Users", exact: false },
  { href: "/admin/promo-codes", label: "Promo Codes", exact: false },
  { href: "/admin/settings", label: "Settings", exact: false },
  { href: "/admin/audit-log", label: "Audit Log", exact: false },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((session?.user as any)?.role !== "admin") {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center py-20">
        <h1 className="text-lg font-bold mb-1">Access Denied</h1>
        <p className="text-sm text-muted-foreground">
          You do not have permission to view this page.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold">Admin</h1>
      </div>

      <nav className="flex items-center gap-1 border-b border-border mb-6">
        {adminTabs.map(({ href, label, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      {children}
    </div>
  );
}
