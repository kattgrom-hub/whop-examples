"use client";

import { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/lib/auth-context";
import { useMode } from "@/lib/mode-context";
import Link from "next/link";

const CATEGORIES = [
  "Sailboat", "Yacht", "Pontoon", "Speedboat", "Fishing Boat",
  "Kayak", "Catamaran", "Houseboat", "Jet Ski", "Other",
];

interface Profile {
  companyId: string;
  name: string;
  bio: string;
  categories: string[];
  logoUrl: string;
  plan: string;
  createdAt: string;
}

function HostingProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = async () => {
    if (!user?.companyId) return setIsLoading(false);
    try {
      const res = await fetch(`/api/host/profile?companyId=${user.companyId}`);
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
        setName(data.profile.name);
        setBio(data.profile.bio);
        setCategories(data.profile.categories);
      }
    } catch {
      setError("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadProfile(); }, [user?.companyId]);

  const toggleCategory = (cat: string) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSave = async () => {
    if (!user?.companyId) return;
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/host/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId: user.companyId, userId: user.id, name, bio, categories }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed to save");
      const data = await res.json();
      setProfile(data.profile);
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 spinner-ocean rounded-full animate-spin" /></div>;

  const avatarUrl = user?.profile_pic_url || `https://api.dicebear.com/9.x/notionists/svg?seed=${user?.id || "host"}`;

  return (
    <div className="max-w-2xl">
      {success && (
        <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400">{success}</div>
      )}
      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">{error}</div>
      )}

      {/* Avatar section */}
      <div className="flex items-center gap-5 mb-8">
        <img
          src={avatarUrl}
          alt="Profile"
          className="w-20 h-20 rounded-full bg-[#EBEBEB]"
        />
        <div>
          <p className="text-xl font-semibold" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>{name || "Your Name"}</p>
          <p className="text-[#717171] text-sm">{user?.email}</p>
          {profile?.plan && (
            <span className={`inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${profile.plan === "pro" ? "bg-[#FF385C]/20 text-[#FF385C]" : "bg-[#EBEBEB] text-[#717171]"}`}>
              {profile.plan === "pro" ? "Pro" : "Core"} Plan
            </span>
          )}
        </div>
      </div>

      {/* Form fields */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-[#484848] mb-2">Display name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your display name"
            className="w-full px-4 py-2.5 bg-[#F7F7F7] border border-[#DDDDDD] rounded-lg focus:outline-none focus:border-[#FF385C] text-[#222222]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#484848] mb-2">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell guests about yourself and your boats..."
            rows={4}
            className="w-full px-4 py-2.5 bg-[#F7F7F7] border border-[#DDDDDD] rounded-lg focus:outline-none focus:border-[#FF385C] resize-none text-[#222222]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#484848] mb-2">Boat types you offer</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  categories.includes(cat)
                    ? "bg-white text-black font-medium"
                    : "bg-[#EBEBEB] text-[#717171] hover:bg-[#DDDDDD] hover:text-[#222222]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-3 bg-[#FF385C] text-[#222222] rounded-lg hover:bg-[#D70466] transition-colors disabled:opacity-50 font-semibold"
        >
          {isSaving ? "Saving..." : "Save profile"}
        </button>
      </div>
    </div>
  );
}

function TravelingProfile() {
  const { user } = useAuth();

  const avatarUrl = user?.profile_pic_url || `https://api.dicebear.com/9.x/notionists/svg?seed=${user?.id || "guest"}`;
  const displayName = user?.name || user?.username || "Traveler";

  return (
    <div className="max-w-2xl">
      {/* Guest identity */}
      <div className="flex items-center gap-5 mb-8">
        <img
          src={avatarUrl}
          alt="Profile"
          className="w-20 h-20 rounded-full bg-[#EBEBEB]"
        />
        <div>
          <p className="text-xl font-semibold" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>{displayName}</p>
          <p className="text-[#717171] text-sm">{user?.email}</p>
          <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EBEBEB] text-[#717171]">
            Guest
          </span>
        </div>
      </div>

      {/* Confirmed information */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
          Confirmed information
        </h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-[#222222]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-sm text-[#484848]">Email address</span>
          </div>
          {user?.username && (
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-[#222222]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-sm text-[#484848]">Identity</span>
            </div>
          )}
        </div>
      </section>

      {/* Quick links */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
          Your trips
        </h2>
        <div className="space-y-3">
          <Link
            href="/dashboard/reservations"
            className="flex items-center justify-between p-4 bg-[#F7F7F7] rounded-xl border border-[#DDDDDD] hover:bg-[#EBEBEB] transition-colors"
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-[#484848]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium text-[#222222]">My reservations</span>
            </div>
            <svg className="w-4 h-4 text-[#717171]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="/messages"
            className="flex items-center justify-between p-4 bg-[#F7F7F7] rounded-xl border border-[#DDDDDD] hover:bg-[#EBEBEB] transition-colors"
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-[#484848]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-sm font-medium text-[#222222]">Messages with hosts</span>
            </div>
            <svg className="w-4 h-4 text-[#717171]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="/browse"
            className="flex items-center justify-between p-4 bg-[#F7F7F7] rounded-xl border border-[#DDDDDD] hover:bg-[#EBEBEB] transition-colors"
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-[#484848]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-sm font-medium text-[#222222]">Browse boats</span>
            </div>
            <svg className="w-4 h-4 text-[#717171]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Reviews placeholder */}
      <section>
        <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
          Reviews
        </h2>
        <div className="bg-[#F7F7F7] rounded-xl border border-[#DDDDDD] p-8 text-center">
          <svg className="w-10 h-10 text-[#DDDDDD] mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          <p className="text-[#717171] text-sm">No reviews yet. Reviews from hosts will appear here after your trips.</p>
        </div>
      </section>
    </div>
  );
}

function ProfileContent() {
  const { mode } = useMode();

  if (mode === "traveling") {
    return <TravelingProfile />;
  }

  return <HostingProfile />;
}

export default function ProfilePage() {
  return <Suspense fallback={<div className="flex justify-center py-12"><div className="w-8 h-8 border-2 spinner-ocean rounded-full animate-spin" /></div>}><ProfileContent /></Suspense>;
}
