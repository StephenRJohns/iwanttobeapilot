"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export default function MaintenanceGate({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [maintenance, setMaintenance] = useState<{ active: boolean; message: string | null }>({
    active: false,
    message: null,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isAdmin = (session?.user as any)?.role === "admin";

  useEffect(() => {
    function fetchMaintenance() {
      fetch("/api/maintenance")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) {
            setMaintenance({ active: data.maintenanceMode, message: data.message });
          }
        })
        .catch(() => {});
    }

    fetchMaintenance();
    window.addEventListener("maintenance-updated", fetchMaintenance);
    return () => window.removeEventListener("maintenance-updated", fetchMaintenance);
  }, []);

  const isAuthPage = pathname.startsWith("/auth/") || pathname === "/api/auth";

  if (maintenance.active && !isAdmin && !isAuthPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">✈</div>
          <h1 className="text-2xl font-bold mb-3">Under Maintenance</h1>
          <p className="text-muted-foreground mb-4">
            {maintenance.message || "We're currently performing scheduled maintenance. Please try again later."}
          </p>
          <a
            href="/auth/signin?admin=true"
            className="text-xs text-primary hover:text-primary/80 transition-colors"
          >
            Admin Sign In
          </a>
          <div className="text-xs text-muted-foreground/60 mt-3">
            I Want To Be A Pilot
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {maintenance.active && isAdmin && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2 text-center">
          <span className="text-xs font-medium text-amber-400">
            Maintenance mode is active — only admins can see the site
          </span>
        </div>
      )}
      {children}
    </>
  );
}
