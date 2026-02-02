export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Settings</h1>

      {/* Profile Settings */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 mb-8">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Profile</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-6">
            <img
              src="https://api.dicebear.com/9.x/notionists/svg?seed=coach"
              alt="Profile"
              className="w-20 h-20 rounded-full bg-gray-700"
            />
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
                defaultValue="Alex Chen"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Title</label>
              <input
                type="text"
                defaultValue="Pro Valorant Coach"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Bio</label>
            <textarea
              rows={4}
              defaultValue="Former pro player with 5+ years coaching experience. Helped 50+ students reach Immortal rank."
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 mb-8">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Pricing</h2>
        </div>
        <div className="p-6">
          <div className="max-w-xs">
            <label className="block text-sm text-gray-400 mb-2">
              Hourly Rate
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                $
              </span>
              <input
                type="number"
                defaultValue={75}
                className="w-full pl-8 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              You keep 80% · Platform fee: 20%
            </p>
          </div>
        </div>
      </div>

      {/* Availability */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 mb-8">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Availability</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-7 gap-2 mb-6">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <button
                key={day}
                className={`py-3 rounded-lg text-sm font-medium transition-colors ${
                  ["Mon", "Tue", "Wed", "Thu", "Fri"].includes(day)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Start Time
              </label>
              <select className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500">
                <option>9:00 AM</option>
                <option>10:00 AM</option>
                <option>11:00 AM</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                End Time
              </label>
              <select className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500">
                <option>5:00 PM</option>
                <option>6:00 PM</option>
                <option>7:00 PM</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
          Save Changes
        </button>
      </div>
    </div>
  );
}
