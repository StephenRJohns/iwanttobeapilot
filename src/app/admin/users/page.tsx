"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Loader2, Save, ChevronLeft, ChevronRight, Plus, X, Trash2, KeyRound } from "lucide-react";
import { toast } from "@/components/ui/toast";

interface UserRow {
  id: string;
  name: string | null;
  email: string | null;
  tier: string;
  role: string;
  promoCodeId: string | null;
  stripeSubscriptionId: string | null;
  createdAt: string;
  _count: { stories: number; progress: number };
}

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTier, setEditTier] = useState("");
  const [editRole, setEditRole] = useState("");
  const [saving, setSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteUser, setConfirmDeleteUser] = useState<UserRow | null>(null);
  const limit = 25;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search) params.set("search", search);
      if (tierFilter) params.set("tier", tierFilter);
      if (roleFilter) params.set("role", roleFilter);
      const res = await fetch(`/api/admin/users?${params}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
        setTotal(data.total);
      }
    } finally {
      setLoading(false);
    }
  }, [page, search, tierFilter, roleFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  function startEdit(user: UserRow) {
    setEditingId(user.id);
    setEditTier(user.tier);
    setEditRole(user.role);
  }

  async function saveEdit(userId: string) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: editTier, role: editRole }),
      });
      if (res.ok) {
        toast({ title: "User updated" });
        setEditingId(null);
        fetchUsers();
      } else {
        const data = await res.json();
        toast({ title: data.error || "Failed to update", variant: "destructive" });
      }
    } catch {
      toast({ title: "Failed to update user", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  async function deleteUser(userId: string) {
    setDeletingId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      if (res.ok) {
        toast({ title: "User deleted" });
        setConfirmDeleteUser(null);
        fetchUsers();
      } else {
        const data = await res.json();
        toast({ title: data.error || "Failed to delete", variant: "destructive" });
      }
    } catch {
      toast({ title: "Failed to delete user", variant: "destructive" });
    } finally {
      setDeletingId(null);
    }
  }

  async function forcePasswordChange(userId: string) {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mustChangePassword: true }),
      });
      if (res.ok) {
        toast({ title: "User must change password on next login" });
      } else {
        const data = await res.json();
        toast({ title: data.error || "Failed to update", variant: "destructive" });
      }
    } catch {
      toast({ title: "Failed to update user", variant: "destructive" });
    }
  }

  const totalPages = Math.ceil(total / limit);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currentUserId = (session?.user as any)?.id;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by email or name..."
            className="w-full bg-background border border-border rounded-md pl-3 pr-3 py-1.5 text-sm outline-none focus:border-primary"
          />
        </div>
        <select
          value={tierFilter}
          onChange={(e) => { setTierFilter(e.target.value); setPage(1); }}
          className="bg-background border border-border rounded-md px-2 py-1.5 text-sm outline-none focus:border-primary"
        >
          <option value="">All tiers</option>
          <option value="free">Free</option>
          <option value="pro">Pro</option>
        </select>
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          className="bg-background border border-border rounded-md px-2 py-1.5 text-sm outline-none focus:border-primary"
        >
          <option value="">All roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          Add User
        </button>
      </div>

      <div className="border border-border rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-card/50">
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Tier</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Role</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Stories</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Created</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-8">
                  <Loader2 className="h-4 w-4 animate-spin mx-auto text-muted-foreground" />
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-muted-foreground text-xs">No users found.</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-b border-border last:border-0 hover:bg-card/30">
                  <td className="px-3 py-2 truncate max-w-[120px]">{user.name || "—"}</td>
                  <td className="px-3 py-2 truncate max-w-[180px]">{user.email}</td>
                  <td className="px-3 py-2">
                    {editingId === user.id ? (
                      <select
                        value={editTier}
                        onChange={(e) => setEditTier(e.target.value)}
                        className="bg-background border border-border rounded px-1.5 py-0.5 text-xs"
                      >
                        <option value="free">free</option>
                        <option value="pro">pro</option>
                      </select>
                    ) : (
                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                        user.tier === "pro" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
                      }`}>
                        {user.tier}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {editingId === user.id ? (
                      <select
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value)}
                        className="bg-background border border-border rounded px-1.5 py-0.5 text-xs"
                        disabled={user.id === currentUserId}
                      >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    ) : (
                      <span className={`text-xs font-medium ${user.role === "admin" ? "text-amber-400" : "text-muted-foreground"}`}>
                        {user.role}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">{user._count.stories}</td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2">
                    {editingId === user.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => saveEdit(user.id)}
                          disabled={saving}
                          className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
                        >
                          {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                          Save
                        </button>
                        <button onClick={() => setEditingId(null)} className="text-xs text-muted-foreground hover:text-foreground ml-2">
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button onClick={() => startEdit(user)} className="text-xs text-primary hover:text-primary/80">
                          Edit
                        </button>
                        {user.id !== currentUserId && (
                          <>
                            <button
                              onClick={() => forcePasswordChange(user.id)}
                              title="Force password change"
                              className="text-xs text-amber-400 hover:text-amber-300"
                            >
                              <KeyRound className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => setConfirmDeleteUser(user)}
                              className="text-xs text-destructive hover:text-destructive/80"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{total} users total</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-1 hover:text-foreground disabled:opacity-30">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span>Page {page} of {totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1 hover:text-foreground disabled:opacity-30">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {showAddModal && (
        <AddUserModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => { setShowAddModal(false); fetchUsers(); }}
        />
      )}

      {confirmDeleteUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setConfirmDeleteUser(null)} />
          <div className="relative w-full max-w-sm mx-4 bg-card border border-border rounded-lg p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <Trash2 className="h-5 w-5 text-destructive" />
              <h2 className="text-sm font-semibold">Delete User</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Are you sure you want to delete:</p>
            <p className="text-sm font-medium mb-4">{confirmDeleteUser.name || "Unnamed"} ({confirmDeleteUser.email})</p>
            <div className="flex items-center gap-2 justify-end">
              <button onClick={() => setConfirmDeleteUser(null)} className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                Cancel
              </button>
              <button
                onClick={() => deleteUser(confirmDeleteUser.id)}
                disabled={deletingId === confirmDeleteUser.id}
                className="px-3 py-1.5 text-sm bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                {deletingId === confirmDeleteUser.id ? <><Loader2 className="h-3 w-3 animate-spin" />Deleting...</> : <><Trash2 className="h-3 w-3" />Delete</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AddUserModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Valid email is required";
    if (!name.trim()) errs.name = "Name is required";
    if (!password || password.length < 8) errs.password = "Password must be at least 8 characters";
    if (password !== confirmPassword) errs.confirmPassword = "Passwords do not match";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password, role }),
      });
      if (res.ok) {
        const data = await res.json();
        toast({ title: `User created: ${data.email}` });
        onSuccess();
      } else {
        const data = await res.json();
        if (data.error?.includes("already exists")) setErrors({ email: data.error });
        else toast({ title: data.error || "Failed to create user", variant: "destructive" });
      }
    } catch {
      toast({ title: "Failed to create user", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md mx-4 bg-card border border-border rounded-lg p-6 shadow-xl">
        <button onClick={onClose} className="absolute top-3 right-3 p-1 text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
        <h2 className="text-sm font-semibold mb-4">Add New User</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          {[
            { label: "Email Address", key: "email", type: "email", value: email, onChange: (v: string) => setEmail(v), placeholder: "user@example.com" },
            { label: "Display Name", key: "name", type: "text", value: name, onChange: (v: string) => setName(v), placeholder: "John Doe" },
            { label: "Password", key: "password", type: "password", value: password, onChange: (v: string) => setPassword(v), placeholder: "Min 8 characters" },
            { label: "Confirm Password", key: "confirmPassword", type: "password", value: confirmPassword, onChange: (v: string) => setConfirmPassword(v), placeholder: "Re-enter password" },
          ].map(({ label, key, type, value, onChange, placeholder }) => (
            <div key={key}>
              <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium block mb-1">{label}</label>
              <input
                type={type}
                value={value}
                onChange={(e) => { onChange(e.target.value); setErrors((p) => ({ ...p, [key]: "" })); }}
                placeholder={placeholder}
                className={`w-full bg-background border rounded-md px-3 py-2 text-sm outline-none focus:border-primary transition-colors ${errors[key] ? "border-destructive" : "border-border"}`}
              />
              {errors[key] && <p className="text-xs text-destructive mt-0.5">{errors[key]}</p>}
            </div>
          ))}
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium block mb-1">Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-primary">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <p className="text-[10px] text-muted-foreground">User will be required to change password on first login.</p>
          <button type="submit" disabled={submitting} className="w-full bg-primary text-primary-foreground rounded-md py-2 text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {submitting ? <><Loader2 className="h-4 w-4 animate-spin" />Creating...</> : <><Plus className="h-4 w-4" />Create User</>}
          </button>
        </form>
      </div>
    </div>
  );
}
