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
      <div className="w-full max-w-md mx-auto p-6">
        <div className="text-center mb-6">
          <Link href="/" className="inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/IWTBAP_logo.png" alt="I Want To Be A Pilot" className="h-12 w-auto mx-auto" />
          </Link>
          <p className="text-sm text-muted-foreground mt-3">
            Sign in to your account
          </p>
        </div>

        {sessionDisplaced && (
          <div className="mb-4 text-xs text-primary bg-primary/10 border border-primary/20 rounded p-2 text-center">
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
              className="w-full bg-background border border-border ring-1 ring-border rounded-md px-3 py-2 text-sm outline-none focus:border-primary focus:ring-primary/30 transition-colors"
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
                className="w-full bg-background border border-border ring-1 ring-border rounded-md px-3 py-2 pr-9 text-sm outline-none focus:border-primary focus:ring-primary/30 transition-colors"
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
                className="w-full flex items-center justify-center gap-2 border border-border rounded-md py-2 text-sm hover:bg-secondary/50 transition-colors"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
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
