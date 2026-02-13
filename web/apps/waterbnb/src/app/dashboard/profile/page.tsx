"use client";

import { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/lib/auth-context";

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

function ProfileContent() {
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
    <div>
      <h1 className="text-2xl font-bold mb-8">Profile</h1>

      {success && (
        <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400">{success}</div>
      )}
      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">{error}</div>
      )}

      <div className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-6">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#2A2A2A]">
          <img
            src={avatarUrl}
            alt="Profile"
            className="w-20 h-20 rounded-full bg-[#2A2A2A]"
          />
          <div>
            <p className="font-semibold text-lg">{name || "Your Name"}</p>
            <p className="text-gray-400 text-sm">{user?.email}</p>
            {profile?.plan && (
              <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs ${profile.plan === "pro" ? "bg-[#0077B6]/20 text-[#00B4D8]" : "bg-[#2A2A2A] text-gray-400"}`}>
                {profile.plan === "pro" ? "Pro" : "Core"} Plan
              </span>
            )}
          </div>
        </div>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your display name"
            className="w-full px-4 py-2 bg-[#111111] border border-[#2A2A2A] rounded-lg focus:outline-none focus:border-[#0077B6] text-white"
          />
        </div>

        {/* Bio */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell guests about yourself and your boats..."
            rows={4}
            className="w-full px-4 py-2 bg-[#111111] border border-[#2A2A2A] rounded-lg focus:outline-none focus:border-[#0077B6] resize-none text-white"
          />
        </div>

        {/* Categories */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">Boat Types</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  categories.includes(cat)
                    ? "bg-[#0077B6] text-white font-semibold"
                    : "bg-[#2A2A2A] text-gray-400 hover:bg-[#3A3A3A] hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-3 bg-[#0077B6] text-white rounded-lg hover:bg-[#023E8A] transition-colors disabled:opacity-50 font-semibold"
        >
          {isSaving ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return <Suspense fallback={<div className="flex justify-center py-12"><div className="w-8 h-8 border-2 spinner-ocean rounded-full animate-spin" /></div>}><ProfileContent /></Suspense>;
}
