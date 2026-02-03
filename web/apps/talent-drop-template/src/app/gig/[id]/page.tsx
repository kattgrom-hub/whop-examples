import Link from "next/link";
import { notFound } from "next/navigation";
import { getGig, gigs, getApplicationsForGig, getTalent } from "@/lib/data";

export function generateStaticParams() {
  return gigs.map((gig) => ({
    id: gig.id,
  }));
}

export default async function GigDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const gig = getGig(id);

  if (!gig) {
    notFound();
  }

  const applications = getApplicationsForGig(id);

  return (
    <main className="py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Back link */}
        <Link
          href="/gigs"
          className="text-gray-400 hover:text-white transition-colors mb-8 inline-block"
        >
          ← Back to Gigs
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gig Header */}
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
              <div className="flex items-start gap-4 mb-6">
                <img
                  src={gig.clientAvatar}
                  alt={gig.clientName}
                  className="w-14 h-14 rounded-xl bg-gray-700"
                />
                <div>
                  <p className="text-gray-400">{gig.clientName}</p>
                  <h1 className="text-2xl font-bold">{gig.title}</h1>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                <span>Posted {gig.createdAt}</span>
                <span className="text-gray-600">|</span>
                <span>{gig.applications} applicants</span>
                <span className="text-gray-600">|</span>
                <span>Deadline: {gig.deadline}</span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
              <h2 className="text-lg font-semibold mb-4">Description</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {gig.description}
              </p>
            </div>

            {/* Skills Required */}
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
              <h2 className="text-lg font-semibold mb-4">Skills Required</h2>
              <div className="flex flex-wrap gap-2">
                {gig.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 bg-gray-700 rounded-lg text-gray-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Similar Talent */}
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
              <h2 className="text-lg font-semibold mb-4">
                Talent in this category
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {applications.slice(0, 4).map((app) => {
                  const talent = getTalent(app.talentId);
                  if (!talent) return null;
                  return (
                    <Link
                      key={app.id}
                      href={`/talent/${talent.id}`}
                      className="flex items-center gap-3 p-4 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-colors"
                    >
                      <img
                        src={talent.avatar}
                        alt={talent.name}
                        className="w-12 h-12 rounded-full bg-gray-600"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">
                            {talent.name}
                          </span>
                          {talent.verified && (
                            <span className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-xs">
                              ✓
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-yellow-500">★</span>
                          <span className="text-gray-400">{talent.rating}</span>
                          <span className="text-gray-500">
                            · ${talent.hourlyRate}/hr
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* About Client */}
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
              <h2 className="text-lg font-semibold mb-4">About the Client</h2>
              <div className="flex items-start gap-4">
                <img
                  src={gig.clientAvatar}
                  alt={gig.clientName}
                  className="w-16 h-16 rounded-xl bg-gray-700"
                />
                <div>
                  <h3 className="font-semibold text-lg">{gig.clientName}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                    <span>5 gigs posted</span>
                    <span className="text-gray-600">|</span>
                    <span>$12K+ spent</span>
                    <span className="text-gray-600">|</span>
                    <span>Member since Jan 2024</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 sticky top-24">
              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-1">Budget</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">
                    ${gig.budget.min.toLocaleString()}
                  </span>
                  <span className="text-gray-400">-</span>
                  <span className="text-3xl font-bold">
                    ${gig.budget.max.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{gig.duration}</p>
              </div>

              <button className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium mb-3">
                Apply Now
              </button>
              <button className="w-full py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                Save for Later
              </button>

              <div className="mt-6 pt-6 border-t border-gray-700 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Category</span>
                  <span className="text-white">{gig.category}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Duration</span>
                  <span className="text-white">{gig.duration}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Deadline</span>
                  <span className="text-white">{gig.deadline}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Applicants</span>
                  <span className="text-white">{gig.applications}</span>
                </div>
              </div>

              {/* Payment Note */}
              <div className="mt-6 p-3 bg-gray-700/50 rounded-lg text-center">
                <p className="text-xs text-gray-400">
                  Secure payments via Secure checkout
                </p>
              </div>
            </div>

            {/* Share */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="font-medium mb-3">Share this gig</h3>
              <div className="flex gap-2">
                <button className="flex-1 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-sm">
                  Copy Link
                </button>
                <button className="flex-1 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-sm">
                  Twitter
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
