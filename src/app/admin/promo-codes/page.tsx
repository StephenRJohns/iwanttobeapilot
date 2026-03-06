"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Plus,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Ban,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Trash2,
  Layers,
  UserPlus,
  X,
} from "lucide-react";
import { toast } from "@/components/ui/toast";

interface AssignedUser {
  id: string;
  email: string | null;
  name: string | null;
}

interface PromoCode {
  id: string;
  code: string;
  blockName: string | null;
  assignedTo: AssignedUser | null;
  maxUses: number;
  uses: number;
  revoked: boolean;
  discountPct: number;
  durationMonths: number | null;
  expiresAt: string | null;
  createdAt: string;
}

interface Redeemer {
  id: string;
  name: string | null;
  email: string | null;
  tier: string;
  createdAt: string;
}

function getStatus(code: PromoCode): { label: string; color: string } {
  if (code.revoked) return { label: "Revoked", color: "bg-red-400/10 text-red-400" };
  if (code.expiresAt && new Date(code.expiresAt) < new Date())
    return { label: "Expired", color: "bg-amber-400/10 text-amber-400" };
  if (code.uses >= code.maxUses)
    return { label: "Used", color: "bg-secondary text-muted-foreground" };
  return { label: "Active", color: "bg-primary/10 text-primary" };
}

export default function AdminPromoCodesPage() {
  const [codes, setCodes] = useState<PromoCode[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const limit = 50;

  // Create form
  const [showCreate, setShowCreate] = useState(false);
  const [createMode, setCreateMode] = useState<"single" | "block">("single");
  const [newCode, setNewCode] = useState("");
  const [newBlockName, setNewBlockName] = useState("");
  const [newBlockCount, setNewBlockCount] = useState(10);
  const [newDiscountMode, setNewDiscountMode] = useState<"free" | "custom">("free");
  const [newCustomPct, setNewCustomPct] = useState(50);
  const [newDurationMode, setNewDurationMode] = useState<"never" | "months">("never");
  const [newDurationMonths, setNewDurationMonths] = useState(3);
  const [newDistributorEmail, setNewDistributorEmail] = useState("");
  const [creating, setCreating] = useState(false);

  // Row actions
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [redeemers, setRedeemers] = useState<Redeemer[]>([]);
  const [redeemersLoading, setRedeemersLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Multi-select
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);

  // Assign panel
  const [showAssignPanel, setShowAssignPanel] = useState(false);
  const [assignEmail, setAssignEmail] = useState("");
  const [assignLoading, setAssignLoading] = useState(false);

  const fetchCodes = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`/api/admin/promo-codes?${params}`);
      if (res.ok) {
        const data = await res.json();
        setCodes(data.codes);
        setTotal(data.total);
      }
    } finally {
      setLoading(false);
      setSelectedIds(new Set());
      setShowAssignPanel(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { fetchCodes(); }, [fetchCodes]);

  // ── Create ──────────────────────────────────────────────────────────────────
  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      const body: Record<string, unknown> = {};
      if (createMode === "block") {
        body.count = newBlockCount;
        if (newBlockName.trim()) body.blockName = newBlockName.trim();
      } else {
        if (!newCode.trim()) return;
        body.code = newCode.trim();
      }
      body.discountPct = newDiscountMode === "free" ? 100 : newCustomPct;
      body.durationMonths = newDurationMode === "months" ? newDurationMonths : null;

      const res = await fetch("/api/admin/promo-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const data = await res.json();
        const count = data.count || 1;

        // Optionally assign distributor right away
        if (newDistributorEmail.trim()) {
          const assignBody = createMode === "block" && newBlockName.trim()
            ? { email: newDistributorEmail.trim(), blockName: newBlockName.trim().toUpperCase() }
            : createMode === "single"
            ? { email: newDistributorEmail.trim(), codeId: (data.id ?? data.codes?.[0]?.id) }
            : { email: newDistributorEmail.trim(), blockName: (data.codes?.[0]?.blockName ?? undefined) };
          await fetch("/api/admin/promo-codes/assign", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(assignBody),
          });
        }

        toast({ title: `${count} promo code${count > 1 ? "s" : ""} created` });
        setNewCode(""); setNewBlockName(""); setNewBlockCount(10);
        setNewDiscountMode("free"); setNewCustomPct(50);
        setNewDurationMode("never"); setNewDurationMonths(3);
        setNewDistributorEmail("");
        setShowCreate(false);
        fetchCodes();
      } else {
        const data = await res.json();
        toast({ title: data.error || "Failed to create", variant: "destructive" });
      }
    } catch {
      toast({ title: "Failed to create promo code", variant: "destructive" });
    } finally {
      setCreating(false);
    }
  }

  // ── Revoke ──────────────────────────────────────────────────────────────────
  async function toggleRevoke(code: PromoCode) {
    setActionLoading(code.id);
    try {
      const res = await fetch(`/api/admin/promo-codes/${code.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ revoked: !code.revoked }),
      });
      if (res.ok) {
        toast({ title: code.revoked ? "Code un-revoked" : "Code revoked" });
        fetchCodes();
      } else {
        toast({ title: "Failed to update", variant: "destructive" });
      }
    } finally {
      setActionLoading(null);
    }
  }

  // ── Redeemers ───────────────────────────────────────────────────────────────
  async function toggleRedeemers(codeId: string) {
    if (expandedId === codeId) { setExpandedId(null); return; }
    setExpandedId(codeId);
    setRedeemersLoading(true);
    try {
      const res = await fetch(`/api/admin/promo-codes/${codeId}/users`);
      if (res.ok) setRedeemers((await res.json()).users);
    } finally {
      setRedeemersLoading(false);
    }
  }

  // ── Assign distributor (bulk) ────────────────────────────────────────────────
  async function handleBulkAssign(e: React.FormEvent) {
    e.preventDefault();
    if (selectedIds.size === 0) return;
    setAssignLoading(true);

    const selected = codes.filter((c) => selectedIds.has(c.id));
    const blockNames = [...new Set(selected.map((c) => c.blockName).filter(Boolean))];
    const allSameBlock = blockNames.length === 1 && selected.every((c) => c.blockName === blockNames[0]);

    try {
      let totalAssigned = 0;
      if (allSameBlock) {
        const res = await fetch("/api/admin/promo-codes/assign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: assignEmail.trim() || null, blockName: blockNames[0] }),
        });
        const data = await res.json();
        if (!res.ok) { toast({ title: data.error || "Failed to assign", variant: "destructive" }); return; }
        totalAssigned = data.assigned;
      } else {
        for (const codeId of selectedIds) {
          const res = await fetch("/api/admin/promo-codes/assign", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: assignEmail.trim() || null, codeId }),
          });
          if (res.ok) totalAssigned++;
        }
      }

      const emailLabel = assignEmail.trim();
      toast({
        title: emailLabel
          ? `${totalAssigned} code${totalAssigned !== 1 ? "s" : ""} assigned to ${emailLabel}`
          : `${totalAssigned} code${totalAssigned !== 1 ? "s" : ""} unassigned`,
      });
      setShowAssignPanel(false);
      setAssignEmail("");
      fetchCodes();
    } catch {
      toast({ title: "Failed to assign", variant: "destructive" });
    } finally {
      setAssignLoading(false);
    }
  }

  // ── Delete ──────────────────────────────────────────────────────────────────
  async function deleteOne(code: PromoCode) {
    const msg = code.uses > 0
      ? `Delete "${code.code}"? It has been redeemed — the redeemer keeps their tier but the code link is cleared.`
      : `Delete code "${code.code}"?`;
    if (!window.confirm(msg)) return;
    setDeletingId(code.id);
    try {
      const res = await fetch("/api/admin/promo-codes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [code.id], force: true }),
      });
      if (res.ok) { toast({ title: "Code deleted" }); fetchCodes(); }
      else toast({ title: "Failed to delete", variant: "destructive" });
    } catch {
      toast({ title: "Failed to delete code", variant: "destructive" });
    } finally {
      setDeletingId(null);
    }
  }

  async function bulkDelete(force = false) {
    if (selectedIds.size === 0) return;
    if (force && !window.confirm(
      `Force-delete ${selectedIds.size} code(s)? Redeemed codes will be removed and redeemer code-links cleared (users keep their tier).`
    )) return;
    setBulkDeleting(true);
    try {
      const res = await fetch("/api/admin/promo-codes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedIds), force }),
      });
      if (res.ok) {
        const data = await res.json();
        let msg = `${data.deleted} code${data.deleted !== 1 ? "s" : ""} deleted`;
        if (data.skipped > 0) msg += `, ${data.skipped} skipped (redeemed — use Force Delete)`;
        toast({ title: msg });
        fetchCodes();
      } else {
        toast({ title: "Failed to delete", variant: "destructive" });
      }
    } catch {
      toast({ title: "Failed to delete codes", variant: "destructive" });
    } finally {
      setBulkDeleting(false);
    }
  }

  // ── Selection ───────────────────────────────────────────────────────────────
  function toggleSelect(id: string) {
    setSelectedIds((prev) => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
    setShowAssignPanel(false);
  }

  function toggleSelectAll() {
    setSelectedIds(selectedIds.size === codes.length ? new Set() : new Set(codes.map((c) => c.id)));
    setShowAssignPanel(false);
  }

  const totalPages = Math.ceil(total / limit);
  const selectedHaveUsed = Array.from(selectedIds).some((id) => (codes.find((c) => c.id === id)?.uses ?? 0) > 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="bg-background border border-border rounded-md px-2 py-1.5 text-sm outline-none focus:border-primary"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="revoked">Revoked</option>
          <option value="expired">Expired</option>
        </select>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          New Codes
        </button>
      </div>

      {/* Create Form */}
      {showCreate && (
        <form onSubmit={handleCreate} className="border border-border rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-4 text-sm">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" name="createMode" checked={createMode === "single"} onChange={() => setCreateMode("single")} className="accent-primary" />
              Single Code
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" name="createMode" checked={createMode === "block"} onChange={() => setCreateMode("block")} className="accent-primary" />
              <Layers className="h-3.5 w-3.5" /> Code Block
            </label>
          </div>

          {createMode === "single" ? (
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium block mb-1">Code</label>
              <input type="text" value={newCode} onChange={(e) => setNewCode(e.target.value.toUpperCase())} placeholder="PILOT2026"
                className="w-full max-w-xs bg-background border border-border rounded-md px-3 py-1.5 text-sm outline-none focus:border-primary" required />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium block mb-1">Block Name</label>
                <input type="text" value={newBlockName} onChange={(e) => setNewBlockName(e.target.value.toUpperCase())} placeholder="WORKSHOP"
                  className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-sm outline-none focus:border-primary" />
                <p className="text-xs text-muted-foreground mt-0.5">Prefix for codes (e.g. WORKSHOP-A2B3C4)</p>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium block mb-1">Number of Codes</label>
                <input type="number" value={newBlockCount} onChange={(e) => setNewBlockCount(Math.max(1, Math.min(500, parseInt(e.target.value) || 1)))}
                  min={1} max={500} className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-sm outline-none focus:border-primary" required />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium block mb-1">Discount</label>
              <div className="flex items-center gap-2">
                <select value={newDiscountMode} onChange={(e) => setNewDiscountMode(e.target.value as "free" | "custom")}
                  className="bg-background border border-border rounded-md px-2 py-1.5 text-sm outline-none focus:border-primary">
                  <option value="free">Free (100% off)</option>
                  <option value="custom">Custom %</option>
                </select>
                {newDiscountMode === "custom" && (
                  <div className="flex items-center gap-1">
                    <input type="number" value={newCustomPct}
                      onChange={(e) => setNewCustomPct(Math.max(1, Math.min(99, parseInt(e.target.value) || 1)))}
                      min={1} max={99} className="w-16 bg-background border border-border rounded-md px-2 py-1.5 text-sm outline-none focus:border-primary" />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium block mb-1">Access Duration</label>
              <div className="flex items-center gap-2">
                <select value={newDurationMode} onChange={(e) => setNewDurationMode(e.target.value as "never" | "months")}
                  className="bg-background border border-border rounded-md px-2 py-1.5 text-sm outline-none focus:border-primary">
                  <option value="never">Never expires</option>
                  <option value="months">Months after activation</option>
                </select>
                {newDurationMode === "months" && (
                  <div className="flex items-center gap-1">
                    <input type="number" value={newDurationMonths} onChange={(e) => setNewDurationMonths(Math.max(1, parseInt(e.target.value) || 1))}
                      min={1} className="w-16 bg-background border border-border rounded-md px-2 py-1.5 text-sm outline-none focus:border-primary" />
                    <span className="text-sm text-muted-foreground">mo</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium block mb-1">
              Distributor Email <span className="normal-case font-normal">(optional)</span>
            </label>
            <input
              type="email"
              value={newDistributorEmail}
              onChange={(e) => setNewDistributorEmail(e.target.value)}
              placeholder="user@example.com — leave blank to assign later"
              className="w-full max-w-sm bg-background border border-border rounded-md px-3 py-1.5 text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-2">
            <button type="submit" disabled={creating}
              className="bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50 flex items-center gap-1">
              {creating && <Loader2 className="h-3 w-3 animate-spin" />}
              {createMode === "block" ? `Create ${newBlockCount} Codes` : "Create"}
            </button>
            <button type="button" onClick={() => setShowCreate(false)} className="text-sm text-muted-foreground hover:text-foreground">Cancel</button>
          </div>
        </form>
      )}

      {/* Selection action bar */}
      {selectedIds.size > 0 && (
        <div className="border border-primary/30 rounded-lg bg-primary/5 overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-2.5 flex-wrap">
            <span className="text-sm font-medium">{selectedIds.size} code{selectedIds.size !== 1 ? "s" : ""} selected</span>

            <button
              onClick={() => { setShowAssignPanel(!showAssignPanel); setAssignEmail(""); }}
              className="flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <UserPlus className="h-3.5 w-3.5" />
              Assign to Distributor
            </button>

            <div className="w-px h-4 bg-border" />

            <button onClick={() => bulkDelete(false)} disabled={bulkDeleting}
              className="flex items-center gap-1.5 text-sm text-destructive hover:text-destructive/80 disabled:opacity-50">
              {bulkDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
              Delete
            </button>
            {selectedHaveUsed && (
              <button onClick={() => bulkDelete(true)} disabled={bulkDeleting}
                className="flex items-center gap-1.5 text-sm text-orange-400 hover:text-orange-300 disabled:opacity-50"
                title="Delete including redeemed codes">
                <Trash2 className="h-3.5 w-3.5" /> Force Delete
              </button>
            )}

            <button onClick={() => { setSelectedIds(new Set()); setShowAssignPanel(false); }}
              className="ml-auto text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>

          {showAssignPanel && (
            <form onSubmit={handleBulkAssign} className="border-t border-primary/20 px-4 py-3 bg-background/60 space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Assign distributor — selected user will be given these codes to share with others
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <input
                  type="email"
                  value={assignEmail}
                  onChange={(e) => setAssignEmail(e.target.value)}
                  placeholder="distributor@example.com"
                  className="bg-background border border-border rounded-md px-3 py-1.5 text-sm outline-none focus:border-primary w-72"
                  autoFocus
                />
                <button type="submit" disabled={assignLoading || !assignEmail.trim()}
                  className="bg-primary text-primary-foreground px-4 py-1.5 rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50 flex items-center gap-1.5">
                  {assignLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <UserPlus className="h-3.5 w-3.5" />
                  Assign {selectedIds.size} Code{selectedIds.size !== 1 ? "s" : ""}
                </button>
                <button type="button" onClick={() => setShowAssignPanel(false)}
                  className="text-sm text-muted-foreground hover:text-foreground">
                  Cancel
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                The distributor shares code(s) with others; recipients self-redeem to get Pro access.
                Leave email blank and submit to unassign.
              </p>
            </form>
          )}
        </div>
      )}

      {/* Table */}
      <div className="border border-border rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-card/50">
              <th className="px-3 py-2 w-8">
                <input type="checkbox" checked={codes.length > 0 && selectedIds.size === codes.length} onChange={toggleSelectAll} className="accent-primary" />
              </th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Code</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Block</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Distributor</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Discount</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Duration</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Used</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Created</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={10} className="text-center py-8"><Loader2 className="h-4 w-4 animate-spin mx-auto text-muted-foreground" /></td></tr>
            ) : codes.length === 0 ? (
              <tr><td colSpan={10} className="text-center py-8 text-muted-foreground text-xs">No promo codes found.</td></tr>
            ) : (
              codes.map((code) => {
                const status = getStatus(code);
                return (
                  <React.Fragment key={code.id}>
                    <tr className="border-b border-border last:border-0 hover:bg-card/30 transition-colors">
                      <td className="px-3 py-2">
                        <input type="checkbox" checked={selectedIds.has(code.id)} onChange={() => toggleSelect(code.id)} className="accent-primary" />
                      </td>
                      <td className="px-3 py-2">
                        <code className="text-xs font-mono bg-secondary px-1.5 py-0.5 rounded">{code.code}</code>
                      </td>
                      <td className="px-3 py-2 text-xs text-muted-foreground">{code.blockName || "—"}</td>
                      <td className="px-3 py-2 text-xs">
                        {code.assignedTo ? (
                          <span className="text-foreground" title={code.assignedTo.name ?? ""}>{code.assignedTo.email}</span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-xs text-muted-foreground">
                        {code.discountPct === 100 ? <span className="text-emerald-400 font-medium">Free</span> : `${code.discountPct}% off`}
                      </td>
                      <td className="px-3 py-2 text-xs text-muted-foreground">{code.durationMonths ? `${code.durationMonths} mo` : "—"}</td>
                      <td className="px-3 py-2 text-xs">{code.uses}/{code.maxUses}</td>
                      <td className="px-3 py-2">
                        <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${status.color}`}>{status.label}</span>
                      </td>
                      <td className="px-3 py-2 text-xs text-muted-foreground">{new Date(code.createdAt).toLocaleDateString()}</td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <button onClick={() => toggleRevoke(code)} disabled={actionLoading === code.id}
                            className={`text-xs flex items-center gap-1 ${code.revoked ? "text-primary hover:text-primary/80" : "text-muted-foreground hover:text-red-400"}`}
                            title={code.revoked ? "Un-revoke" : "Revoke"}>
                            {actionLoading === code.id ? <Loader2 className="h-3 w-3 animate-spin" /> : code.revoked ? <RotateCcw className="h-3 w-3" /> : <Ban className="h-3 w-3" />}
                          </button>
                          {code.uses > 0 && (
                            <button onClick={() => toggleRedeemers(code.id)}
                              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-0.5">
                              {expandedId === code.id ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                              Users
                            </button>
                          )}
                          <button onClick={() => deleteOne(code)} disabled={deletingId === code.id}
                            className="text-xs text-muted-foreground hover:text-destructive" title="Delete">
                            {deletingId === code.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                          </button>
                        </div>
                      </td>
                    </tr>

                    {expandedId === code.id && (
                      <tr className="border-b border-border bg-card/30">
                        <td colSpan={10} className="px-6 py-3">
                          {redeemersLoading ? (
                            <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                          ) : redeemers.length === 0 ? (
                            <span className="text-xs text-muted-foreground">No redeemers.</span>
                          ) : (
                            <div className="space-y-1">
                              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Redeemed by</p>
                              {redeemers.map((u) => (
                                <div key={u.id} className="text-xs flex items-center gap-3">
                                  <span className="font-medium">{u.email}</span>
                                  {u.name && <span className="text-muted-foreground">{u.name}</span>}
                                  <span className={`px-1.5 py-0.5 rounded ${u.tier === "pro" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>
                                    {u.tier}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{total} codes total</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-1 hover:text-foreground disabled:opacity-30"><ChevronLeft className="h-4 w-4" /></button>
            <span>Page {page} of {totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1 hover:text-foreground disabled:opacity-30"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      )}
    </div>
  );
}
