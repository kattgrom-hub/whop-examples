export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Settings</h1>

      {/* Profile Settings */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 mb-8">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Creator Profile</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-green-600 flex items-center justify-center text-2xl font-bold">
              PP
            </div>
            <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
              Change Photo
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Display Name
              </label>
              <input
                type="text"
                defaultValue="PoolPlay Creator"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Username
              </label>
              <input
                type="text"
                defaultValue="@poolplay_creator"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Bio</label>
            <textarea
              rows={4}
              defaultValue="Running the best fantasy contests on PoolPlay. Daily fantasy, survivor pools, and more!"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Contest Settings */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 mb-8">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Contest Defaults</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Default Sport
              </label>
              <select className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500">
                <option>NFL</option>
                <option>NBA</option>
                <option>MLB</option>
                <option>NHL</option>
                <option>Soccer</option>
                <option>Golf</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Default Contest Type
              </label>
              <select className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500">
                <option>Daily Fantasy</option>
                <option>Survivor Pool</option>
                <option>Pick&apos;em</option>
                <option>Season Long</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Platform Fee Rate
            </label>
            <div className="flex items-center gap-4">
              <div className="flex-1 px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-400">
                5% (Fixed)
              </div>
              <span className="text-sm text-gray-500">
                You keep 95% of entry fees after prizes
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 mb-8">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Notifications</h2>
        </div>
        <div className="p-6 space-y-4">
          {[
            { label: "New entries", description: "When someone enters your contest" },
            { label: "Contest milestones", description: "When your contest reaches 50%, 75%, 100% full" },
            { label: "Contest start", description: "When your contest begins" },
            { label: "Contest end", description: "When your contest completes" },
            { label: "Payout received", description: "When your earnings are available" },
          ].map((notification) => (
            <div
              key={notification.label}
              className="flex items-center justify-between py-2"
            >
              <div>
                <p className="font-medium">{notification.label}</p>
                <p className="text-sm text-gray-400">{notification.description}</p>
              </div>
              <button
                className="w-12 h-6 bg-green-600 rounded-full relative"
                role="switch"
                aria-checked="true"
              >
                <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-gray-800 rounded-xl border border-red-500/30 mb-8">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-red-400">Danger Zone</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Pause All Contests</p>
              <p className="text-sm text-gray-400">
                Temporarily stop accepting new entries to all your contests
              </p>
            </div>
            <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
              Pause
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Delete Account</p>
              <p className="text-sm text-gray-400">
                Permanently delete your creator account and all contests
              </p>
            </div>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
          Save Changes
        </button>
      </div>
    </div>
  );
}
