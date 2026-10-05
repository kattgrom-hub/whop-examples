import { auth, signIn } from "@/auth";
import { WhopWallet } from "@/components/whop-wallet";

export const dynamic = "force-dynamic";

export default async function WalletPage() {
  if (process.env.WHOP_WALLET_ENABLED !== "true") {
    return <section className="mx-auto max-w-3xl px-6 py-16"><h1>Your Whop wallet</h1><p>Wallet access is awaiting authorized validation.</p></section>;
  }
  const session = await auth();
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-light tracking-wide text-primary">Your Whop wallet</h1>
      <p className="mt-3 mb-8 text-secondary">Manage money in your personal Whop account.</p>
      {session?.user ? <WhopWallet /> : (
        <form action={async () => { "use server"; await signIn("whop", { redirectTo: "/wallet" }); }}>
          <button className="rounded-sm bg-gold px-6 py-3 text-primary" type="submit">Sign in with Whop</button>
        </form>
      )}
    </section>
  );
}
