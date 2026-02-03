import Link from "next/link";
import { notFound } from "next/navigation";
import { getTalent, talents } from "@/lib/data";

export function generateStaticParams() {
  return talents.map((talent) => ({
    id: talent.id,
  }));
}

export default async function TalentProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const talent = getTalent(id);

  if (!talent) {
    notFound();
  }

  return (
    <main className="py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Back link */}
        <Link
          href="/talent"
          className="text-gray-400 hover:text-white transition-colors mb-8 inline-block"
        >
          ← Back to Talent
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Header */}
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
              <div className="flex items-start gap-6">
                <img
                  src={talent.avatar}
                  alt={talent.name}
                  className="w-24 h-24 rounded-full bg-gray-700"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold">{talent.name}</h1>
                    {talent.verified && (
                      <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-sm">
                        ✓
                      </span>
                    )}
                    {talent.isPremium && (
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium">
                        Premium
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 mb-3">{talent.title}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="font-semibold">{talent.rating}</span>
                      <span className="text-gray-500">
                        ({talent.reviewCount} reviews)
                      </span>
                    </div>
                    <span className="text-gray-600">|</span>
                    <span className="text-gray-400">
                      {talent.completedGigs} gigs completed
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
              <h2 className="text-lg font-semibold mb-4">About</h2>
              <p className="text-gray-300 leading-relaxed">{talent.bio}</p>
            </div>

            {/* Skills */}
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
              <h2 className="text-lg font-semibold mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {talent.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 bg-gray-700 rounded-lg text-gray-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Portfolio */}
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
              <h2 className="text-lg font-semibold mb-4">Portfolio</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {talent.portfolio.map((item) => (
                  <div
                    key={item.id}
                    className="relative group rounded-xl overflow-hidden bg-gray-700 aspect-[4/3]"
                  >
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <div>
                        <p className="font-medium text-white">{item.title}</p>
                        <p className="text-sm text-gray-400 capitalize">
                          {item.type}
                        </p>
                      </div>
                    </div>
                    {item.type === "video" && (
                      <div className="absolute top-3 right-3 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">▶</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
              <h2 className="text-lg font-semibold mb-4">
                Reviews ({talent.reviewCount})
              </h2>
              <div className="space-y-6">
                {/* Mock reviews */}
                {[
                  {
                    id: "r1",
                    name: "Sarah K.",
                    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=review1",
                    rating: 5,
                    date: "2 weeks ago",
                    comment:
                      "Incredible work! Delivered ahead of schedule and the quality exceeded my expectations. Will definitely hire again.",
                  },
                  {
                    id: "r2",
                    name: "Mike T.",
                    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=review2",
                    rating: 5,
                    date: "1 month ago",
                    comment:
                      "Professional, communicative, and talented. The final deliverables were exactly what we needed for our launch.",
                  },
                  {
                    id: "r3",
                    name: "Jessica L.",
                    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=review3",
                    rating: 4,
                    date: "2 months ago",
                    comment:
                      "Great to work with. Minor revisions needed but the overall experience was smooth.",
                  },
                ].map((review) => (
                  <div
                    key={review.id}
                    className="flex gap-4 pb-6 border-b border-gray-700 last:border-0 last:pb-0"
                  >
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-10 h-10 rounded-full bg-gray-700"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{review.name}</span>
                        <span className="text-sm text-gray-500">
                          {review.date}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={
                              i < review.rating
                                ? "text-yellow-500"
                                : "text-gray-600"
                            }
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <p className="text-gray-400">{review.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Hire Card */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 sticky top-24">
              <div className="mb-6">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-3xl font-bold">
                    ${talent.hourlyRate}
                  </span>
                  <span className="text-gray-400">/hour</span>
                </div>
                <p className="text-sm text-gray-500">
                  Minimum ${talent.projectMinimum} per project
                </p>
              </div>

              <button className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium mb-3">
                Hire {talent.name.split(" ")[0]}
              </button>
              <button className="w-full py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                Send Message
              </button>

              <div className="mt-6 pt-6 border-t border-gray-700 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Response time</span>
                  <span className="text-white">Under 2 hours</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Category</span>
                  <span className="text-white">{talent.category}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Member since</span>
                  <span className="text-white">March 2024</span>
                </div>
              </div>

              {/* Checkout Note */}
              <div className="mt-6 p-3 bg-gray-700/50 rounded-lg text-center">
                <p className="text-xs text-gray-400">
                  Secure payments via Secure checkout
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
