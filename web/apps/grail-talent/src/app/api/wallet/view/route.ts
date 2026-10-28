import { walletDocument } from "@whop-examples/auth/wallet-document";

export const dynamic = "force-dynamic";

export function GET() {
  return walletDocument();
}
