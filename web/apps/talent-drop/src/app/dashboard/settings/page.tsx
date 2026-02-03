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
              src="https://api.dicebear.com/9.x/notionists/svg?seed=user"
              alt="Profile"
              className="w-20 h-20 rounded-full bg-gray-700"
            />
            <div>
              <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                Change Photo
              </button>
              <p className="text-sm text-gray-500 mt-2">
                JPG, PNG or GIF. Max 5MB.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Display Name
              </label>
              <input
                type="text"
                defaultValue="Demo User"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Professional Title
              </label>
              <input
                type="text"
                defaultValue="Content Creator"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Bio</label>
            <textarea
              rows={4}
              defaultValue="Creative professional with 5+ years of experience in content creation and digital marketing."
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Skills</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {["Content Creation", "Photography", "Video Editing", "Social Media"].map(
                (skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm flex items-center gap-2"
                  >
                    {skill}
                    <button className="hover:text-white">×</button>
                  </span>
                )
              )}
            </div>
            <input
              type="text"
              placeholder="Add a skill..."
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
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
                  className="w-full pl-8 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Minimum Project Budget
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  $
                </span>
                <input
                  type="number"
                  defaultValue={200}
                  className="w-full pl-8 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Platform fee: 15% · You keep 85% of your earnings
          </p>
        </div>
      </div>

      {/* Membership */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 mb-8">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Membership</h2>
        </div>
        <div className="p-6">
          <div className="flex items-start justify-between p-4 bg-gray-700/50 rounded-xl mb-4">
            <div>
              <p className="font-semibold">Free Plan</p>
              <p className="text-sm text-gray-400">
                Basic access to gigs and talent features
              </p>
            </div>
            <span className="px-3 py-1 bg-gray-600 rounded-full text-sm">
              Current Plan
            </span>
          </div>

          <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="font-semibold text-purple-400">
                  Premium Membership
                </p>
                <p className="text-sm text-gray-400">
                  Unlock premium features and stand out
                </p>
              </div>
              <span className="text-xl font-bold">$29/mo</span>
            </div>
            <ul className="space-y-2 mb-4 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Premium badge on
                profile
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Featured in talent
                listings
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Priority application
                review
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Lower platform fees
                (10%)
              </li>
            </ul>
            <button className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Upgrade to Premium
            </button>
            <p className="text-xs text-gray-500 text-center mt-2">
              Powered by Memberships
            </p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 mb-8">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Notifications</h2>
        </div>
        <div className="p-6 space-y-4">
          {[
            { label: "New gig matches", description: "Get notified when gigs match your skills" },
            { label: "Application updates", description: "Status changes on your applications" },
            { label: "Messages", description: "New messages from clients or talent" },
            { label: "Payout notifications", description: "When payments are processed" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between py-2"
            >
              <div>
                <p className="font-medium">{item.label}</p>
                <p className="text-sm text-gray-400">{item.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          ))}
          <p className="text-xs text-gray-500 pt-4 border-t border-gray-700">
            Notifications delivered via Notifications
          </p>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
          Save Changes
        </button>
      </div>
    </div>
  );
}
