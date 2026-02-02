import { notFound } from "next/navigation";
import Link from "next/link";
import { getCoach, coaches } from "@/lib/data";

export function generateStaticParams() {
  return coaches.map((coach) => ({
    id: coach.id,
  }));
}

export default async function CoachPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const coach = getCoach(id);

  if (!coach) {
    notFound();
  }

  return (
    <main className="py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back link */}
        <Link
          href="/browse"
          className="text-gray-400 hover:text-white transition-colors mb-8 inline-block"
        >
          ← Back to coaches
        </Link>

        {/* Profile Header */}
        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
          <div className="flex flex-col md:flex-row gap-6">
            <img
              src={coach.avatar}
              alt={coach.name}
              className="w-32 h-32 rounded-full bg-gray-700"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <h1 className="text-3xl font-bold">{coach.name}</h1>
                  <p className="text-gray-400 text-lg">{coach.title}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-yellow-500">★</span>
                    <span className="text-white">{coach.rating}</span>
                    <span className="text-gray-500">
                      ({coach.reviewCount} reviews)
                    </span>
                    <span className="px-3 py-1 bg-gray-700 rounded-full text-xs text-gray-300 ml-2">
                      {coach.category}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">
                    ${coach.hourlyRate}
                    <span className="text-gray-400 text-lg font-normal">
                      /hr
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">About</h2>
          <p className="text-gray-300 leading-relaxed">{coach.bio}</p>
        </div>

        {/* Skills */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {coach.skills.map((skill) => (
              <span
                key={skill}
                className="px-4 py-2 bg-gray-800 rounded-lg text-gray-300 border border-gray-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Booking Section */}
        <div className="mt-10 bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Book a Session</h2>
          <p className="text-gray-400 mb-6">
            Select a time slot and book your 1:1 session with {coach.name}.
          </p>

          {/* Time slots (mock) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {["Mon 10am", "Mon 2pm", "Tue 11am", "Wed 3pm"].map((slot) => (
              <button
                key={slot}
                className="px-4 py-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-sm"
              >
                {slot}
              </button>
            ))}
          </div>

          <button className="w-full py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg">
            Book for ${coach.hourlyRate}
          </button>
          <p className="text-gray-500 text-sm text-center mt-3">
            Secure payment powered by Whop
          </p>
        </div>
      </div>
    </main>
  );
}
