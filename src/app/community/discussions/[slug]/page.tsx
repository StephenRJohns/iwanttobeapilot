"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { isPro } from "@/lib/tier";
import { formatDate, getInitials } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface Post {
  id: string;
  title: string;
  createdAt: string;
  viewCount: number;
  user: { id: string; name: string | null; email: string };
  _count: { replies: number };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export default function DiscussionCategoryPage() {
  const params = useParams<{ slug: string }>();
  const { data: session } = useSession();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pro = session ? isPro(session as any) : false;

  const [category, setCategory] = useState<Category | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [postError, setPostError] = useState("");

  useEffect(() => {
    fetch(`/api/discussions/categories`)
      .then((r) => r.json())
      .then((d) => {
        const cat = (d.categories || []).find((c: Category) => c.slug === params.slug);
        setCategory(cat || null);
        if (cat) {
          return fetch(`/api/discussions?categoryId=${cat.id}`);
        }
      })
      .then((r) => r?.json())
      .then((d) => {
        setPosts(d?.posts || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.slug]);

  async function handleNewPost(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setPostError("Title and body are required.");
      return;
    }
    setSubmitting(true);
    setPostError("");
    try {
      const res = await fetch("/api/discussions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryId: category!.id, title: title.trim(), body: body.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPostError(data.error || "Failed to post");
        return;
      }
      setPosts((prev) => [{ ...data.post, _count: { replies: 0 } }, ...prev]);
      setTitle("");
      setBody("");
      setShowForm(false);
    } catch {
      setPostError("Failed to post");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!category) {
    return <p className="text-sm text-muted-foreground">Category not found.</p>;
  }

  return (
    <div>
      <Link href="/community/discussions" className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block">
        ← Discussions
      </Link>

      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div>
          <h2 className="text-lg font-semibold">{category.name}</h2>
          {category.description && (
            <p className="text-xs text-muted-foreground mt-0.5">{category.description}</p>
          )}
        </div>
        {pro ? (
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            New Post
          </button>
        ) : (
          <Link
            href="/pricing"
            className="px-4 py-2 border border-border rounded-md text-sm text-muted-foreground hover:border-primary/50 transition-colors"
          >
            Upgrade to post
          </Link>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleNewPost} className="rounded-lg border border-border bg-card p-4 mb-4 space-y-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title"
            className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={5}
            placeholder="What's on your mind?"
            className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-primary transition-colors resize-y"
          />
          {postError && <p className="text-xs text-red-400">{postError}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {submitting ? "Posting..." : "Post"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-3 py-2 border border-border rounded-md text-sm text-muted-foreground hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {posts.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-12">
          No posts yet. Be the first to start a discussion!
        </p>
      ) : (
        <div className="space-y-2">
          {posts.map((post) => {
            const author = post.user.name || post.user.email;
            const initials = getInitials(author);
            return (
              <Link
                key={post.id}
                href={`/community/discussions/${params.slug}/${post.id}`}
                className="block rounded-lg border border-border bg-card p-4 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-semibold text-primary shrink-0 mt-0.5">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm">{post.title}</h3>
                    <div className="flex gap-3 text-xs text-muted-foreground mt-0.5 flex-wrap">
                      <span>{author}</span>
                      <span>{formatDate(post.createdAt)}</span>
                      <span>{post._count.replies} {post._count.replies === 1 ? "reply" : "replies"}</span>
                      <span>{post.viewCount} views</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
