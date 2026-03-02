"use client";

import { useState, Suspense } from "react";
import { signIn, getSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, Eye, EyeOff } from "lucide-react";

function SignInForm() {
  const searchParams = useSearchParams();
  const justVerified = searchParams.get("verified") === "true";
  const justReset = searchParams.get("reset") === "true";
  const adminOnly = searchParams.get("admin") === "true";
  const sessionDisplaced = searchParams.get("error") === "SessionDisplaced";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: username,
        password,
        redirect: false,
      });

      if (result?.error || result?.ok === false) {
        try {
          const check = await fetch("/api/auth/account-type", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: username }),
          });
          const data = await check.json();
          if (data.provider === "google") {
            setLoading(false);
            setError('This account uses Google sign-in. Use the "Sign in with Google" button below, or set a password in Settings after signing in.');
            return;
          }
        } catch {}
        setLoading(false);
        setError("Invalid credentials. Please check your email and password.");
        return;
      }

      const session = await getSession();
      if (!session?.user) {
        setLoading(false);
        setError("Sign-in failed. Please try again.");
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((session.user as any)?.mustChangePassword) {
        window.location.href = "/auth/change-password";
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const role = (session.user as any)?.role;
      window.location.href = role === "admin" ? "/admin" : "/dashboard";
    } catch {
      setLoading(false);
      setError("Sign-in failed. Please try again.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-sm mx-auto p-6">
        <div className="text-center mb-6">
          <Link href="/" className="text-xl font-bold hover:text-primary transition-colors">
            I Want To Be A Pilot
          </Link>
          <p className="text-sm text-muted-foreground mt-2">
            Sign in to your account
          </p>
        </div>

        {sessionDisplaced && (
          <div className="mb-4 text-xs text-amber-400 bg-amber-800/10 border border-amber-800/20 rounded p-2 text-center">
            Your account was signed in from another location. Please sign in again.
          </div>
        )}

        {justVerified && (
          <div className="mb-4 text-xs text-primary bg-primary/10 border border-primary/20 rounded p-2 text-center">
            Email verified successfully! You can now sign in.
          </div>
        )}

        {justReset && (
          <div className="mb-4 text-xs text-primary bg-primary/10 border border-primary/20 rounded p-2 text-center">
            Password reset successfully! You can now sign in.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium block mb-1">
              Email
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Email address"
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
              required
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium block mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-background border border-border rounded-md px-3 py-2 pr-9 text-sm outline-none focus:border-primary transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="mt-1 text-right">
              <Link href="/auth/forgot-password" className="text-xs text-primary hover:text-primary/80">
                Forgot password?
              </Link>
            </div>
          </div>

          {error && (
            <div className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded p-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground rounded-md py-2 text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {!adminOnly && (
          <>
            <div className="mt-4">
              <button
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="w-full border border-border rounded-md py-2 text-sm hover:bg-secondary/50 transition-colors"
              >
                Sign in with Google
              </button>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link href="/auth/register" className="text-primary hover:underline">
                  Create one free
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <SignInForm />
    </Suspense>
  );
}
