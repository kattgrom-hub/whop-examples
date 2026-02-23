import { getServers } from "@/data/servers";
import DischordApp from "@/components/DischordApp";

export default function Home() {
  const servers = getServers();

  return <DischordApp servers={servers} />;
}
