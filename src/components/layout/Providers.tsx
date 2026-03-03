"use client";

import { useEffect, useRef } from "react";
import { SessionProvider, useSession, signOut } from "next-auth/react";
import { Toaster } from "@/components/ui/toast";
import MaintenanceGate from "@/components/layout/MaintenanceGate";
import { ThemeProvider } from "@/components/layout/ThemeProvider";

function SessionMonitor() {
  const { data: session, status } = useSession();
  const wasAuthenticated = useRef(false);

  useEffect(() => {
    if (status === "authenticated") {
      wasAuthenticated.current = true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((session?.user as any)?.sessionDisplaced) {
        signOut({ callbackUrl: "/auth/signin?error=SessionDisplaced" });
        return;
      }
    }
    if (status === "unauthenticated" && wasAuthenticated.current) {
      signOut({ callbackUrl: "/auth/signin" });
    }
  }, [status, session]);

  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchInterval={5 * 60}>
      <ThemeProvider>
        <SessionMonitor />
        <MaintenanceGate>
          {children}
        </MaintenanceGate>
        <Toaster />
      </ThemeProvider>
    </SessionProvider>
  );
}
