import { mockSubscribers } from "@/lib/analyst-data";

export default function SubscribersPage() {
  const activeSubscribers = mockSubscribers.filter((s) => s.plan !== "Cancelled");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Subscribers</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Total Subscribers</p>
          <p className="text-3xl font-bold">{mockSubscribers.length}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Monthly</p>
          <p className="text-3xl font-bold">
            {mockSubscribers.filter((s) => s.plan === "Monthly").length}
          </p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Annual</p>
          <p className="text-3xl font-bold">
            {mockSubscribers.filter((s) => s.plan === "Annual").length}
          </p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">New This Month</p>
          <p className="text-3xl font-bold text-green-500">
            {mockSubscribers.filter((s) => {
              const subDate = new Date(s.subscribedAt);
              const now = new Date();
              return subDate.getMonth() === now.getMonth() && subDate.getFullYear() === now.getFullYear();
            }).length}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search subscribers..."
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500"
          />
        </div>
        <select className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500">
          <option>All Plans</option>
          <option>Monthly</option>
          <option>Annual</option>
        </select>
      </div>

      {/* Subscribers List */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700 text-left">
              <th className="px-6 py-4 text-gray-400 font-medium">Subscriber</th>
              <th className="px-6 py-4 text-gray-400 font-medium">Plan</th>
              <th className="px-6 py-4 text-gray-400 font-medium">Subscribed</th>
              <th className="px-6 py-4 text-gray-400 font-medium">Status</th>
              <th className="px-6 py-4 text-gray-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {activeSubscribers.map((subscriber) => (
              <tr key={subscriber.id}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={subscriber.avatar}
                      alt={subscriber.name}
                      className="w-10 h-10 rounded-full bg-gray-700"
                    />
                    <span className="font-medium">{subscriber.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      subscriber.plan === "Annual"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-gray-700 text-gray-300"
                    }`}
                  >
                    {subscriber.plan}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-400">
                  {new Date(subscriber.subscribedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-green-400">Active</span>
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-green-500 hover:text-green-400 text-sm">
                    Message
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {activeSubscribers.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          No subscribers yet. Share your profile to get started!
        </div>
      )}
    </div>
  );
}
