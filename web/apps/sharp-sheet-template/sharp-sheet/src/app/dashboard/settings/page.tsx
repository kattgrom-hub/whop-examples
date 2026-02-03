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
              src="https://api.dicebear.com/9.x/notionists/svg?seed=analyst"
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
                defaultValue="Sharp Analyst"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Username</label>
              <input
                type="text"
                defaultValue="@sharpanalyst"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Bio</label>
            <textarea
              rows={4}
              defaultValue="Professional sports analyst with 10+ years of experience. Specializing in NFL and NBA betting."
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Sports Covered</label>
            <div className="flex flex-wrap gap-2">
              {["NFL", "NBA", "MLB", "NHL", "Soccer", "Tennis"].map((sport) => (
                <label
                  key={sport}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600"
                >
                  <input
                    type="checkbox"
                    defaultChecked={["NFL", "NBA"].includes(sport)}
                    className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
                  />
                  <span>{sport}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 mb-8">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Subscription Pricing</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Monthly Price
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  $
                </span>
                <input
                  type="number"
                  defaultValue={79}
                  className="w-full pl-8 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Annual Price (optional)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  $
                </span>
                <input
                  type="number"
                  defaultValue={790}
                  className="w-full pl-8 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">Leave empty to disable annual billing</p>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Platform fee: 10% - You receive 90% of all subscription revenue
          </p>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 mb-8">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Notifications</h2>
        </div>
        <div className="p-6 space-y-4">
          <label className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium">New Subscriber</p>
              <p className="text-sm text-gray-400">Get notified when someone subscribes</p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
            />
          </label>
          <label className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium">Messages</p>
              <p className="text-sm text-gray-400">Get notified when subscribers message you</p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
            />
          </label>
          <label className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium">Payout Notifications</p>
              <p className="text-sm text-gray-400">Get notified when payouts are processed</p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
            />
          </label>
          <label className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium">Game Time Reminders</p>
              <p className="text-sm text-gray-400">Remind to settle picks when games end</p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
            />
          </label>
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 mb-8">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Social Links</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Twitter/X</label>
            <input
              type="text"
              placeholder="@username"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">YouTube</label>
            <input
              type="text"
              placeholder="Channel URL"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Discord</label>
            <input
              type="text"
              placeholder="Server invite link"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500"
            />
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
