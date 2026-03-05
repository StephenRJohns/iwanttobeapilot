"use client";

import { useState, useEffect } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "@/components/ui/toast";

export default function AdminSettingsPage() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState("");
  const [bannerEnabled, setBannerEnabled] = useState(false);
  const [bannerMessage, setBannerMessage] = useState("");
  const [bannerColor, setBannerColor] = useState("blue");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setMaintenanceMode(data.maintenanceMode);
          setMaintenanceMessage(data.maintenanceMessage || "");
          setBannerEnabled(data.bannerEnabled ?? false);
          setBannerMessage(data.bannerMessage || "");
          setBannerColor(data.bannerColor || "blue");
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          maintenanceMode,
          maintenanceMessage: maintenanceMessage || null,
          bannerEnabled,
          bannerMessage: bannerMessage || null,
          bannerColor,
        }),
      });
      if (res.ok) {
        window.dispatchEvent(new Event("maintenance-updated"));
        toast({ title: maintenanceMode ? "Maintenance mode enabled" : "Maintenance mode disabled" });
      } else {
        toast({ title: "Failed to save settings", variant: "destructive" });
      }
    } catch {
      toast({ title: "Failed to save settings", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-4">
      <div className="border border-border rounded-lg p-4">
        <h2 className="text-sm font-semibold mb-4">Maintenance Mode</h2>

        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <div>
              <div className="text-sm">Enable Maintenance Mode</div>
              <div className="text-xs text-muted-foreground">
                Non-admin users will see a maintenance page
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={maintenanceMode}
              onClick={() => setMaintenanceMode(!maintenanceMode)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                maintenanceMode ? "bg-amber-500" : "bg-secondary"
              }`}
            >
              <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition-transform ${maintenanceMode ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </label>

          {maintenanceMode && (
            <div className="bg-amber-500/5 border border-amber-500/20 rounded p-3">
              <p className="text-xs font-medium text-amber-400">Site will be inaccessible to non-admin users</p>
            </div>
          )}

          <div>
            <label className="text-xs text-muted-foreground block mb-1">Custom Message (optional)</label>
            <textarea
              value={maintenanceMessage}
              onChange={(e) => setMaintenanceMessage(e.target.value)}
              placeholder="We're currently performing scheduled maintenance. Please try again later."
              rows={3}
              className="w-full bg-background border border-border rounded px-3 py-2 text-sm outline-none focus:border-primary resize-none"
            />
            <p className="text-[10px] text-muted-foreground mt-1">Leave blank to use the default message.</p>
          </div>

        </div>
      </div>

      {/* Site Banner */}
      <div className="border border-border rounded-lg p-4">
        <h2 className="text-sm font-semibold mb-4">Site Banner</h2>

        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <div>
              <div className="text-sm">Enable Site Banner</div>
              <div className="text-xs text-muted-foreground">
                Display a colored banner below the header on all pages
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={bannerEnabled}
              onClick={() => setBannerEnabled(!bannerEnabled)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                bannerEnabled ? "bg-blue-500" : "bg-secondary"
              }`}
            >
              <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition-transform ${bannerEnabled ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </label>

          <div>
            <label className="text-xs text-muted-foreground block mb-1">Banner Message</label>
            <textarea
              value={bannerMessage}
              onChange={(e) => setBannerMessage(e.target.value)}
              placeholder="Enter banner message..."
              rows={2}
              className="w-full bg-background border border-border rounded px-3 py-2 text-sm outline-none focus:border-primary resize-none"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground block mb-2">Banner Color</label>
            <div className="flex gap-2">
              {(["blue", "yellow", "red", "green"] as const).map((color) => {
                const colorClasses: Record<string, string> = {
                  blue: "bg-blue-600",
                  yellow: "bg-amber-500",
                  red: "bg-red-600",
                  green: "bg-green-600",
                };
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setBannerColor(color)}
                    className={`w-8 h-8 rounded-full ${colorClasses[color]} transition-all ${
                      bannerColor === color ? "ring-2 ring-offset-2 ring-offset-background ring-white scale-110" : "opacity-60 hover:opacity-100"
                    }`}
                    title={color}
                  />
                );
              })}
            </div>
          </div>

          {bannerEnabled && bannerMessage && (
            <div className="text-xs text-muted-foreground">
              Preview:
              <div className={`mt-1 px-3 py-2 rounded text-white text-center text-sm ${
                { blue: "bg-blue-600", yellow: "bg-amber-500", red: "bg-red-600", green: "bg-green-600" }[bannerColor]
              }`}>
                {bannerMessage}
              </div>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-primary text-primary-foreground px-4 py-1.5 rounded text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
      >
        {saving ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Saving...</> : <><Save className="w-3.5 h-3.5" />Save Settings</>}
      </button>
    </div>
  );
}
