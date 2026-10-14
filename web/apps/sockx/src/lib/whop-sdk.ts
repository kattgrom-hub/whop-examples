import Whop from "@whop/sdk";

let _whopApi: Whop | null = null;

export function getWhopApi(): Whop {
  if (!_whopApi) {
    if (!process.env.WHOP_API_KEY) {
      throw new Error("WHOP_API_KEY environment variable is required");
    }
    _whopApi = new Whop({
      baseURL: "https://api.whop.com/api/v1",
      defaultHeaders: { "Api-Version-Date": "2025-01-01" },
      apiKey: process.env.WHOP_API_KEY,
    });
  }
  return _whopApi;
}
