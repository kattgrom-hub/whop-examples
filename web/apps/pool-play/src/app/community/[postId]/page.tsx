import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, mockPosts, mockComments } from "@/lib/community-data";

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
          &#8592; Back to community
        </Link>

        {/* Post */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
          <div className="flex items-start gap-4">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-12 h-12 rounded-full bg-gray-700"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold">{post.author.name}</span>
                {post.author.role === "creator" && (
                  <span className="px-2 py-0.5 bg-green-600/20 text-green-400 rounded text-xs">
                    Creator
                  </span>
                )}
                <span className="text-gray-500 text-sm">- {post.createdAt}</span>
              </div>
              <span className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300 mb-4 inline-block">
                {post.category}
              </span>
              <h1 className="text-2xl font-bold mt-2 mb-4">{post.title}</h1>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>
              <div className="flex items-center gap-6 mt-6 pt-4 border-t border-gray-700 text-sm">
                <button className="flex items-center gap-2 text-gray-400 hover:text-green-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  {post.likes} Likes
                </button>
                <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-gray-800 rounded-xl border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-lg font-semibold">{post.comments} Comments</h2>
          </div>

          {/* Comment Input */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-sm font-medium flex-shrink-0">
                Y
              </div>
              <div className="flex-1">
                <textarea
                  placeholder="Add a comment..."
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500 resize-none"
                />
                <div className="flex justify-end mt-2">
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Post Comment
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="divide-y divide-gray-700">
            {mockComments.map((comment) => (
              <div key={comment.id} className="p-6">
                <div className="flex items-start gap-4">
                  <img
                    src={comment.author.avatar}
                    alt={comment.author.name}
                    className="w-10 h-10 rounded-full bg-gray-700"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{comment.author.name}</span>
                      {comment.author.role === "creator" && (
                        <span className="px-2 py-0.5 bg-green-600/20 text-green-400 rounded text-xs">
                          Creator
                        </span>
                      )}
                      <span className="text-gray-500 text-sm">- {comment.createdAt}</span>
                    </div>
                    <p className="text-gray-300">{comment.content}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <button className="flex items-center gap-1 text-gray-400 hover:text-green-500 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                        {comment.likes}
                      </button>
                      <button className="text-gray-400 hover:text-white transition-colors">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Forums Integration Note */}
        <div className="mt-8 p-4 border border-dashed border-gray-700 rounded-xl text-center text-gray-500">
          <p>Forums will power real-time comments and threading</p>
        </div>
      </div>
    </main>
  );
}
