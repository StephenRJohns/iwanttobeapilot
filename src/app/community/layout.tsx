import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community",
};

export default async function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Community</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Connect with fellow pilots and share your journey
        </p>
      </div>

      <nav className="flex gap-1 mb-6 border-b border-border">
        <Link
          href="/community/stories"
          className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border-b-2 border-transparent hover:border-primary/50 -mb-px"
        >
          Stories
        </Link>
        <Link
          href="/community/discussions"
          className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border-b-2 border-transparent hover:border-primary/50 -mb-px"
        >
          Discussions
        </Link>
      </nav>

      {children}
    </div>
  );
}
