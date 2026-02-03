import Link from "next/link";
import { mockPosts } from "@/lib/community-data";

export default function CommunityPage() {
  const categories = [
    "All",
    "Trading Cards",
    "Sneakers",
    "Memorabilia",
    "Watches",
    "Art",
    "Announcements",
  ];

  const getRoleBadge = (role: string, verified: boolean) => {
    if (role === "admin") {
      return (
        <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded text-xs">
          Admin
        </span>
      );
    }
    if (role === "seller" && verified) {
      return (
        <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs">
          Verified Seller
        </span>
      );
    }
    if (role === "seller") {
      return (
        <span className="px-2 py-0.5 bg-gray-500/20 text-gray-400 rounded text-xs">
          Seller
        </span>
      );
    }
    return null;
  };

  return (
    <main className="py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Community</h1>
            <p className="text-gray-400 mt-1">
              Discuss collectibles, share wins, and connect with collectors
            </p>
          </div>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            New Post
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-full transition-colors ${
                cat === "All"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {mockPosts.map((post) => (
            <Link
              key={post.id}
              href={`/community/${post.id}`}
              className="block bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-start gap-4">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-10 h-10 rounded-full bg-gray-700"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{post.author.name}</span>
                    {post.author.verified && (
                      <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                    {getRoleBadge(post.author.role, post.author.verified)}
                    <span className="text-gray-500 text-sm">
                      {post.createdAt}
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold mb-2">{post.title}</h2>
                  <p className="text-gray-400 line-clamp-2">{post.content}</p>
                  <div className="flex items-center gap-6 mt-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                      </svg>
                      {post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {post.comments} comments
                    </span>
                    <span className="px-2 py-1 bg-gray-700 rounded text-xs">
                      {post.category}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Forums Integration Note */}
        <div className="mt-8 p-4 border border-dashed border-gray-700 rounded-xl text-center text-gray-500">
          <p>Forums will power real-time posts, comments, and moderation</p>
        </div>
      </div>
    </main>
  );
}
