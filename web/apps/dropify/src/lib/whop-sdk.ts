import "server-only";
import Whop from "@whop/sdk";
import { getWhopEnvironment } from "./checkout-config";

export function getWhopApi(): Whop {
  const environment = getWhopEnvironment();
  const apiKey = process.env.WHOP_API_KEY;
  if (!apiKey || apiKey.includes("xxxxx")) throw new Error("Configure the Whop API key for this environment");
  return new Whop({ apiKey,
    baseURL: environment === "sandbox" ? "https://sandbox-api.whop.com/api/v1" : "https://api.whop.com/api/v1",
    ...(process.env.WHOP_WEBHOOK_SECRET ? { webhookKey: Buffer.from(process.env.WHOP_WEBHOOK_SECRET).toString("base64") } : {}),
  });
}
