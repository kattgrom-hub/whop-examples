import { fetchChannels } from "@/lib/channels";
import DischordApp from "@/components/DischordApp";

export default async function Home() {
  const companyId = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID ?? "";
  const channels = companyId ? await fetchChannels(companyId) : [];

  return <DischordApp companyId={companyId} channels={channels} />;
}
