import { NextRequest, NextResponse } from "next/server";
import { list, put } from "@vercel/blob";

const BLOB_PREFIX = "community/posts";

interface ForumPost {
  id: string;
  title: string;
  body: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  createdAt: string;
  replyCount: number;
  category: string;
}

interface PostsIndex {
  updatedAt: string;
  posts: ForumPost[];
}

async function getPostsIndex(): Promise<PostsIndex> {
  try {
    const { blobs } = await list({ prefix: `${BLOB_PREFIX}/index.json` });
    if (blobs.length > 0) {
      const res = await fetch(blobs[0].url);
      if (res.ok) return await res.json();
    }
  } catch {
    // Index doesn't exist yet
  }
  return { updatedAt: new Date().toISOString(), posts: [] };
}

async function savePostsIndex(index: PostsIndex): Promise<void> {
  await put(`${BLOB_PREFIX}/index.json`, JSON.stringify(index), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });
}

export async function GET() {
  try {
    const index = await getPostsIndex();
    return NextResponse.json({ posts: index.posts });
  } catch (error) {
    console.error("Failed to load posts:", error);
    return NextResponse.json({ posts: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, body: postBody, category, authorId, authorName, authorAvatar } = body;

    if (!title || !authorId) {
      return NextResponse.json({ error: "Title and author required" }, { status: 400 });
    }

    const post: ForumPost = {
      id: `post_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      title,
      body: postBody || "",
      authorId,
      authorName: authorName || "Anonymous",
      authorAvatar: authorAvatar || "",
      createdAt: new Date().toISOString(),
      replyCount: 0,
      category: category || "General",
    };

    const index = await getPostsIndex();
    index.posts.unshift(post);
    index.updatedAt = new Date().toISOString();

    // Keep only the most recent 100 posts
    if (index.posts.length > 100) {
      index.posts = index.posts.slice(0, 100);
    }

    await savePostsIndex(index);

    return NextResponse.json({ post });
  } catch (error) {
    console.error("Failed to create post:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
