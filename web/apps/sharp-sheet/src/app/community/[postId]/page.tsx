import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, mockComments, mockPosts } from "@/lib/community-data";

export function generateStaticParams() {
  return mockPosts.map((post) => ({
    postId: post.id,
  }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;
  const post = getPost(postId);

  if (!post) {
    notFound();
  }

  return (
    <main className="py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back link */}
        <Link
          href="/community"
          className="text-gray-400 hover:text-white transition-colors mb-8 inline-block"
        >
          Back to Community
        </Link>

        {/* Post */}
        <article className="bg-gray-800 rounded-xl p-8 border border-gray-700 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-12 h-12 rounded-full bg-gray-700"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{post.author.name}</span>
                {post.author.role === "analyst" && (
                  <span className="px-2 py-0.5 bg-green-600/20 text-green-400 rounded text-xs">
                    Analyst
                  </span>
                )}
              </div>
              <p className="text-gray-500 text-sm">{post.createdAt}</p>
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>

          <div className="flex items-center gap-4 mt-6 pt-6 border-t border-gray-700">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
              <span>👍</span> {post.likes}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
              <span>🔗</span> Share
            </button>
            <span className="ml-auto px-3 py-1 bg-gray-700 rounded text-sm text-gray-400">
              {post.sport}
            </span>
          </div>
        </article>

        {/* Comments */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">
            Comments ({post.comments})
          </h2>

          {/* Comment Input */}
          <div className="flex gap-4 mb-6">
            <img
              src="https://api.dicebear.com/9.x/notionists/svg?seed=you"
              alt="You"
              className="w-10 h-10 rounded-full bg-gray-700"
            />
            <div className="flex-1">
              <textarea
                placeholder="Write a comment..."
                rows={3}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500 resize-none"
              />
              <div className="flex justify-end mt-2">
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Post Comment
                </button>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {mockComments.map((comment) => (
              <div
                key={comment.id}
                className="flex gap-4 p-4 bg-gray-800/50 rounded-xl"
              >
                <img
                  src={comment.author.avatar}
                  alt={comment.author.name}
                  className="w-10 h-10 rounded-full bg-gray-700"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{comment.author.name}</span>
                    {comment.author.role === "analyst" && (
                      <span className="px-2 py-0.5 bg-green-600/20 text-green-400 rounded text-xs">
                        Analyst
                      </span>
                    )}
                    <span className="text-gray-500 text-sm">
                      . {comment.createdAt}
                    </span>
                  </div>
                  <p className="text-gray-300">{comment.content}</p>
                  <button className="flex items-center gap-1 mt-2 text-sm text-gray-500 hover:text-gray-400">
                    <span>👍</span> {comment.likes}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
