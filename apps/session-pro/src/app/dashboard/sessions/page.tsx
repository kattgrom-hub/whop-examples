import { mockSessions } from "@/lib/coach-data";

export default function SessionsPage() {
  const upcomingSessions = mockSessions.filter((s) => s.status === "upcoming");
  const pastSessions = mockSessions.filter((s) => s.status !== "upcoming");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Sessions</h1>

      {/* Upcoming Sessions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Upcoming</h2>
        {upcomingSessions.length === 0 ? (
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 text-center text-gray-400">
            No upcoming sessions scheduled
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingSessions.map((session) => (
              <div
                key={session.id}
                className="bg-gray-800 rounded-xl border border-gray-700 p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={session.studentAvatar}
                      alt={session.studentName}
                      className="w-12 h-12 rounded-full bg-gray-700"
                    />
                    <div>
                      <p className="font-semibold text-lg">
                        {session.studentName}
                      </p>
                      <p className="text-gray-400">
                        {session.date} at {session.time} · {session.duration} min
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xl font-bold">${session.amount}</span>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Join Session
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Sessions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Past Sessions</h2>
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700 text-left">
                <th className="px-6 py-4 text-gray-400 font-medium">Student</th>
                <th className="px-6 py-4 text-gray-400 font-medium">Date</th>
                <th className="px-6 py-4 text-gray-400 font-medium">Duration</th>
                <th className="px-6 py-4 text-gray-400 font-medium">Amount</th>
                <th className="px-6 py-4 text-gray-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {pastSessions.map((session) => (
                <tr key={session.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={session.studentAvatar}
                        alt={session.studentName}
                        className="w-8 h-8 rounded-full bg-gray-700"
                      />
                      <span>{session.studentName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{session.date}</td>
                  <td className="px-6 py-4 text-gray-400">
                    {session.duration} min
                  </td>
                  <td className="px-6 py-4">${session.amount}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        session.status === "completed"
                          ? "bg-green-500/20 text-green-500"
                          : "bg-red-500/20 text-red-500"
                      }`}
                    >
                      {session.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
