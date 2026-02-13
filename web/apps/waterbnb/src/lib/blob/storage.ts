/**
 * Storage adapter that falls back to in-memory when BLOB_READ_WRITE_TOKEN is not configured.
 *
 * When the token is available, delegates to @vercel/blob.
 * When missing, uses a process-level Map so the example app works without external config.
 * Data stored in-memory is lost on server restart.
 */
import * as blob from "@vercel/blob";

const hasBlobToken = !!process.env.BLOB_READ_WRITE_TOKEN;

if (!hasBlobToken) {
  console.warn(
    "[waterbnb] BLOB_READ_WRITE_TOKEN not configured — using in-memory storage. Data will not persist across restarts."
  );
}

// In-memory fallback
const memoryStore = new Map<string, { content: string; uploadedAt: Date }>();

/**
 * Read a JSON blob by pathname. Returns null if not found.
 */
export async function storeRead(pathname: string): Promise<string | null> {
  if (hasBlobToken) {
    try {
      const meta = await blob.head(pathname);
      const res = await fetch(meta.url);
      if (!res.ok) return null;
      return await res.text();
    } catch {
      return null;
    }
  }
  return memoryStore.get(pathname)?.content ?? null;
}

/**
 * Write a JSON blob to the given pathname.
 */
export async function storeWrite(
  pathname: string,
  body: string,
  options?: {
    cacheControlMaxAge?: number;
  }
): Promise<void> {
  if (hasBlobToken) {
    await blob.put(pathname, body, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
      ...options,
    });
    return;
  }
  memoryStore.set(pathname, { content: body, uploadedAt: new Date() });
}

/**
 * List blobs by prefix. Returns pathname, url, and uploadedAt for each match.
 */
export async function storeList(
  prefix: string,
  limit = 100
): Promise<{ pathname: string; url: string; uploadedAt: Date }[]> {
  if (hasBlobToken) {
    const result = await blob.list({ prefix, limit });
    return result.blobs.map((b) => ({
      pathname: b.pathname,
      url: b.url,
      uploadedAt: b.uploadedAt,
    }));
  }
  const entries: { pathname: string; url: string; uploadedAt: Date }[] = [];
  for (const [key, value] of memoryStore.entries()) {
    if (key.startsWith(prefix)) {
      entries.push({
        pathname: key,
        url: `memory://${key}`,
        uploadedAt: value.uploadedAt,
      });
    }
    if (entries.length >= limit) break;
  }
  return entries;
}
