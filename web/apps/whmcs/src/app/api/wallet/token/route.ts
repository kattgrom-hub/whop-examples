import { auth } from "@/auth";
import { createWalletTokenResponse } from "@whop-examples/auth/wallet-server";

export async function GET() {
  return createWalletTokenResponse(await auth());
}
