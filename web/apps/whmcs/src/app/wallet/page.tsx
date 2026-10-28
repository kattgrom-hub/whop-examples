import { auth, signIn } from "@/auth";
import { WalletBalance } from "@whop-examples/auth/wallet";

export const dynamic = "force-dynamic";

export default async function WalletPage() {
  const session = await auth();
  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: 32 }}>
      <a href="/">Home</a>
      <h1>Wallet balance</h1>
      {session?.user ? <WalletBalance /> : (
        <form action={async () => {
          "use server";
          await signIn("whop", { redirectTo: "/wallet" });
        }}>
          <p>Sign in with Whop to view your balance.</p>
          <button type="submit">Sign in with Whop</button>
        </form>
      )}
    </main>
  );
}
