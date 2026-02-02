import Link from "next/link";
import { mockPosts } from "@/lib/community-data";

export default function CommunityPage() {
  const categories = ["All", "Gaming", "Music", "Fitness", "Business", "Design", "Programming"];

  return (
    <main className="py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Community</h1>
            <p className="text-gray-400 mt-1">Discuss, learn, and connect with coaches and students</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
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
                  ? "bg-blue-600 text-white"
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
                    {post.author.role === "coach" && (
                      <span className="px-2 py-0.5 bg-blue-600/20 text-blue-400 rounded text-xs">
                        Coach
                      </span>
                    )}
                    <span className="text-gray-500 text-sm">· {post.createdAt}</span>
                  </div>
                  <h2 className="text-lg font-semibold mb-2">{post.title}</h2>
                  <p className="text-gray-400 line-clamp-2">{post.content}</p>
                  <div className="flex items-center gap-6 mt-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <span>👍</span> {post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <span>💬</span> {post.comments} comments
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

        {/* Whop Forums Integration Note */}
        <div className="mt-8 p-4 border border-dashed border-gray-700 rounded-xl text-center text-gray-500">
          <p>Whop Forums API will power real-time posts, comments, and moderation</p>
        </div>
      </div>
    </main>
  );
}
