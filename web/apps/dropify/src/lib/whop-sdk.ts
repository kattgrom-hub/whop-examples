import Whop from "@whop/sdk";

let _whopApi: Whop | null = null;

export function getWhopApi(): Whop {
  if (!_whopApi) {
    if (!process.env.WHOP_API_KEY) {
      throw new Error(
        "WHOP_API_KEY environment variable is required. Copy .env.example to .env.local and add your API key from https://whop.com/developer"
      );
    }

    _whopApi = new Whop({
      apiKey: process.env.WHOP_API_KEY,
      ...(process.env.WHOP_WEBHOOK_SECRET
        ? {
            webhookKey: Buffer.from(
              process.env.WHOP_WEBHOOK_SECRET
            ).toString("base64"),
          }
        : {}),
    });
  }

  return _whopApi;
}
