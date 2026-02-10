import Whop from "@whop/sdk";

// Lazy-loaded server-side SDK instance (only use in server components/API routes)
let _whopApi: Whop | null = null;

export function getWhopApi(): Whop {
  if (!_whopApi) {
    if (!process.env.WHOP_API_KEY) {
      throw new Error("WHOP_API_KEY environment variable is required");
    }
    _whopApi = new Whop({
      apiKey: process.env.WHOP_API_KEY,
    });
  }
  return _whopApi;
}

