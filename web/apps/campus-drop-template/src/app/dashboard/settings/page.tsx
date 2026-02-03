import { campuses } from "@/lib/data";

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
              src="https://api.dicebear.com/9.x/notionists/svg?seed=currentuser"
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
                defaultValue="Demo User"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Email</label>
              <input
                type="email"
                defaultValue="demo@university.edu"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Bio</label>
            <textarea
              rows={3}
              defaultValue="UCLA student. Love sneakers, tech, and concert tickets!"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Campus Settings */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 mb-8">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Campus</h2>
        </div>
        <div className="p-6">
          <div className="max-w-md">
            <label className="block text-sm text-gray-400 mb-2">
              Primary Campus
            </label>
            <select
              defaultValue="UCLA"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500"
            >
              {campuses.map((campus) => (
                <option key={campus} value={campus}>
                  {campus}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-2">
              Your listings will show this campus by default
            </p>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 mb-8">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Notifications</h2>
        </div>
        <div className="p-6 space-y-4">
          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium">New Messages</p>
              <p className="text-sm text-gray-400">Get notified when someone messages you</p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-green-500 focus:ring-green-500"
            />
          </label>
          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium">Sale Notifications</p>
              <p className="text-sm text-gray-400">Get notified when someone buys your item</p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-green-500 focus:ring-green-500"
            />
          </label>
          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium">Price Drops</p>
              <p className="text-sm text-gray-400">Get notified when items you saved drop in price</p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-green-500 focus:ring-green-500"
            />
          </label>
          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium">Marketing Emails</p>
              <p className="text-sm text-gray-400">Receive tips and updates about CampusDrop</p>
            </div>
            <input
              type="checkbox"
              className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-green-500 focus:ring-green-500"
            />
          </label>
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 mb-8">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Account</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between py-3 border-b border-gray-700">
            <div>
              <p className="font-medium">Student Verification</p>
              <p className="text-sm text-gray-400">Verify your .edu email for a verified badge</p>
            </div>
            <span className="px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-sm">
              Verified
            </span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-700">
            <div>
              <p className="font-medium">Connected Accounts</p>
              <p className="text-sm text-gray-400">Manage your connected social accounts</p>
            </div>
            <button className="text-green-500 hover:text-green-400 text-sm">
              Manage
            </button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-red-400">Delete Account</p>
              <p className="text-sm text-gray-400">Permanently delete your account and data</p>
            </div>
            <button className="text-red-400 hover:text-red-300 text-sm">
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
