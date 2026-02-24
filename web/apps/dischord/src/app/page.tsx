import { fetchChannels } from "@/lib/channels";
import { fetchServers } from "@/lib/servers";
import DischordApp from "@/components/DischordApp";

export default async function Home() {
  const companyId = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID ?? "";
  const [channels, servers] = await Promise.all([
    companyId ? fetchChannels(companyId) : [],
    companyId ? fetchServers(companyId) : [],
  ]);

  return (
    <DischordApp
      parentCompanyId={companyId}
      initialServers={servers}
      initialChannels={channels}
    />
  );
}
