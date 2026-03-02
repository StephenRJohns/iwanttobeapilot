"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { isPro } from "@/lib/tier";
import { formatDate, getInitials } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface Reply {
  id: string;
  body: string;
  createdAt: string;
  user: { id: string; name: string | null; email: string };
}

interface Post {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  viewCount: number;
  user: { id: string; name: string | null; email: string };
  replies: Reply[];
}

export default function DiscussionPostPage() {
  const params = useParams<{ slug: string; postId: string }>();
  const { data: session } = useSession();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pro = session ? isPro(session as any) : false;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyBody, setReplyBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [replyError, setReplyError] = useState("");

  useEffect(() => {
    fetch(`/api/discussions/${params.postId}`)
      .then((r) => r.json())
      .then((d) => {
        setPost(d.post || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.postId]);

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!replyBody.trim()) return;
    setSubmitting(true);
    setReplyError("");
    try {
      const res = await fetch(`/api/discussions/${params.postId}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: replyBody.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setReplyError(data.error || "Failed to reply");
        return;
      }
      setPost((prev) =>
        prev ? { ...prev, replies: [...prev.replies, data.reply] } : prev
      );
      setReplyBody("");
    } catch {
      setReplyError("Failed to reply");
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

  if (!post) {
    return <p className="text-sm text-muted-foreground">Post not found.</p>;
  }

  const postAuthor = post.user.name || post.user.email;
  const postInitials = getInitials(postAuthor);

  return (
    <div className="space-y-4">
      <Link
        href={`/community/discussions/${params.slug}`}
        className="text-sm text-muted-foreground hover:text-foreground inline-block"
      >
        ← Back to discussions
      </Link>

      {/* Original post */}
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
            {postInitials}
          </div>
          <div>
            <h2 className="font-semibold text-base">{post.title}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {postAuthor} · {formatDate(post.createdAt)} · {post.viewCount} views
            </p>
          </div>
        </div>
        <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap pl-11">
          {post.body}
        </div>
      </div>

      {/* Replies */}
      {post.replies.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
            {post.replies.length} {post.replies.length === 1 ? "Reply" : "Replies"}
          </h3>
          {post.replies.map((reply) => {
            const author = reply.user.name || reply.user.email;
            const initials = getInitials(author);
            return (
              <div key={reply.id} className="rounded-lg border border-border bg-card/50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
                    {initials}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {author} · {formatDate(reply.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap pl-8">
                  {reply.body}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Reply form */}
      {pro ? (
        <form onSubmit={handleReply} className="space-y-3">
          <textarea
            value={replyBody}
            onChange={(e) => setReplyBody(e.target.value)}
            rows={4}
            placeholder="Write a reply..."
            className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-primary transition-colors resize-y"
          />
          {replyError && <p className="text-xs text-red-400">{replyError}</p>}
          <button
            type="submit"
            disabled={submitting || !replyBody.trim()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            {submitting && <Loader2 className="w-3 h-3 animate-spin" />}
            Reply
          </button>
        </form>
      ) : (
        <div className="rounded-lg border border-border bg-card/50 p-4 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Upgrade to Pro to join the discussion.
          </p>
          <Link href="/pricing" className="text-sm text-primary hover:underline">
            Upgrade to Pro →
          </Link>
        </div>
      )}
    </div>
  );
}
