"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Loader2, ChevronLeft, ChevronRight, Ban, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/toast";

interface PromoCode {
  id: string;
  code: string;
  blockName: string | null;
  maxUses: number;
  uses: number;
  revoked: boolean;
  expiresAt: string | null;
  createdAt: string;
}

function getStatus(code: PromoCode): { label: string; color: string } {
  if (code.revoked) return { label: "Revoked", color: "bg-red-400/10 text-red-400" };
  if (code.expiresAt && new Date(code.expiresAt) < new Date()) return { label: "Expired", color: "bg-amber-400/10 text-amber-400" };
  if (code.uses >= 1) return { label: "Used", color: "bg-secondary text-muted-foreground" };
  return { label: "Active", color: "bg-primary/10 text-primary" };
}

export default function AdminPromoCodesPage() {
  const [codes, setCodes] = useState<PromoCode[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const limit = 50;

  const [showCreate, setShowCreate] = useState(false);
  const [createMode, setCreateMode] = useState<"single" | "block">("single");
  const [newCode, setNewCode] = useState("");
  const [newBlockName, setNewBlockName] = useState("");
  const [newBlockCount, setNewBlockCount] = useState(10);
  const [newExpires, setNewExpires] = useState("");
  const [creating, setCreating] = useState(false);

  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);

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
    }
  }, [page, statusFilter]);

  useEffect(() => { fetchCodes(); }, [fetchCodes]);

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
      if (newExpires) body.expiresAt = newExpires;
      const res = await fetch("/api/admin/promo-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const data = await res.json();
        const count = data.count || 1;
        toast({ title: `${count} promo code${count > 1 ? "s" : ""} created` });
        setNewCode(""); setNewBlockName(""); setNewBlockCount(10); setNewExpires(""); setShowCreate(false);
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

  async function bulkDelete() {
    if (selectedIds.size === 0) return;
    setBulkDeleting(true);
    try {
      const res = await fetch("/api/admin/promo-codes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      });
      if (res.ok) {
        const data = await res.json();
        let msg = `${data.deleted} code${data.deleted !== 1 ? "s" : ""} deleted`;
        if (data.skipped > 0) msg += `, ${data.skipped} skipped (already redeemed)`;
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

  function toggleSelect(id: string) {
    setSelectedIds((prev) => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
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
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          New Codes
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="border border-border rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-4 text-sm">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" name="createMode" checked={createMode === "single"} onChange={() => setCreateMode("single")} className="accent-primary" />
              Single Code
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" name="createMode" checked={createMode === "block"} onChange={() => setCreateMode("block")} className="accent-primary" />
              Code Block
            </label>
          </div>
          {createMode === "single" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium block mb-1">Code</label>
                <input type="text" value={newCode} onChange={(e) => setNewCode(e.target.value.toUpperCase())} placeholder="PILOT2026" required
                  className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium block mb-1">Expires (optional)</label>
                <input type="date" value={newExpires} onChange={(e) => setNewExpires(e.target.value)}
                  className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-sm outline-none focus:border-primary" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium block mb-1">Block Name</label>
                <input type="text" value={newBlockName} onChange={(e) => setNewBlockName(e.target.value.toUpperCase())} placeholder="WORKSHOP"
                  className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium block mb-1">Number of Codes</label>
                <input type="number" value={newBlockCount} min={1} max={500} onChange={(e) => setNewBlockCount(Math.max(1, Math.min(500, parseInt(e.target.value) || 1)))} required
                  className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium block mb-1">Expires (optional)</label>
                <input type="date" value={newExpires} onChange={(e) => setNewExpires(e.target.value)}
                  className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-sm outline-none focus:border-primary" />
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <button type="submit" disabled={creating} className="bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50 flex items-center gap-1">
              {creating && <Loader2 className="h-3 w-3 animate-spin" />}
              {createMode === "block" ? `Create ${newBlockCount} Codes` : "Create"}
            </button>
            <button type="button" onClick={() => setShowCreate(false)} className="text-sm text-muted-foreground hover:text-foreground">Cancel</button>
          </div>
        </form>
      )}

      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 border border-border rounded-lg px-4 py-2 bg-card/50">
          <span className="text-sm text-muted-foreground">{selectedIds.size} selected</span>
          <button onClick={bulkDelete} disabled={bulkDeleting} className="flex items-center gap-1.5 text-sm text-destructive hover:text-destructive/80 disabled:opacity-50">
            {bulkDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
            Delete Selected
          </button>
          <button onClick={() => setSelectedIds(new Set())} className="text-sm text-muted-foreground hover:text-foreground ml-auto">Clear</button>
        </div>
      )}

      <div className="border border-border rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-card/50">
              <th className="px-3 py-2 w-8">
                <input type="checkbox" checked={codes.length > 0 && selectedIds.size === codes.length} onChange={() => selectedIds.size === codes.length ? setSelectedIds(new Set()) : setSelectedIds(new Set(codes.map((c) => c.id)))} className="accent-primary" />
              </th>
              {["Code", "Block", "Redeemed", "Status", "Expires", "Created", "Actions"].map((h) => (
                <th key={h} className="text-left px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="text-center py-8"><Loader2 className="h-4 w-4 animate-spin mx-auto text-muted-foreground" /></td></tr>
            ) : codes.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-8 text-muted-foreground text-xs">No promo codes found.</td></tr>
            ) : (
              codes.map((code) => {
                const status = getStatus(code);
                return (
                  <tr key={code.id} className="border-b border-border last:border-0">
                    <td className="px-3 py-2"><input type="checkbox" checked={selectedIds.has(code.id)} onChange={() => toggleSelect(code.id)} className="accent-primary" /></td>
                    <td className="px-3 py-2"><code className="text-xs font-mono bg-secondary px-1.5 py-0.5 rounded">{code.code}</code></td>
                    <td className="px-3 py-2 text-xs text-muted-foreground">{code.blockName || "—"}</td>
                    <td className="px-3 py-2 text-xs">{code.uses > 0 ? "Yes" : "No"}</td>
                    <td className="px-3 py-2"><span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${status.color}`}>{status.label}</span></td>
                    <td className="px-3 py-2 text-xs text-muted-foreground">{code.expiresAt ? new Date(code.expiresAt).toLocaleDateString() : "—"}</td>
                    <td className="px-3 py-2 text-xs text-muted-foreground">{new Date(code.createdAt).toLocaleDateString()}</td>
                    <td className="px-3 py-2">
                      <button onClick={() => toggleRevoke(code)} disabled={actionLoading === code.id} className={`text-xs flex items-center gap-1 ${code.revoked ? "text-primary hover:text-primary/80" : "text-red-400 hover:text-red-300"}`}>
                        {actionLoading === code.id ? <Loader2 className="h-3 w-3 animate-spin" /> : code.revoked ? <RotateCcw className="h-3 w-3" /> : <Ban className="h-3 w-3" />}
                        {code.revoked ? "Un-revoke" : "Revoke"}
                      </button>
                    </td>
                  </tr>
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
