"use client";

import { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/lib/auth-context";

const CATEGORIES = [
  "Business", "Code Review", "Data Science", "Design", "Fitness",
  "Languages", "Marketing", "Music", "Photography", "Programming",
  "Writing", "Other",
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
    if (!user?.id) return setIsLoading(false);
    try {
      const res = await fetch(`/api/coach/profile?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
        setName(data.profile.name);
        setBio(data.profile.bio);
        setCategories(data.profile.categories);
      } else if (res.status === 404) {
        // Auto-create coach account
        const createRes = await fetch("/api/coach/connected-account", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            email: user.email,
            name: user.name || user.username,
          }),
        });
        if (createRes.ok) {
          // Re-fetch profile after creation
          const retryRes = await fetch(`/api/coach/profile?userId=${user.id}`);
          if (retryRes.ok) {
            const data = await retryRes.json();
            setProfile(data.profile);
            setName(data.profile.name);
            setBio(data.profile.bio);
            setCategories(data.profile.categories);
          }
        }
      }
    } catch {
      setError("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadProfile(); }, [user]);

  const toggleCategory = (cat: string) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSave = async () => {
    if (!user?.id) return;
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/coach/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, name, bio, categories }),
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

  if (isLoading) return <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;

  const avatarUrl = user?.profile_pic_url || `https://api.dicebear.com/9.x/notionists/svg?seed=${user?.id || "coach"}`;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Profile</h1>

      {success && (
        <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400">{success}</div>
      )}
      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">{error}</div>
      )}

      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-700">
          <img
            src={avatarUrl}
            alt="Profile"
            className="w-20 h-20 rounded-full bg-gray-700"
          />
          <div>
            <p className="font-semibold text-lg">{name || "Your Name"}</p>
            <p className="text-gray-400 text-sm">{user?.email}</p>
            {profile?.plan && (
              <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs ${profile.plan === "pro" ? "bg-purple-500/20 text-purple-400" : "bg-gray-600/50 text-gray-400"}`}>
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
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Bio */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell students about yourself and your expertise..."
            rows={4}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
          />
        </div>

        {/* Categories */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">Categories</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  categories.includes(cat)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white"
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
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return <Suspense fallback={<div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>}><ProfileContent /></Suspense>;
}
