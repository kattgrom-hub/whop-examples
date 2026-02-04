"use client";

import { useAuth } from "@/lib/auth-context";

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Settings</h1>

      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <h2 className="text-lg font-semibold mb-4">Profile</h2>
        <div className="flex items-center gap-4 mb-6">
          <img
            src={user?.profile_pic_url || `https://api.dicebear.com/9.x/notionists/svg?seed=${user?.id || "user"}`}
            alt="Avatar"
            className="w-16 h-16 rounded-full bg-gray-700"
          />
          <div>
            <p className="font-semibold">{user?.name || user?.username || "User"}</p>
            <p className="text-gray-400 text-sm">{user?.email}</p>
          </div>
        </div>
        <p className="text-gray-500 text-sm">
          Profile information is synced from your Whop account.
        </p>
      </div>
    </div>
  );
}
