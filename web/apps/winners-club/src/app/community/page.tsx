"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

interface ForumPost {
  id: string;
  title: string;
  body: string;
  authorName: string;
  authorAvatar: string;
  createdAt: string;
  replyCount: number;
  category: string;
}

const SPORTS_FILTERS = ["All", "NFL", "NBA", "MLB", "NHL", "Soccer", "MMA", "Parlays", "General"];

export default function CommunityPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [showNewPost, setShowNewPost] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newCategory, setNewCategory] = useState("General");
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    async function loadPosts() {
      try {
        const res = await fetch("/api/community/posts");
        if (res.ok) {
          const data = await res.json();
          setPosts(data.posts || []);
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadPosts();
  }, []);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newTitle.trim()) return;
    setIsPosting(true);
    try {
      const res = await fetch("/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          body: newBody,
          category: newCategory,
          authorId: user.id,
          authorName: user.name || user.username,
          authorAvatar: user.profile_pic_url || "",
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setPosts((prev) => [data.post, ...prev]);
        setNewTitle("");
        setNewBody("");
        setNewCategory("General");
        setShowNewPost(false);
      }
    } finally {
      setIsPosting(false);
    }
  };

  const filtered = filter === "All" ? posts : posts.filter((p) => p.category === filter);

  const formatDate = (d: string) => {
    const date = new Date(d);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return "just now";
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Community</h1>
          <p className="text-gray-400 mt-1">Discuss picks, strategies, and results with the community</p>
        </div>
        {user && (
          <button
            onClick={() => setShowNewPost(!showNewPost)}
            className="px-4 py-2 bg-[#F59E0B] text-[#0A0A0A] rounded-lg hover:bg-[#D97706] transition-colors font-bold"
          >
            {showNewPost ? "Cancel" : "+ New Post"}
          </button>
        )}
      </div>

      {/* New Post Form */}
      {showNewPost && user && (
        <form onSubmit={handlePost} className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-6 mb-6">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Post title..."
            required
            className="w-full px-4 py-2 bg-[#111111] border border-[#2A2A2A] rounded-lg focus:outline-none focus:border-[#F59E0B] text-white mb-4"
          />
          <textarea
            value={newBody}
            onChange={(e) => setNewBody(e.target.value)}
            placeholder="Share your thoughts, analysis, or picks discussion..."
            rows={4}
            className="w-full px-4 py-2 bg-[#111111] border border-[#2A2A2A] rounded-lg focus:outline-none focus:border-[#F59E0B] resize-none text-white mb-4"
          />
          <div className="flex items-center justify-between">
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="px-4 py-2 bg-[#111111] border border-[#2A2A2A] rounded-lg focus:outline-none focus:border-[#F59E0B] text-white"
            >
              {SPORTS_FILTERS.filter((f) => f !== "All").map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button
              type="submit"
              disabled={isPosting || !newTitle.trim()}
              className="px-6 py-2 bg-[#F59E0B] text-[#0A0A0A] rounded-lg hover:bg-[#D97706] transition-colors disabled:opacity-50 font-bold"
            >
              {isPosting ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      )}

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {SPORTS_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
              filter === f
                ? "bg-[#F59E0B] text-[#0A0A0A] font-bold"
                : "bg-[#1A1A1A] text-gray-400 hover:bg-[#2A2A2A] hover:text-white border border-[#2A2A2A]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Posts */}
      {isLoading || authLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 spinner-gold rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-12 text-center">
          <p className="text-4xl mb-4">💬</p>
          <h2 className="text-xl font-semibold mb-2">No posts yet</h2>
          <p className="text-gray-400 mb-6">
            {user
              ? "Be the first to start a discussion!"
              : "Sign in to join the conversation."}
          </p>
          {!user && (
            <Link
              href="/auth/login?redirect=/community"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#F59E0B] text-[#0A0A0A] rounded-lg hover:bg-[#D97706] transition-colors font-bold"
            >
              Sign In
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((post) => (
            <div
              key={post.id}
              className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-5 hover:border-[#F59E0B]/30 transition-all"
            >
              <div className="flex items-start gap-4">
                <img
                  src={post.authorAvatar || `https://api.dicebear.com/9.x/notionists/svg?seed=${post.authorName}`}
                  alt=""
                  className="w-10 h-10 rounded-full bg-[#2A2A2A] flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">{post.authorName}</span>
                    <span className="text-gray-500 text-xs">{formatDate(post.createdAt)}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs bg-[#F59E0B]/15 text-[#F59E0B]">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="font-semibold mb-1">{post.title}</h3>
                  {post.body && (
                    <p className="text-gray-400 text-sm line-clamp-2">{post.body}</p>
                  )}
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                    <span>{post.replyCount} {post.replyCount === 1 ? "reply" : "replies"}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
