import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import TimelineClient from "./TimelineClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Progress Timeline",
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = session.user as any;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Progress Timeline</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Track your journey from student pilot to your goal
        </p>
      </div>

      <TimelineClient
        userId={user.id}
        pilotGoal={user.pilotGoal}
      />
    </div>
  );
}
