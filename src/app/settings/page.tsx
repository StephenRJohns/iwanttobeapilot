"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/toast";

interface UserSettings {
  name: string | null;
  email: string | null;
  tier: string;
  pilotGoal: string | null;
  zipCode: string | null;
  hasPassword: boolean;
  stripeSubscriptionId: string | null;
}

const GOAL_OPTIONS = [
  { value: "hobby", label: "Hobby Pilot (PPL)" },
  { value: "instrument", label: "IFR Pilot (PPL + Instrument)" },
  { value: "commercial", label: "Commercial Pilot" },
  { value: "cfi", label: "Flight Instructor (CFI/CFII)" },
  { value: "charter", label: "Private Charter Pilot" },
  { value: "regional", label: "Regional Airline Pilot" },
  { value: "major", label: "Major Airline Captain" },
  { value: "cargo", label: "Major Cargo Pilot" },
];

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [pilotGoal, setPilotGoal] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch("/api/user/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings(data);
        setName(data.name || "");
        setZipCode(data.zipCode || "");
        setPilotGoal(data.pilotGoal || "");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await fetch("/api/user/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), zipCode: zipCode.trim() || null, pilotGoal: pilotGoal || null }),
      });
      if (res.ok) {
        toast({ title: "Profile updated" });
        await update();
      } else {
        toast({ title: "Failed to update profile", variant: "destructive" });
      }
    } catch {
      toast({ title: "Failed to update profile", variant: "destructive" });
    } finally {
      setSavingProfile(false);
    }
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError("");
    if (newPassword.length < 8) { setPasswordError("Password must be at least 8 characters"); return; }
    if (newPassword !== confirmPassword) { setPasswordError("Passwords do not match"); return; }

    setSavingPassword(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: "Password updated" });
        setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      } else {
        setPasswordError(data.error || "Failed to update password");
      }
    } catch {
      setPasswordError("Failed to update password");
    } finally {
      setSavingPassword(false);
    }
  }

  async function deleteAccount() {
    if (deleteConfirm !== "DELETE") return;
    setDeleting(true);
    try {
      const res = await fetch("/api/user/account", { method: "DELETE" });
      if (res.ok) {
        await signOut({ callbackUrl: "/" });
      } else {
        const data = await res.json();
        toast({ title: data.error || "Failed to delete account", variant: "destructive" });
        setDeleting(false);
      }
    } catch {
      toast({ title: "Failed to delete account", variant: "destructive" });
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!settings) {
    return <p className="text-sm text-muted-foreground text-center py-20">Failed to load settings.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      {/* Profile */}
      <section className="rounded-lg border border-border bg-card p-5">
        <h2 className="text-sm font-semibold mb-4">Profile</h2>
        <form onSubmit={saveProfile} className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium block mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium block mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={settings.email || ""}
              disabled
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-muted-foreground cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground mt-1">Email cannot be changed.</p>
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium block mb-1.5">
              Zip Code
            </label>
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="e.g. 90210"
              maxLength={10}
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium block mb-1.5">
              Pilot Goal
            </label>
            <select
              value={pilotGoal}
              onChange={(e) => setPilotGoal(e.target.value)}
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
            >
              <option value="">Select your goal...</option>
              {GOAL_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={savingProfile}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {savingProfile && <Loader2 className="w-3 h-3 animate-spin" />}
            Save Profile
          </button>
        </form>
      </section>

      {/* Subscription */}
      <section className="rounded-lg border border-border bg-card p-5">
        <h2 className="text-sm font-semibold mb-4">Subscription</h2>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm">
              Current plan: <span className={`font-semibold ${settings.tier === "pro" ? "text-primary" : "text-muted-foreground"}`}>{settings.tier === "pro" ? "Pro" : "Free"}</span>
            </p>
            {settings.tier === "pro" && settings.stripeSubscriptionId && (
              <p className="text-xs text-muted-foreground mt-0.5">Managed via Stripe</p>
            )}
          </div>
          {settings.tier === "free" ? (
            <Link href="/pricing" className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
              Upgrade to Pro
            </Link>
          ) : (
            <Link href="/api/stripe/portal" className="px-4 py-2 border border-border rounded-md text-sm text-muted-foreground hover:bg-secondary transition-colors">
              Manage Subscription
            </Link>
          )}
        </div>
      </section>

      {/* Password */}
      <section className="rounded-lg border border-border bg-card p-5">
        <h2 className="text-sm font-semibold mb-4">
          {settings.hasPassword ? "Change Password" : "Set Password"}
        </h2>
        {!settings.hasPassword && (
          <p className="text-xs text-muted-foreground mb-4">
            Your account uses Google Sign-In. You can set a password to also sign in with email.
          </p>
        )}
        <form onSubmit={savePassword} className="space-y-3">
          {settings.hasPassword && (
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium block mb-1.5">Current Password</label>
              <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Enter current password"
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-primary transition-colors" />
            </div>
          )}
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium block mb-1.5">New Password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min 8 characters"
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-primary transition-colors" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium block mb-1.5">Confirm New Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter new password"
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-primary transition-colors" />
          </div>
          {passwordError && <p className="text-xs text-red-400">{passwordError}</p>}
          <button type="submit" disabled={savingPassword} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2">
            {savingPassword && <Loader2 className="w-3 h-3 animate-spin" />}
            {settings.hasPassword ? "Update Password" : "Set Password"}
          </button>
        </form>
      </section>

      {/* Delete Account */}
      <section className="rounded-lg border border-destructive/30 bg-card p-5">
        <h2 className="text-sm font-semibold text-destructive mb-2">Delete Account</h2>
        <p className="text-xs text-muted-foreground mb-4">
          This will permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground block">Type <strong>DELETE</strong> to confirm</label>
          <input
            type="text"
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value)}
            placeholder="DELETE"
            className="w-full max-w-xs bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-destructive transition-colors"
          />
          <button
            onClick={deleteAccount}
            disabled={deleteConfirm !== "DELETE" || deleting}
            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md text-sm font-medium hover:bg-destructive/90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {deleting && <Loader2 className="w-3 h-3 animate-spin" />}
            Delete My Account
          </button>
        </div>
      </section>
    </div>
  );
}
